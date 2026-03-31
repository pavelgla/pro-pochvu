"use client";

import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { getCrossSellProducts } from "@/lib/catalog";
import type { Product } from "@/types/database";

export function CartRecommendations() {
  const items = useCartStore((s) => s.items);

  if (items.length === 0) return null;

  // Get cross-sell based on first item's brand
  const firstBrand = items[0].brand;
  const mockProduct = { brand: firstBrand } as Product;
  const recommendations = getCrossSellProducts(mockProduct, 3);

  if (recommendations.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6">Дополните заказ</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {recommendations.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
