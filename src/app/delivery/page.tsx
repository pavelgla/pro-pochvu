import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  MapPin,
  Store,
  Mail,
  CreditCard,
  Smartphone,
  Banknote,
  Clock,
  Truck,
  ArrowRight,
} from "lucide-react";
import { FaqAccordion } from "./FaqAccordion";

export const metadata: Metadata = {
  title: "Доставка и оплата | ЭКО Конь",
  description:
    "Доставка по всей России: СДЭК, Boxberry, 5Post, Почта России. Оплата картой, СБП, наличными.",
  alternates: { canonical: "https://pro-pochvu.ru/delivery" },
};

const deliveryMethods = [
  {
    icon: Package,
    name: "СДЭК",
    desc: "Доставка в ПВЗ или курьером",
    days: "1–7 дней",
    price: "от 99 ₽",
  },
  {
    icon: MapPin,
    name: "Boxberry",
    desc: "Более 9 000 пунктов выдачи",
    days: "2–7 дней",
    price: "от 99 ₽",
  },
  {
    icon: Store,
    name: "5Post",
    desc: "Пункты выдачи в магазинах",
    days: "2–5 дней",
    price: "от 99 ₽",
  },
  {
    icon: Mail,
    name: "Почта России",
    desc: "Доставка в любой регион РФ",
    days: "3–14 дней",
    price: "от 99 ₽",
  },
];

const paymentMethods = [
  {
    icon: CreditCard,
    name: "Банковская карта",
    sub: "Visa, MasterCard, МИР",
    desc: "Безопасная оплата через ЮKassa. Данные карты не хранятся на нашем сайте.",
  },
  {
    icon: Smartphone,
    name: "СБП",
    sub: "Система быстрых платежей",
    desc: "Оплата по QR-коду через приложение банка. Без комиссии.",
  },
  {
    icon: Banknote,
    name: "Наличными при получении",
    sub: "При поддержке ПВЗ",
    desc: "Только для пунктов выдачи, где поддерживается. Уточняйте у оператора.",
  },
];

export default function DeliveryPage() {
  return (
    <div className="container-main section-padding">
      <h1 className="mb-2">Доставка и оплата</h1>
      <p className="text-gray-500 mb-10">
        Доставляем по всей России несколькими удобными способами
      </p>

      {/* Delivery methods */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-5">Способы доставки</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {deliveryMethods.map(({ icon: Icon, name, desc, days, price }) => (
            <div
              key={name}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-4 items-start"
            >
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-0.5">{name}</div>
                <div className="text-sm text-gray-500 mb-2">{desc}</div>
                <div className="flex gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 text-gray-700">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {days}
                  </span>
                  <span className="text-green-700 font-medium">{price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Free delivery banner */}
        <div className="bg-green-600 text-white rounded-2xl px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">🎁</span>
          <p className="font-medium">
            Бесплатная доставка при заказе от 3 000 ₽{" "}
            <span className="font-normal opacity-90">(любой способ)</span>
          </p>
        </div>
      </section>

      {/* Payment methods */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-5">Способы оплаты</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map(({ icon: Icon, name, sub, desc }) => (
            <div
              key={name}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-green-600" />
              </div>
              <div className="font-semibold text-gray-900">{name}</div>
              <div className="text-xs text-green-700 font-medium mb-2">{sub}</div>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Terms */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-5">Сроки и условия</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {[
              { icon: Clock, label: "Обработка заказа", value: "1 рабочий день" },
              {
                icon: Truck,
                label: "Отгрузка",
                value: "На следующий рабочий день после оплаты",
              },
              {
                icon: MapPin,
                label: "Москва и Санкт-Петербург",
                value: "1–3 дня",
              },
              { icon: MapPin, label: "Регионы России", value: "3–10 дней" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{label}</div>
                  <div className="text-gray-500 text-sm">{value}</div>
                </div>
              </div>
            ))}
            <div className="flex gap-3 md:col-span-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Трекинг</div>
                <div className="text-gray-500 text-sm">
                  Номер отслеживания отправляем на email после отгрузки
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-5">Частые вопросы</h2>
        <FaqAccordion />
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-2xl transition-colors"
        >
          Перейти в каталог
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
