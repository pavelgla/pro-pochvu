import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyStatusChange } from "@/lib/telegram";
import { sendShippingNotification, sendDeliveryConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderId, status, trackNumber } = body;

  console.log("ApiShip webhook:", JSON.stringify(body));

  if (!orderId) {
    return NextResponse.json({ ok: true });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      deliveryStatus: status,
      deliveryTrack: trackNumber,
    },
    include: { items: true },
  });

  const telegramOrder = {
    id: order.id,
    order_number: order.orderNumber,
    total: order.total,
    delivery_cost: order.deliveryCost,
    delivery_provider: order.deliveryProvider,
    delivery_address: order.deliveryAddress as Record<string, string> | null,
    delivery_track: order.deliveryTrack,
    delivery_status: order.deliveryStatus,
    payment_method: order.paymentMethod,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
  };

  const emailOrder = {
    id: order.id,
    order_number: order.orderNumber,
    total: order.total,
    subtotal: order.subtotal,
    delivery_cost: order.deliveryCost,
    discount: order.discount,
    delivery_provider: order.deliveryProvider,
    delivery_address: order.deliveryAddress as Record<string, string> | null,
    delivery_track: order.deliveryTrack,
    customer_name: order.customerName,
    customer_email: order.customerEmail,
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
  };

  try {
    if (status === "shipped" || status === "in_transit") {
      await Promise.allSettled([
        notifyStatusChange(telegramOrder),
        sendShippingNotification(emailOrder),
      ]);
    } else if (status === "delivered") {
      await Promise.allSettled([
        notifyStatusChange(telegramOrder),
        sendDeliveryConfirmation(emailOrder),
      ]);
    } else {
      await notifyStatusChange(telegramOrder);
    }
  } catch (err) {
    console.error("Delivery notification error:", err);
  }

  return NextResponse.json({ ok: true });
}
