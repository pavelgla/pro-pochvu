"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CartItem } from "@/components/CartItem";
import { CartSummary } from "@/components/CartSummary";
import { CartRecommendations } from "@/components/CartRecommendations";
import { useCartStore } from "@/store/cartStore";
import { useCartHydrated } from "@/hooks/useCart";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const hydrated = useCartHydrated();

  // Avoid hydration mismatch
  if (!hydrated) {
    return (
      <div className="container-main section-padding">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Корзина" }]} />
        <h1 className="mt-4">Корзина</h1>
        <div className="mt-8 flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-accent" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-main section-padding">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Корзина" }]} />
        <h1 className="mt-4">Корзина</h1>
        <div className="mt-8 flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCart className="h-16 w-16 text-mute/30" />
          <p className="mt-4 text-lg font-medium text-mute">
            Корзина пуста
          </p>
          <p className="mt-1 text-sm text-mute/60">
            Добавьте товары из каталога
          </p>
          <Link href="/catalog" className="mt-6">
            <Button>Перейти в каталог</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main section-padding">
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Корзина" }]} />

      <div className="mt-4 flex items-center justify-between">
        <h1>Корзина</h1>
        <button
          onClick={clearCart}
          className="text-sm text-mute hover:text-error transition-colors"
        >
          Очистить корзину
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <CartItem
              key={`${item.product_id}:${item.variant_id || ""}`}
              item={item}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24">
          <CartSummary />
        </div>
      </div>

      <CartRecommendations />
    </div>
  );
}
