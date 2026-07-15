import { NextRequest, NextResponse } from "next/server";
import { isYooKassaIp } from "@/lib/yookassa";
import { prisma } from "@/lib/prisma";
import type { WebhookEvent } from "@/types/yookassa";
import { notifyNewOrder } from "@/lib/telegram";
import { sendOrderConfirmation } from "@/lib/email";
import { pushPurchaseToMetrika } from "@/lib/analytics-server";

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
      // Idempotency: YooKassa retries webhooks — only the first one for this
      // order updates state and triggers notifications.
      const updated = await prisma.order.updateMany({
        where: { id: orderId, paymentStatus: { not: "succeeded" } },
        data: { status: "paid", paymentStatus: "succeeded" },
      });
      if (updated.count === 0) {
        console.log("[payment/webhook] duplicate succeeded ignored", { orderId });
        break;
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order) break;

      const items = order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price }));
      const ymClientId = payment.metadata?.ym_client_id;

      // Send notifications + offline conversion (fire-and-forget)
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
        pushPurchaseToMetrika({
          orderId: order.id,
          ymClientId: ymClientId ?? "",
          total: order.total,
          paidAt: new Date(),
        }),
      ]).then((results) => {
        for (const r of results) {
          if (r.status === "rejected") {
            console.error("[payment/webhook] task failed:", r.reason);
          }
        }
      });

      console.log("[payment/webhook] succeeded", {
        orderId,
        hasYmClientId: Boolean(ymClientId),
      });
      break;
    }

    case "payment.canceled": {
      // Never cancel an already paid order; ignore duplicate cancellations
      await prisma.order.updateMany({
        where: { id: orderId, paymentStatus: { notIn: ["succeeded", "cancelled"] } },
        data: { status: "cancelled", paymentStatus: "cancelled" },
      });

      console.log("[payment/webhook] canceled", { orderId });
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
