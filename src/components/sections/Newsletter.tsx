"use client";

import { useState } from "react";
import { Ornament } from "@/components/ui/Ornament";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !consent) return;

    try {
      await fetch("/api/notifications/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // fallback
    }

    setSubmitted(true);
  }

  return (
    <section className="px-4 pb-16 md:px-6 xl:px-12 lg:pb-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-lg bg-bg-soft px-8 py-16 lg:px-[72px]">
        <Ornament
          variant="sprig"
          className="absolute right-16 top-5 opacity-50 hidden lg:block"
        />
        <Ornament
          variant="sprig"
          className="absolute bottom-5 left-10 opacity-30 -scale-x-100 hidden lg:block"
        />

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
          {/* Text */}
          <div>
            <div className="text-[11px] tracking-[0.18em] text-accent">
              ПИСЬМА С ФЕРМЫ
            </div>
            <h3 className="mt-3.5 font-serif text-4xl font-normal tracking-tight leading-none lg:text-[52px]">
              Советы по сезону
              <br />
              раз в&nbsp;<span className="text-accent">месяц.</span>
            </h3>
            <p className="mt-4 max-w-[420px] text-sm leading-relaxed text-ink-2">
              Рецепты подкормок, напоминания о&nbsp;пересадке, закрытые скидки
              для подписчиков. Отписаться — один клик.
            </p>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <p className="text-center font-serif text-2xl font-medium text-accent">
                Спасибо за подписку!
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3.5 flex gap-2">
                  <input
                    type="email"
                    placeholder="ваш e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 rounded-full border border-line bg-bg px-6 py-4 text-sm outline-none focus:border-accent"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-ink px-8 py-4 text-sm font-medium text-bg transition-colors hover:bg-accent"
                  >
                    Подписаться
                  </button>
                </div>
                <ConsentCheckbox checked={consent} onChange={setConsent} required />
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
