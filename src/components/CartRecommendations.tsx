"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/store/cartStore";

export function CartRecommendations() {
  const items = useCartStore((s) => s.items);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (items.length === 0) return;
    // Show products from the other brand
    const firstBrand = items[0].brand;
    const otherBrand = firstBrand === "ecokon" ? "tsvetologiya" : "ecokon";
    fetch(`/api/catalog?brand=${otherBrand}&limit=3`)
      .then((res) => res.json())
      .then((data) => setRecommendations(data.products || []));
  }, [items]);

  if (items.length === 0 || recommendations.length === 0) return null;

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
