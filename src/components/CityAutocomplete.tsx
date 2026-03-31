"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { City } from "@/types/delivery";

type Props = {
  value: City | null;
  onChange: (city: City) => void;
  className?: string;
};

export function CityAutocomplete({ value, onChange, className }: Props) {
  const [query, setQuery] = useState(value?.name || "");
  const [cities, setCities] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setCities([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/delivery/cities?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setCities(data.cities || []);
      setOpen(true);
    } catch {
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleInput(val: string) {
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(val), 300);
  }

  function handleSelect(city: City) {
    setQuery(city.name);
    onChange(city);
    setOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray-dark/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => cities.length > 0 && setOpen(true)}
          placeholder="Введите город..."
          className="h-11 w-full rounded-xl border border-brand-gray-light bg-white pl-10 pr-4 text-base transition-colors placeholder:text-brand-gray-dark/40 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-brand-gray-light border-t-brand-green" />
        )}
      </div>

      {open && cities.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border border-brand-gray-light bg-white py-1 shadow-lg max-h-60 overflow-auto">
          {cities.map((city) => (
            <li key={city.id}>
              <button
                type="button"
                onClick={() => handleSelect(city)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-brand-gray-light"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-gray-dark/40" />
                <span>
                  {city.name}
                  {city.region && (
                    <span className="text-brand-gray-dark/40">
                      , {city.region}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
