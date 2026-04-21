import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, XCircle, MessageCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Возврат товара | ЭКО Конь",
  description:
    "Условия возврата товара. 14 дней на возврат. Возвращаем деньги в течение 10 дней.",
  alternates: { canonical: "https://pro-pochvu.ru/returns" },
};

const TELEGRAM_URL = "https://t.me/+7cAd9gatgP44MDcy";

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-10">

        {/* Блок 1 — Главное */}
        <div className="rounded-2xl bg-brand-green/10 border border-brand-green/30 p-8 text-center">
          <p className="text-4xl mb-3">✅</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-green mb-3">
            14 дней на возврат без вопросов
          </h1>
          <p className="text-gray-600 text-lg">
            Если товар не подошёл — вернём полную стоимость. Это наша гарантия.
          </p>
        </div>

        {/* Блок 2 — Условия */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Условия возврата</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Можно вернуть */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-5 space-y-3">
              <h3 className="font-semibold text-green-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                Можно вернуть
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Товар в оригинальной упаковке, не вскрытый
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Товар с браком или повреждением при доставке (в любом состоянии)
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Товар, не соответствующий описанию
                </li>
              </ul>
            </div>

            {/* Нельзя вернуть */}
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 space-y-3">
              <h3 className="font-semibold text-red-800 flex items-center gap-2">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                Нельзя вернуть
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex gap-2">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  Вскрытые удобрения (по санитарным нормам)
                </li>
                <li className="flex gap-2">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  Товары с явными следами использования
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Блок 3 — Как оформить */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Как оформить возврат</h2>
          <ol className="space-y-5">
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-brand-green" />
                  Напишите нам
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Telegram:{" "}
                  <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-green underline underline-offset-2 hover:no-underline"
                  >
                    t.me/+7cAd9gatgP44MDcy
                  </a>{" "}
                  или через форму на странице{" "}
                  <Link href="/contacts" className="text-brand-green underline underline-offset-2 hover:no-underline">
                    контактов
                  </Link>
                  .
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">📸 Пришлите фото</p>
                <p className="text-gray-600 text-sm mt-1">
                  Фото товара и упаковки. При браке — фото обязательно.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900">🔄 Получите подтверждение</p>
                <p className="text-gray-600 text-sm mt-1">
                  Пришлём инструкции по отправке. Деньги вернём в течение{" "}
                  <span className="font-medium text-gray-800">10 рабочих дней</span>.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* Блок 4 — Гарантия на фитомодули */}
        <section className="rounded-2xl bg-brand-cream p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Фитомодули Цветология — гарантия 5 лет
          </h2>
          <p className="text-gray-700 mb-4">
            Производственный брак, трещины, деформация без механических повреждений —
            заменим бесплатно.
          </p>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-medium mb-1">Гарантия не распространяется на:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-700">
              <li>механические повреждения</li>
              <li>неправильную установку</li>
            </ul>
          </div>
        </section>

        {/* Блок 5 — Контакты */}
        <section className="rounded-2xl border border-gray-200 p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Контакты для возврата</h2>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-green/90 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Написать в Telegram
          </a>
          <div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1 text-brand-green hover:underline font-medium"
            >
              Перейти в каталог
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Footer ссылка */}
        <p className="text-sm text-gray-500 text-center">
          Полные условия —{" "}
          <Link href="/terms" className="text-brand-green underline underline-offset-2 hover:no-underline">
            Пользовательское соглашение
          </Link>
        </p>
      </div>
    </main>
  );
}
