// src/lib/marketplace-map.ts
// Статический маппинг slug → ссылки на маркетплейсах.
// Обновляется вручную при добавлении новых товаров.

export interface MarketplaceLinks {
  wb?: string;   // https://www.wildberries.ru/catalog/{nmId}/detail.aspx
  ozon?: string; // https://www.ozon.ru/product/{sku}/
}

const WB_BASE = "https://www.wildberries.ru/catalog";
const OZON_BASE = "https://www.ozon.ru/product";

// WB acc1 (ЭКО Конь, Seller ID: 154039) — nmId
const WB1: Record<string, number> = {
  "bio-chay-yantar-fosfor":           138576640,
  "bio-chay-dekorativno-listvennye":  138576638,
  "udobrenie-ovoshchi":               138576639,
  "udobrenie-kornevaya":              163686285,
  "bio-chay-orhidei":                 177867849,
  "udobrenie-tsitrusovye":            262136598,
  "udobrenie-rassada":                820054512,
  "udobrenie-tsvetushchie":           819695619,
};

// Ozon acc1 (ЭКО Конь, Client-Id: 98587) — SKU
const OZON1: Record<string, number> = {
  "bio-chay-yantar-fosfor":           818346437,
  "bio-chay-dekorativno-listvennye":  821338829,
  "udobrenie-ovoshchi":               818348560,
  "udobrenie-rassada":                3520881009,
  "udobrenie-kornevaya":              1010076465,
  "bio-chay-orhidei":                 1198624077,
  "udobrenie-tsitrusovye":            1694995657,
  "udobrenie-tsvetushchie":           3385802107,
};

// Ozon acc2 (Цветология + Грунт, Client-Id: 2576567) — SKU
const OZON2: Record<string, number> = {
  "fitomodul-50-4-white":         1856412162,
  "fitomodul-50-4-black":         2081828814,
  "fitomodul-50-4-green":         2439041908,
  "kolyshki-skoby-silikon":       2825417652,
  "fitomodul-15-6":               2209878912,
  "grunt-ecokon-20l":             1902553919,
  "grunt-ecokon-ovoshchi":        1902567457,
  "grunt-ecokon-organicheskiy":   1928618714,
};

export function getMarketplaceLinks(slug: string): MarketplaceLinks {
  const links: MarketplaceLinks = {};
  if (WB1[slug]) links.wb = `${WB_BASE}/${WB1[slug]}/detail.aspx`;
  const ozonSku = OZON1[slug] ?? OZON2[slug];
  if (ozonSku) links.ozon = `${OZON_BASE}/${ozonSku}/`;
  return links;
}
