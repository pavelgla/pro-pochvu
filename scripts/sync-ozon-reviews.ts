import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ozon product ID → product slug
// IDs taken from Ozon product URLs: /product/...XXXXXXX/
const OZON_PRODUCT_MAP: Record<string, string> = {
  "2825417652": "kolyshki-skoby-silikon",
  "2209878912": "fitomodul-15-6",
  "1856412162": "fitomodul-50-4-white",
  "2081828814": "fitomodul-50-4-black",
  "2439041908": "fitomodul-50-4-green",
};

const OZON_CLIENT_ID = process.env.OZON_CLIENT_ID ?? "";
const OZON_API_KEY = process.env.OZON_API_KEY ?? "";

interface OzonReview {
  id: string;
  sku: number;
  status: string;
  created_at: string;
  updated_at: string;
  reviewer_name?: string;
  text?: string;
  rating: number;
  is_verified_purchase?: boolean;
}

interface OzonReviewListResponse {
  reviews?: OzonReview[];
  items?: OzonReview[];
  total?: number;
}

async function fetchOzonReviews(productId: string, page = 1, pageSize = 100): Promise<OzonReview[]> {
  const url = "https://api-seller.ozon.ru/v1/review/list";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Client-Id": OZON_CLIENT_ID,
        "Api-Key": OZON_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sku: parseInt(productId),
        sort_dir: "DESC",
        page,
        page_size: pageSize,
      }),
    });

    if (res.status === 401 || res.status === 403) {
      console.error(`[OZON] Ошибка авторизации. Проверь OZON_CLIENT_ID и OZON_API_KEY`);
      return [];
    }
    if (!res.ok) {
      const text = await res.text();
      console.warn(`[OZON] productId=${productId} HTTP ${res.status}: ${text.slice(0, 200)}`);
      return [];
    }

    const data = (await res.json()) as OzonReviewListResponse;
    return data.reviews ?? data.items ?? [];
  } catch (err) {
    console.error(`[OZON] productId=${productId} fetch error:`, err);
    return [];
  }
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function syncProduct(productId: string, slug: string) {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    console.warn(`[SKIP] Товар не найден: slug=${slug}`);
    return;
  }

  const reviews = await fetchOzonReviews(productId);
  console.log(`[OZON] productId=${productId} (${slug}): ${reviews.length} отзывов`);

  let created = 0;
  let skipped = 0;

  for (const rv of reviews) {
    if (rv.status && rv.status !== "published") continue;

    const text = rv.text?.trim() ?? "";
    if (text.length < 10) {
      skipped++;
      continue;
    }

    const id = `ozon-${rv.id}`;
    await prisma.review.upsert({
      where: { id },
      update: {},
      create: {
        id,
        productId: product.id,
        source: "ozon",
        author: rv.reviewer_name || "Покупатель",
        rating: rv.rating,
        text,
        isVerified: rv.is_verified_purchase ?? false,
        isVisible: true,
        createdAt: new Date(rv.created_at),
      },
    });
    created++;
  }

  console.log(`[OZON] ${slug}: +${created} сохранено, ${skipped} пропущено`);
}

async function main() {
  if (!OZON_CLIENT_ID || !OZON_API_KEY) {
    console.error("[OZON-SYNC] Не заданы OZON_CLIENT_ID и OZON_API_KEY в переменных окружения");
    console.error("  Добавь в .env и docker-compose.prod.yml");
    process.exit(1);
  }

  console.log(`[OZON-SYNC] Старт: ${new Date().toISOString()}`);

  const entries = Object.entries(OZON_PRODUCT_MAP);
  for (let i = 0; i < entries.length; i++) {
    const [productId, slug] = entries[i];
    console.log(`[OZON-SYNC] ${i + 1}/${entries.length} — productId=${productId}`);
    await syncProduct(productId, slug);
    if (i < entries.length - 1) await sleep(1500);
  }

  console.log(`[OZON-SYNC] Готово: ${new Date().toISOString()}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("[OZON-SYNC] Ошибка:", err);
  await prisma.$disconnect();
  process.exit(1);
});
