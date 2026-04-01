"use client";

import { Button } from "@/components/ui/Button";
import { DeliveryOptions } from "@/components/DeliveryOptions";
import type { DeliveryOption, PickupPoint } from "@/types/delivery";

type DeliveryData = {
  option: DeliveryOption | null;
  point: PickupPoint | null;
  address: string;
};

type Props = {
  data: DeliveryData;
  weightGrams: number;
  onChange: (data: DeliveryData) => void;
  onNext: () => void;
};

export function DeliveryStep({ data, weightGrams, onChange, onNext }: Props) {
  const canProceed = data.option && (
    data.option.delivery_type === "courier"
      ? data.address.length > 0
      : data.point !== null
  );

  return (
    <div className="space-y-6">
      <h2>Способ доставки</h2>

      <DeliveryOptions
        weightGrams={weightGrams}
        onSelect={(option, point, address) => {
          onChange({
            option,
            point: point || null,
            address: address || "",
          });
        }}
      />

      <div className="flex justify-end">
        <Button size="lg" disabled={!canProceed} onClick={onNext}>
          Далее
        </Button>
      </div>
    </div>
  );
}
