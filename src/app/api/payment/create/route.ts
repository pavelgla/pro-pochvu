import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPayment } from "@/lib/yookassa";
import { prisma } from "@/lib/prisma";
import type { PaymentMethod } from "@/types/yookassa";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const body = await req.json();
  const { orderId, paymentMethod, ymClientId } = body as {
    orderId: string;
    paymentMethod?: PaymentMethod;
    ymClientId?: string;
  };

  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      total: true,
      status: true,
      userId: true,
      orderNumber: true,
      customerEmail: true,
      customerPhone: true,
      deliveryCost: true,
      items: { select: { name: true, price: true, quantity: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Retry-payment endpoint for logged-in customers only: guest orders get their
  // payment created inside /api/orders/create and cannot be re-paid here.
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId || order.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (order.status !== "pending") {
    return NextResponse.json(
      { error: "Order is not in pending state" },
      { status: 400 }
    );
  }

  try {
    const { paymentId, confirmationUrl } = await createPayment({
      orderId,
      orderNumber: order.orderNumber,
      total: order.total,
      items: order.items,
      deliveryCost: order.deliveryCost,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      paymentMethod,
      ymClientId,
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
