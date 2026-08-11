/**
 * Sync Ozon prices for both accounts (v5/product/info/prices)
 * Stores in product.marketplaceIds as { ozonPrice: X } / { ozon2Price: X }
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ozon acc1 (ЭКО Конь, Client-Id: 98587) — offer_id → slug
const OZON1_OFFER_MAP: Record<string, string> = {
  articul: "bio-chay-yantar-fosfor",
  bioogorod: "udobrenie-ovoshchi",
  biorassada: "udobrenie-rassada",
  biorassada2: "udobrenie-rassada", // newer version, same product
  biodecor: "bio-chay-dekorativno-listvennye",
  biokorni: "udobrenie-kornevaya",
  bioOrh: "bio-chay-orhidei",
  biocitrus: "udobrenie-tsitrusovye",
  biotsvet: "udobrenie-tsvetushchie",
  // bionabor: набор — не маппируется в отдельный товар
};

// Ozon acc2 (Цветология + Грунт, Client-Id: 2576567) — offer_id → slug
// Ссылки проверены по https://ozon.ru/t/sSMKTX4 → SKU 2439041908 = fitomodul-50-4-green
// (Ozon offer_id "FITOCVET GREY" сам подтверждает: этот цвет — серый, не зелёный)
// Gorshok W / zagl cv уточнены Ириной 2026-08-11
const OZON2_OFFER_MAP: Record<string, string> = {
  FITOCVET: "fitomodul-50-4-white",
  "FITOCVET DARK": "fitomodul-50-4-black",
  "FITOCVET GREY": "fitomodul-50-4-green",
  grunt20u: "grunt-ecokon-20l",
  grunt20o: "grunt-ecokon-ovoshchi",
  gruovo: "grunt-ecokon-organicheskiy",
  "Gorshok W": "gorshki-prozrachnye-fitomodul",
  "zagl cv": "zaglushki-fitomodul",
};

interface OzonPriceItem {
  offer_id: string;
  price: { price: number | string; old_price: number | string };
}

interface OzonPricesResponse {
  items: OzonPriceItem[];
  cursor: string;
  total: number;
}

async function fetchAllPrices(
  clientId: string,
  apiKey: string
): Promise<OzonPriceItem[]> {
  const all: OzonPriceItem[] = [];
  let lastId = "";

  while (true) {
    const body: Record<string, unknown> = {
      filter: { visibility: "ALL" },
      limit: 100,
    };
    if (lastId) body.last_id = lastId;

    const res = await fetch("https://api-seller.ozon.ru/v5/product/info/prices", {
      method: "POST",
      headers: {
        "Client-Id": clientId,
        "Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.warn(`[OZON-PRICES] HTTP ${res.status}: ${text.slice(0, 200)}`);
      break;
    }

    const data = (await res.json()) as OzonPricesResponse;
    const batch = data.items ?? [];
    all.push(...batch);

    if (batch.length < 100) break;
    lastId = data.cursor ?? "";
    if (!lastId) break;

    await new Promise((r) => setTimeout(r, 200));
  }

  return all;
}

async function syncPrices(
  clientId: string,
  apiKey: string,
  accountName: string,
  offerMap: Record<string, string>,
  priceKey: "ozonPrice" | "ozon2Price"
) {
  if (!clientId || !apiKey) {
    console.log(`[OZON-PRICES] Нет ключей для ${accountName}, пропускаем`);
    return;
  }

  console.log(`[OZON-PRICES] ${accountName}: получаем цены...`);
  const items = await fetchAllPrices(clientId, apiKey);
  console.log(`[OZON-PRICES] ${accountName}: ${items.length} позиций`);

  // Group by slug (take max price if multiple offer_ids map to same slug)
  const priceBySlug: Record<string, number> = {};
  for (const item of items) {
    const slug = offerMap[item.offer_id];
    if (!slug) continue;
    const price = Number(item.price.price);
    if (!priceBySlug[slug] || price > priceBySlug[slug]) {
      priceBySlug[slug] = price;
    }
  }

  for (const [slug, price] of Object.entries(priceBySlug)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      console.warn(`[OZON-PRICES] Товар не найден: slug=${slug}`);
      continue;
    }

    const currentIds =
      product.marketplaceIds && typeof product.marketplaceIds === "object"
        ? (product.marketplaceIds as Record<string, unknown>)
        : {};

    await prisma.product.update({
      where: { id: product.id },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        marketplaceIds: { ...currentIds, [priceKey]: price } as any,
      },
    });

    console.log(`[OZON-PRICES] ${slug}: ${priceKey}=${price} ₽`);
  }
}

async function main() {
  console.log(`[OZON-PRICES] Старт: ${new Date().toISOString()}`);

  await syncPrices(
    process.env.OZON_CLIENT_ID ?? "",
    process.env.OZON_API_KEY ?? "",
    "ЭКО Конь (acc1)",
    OZON1_OFFER_MAP,
    "ozonPrice"
  );

  await syncPrices(
    process.env.OZON2_CLIENT_ID ?? "",
    process.env.OZON2_API_KEY ?? "",
    "Цветология (acc2)",
    OZON2_OFFER_MAP,
    "ozon2Price"
  );

  console.log(`[OZON-PRICES] Готово: ${new Date().toISOString()}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("[OZON-PRICES] Ошибка:", err);
  await prisma.$disconnect();
  process.exit(1);
});
