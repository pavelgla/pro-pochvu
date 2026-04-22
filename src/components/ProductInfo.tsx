"use client";

import { useState } from "react";
import { Star, Heart, Minus, Plus, Package, Weight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BrandLabel } from "@/components/BrandLabel";
import { VariantSelector } from "@/components/VariantSelector";
import { ProductCharacteristics } from "@/components/ProductCharacteristics";
import { MarketplaceLeadModal } from "@/components/MarketplaceLeadModal";
import { getMarketplaceLinks } from "@/lib/marketplace-map";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/catalog";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";
import type { ProductWithLine } from "@/types/database";

export function ProductInfo({ product }: { product: ProductWithLine }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [leadModal, setLeadModal] = useState<{ marketplace: "wb" | "ozon"; url: string } | null>(null);
  const links = getMarketplaceLinks(product.slug);
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuth();
  const router = useRouter();
  const brand = product.productLine?.brand || "ecokon";

  const hasVariants = Array.isArray(product.variants) && (product.variants as any[]).length > 0;

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const inStock = product.stock > 0;

  function scrollToReviews() {
    document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="space-y-5">
      {/* Brand */}
      <BrandLabel brand={brand as "ecokon" | "tsvetologiya"} />

      {/* Name */}
      <h1 className="text-2xl md:text-3xl">{product.name}</h1>

      {/* Rating — clickable */}
      {product.reviewsCount > 0 && (
        <button
          onClick={scrollToReviews}
          className="flex items-center gap-2 text-sm hover:underline"
        >
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{product.rating} из 5</span>
          <span className="text-mute">
            ({product.reviewsCount.toLocaleString("ru-RU")} отзывов)
          </span>
          {product.badge && (
            <Badge variant="sale" size="sm">{product.badge}</Badge>
          )}
        </button>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
        {product.oldPrice && (
          <span className="text-lg text-mute/60 line-through">
            {formatPrice(product.oldPrice)}
          </span>
        )}
        {discountPercent && (
          <Badge variant="sale" size="md">-{discountPercent}%</Badge>
        )}
      </div>

      {/* Stock + Weight */}
      <div className="flex items-center gap-4 text-sm">
        <span
          className={`font-medium ${
            inStock ? "text-success" : "text-error"
          }`}
        >
          {inStock ? "В наличии" : "Нет в наличии"}
        </span>
        {product.weightGrams > 0 && (
          <span className="flex items-center gap-1 text-mute">
            <Weight className="h-3.5 w-3.5" />
            {product.weightGrams >= 1000
              ? `${(product.weightGrams / 1000).toFixed(1)} кг`
              : `${product.weightGrams} г`}
          </span>
        )}
      </div>

      {/* Short description */}
      {product.shortDesc && (
        <p className="text-sm leading-relaxed text-ink-2">
          {product.shortDesc}
        </p>
      )}

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
        <span className="text-sm font-medium text-ink-2">Количество</span>
        <div className="flex items-center rounded-xl border border-line">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-10 w-10 items-center justify-center text-mute hover:text-ink transition-colors"
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
            className="h-10 w-14 text-center text-sm font-medium border-x border-line focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="flex h-10 w-10 items-center justify-center text-mute hover:text-ink transition-colors"
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 opacity-60 cursor-not-allowed"
          disabled
          title="Скоро будет доставка с нашего сайта"
        >
          В корзину
        </Button>
        <button
          onClick={() => {
            if (!user) {
              router.push(`/auth/login?return=/product/${product.slug}`);
              return;
            }
            setIsFavorite(!isFavorite);
          }}
          className="flex h-13 w-13 items-center justify-center rounded-xl border-2 border-line transition-colors hover:border-accent/50"
          aria-label="В избранное"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? "fill-error text-error" : "text-mute/60"
            }`}
          />
        </button>
      </div>

      {/* Marketplace buttons */}
      {(links.wb || links.ozon) && (
        <div className="flex flex-col gap-2">
          {links.wb && (
            <Button
              variant="secondary"
              size="lg"
              className="w-full gap-2 border-[#CB11AB] text-[#CB11AB] hover:bg-[#CB11AB]/5"
              onClick={() => setLeadModal({ marketplace: "wb", url: links.wb! })}
            >
              <ShoppingBag className="h-4 w-4" />
              Купить на WB со скидкой
            </Button>
          )}
          {links.ozon && (
            <Button
              variant="secondary"
              size="lg"
              className="w-full gap-2 border-[#005BFF] text-[#005BFF] hover:bg-[#005BFF]/5"
              onClick={() => setLeadModal({ marketplace: "ozon", url: links.ozon! })}
            >
              <ShoppingBag className="h-4 w-4" />
              Купить на Ozon со скидкой
            </Button>
          )}
        </div>
      )}

      {/* Lead modal */}
      {leadModal && (
        <MarketplaceLeadModal
          isOpen
          onClose={() => setLeadModal(null)}
          productSlug={product.slug}
          marketplace={leadModal.marketplace}
          marketplaceUrl={leadModal.url}
          productName={product.name}
        />
      )}

      {/* Delivery info */}
      <div className="flex items-start gap-3 rounded-xl bg-bg-soft/50 p-4">
        <Package className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <div className="text-sm">
          <p className="font-medium">Доставка от 99 ₽ по всей России</p>
          <p className="mt-0.5 text-mute">
            5Post, Boxberry, Почта России, СДЭК
          </p>
        </div>
      </div>
    </div>
  );
}
