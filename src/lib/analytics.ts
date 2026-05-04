/**
 * Client-side analytics helpers for Yandex Metrika.
 *
 * All functions are no-ops when:
 *   - executed on the server (typeof window === "undefined")
 *   - NEXT_PUBLIC_METRIKA_ID is not set at build time
 *   - the counter script has not yet loaded (adblock / no cookie consent)
 *
 * Goals are referenced by string constants so the same identifiers can be
 * configured in the Yandex Metrika UI without searching call sites.
 */

export const GOAL = {
  ADD_TO_CART: "add_to_cart",
  REMOVE_FROM_CART: "remove_from_cart",
  BEGIN_CHECKOUT: "begin_checkout",
  PURCHASE: "purchase",
  LEAD_FORM_SUBMIT: "lead_form_submit",
  PHONE_CLICK: "phone_click",
  TELEGRAM_CLICK: "telegram_click",
  WHATSAPP_CLICK: "whatsapp_click",
} as const;

export type GoalName = (typeof GOAL)[keyof typeof GOAL];

export type EcommerceProduct = {
  id: string;
  name: string;
  price: number;
  brand?: string;
  category?: string;
  variant?: string;
  quantity: number;
};

type EcommercePayload =
  | { add: { products: EcommerceProduct[] } }
  | { remove: { products: EcommerceProduct[] } }
  | { detail: { products: EcommerceProduct[] } }
  | {
      checkout: {
        actionField: { step: number };
        products: EcommerceProduct[];
      };
    }
  | {
      purchase: {
        actionField: {
          id: string;
          revenue: number;
          coupon?: string;
          shipping?: number;
        };
        products: EcommerceProduct[];
      };
    };

function getCounterId(): number | null {
  const raw = process.env.NEXT_PUBLIC_METRIKA_ID;
  if (!raw) return null;
  const num = Number(raw);
  return Number.isFinite(num) && num > 0 ? num : null;
}

/**
 * Send a Metrika goal. Safe to call before the counter has loaded — the
 * Metrika init shim queues calls until the script is ready.
 */
export function trackGoal(name: GoalName, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const counterId = getCounterId();
  if (!counterId) return;
  try {
    window.ym?.(counterId, "reachGoal", name, params);
  } catch (err) {
    console.warn("[analytics] reachGoal failed:", err);
  }
}

/**
 * Push an ecommerce payload onto the Metrika dataLayer.
 * Always wrapped in `{ ecommerce: ... }` per Metrika dataLayer convention.
 */
export function pushEcommerce(payload: EcommercePayload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: payload });
}

export function trackAddToCart(product: EcommerceProduct) {
  trackGoal(GOAL.ADD_TO_CART, {
    product_id: product.id,
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    brand: product.brand,
  });
  pushEcommerce({ add: { products: [product] } });
}

export function trackRemoveFromCart(product: EcommerceProduct) {
  trackGoal(GOAL.REMOVE_FROM_CART, {
    product_id: product.id,
    quantity: product.quantity,
  });
  pushEcommerce({ remove: { products: [product] } });
}

export function trackBeginCheckout(products: EcommerceProduct[]) {
  trackGoal(GOAL.BEGIN_CHECKOUT, {
    items: products.length,
    revenue: products.reduce((s, p) => s + p.price * p.quantity, 0),
  });
  pushEcommerce({
    checkout: { actionField: { step: 1 }, products },
  });
}

export function trackPurchase(opts: {
  orderId: string;
  total: number;
  coupon?: string;
  shipping?: number;
  products: EcommerceProduct[];
}) {
  trackGoal(GOAL.PURCHASE, {
    order_id: opts.orderId,
    revenue: opts.total,
  });
  pushEcommerce({
    purchase: {
      actionField: {
        id: opts.orderId,
        revenue: opts.total,
        ...(opts.coupon ? { coupon: opts.coupon } : {}),
        ...(opts.shipping ? { shipping: opts.shipping } : {}),
      },
      products: opts.products,
    },
  });
}

export function trackPhoneClick(phone?: string) {
  trackGoal(GOAL.PHONE_CLICK, phone ? { phone } : undefined);
}

export function trackTelegramClick(handle?: string) {
  trackGoal(GOAL.TELEGRAM_CLICK, handle ? { handle } : undefined);
}

export function trackLeadFormSubmit(formId: string, params?: Record<string, unknown>) {
  trackGoal(GOAL.LEAD_FORM_SUBMIT, { form_id: formId, ...params });
}

/**
 * Read the Metrika client ID cookie (`_ym_uid`). Used to attribute
 * server-side conversions to the right visitor. Returns null on the server
 * or when the cookie is missing.
 */
export function readYandexClientId(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)_ym_uid=([^;]+)/);
  return match?.[1] ?? null;
}
