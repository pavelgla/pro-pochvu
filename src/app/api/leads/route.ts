import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT  = process.env.TELEGRAM_CHAT_ID;

async function sendTelegram(text: string) {
  if (!TG_TOKEN || !TG_CHAT) return;
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: "HTML" }),
  }).catch(() => {});
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, birthdate, email, phone, productSlug, marketplace } = body as {
    name: string; birthdate: string; email: string; phone: string;
    productSlug: string; marketplace: "wb" | "ozon";
  };

  if (!name || !email || !phone || !productSlug || !marketplace) {
    return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
  }

  await prisma.lead.create({
    data: { name, birthdate: birthdate || "", email, phone, productSlug, marketplace },
  });

  const mp = marketplace === "wb" ? "Wildberries" : "Ozon";
  await sendTelegram(
    `🛒 <b>Новый лид — сайт Экоконь</b>\n\n` +
    `👤 ${name}\n` +
    `🎂 ${birthdate || "не указано"}\n` +
    `📧 ${email}\n` +
    `📱 ${phone}\n` +
    `📦 Товар: <code>${productSlug}</code>\n` +
    `🏪 Маркетплейс: ${mp}`
  );

  return NextResponse.json({ ok: true });
}
