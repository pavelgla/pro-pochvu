import { NextRequest, NextResponse } from "next/server";
import { notifyStatusChange } from "@/lib/telegram";
import { sendShippingNotification, sendDeliveryConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderId, status, trackNumber } = body;

  console.log("ApiShip webhook:", JSON.stringify(body));

  // TODO: update order delivery_status in Supabase
  // await supabase.from('orders').update({
  //   delivery_status: status,
  //   delivery_track: trackNumber,
  // }).eq('id', orderId)

  // TODO: load real order from Supabase when connected
  if (!orderId) {
    return NextResponse.json({ ok: true });
  }

  const mockOrder = {
    id: orderId,
    order_number: 0,
    total: 0,
    subtotal: 0,
    delivery_cost: 0,
    discount: 0,
    delivery_provider: null as string | null,
    delivery_address: null as Record<string, string> | null,
    delivery_track: trackNumber || null,
    delivery_status: status || null,
    payment_method: null as string | null,
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    items: [] as { name: string; quantity: number; price: number }[],
  };

  try {
    if (status === "shipped" || status === "in_transit") {
      await Promise.allSettled([
        notifyStatusChange(mockOrder),
        sendShippingNotification(mockOrder),
      ]);
    } else if (status === "delivered") {
      await Promise.allSettled([
        notifyStatusChange(mockOrder),
        sendDeliveryConfirmation(mockOrder),
      ]);
    } else {
      // Other statuses — just notify admin
      await notifyStatusChange(mockOrder);
    }
  } catch (err) {
    console.error("Delivery notification error:", err);
  }

  return NextResponse.json({ ok: true });
}
