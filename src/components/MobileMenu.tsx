"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, User } from "lucide-react";
import { cn } from "@/lib/utils";

const menuLinks = [
  { href: "/catalog/udobreniya", label: "Удобрения" },
  { href: "/catalog/vertikalnoe-ozelenenie", label: "Вертикальное озеленение" },
  { href: "/blog", label: "Блог" },
  { href: "/about", label: "О компании" },
  { href: "/delivery", label: "Доставка" },
  { href: "/contacts", label: "Контакты" },
];

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
        <div className="border-t border-brand-gray-light p-4">
          <Link
            href="/account"
            onClick={onClose}
            className="flex h-12 items-center gap-3 rounded-lg px-4 text-base font-medium text-brand-gray-dark transition-colors hover:bg-brand-gray-light"
          >
            <User className="h-5 w-5" />
            Личный кабинет
          </Link>
        </div>
      </div>
    </>
  );
}
