/**
 * Server-side Yandex Metrika offline conversions.
 *
 * Used as a fallback channel for the `purchase` goal: even if the visitor
 * blocks Metrika or never lands on /order/[id]?payment=success after paying
 * (e.g. closes the tab on YooKassa), we still attribute the revenue.
 *
 * Requires three things:
 *   - NEXT_PUBLIC_METRIKA_ID    — counter id (already used client-side)
 *   - YANDEX_OAUTH_TOKEN        — OAuth token with Metrika edit scope
 *   - ymClientId per order      — collected from `_ym_uid` cookie at checkout,
 *                                 stored in YooKassa payment metadata
 *
 * If any of these are missing the function logs a warning and no-ops, so the
 * webhook flow keeps working without offline conversions configured.
 *
 * Docs: https://yandex.ru/dev/metrika/ru/management/openapi/offline_conversion/
 */

const COUNTER_ID = process.env.NEXT_PUBLIC_METRIKA_ID;
const OAUTH_TOKEN = process.env.YANDEX_OAUTH_TOKEN;

const API_BASE = "https://api-metrika.yandex.net/management/v1";

type OfflinePurchase = {
  /** Internal order id (used as transaction id for dedup on Metrika side). */
  orderId: string;
  /** `_ym_uid` cookie of the visitor who placed the order. */
  ymClientId: string;
  /** Order revenue in RUB. */
  total: number;
  /** ISO timestamp when the order was paid. */
  paidAt: Date;
  /** Goal name configured in the Metrika UI. */
  goal?: string;
};

function escapeCsvField(value: string | number): string {
  const s = String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Push a single `purchase` offline conversion to Yandex Metrika.
 * Fire-and-forget — caller should not await unless retry/observability is desired.
 *
 * Returns `{ ok: true }` on success, `{ ok: false, reason }` on skip/failure.
 */
export async function pushPurchaseToMetrika(
  data: OfflinePurchase
): Promise<{ ok: boolean; reason?: string }> {
  if (!COUNTER_ID) {
    return { ok: false, reason: "NEXT_PUBLIC_METRIKA_ID not set" };
  }
  if (!OAUTH_TOKEN) {
    return { ok: false, reason: "YANDEX_OAUTH_TOKEN not set" };
  }
  if (!data.ymClientId) {
    return { ok: false, reason: "ymClientId missing — visitor had no _ym_uid cookie" };
  }

  const goal = data.goal ?? "purchase";
  const timestamp = Math.floor(data.paidAt.getTime() / 1000);

  // CSV header + single row. UserId rows could be used instead of ClientId
  // when authenticating users; keep ClientId for guest checkouts.
  const csv = [
    "ClientId,Target,DateTime,Price,Currency",
    [
      escapeCsvField(data.ymClientId),
      escapeCsvField(goal),
      escapeCsvField(timestamp),
      escapeCsvField(data.total.toFixed(2)),
      "RUB",
    ].join(","),
  ].join("\n");

  const url = `${API_BASE}/counter/${COUNTER_ID}/offline_conversions/upload?client_id_type=CLIENT_ID`;

  try {
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([csv], { type: "text/csv" }),
      `purchase-${data.orderId}.csv`
    );

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `OAuth ${OAUTH_TOKEN}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const body = await res.text();
      console.warn(
        `[analytics-server] Metrika offline conversion upload failed (${res.status}):`,
        body
      );
      return { ok: false, reason: `HTTP ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn("[analytics-server] Metrika upload threw:", reason);
    return { ok: false, reason };
  }
}
