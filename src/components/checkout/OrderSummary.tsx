"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/catalog";
import { FREE_DELIVERY_THRESHOLD, OZON_DELIVERY_COST } from "@/lib/constants";

export function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const promo = useCartStore((s) => s.promo);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCost =
    subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : OZON_DELIVERY_COST;
  const total = subtotal - discount + deliveryCost;

  return (
    <div className="rounded-2xl border border-line p-5 space-y-4">
      <h3 className="text-base font-bold">Ваш заказ</h3>

      {/* Mini items list */}
      <div className="max-h-48 space-y-2 overflow-auto">
        {items.map((item) => (
          <div
            key={`${item.product_id}:${item.variant_id || ""}`}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 shrink-0 rounded-lg bg-bg-soft flex items-center justify-center text-sm text-mute/30">
              {item.brand === "ecokon" ? "🌿" : "🌱"}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${item.slug}`}
                className="text-xs font-medium line-clamp-1 hover:text-accent"
              >
                {item.name}
              </Link>
              <p className="text-xs text-mute">
                {item.quantity} x {formatPrice(item.price)}
              </p>
            </div>
            <span className="shrink-0 text-xs font-bold">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-1.5 border-t border-line pt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-mute">Товары ({items.length})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Скидка ({promo?.code})</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-mute">Доставка</span>
          <span>{deliveryCost === 0 ? "Бесплатно" : formatPrice(deliveryCost)}</span>
        </div>
        <div className="flex justify-between border-t border-line pt-2 text-base font-bold">
          <span>Итого</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
