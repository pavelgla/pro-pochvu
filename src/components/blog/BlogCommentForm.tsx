"use client";

import { useState } from "react";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";

export function BlogCommentForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug: slug,
          authorName: name,
          authorEmail: email || undefined,
          body,
          consent,
          website,
        }),
      });
      if (res.ok) {
        setState("done");
        setName(""); setEmail(""); setBody(""); setConsent(false);
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Не удалось отправить. Попробуйте позже.");
        setState("error");
      }
    } catch {
      setError("Сеть недоступна. Попробуйте позже.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="rounded-2xl border border-accent/30 bg-accent/5 p-5 text-sm text-ink">
        Спасибо! Комментарий отправлен на модерацию и появится после проверки.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <h3 className="text-base font-semibold text-ink">Оставить комментарий</h3>
      <input
        type="text" required value={name} onChange={(e) => setName(e.target.value)}
        placeholder="Ваше имя" maxLength={60}
        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm"
      />
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (необязательно, не публикуется)" maxLength={120}
        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm"
      />
      <textarea
        required value={body} onChange={(e) => setBody(e.target.value)}
        placeholder="Ваш комментарий" rows={4} maxLength={2000}
        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm"
      />
      {/* honeypot — скрыто от людей, видно ботам */}
      <input
        type="text" tabIndex={-1} autoComplete="off" value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden" aria-hidden="true"
      />
      <ConsentCheckbox checked={consent} onChange={setConsent} required />
      {state === "error" && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit" disabled={state === "sending" || !consent}
        className="rounded-full bg-ink px-6 py-3 text-[13px] font-medium text-bg transition-colors hover:bg-accent disabled:opacity-50"
      >
        {state === "sending" ? "Отправка…" : "Отправить"}
      </button>
    </form>
  );
}
