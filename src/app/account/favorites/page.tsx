"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/catalog";
import type { Product } from "@/types/database";

export default function FavoritesPage() {
  // Mock: show first 3 products as favorites
  const { products: allProducts } = getProducts({ limit: 3 });
  const [favorites, setFavorites] = useState<Product[]>(allProducts);

  function removeFavorite(productId: string) {
    setFavorites(favorites.filter((p) => p.id !== productId));
  }

  return (
    <div className="space-y-6">
      <h2>Избранное</h2>

      {favorites.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-brand-gray-dark/60">
            Список избранного пуст
          </p>
          <Link href="/catalog" className="mt-4 inline-block">
            <Button variant="secondary">Перейти в каталог</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <button
                onClick={() => removeFavorite(product.id)}
                className="absolute right-2 bottom-16 z-10 rounded-lg bg-white p-2 shadow-md text-brand-gray-dark/40 hover:text-error transition-colors"
                aria-label="Удалить из избранного"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
