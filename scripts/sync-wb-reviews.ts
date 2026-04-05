import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// WB nmId → product slug (account ecokon, oid: 154039)
const WB_PRODUCT_MAP: Record<number, string> = {
  138576640: "bio-chay-yantar-fosfor",
  138576638: "bio-chay-dekorativno-listvennye",
  138576639: "udobrenie-ovoshchi",
  163686285: "udobrenie-kornevaya",
  177867849: "bio-chay-orhidei",
  262136598: "udobrenie-tsitrusovye",
  820054512: "udobrenie-rassada",
  819695619: "udobrenie-tsvetushchie",
};

const WB_API_KEY = process.env.WB_API_KEY ?? "";
const MAX_FEEDBACKS = 5000;

interface WbFeedback {
  id: string;
  nmId: number;
  text: string;
  productValuation: number;
  createdDate: string;
  userName?: string;
  wasPurchased?: boolean;
}

interface WbFeedbacksResponse {
  data?: {
    feedbacks: WbFeedback[] | null;
  };
  error?: boolean;
  errorText?: string;
}

async function fetchFeedbacks(isAnswered: boolean): Promise<WbFeedback[]> {
  const all: WbFeedback[] = [];
  let skip = 0;
  const take = 100;

  while (all.length < MAX_FEEDBACKS) {
    const url = `https://feedbacks-api.wildberries.ru/api/v1/feedbacks?isAnswered=${isAnswered}&take=${take}&skip=${skip}&order=dateDesc`;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${WB_API_KEY}` },
      });
      if (!res.ok) {
        const text = await res.text();
        console.warn(`[WB] isAnswered=${isAnswered} HTTP ${res.status}: ${text.slice(0, 200)}`);
        break;
      }
      const data = (await res.json()) as WbFeedbacksResponse;
      const batch = data.data?.feedbacks ?? [];
      all.push(...batch);
      if (batch.length < take) break;
      skip += take;
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`[WB] fetch error:`, err);
      break;
    }
  }

  return all;
}

async function main() {
  if (!WB_API_KEY) {
    console.error("[WB-SYNC] Не задан WB_API_KEY — пропускаем");
    return;
  }

  console.log(`[WB-SYNC] Старт: ${new Date().toISOString()}`);

  // Fetch both answered and unanswered feedbacks
  const [unanswered, answered] = await Promise.all([
    fetchFeedbacks(false),
    fetchFeedbacks(true),
  ]);
  const allFeedbacks = [...unanswered, ...answered];
  console.log(
    `[WB-SYNC] Всего: ${allFeedbacks.length} (${unanswered.length} без ответа, ${answered.length} с ответом)`
  );

  // Group by slug
  const bySlug: Record<string, WbFeedback[]> = {};
  for (const fb of allFeedbacks) {
    const slug = WB_PRODUCT_MAP[fb.nmId];
    if (!slug) continue;
    if (!bySlug[slug]) bySlug[slug] = [];
    bySlug[slug].push(fb);
  }

  // Save per product
  for (const [slug, feedbacks] of Object.entries(bySlug)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      console.warn(`[SKIP] Товар не найден: slug=${slug}`);
      continue;
    }

    let created = 0;
    let skipped = 0;

    for (const fb of feedbacks) {
      const text = fb.text?.trim() ?? "";
      if (text.length < 10) {
        skipped++;
        continue;
      }

      await prisma.review.upsert({
        where: { id: `wb-${fb.id}` },
        update: {},
        create: {
          id: `wb-${fb.id}`,
          productId: product.id,
          source: "wildberries",
          author: fb.userName || "Покупатель",
          rating: fb.productValuation,
          text,
          isVerified: fb.wasPurchased ?? true,
          isVisible: true,
          createdAt: new Date(fb.createdDate),
        },
      });
      created++;
    }

    console.log(`[WB] ${slug}: +${created} сохранено, ${skipped} пропущено`);

    const stats = await prisma.review.aggregate({
      where: { productId: product.id, isVisible: true },
      _count: true,
      _avg: { rating: true },
    });
    await prisma.product.update({
      where: { id: product.id },
      data: {
        reviewsCount: stats._count,
        rating: stats._avg.rating
          ? Math.round(stats._avg.rating * 10) / 10
          : product.rating,
      },
    });
    console.log(
      `[WB] ${slug}: stats → ${stats._count} отзывов, рейтинг ${stats._avg.rating?.toFixed(1)}`
    );
  }

  console.log(`[WB-SYNC] Готово: ${new Date().toISOString()}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("[WB-SYNC] Ошибка:", err);
  await prisma.$disconnect();
  process.exit(1);
});
