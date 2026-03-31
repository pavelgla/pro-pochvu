"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  options: Option[];
  value?: string;
  placeholder?: string;
  searchable?: boolean;
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function Select({
  options,
  value,
  placeholder = "Выберите...",
  searchable = false,
  label,
  error,
  onChange,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = searchable
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") setIsOpen(false);
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)} ref={ref}>
      {label && (
        <span className="text-sm font-medium text-brand-gray-dark">
          {label}
        </span>
      )}
      <div className="relative" onKeyDown={handleKeyDown}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl border border-brand-gray-light bg-white px-4 text-left text-base transition-colors",
            "focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20",
            error && "border-error",
            !selected && "text-brand-gray-dark/40"
          )}
        >
          <span className="truncate">
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "ml-2 h-4 w-4 shrink-0 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-brand-gray-light bg-white py-1 shadow-lg">
            {searchable && (
              <div className="px-3 pb-2 pt-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск..."
                  className="h-9 w-full rounded-lg border border-brand-gray-light px-3 text-sm focus:border-brand-green focus:outline-none"
                  autoFocus
                />
              </div>
            )}
            <ul className="max-h-60 overflow-auto">
              {filtered.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange?.(option.value);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full px-4 py-2 text-left text-sm hover:bg-brand-gray-light",
                      option.value === value &&
                        "bg-brand-green/5 font-medium text-brand-green"
                    )}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-2 text-sm text-brand-gray-dark/40">
                  Ничего не найдено
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
