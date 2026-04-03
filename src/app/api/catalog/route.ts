import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProductLines, getCategories, type CatalogFilters } from "@/lib/catalog";

const MOCK_PRODUCTS = Array.from({ length: 4 }, (_, i) => ({
  id: `mock-${i + 1}`,
  name: "Товар недоступен",
  slug: `mock-${i + 1}`,
  price: 0,
  oldPrice: null,
  images: [],
  rating: 0,
  reviewsCount: 0,
  badge: null,
  weightGrams: null,
  isActive: true,
  productLine: null,
  category: null,
}));

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const action = sp.get("action");

  if (action === "productLines") {
    try {
      const lines = await getProductLines();
      return NextResponse.json(lines);
    } catch {
      return NextResponse.json([]);
    }
  }

  if (action === "categories") {
    try {
      const productLineId = sp.get("productLineId") || undefined;
      const categories = await getCategories(productLineId);
      return NextResponse.json(categories);
    } catch {
      return NextResponse.json([]);
    }
  }

  // Default: products
  const filters: CatalogFilters = {
    brand: sp.get("brand") || undefined,
    productLine: sp.get("productLine") || undefined,
    category: sp.get("category") || undefined,
    priceMin: sp.get("priceMin") ? Number(sp.get("priceMin")) : undefined,
    priceMax: sp.get("priceMax") ? Number(sp.get("priceMax")) : undefined,
    rating: sp.get("rating") ? Number(sp.get("rating")) : undefined,
    sort: (sp.get("sort") as CatalogFilters["sort"]) || undefined,
    page: sp.get("page") ? Number(sp.get("page")) : 1,
    limit: sp.get("limit") ? Number(sp.get("limit")) : 12,
  };

  try {
    const result = await getProducts(filters);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      products: MOCK_PRODUCTS,
      total: 4,
      page: 1,
      totalPages: 1,
    });
  }
}
