"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/catalog";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

export function CartSummary() {
  const { promo, setPromo, getSubtotal, getDiscount } = useCartStore();
  const items = useCartStore((s) => s.items);
  const [promoInput, setPromoInput] = useState(promo?.code || "");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = subtotal - discount;
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  const freeDelivery = remaining <= 0;
  const progressPct = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  // Unique brands in cart
  const brands = Array.from(new Set(items.map((i) => i.brand)));

  async function applyPromo() {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError("");

    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoInput.trim(),
          subtotal,
          brands,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPromoError(data.error || "Ошибка проверки промокода");
        setPromo(null);
      } else {
        setPromo(data);
        setPromoError("");
      }
    } catch {
      setPromoError("Ошибка сети");
    } finally {
      setPromoLoading(false);
    }
  }

  function removePromo() {
    setPromo(null);
    setPromoInput("");
    setPromoError("");
  }

  return (
    <div className="rounded-2xl border border-line p-6 space-y-5">
      {/* Free delivery progress */}
      <div>
        {freeDelivery ? (
          <p className="text-sm font-medium text-success">
            ✓ Бесплатная доставка!
          </p>
        ) : (
          <p className="text-sm text-mute">
            Ещё <span className="font-bold text-ink">{formatPrice(remaining)}</span>{" "}
            до бесплатной доставки
          </p>
        )}
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg-soft">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Promo code */}
      <div>
        {promo ? (
          <div className="flex items-center justify-between rounded-lg bg-accent/5 px-3 py-2">
            <span className="text-sm">
              <span className="font-bold text-accent">{promo.code}</span>
              {" — "}
              {promo.discount_type === "percent"
                ? `-${promo.discount_value}%`
                : `-${formatPrice(promo.discount_value)}`}
            </span>
            <button
              onClick={removePromo}
              className="text-xs text-ink/50 hover:text-error"
            >
              Убрать
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              placeholder="Промокод"
              className="h-10 flex-1 rounded-xl border border-line px-3 text-sm uppercase focus:border-accent focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && applyPromo()}
            />
            <Button
              size="sm"
              variant="secondary"
              loading={promoLoading}
              onClick={applyPromo}
            >
              Применить
            </Button>
          </div>
        )}
        {promoError && (
          <p className="mt-1 text-xs text-error">{promoError}</p>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-mute">Товары</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Скидка</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-mute">Доставка</span>
          <span className="text-mute/60">Рассчитаем далее</span>
        </div>
        <div className="flex justify-between border-t border-line pt-2 text-lg font-bold">
          <span>Итого</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Checkout CTA */}
      <Link href="/checkout">
        <Button size="lg" className="w-full">
          Оформить заказ
        </Button>
      </Link>
    </div>
  );
}
