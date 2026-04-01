"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/catalog";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import type { DeliveryOption } from "@/types/delivery";

type Props = {
  deliveryOption: DeliveryOption | null;
};

export function OrderSummary({ deliveryOption }: Props) {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const promo = useCartStore((s) => s.promo);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCost =
    subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : (deliveryOption?.cost || 0);
  const total = subtotal - discount + deliveryCost;

  return (
    <div className="rounded-2xl border border-brand-gray-light p-5 space-y-4">
      <h3 className="text-base font-bold">Ваш заказ</h3>

      {/* Mini items list */}
      <div className="max-h-48 space-y-2 overflow-auto">
        {items.map((item) => (
          <div
            key={`${item.product_id}:${item.variant_id || ""}`}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 shrink-0 rounded-lg bg-brand-gray-light flex items-center justify-center text-sm text-brand-gray-dark/15">
              {item.brand === "ecokon" ? "🌿" : "🌱"}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${item.slug}`}
                className="text-xs font-medium line-clamp-1 hover:text-brand-green"
              >
                {item.name}
              </Link>
              <p className="text-xs text-brand-gray-dark/50">
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
      <div className="space-y-1.5 border-t border-brand-gray-light pt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-gray-dark/60">Товары ({items.length})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Скидка ({promo?.code})</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-brand-gray-dark/60">Доставка</span>
          <span>
            {deliveryOption
              ? deliveryCost === 0
                ? "Бесплатно"
                : formatPrice(deliveryCost)
              : "—"}
          </span>
        </div>
        <div className="flex justify-between border-t border-brand-gray-light pt-2 text-base font-bold">
          <span>Итого</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
