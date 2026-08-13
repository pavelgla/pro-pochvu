"use client";

import { useState } from "react";
import { Star, Heart, Minus, Plus, Weight, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BrandLabel } from "@/components/BrandLabel";
import { VariantSelector } from "@/components/VariantSelector";
import { ProductCharacteristics } from "@/components/ProductCharacteristics";
import { MarketplaceButtons } from "@/components/MarketplaceButtons";

import { getMarketplaceLinks } from "@/lib/marketplace-map";
import { trackGoal, GOAL } from "@/lib/analytics";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/catalog";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";
import type { ProductWithLine } from "@/types/database";

export function ProductInfo({ product }: { product: ProductWithLine }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const links = getMarketplaceLinks(product.slug);
  const hasMarketplace = Boolean(links.wb || links.ozon);
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

  function handleAddToCart() {
    addItem({
      product_id: product.id,
      variant_id: selectedVariant ?? undefined,
      name: product.name,
      brand,
      price: product.price,
      quantity,
      image: Array.isArray(product.images) ? ((product.images as string[])[0] ?? "") : "",
      slug: product.slug,
      weight_grams: product.weightGrams,
    });
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

      {/* Quality certificate — ЭКО Конь fertilizers (система «Эко Лайн», до 08.2029) */}
      {["bio-chay", "specialized"].includes(product.productLine?.slug ?? "") && (
        <a
          href="/certificates/sertifikat-sootvetstviya-eko-kon.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-mute transition-colors hover:text-ink"
        >
          <FileCheck className="h-4 w-4 shrink-0 text-success" />
          Сертификат соответствия экологическим требованиям (PDF)
        </a>
      )}

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

      {/* Favorite */}
      <FavoriteButton />

      {product.sellDirect && inStock ? (
        /* Direct sale — own cart, marketplaces as secondary links */
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full" onClick={handleAddToCart}>
            В корзину
          </Button>
          {hasMarketplace && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-mute">Также на маркетплейсах</p>
              <MarketplaceButtons
                wb={links.wb}
                ozon={links.ozon}
                slug={product.slug}
                source="product"
              />
            </div>
          )}
        </div>
      ) : (
        /* Marketplace-first mode */
        <div className="flex flex-col gap-2">
          {hasMarketplace ? (
            <>
              <p className="text-sm text-mute">
                Доставка и оплата — на маркетплейсе
              </p>
              <MarketplaceButtons
                wb={links.wb}
                ozon={links.ozon}
                slug={product.slug}
                source="product"
              />
            </>
          ) : (
            <p className="rounded-xl border border-line bg-bg-soft px-4 py-3 text-sm text-mute">
              Уточняйте наличие на наших страницах Wildberries и Ozon.
            </p>
          )}
        </div>
      )}

      {/* Mobile sticky buy bar — own cart */}
      {product.sellDirect && inStock && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            <span className="shrink-0 font-serif text-lg font-semibold text-ink">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-xl bg-accent py-2.5 text-center text-sm font-semibold text-white"
            >
              В корзину
            </button>
          </div>
        </div>
      )}

      {/* Mobile sticky buy bar — marketplaces */}
      {!(product.sellDirect && inStock) && hasMarketplace && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            <span className="shrink-0 font-serif text-lg font-semibold text-ink">
              {formatPrice(product.price)}
            </span>
            <div className="flex flex-1 gap-2">
              {links.ozon && (
                <a
                  href={links.ozon}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackGoal(GOAL.MARKETPLACE_CLICK, { marketplace: "ozon", slug: product.slug, source: "sticky" })
                  }
                  className="flex-1 rounded-xl bg-[#005BFF] py-2.5 text-center text-sm font-semibold text-white"
                >
                  Ozon
                </a>
              )}
              {links.wb && (
                <a
                  href={links.wb}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackGoal(GOAL.MARKETPLACE_CLICK, { marketplace: "wb", slug: product.slug, source: "sticky" })
                  }
                  className="flex-1 rounded-xl bg-[#CB11AB] py-2.5 text-center text-sm font-semibold text-white"
                >
                  WB
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function FavoriteButton() {
    return (
      <button
        onClick={() => {
          if (!user) {
            router.push(`/auth/login?return=/product/${product.slug}`);
            return;
          }
          setIsFavorite(!isFavorite);
        }}
        className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-ink"
        aria-label="В избранное"
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isFavorite ? "fill-error text-error" : "text-mute/60"
          }`}
        />
        {isFavorite ? "В избранном" : "В избранное"}
      </button>
    );
  }
}
