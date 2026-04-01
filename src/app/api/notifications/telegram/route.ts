import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewOrder, notifyStatusChange } from "@/lib/telegram";
import type { OrderForNotification } from "@/lib/telegram";

async function loadOrder(orderId: string): Promise<OrderForNotification | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) return null;

  return {
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
}

export async function POST(req: NextRequest) {
  try {
    const { type, orderId } = await req.json();

    if (!type || !orderId) {
      return NextResponse.json({ error: "type and orderId required" }, { status: 400 });
    }

    const order = await loadOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let result;
    switch (type) {
      case "new_order":
        result = await notifyNewOrder(order);
        break;
      case "status_change":
        result = await notifyStatusChange(order);
        break;
      default:
        return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Telegram notification error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
