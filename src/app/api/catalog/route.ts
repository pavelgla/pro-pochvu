import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProductLines, getCategories, type CatalogFilters } from "@/lib/catalog";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const action = sp.get("action");

  if (action === "productLines") {
    const lines = await getProductLines();
    return NextResponse.json(lines);
  }

  if (action === "categories") {
    const productLineId = sp.get("productLineId") || undefined;
    const categories = await getCategories(productLineId);
    return NextResponse.json(categories);
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

  const result = await getProducts(filters);
  return NextResponse.json(result);
}
