import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ozon Seller API SKU → product slug
// SKUs from api-seller.ozon.ru/v3/product/info/list (not URL product IDs!)
const OZON_SKU_MAP: Record<string, string> = {
  // ЭКО Конь удобрения (seller Client-Id: 98587)
  "818346437": "bio-chay-yantar-fosfor",
  "821338829": "bio-chay-dekorativno-listvennye",
  "818348560": "udobrenie-ovoshchi",
  "818351720": "udobrenie-rassada",
  "1010076465": "udobrenie-kornevaya",
  "1198624077": "bio-chay-orhidei",
  "1694995657": "udobrenie-tsitrusovye",
  "3385802107": "udobrenie-tsvetushchie",
};

const OZON_CLIENT_ID = process.env.OZON_CLIENT_ID ?? "";
const OZON_API_KEY = process.env.OZON_API_KEY ?? "";

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
  last_id?: string;
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

      if (res.status === 401 || res.status === 403) {
        console.error(`[OZON] Ошибка авторизации`);
        break;
      }
      if (!res.ok) {
        const text = await res.text();
        console.warn(`[OZON] sku=${sku} HTTP ${res.status}: ${text.slice(0, 200)}`);
        break;
      }

      const data = (await res.json()) as OzonReviewListResponse;
      const batch = data.reviews ?? [];
      all.push(...batch);

      if (!data.has_next || batch.length < 100) break;
      pageNumber++;
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`[OZON] sku=${sku} fetch error:`, err);
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
  console.log(`[OZON] sku=${sku} (${slug}): ${reviews.length} отзывов`);

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

  console.log(`[OZON] ${slug}: +${created} сохранено, ${skipped} пропущено`);

  // Update product reviewsCount and rating
  const stats = await prisma.review.aggregate({
    where: { productId: product.id, isVisible: true },
    _count: true,
    _avg: { rating: true },
  });
  await prisma.product.update({
    where: { id: product.id },
    data: {
      reviewsCount: stats._count,
      rating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : product.rating,
    },
  });
  console.log(`[OZON] ${slug}: stats → ${stats._count} отзывов, рейтинг ${stats._avg.rating?.toFixed(1)}`);
}

async function main() {
  if (!OZON_CLIENT_ID || !OZON_API_KEY) {
    console.error("[OZON-SYNC] Не заданы OZON_CLIENT_ID и OZON_API_KEY");
    process.exit(1);
  }

  console.log(`[OZON-SYNC] Старт: ${new Date().toISOString()}`);

  const entries = Object.entries(OZON_SKU_MAP);
  for (let i = 0; i < entries.length; i++) {
    const [sku, slug] = entries[i];
    console.log(`[OZON-SYNC] ${i + 1}/${entries.length} — sku=${sku}`);
    await syncProduct(sku, slug);
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
