"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";
import { useCartStore } from "@/store/cartStore";
import { SHOW_TSVETOLOGIYA } from "@/lib/constants";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?brand=ecokon", label: "Бренды" },
  { href: "/knowledge-base/video", label: "Уход за растениями" },
  { href: "/about", label: "О нас" },
  ...(SHOW_TSVETOLOGIYA
    ? [{ href: "/catalog?brand=tsvetologiya", label: "Фитомодули" }]
    : []),
];

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M12 12l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M9 15.5 S2 11 2 6.5C2 4 4 2.5 6 2.5c1.5 0 2.5 1 3 2 .5-1 1.5-2 3-2 2 0 4 1.5 4 4 0 4.5-7 9-7 9Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="6.5" r="2.8" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M3.5 15.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const IconBag = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 4.5h9l-.8 8H3.3l-.8-8Z" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5 4.5v-1c0-1.1.9-2 2-2s2 .9 2 2v1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = useCartStore((s) => s.getItemCount());
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      {/* Utility bar */}
      <div className="bg-bg-dark text-cream hidden md:block">
        <div className="container-main flex items-center justify-between py-2 text-[11px] tracking-[0.08em] font-sans">
          <span className="font-medium">★ 4.9 на Ozon · 51&nbsp;000+ отзывов</span>
          <span className="font-medium">
            Бесплатная доставка от&nbsp;3 000&nbsp;₽
          </span>
          <span className="opacity-80 font-medium">RU</span>
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur">
        <div className="container-main flex h-[72px] items-center">
          <Logo />

          <nav className="ml-14 mr-auto hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="relative text-sm font-normal text-ink-2 transition-colors hover:text-ink pb-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <button
              className="hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-bg-soft md:flex"
              aria-label="Поиск"
            >
              <IconSearch />
            </button>
            <button
              className="hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-bg-soft md:flex"
              aria-label="Избранное"
            >
              <IconHeart />
            </button>
            <Link
              href={user ? "/account" : "/auth/login"}
              className="hidden h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-bg-soft md:flex"
              aria-label="Аккаунт"
            >
              <IconUser />
            </Link>

            {/* Cart button */}
            <Link
              href="/cart"
              className="flex items-center gap-2 rounded-full bg-ink text-bg px-4 py-2 text-[13px] font-medium transition-colors hover:bg-accent"
            >
              <IconBag />
              <span className="hidden sm:inline">Корзина</span>
              {cartCount > 0 && (
                <span className="rounded-full bg-accent px-2 py-px text-[11px] font-semibold">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-bg-soft md:hidden"
              aria-label="Открыть меню"
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
