"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const sortOptions = [
  { value: "popularity", label: "По популярности" },
  { value: "price_asc", label: "Сначала дешёвые" },
  { value: "price_desc", label: "Сначала дорогие" },
  { value: "rating", label: "По рейтингу" },
  { value: "newest", label: "Новинки" },
];

export function CatalogSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") || "popularity";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "popularity") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="h-10 rounded-full border border-line bg-bg px-4 pr-8 text-sm focus:border-accent focus:outline-none"
    >
      {sortOptions.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
