"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, type CartItem as CartItemType } from "@/store/cartStore";
import { BrandLabel } from "@/components/BrandLabel";
import { formatPrice } from "@/lib/catalog";

export function CartItem({ item }: { item: CartItemType }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [imgError, setImgError] = useState(false);

  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 rounded-xl border border-line p-4">
      {/* Image */}
      <div className="h-16 w-16 shrink-0 rounded-lg bg-bg-soft overflow-hidden flex items-center justify-center">
        {item.image && !imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            width={64}
            height={64}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-2xl text-mute/30">
            {item.brand === "ecokon" ? "🌿" : "🌱"}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/product/${item.slug}`}
              className="text-sm font-semibold leading-snug hover:text-accent line-clamp-2"
            >
              {item.name}
            </Link>
            <div className="mt-1">
              <BrandLabel brand={item.brand as "ecokon" | "tsvetologiya"} />
            </div>
          </div>
          <button
            onClick={() => removeItem(item.product_id, item.variant_id)}
            className="shrink-0 rounded-lg p-1.5 text-mute hover:bg-bg-soft hover:text-error transition-colors"
            aria-label="Удалить"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {item.variant_id && (
          <span className="text-xs text-mute">
            Вариант: {item.variant_id}
          </span>
        )}

        <div className="flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center rounded-lg border border-line">
            <button
              onClick={() =>
                updateQuantity(item.product_id, item.quantity - 1, item.variant_id)
              }
              className="flex h-8 w-8 items-center justify-center text-ink-2 hover:text-ink"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(item.product_id, item.quantity + 1, item.variant_id)
              }
              className="flex h-8 w-8 items-center justify-center text-ink-2 hover:text-ink"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-sm font-bold">{formatPrice(lineTotal)}</div>
            {item.quantity > 1 && (
              <div className="text-xs text-mute">
                {formatPrice(item.price)} × {item.quantity}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
