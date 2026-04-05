import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ozon Seller API SKU → product slug (account Client-Id: 2576567 — Tsvetologiya + Grunt)
const OZON2_SKU_MAP: Record<string, string> = {
  "1856412162": "fitomodul-50-4-white",
  "2081828814": "fitomodul-50-4-black",
  "2439041908": "fitomodul-50-4-green",
  "2825417652": "kolyshki-skoby-silikon",
  "2209878912": "fitomodul-15-6",
  "1902553919": "grunt-ecokon-20l",
};

const OZON_CLIENT_ID = process.env.OZON2_CLIENT_ID ?? "";
const OZON_API_KEY = process.env.OZON2_API_KEY ?? "";

interface OzonReview {
  id: string;
  sku: number;
  text?: string;
  published_at?: string;
  rating: number;
  status?: string;
}

interface OzonReviewListResponse {
  reviews?: OzonReview[];
  has_next?: boolean;
}

async function fetchOzonReviews(sku: string): Promise<OzonReview[]> {
  const url = "https://api-seller.ozon.ru/v1/review/list";
  const all: OzonReview[] = [];
  let pageNumber = 1;

  while (true) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Client-Id": OZON_CLIENT_ID,
          "Api-Key": OZON_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sku: [parseInt(sku)],
          sort_dir: "DESC",
          page_number: pageNumber,
          limit: 100,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.warn(`[OZON2] sku=${sku} HTTP ${res.status}: ${text.slice(0, 200)}`);
        break;
      }

      const data = (await res.json()) as OzonReviewListResponse;
      const batch = data.reviews ?? [];
      all.push(...batch);

      if (!data.has_next || batch.length < 100) break;
      pageNumber++;
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`[OZON2] sku=${sku} fetch error:`, err);
      break;
    }
  }

  return all;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function syncProduct(sku: string, slug: string) {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    console.warn(`[SKIP] Товар не найден: slug=${slug}`);
    return;
  }

  const reviews = await fetchOzonReviews(sku);
  console.log(`[OZON2] sku=${sku} (${slug}): ${reviews.length} отзывов`);

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
        author: "Покупатель",
        rating: rv.rating,
        text,
        isVerified: true,
        isVisible: true,
        createdAt: rv.published_at ? new Date(rv.published_at) : new Date(),
      },
    });
    created++;
  }

  console.log(`[OZON2] ${slug}: +${created} сохранено, ${skipped} пропущено`);
}

async function main() {
  if (!OZON_CLIENT_ID || !OZON_API_KEY) {
    console.error("[OZON2-SYNC] Не заданы OZON2_CLIENT_ID и OZON2_API_KEY");
    process.exit(1);
  }

  console.log(`[OZON2-SYNC] Старт: ${new Date().toISOString()}`);

  const entries = Object.entries(OZON2_SKU_MAP);
  for (let i = 0; i < entries.length; i++) {
    const [sku, slug] = entries[i];
    console.log(`[OZON2-SYNC] ${i + 1}/${entries.length} — sku=${sku}`);
    await syncProduct(sku, slug);
    if (i < entries.length - 1) await sleep(1500);
  }

  console.log(`[OZON2-SYNC] Готово: ${new Date().toISOString()}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("[OZON2-SYNC] Ошибка:", err);
  await prisma.$disconnect();
  process.exit(1);
});
