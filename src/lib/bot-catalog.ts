// Live catalog lookup for the site assistant (bot tool `search_catalog`).
// Kept separate from `catalog.ts`: the storefront needs pagination and sorting,
// the assistant needs a short answer it can read out loud without lying about stock.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pro-pochvu.ru";

export const BOT_SEARCH_DEFAULT_LIMIT = 5;
export const BOT_SEARCH_MAX_LIMIT = 20;

// Words that carry no meaning for a catalogue lookup but would narrow it to nothing.
const STOP_WORDS = new Set([
  "для", "или", "что", "как", "это", "чем", "при", "под", "над", "без", "тоже", "если",
  "мне", "вам", "нам", "ваш", "наш", "есть", "нужно", "надо", "можно", "хочу", "купить",
  "посоветуйте", "подскажите", "пожалуйста", "удобрение", "удобрения",
]);

const BRANDS = ["ecokon", "tsvetologiya"] as const;
type Brand = (typeof BRANDS)[number];

export type BotSearchParams = {
  q?: string;
  brand?: Brand;
  productLine?: string;
  priceMin?: number;
  priceMax?: number;
  limit: number;
};

function positiveNumber(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

export function parseBotSearchParams(sp: URLSearchParams): BotSearchParams {
  const brand = (sp.get("brand") || "").trim() as Brand;
  const limit = positiveNumber(sp.get("limit"));

  return {
    q: (sp.get("q") || "").trim() || undefined,
    brand: BRANDS.includes(brand) ? brand : undefined,
    productLine: (sp.get("productLine") || "").trim() || undefined,
    priceMin: positiveNumber(sp.get("priceMin")),
    priceMax: positiveNumber(sp.get("priceMax")),
    limit: Math.min(Math.floor(limit || BOT_SEARCH_DEFAULT_LIMIT), BOT_SEARCH_MAX_LIMIT),
  };
}

// Poor man's Russian stemming: the catalogue says «для рассады», the buyer writes «рассада»,
// and a plain LIKE on the whole word misses it. Keeping the first five letters covers the
// endings; a slightly wider match is far cheaper than a missed product in a 14-item catalogue.
const STEM_LENGTH = 5;

function stem(word: string): string {
  return word.length > STEM_LENGTH ? word.slice(0, STEM_LENGTH) : word;
}

export function botSearchStems(q?: string): string[] {
  return (q || "")
    .toLowerCase()
    .split(/[^a-zA-Zа-яА-ЯёЁ0-9]+/)
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word))
    .map(stem);
}

// A hit in the product name beats a hit buried in the description: «рассада томатов» must
// surface «Удобрение для рассады», not the bestseller that happens to mention tomatoes.
export function rankBotResults<T extends { name: string; reviewsCount: number }>(
  products: T[],
  stems: string[]
): T[] {
  const nameScore = (product: T) => {
    const name = product.name.toLowerCase();
    return stems.filter((s) => name.includes(s)).length;
  };
  return [...products].sort(
    (a, b) => nameScore(b) - nameScore(a) || b.reviewsCount - a.reviewsCount
  );
}

export function buildBotCatalogWhere(params: BotSearchParams, showTsvetologiya: boolean) {
  const where: Record<string, any> = { isActive: true };

  // People type "рассада томатов" or "чем подкормить орхидею", never a product name, so the
  // phrase is matched word by word: every meaningful word must appear somewhere in the card.
  const words = botSearchStems(params.q);
  if (words.length) {
    where.AND = words.map((word) => ({
      OR: [
        { name: { contains: word, mode: "insensitive" } },
        { shortDesc: { contains: word, mode: "insensitive" } },
        { fullDesc: { contains: word, mode: "insensitive" } },
      ],
    }));
  }

  // With the flag off, /catalog/fitmoduli and the tsvetologiya lines are 404 —
  // the assistant must not be able to send anyone there.
  const brand = showTsvetologiya ? params.brand : "ecokon";
  const productLine: Record<string, any> = {};
  if (brand) productLine.brand = brand;
  if (params.productLine) productLine.slug = params.productLine;
  if (Object.keys(productLine).length) where.productLine = productLine;

  if (params.priceMin || params.priceMax) {
    where.price = {};
    if (params.priceMin) where.price.gte = params.priceMin;
    if (params.priceMax) where.price.lte = params.priceMax;
  }

  return where;
}

type BotProductInput = {
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  rating: number;
  reviewsCount: number;
  weightGrams: number;
  productLine: { name: string; slug: string; brand: string } | null;
};

export function serializeBotProduct(product: BotProductInput) {
  return {
    name: product.name,
    slug: product.slug,
    price: product.price,
    oldPrice: product.oldPrice ?? null,
    // A flag, not a count: how many bags are on the shelf is none of the buyer's business.
    inStock: product.stock > 0,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    weightGrams: product.weightGrams,
    productLine: product.productLine?.name ?? null,
    brand: product.productLine?.brand ?? null,
    url: `${SITE_URL}/product/${product.slug}`,
  };
}
