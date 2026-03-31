"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (name.length < 2) {
      setError("Имя минимум 2 символа");
      return;
    }
    if (password.length < 8) {
      setError("Пароль минимум 8 символов");
      return;
    }
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-main flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <h1 className="text-center">Регистрация</h1>

        <div className="mt-4 flex justify-center">
          <Badge variant="bestseller" size="md">
            Промокод WELCOME10 — скидка 10% на первый заказ
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <p className="rounded-lg bg-error/10 px-4 py-2 text-sm text-error">
              {error}
            </p>
          )}

          <Input
            label="Имя"
            placeholder="Иван Петров"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="ivan@mail.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="Минимум 8 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Подтверждение пароля"
            type="password"
            placeholder="Повторите пароль"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={confirm && password !== confirm ? "Пароли не совпадают" : undefined}
            required
          />

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Создать аккаунт
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-gray-dark/60">
          Уже есть аккаунт?{" "}
          <Link href="/auth/login" className="text-brand-green font-medium hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
