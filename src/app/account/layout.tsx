"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, LogOut } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/account", label: "Профиль", icon: User },
  { href: "/account/orders", label: "Заказы", icon: Package },
  { href: "/account/favorites", label: "Избранное", icon: Heart },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="container-main section-padding flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-accent" />
      </div>
    );
  }

  return (
    <div className="container-main section-padding">
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Личный кабинет" },
        ]}
      />

      <h1 className="mt-4">Личный кабинет</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent/5 text-accent"
                    : "text-ink-2 hover:bg-bg-soft"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-mute transition-colors hover:bg-bg-soft hover:text-error"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </nav>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
