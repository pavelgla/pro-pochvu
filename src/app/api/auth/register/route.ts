import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const body = schema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.issues }, { status: 400 });
  }

  const { name, email, password } = body.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { error: "Пользователь с таким email уже зарегистрирован" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const referralCode = crypto.randomUUID().slice(0, 8).toUpperCase();

  const user = await prisma.user.create({
    data: { name, email, passwordHash, referralCode, role: "customer" },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
