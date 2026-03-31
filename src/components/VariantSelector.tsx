"use client";

import { cn } from "@/lib/utils";
import type { Json } from "@/types/database";

type Variant = {
  id: string;
  label: string;
  color?: string;
  price_diff?: number;
};

type Props = {
  variants: Json;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function VariantSelector({ variants, selectedId, onSelect }: Props) {
  const items = (Array.isArray(variants) ? variants : []) as Variant[];
  if (items.length === 0) return null;

  const hasColors = items.some((v) => v.color);

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-brand-gray-dark/70">
        {hasColors ? "Цвет" : "Вариант"}
      </span>
      <div className="flex flex-wrap gap-2">
        {items.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-medium transition-colors",
              selectedId === v.id
                ? "border-brand-green bg-brand-green/5 text-brand-green"
                : "border-brand-gray-light hover:border-brand-green/50"
            )}
          >
            {v.color && (
              <span
                className="h-5 w-5 rounded-full border border-brand-gray-light"
                style={{ backgroundColor: v.color }}
              />
            )}
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
