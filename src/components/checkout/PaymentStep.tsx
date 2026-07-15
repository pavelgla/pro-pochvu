"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Building2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/catalog";
import type { PaymentMethod } from "@/types/yookassa";

type PaymentOption = {
  id: PaymentMethod;
  label: string;
  icon: typeof CreditCard;
  description: string;
};

const paymentOptions: PaymentOption[] = [
  { id: "bank_card", label: "Банковская карта", icon: CreditCard, description: "Visa, Mastercard, МИР" },
  { id: "sbp", label: "СБП", icon: Smartphone, description: "Система быстрых платежей" },
  { id: "sberbank", label: "SberPay", icon: Building2, description: "Оплата через Сбербанк" },
  { id: "tinkoff_bank", label: "Тинькофф Pay", icon: Building2, description: "Оплата через Тинькофф" },
  { id: "installments", label: "Рассрочка", icon: Clock, description: "Оплата частями" },
];

type Props = {
  total: number;
  onSubmit: (method: PaymentMethod) => void;
  onBack: () => void;
  loading: boolean;
};

export function PaymentStep({ total, onSubmit, onBack, loading }: Props) {
  const [selected, setSelected] = useState<PaymentMethod>("bank_card");
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-6">
      <h2>Способ оплаты</h2>

      <div className="space-y-2">
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-colors",
                selected === option.id
                  ? "border-accent bg-accent/5"
                  : "border-line hover:border-accent/30"
              )}
            >
              <Icon className="h-5 w-5 shrink-0 text-mute" />
              <div className="flex-1">
                <span className="text-sm font-medium">{option.label}</span>
                <p className="text-xs text-mute">
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
          className="mt-1 h-4 w-4 rounded border-line text-accent focus:ring-accent"
        />
        <span className="text-sm text-ink-2">
          Я согласен с{" "}
          <a href="/terms" target="_blank" className="text-accent underline">
            офертой
          </a>{" "}
          и{" "}
          <a href="/privacy" target="_blank" className="text-accent underline">
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
          Оплатить {formatPrice(total)}
        </Button>
      </div>
    </div>
  );
}
