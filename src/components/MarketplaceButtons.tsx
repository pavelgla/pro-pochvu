"use client";

import { ShoppingBag } from "lucide-react";
import { trackGoal, GOAL } from "@/lib/analytics";

interface Props {
  wb?: string;
  ozon?: string;
  slug: string;
  /** Where the click happened (product page, blog, sticky bar) — passed to the Metrika goal for retargeting. */
  source?: string;
}

/**
 * Direct "buy on marketplace" buttons. Open WB/Ozon in a new tab and fire a
 * Metrika goal so these clicks can be used to build retargeting audiences.
 */
export function MarketplaceButtons({ wb, ozon, slug, source }: Props) {
  if (!wb && !ozon) return null;

  const track = (marketplace: "wb" | "ozon") =>
    trackGoal(GOAL.MARKETPLACE_CLICK, {
      marketplace,
      slug,
      ...(source ? { source } : {}),
    });

  return (
    <div className="flex flex-col gap-2">
      {wb && (
        <a
          href={wb}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("wb")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#CB11AB] px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <ShoppingBag className="h-4 w-4" />
          Купить на Wildberries
        </a>
      )}
      {ozon && (
        <a
          href={ozon}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("ozon")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#005BFF] px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <ShoppingBag className="h-4 w-4" />
          Купить на Ozon
        </a>
      )}
    </div>
  );
}
