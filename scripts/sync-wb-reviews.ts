import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const WB_PRODUCT_MAP: Record<string, string> = {
  "138576640": "bio-chay-yantar-fosfor",
  "138576638": "bio-chay-dekorativno-listvennye",
  "138576639": "udobrenie-ovoshchi",
  "163686285": "udobrenie-kornevaya",
  "177867849": "bio-chay-orhidei",
  "262136598": "udobrenie-tsitrusovye",
  "820054512": "udobrenie-rassada",
  "819695619": "udobrenie-tsvetushchie",
};

interface WbFeedback {
  id: string;
  text: string;
  productValuation: number;
  createdDate: string;
  userName?: string;
}

interface WbResponse {
  feedbacks: WbFeedback[];
}

async function fetchWbFeedbacks(
  nmId: string,
  take = 100
): Promise<WbFeedback[]> {
  const url = `https://feedbacks2.wb.ru/feedbacks/v1/${nmId}?take=${take}&skip=0&order=dateDesc`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; EcokonBot/1.0; +https://ecokon.ru)",
      },
    });
    if (!res.ok) {
      console.warn(`[WB] nmId=${nmId} HTTP ${res.status}`);
      return [];
    }
    const data = (await res.json()) as WbResponse;
    return data.feedbacks ?? [];
  } catch (err) {
    console.error(`[WB] nmId=${nmId} fetch error:`, err);
    return [];
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function syncProduct(nmId: string, slug: string) {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    console.warn(`[SKIP] Product not found: slug=${slug}`);
    return;
  }

  const feedbacks = await fetchWbFeedbacks(nmId);
  console.log(`[WB] nmId=${nmId} (${slug}): ${feedbacks.length} отзывов`);

  let created = 0;
  let skipped = 0;

  for (const fb of feedbacks) {
    const text = fb.text?.trim() ?? "";
    if (text.length < 10) {
      skipped++;
      continue;
    }

    const id = `wb-${fb.id}`;
    await prisma.review.upsert({
      where: { id },
      update: {},
      create: {
        id,
        productId: product.id,
        source: "wildberries",
        author: fb.userName || "Покупатель",
        rating: fb.productValuation,
        text,
        isVerified: true,
        isVisible: true,
        createdAt: new Date(fb.createdDate),
      },
    });
    created++;
  }

  console.log(
    `[WB] ${slug}: +${created} сохранено, ${skipped} пропущено (короткий текст)`
  );
}

async function main() {
  console.log(`[WB-SYNC] Старт: ${new Date().toISOString()}`);

  const entries = Object.entries(WB_PRODUCT_MAP);
  for (let i = 0; i < entries.length; i++) {
    const [nmId, slug] = entries[i];
    console.log(`[WB-SYNC] ${i + 1}/${entries.length} — nmId=${nmId}`);
    await syncProduct(nmId, slug);
    if (i < entries.length - 1) await sleep(1500);
  }

  console.log(`[WB-SYNC] Готово: ${new Date().toISOString()}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("[WB-SYNC] Ошибка:", err);
  await prisma.$disconnect();
  process.exit(1);
});
