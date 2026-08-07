import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ozon Seller API SKU → product slug (account Client-Id: 2576567 — Tsvetologiya + Grunt)
const OZON2_SKU_MAP: Record<string, string> = {
  "1856412162": "fitomodul-50-4-white",
  "2081828814": "fitomodul-50-4-black",
  "2439041908": "fitomodul-50-4-green",
  "2825417652": "zaglushki-fitomodul",
  "2209878912": "fitomodul-15-6",
  "1902553919": "grunt-ecokon-20l",
  "1902567457": "grunt-ecokon-ovoshchi",
  "1928618714": "grunt-ecokon-organicheskiy",
};

const OZON_CLIENT_ID = process.env.OZON2_CLIENT_ID ?? "";
const OZON_API_KEY = process.env.OZON2_API_KEY ?? "";

const MAX_REVIEWS = 5000;

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

async function fetchAllReviews(): Promise<OzonReview[]> {
  const url = "https://api-seller.ozon.ru/v1/review/list";
  const all: OzonReview[] = [];
  let lastId: string | undefined;

  while (all.length < MAX_REVIEWS) {
    try {
      const body: Record<string, unknown> = { sort_dir: "DESC", limit: 100 };
      if (lastId) body.last_id = lastId;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Client-Id": OZON_CLIENT_ID,
          "Api-Key": OZON_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        console.warn(`[OZON2] HTTP ${res.status}: ${text.slice(0, 200)}`);
        break;
      }

      const data = (await res.json()) as OzonReviewListResponse;
      const batch = data.reviews ?? [];
      all.push(...batch);

      if (!data.has_next || !data.last_id || batch.length === 0) break;
      lastId = data.last_id;
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`[OZON2] fetch error:`, err);
      break;
    }
  }

  return all;
}

async function main() {
  if (!OZON_CLIENT_ID || !OZON_API_KEY) {
    console.error("[OZON2-SYNC] Не заданы OZON2_CLIENT_ID и OZON2_API_KEY");
    process.exit(1);
  }

  console.log(`[OZON2-SYNC] Старт: ${new Date().toISOString()}`);

  // Fetch all reviews for the account at once (cursor pagination)
  const allReviews = await fetchAllReviews();
  console.log(`[OZON2-SYNC] Всего получено: ${allReviews.length} отзывов`);

  // Group by slug
  const bySlug: Record<string, OzonReview[]> = {};
  for (const rv of allReviews) {
    const slug = OZON2_SKU_MAP[String(rv.sku)];
    if (!slug) continue;
    if (!bySlug[slug]) bySlug[slug] = [];
    bySlug[slug].push(rv);
  }

  // Save per product
  for (const [slug, reviews] of Object.entries(bySlug)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      console.warn(`[SKIP] Товар не найден: slug=${slug}`);
      continue;
    }

    let created = 0;
    let skipped = 0;

    for (const rv of reviews) {
      const text = rv.text?.trim() ?? "";
      if (text.length < 10) {
        skipped++;
        continue;
      }

      await prisma.review.upsert({
        where: { id: `ozon-${rv.id}` },
        update: {},
        create: {
          id: `ozon-${rv.id}`,
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
    console.log(`[OZON2] ${slug}: stats → ${stats._count} отзывов, рейтинг ${stats._avg.rating?.toFixed(1)}`);
  }

  console.log(`[OZON2-SYNC] Готово: ${new Date().toISOString()}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("[OZON2-SYNC] Ошибка:", err);
  await prisma.$disconnect();
  process.exit(1);
});
