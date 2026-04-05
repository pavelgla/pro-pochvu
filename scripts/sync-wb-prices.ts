/**
 * Sync WB prices for both accounts via Seller API (Цены и скидки)
 * Stores in product.marketplaceIds as { wbPrice: X }
 * Requires WB_PRICES_KEY (ЭКО Конь) and WB2_PRICES_KEY (Цветология)
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
// TODO: добавить nmId для товаров Цветологии на WB
const WB2_MAP: Record<number, string> = {};

interface WbGood {
  nmId: number;
  sizes: Array<{ price: number; discountedPrice: number }>;
}

interface WbPricesResponse {
  data?: { listGoods: WbGood[] };
}

async function fetchAllPrices(apiKey: string): Promise<WbGood[]> {
  const all: WbGood[] = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const url = `https://discounts-prices-api.wb.ru/api/v2/list/goods/filter?limit=${limit}&offset=${offset}`;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        const text = await res.text();
        console.warn(`[WB-PRICES] HTTP ${res.status}: ${text.slice(0, 200)}`);
        break;
      }
      const data = (await res.json()) as WbPricesResponse;
      const batch = data.data?.listGoods ?? [];
      all.push(...batch);
      if (batch.length < limit) break;
      offset += limit;
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error("[WB-PRICES] fetch error:", err);
      break;
    }
  }

  return all;
}

async function syncWbPrices(
  apiKey: string,
  accountName: string,
  nmIdMap: Record<number, string>,
  priceKey: "wbPrice" | "wb2Price"
) {
  if (!apiKey) {
    console.log(`[WB-PRICES] Нет ключа для ${accountName}, пропускаем`);
    return;
  }
  if (Object.keys(nmIdMap).length === 0) {
    console.log(`[WB-PRICES] Нет маппинга для ${accountName}, пропускаем`);
    return;
  }

  console.log(`[WB-PRICES] ${accountName}: получаем цены...`);
  const goods = await fetchAllPrices(apiKey);
  console.log(`[WB-PRICES] ${accountName}: ${goods.length} позиций`);

  for (const good of goods) {
    const slug = nmIdMap[good.nmId];
    if (!slug) continue;

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      console.warn(`[WB-PRICES] Товар не найден: slug=${slug}`);
      continue;
    }

    // discountedPrice — цена со скидкой (то что видит покупатель)
    const price = good.sizes?.[0]?.discountedPrice ?? good.sizes?.[0]?.price ?? 0;
    if (!price) continue;

    const currentIds =
      product.marketplaceIds && typeof product.marketplaceIds === "object"
        ? (product.marketplaceIds as Record<string, unknown>)
        : {};

    await prisma.product.update({
      where: { id: product.id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { marketplaceIds: { ...currentIds, [priceKey]: price } as any },
    });

    console.log(`[WB-PRICES] ${slug}: ${priceKey}=${price} ₽`);
  }
}

async function main() {
  console.log(`[WB-PRICES] Старт: ${new Date().toISOString()}`);

  await syncWbPrices(
    process.env.WB_PRICES_KEY ?? "",
    "ЭКО Конь (acc1)",
    WB1_MAP,
    "wbPrice"
  );

  await syncWbPrices(
    process.env.WB2_PRICES_KEY ?? "",
    "Цветология (acc2)",
    WB2_MAP,
    "wb2Price"
  );

  console.log(`[WB-PRICES] Готово: ${new Date().toISOString()}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("[WB-PRICES] Ошибка:", err);
  await prisma.$disconnect();
  process.exit(1);
});
