"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { SHOW_TSVETOLOGIYA } from "@/lib/constants";

const menuLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?brand=ecokon", label: "Бренды" },
  { href: "/knowledge-base/video", label: "Уход за растениями" },
  { href: "/about", label: "О нас" },
  ...(SHOW_TSVETOLOGIYA
    ? [{ href: "/catalog?brand=tsvetologiya", label: "Фитомодули" }]
    : []),
  { href: "/delivery", label: "Доставка и оплата" },
];

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: session } = useSession();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-[70] flex h-full w-80 flex-col bg-bg shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-[72px] items-center justify-between border-b border-line px-6">
          <Logo size={0.8} />
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-bg-soft"
            aria-label="Закрыть меню"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-auto px-4 py-6">
          {menuLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              onClick={onClose}
              className="flex h-12 items-center rounded-lg px-4 font-serif text-lg font-medium text-ink transition-colors hover:bg-bg-soft"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Account */}
        <div className="border-t border-line p-4">
          {session?.user ? (
            <Link
              href="/account"
              onClick={onClose}
              className="flex h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium text-ink transition-colors hover:bg-bg-soft"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6.5" r="2.8" stroke="currentColor" strokeWidth="1.3" />
                <path d="M3.5 15.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Личный кабинет
            </Link>
          ) : (
            <Link
              href="/auth/login"
              onClick={onClose}
              className="flex h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium text-ink transition-colors hover:bg-bg-soft"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M10 3h4v12h-4M7 9h7M12 6l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Войти
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
