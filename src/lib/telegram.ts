const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ecokon.ru";

function isMockMode() {
  return !BOT_TOKEN || !ADMIN_CHAT_ID;
}

type SendMessageOptions = {
  chatId?: string;
  text: string;
  parseMode?: "HTML" | "Markdown";
};

async function sendMessage({ chatId, text, parseMode = "HTML" }: SendMessageOptions) {
  const targetChat = chatId || ADMIN_CHAT_ID;

  if (isMockMode()) {
    console.log(`[Telegram mock] → ${targetChat}:\n${text}`);
    return { ok: true, mock: true };
  }

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: targetChat,
      text,
      parse_mode: parseMode,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Telegram API error: ${err}`);
    return { ok: false, error: err };
  }

  return { ok: true };
}

// =============================================
// Order data types
// =============================================

type OrderForNotification = {
  id: string;
  order_number: number;
  total: number;
  delivery_cost: number;
  delivery_provider: string | null;
  delivery_address: Record<string, string> | null;
  delivery_track: string | null;
  delivery_status: string | null;
  payment_method: string | null;
  customer_name: string;
  customer_phone: string;
  items: { name: string; quantity: number; price: number }[];
};

// =============================================
// Templates
// =============================================

function formatPrice(n: number) {
  return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function newOrderMessage(order: OrderForNotification): string {
  const items = order.items
    .map((i) => `  • ${escapeHtml(i.name)} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`)
    .join("\n");

  const addr = order.delivery_address;
  const addressLine = addr
    ? [addr.city, addr.street, addr.house, addr.apartment].filter(Boolean).join(", ")
    : "Не указан";

  return [
    `🎉 <b>Новый заказ #${order.order_number}!</b>`,
    "",
    `💰 Сумма: <b>${formatPrice(order.total)}</b>`,
    `📍 ${order.delivery_provider || "СД"} — ${escapeHtml(addressLine)}`,
    "",
    `📦 Товары:`,
    items,
    "",
    `💳 Оплата: ${order.payment_method || "Банковская карта"}`,
    `👤 ${escapeHtml(order.customer_name)} ${order.customer_phone}`,
    "",
    `🔗 <a href="${SITE_URL}/admin/orders/${order.id}">Открыть заказ</a>`,
  ].join("\n");
}

export function statusChangeMessage(order: OrderForNotification): string {
  const trackLine = order.delivery_track
    ? `\n🚚 Трек: <code>${escapeHtml(order.delivery_track)}</code>`
    : "";

  return [
    `📋 <b>Заказ #${order.order_number}</b>`,
    "",
    `Новый статус: <b>${order.delivery_status || order.delivery_provider || "обновлён"}</b>`,
    trackLine,
  ]
    .filter(Boolean)
    .join("\n");
}

// =============================================
// Public API
// =============================================

export async function notifyNewOrder(order: OrderForNotification) {
  return sendMessage({ text: newOrderMessage(order) });
}

export async function notifyStatusChange(order: OrderForNotification) {
  return sendMessage({ text: statusChangeMessage(order) });
}

export type { OrderForNotification };
