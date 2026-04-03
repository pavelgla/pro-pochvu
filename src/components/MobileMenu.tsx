"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, User, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const menuLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?brand=ecokon", label: "Удобрения" },
  { href: "/catalog?brand=tsvetologiya", label: "Фитомодули" },
  { href: "/about", label: "О бренде" },
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
          "fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-[70] flex h-full w-72 flex-col bg-white shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-brand-gray-light px-4">
          <span className="text-lg font-bold text-brand-green">Меню</span>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-brand-gray-light"
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-auto px-2 py-4">
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex h-12 items-center rounded-lg px-4 text-base font-medium text-brand-gray-dark transition-colors hover:bg-brand-gray-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Account */}
        <div className="border-t border-brand-gray-light p-4 flex flex-col gap-1">
          {session?.user ? (
            <Link
              href="/account"
              onClick={onClose}
              className="flex h-12 items-center gap-3 rounded-lg px-4 text-base font-medium text-brand-gray-dark transition-colors hover:bg-brand-gray-light"
            >
              <User className="h-5 w-5 text-brand-green" fill="currentColor" />
              Личный кабинет
            </Link>
          ) : (
            <Link
              href="/auth/login"
              onClick={onClose}
              className="flex h-12 items-center gap-3 rounded-lg px-4 text-base font-medium text-brand-gray-dark transition-colors hover:bg-brand-gray-light"
            >
              <LogIn className="h-5 w-5" />
              Войти
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
