import { describe, it, expect } from "vitest";
import {
  parseBotSearchParams,
  buildBotCatalogWhere,
  serializeBotProduct,
  BOT_SEARCH_MAX_LIMIT,
} from "./bot-catalog";

const sp = (qs: string) => new URLSearchParams(qs);

describe("parseBotSearchParams", () => {
  it("defaults to five results", () => {
    expect(parseBotSearchParams(sp("")).limit).toBe(5);
  });
  it("caps the limit so the assistant cannot dump the whole price list", () => {
    expect(parseBotSearchParams(sp("limit=500")).limit).toBe(BOT_SEARCH_MAX_LIMIT);
  });
  it("keeps a sane limit", () => {
    expect(parseBotSearchParams(sp("limit=12")).limit).toBe(12);
  });
  it("falls back to the default on garbage input", () => {
    expect(parseBotSearchParams(sp("limit=abc&priceMax=abc")).limit).toBe(5);
    expect(parseBotSearchParams(sp("priceMax=abc")).priceMax).toBeUndefined();
  });
  it("reads the search text and filters", () => {
    const p = parseBotSearchParams(sp("q=орхидея&brand=ecokon&productLine=bio-chay&priceMin=500&priceMax=1200"));
    expect(p).toMatchObject({
      q: "орхидея",
      brand: "ecokon",
      productLine: "bio-chay",
      priceMin: 500,
      priceMax: 1200,
    });
  });
  it("ignores an unknown brand instead of returning nothing", () => {
    expect(parseBotSearchParams(sp("brand=acme")).brand).toBeUndefined();
  });
});

describe("buildBotCatalogWhere", () => {
  it("never returns inactive products", () => {
    expect(buildBotCatalogWhere({ limit: 5 }, true).isActive).toBe(true);
  });
  it("searches name and description by text", () => {
    const where = buildBotCatalogWhere({ q: "орхид", limit: 5 }, true);
    expect(where.OR).toEqual([
      { name: { contains: "орхид", mode: "insensitive" } },
      { shortDesc: { contains: "орхид", mode: "insensitive" } },
      { fullDesc: { contains: "орхид", mode: "insensitive" } },
    ]);
  });
  it("hides Tsvetologiya when the feature flag is off", () => {
    // Otherwise the assistant sends a buyer to /catalog/fitmoduli, which is a 404
    // while the flag is false — the same dead-anchor bug the blog already paid for.
    const where = buildBotCatalogWhere({ limit: 5 }, false);
    expect(where.productLine).toMatchObject({ brand: "ecokon" });
  });
  it("keeps both brands when the flag is on", () => {
    expect(buildBotCatalogWhere({ limit: 5 }, true).productLine).toBeUndefined();
  });
  it("narrows to the asked brand", () => {
    expect(buildBotCatalogWhere({ brand: "tsvetologiya", limit: 5 }, true).productLine)
      .toMatchObject({ brand: "tsvetologiya" });
  });
  it("drops the asked brand when the flag hides it", () => {
    expect(buildBotCatalogWhere({ brand: "tsvetologiya", limit: 5 }, false).productLine)
      .toMatchObject({ brand: "ecokon" });
  });
  it("applies the price range", () => {
    expect(buildBotCatalogWhere({ priceMin: 500, priceMax: 1200, limit: 5 }, true).price)
      .toEqual({ gte: 500, lte: 1200 });
  });
});

describe("serializeBotProduct", () => {
  const product = {
    name: "Удобрение ЭКО КОНЬ Био-чай для орхидей",
    slug: "bio-chay-orhidei",
    price: 933,
    oldPrice: 1150,
    stock: 200,
    rating: 4.5,
    reviewsCount: 166,
    weightGrams: 80,
    productLine: { name: "Био-чай", slug: "bio-chay", brand: "ecokon" },
  };

  it("gives the assistant an absolute product link", () => {
    expect(serializeBotProduct(product).url).toBe(
      "https://pro-pochvu.ru/product/bio-chay-orhidei"
    );
  });
  it("reports availability as a flag, not as a warehouse number", () => {
    const out = serializeBotProduct(product);
    expect(out.inStock).toBe(true);
    expect(out).not.toHaveProperty("stock");
  });
  it("marks a sold-out product", () => {
    expect(serializeBotProduct({ ...product, stock: 0 }).inStock).toBe(false);
  });
  it("passes price, discount and reviews through", () => {
    expect(serializeBotProduct(product)).toMatchObject({
      name: "Удобрение ЭКО КОНЬ Био-чай для орхидей",
      price: 933,
      oldPrice: 1150,
      rating: 4.5,
      reviewsCount: 166,
      weightGrams: 80,
      productLine: "Био-чай",
      brand: "ecokon",
    });
  });
  it("survives a product without a discount", () => {
    expect(serializeBotProduct({ ...product, oldPrice: null }).oldPrice).toBeNull();
  });
});
