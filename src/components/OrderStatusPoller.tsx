"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MAX_ATTEMPTS = 6;
const INTERVAL_MS = 2000;

/**
 * Re-fetches the order page while `active`, to pick up the YooKassa webhook
 * landing shortly after the buyer is redirected back. Stops once the parent
 * re-renders with `active=false` (order confirmed) or after MAX_ATTEMPTS.
 */
export function OrderStatusPoller({ active }: { active: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;

    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      attempts += 1;
      router.refresh();
      if (attempts < MAX_ATTEMPTS) timer = setTimeout(tick, INTERVAL_MS);
    };

    timer = setTimeout(tick, INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [active, router]);

  return null;
}
