import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/lib/yookassa";
import { prisma } from "@/lib/prisma";
import type { PaymentMethod } from "@/types/yookassa";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    orderId,
    orderNumber,
    total,
    items,
    deliveryCost,
    customerEmail,
    customerPhone,
    paymentMethod,
  } = body as {
    orderId: string;
    orderNumber: number;
    total: number;
    items: { name: string; price: number; quantity: number }[];
    deliveryCost: number;
    customerEmail: string;
    customerPhone?: string;
    paymentMethod?: PaymentMethod;
  };

  if (!orderId || !total || !items?.length || !customerEmail) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const { paymentId, confirmationUrl } = await createPayment({
      orderId,
      orderNumber,
      total,
      items,
      deliveryCost: deliveryCost || 0,
      customerEmail,
      customerPhone,
      paymentMethod,
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentId },
    });

    return NextResponse.json({ paymentId, confirmationUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
