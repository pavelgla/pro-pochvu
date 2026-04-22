"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/catalog";
import type { ProductWithLine } from "@/types/database";

export function ProductCard({ product }: { product: ProductWithLine }) {
  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const brand = product.productLine?.brand;
  const brandLabel = brand === "ecokon" ? "ЭКО КОНЬ" : "ЦВЕТОЛОГИЯ";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col transition-transform duration-200 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-bg-soft">
        {(product.images as string[])[0] ? (
          <Image
            src={(product.images as string[])[0]}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-mute/30">
            🌿
          </div>
        )}

        {/* Tag top-left */}
        {product.badge && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-bg px-3 py-1 text-[10px] tracking-[0.08em] text-ink">
            {product.badge === "bestseller"
              ? "ХИТ"
              : product.badge === "new"
              ? "НОВИНКА"
              : discountPercent
              ? `-${discountPercent}%`
              : "СКИДКА"}
          </span>
        )}

        {/* Add button bottom-right */}
        <div className="absolute bottom-3.5 right-3.5 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-lg text-bg transition-all group-hover:bg-accent group-hover:scale-[1.08]">
          +
        </div>

        {/* Heart top-right (visible on hover) */}
        <div className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-bg opacity-0 transition-opacity group-hover:opacity-100">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 15.5 S2 11 2 6.5C2 4 4 2.5 6 2.5c1.5 0 2.5 1 3 2 .5-1 1.5-2 3-2 2 0 4 1.5 4 4 0 4.5-7 9-7 9Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Brand label bottom-left */}
        <span className="absolute bottom-3.5 left-3.5 rounded-sm bg-white/90 px-2.5 py-1 text-[9px] tracking-[0.1em]">
          {brandLabel}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-1 pt-4 pb-2">
        <div className="text-[11px] tracking-[0.05em] text-mute uppercase mb-2">
          {product.category?.name}
        </div>
        <h3 className="font-serif text-lg font-medium leading-tight tracking-tight line-clamp-2 min-h-[44px]">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between pt-3.5">
          <div>
            <div className="font-serif text-2xl font-semibold tracking-tight text-ink">
              {formatPrice(product.price)}
            </div>
            {product.oldPrice && (
              <div className="mt-0.5 text-xs text-mute line-through">
                {formatPrice(product.oldPrice)}
              </div>
            )}
          </div>
          <div className="text-[11px] text-ink-2">
            ★ {product.rating?.toFixed(1)} ({product.reviewsCount?.toLocaleString("ru-RU")})
          </div>
        </div>
      </div>
    </Link>
  );
}
