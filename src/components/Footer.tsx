import Link from "next/link";

function VKIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.188 1.368 1.259 2.184 1.814.616.42 1.084.328 1.084.328l2.178-.03s1.14-.07.6-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.264-1.183-1.06.462-3.246.998-1.328 1.398-2.14 1.273-2.487-.12-.332-.856-.244-.856-.244l-2.452.015s-.182-.025-.316.056c-.132.079-.216.264-.216.264s-.389 1.035-.908 1.916c-1.093 1.854-1.532 1.952-1.71 1.837-.416-.268-.312-1.074-.312-1.647 0-1.79.271-2.536-.529-2.73-.266-.064-.462-.107-1.142-.114-.872-.008-1.61.003-2.028.207-.278.136-.492.44-.362.457.162.021.528.099.722.363.25.341.241 1.107.241 1.107s.144 2.108-.335 2.37c-.33.18-.78-.187-1.75-1.865-.496-.86-.871-1.81-.871-1.81s-.072-.177-.202-.272c-.156-.115-.374-.151-.374-.151l-2.33.015s-.35.01-.479.162c-.114.135-.009.414-.009.414s1.83 4.282 3.901 6.442c1.9 1.98 4.058 1.85 4.058 1.85h.978z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

const companyLinks = [
  { href: "/about", label: "О компании" },
  { href: "/blog", label: "Блог" },
  { href: "/knowledge-base", label: "База знаний" },
  { href: "/contacts", label: "Контакты" },
];

const customerLinks = [
  { href: "/delivery", label: "Доставка и оплата" },
  { href: "/terms", label: "Оферта" },
  { href: "/privacy", label: "Политика конфиденциальности" },
];

export function Footer() {
  return (
    <footer className="bg-brand-gray-dark text-white">
      <div className="container-main py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Company */}
          <div>
            <h4 className="mb-4 text-base font-bold">О компании</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
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

          {/* Customer */}
          <div>
            <h4 className="mb-4 text-base font-bold">Покупателям</h4>
            <ul className="space-y-2">
              {customerLinks.map((link) => (
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

          {/* Contacts */}
          <div>
            <h4 className="mb-4 text-base font-bold">Контакты</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a
                  href="mailto:info@ecokon.ru"
                  className="transition-colors hover:text-white"
                >
                  info@ecokon.ru
                </a>
              </li>
              <li>
                <a
                  href="tel:+79001234567"
                  className="transition-colors hover:text-white"
                >
                  +7 (900) 123-45-67
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a
                href="https://vk.com/ecokon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/20"
                aria-label="ВКонтакте"
              >
                <VKIcon className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/ecokon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Telegram"
              >
                <TelegramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          &copy; 2026 КФХ Ранчо Мушкино. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
