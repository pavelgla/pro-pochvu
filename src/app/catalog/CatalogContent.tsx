"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import { CatalogSort } from "@/components/CatalogSort";
import { CatalogPagination } from "@/components/CatalogPagination";
type CatalogResult = {
  products: any[];
  total: number;
  page: number;
  totalPages: number;
};

export function CatalogContent({ productLineSlug }: { productLineSlug?: string }) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<CatalogResult>({ products: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (productLineSlug) params.set("productLine", productLineSlug);
    const brand = searchParams.get("brand");
    if (brand) params.set("brand", brand);
    const category = searchParams.get("category");
    if (category) params.set("category", category);
    const priceMin = searchParams.get("priceMin");
    if (priceMin) params.set("priceMin", priceMin);
    const priceMax = searchParams.get("priceMax");
    if (priceMax) params.set("priceMax", priceMax);
    const rating = searchParams.get("rating");
    if (rating) params.set("rating", rating);
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);
    const page = searchParams.get("page");
    if (page) params.set("page", page);
    params.set("limit", "12");

    setLoading(true);
    fetch(`/api/catalog?${params.toString()}`)
      .then((res) => res.json())
      .then((result) => setData(result))
      .finally(() => setLoading(false));
  }, [searchParams, productLineSlug]);

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <CatalogFilters productLineSlug={productLineSlug} />

      <div className="flex-1">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-mute">
            {data.total} {data.total === 1 ? "товар" : data.total < 5 ? "товара" : "товаров"}
          </p>
          <CatalogSort />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-accent" />
          </div>
        ) : data.products.length > 0 ? (
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-mute">
              Товары не найдены
            </p>
            <p className="mt-1 text-sm text-mute/60">
              Попробуйте изменить фильтры
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8">
          <CatalogPagination page={data.page} totalPages={data.totalPages} />
        </div>
      </div>
    </div>
  );
}
