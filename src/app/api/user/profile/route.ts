import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSelect = {
  id: true, name: true, email: true, phone: true, image: true,
  addresses: true, loyaltyPoints: true, referralCode: true, role: true,
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: profileSelect,
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
        email: (session.user as any).email ?? "",
        name: session.user.name ?? null,
        referralCode: crypto.randomUUID().slice(0, 8).toUpperCase(),
      },
      select: profileSelect,
    });
  }

  return NextResponse.json(user);
}

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional(),
  addresses: z.array(z.any()).optional(),
});

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = updateSchema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.issues }, { status: 400 });
  }

  const { name, phone, addresses } = body.data;

  const user = await prisma.user.update({
    where: { id: (session.user as any).id },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(addresses !== undefined && { addresses }),
    },
    select: profileSelect,
  });

  return NextResponse.json(user);
}
