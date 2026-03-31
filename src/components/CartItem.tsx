"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, type CartItem as CartItemType } from "@/store/cartStore";
import { formatPrice } from "@/lib/catalog";

export function CartItem({ item }: { item: CartItemType }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 rounded-xl border border-brand-gray-light p-4">
      {/* Image */}
      <div className="h-16 w-16 shrink-0 rounded-lg bg-brand-gray-light flex items-center justify-center text-2xl text-brand-gray-dark/15">
        {item.brand === "ecokon" ? "🌿" : "🌱"}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${item.slug}`}
            className="text-sm font-semibold leading-snug hover:text-brand-green line-clamp-2"
          >
            {item.name}
          </Link>
          <button
            onClick={() => removeItem(item.product_id, item.variant_id)}
            className="shrink-0 rounded-lg p-1.5 text-brand-gray-dark/40 hover:bg-brand-gray-light hover:text-error transition-colors"
            aria-label="Удалить"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {item.variant_id && (
          <span className="text-xs text-brand-gray-dark/50">
            Вариант: {item.variant_id}
          </span>
        )}

        <div className="flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center rounded-lg border border-brand-gray-light">
            <button
              onClick={() =>
                updateQuantity(item.product_id, item.quantity - 1, item.variant_id)
              }
              className="flex h-8 w-8 items-center justify-center text-brand-gray-dark/60 hover:text-brand-gray-dark"
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
              className="flex h-8 w-8 items-center justify-center text-brand-gray-dark/60 hover:text-brand-gray-dark"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Line total */}
          <span className="text-sm font-bold">{formatPrice(lineTotal)}</span>
        </div>
      </div>
    </div>
  );
}
