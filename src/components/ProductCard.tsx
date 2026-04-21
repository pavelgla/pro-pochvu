"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { BrandLabel } from "@/components/BrandLabel";
import { formatPrice } from "@/lib/catalog";
import type { ProductWithLine } from "@/types/database";

const badgeMap: Record<string, { variant: "bestseller" | "new" | "sale"; label: string }> = {
  bestseller: { variant: "bestseller", label: "Хит" },
  new: { variant: "new", label: "Новинка" },
  sale: { variant: "sale", label: "Скидка" },
};

export function ProductCard({ product }: { product: ProductWithLine }) {
  const brand = product.productLine?.brand || "ecokon";

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-brand-gray-light">
        {(product.images as string[])[0] ? (
          <Image
            src={(product.images as string[])[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-brand-gray-dark/15">
            {brand === "ecokon" ? "🌿" : "🌱"}
          </div>
        )}

        {/* BrandLabel — top left */}
        <div className="absolute left-1.5 top-1.5">
          <BrandLabel brand={brand as "ecokon" | "tsvetologiya"} />
        </div>

        {/* Badge — top right */}
        <div className="absolute right-1.5 top-1.5 flex flex-col gap-0.5">
          {product.badge && badgeMap[product.badge] && (
            <Badge variant={badgeMap[product.badge].variant}>
              {badgeMap[product.badge].label}
            </Badge>
          )}
          {discountPercent && (
            <Badge variant="sale">-{discountPercent}%</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-2.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold md:text-base">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-brand-gray-dark/40 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <h3 className="mt-1 text-xs leading-snug line-clamp-2 text-brand-gray-dark/80 group-hover:text-brand-green sm:text-sm">
          {product.name}
        </h3>

        <div className="mt-1.5 flex items-center gap-0.5 text-xs text-brand-gray-dark/50">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-brand-gray-dark/70">{product.rating}</span>
          <span>({product.reviewsCount.toLocaleString("ru-RU")})</span>
        </div>
      </div>
    </Link>
  );
}
