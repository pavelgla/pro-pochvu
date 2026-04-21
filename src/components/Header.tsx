"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { MobileMenu } from "./MobileMenu";
import { useCartStore } from "@/store/cartStore";
import { SHOW_TSVETOLOGIYA } from "@/lib/constants";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?brand=ecokon", label: "Удобрения" },
  ...(SHOW_TSVETOLOGIYA
    ? [{ href: "/catalog?brand=tsvetologiya", label: "Фитомодули" }]
    : []),
  { href: "/knowledge-base/video", label: "Видеоинструкции" },
  { href: "/about", label: "О бренде" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = useCartStore((s) => s.getItemCount());
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-brand-gray-light bg-white/95 backdrop-blur">
        <div className="container-main flex h-16 items-center justify-between">
          <div className="flex items-center gap-1.5 text-lg font-bold">
            <Link href="/" className="text-ecokon hover:opacity-80 transition-opacity">
              ЭКО Конь
            </Link>
            {SHOW_TSVETOLOGIYA && (
              <>
                <span className="text-brand-gray-dark/30">|</span>
                <Link href="/catalog?brand=tsvetologiya" className="text-tsvetologiya hover:opacity-80 transition-opacity">
                  Цветология
                </Link>
              </>
            )}
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-brand-gray-dark/70 transition-colors hover:text-brand-green"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-brand-gray-light"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <Link
              href={user ? "/account" : "/auth/login"}
              className="hidden h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-brand-gray-light md:flex"
            >
              <User
                className={`h-5 w-5 ${user ? "text-brand-green" : ""}`}
                fill={user ? "currentColor" : "none"}
              />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-brand-gray-light md:hidden"
              aria-label="Открыть меню"
            >
              <Menu className="h-5 w-5" />
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
