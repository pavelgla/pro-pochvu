"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { CityAutocomplete } from "./CityAutocomplete";
import { DeliveryMap } from "./DeliveryMap";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/catalog";
import type {
  City,
  DeliveryOption,
  PickupPoint,
  DeliveryProvider,
} from "@/types/delivery";
import { PROVIDER_COLORS } from "@/types/delivery";

type Props = {
  weightGrams: number;
  onSelect: (option: DeliveryOption, point?: PickupPoint, address?: string) => void;
};

const DELIVERY_TYPE_LABELS: Record<string, string> = {
  pvz: "ПВЗ",
  courier: "Курьер",
  postamat: "Постамат",
  post_office: "Почтовое отделение",
};

export function DeliveryOptions({ weightGrams, onSelect }: Props) {
  const [city, setCity] = useState<City | null>(null);
  const [options, setOptions] = useState<DeliveryOption[]>([]);
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [selected, setSelected] = useState<DeliveryOption | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [loading, setLoading] = useState(false);
  const [courierAddress, setCourierAddress] = useState({ street: "", house: "", apartment: "" });

  const fetchOptions = useCallback(async (cityId: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/delivery/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityId, weightGrams }),
      });
      const data = await res.json();
      setOptions(data.options || []);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [weightGrams]);

  const fetchPoints = useCallback(async (cityId: number, providers?: DeliveryProvider[]) => {
    try {
      const res = await fetch("/api/delivery/pvz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityId, providers }),
      });
      const data = await res.json();
      setPoints(data.points || []);
    } catch {
      setPoints([]);
    }
  }, []);

  useEffect(() => {
    if (city) {
      fetchOptions(city.id);
      fetchPoints(city.id);
      setSelected(null);
      setSelectedPoint(null);
    }
  }, [city, fetchOptions, fetchPoints]);

  function handleSelectOption(option: DeliveryOption) {
    setSelected(option);
    setSelectedPoint(null);
    if (option.delivery_type === "courier") {
      onSelect(option, undefined, "");
    }
  }

  function handleSelectPoint(point: PickupPoint) {
    setSelectedPoint(point);
    if (selected) {
      onSelect(selected, point);
    }
  }

  const isCourier = selected?.delivery_type === "courier";
  const needsMap = selected && !isCourier;

  return (
    <div className="space-y-5">
      {/* City */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Город доставки</label>
        <CityAutocomplete value={city} onChange={setCity} />
      </div>

      {/* Options */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      )}

      {!loading && options.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Способ доставки</label>
          {options.map((option, i) => (
            <button
              key={option.tariff_id}
              type="button"
              onClick={() => handleSelectOption(option)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                selected?.tariff_id === option.tariff_id
                  ? "border-brand-green bg-brand-green/5"
                  : "border-brand-gray-light hover:border-brand-green/30"
              )}
            >
              {/* Provider dot */}
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: PROVIDER_COLORS[option.provider] }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {option.provider_name} — {DELIVERY_TYPE_LABELS[option.delivery_type] || option.delivery_type}
                  </span>
                  {i === 0 && <Badge variant="success" size="sm">Выгодно</Badge>}
                </div>
                <p className="mt-0.5 text-xs text-brand-gray-dark/50">
                  {option.days_min}–{option.days_max} дн.
                </p>
              </div>

              <span className="shrink-0 text-sm font-bold">
                {formatPrice(option.cost)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Map for PVZ/postamat */}
      {needsMap && points.length > 0 && (
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Выберите пункт выдачи
          </label>
          <DeliveryMap
            points={points.filter((p) => p.provider === selected.provider)}
            selectedPoint={selectedPoint}
            onSelectPoint={handleSelectPoint}
          />
        </div>
      )}

      {/* Courier address form */}
      {isCourier && (
        <div className="space-y-3">
          <label className="block text-sm font-medium">Адрес доставки</label>
          <Input
            placeholder="Улица"
            value={courierAddress.street}
            onChange={(e) => {
              const v = { ...courierAddress, street: e.target.value };
              setCourierAddress(v);
              onSelect(selected!, undefined, `${v.street}, д. ${v.house}${v.apartment ? `, кв. ${v.apartment}` : ""}`);
            }}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Дом"
              value={courierAddress.house}
              onChange={(e) => {
                const v = { ...courierAddress, house: e.target.value };
                setCourierAddress(v);
                onSelect(selected!, undefined, `${v.street}, д. ${v.house}${v.apartment ? `, кв. ${v.apartment}` : ""}`);
              }}
            />
            <Input
              placeholder="Квартира"
              value={courierAddress.apartment}
              onChange={(e) => {
                const v = { ...courierAddress, apartment: e.target.value };
                setCourierAddress(v);
                onSelect(selected!, undefined, `${v.street}, д. ${v.house}${v.apartment ? `, кв. ${v.apartment}` : ""}`);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
