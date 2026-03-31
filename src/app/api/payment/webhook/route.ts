import { NextRequest, NextResponse } from "next/server";
import { isYooKassaIp } from "@/lib/yookassa";
import type { WebhookEvent } from "@/types/yookassa";
import { notifyNewOrder } from "@/lib/telegram";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  // IP whitelist check
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "";

  if (!isYooKassaIp(ip)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const event: WebhookEvent = await req.json();
  const payment = event.object;
  const orderId = payment.metadata?.order_id;

  if (!orderId) {
    return NextResponse.json({ ok: true });
  }

  switch (event.event) {
    case "payment.succeeded": {
      // TODO: update order in Supabase
      // await supabase.from('orders').update({
      //   status: 'paid',
      //   payment_status: 'succeeded',
      // }).eq('id', orderId)

      // TODO: create delivery order via ApiShip
      // const order = await supabase.from('orders').select().eq('id', orderId).single()
      // await createOrder(order.delivery_provider, order.delivery_tariff_id, {...})

      // Send notifications (fire-and-forget, don't block webhook response)
      // TODO: load real order from Supabase when connected
      const mockOrder = {
        id: orderId,
        order_number: Number(payment.metadata?.order_number) || 0,
        total: Number(payment.amount?.value) || 0,
        subtotal: Number(payment.amount?.value) || 0,
        delivery_cost: 0,
        discount: 0,
        delivery_provider: null as string | null,
        delivery_address: null as Record<string, string> | null,
        delivery_track: null as string | null,
        delivery_status: null as string | null,
        payment_method: "bank_card",
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        items: [] as { name: string; quantity: number; price: number }[],
      };

      Promise.allSettled([
        notifyNewOrder(mockOrder),
        sendOrderConfirmation(mockOrder),
      ]).then((results) => {
        for (const r of results) {
          if (r.status === "rejected") {
            console.error("Notification failed:", r.reason);
          }
        }
      });

      console.log(`Payment succeeded for order ${orderId}, payment ${payment.id}`);
      break;
    }

    case "payment.canceled": {
      // TODO: update order in Supabase
      // await supabase.from('orders').update({
      //   status: 'cancelled',
      //   payment_status: 'cancelled',
      // }).eq('id', orderId)

      console.log(`Payment canceled for order ${orderId}, payment ${payment.id}`);
      break;
    }

    case "payment.waiting_for_capture": {
      // Auto-capture is enabled (capture: true), this shouldn't happen
      console.log(`Payment waiting_for_capture for order ${orderId}`);
      break;
    }
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ ok: true });
}
