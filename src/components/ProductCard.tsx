"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { BrandLabel } from "@/components/BrandLabel";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/catalog";
import { useCartStore } from "@/store/cartStore";
import type { ProductWithLine } from "@/types/database";

const badgeMap: Record<string, { variant: "bestseller" | "new" | "sale"; label: string }> = {
  bestseller: { variant: "bestseller", label: "Хит" },
  new: { variant: "new", label: "Новинка" },
  sale: { variant: "sale", label: "Скидка" },
};

export function ProductCard({ product }: { product: ProductWithLine }) {
  const addItem = useCartStore((s) => s.addItem);
  const brand = product.productLine?.brand || "ecokon";

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    addItem({
      product_id: product.id,
      name: product.name,
      brand,
      price: product.price,
      quantity: 1,
      image: (product.images as string[])[0] || "",
      slug: product.slug,
      weight_grams: product.weightGrams,
    });
  }

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.01]">
      <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-brand-gray-light">
          {(product.images as string[])[0] ? (
            <Image
              src={(product.images as string[])[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl text-brand-gray-dark/15">
              {brand === "ecokon" ? "🌿" : "🌱"}
            </div>
          )}

          {/* BrandLabel — top left */}
          <div className="absolute left-2 top-2">
            <BrandLabel brand={brand as "ecokon" | "tsvetologiya"} />
          </div>

          {/* Badge — top right */}
          <div className="absolute right-2 top-2 flex flex-col gap-1">
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
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-brand-green md:text-base">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-brand-gray-dark/50">
              ({product.reviewsCount.toLocaleString("ru-RU")})
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-brand-gray-dark/40 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="px-4 pb-4">
        <Button size="sm" className="w-full" onClick={handleAddToCart}>
          В корзину
        </Button>
      </div>
    </div>
  );
}
