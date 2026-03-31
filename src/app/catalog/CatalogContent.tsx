"use client";

import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import { CatalogSort } from "@/components/CatalogSort";
import { CatalogPagination } from "@/components/CatalogPagination";
import { getProducts, type CatalogFilters as Filters } from "@/lib/catalog";

export function CatalogContent({ productLineSlug }: { productLineSlug?: string }) {
  const searchParams = useSearchParams();

  const filters: Filters = {
    brand: searchParams.get("brand") || undefined,
    productLine: productLineSlug || undefined,
    category: searchParams.get("category") || undefined,
    priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
    priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined,
    sort: (searchParams.get("sort") as Filters["sort"]) || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: 12,
  };

  const { products, total, page, totalPages } = getProducts(filters);

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <CatalogFilters productLineSlug={productLineSlug} />

      <div className="flex-1">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-brand-gray-dark/60">
            {total} {total === 1 ? "товар" : total < 5 ? "товара" : "товаров"}
          </p>
          <CatalogSort />
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-brand-gray-dark/60">
              Товары не найдены
            </p>
            <p className="mt-1 text-sm text-brand-gray-dark/40">
              Попробуйте изменить фильтры
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8">
          <CatalogPagination page={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
