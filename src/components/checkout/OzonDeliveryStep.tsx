"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ExternalLink, Package } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/catalog";
import {
  FREE_DELIVERY_THRESHOLD,
  OZON_DELIVERY_COST,
  OZON_PVZ_MAP_URL,
} from "@/lib/constants";

const schema = z.object({
  city: z.string().min(2, "Укажите город"),
  pvzAddress: z.string().min(5, "Укажите адрес пункта выдачи"),
});

export type OzonDeliveryData = z.infer<typeof schema>;

type Props = {
  data: OzonDeliveryData;
  subtotal: number;
  onChange: (data: OzonDeliveryData) => void;
  onNext: () => void;
};

export function OzonDeliveryStep({ data, subtotal, onChange, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OzonDeliveryData>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const isFree = subtotal >= FREE_DELIVERY_THRESHOLD;

  function onSubmit(values: OzonDeliveryData) {
    onChange(values);
    onNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2>Доставка</h2>

      <div className="rounded-lg border-2 border-accent bg-accent/5 p-4">
        <div className="flex items-center gap-4">
          <Package className="h-5 w-5 shrink-0 text-accent" />
          <div className="flex-1">
            <span className="text-sm font-medium">
              Озон-доставка — пункт выдачи Ozon
            </span>
            <p className="text-xs text-mute">
              Заберите заказ в удобном пункте выдачи Ozon. Срок доставки 3–7 дней.
            </p>
          </div>
          <span className="shrink-0 text-sm font-bold">
            {isFree ? "Бесплатно" : formatPrice(OZON_DELIVERY_COST)}
          </span>
        </div>
      </div>

      {!isFree && (
        <p className="text-xs text-mute">
          Бесплатная доставка при заказе от {formatPrice(FREE_DELIVERY_THRESHOLD)}.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Город"
          placeholder="Калининград"
          error={errors.city?.message}
          {...register("city")}
        />
        <Input
          label="Адрес пункта выдачи Ozon"
          placeholder="ул. Ленина, 10"
          error={errors.pvzAddress?.message}
          {...register("pvzAddress")}
        />
      </div>

      <p className="text-sm text-mute">
        Найдите ближайший пункт выдачи{" "}
        <a
          href={OZON_PVZ_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-accent underline"
        >
          на карте Ozon
          <ExternalLink className="h-3.5 w-3.5" />
        </a>{" "}
        и укажите его адрес.
      </p>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Далее
        </Button>
      </div>
    </form>
  );
}
