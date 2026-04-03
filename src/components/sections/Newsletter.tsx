"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch("/api/notifications/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // fallback: ignore network error
    }

    setSubmitted(true);
  }

  return (
    <section className="bg-brand-cream">
      <div className="container-main section-padding text-center">
        <h2>Получайте советы по уходу за растениями</h2>
        <p className="mt-2 text-brand-gray-dark/60">
          Только полезный контент: рецепты подкормок, сезонные советы, скидки для подписчиков
        </p>

        {submitted ? (
          <p className="mt-6 text-lg font-medium text-brand-green">
            Спасибо за подписку!
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
