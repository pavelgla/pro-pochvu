"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ProductLineData = { id: string; slug: string; name: string; brand: string };
type CategoryData = { id: string; slug: string; name: string };

export function CatalogFilters({ productLineSlug }: { productLineSlug?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productLines, setProductLines] = useState<ProductLineData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  const selectedBrands = searchParams.get("brand")?.split(",").filter(Boolean) || [];
  const selectedCategory = searchParams.get("category") || "";
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const selectedRating = searchParams.get("rating") || "";

  useEffect(() => {
    fetch("/api/catalog?action=productLines")
      .then((res) => res.json())
      .then(setProductLines);
  }, []);

  useEffect(() => {
    const activeProductLine = productLineSlug
      ? productLines.find((l) => l.slug === productLineSlug)
      : null;
    const params = new URLSearchParams();
    params.set("action", "categories");
    if (activeProductLine?.id) params.set("productLineId", activeProductLine.id);
    fetch(`/api/catalog?${params.toString()}`)
      .then((res) => res.json())
      .then(setCategories);
  }, [productLineSlug, productLines]);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  function toggleBrand(brand: string) {
    const current = new Set(selectedBrands);
    if (current.has(brand)) {
      current.delete(brand);
    } else {
      current.add(brand);
    }
    updateParams("brand", Array.from(current).join(","));
  }

  function resetFilters() {
    router.push(pathname, { scroll: false });
  }

  const hasFilters = selectedBrands.length > 0 || selectedCategory || priceMin || priceMax || selectedRating;

  const filterContent = (
    <div className="space-y-6">
      {/* Brand */}
      {!productLineSlug && (
        <div>
          <h4 className="mb-3 text-sm font-bold">Бренд</h4>
          <div className="space-y-2">
            {[
              { value: "ecokon", label: "ЭКО Конь" },
              { value: "tsvetologiya", label: "Цветология" },
            ].map((b) => (
              <label
                key={b.value}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b.value)}
                  onChange={() => toggleBrand(b.value)}
                  className="h-4 w-4 rounded border-brand-gray-light text-brand-green focus:ring-brand-green"
                />
                {b.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-bold">Категория</h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedCategory === cat.slug}
                  onChange={() =>
                    updateParams(
                      "category",
                      selectedCategory === cat.slug ? "" : cat.slug
                    )
                  }
                  className="h-4 w-4 rounded border-brand-gray-light text-brand-green focus:ring-brand-green"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <h4 className="mb-3 text-sm font-bold">Цена, ₽</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="От"
            value={priceMin}
            onChange={(e) => updateParams("priceMin", e.target.value)}
            className="h-9 w-full rounded-lg border border-brand-gray-light px-3 text-sm focus:border-brand-green focus:outline-none"
          />
          <span className="text-brand-gray-dark/40">—</span>
          <input
            type="number"
            placeholder="До"
            value={priceMax}
            onChange={(e) => updateParams("priceMax", e.target.value)}
            className="h-9 w-full rounded-lg border border-brand-gray-light px-3 text-sm focus:border-brand-green focus:outline-none"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="mb-3 text-sm font-bold">Рейтинг</h4>
        <div className="space-y-2">
          {["4.5", "4.0", "3.5"].map((r) => (
            <label
              key={r}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="radio"
                name="rating"
                checked={selectedRating === r}
                onChange={() =>
                  updateParams("rating", selectedRating === r ? "" : r)
                }
                className="h-4 w-4 border-brand-gray-light text-brand-green focus:ring-brand-green"
              />
              от {r}+
            </label>
          ))}
        </div>
      </div>

      {/* Reset */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full">
          Сбросить фильтры
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="flex h-10 items-center gap-2 rounded-xl border border-brand-gray-light px-4 text-sm font-medium md:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Фильтры
        {hasFilters && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[10px] text-white">
            !
          </span>
        )}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        {filterContent}
      </aside>

      {/* Mobile sheet */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[70] max-h-[80vh] overflow-auto rounded-t-2xl bg-white p-6 shadow-xl transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Фильтры</h3>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 hover:bg-brand-gray-light"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {filterContent}
        <div className="mt-6">
          <Button className="w-full" onClick={() => setMobileOpen(false)}>
            Показать товары
          </Button>
        </div>
      </div>
    </>
  );
}
