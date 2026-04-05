/**
 * Sync WB product content (descriptions + photo CDN URLs)
 * Uses WB Content API with statistics key (WB_STATS_KEY / WB2_STATS_KEY)
 * Stores CDN photo URLs in product.images, descriptions in product.fullDesc
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// WB acc1 (ЭКО Конь, oid: 154039) — nmId → slug
const WB1_MAP: Record<number, string> = {
  138576640: "bio-chay-yantar-fosfor",
  138576638: "bio-chay-dekorativno-listvennye",
  138576639: "udobrenie-ovoshchi",
  163686285: "udobrenie-kornevaya",
  177867849: "bio-chay-orhidei",
  262136598: "udobrenie-tsitrusovye",
  820054512: "udobrenie-rassada",
  819695619: "udobrenie-tsvetushchie",
};

// WB acc2 (Цветология, oid: 250001733) — nmId → slug
// TODO: fill in nmIds for Цветология products on WB
const WB2_MAP: Record<number, string> = {};

interface WbCard {
  nmID: number;
  title: string;
  description: string;
  photos: Array<{ big: string; c246x328?: string; square?: string }>;
}

interface WbCardsResponse {
  cards: WbCard[];
  cursor?: { updatedAt: string; nmID: number; total: number };
}

async function fetchAllCards(apiKey: string): Promise<WbCard[]> {
  const all: WbCard[] = [];
  let cursor: { updatedAt?: string; nmID?: number } = {};

  while (true) {
    const settings: Record<string, unknown> = {
      cursor: { limit: 100, ...cursor },
      filter: { withPhoto: -1 },
    };

    const res = await fetch(
      "https://content-api.wildberries.ru/content/v2/get/cards/list?locale=ru",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.warn(`[WB-CONTENT] HTTP ${res.status}: ${text.slice(0, 200)}`);
      break;
    }

    const data = (await res.json()) as WbCardsResponse;
    const batch = data.cards ?? [];
    all.push(...batch);

    const cur = data.cursor;
    if (!cur || batch.length < 100) break;

    // Check if total reached
    if (all.length >= cur.total) break;
    cursor = { updatedAt: cur.updatedAt, nmID: cur.nmID };

    await new Promise((r) => setTimeout(r, 200));
  }

  return all;
}

async function syncAccount(
  apiKey: string,
  accountName: string,
  nmIdMap: Record<number, string>
) {
  if (!apiKey) {
    console.log(`[WB-CONTENT] Нет ключа для ${accountName}, пропускаем`);
    return;
  }

  if (Object.keys(nmIdMap).length === 0) {
    console.log(`[WB-CONTENT] Нет маппинга для ${accountName}, пропускаем`);
    return;
  }

  console.log(`[WB-CONTENT] ${accountName}: получаем карточки...`);
  const cards = await fetchAllCards(apiKey);
  console.log(`[WB-CONTENT] ${accountName}: ${cards.length} карточек получено`);

  for (const card of cards) {
    const slug = nmIdMap[card.nmID];
    if (!slug) continue;

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      console.warn(`[WB-CONTENT] Товар не найден: slug=${slug}`);
      continue;
    }

    // Build CDN image URLs (big format)
    const imageUrls = card.photos
      .map((p) => p.big)
      .filter(Boolean);

    // Merge: keep existing non-WB images, add WB CDN images
    const existingImages = Array.isArray(product.images)
      ? (product.images as string[])
      : [];
    const nonWbImages = existingImages.filter(
      (url) => !url.includes("wbbasket.ru") && !url.includes("/images/wb/")
    );
    const mergedImages = [...imageUrls, ...nonWbImages];

    // Update product: images + fullDesc (only if empty)
    const updateData: Record<string, unknown> = {
      images: mergedImages,
    };

    if (!product.fullDesc && card.description) {
      updateData.fullDesc = card.description;
      console.log(`[WB-CONTENT] ${slug}: обновляем описание (${card.description.length} симв)`);
    }

    await prisma.product.update({
      where: { id: product.id },
      data: updateData,
    });

    console.log(
      `[WB-CONTENT] ${slug}: ${imageUrls.length} фото, ` +
      `${updateData.fullDesc ? "описание обновлено" : "описание уже есть"}`
    );
  }
}

async function main() {
  console.log(`[WB-CONTENT] Старт: ${new Date().toISOString()}`);

  await syncAccount(
    process.env.WB_STATS_KEY ?? "",
    "ЭКО Конь (acc1)",
    WB1_MAP
  );

  await syncAccount(
    process.env.WB2_STATS_KEY ?? "",
    "Цветология (acc2)",
    WB2_MAP
  );

  console.log(`[WB-CONTENT] Готово: ${new Date().toISOString()}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("[WB-CONTENT] Ошибка:", err);
  await prisma.$disconnect();
  process.exit(1);
});
