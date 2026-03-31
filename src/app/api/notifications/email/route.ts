import { NextRequest, NextResponse } from "next/server";
import {
  sendOrderConfirmation,
  sendShippingNotification,
  sendDeliveryConfirmation,
} from "@/lib/email";
import type { OrderForEmail } from "@/lib/email";

// Mock order loader (replace with Supabase when connected)
async function loadOrder(orderId: string): Promise<OrderForEmail | null> {
  // TODO: replace with real Supabase query
  return {
    id: orderId,
    order_number: 100044,
    total: 1863,
    subtotal: 1863,
    delivery_cost: 0,
    discount: 0,
    delivery_provider: "СДЭК",
    delivery_address: { city: "Москва", street: "ул. Ленина", house: "10" },
    delivery_track: null,
    customer_name: "Тестовый Клиент",
    customer_email: "test@example.com",
    items: [
      { name: "Био-чай Универсальный с янтарём", quantity: 2, price: 626 },
      { name: "Био-чай Для орхидей", quantity: 1, price: 611 },
    ],
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
      case "confirmation":
        result = await sendOrderConfirmation(order);
        break;
      case "shipping":
        result = await sendShippingNotification(order);
        break;
      case "delivery":
        result = await sendDeliveryConfirmation(order);
        break;
      default:
        return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Email notification error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
