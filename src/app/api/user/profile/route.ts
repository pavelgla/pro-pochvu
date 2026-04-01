import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: {
      id: true, name: true, email: true, phone: true,
      addresses: true, loyaltyPoints: true, referralCode: true, role: true,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone, addresses } = body;

  const user = await prisma.user.update({
    where: { id: (session.user as any).id },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(addresses !== undefined && { addresses }),
    },
    select: {
      id: true, name: true, email: true, phone: true,
      addresses: true, loyaltyPoints: true, referralCode: true, role: true,
    },
  });

  return NextResponse.json(user);
}
