"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pageNumbers.push(i);
    }
  }

  const btnBase =
    "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Prev */}
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        className={cn(btnBase, "hover:bg-brand-gray-light")}
        aria-label="Предыдущая страница"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Pages with ellipsis */}
      {pageNumbers.map((p, i) => {
        const nodes = [];
        if (i > 0 && p - pageNumbers[i - 1] > 1) {
          nodes.push(
            <span key={`e-${p}`} className="px-2 text-brand-gray-dark/40">
              ...
            </span>
          );
        }
        nodes.push(
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={cn(
              btnBase,
              p === page
                ? "bg-brand-green text-white"
                : "hover:bg-brand-gray-light"
            )}
          >
            {p}
          </button>
        );
        return nodes;
      })}

      {/* Next */}
      <button
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        className={cn(btnBase, "hover:bg-brand-gray-light")}
        aria-label="Следующая страница"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
