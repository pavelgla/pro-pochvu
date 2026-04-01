import { NextRequest, NextResponse } from "next/server";
import { isYooKassaIp } from "@/lib/yookassa";
import { prisma } from "@/lib/prisma";
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
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: "paid", paymentStatus: "succeeded" },
        include: { items: true },
      });

      const items = order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price }));

      // Send notifications (fire-and-forget)
      Promise.allSettled([
        notifyNewOrder({
          id: order.id,
          order_number: order.orderNumber,
          total: order.total,
          delivery_cost: order.deliveryCost,
          delivery_provider: order.deliveryProvider,
          delivery_address: order.deliveryAddress as Record<string, string> | null,
          delivery_track: order.deliveryTrack,
          delivery_status: order.deliveryStatus,
          payment_method: order.paymentMethod || "bank_card",
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          items,
        }),
        sendOrderConfirmation({
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
          items,
        }),
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
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "cancelled", paymentStatus: "cancelled" },
      });

      console.log(`Payment canceled for order ${orderId}, payment ${payment.id}`);
      break;
    }

    case "payment.waiting_for_capture": {
      console.log(`Payment waiting_for_capture for order ${orderId}`);
      break;
    }
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ ok: true });
}
