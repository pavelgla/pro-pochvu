import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { token, platform } = await req.json();

  if (!token || !platform) {
    return NextResponse.json({ error: "token and platform required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { pushTokens: true },
  });

  const tokens = (user?.pushTokens as { token: string; platform: string }[]) ?? [];

  if (tokens.some((t) => t.token === token)) {
    return NextResponse.json({ ok: true });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { pushTokens: [...tokens, { token, platform }] },
  });

  return NextResponse.json({ ok: true });
}
