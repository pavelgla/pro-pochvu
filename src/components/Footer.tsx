import Link from "next/link";
import { Logo } from "./Logo";
import { Ornament } from "./ui/Ornament";
import { SHOW_TSVETOLOGIYA } from "@/lib/constants";

const columns = [
  {
    title: "Покупателям",
    links: [
      { href: "/catalog", label: "Каталог" },
      { href: "/delivery", label: "Доставка и оплата" },
      { href: "/returns", label: "Возврат" },
      { href: "/contacts", label: "Контакты" },
    ],
  },
  {
    title: "Узнать",
    links: [
      { href: "/knowledge-base/video", label: "Видеоинструкции" },
      { href: "/about", label: "О бренде" },
    ],
  },
  {
    title: "Бренды",
    links: [
      { href: "/catalog?brand=ecokon", label: "ЭКО Конь" },
      ...(SHOW_TSVETOLOGIYA
        ? [{ href: "/catalog?brand=tsvetologiya", label: "Цветология" }]
        : []),
    ],
  },
  {
    title: "Маркетплейсы",
    links: [
      { href: "https://www.ozon.ru/seller/eko-kon", label: "Ozon — ЭКО Конь", external: true },
      { href: "https://www.ozon.ru/seller/tsvetologiya", label: "Ozon — Цветология", external: true },
      { href: "https://www.wildberries.ru/seller/eko-kon", label: "Wildberries", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-bg-dark text-cream">
      <Ornament
        variant="sprig"
        color="var(--color-accent-light)"
        className="absolute top-10 right-16 opacity-30"
      />

      <div className="container-main pb-8 pt-20">
        <div className="mb-14 grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Logo size={1.2} light showTag />
            <p className="mt-6 max-w-[320px] text-[13px] leading-relaxed text-cream/70">
              Маркетплейс российских брендов для&nbsp;комнатных растений.
              Удобрения, грунты, фитомодули и&nbsp;аксессуары от&nbsp;небольших
              производителей.
            </p>
            <p className="mt-5 text-[11px] font-medium text-accent-light">
              Основано в&nbsp;2014 г.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <div className="mb-5 text-[10px] font-sans tracking-[0.18em] text-accent-light uppercase">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-cream/85 transition-colors hover:text-cream"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[13px] text-cream/85 transition-colors hover:text-cream"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center gap-4 border-t border-cream/10 pt-6 text-[11px] tracking-[0.06em] text-cream/50 sm:flex-row sm:justify-between">
          <span>
            © ООО «ЦВЕТОЛОГИЯ» · «ЭКО-КОНЬ» И «ЦВЕТОЛОГИЯ» —
            ЗАРЕГИСТРИРОВАННЫЕ ТМ
          </span>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-cream">
              ПОЛИТИКА
            </Link>
            <Link href="/terms" className="transition-colors hover:text-cream">
              ОФЕРТА
            </Link>
            <Link href="/legal" className="transition-colors hover:text-cream">
              ПРАВОВАЯ ИНФОРМАЦИЯ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
