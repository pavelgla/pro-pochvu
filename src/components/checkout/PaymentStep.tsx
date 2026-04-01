"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Building2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/catalog";
import type { PaymentMethod } from "@/types/yookassa";
import type { DeliveryProvider } from "@/types/delivery";

type PaymentOption = {
  id: PaymentMethod | "cod";
  label: string;
  icon: typeof CreditCard;
  description: string;
  codOnly?: boolean;
  surcharge?: number;
};

const paymentOptions: PaymentOption[] = [
  { id: "bank_card", label: "Банковская карта", icon: CreditCard, description: "Visa, Mastercard, МИР" },
  { id: "sbp", label: "СБП", icon: Smartphone, description: "Система быстрых платежей" },
  { id: "sberbank", label: "SberPay", icon: Building2, description: "Оплата через Сбербанк" },
  { id: "tinkoff_bank", label: "Тинькофф Pay", icon: Building2, description: "Оплата через Тинькофф" },
  { id: "installments", label: "Рассрочка", icon: Clock, description: "Оплата частями" },
  { id: "cod", label: "Наложенный платёж", icon: CreditCard, description: "Оплата при получении (+3%)", codOnly: true, surcharge: 0.03 },
];

type Props = {
  total: number;
  deliveryProvider?: DeliveryProvider;
  onSubmit: (method: PaymentMethod | "cod") => void;
  onBack: () => void;
  loading: boolean;
};

export function PaymentStep({ total, deliveryProvider, onSubmit, onBack, loading }: Props) {
  const [selected, setSelected] = useState<PaymentMethod | "cod">("bank_card");
  const [agreed, setAgreed] = useState(false);

  const codAllowed = deliveryProvider === "cdek" || deliveryProvider === "pochta";

  const available = paymentOptions.filter(
    (o) => !o.codOnly || (o.codOnly && codAllowed)
  );

  const selectedOption = available.find((o) => o.id === selected);
  const finalTotal = selectedOption?.surcharge
    ? Math.round(total * (1 + selectedOption.surcharge))
    : total;

  return (
    <div className="space-y-6">
      <h2>Способ оплаты</h2>

      <div className="space-y-2">
        {available.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors",
                selected === option.id
                  ? "border-brand-green bg-brand-green/5"
                  : "border-brand-gray-light hover:border-brand-green/30"
              )}
            >
              <Icon className="h-5 w-5 shrink-0 text-brand-gray-dark/60" />
              <div className="flex-1">
                <span className="text-sm font-medium">{option.label}</span>
                <p className="text-xs text-brand-gray-dark/50">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Terms checkbox */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-brand-gray-light text-brand-green focus:ring-brand-green"
        />
        <span className="text-sm text-brand-gray-dark/70">
          Я согласен с{" "}
          <a href="/terms" target="_blank" className="text-brand-green underline">
            офертой
          </a>{" "}
          и{" "}
          <a href="/privacy" target="_blank" className="text-brand-green underline">
            политикой конфиденциальности
          </a>
        </span>
      </label>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Назад
        </Button>
        <Button
          size="lg"
          disabled={!agreed}
          loading={loading}
          onClick={() => onSubmit(selected)}
        >
          Оплатить {formatPrice(finalTotal)}
        </Button>
      </div>
    </div>
  );
}
