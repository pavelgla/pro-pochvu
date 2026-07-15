import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingBag,
  Truck,
  ArrowRight,
  MessageCircle,
  MapPin,
  CreditCard,
} from "lucide-react";
import { generateFaqJsonLd } from "@/lib/structured-data";
import { formatPrice } from "@/lib/catalog";
import {
  FREE_DELIVERY_THRESHOLD,
  OZON_DELIVERY_COST,
  OZON_PVZ_MAP_URL,
  TELEGRAM_URL,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Доставка | Пропочву",
  description:
    "Заказывайте удобрения, грунты и фитомодули ЭКО Конь и Цветология прямо на сайте — доставка до пункта выдачи Ozon по всей России. Также доступны наши магазины на Wildberries и Ozon.",
  alternates: { canonical: "https://pro-pochvu.ru/delivery" },
};

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
      "Оформите заказ прямо на сайте pro-pochvu.ru: добавьте товары в корзину, укажите город и удобный пункт выдачи Ozon, оплатите онлайн. Также наши товары доступны в официальных магазинах на Wildberries и Ozon.",
  },
  {
    question: "Как работает доставка с сайта?",
    answer: `Заказы с сайта доставляются до пункта выдачи Ozon (сервис «Озон-доставка») по всей России. Стоимость доставки — ${OZON_DELIVERY_COST} ₽, при заказе от ${FREE_DELIVERY_THRESHOLD} ₽ — бесплатно. Срок доставки — обычно 3–7 дней.`,
  },
  {
    question: "Как оплатить заказ?",
    answer:
      "Онлайн при оформлении заказа: банковская карта, СБП, SberPay, T-Pay или рассрочка. Оплата проходит через защищённый сервис ЮKassa, чек приходит на email.",
  },
  {
    question: "Можно ли заказать через маркетплейс?",
    answer:
      "Да. На карточке каждого товара есть ссылки на Wildberries и Ozon — в этом случае оформление, оплата и доставка происходят по правилам маркетплейса.",
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
            Доставка до пункта выдачи Ozon
          </h1>
          <p className="text-gray-600 text-lg">
            Заказывайте прямо на сайте — привезём заказ в удобный пункт выдачи
            Ozon в вашем городе. Доставка {formatPrice(OZON_DELIVERY_COST)}, при
            заказе от {formatPrice(FREE_DELIVERY_THRESHOLD)} — бесплатно.
          </p>
        </div>

        {/* Как это работает */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Как это работает</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <ShoppingBag className="w-6 h-6 text-accent" />
              <p className="font-semibold text-gray-900">1. Собираете корзину</p>
              <p className="text-gray-600 text-sm">
                Выбирайте товары в каталоге — состав, инструкции и отзывы на каждой карточке.
              </p>
            </div>
            <div className="space-y-2">
              <MapPin className="w-6 h-6 text-accent" />
              <p className="font-semibold text-gray-900">2. Указываете пункт выдачи</p>
              <p className="text-gray-600 text-sm">
                Город и адрес удобного пункта выдачи Ozon —{" "}
                <a
                  href={OZON_PVZ_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline"
                >
                  найти на карте
                </a>
                .
              </p>
            </div>
            <div className="space-y-2">
              <CreditCard className="w-6 h-6 text-accent" />
              <p className="font-semibold text-gray-900">3. Оплачиваете онлайн</p>
              <p className="text-gray-600 text-sm">
                Карта, СБП, SberPay, T-Pay или рассрочка — через сервис ЮKassa.
              </p>
            </div>
          </div>
        </section>

        {/* Условия */}
        <section className="rounded-2xl bg-cream p-8 flex items-start gap-4">
          <Truck className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Условия доставки
            </h2>
            <ul className="text-gray-700 space-y-1.5">
              <li>
                • Стоимость — {formatPrice(OZON_DELIVERY_COST)}, бесплатно при
                заказе от {formatPrice(FREE_DELIVERY_THRESHOLD)}
              </li>
              <li>• Срок — обычно 3–7 дней в зависимости от региона</li>
              <li>• Получение — в пункте выдачи Ozon по всей России</li>
              <li>
                • Трек-номер отправим на email и покажем в{" "}
                <Link href="/account/orders" className="text-accent underline">
                  личном кабинете
                </Link>
              </li>
            </ul>
          </div>
        </section>

        {/* Маркетплейсы как альтернатива */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Также — на маркетплейсах
          </h2>
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
