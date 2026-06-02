"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Идентификатор поста в формате "channel/messageId", напр. "spottykit/10794". */
  post: string;
  /** Показывать аватар канала в шапке виджета. */
  userpic?: boolean;
  className?: string;
  /** Self-hosted превью для карточки-фолбэка, если Telegram недоступен (РКН). */
  fallbackImage?: string;
  /** Подпись для карточки-фолбэка. */
  fallbackTitle?: string;
};

// Эмбед поста Telegram с устойчивым фолбэком.
// В РФ Telegram режется РКН — без VPN iframe виджета не грузится (битые квадраты).
// Решение: пытаемся показать живой эмбед; пока он не прислал resize-сообщение,
// держим скелетон (битых квадратов не видно). Если за TIMEOUT сообщения нет —
// считаем Telegram недоступным и показываем карточку с self-hosted превью + ссылкой.
const LOAD_TIMEOUT = 4500;

export function TelegramPost({
  post,
  userpic = true,
  className,
  fallbackImage,
  fallbackTitle,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  const [height, setHeight] = useState(360);
  const [status, setStatus] = useState<"loading" | "loaded" | "blocked">(
    "loading",
  );

  // Стартуем загрузку только когда блок близко к вьюпорту.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Слушаем resize от Telegram + таймаут на фолбэк.
  useEffect(() => {
    if (!visible) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://t.me") return;
      const f = iframeRef.current;
      if (!f || e.source !== f.contentWindow) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "resize" && typeof data.height === "number") {
          setHeight(data.height);
          setStatus("loaded");
        }
      } catch {
        /* not a telegram resize message */
      }
    };
    window.addEventListener("message", onMessage);
    const timer = setTimeout(() => {
      setStatus((s) => (s === "loaded" ? s : "blocked"));
    }, LOAD_TIMEOUT);
    return () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(timer);
    };
  }, [visible]);

  // Фолбэк: Telegram недоступен → карточка со своим превью.
  if (status === "blocked") {
    if (!fallbackImage) {
      return (
        <a
          href={`https://t.me/${post}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center rounded-lg border border-line bg-bg-soft p-6 text-sm font-medium text-accent ${className ?? ""}`}
          style={{ minHeight: 160 }}
        >
          Смотреть в Telegram →
        </a>
      );
    }
    return (
      <a
        href={`https://t.me/${post}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`group block overflow-hidden rounded-lg border border-line transition-shadow hover:shadow-md ${className ?? ""}`}
      >
        <div className="relative aspect-[4/5] bg-bg-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fallbackImage}
            alt={fallbackTitle ?? "Пост Telegram"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          {fallbackTitle && (
            <p className="line-clamp-2 text-sm text-ink">{fallbackTitle}</p>
          )}
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent">
            Смотреть в Telegram →
          </span>
        </div>
      </a>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", minHeight: status === "loaded" ? undefined : 360 }}
    >
      {visible && (
        <iframe
          ref={iframeRef}
          src={`https://t.me/${post}?embed=1&userpic=${userpic}&dark=0`}
          title={`Пост Telegram ${post}`}
          loading="lazy"
          scrolling="no"
          frameBorder="0"
          style={{
            width: "100%",
            height: status === "loaded" ? height : 360,
            border: "none",
            minWidth: 0,
            opacity: status === "loaded" ? 1 : 0,
            position: status === "loaded" ? "static" : "absolute",
            inset: status === "loaded" ? undefined : 0,
          }}
        />
      )}
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse rounded-lg bg-bg-soft" />
      )}
    </div>
  );
}
