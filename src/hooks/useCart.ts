import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

/**
 * SSR-safe wrapper around cartStore.
 * Returns 0/empty on server, real values after hydration.
 */
export function useCartCount() {
  const getItemCount = useCartStore((s) => s.getItemCount);
  const items = useCartStore((s) => s.items);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getItemCount());
  }, [items, getItemCount]);

  return count;
}

export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
