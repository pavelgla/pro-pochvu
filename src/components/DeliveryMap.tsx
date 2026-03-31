"use client";

import { useState, useMemo } from "react";
import { MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PickupPoint, DeliveryProvider } from "@/types/delivery";
import { PROVIDER_NAMES, PROVIDER_COLORS } from "@/types/delivery";

type Props = {
  points: PickupPoint[];
  selectedPoint: PickupPoint | null;
  onSelectPoint: (point: PickupPoint) => void;
};

const ALL_PROVIDERS: DeliveryProvider[] = ["fivepost", "boxberry", "pochta", "cdek"];

export function DeliveryMap({ points, selectedPoint, onSelectPoint }: Props) {
  const [enabledProviders, setEnabledProviders] = useState<Set<DeliveryProvider>>(
    new Set(ALL_PROVIDERS)
  );

  const filteredPoints = useMemo(
    () => points.filter((p) => enabledProviders.has(p.provider)),
    [points, enabledProviders]
  );

  // Get available providers from points
  const availableProviders = useMemo(() => {
    const set = new Set<DeliveryProvider>();
    points.forEach((p) => set.add(p.provider));
    return ALL_PROVIDERS.filter((pr) => set.has(pr));
  }, [points]);

  function toggleProvider(provider: DeliveryProvider) {
    setEnabledProviders((prev) => {
      const next = new Set(prev);
      if (next.has(provider)) {
        if (next.size > 1) next.delete(provider);
      } else {
        next.add(provider);
      }
      return next;
    });
  }

  // Map center from points
  const center = useMemo(() => {
    if (filteredPoints.length === 0) return { lat: 55.75, lng: 37.62 };
    const lat = filteredPoints.reduce((s, p) => s + p.lat, 0) / filteredPoints.length;
    const lng = filteredPoints.reduce((s, p) => s + p.lng, 0) / filteredPoints.length;
    return { lat, lng };
  }, [filteredPoints]);

  return (
    <div className="space-y-3">
      {/* Provider filters */}
      {availableProviders.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {availableProviders.map((pr) => (
            <button
              key={pr}
              type="button"
              onClick={() => toggleProvider(pr)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                enabledProviders.has(pr)
                  ? "border-transparent text-white"
                  : "border-brand-gray-light text-brand-gray-dark/50"
              )}
              style={
                enabledProviders.has(pr)
                  ? { backgroundColor: PROVIDER_COLORS[pr] }
                  : {}
              }
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: enabledProviders.has(pr)
                    ? "white"
                    : PROVIDER_COLORS[pr],
                }}
              />
              {PROVIDER_NAMES[pr]}
            </button>
          ))}
        </div>
      )}

      {/* Map placeholder (Yandex Maps integration) */}
      <div className="relative h-64 md:h-96 rounded-xl bg-brand-gray-light overflow-hidden">
        {/* Static map placeholder — replace with Yandex Maps when API key is set */}
        <div className="absolute inset-0 flex items-center justify-center text-brand-gray-dark/20">
          <div className="text-center">
            <MapPin className="mx-auto h-12 w-12" />
            <p className="mt-2 text-sm">
              Карта ПВЗ ({filteredPoints.length} точек)
            </p>
            <p className="text-xs">
              Центр: {center.lat.toFixed(2)}, {center.lng.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Dots representing points */}
        {filteredPoints.slice(0, 30).map((point) => {
          const latRange = 0.08;
          const lngRange = 0.12;
          const top = 50 - ((point.lat - center.lat) / latRange) * 40;
          const left = 50 + ((point.lng - center.lng) / lngRange) * 40;

          return (
            <button
              key={point.id}
              type="button"
              onClick={() => onSelectPoint(point)}
              className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition-transform hover:scale-150"
              style={{
                top: `${Math.min(90, Math.max(10, top))}%`,
                left: `${Math.min(90, Math.max(10, left))}%`,
                backgroundColor: point.provider_color,
              }}
              title={`${PROVIDER_NAMES[point.provider]}: ${point.address}`}
            />
          );
        })}
      </div>

      {/* Points list (below map) */}
      <div className="max-h-60 space-y-1 overflow-auto">
        {filteredPoints.map((point) => (
          <button
            key={point.id}
            type="button"
            onClick={() => onSelectPoint(point)}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
              selectedPoint?.id === point.id
                ? "bg-brand-green/5 ring-1 ring-brand-green"
                : "hover:bg-brand-gray-light"
            )}
          >
            <span
              className="mt-1 h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: point.provider_color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{point.name}</span>
                {selectedPoint?.id === point.id && (
                  <Check className="h-4 w-4 text-brand-green" />
                )}
              </div>
              <p className="mt-0.5 text-xs text-brand-gray-dark/50 truncate">
                {point.address}
              </p>
              <p className="text-xs text-brand-gray-dark/40">{point.work_time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
