import type { Metadata } from "next";
import { MessageCircle, ShoppingBag, ChevronDown } from "lucide-react";
import { generateFaqJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Контакты | ЭКО Конь и Цветология",
  description:
    "Свяжитесь с нами через Telegram. Ответим в течение 1 часа в рабочее время.",
  alternates: { canonical: "https://pro-pochvu.ru/contacts" },
};

const faq = [
  {
    q: "В какое время отвечаете?",
    a: "Пн–пт, 9:00–18:00 МСК. В выходные — по возможности.",
  },
  {
    q: "По каким вопросам можно писать?",
    a: "Любые: состав товара, условия доставки, возврат, оптовые заказы, сотрудничество.",
  },
  {
    q: "Можно ли оформить оптовый заказ?",
    a: "Да, обсуждаем индивидуальные условия. Напишите в Telegram.",
  },
];

export default function ContactsPage() {
  const faqJsonLd = generateFaqJsonLd(faq.map(({ q, a }) => ({ question: q, answer: a })));
  return (
    <div className="container-main section-padding">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Свяжитесь с нами
        </h1>
        <p className="text-gray-500">
          Ответим в течение 1 часа в рабочее время (пн–пт, 9:00–18:00 по МСК)
        </p>
      </div>

      {/* Block 1 — Main contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Telegram card */}
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4">
          <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            Рекомендуем
          </span>
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Telegram — быстрее всего
            </h2>
            <p className="text-gray-500 text-sm">
              Напишите нам напрямую. Отвечаем быстро.
            </p>
          </div>
          <a
            href="https://t.me/+7cAd9gatgP44MDcy"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors w-fit"
          >
            <MessageCircle className="w-4 h-4" />
            Написать в Telegram
          </a>
        </div>

        {/* Catalog card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Каталог товаров
            </h2>
            <p className="text-gray-500 text-sm">
              Смотрите все наши товары: удобрения ЭКО Конь и фитомодули
              Цветология.
            </p>
          </div>
          <a
            href="https://pro-pochvu.ru/catalog"
            className="mt-auto inline-flex items-center gap-2 border border-gray-200 hover:border-green-500 hover:text-green-700 text-gray-700 font-medium text-sm px-5 py-2.5 rounded-xl transition-colors w-fit"
          >
            <ShoppingBag className="w-4 h-4" />
            Открыть каталог
          </a>
        </div>
      </div>

      {/* Block 2 — Marketplaces */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Наши магазины на маркетплейсах
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.ozon.ru/brand/eko-kon-147553078/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-blue-400 hover:text-blue-700 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors bg-white"
          >
            Ozon — ЭКО Конь
          </a>
          <a
            href="https://www.ozon.ru/seller/tsvetologiya-1448738/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-blue-400 hover:text-blue-700 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors bg-white"
          >
            Ozon — Цветология
          </a>
          <a
            href="https://www.wildberries.ru/brands/eko-kon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-purple-400 hover:text-purple-700 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors bg-white"
          >
            Wildberries
          </a>
        </div>
      </div>

      {/* Block 3 — Legal */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-12 text-sm text-gray-500 leading-relaxed">
        КФХ «Ранчо Мушкино»
        <br />
        Глава КФХ: Гладышев Юрий Евгеньевич
        <br />
        Регион: Калининградская область, Россия
        <br />
        Торговые марки: «ЭКО Конь» и «Цветология» зарегистрированы в
        установленном порядке.
      </div>

      {/* Block 4 — FAQ */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Частые вопросы
        </h2>
        <div className="flex flex-col gap-3">
          {faq.map(({ q, a }) => (
            <details
              key={q}
              className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-medium text-gray-900 list-none">
                {q}
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-4" />
              </summary>
              <p className="px-6 pb-4 text-gray-500 text-sm">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
