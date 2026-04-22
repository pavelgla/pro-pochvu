"use client";

import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

type OrderStatus = "created" | "paid" | "shipped" | "in_transit" | "delivered";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "created", label: "Оформлен" },
  { key: "paid", label: "Оплачен" },
  { key: "shipped", label: "Отправлен" },
  { key: "in_transit", label: "В пути" },
  { key: "delivered", label: "Доставлен" },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  created: 0,
  paid: 1,
  shipped: 2,
  in_transit: 3,
  delivered: 4,
};

const TrackingUrls: Record<string, (track: string) => string> = {
  "СДЭК": (t) => `https://www.cdek.ru/ru/tracking?order_id=${t}`,
  "cdek": (t) => `https://www.cdek.ru/ru/tracking?order_id=${t}`,
  "5Post": (t) => `https://fivepost.ru/tracking/${t}`,
  "fivepost": (t) => `https://fivepost.ru/tracking/${t}`,
  "Boxberry": (t) => `https://boxberry.ru/tracking-page?id=${t}`,
  "boxberry": (t) => `https://boxberry.ru/tracking-page?id=${t}`,
  "Почта России": (t) => `https://www.pochta.ru/tracking#${t}`,
  "pochta": (t) => `https://www.pochta.ru/tracking#${t}`,
};

type Props = {
  currentStatus: OrderStatus;
  dates?: Partial<Record<OrderStatus, string>>;
  trackNumber?: string | null;
  deliveryProvider?: string | null;
};

export function OrderTracker({ currentStatus, dates, trackNumber, deliveryProvider }: Props) {
  const currentIdx = STATUS_INDEX[currentStatus] ?? 0;

  const trackingUrl =
    trackNumber && deliveryProvider && TrackingUrls[deliveryProvider]
      ? TrackingUrls[deliveryProvider](trackNumber)
      : null;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center">
        {STEPS.map((step, i) => {
          const isCompleted = i <= currentIdx;
          const isCurrent = i === currentIdx;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={step.key} className={cn("flex items-center", !isLast && "flex-1")}>
              {/* Circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                    isCompleted
                      ? "border-accent bg-accent text-white"
                      : "border-line bg-bg text-mute/30"
                  )}
                >
                  {isCompleted ? "✓" : i + 1}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-center text-[11px] leading-tight",
                    isCurrent ? "font-bold text-accent" : isCompleted ? "text-ink-2" : "text-mute/30"
                  )}
                >
                  {step.label}
                </span>
                {dates?.[step.key] && (
                  <span className="mt-0.5 text-[10px] text-mute/60">
                    {formatDate(dates[step.key]!)}
                  </span>
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1 transition-colors",
                    i < currentIdx ? "bg-accent" : "bg-bg-soft"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Track button */}
      {trackNumber && (
        <div className="flex items-center justify-between rounded-lg bg-cream p-3 text-sm">
          <div>
            <span className="text-mute">Трек-номер: </span>
            <span className="font-mono font-medium">{trackNumber}</span>
          </div>
          {trackingUrl && (
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent/90 transition-colors"
            >
              Отследить
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}
