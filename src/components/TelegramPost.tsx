"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Идентификатор поста в формате "channel/messageId", напр. "spottykit/10794". */
  post: string;
  /** Показывать аватар канала в шапке виджета. */
  userpic?: boolean;
  className?: string;
};

// Официальный виджет-эмбед поста Telegram. Скрипт telegram-widget.js находит
// контейнер по data-атрибутам и подставляет iframe с постом (включая видео).
// Ленивая загрузка через IntersectionObserver — скрипт не тянется, пока блок
// не приблизился к вьюпорту.
export function TelegramPost({ post, userpic = true, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || load) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  useEffect(() => {
    const el = containerRef.current;
    if (!load || !el || el.querySelector("script, iframe")) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-post", post);
    script.setAttribute("data-width", "100%");
    script.setAttribute("data-userpic", String(userpic));
    el.appendChild(script);
  }, [load, post, userpic]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: 320 }}
      aria-label={`Пост Telegram ${post}`}
    />
  );
}
