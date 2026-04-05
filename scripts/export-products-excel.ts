/**
 * Export all ecokon products to Excel with live marketplace prices and review counts.
 * Output: ecokon-products-YYYY-MM-DD.xlsx in project root.
 */
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import * as path from "path";

const prisma = new PrismaClient();

// WB nmId → slug (acc1 ЭКО Конь)
const WB_MAP: Record<number, string> = {
  138576640: "bio-chay-yantar-fosfor",
  138576638: "bio-chay-dekorativno-listvennye",
  138576639: "udobrenie-ovoshchi",
  163686285: "udobrenie-kornevaya",
  177867849: "bio-chay-orhidei",
  262136598: "udobrenie-tsitrusovye",
  820054512: "udobrenie-rassada",
  819695619: "udobrenie-tsvetushchie",
};

// Ozon acc1 SKU → slug (ЭКО Конь, Client-Id: 98587)
const OZON1_SKU_MAP: Record<string, string> = {
  "818346437": "bio-chay-yantar-fosfor",
  "821338829": "bio-chay-dekorativno-listvennye",
  "818348560": "udobrenie-ovoshchi",
  "818351720": "udobrenie-rassada",
  "3520881009": "udobrenie-rassada", // актуальный SKU
  "1010076465": "udobrenie-kornevaya",
  "1198624077": "bio-chay-orhidei",
  "1694995657": "udobrenie-tsitrusovye",
  "3385802107": "udobrenie-tsvetushchie",
};

// Ozon acc2 offer_id → slug (Цветология + Грунт, Client-Id: 2576567)
const OZON2_OFFER_MAP: Record<string, string> = {
  FITOCVET: "fitomodul-50-4-white",
  "FITOCVET DARK": "fitomodul-50-4-black",
  "FITOCVET GREY": "fitomodul-50-4-green",
  grunt20u: "grunt-ecokon-20l",
  grunt20o: "grunt-ecokon-ovoshchi",
  gruovo: "grunt-ecokon-organicheskiy",
};

// Reverse maps: slug → ids
const slugToWbNmId: Record<string, number> = {};
for (const [nmId, slug] of Object.entries(WB_MAP)) slugToWbNmId[slug] = Number(nmId);

const slugToOzon1Skus: Record<string, string[]> = {};
for (const [sku, slug] of Object.entries(OZON1_SKU_MAP)) {
  if (!slugToOzon1Skus[slug]) slugToOzon1Skus[slug] = [];
  slugToOzon1Skus[slug].push(sku);
}

const slugToOzon2Offer: Record<string, string> = {};
for (const [offer, slug] of Object.entries(OZON2_OFFER_MAP)) slugToOzon2Offer[slug] = offer;

// --- Fetch live WB prices ---
async function fetchWbPrices(apiKey: string): Promise<Record<number, number>> {
  if (!apiKey) return {};
  try {
    const res = await fetch(
      "https://discounts-prices-api.wb.ru/api/v2/list/goods/filter?limit=1000&offset=0",
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    if (!res.ok) return {};
    const data = await res.json() as { data?: { listGoods: Array<{ nmId: number; sizes: Array<{ discountedPrice: number; price: number }> }> } };
    const map: Record<number, number> = {};
    for (const g of data.data?.listGoods ?? []) {
      map[g.nmId] = g.sizes?.[0]?.discountedPrice ?? g.sizes?.[0]?.price ?? 0;
    }
    return map;
  } catch {
    return {};
  }
}

// --- Fetch live Ozon prices ---
async function fetchOzonPrices(
  clientId: string,
  apiKey: string
): Promise<Record<string, number>> {
  if (!clientId || !apiKey) return {};
  try {
    const res = await fetch("https://api-seller.ozon.ru/v5/product/info/prices", {
      method: "POST",
      headers: {
        "Client-Id": clientId,
        "Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filter: { visibility: "ALL" }, last_id: "", limit: 100 }),
    });
    if (!res.ok) return {};
    const data = await res.json() as { items: Array<{ offer_id: string; price: { price: number } }> };
    const map: Record<string, number> = {};
    for (const item of data.items ?? []) {
      map[item.offer_id] = Number(item.price?.price ?? 0);
    }
    return map;
  } catch {
    return {};
  }
}

// Ozon acc1: map by SKU using v3/product/list + v5/prices correlation
// Simpler: we already have offer_id→slug for acc1, build it from v3/product/list response
const OZON1_OFFER_MAP: Record<string, string> = {
  articul: "bio-chay-yantar-fosfor",
  bioogorod: "udobrenie-ovoshchi",
  biorassada: "udobrenie-rassada",
  biorassada2: "udobrenie-rassada",
  biodecor: "bio-chay-dekorativno-listvennye",
  biokorni: "udobrenie-kornevaya",
  bioOrh: "bio-chay-orhidei",
  biocitrus: "udobrenie-tsitrusovye",
  biotsvet: "udobrenie-tsvetushchie",
};

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`[EXPORT] Старт: ${today}`);

  // Fetch live prices in parallel
  const [ozon1Prices, ozon2Prices, wb1Prices, wb2Prices] = await Promise.all([
    fetchOzonPrices(
      process.env.OZON_CLIENT_ID ?? "98587",
      process.env.OZON_API_KEY ?? "bd5ab9c0-ad62-40ad-966b-b7a4e16a7535"
    ),
    fetchOzonPrices(
      process.env.OZON2_CLIENT_ID ?? "2576567",
      process.env.OZON2_API_KEY ?? "a450d00c-2c14-402a-80c1-47cf8e586a62"
    ),
    fetchWbPrices(process.env.WB_PRICES_KEY ?? ""),
    fetchWbPrices(process.env.WB2_PRICES_KEY ?? ""),
  ]);

  // Build slug → ozon price
  const ozon1PriceBySlug: Record<string, number> = {};
  for (const [offerId, price] of Object.entries(ozon1Prices)) {
    const slug = OZON1_OFFER_MAP[offerId];
    if (slug && (!ozon1PriceBySlug[slug] || price > ozon1PriceBySlug[slug])) {
      ozon1PriceBySlug[slug] = price;
    }
  }
  const ozon2PriceBySlug: Record<string, number> = {};
  for (const [offerId, price] of Object.entries(ozon2Prices)) {
    const slug = OZON2_OFFER_MAP[offerId];
    if (slug) ozon2PriceBySlug[slug] = price;
  }

  // Fetch all products from DB
  const products = await prisma.product.findMany({
    include: {
      productLine: true,
      category: true,
      reviews: { select: { id: true, source: true, isVisible: true } },
    },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  });

  console.log(`[EXPORT] Товаров в БД: ${products.length}`);

  const rows = products.map((p) => {
    const slug = p.slug;
    const siteUrl = `https://ecokon.ru/product/${slug}`;

    const wbNmId = slugToWbNmId[slug] ?? null;
    const ozon1Skus = slugToOzon1Skus[slug] ?? [];
    const ozon2Offer = slugToOzon2Offer[slug] ?? null;

    const wbUrl = wbNmId
      ? `https://www.wildberries.ru/catalog/${wbNmId}/detail.aspx`
      : "";
    const ozonSku = ozon1Skus[ozon1Skus.length - 1] ?? null; // latest SKU
    const ozon2Sku = ozon2Offer ? "acc2" : null;
    const ozonUrl = ozonSku
      ? `https://www.ozon.ru/product/${ozonSku}/`
      : ozon2Offer
      ? "" // acc2 SKU not directly known here
      : "";

    const mpSources: string[] = [];
    if (wbNmId) mpSources.push("WB");
    if (ozonSku || ozon2Offer) mpSources.push("Ozon");

    const images = Array.isArray(p.images) ? (p.images as string[]) : [];
    const hasImages = images.length > 0 ? "Да" : "Нет";

    // Ozon price: acc1 or acc2
    const ozonPrice =
      ozon1PriceBySlug[slug] ?? ozon2PriceBySlug[slug] ?? "—";

    // WB price via acc1 or acc2
    const wbPrice = wbNmId
      ? (wb1Prices[wbNmId] ?? wb2Prices[wbNmId] ?? "—")
      : "—";

    const allReviews = p.reviews;
    const wbReviews = allReviews.filter((r) => r.source === "wildberries");
    const ozonReviews = allReviews.filter((r) => r.source === "ozon");
    const siteReviews = allReviews.filter((r) => r.source === "site");
    const visibleReviews = allReviews.filter((r) => r.isVisible).length;

    const brand = p.productLine?.brand ?? p.productLine?.name ?? "—";
    const category = p.category?.name ?? "—";

    return {
      "Название": p.name,
      "Ссылка на сайте": siteUrl,
      "Раздел": category,
      "Бренд": brand,
      "Маркетплейс": mpSources.join(", ") || "—",
      "WB nmId": wbNmId ?? "—",
      "Ссылка WB": wbUrl || "—",
      "Ozon SKU": ozonSku ?? "—",
      "Ссылка Ozon": ozonUrl || "—",
      "Есть фото": hasImages,
      "Кол-во фото": images.length,
      "Цена на сайте (₽)": p.price ?? "—",
      "Старая цена на сайте (₽)": p.oldPrice ?? "—",
      "Цена WB (₽)": wbPrice,
      "Цена Ozon (₽)": ozonPrice,
      "Отзывы WB (подтянуто)": wbReviews.length,
      "Отзывы Ozon (подтянуто)": ozonReviews.length,
      "Отзывы с сайта": siteReviews.length,
      "Итого отзывов в БД": allReviews.length,
      "Видимых отзывов на сайте": visibleReviews,
    };
  });

  // Build Excel
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Товары");

  // Column widths
  const cols = Object.keys(rows[0] ?? {}).map((key) => ({
    wch: Math.max(key.length, ...rows.map((r) => String(r[key as keyof typeof r] ?? "").length)) + 2,
  }));
  ws["!cols"] = cols;

  const outPath = path.join(process.cwd(), `ecokon-products-${today}.xlsx`);
  XLSX.writeFile(wb, outPath);
  console.log(`\n✓ Файл сохранён: ${outPath}`);
  console.log(`  Товаров: ${rows.length}`);
  console.log(`  Ozon acc1 цены: ${Object.keys(ozon1PriceBySlug).length} товаров`);
  console.log(`  Ozon acc2 цены: ${Object.keys(ozon2PriceBySlug).length} товаров`);
  console.log(`  WB acc1 цены: ${Object.keys(wb1Prices).length} позиций`);
  console.log(`  WB acc2 цены: ${Object.keys(wb2Prices).length} позиций`);

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("[EXPORT] Ошибка:", err);
  await prisma.$disconnect();
  process.exit(1);
});
