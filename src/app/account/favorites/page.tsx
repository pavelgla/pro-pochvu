"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ProductCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/catalog?limit=3")
      .then((res) => res.json())
      .then((data) => setFavorites(data.products || []))
      .finally(() => setLoading(false));
  }, []);

  function removeFavorite(productId: string) {
    setFavorites(favorites.filter((p) => p.id !== productId));
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2>Избранное</h2>

      {favorites.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-mute">
            Список избранного пуст
          </p>
          <Link href="/catalog" className="mt-4 inline-block">
            <Button variant="secondary">Перейти в каталог</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {favorites.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <button
                onClick={() => removeFavorite(product.id)}
                className="absolute right-2 bottom-16 z-10 rounded-lg bg-bg p-2 shadow-md text-mute/60 hover:text-error transition-colors"
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
