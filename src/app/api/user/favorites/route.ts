import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      product: {
        include: { productLine: true },
      },
    },
  });

  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { productId } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: "removed" });
  }

  const favorite = await prisma.favorite.create({
    data: { userId, productId },
  });

  return NextResponse.json({ action: "added", favorite }, { status: 201 });
}
