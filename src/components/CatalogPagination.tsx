"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
};

export function CatalogPagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(p));
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    }
  }

  return (
    <div className="flex items-center justify-center gap-1">
      {pages.map((p, i) => {
        // Ellipsis
        if (i > 0 && p - pages[i - 1] > 1) {
          return (
            <span key={`e-${p}`} className="px-2 text-brand-gray-dark/40">
              ...
            </span>
          );
        }
        return (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              p === page
                ? "bg-brand-green text-white"
                : "hover:bg-brand-gray-light"
            )}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
