"use client";

import { useEffect } from "react";
import { trackPurchase, type EcommerceProduct } from "@/lib/analytics";

type Props = {
  orderId: string;
  orderNumber: number;
  total: number;
  shipping?: number;
  coupon?: string;
  products: EcommerceProduct[];
  /**
   * Whether the order is actually paid/confirmed per the DB (set by the
   * YooKassa webhook or COD). Must never be derived from a redirect query
   * param — YooKassa returns to the same URL for cancelled payments too.
   */
  enabled: boolean;
};

/**
 * Fires a single Yandex Metrika `purchase` goal + ecommerce dataLayer push
 * the first time this order page is shown after payment.
 *
 * Idempotency: a per-order flag in sessionStorage prevents double-firing
 * if the user reloads /order/[id] in the same tab. Across tabs/devices we
 * rely on the server-side fallback (offline conversions) to dedupe.
 */
export function PurchaseTracker({
  orderId,
  orderNumber,
  total,
  shipping,
  coupon,
  products,
  enabled,
}: Props) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const key = `metrika:purchase:${orderId}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage may be unavailable (privacy mode) — fire anyway,
      // duplicates are tolerable.
    }

    trackPurchase({
      orderId: String(orderNumber),
      total,
      shipping,
      coupon,
      products,
    });
  }, [enabled, orderId, orderNumber, total, shipping, coupon, products]);

  return null;
}
