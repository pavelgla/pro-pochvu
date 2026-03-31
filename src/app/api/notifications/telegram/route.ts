import { NextRequest, NextResponse } from "next/server";
import { notifyNewOrder, notifyStatusChange } from "@/lib/telegram";
import type { OrderForNotification } from "@/lib/telegram";

// Mock order loader (replace with Supabase when connected)
async function loadOrder(orderId: string): Promise<OrderForNotification | null> {
  // TODO: replace with real Supabase query
  // const { data } = await supabase
  //   .from('orders')
  //   .select('*, order_items(*)')
  //   .eq('id', orderId)
  //   .single();

  return {
    id: orderId,
    order_number: 100044,
    total: 1863,
    delivery_cost: 0,
    delivery_provider: "СДЭК",
    delivery_address: { city: "Москва", street: "ул. Ленина", house: "10" },
    delivery_track: null,
    delivery_status: null,
    payment_method: "Банковская карта",
    customer_name: "Тестовый Клиент",
    customer_phone: "+7 999 000-00-00",
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
