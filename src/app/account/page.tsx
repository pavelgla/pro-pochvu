"use client";

import Link from "next/link";
import { Package, Heart, MapPin, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

const cards = [
  { href: "/account/orders", icon: Package, label: "Заказы", desc: "История и статус заказов" },
  { href: "/account/favorites", icon: Heart, label: "Избранное", desc: "Сохранённые товары" },
  { href: "/account/addresses", icon: MapPin, label: "Адреса", desc: "Адреса доставки" },
  { href: "/account/settings", icon: Settings, label: "Настройки", desc: "Профиль и пароль" },
];

export default function AccountPage() {
  const { data: session } = useSession();
  const name = session?.user?.name || session?.user?.email || "пользователь";

  return (
    <div className="space-y-8">
      <div>
        <h2>Привет, {name}!</h2>
        <p className="mt-1 text-sm text-mute">
          Добро пожаловать в личный кабинет
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-xl border border-line p-4 hover:border-accent/40 hover:bg-accent/5 transition-colors"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Icon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-medium">{label}</p>
              <p className="text-xs text-mute">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
        Выйти
      </Button>
    </div>
  );
}
