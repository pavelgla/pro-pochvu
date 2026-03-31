"use client";

import { useState } from "react";
import { Star, Heart, Minus, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BrandLabel } from "@/components/BrandLabel";
import { VariantSelector } from "@/components/VariantSelector";
import { ProductCharacteristics } from "@/components/ProductCharacteristics";
import { formatPrice } from "@/lib/catalog";
import type { Product } from "@/types/database";

export function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  const discountPercent =
    product.price_old && product.price_old > product.price
      ? Math.round(((product.price_old - product.price) / product.price_old) * 100)
      : null;

  function scrollToReviews() {
    document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="space-y-5">
      {/* Brand */}
      <BrandLabel brand={product.brand as "ecokon" | "tsvetologiya"} />

      {/* Name */}
      <h1 className="text-2xl md:text-3xl">{product.name}</h1>

      {/* Rating — clickable */}
      <button
        onClick={scrollToReviews}
        className="flex items-center gap-2 text-sm hover:underline"
      >
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{product.rating} из 5</span>
        <span className="text-brand-gray-dark/50">
          ({product.reviews_count.toLocaleString("ru-RU")} отзывов)
        </span>
      </button>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
        {product.price_old && (
          <span className="text-lg text-brand-gray-dark/40 line-through">
            {formatPrice(product.price_old)}
          </span>
        )}
        {discountPercent && (
          <Badge variant="sale" size="md">-{discountPercent}%</Badge>
        )}
      </div>

      {/* Variants */}
      {hasVariants && (
        <VariantSelector
          variants={product.variants}
          selectedId={selectedVariant}
          onSelect={setSelectedVariant}
        />
      )}

      {/* Compact characteristics */}
      <ProductCharacteristics characteristics={product.characteristics} compact />

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-brand-gray-dark/70">Количество</span>
        <div className="flex items-center rounded-xl border border-brand-gray-light">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-10 w-10 items-center justify-center text-brand-gray-dark/60 hover:text-brand-gray-dark transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (v >= 1 && v <= product.stock) setQuantity(v);
            }}
            min={1}
            max={product.stock}
            className="h-10 w-14 text-center text-sm font-medium border-x border-brand-gray-light focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="flex h-10 w-10 items-center justify-center text-brand-gray-dark/60 hover:text-brand-gray-dark transition-colors"
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-xs text-brand-gray-dark/40">
          В наличии: {product.stock} шт.
        </span>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3">
        <Button size="lg" className="flex-1">
          Добавить в корзину
        </Button>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="flex h-13 w-13 items-center justify-center rounded-xl border-2 border-brand-gray-light transition-colors hover:border-brand-green/50"
          aria-label="В избранное"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? "fill-error text-error" : "text-brand-gray-dark/40"
            }`}
          />
        </button>
      </div>

      <Button variant="secondary" className="w-full">
        Купить в 1 клик
      </Button>

      {/* Delivery info */}
      <div className="flex items-start gap-3 rounded-xl bg-brand-gray-light/50 p-4">
        <Package className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
        <div className="text-sm">
          <p className="font-medium">Доставка от 99 ₽ по всей России</p>
          <p className="mt-0.5 text-brand-gray-dark/60">
            5Post, Boxberry, Почта России, СДЭК
          </p>
        </div>
      </div>
    </div>
  );
}
