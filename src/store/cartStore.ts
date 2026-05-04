import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trackAddToCart, trackRemoveFromCart, type EcommerceProduct } from "@/lib/analytics";

export interface CartItem {
  product_id: string;
  variant_id?: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  weight_grams: number;
}

export interface PromoData {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  discount_amount: number;
}

interface CartStore {
  items: CartItem[];
  promo: PromoData | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  setPromo: (promo: PromoData | null) => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotalWeight: () => number;
  getItemCount: () => number;
}

function itemKey(productId: string, variantId?: string) {
  return variantId ? `${productId}:${variantId}` : productId;
}

function toEcommerceProduct(item: CartItem, quantity?: number): EcommerceProduct {
  return {
    id: item.product_id,
    name: item.name,
    price: item.price,
    brand: item.brand,
    variant: item.variant_id,
    quantity: quantity ?? item.quantity,
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promo: null,

      addItem: (item) => {
        set((state) => {
          const key = itemKey(item.product_id, item.variant_id);
          const existing = state.items.find(
            (i) => itemKey(i.product_id, i.variant_id) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.product_id, i.variant_id) === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
        // Analytics: fire add_to_cart goal + ecommerce dataLayer push.
        // Safe even when Metrika hasn't loaded — trackAddToCart no-ops in that case.
        trackAddToCart(toEcommerceProduct(item));
      },

      removeItem: (productId, variantId) => {
        const key = itemKey(productId, variantId);
        const removed = get().items.find(
          (i) => itemKey(i.product_id, i.variant_id) === key
        );
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.product_id, i.variant_id) !== key
          ),
        }));
        if (removed) {
          trackRemoveFromCart(toEcommerceProduct(removed));
        }
      },

      updateQuantity: (productId, quantity, variantId) => {
        const key = itemKey(productId, variantId);
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.product_id, i.variant_id) === key
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], promo: null }),

      setPromo: (promo) => set({ promo }),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getDiscount: () => {
        const { promo } = get();
        if (!promo) return 0;
        return promo.discount_amount;
      },

      getTotalWeight: () =>
        get().items.reduce((sum, i) => sum + i.weight_grams * i.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "ecokon-cart",
    }
  )
);
