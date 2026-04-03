import Link from "next/link";

const buyerLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/delivery", label: "Доставка и оплата" },
  { href: "/returns", label: "Возврат" },
  { href: "/contacts", label: "Контакты" },
];

const marketplaceLinks = [
  { href: "https://www.ozon.ru/seller/eko-kon", label: "Ozon — ЭКО Конь" },
  { href: "https://www.ozon.ru/seller/tsvetologiya", label: "Ozon — Цветология" },
  { href: "https://www.wildberries.ru/seller/eko-kon", label: "Wildberries" },
];

export function Footer() {
  return (
    <footer className="bg-brand-gray-dark text-white">
      <div className="container-main py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Col 1 — About */}
          <div>
            <h4 className="mb-4 text-base font-bold">ЭКО Конь + Цветология</h4>
            <p className="mb-3 text-sm text-white/70 leading-relaxed">
              Органические удобрения и системы вертикального озеленения.
              КФХ «Ранчо Мушкино», Калининградская обл.
            </p>
            <p className="text-sm text-white/70">
              ⭐ 4.9 на Ozon • 51 000+ отзывов
            </p>
          </div>

          {/* Col 2 — Buyers */}
          <div>
            <h4 className="mb-4 text-base font-bold">Покупателям</h4>
            <ul className="space-y-2">
              {buyerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Marketplaces */}
          <div>
            <h4 className="mb-4 text-base font-bold">Мы на маркетплейсах</h4>
            <ul className="space-y-2">
              {marketplaceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-md bg-white/10 px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between text-xs text-white/40">
          <div className="flex flex-col gap-1">
            <span>© 2026 ЭКО Конь / Цветология. КФХ «Ранчо Мушкино»</span>
            <span>® «ЭКО Конь» и «Цветология» — зарегистрированные торговые марки КФХ «Ранчо Мушкино»</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Пользовательское соглашение
            </Link>
            <Link href="/legal" className="transition-colors hover:text-white">
              Правовая информация
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
