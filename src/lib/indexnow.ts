/**
 * IndexNow API client.
 * Pings Yandex/Bing about new or updated URLs to speed up indexing.
 *
 * Spec: https://www.indexnow.org/documentation
 *
 * Requirements:
 * - INDEXNOW_KEY env var (8–128 chars, hex/alphanum)
 * - Verification file served at https://pro-pochvu.ru/{KEY}.txt
 *   (handled by middleware → /api/indexnow/verify)
 */

const SITE_HOST = "pro-pochvu.ru";
const SITE_URL = `https://${SITE_HOST}`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// Max URLs per batch per spec.
const MAX_BATCH_SIZE = 10000;

export type IndexNowResult = {
  ok: boolean;
  status: number;
  submitted: number;
  message?: string;
};

/**
 * Submit a batch of URLs to IndexNow.
 * Returns ok=true on 200/202, ok=false on errors.
 * Never throws — intended to be called fire-and-forget from API routes.
 */
export async function pingIndexNow(urls: string[]): Promise<IndexNowResult> {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    return {
      ok: false,
      status: 0,
      submitted: 0,
      message: "INDEXNOW_KEY is not set",
    };
  }

  const cleaned = urls
    .map((u) => u.trim())
    .filter(Boolean)
    .filter((u) => u.startsWith(SITE_URL));

  if (cleaned.length === 0) {
    return {
      ok: false,
      status: 0,
      submitted: 0,
      message: "No valid URLs",
    };
  }

  if (cleaned.length > MAX_BATCH_SIZE) {
    return {
      ok: false,
      status: 0,
      submitted: 0,
      message: `Batch too large (${cleaned.length} > ${MAX_BATCH_SIZE})`,
    };
  }

  const body = {
    host: SITE_HOST,
    key,
    keyLocation: `${SITE_URL}/${key}.txt`,
    urlList: cleaned,
  };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    });

    return {
      ok: res.status === 200 || res.status === 202,
      status: res.status,
      submitted: cleaned.length,
      message: res.ok ? undefined : await safeText(res),
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      submitted: 0,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Submit URLs in chunks of MAX_BATCH_SIZE.
 * Useful for the initial bulk warm-up after launch.
 */
export async function pingIndexNowBulk(
  urls: string[]
): Promise<IndexNowResult[]> {
  const results: IndexNowResult[] = [];
  for (let i = 0; i < urls.length; i += MAX_BATCH_SIZE) {
    const chunk = urls.slice(i, i + MAX_BATCH_SIZE);
    results.push(await pingIndexNow(chunk));
  }
  return results;
}

/**
 * Convenience: ping a single URL, fire-and-forget.
 * Logs failures to console but never throws.
 */
export function pingIndexNowAsync(urls: string[]): void {
  pingIndexNow(urls)
    .then((res) => {
      if (!res.ok) {
        console.warn("[indexnow] failed:", res);
      } else {
        console.log(`[indexnow] submitted ${res.submitted} URL(s)`);
      }
    })
    .catch((err) => {
      console.error("[indexnow] error:", err);
    });
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

export const indexNowConfig = {
  SITE_HOST,
  SITE_URL,
  ENDPOINT: INDEXNOW_ENDPOINT,
  MAX_BATCH_SIZE,
};
