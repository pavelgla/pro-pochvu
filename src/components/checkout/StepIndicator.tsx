"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Доставка" },
  { id: 2, label: "Данные" },
  { id: 3, label: "Оплата" },
];

type Props = {
  current: number;
  onStepClick: (step: number) => void;
};

export function StepIndicator({ current, onStepClick }: Props) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;
        const clickable = step.id < current;

        return (
          <div key={step.id} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={cn(
                  "hidden h-px w-8 sm:block",
                  done ? "bg-brand-green" : "bg-brand-gray-light"
                )}
              />
            )}
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(step.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                done && "text-brand-green cursor-pointer hover:bg-brand-green/5",
                active && "bg-brand-green text-white",
                !done && !active && "text-brand-gray-dark/40"
              )}
            >
              {done ? (
                <Check className="h-4 w-4" />
              ) : (
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                    active
                      ? "bg-white/20"
                      : "bg-brand-gray-light text-brand-gray-dark/40"
                  )}
                >
                  {step.id}
                </span>
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
