const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "shop@pro-pochvu.ru";
const FROM_NAME = process.env.EMAIL_FROM_NAME || "Эко Конь | Цветология";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pro-pochvu.ru";

function isMockMode() {
  return !BREVO_API_KEY;
}

type SendEmailOptions = {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
};

async function sendTransactional({ to, toName, subject, htmlContent }: SendEmailOptions) {
  if (isMockMode()) {
    console.log(`[Email mock] → ${to}: ${subject}`);
    return { ok: true, mock: true };
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY!,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to, name: toName || to }],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Brevo API error: ${err}`);
    return { ok: false, error: err };
  }

  return { ok: true };
}

// =============================================
// Order types
// =============================================

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderForEmail = {
  id: string;
  order_number: number;
  total: number;
  subtotal: number;
  delivery_cost: number;
  discount: number;
  delivery_provider: string | null;
  delivery_address: Record<string, string> | null;
  delivery_track: string | null;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
};

// =============================================
// Shared layout
// =============================================

function wrapLayout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:24px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:100%">
  <!-- Header -->
  <tr><td style="background:#2D5016;padding:24px 32px;text-align:center">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">Эко Конь | Цветология</h1>
  </td></tr>
  <!-- Body -->
  <tr><td style="padding:32px">
    ${body}
  </td></tr>
  <!-- Footer -->
  <tr><td style="padding:16px 32px;background:#f5f3ef;text-align:center;font-size:12px;color:#888">
    <a href="${SITE_URL}" style="color:#2D5016;text-decoration:none">pro-pochvu.ru</a> — органические удобрения и фитомодули
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
}

function itemsTable(items: OrderItem[], order: OrderForEmail) {
  const rows = items
    .map(
      (i) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">${formatPrice(i.price * i.quantity)}</td>
      </tr>`
    )
    .join("");

  const discountRow =
    order.discount > 0
      ? `<tr><td colspan="2" style="padding:4px 0;text-align:right;color:#888">Скидка</td><td style="padding:4px 0;text-align:right;color:#e53e3e">−${formatPrice(order.discount)}</td></tr>`
      : "";

  const deliveryRow =
    order.delivery_cost > 0
      ? `<tr><td colspan="2" style="padding:4px 0;text-align:right;color:#888">Доставка</td><td style="padding:4px 0;text-align:right">${formatPrice(order.delivery_cost)}</td></tr>`
      : `<tr><td colspan="2" style="padding:4px 0;text-align:right;color:#888">Доставка</td><td style="padding:4px 0;text-align:right;color:#2D5016">Бесплатно</td></tr>`;

  return `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
    <tr style="font-weight:600;color:#888;font-size:12px;text-transform:uppercase">
      <td style="padding:0 0 8px">Товар</td>
      <td style="padding:0 12px 8px;text-align:center">Кол-во</td>
      <td style="padding:0 0 8px;text-align:right">Сумма</td>
    </tr>
    ${rows}
    ${discountRow}
    ${deliveryRow}
    <tr><td colspan="2" style="padding:12px 0 0;text-align:right;font-weight:700;font-size:16px">Итого</td><td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:16px">${formatPrice(order.total)}</td></tr>
  </table>`;
}

// =============================================
// Email templates
// =============================================

export function orderConfirmationHtml(order: OrderForEmail): string {
  const addr = order.delivery_address;
  const addressLine = addr
    ? [addr.city, addr.street, addr.house, addr.apartment].filter(Boolean).join(", ")
    : "";

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#2D5016">Спасибо за заказ!</h2>
    <p style="margin:0 0 24px;color:#555;font-size:14px">Заказ <strong>#${order.order_number}</strong> успешно оформлен и оплачен.</p>
    ${itemsTable(order.items, order)}
    ${addressLine ? `<p style="margin:24px 0 0;font-size:13px;color:#888">📍 Доставка: ${order.delivery_provider || ""} — ${addressLine}</p>` : ""}
    <p style="margin:24px 0 0;text-align:center">
      <a href="${SITE_URL}/order/${order.id}" style="display:inline-block;background:#2D5016;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Отследить заказ</a>
    </p>`;

  return wrapLayout(`Заказ #${order.order_number}`, body);
}

export function shippingNotificationHtml(order: OrderForEmail): string {
  const trackUrl = order.delivery_track
    ? getTrackingUrl(order.delivery_provider, order.delivery_track)
    : null;

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#2D5016">Заказ отправлен! 🚚</h2>
    <p style="margin:0 0 16px;color:#555;font-size:14px">Заказ <strong>#${order.order_number}</strong> передан в службу доставки.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;border-radius:8px;padding:16px;font-size:14px">
      <tr><td style="padding:4px 0;color:#888">Служба доставки</td><td style="padding:4px 0;text-align:right;font-weight:600">${order.delivery_provider || "—"}</td></tr>
      ${order.delivery_track ? `<tr><td style="padding:4px 0;color:#888">Трек-номер</td><td style="padding:4px 0;text-align:right;font-weight:600;font-family:monospace">${order.delivery_track}</td></tr>` : ""}
      <tr><td style="padding:4px 0;color:#888">Ориентировочный срок</td><td style="padding:4px 0;text-align:right;font-weight:600">2–5 рабочих дней</td></tr>
    </table>
    <p style="margin:24px 0 0;text-align:center">
      <a href="${trackUrl || `${SITE_URL}/order/${order.id}`}" style="display:inline-block;background:#2D5016;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Отследить посылку</a>
    </p>`;

  return wrapLayout(`Заказ #${order.order_number} отправлен`, body);
}

export function deliveryConfirmationHtml(order: OrderForEmail): string {
  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#2D5016">Заказ доставлен! 🎉</h2>
    <p style="margin:0 0 16px;color:#555;font-size:14px">Заказ <strong>#${order.order_number}</strong> успешно доставлен.</p>
    <p style="margin:0 0 24px;color:#555;font-size:14px">Надеемся, что вам всё понравится! Будем рады, если вы оставите отзыв.</p>
    <p style="margin:0;text-align:center">
      <a href="${SITE_URL}/account/orders" style="display:inline-block;background:#2D5016;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Оставить отзыв</a>
    </p>`;

  return wrapLayout(`Заказ #${order.order_number} доставлен`, body);
}

// =============================================
// Tracking URLs by provider
// =============================================

function getTrackingUrl(provider: string | null, track: string): string {
  switch (provider?.toLowerCase()) {
    case "сдэк":
    case "cdek":
      return `https://www.cdek.ru/ru/tracking?order_id=${track}`;
    case "5post":
    case "fivepost":
      return `https://fivepost.ru/tracking/${track}`;
    case "boxberry":
      return `https://boxberry.ru/tracking-page?id=${track}`;
    case "почта россии":
    case "pochta":
      return `https://www.pochta.ru/tracking#${track}`;
    default:
      return `${SITE_URL}/order/${track}`;
  }
}

// =============================================
// Public API
// =============================================

export async function sendOrderConfirmation(order: OrderForEmail) {
  return sendTransactional({
    to: order.customer_email,
    toName: order.customer_name,
    subject: `Заказ #${order.order_number} оформлен — Эко Конь`,
    htmlContent: orderConfirmationHtml(order),
  });
}

export async function sendShippingNotification(order: OrderForEmail) {
  return sendTransactional({
    to: order.customer_email,
    toName: order.customer_name,
    subject: `Заказ #${order.order_number} отправлен 🚚`,
    htmlContent: shippingNotificationHtml(order),
  });
}

export async function sendDeliveryConfirmation(order: OrderForEmail) {
  return sendTransactional({
    to: order.customer_email,
    toName: order.customer_name,
    subject: `Заказ #${order.order_number} доставлен 🎉`,
    htmlContent: deliveryConfirmationHtml(order),
  });
}

export { getTrackingUrl };
export type { OrderForEmail };
