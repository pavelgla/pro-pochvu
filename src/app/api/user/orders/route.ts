import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  const orderSelect = {
    id: true, orderNumber: true, status: true, total: true, subtotal: true,
    deliveryCost: true, discount: true, deliveryProvider: true, deliveryMethod: true,
    deliveryTrack: true, deliveryStatus: true, paymentMethod: true, paymentStatus: true,
    customerName: true, customerEmail: true, customerPhone: true, createdAt: true, updatedAt: true,
    deliveryAddress: true,
    items: {
      select: {
        id: true, productId: true, variantId: true, quantity: true, price: true, name: true, image: true,
        product: { select: { slug: true, weightGrams: true, productLine: { select: { brand: true } } } },
      },
    },
  };

  if (orderId) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      select: orderSelect,
    });
    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    select: orderSelect,
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(orders);
}
