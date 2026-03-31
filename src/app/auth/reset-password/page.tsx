"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-main flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <h1 className="text-center">Восстановление пароля</h1>

        {sent ? (
          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-brand-green">
              Письмо отправлено!
            </p>
            <p className="mt-2 text-sm text-brand-gray-dark/60">
              Проверьте почту {email} и перейдите по ссылке для сброса пароля.
            </p>
            <Link
              href="/auth/login"
              className="mt-6 inline-block text-sm text-brand-green hover:underline"
            >
              Вернуться ко входу
            </Link>
          </div>
        ) : (
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

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Отправить ссылку
            </Button>

            <p className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-brand-gray-dark/60 hover:text-brand-green"
              >
                Вернуться ко входу
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
