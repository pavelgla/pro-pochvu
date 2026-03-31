"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: send to Brevo
    setSubmitted(true);
  }

  return (
    <section className="bg-brand-cream">
      <div className="container-main section-padding text-center">
        <h2>Подпишитесь на новинки и акции</h2>
        <p className="mt-2 text-brand-gray-dark/60">
          Скидка 10% на первый заказ по промокоду{" "}
          <span className="font-bold text-brand-green">WELCOME10</span>
        </p>

        {submitted ? (
          <p className="mt-6 text-lg font-medium text-brand-green">
            Спасибо! Проверьте почту 💌
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Подписаться</Button>
          </form>
        )}
      </div>
    </section>
  );
}
