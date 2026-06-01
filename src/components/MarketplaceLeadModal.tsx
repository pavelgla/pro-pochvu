"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Send, Bell } from "lucide-react";
import Link from "next/link";

const TELEGRAM_CHANNEL = "https://t.me/+7cAd9gatgP44MDcy";
const LEAD_MAGNET = "telegram+sale_alerts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productSlug: string;
  marketplace: "wb" | "ozon";
  marketplaceUrl: string;
  productName: string;
}

type Step = "form" | "done";

export function MarketplaceLeadModal({
  isOpen, onClose, productSlug, marketplace, marketplaceUrl, productName,
}: Props) {
  const [step, setStep]       = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [consent, setConsent] = useState(false);

  const mpLabel = marketplace === "wb" ? "Wildberries" : "Ozon";

  function reset() {
    setStep("form");
    setLoading(false);
    setError("");
    setEmail(""); setPhone(""); setConsent(false);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email && !phone) { setError("Укажите email или телефон"); return; }
    if (!consent) { setError("Необходимо согласие на обработку данных"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, productSlug, marketplace, leadMagnet: LEAD_MAGNET }),
      });
      if (!res.ok) throw new Error("Ошибка сервера");
      setStep("done");
    } catch {
      setError("Не удалось отправить данные. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  const title = step === "form" ? "Будьте в курсе акций" : "Готово!";

  return (
    <Modal isOpen={isOpen} onClose={reset} title={title}>
      {step === "form" ? (
        <form
          onSubmit={handleSubmit}
          data-track-form="marketplace_lead"
          className="space-y-4"
        >
          <p className="text-sm text-mute">
            Оставьте контакт — пришлём доступ в закрытый Telegram с советами по уходу
            и предупредим, когда на «{productName}» будет акция на {mpLabel}.
          </p>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Телефон или ник в Telegram"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-line accent-accent"
            />
            <span className="text-xs text-mute leading-relaxed">
              Я согласен(а) на обработку персональных данных в соответствии с{" "}
              <Link href="/privacy" target="_blank" className="underline hover:text-accent">
                Политикой конфиденциальности
              </Link>{" "}
              согласно 152-ФЗ
            </span>
          </label>

          {error && <p className="text-sm text-error">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Отправляем..." : "Подписаться и перейти"}
          </Button>

          <a
            href={marketplaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={reset}
            className="block text-center text-sm text-mute underline-offset-2 hover:text-ink hover:underline"
          >
            Перейти сразу на {mpLabel} →
          </a>
        </form>
      ) : (
        <div className="space-y-5 text-center">
          <Bell className="mx-auto h-10 w-10 text-accent" />
          <p className="text-sm text-mute">
            Спасибо! Сообщим об акциях на «{productName}». Заходите в наш Telegram —
            там советы по уходу и анонсы скидок.
          </p>

          <a
            href={TELEGRAM_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-6 py-3 text-sm font-medium text-ink hover:bg-bg-soft transition-colors"
          >
            <Send className="h-4 w-4" />
            Открыть Telegram
          </a>

          <a
            href={marketplaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            Перейти на {mpLabel}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}
    </Modal>
  );
}
