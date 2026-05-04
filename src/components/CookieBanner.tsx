"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = (value: "all" | "essential") => {
    localStorage.setItem("cookie-consent", value);
    // Notify <Metrika /> (and any other listeners) so analytics can boot
    // without a full page reload.
    window.dispatchEvent(
      new CustomEvent("cookie-consent-changed", { detail: value })
    );
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-auto rounded-xl shadow-2xl bg-bg border border-gray-200 p-4 space-y-3">
      <p className="text-sm text-gray-700 leading-relaxed">
        Мы используем cookie для работы сайта, аналитики и улучшения опыта.
        Подробнее в{" "}
        <Link href="/privacy" className="underline text-gray-900 hover:text-accent">
          Политике конфиденциальности
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => accept("all")}
          className="flex-1 rounded-lg bg-accent text-white text-sm font-medium py-2 px-3 hover:opacity-90 transition-opacity"
        >
          Принять все
        </button>
        <button
          onClick={() => accept("essential")}
          className="flex-1 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium py-2 px-3 hover:bg-gray-50 transition-colors"
        >
          Только необходимые
        </button>
      </div>
    </div>
  );
}
