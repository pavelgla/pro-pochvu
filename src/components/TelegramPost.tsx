"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Идентификатор поста в формате "channel/messageId", напр. "spottykit/10794". */
  post: string;
  /** Показывать аватар канала в шапке виджета. */
  userpic?: boolean;
  className?: string;
};

// Эмбед поста Telegram через прямой iframe виджета (t.me/<post>?embed=1).
// Telegram присылает родителю postMessage {"event":"resize","height":N} —
// слушаем его и подгоняем высоту. Детерминированно, без инжекта внешнего
// скрипта и без IntersectionObserver. Нативная ленивая загрузка — loading="lazy".
export function TelegramPost({ post, userpic = true, className }: Props) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(320);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://t.me") return;
      const iframe = ref.current;
      if (!iframe || e.source !== iframe.contentWindow) return;
      try {
        const data =
          typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "resize" && typeof data.height === "number") {
          setHeight(data.height);
        }
      } catch {
        /* not a telegram resize message */
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const src = `https://t.me/${post}?embed=1&userpic=${userpic}&dark=0`;

  return (
    <iframe
      ref={ref}
      src={src}
      title={`Пост Telegram ${post}`}
      loading="lazy"
      scrolling="no"
      frameBorder="0"
      className={className}
      style={{ width: "100%", height, border: "none", minWidth: 0 }}
    />
  );
}
