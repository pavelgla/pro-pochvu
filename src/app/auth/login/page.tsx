"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("callbackUrl") || "/account";
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push(returnUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Неверный email или пароль"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-center">Вход</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="rounded-lg bg-error/10 px-4 py-2 text-sm text-error">
            {error}
          </p>
        )}

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

        <div className="text-right">
          <Link
            href="/auth/reset-password"
            className="text-sm text-brand-green hover:underline"
          >
            Забыли пароль?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Войти
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-gray-dark/60">
        Нет аккаунта?{" "}
        <Link href="/auth/signup" className="text-brand-green font-medium hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container-main flex min-h-[60vh] items-center justify-center py-12">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
