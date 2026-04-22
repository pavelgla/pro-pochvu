"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

const PROMO = "ECOKON15";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productSlug: string;
  marketplace: "wb" | "ozon";
  marketplaceUrl: string;
  productName: string;
}

type Step = "form" | "promo";

export function MarketplaceLeadModal({
  isOpen, onClose, productSlug, marketplace, marketplaceUrl, productName,
}: Props) {
  const [step, setStep]       = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [error, setError]     = useState("");

  const [name, setName]           = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [consent, setConsent]     = useState(false);

  const mpLabel = marketplace === "wb" ? "Wildberries" : "Ozon";

  function reset() {
    setStep("form");
    setLoading(false);
    setCopied(false);
    setError("");
    setName(""); setBirthdate(""); setEmail(""); setPhone(""); setConsent(false);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) { setError("Необходимо согласие на обработку данных"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birthdate, email, phone, productSlug, marketplace }),
      });
      if (!res.ok) throw new Error("Ошибка сервера");
      setStep("promo");
    } catch {
      setError("Не удалось отправить данные. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  function copyPromo() {
    navigator.clipboard.writeText(PROMO);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const title = step === "form"
    ? `Скидка 15% на ${mpLabel}`
    : "Ваш промокод готов!";

  return (
    <Modal isOpen={isOpen} onClose={reset} title={title}>
      {step === "form" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-mute">
            Оставьте данные и получите промокод на скидку 15%
            при покупке «{productName}» на {mpLabel}.
          </p>

          <div className="space-y-3">
            <input
              required
              type="text"
              placeholder="ФИО *"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
            <input
              type="date"
              placeholder="Дата рождения"
              value={birthdate}
              onChange={e => setBirthdate(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
            <input
              required
              type="email"
              placeholder="Email *"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
            <input
              required
              type="tel"
              placeholder="Телефон *"
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

          <Button type="submit" size="lg" className="w-full" disabled={loading || !consent}>
            {loading ? "Отправляем..." : "Получить промокод"}
          </Button>
        </form>
      ) : (
        <div className="space-y-5 text-center">
          <p className="text-sm text-mute">
            Применяйте при оформлении заказа на {mpLabel}:
          </p>

          <div className="flex items-center justify-center gap-3 rounded-xl bg-bg-soft/60 px-6 py-4">
            <span className="text-2xl font-bold tracking-widest">{PROMO}</span>
            <button
              onClick={copyPromo}
              className="rounded-lg p-2 text-mute hover:text-accent transition-colors"
              title="Скопировать"
            >
              {copied ? <Check className="h-5 w-5 text-accent" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>

          <p className="text-xs text-mute/60">Скидка 15% на ваш заказ</p>

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
