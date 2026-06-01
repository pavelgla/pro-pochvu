import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, Truck, Clock, ArrowRight, MessageCircle } from "lucide-react";
import { generateFaqJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Доставка | Пропочву",
  description:
    "Как купить удобрения, грунты и фитомодули ЭКО Конь и Цветология: сейчас — через Wildberries и Ozon с доставкой маркетплейса по всей России. Своя доставка с сайта — в разработке.",
  alternates: { canonical: "https://pro-pochvu.ru/delivery" },
};

const TELEGRAM_URL = "https://t.me/+7cAd9gatgP44MDcy";

const MARKETPLACES = [
  {
    name: "Ozon — ЭКО Конь",
    desc: "Удобрения, биогумус, грунты",
    href: "https://www.ozon.ru/seller/eko-kon",
    color: "#005BFF",
  },
  {
    name: "Ozon — Цветология",
    desc: "Фитомодули и аксессуары",
    href: "https://www.ozon.ru/seller/tsvetologiya",
    color: "#005BFF",
  },
  {
    name: "Wildberries",
    desc: "ЭКО Конь и Цветология",
    href: "https://www.wildberries.ru/seller/eko-kon",
    color: "#CB11AB",
  },
];

const FAQ = [
  {
    question: "Как купить ваши товары?",
    answer:
      "Сейчас покупка идёт через наши официальные магазины на Wildberries и Ozon. Выберите товар на сайте и нажмите «Купить на Wildberries» или «Купить на Ozon» — оформление, оплата и доставка происходят на маркетплейсе.",
  },
  {
    question: "Кто осуществляет доставку?",
    answer:
      "Доставку обеспечивает маркетплейс (Wildberries или Ozon) — до пункта выдачи, постамата или курьером по всей России. Сроки и стоимость определяются маркетплейсом на этапе оформления заказа.",
  },
  {
    question: "Можно ли заказать напрямую с сайта?",
    answer:
      "Прямая доставка с сайта в разработке. Мы подключаем собственную логистику и постепенно открываем оформление прямо на pro-pochvu.ru. Для части товаров покупка на сайте уже может быть доступна.",
  },
  {
    question: "Как узнать о подключении своей доставки и акциях?",
    answer:
      "Оставьте контакт при переходе на маркетплейс или подпишитесь на наш Telegram — сообщим, когда заработает прямая доставка, и предупредим об акциях на маркетплейсах.",
  },
];

export default function DeliveryPage() {
  const faqJsonLd = generateFaqJsonLd(FAQ);

  return (
    <main className="min-h-screen bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-10">
        {/* Главное */}
        <div className="rounded-2xl bg-accent/10 border border-accent/30 p-8 text-center">
          <p className="text-4xl mb-3">🚚</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-accent mb-3">
            Покупка — на Wildberries и Ozon
          </h1>
          <p className="text-gray-600 text-lg">
            Сейчас мы продаём через маркетплейсы: оплата и доставка по всей России —
            на их стороне. Своя доставка с сайта уже в разработке.
          </p>
        </div>

        {/* Где купить */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Где купить</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {MARKETPLACES.map((m) => (
              <a
                key={m.name}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-line p-5 transition-colors hover:bg-bg-soft flex flex-col gap-2"
              >
                <ShoppingBag className="w-6 h-6" style={{ color: m.color }} />
                <span className="font-semibold text-gray-900">{m.name}</span>
                <span className="text-sm text-gray-500">{m.desc}</span>
                <span
                  className="text-sm font-medium inline-flex items-center gap-1 mt-1"
                  style={{ color: m.color }}
                >
                  Открыть магазин <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Как это работает */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Как это работает</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <ShoppingBag className="w-6 h-6 text-accent" />
              <p className="font-semibold text-gray-900">1. Выбираете товар</p>
              <p className="text-gray-600 text-sm">
                В каталоге на сайте смотрите состав, инструкции и отзывы.
              </p>
            </div>
            <div className="space-y-2">
              <ArrowRight className="w-6 h-6 text-accent" />
              <p className="font-semibold text-gray-900">2. Переходите на маркетплейс</p>
              <p className="text-gray-600 text-sm">
                Кнопка «Купить на Wildberries» или «Купить на Ozon» ведёт на карточку товара.
              </p>
            </div>
            <div className="space-y-2">
              <Truck className="w-6 h-6 text-accent" />
              <p className="font-semibold text-gray-900">3. Маркетплейс доставляет</p>
              <p className="text-gray-600 text-sm">
                Оплата и доставка до ПВЗ, постамата или курьером — на стороне маркетплейса.
              </p>
            </div>
          </div>
        </section>

        {/* Своя доставка скоро */}
        <section className="rounded-2xl bg-cream p-8 flex items-start gap-4">
          <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Своя доставка с сайта — скоро
            </h2>
            <p className="text-gray-700">
              Мы подключаем собственную логистику, чтобы можно было оформлять заказ прямо
              на pro-pochvu.ru. Хотите узнать первыми — напишите нам в Telegram.
            </p>
          </div>
        </section>

        {/* Контакты */}
        <section className="rounded-2xl border border-gray-200 p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Остались вопросы?</h2>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Написать в Telegram
          </a>
          <div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1 text-accent hover:underline font-medium"
            >
              Перейти в каталог
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
