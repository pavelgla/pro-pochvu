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
import { Ornament } from "@/components/ui/Ornament";
import { FaqAccordion } from "./FaqAccordion";

export const metadata: Metadata = {
  title: "Доставка и оплата | ЭКО Конь",
  description:
    "Доставка по всей России: СДЭК, Boxberry, 5Post, Почта России. Оплата картой, СБП, наличными.",
  alternates: { canonical: "https://pro-pochvu.ru/delivery" },
};

const deliveryMethods = [
  { icon: Package, name: "СДЭК", desc: "Доставка в ПВЗ или курьером", days: "1–7 дней", price: "от 99 ₽" },
  { icon: MapPin, name: "Boxberry", desc: "Более 9 000 пунктов выдачи", days: "2–7 дней", price: "от 99 ₽" },
  { icon: Store, name: "5Post", desc: "Пункты выдачи в магазинах", days: "2–5 дней", price: "от 99 ₽" },
  { icon: Mail, name: "Почта России", desc: "Доставка в любой регион РФ", days: "3–14 дней", price: "от 99 ₽" },
];

const paymentMethods = [
  { icon: CreditCard, name: "Банковская карта", sub: "Visa, MasterCard, МИР", desc: "Безопасная оплата через ЮKassa. Данные карты не хранятся на нашем сайте." },
  { icon: Smartphone, name: "СБП", sub: "Система быстрых платежей", desc: "Оплата по QR-коду через приложение банка. Без комиссии." },
  { icon: Banknote, name: "Наличными при получении", sub: "При поддержке ПВЗ", desc: "Только для пунктов выдачи, где поддерживается. Уточняйте у оператора." },
];

export default function DeliveryPage() {
  return (
    <div className="container-main section-padding">
      <div className="mb-10">
        <div className="section-label mb-4">
          <Ornament variant="divider" />
          <span>ЛОГИСТИКА</span>
        </div>
        <h1 className="section-heading text-4xl md:text-5xl lg:text-6xl">Доставка и оплата</h1>
        <p className="mt-4 text-mute">
          Доставляем по всей России несколькими удобными способами
        </p>
      </div>

      {/* Delivery methods */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl font-normal tracking-tight mb-6">Способы доставки</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {deliveryMethods.map(({ icon: Icon, name, desc, days, price }) => (
            <div
              key={name}
              className="flex gap-4 items-start rounded-lg border border-line bg-bg p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-soft">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-serif text-base font-medium">{name}</div>
                <div className="text-sm text-mute mb-2">{desc}</div>
                <div className="flex gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 text-ink-2">
                    <Clock className="h-3.5 w-3.5 text-mute" />
                    {days}
                  </span>
                  <span className="font-medium text-accent">{price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Free delivery banner */}
        <div className="flex items-center gap-3 rounded-lg bg-accent px-6 py-4 text-bg">
          <span className="text-2xl">🎁</span>
          <p className="font-medium">
            Бесплатная доставка при заказе от 3 000 ₽{" "}
            <span className="font-normal opacity-90">(любой способ)</span>
          </p>
        </div>
      </section>

      {/* Payment methods */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl font-normal tracking-tight mb-6">Способы оплаты</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map(({ icon: Icon, name, sub, desc }) => (
            <div key={name} className="rounded-lg border border-line bg-bg p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-soft mb-3">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div className="font-serif text-base font-medium">{name}</div>
              <div className="text-xs font-medium text-accent mb-2">{sub}</div>
              <p className="text-sm text-mute leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Terms */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl font-normal tracking-tight mb-6">Сроки и условия</h2>
        <div className="rounded-lg border border-line bg-bg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {[
              { icon: Clock, label: "Обработка заказа", value: "1 рабочий день" },
              { icon: Truck, label: "Отгрузка", value: "На следующий рабочий день после оплаты" },
              { icon: MapPin, label: "Москва и Санкт-Петербург", value: "1–3 дня" },
              { icon: MapPin, label: "Регионы России", value: "3–10 дней" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-soft mt-0.5">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-sm text-mute">{value}</div>
                </div>
              </div>
            ))}
            <div className="flex gap-3 md:col-span-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-soft mt-0.5">
                <Mail className="h-4 w-4 text-accent" />
              </div>
              <div>
                <div className="text-sm font-medium">Трекинг</div>
                <div className="text-sm text-mute">
                  Номер отслеживания отправляем на email после отгрузки
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl font-normal tracking-tight mb-6">Частые вопросы</h2>
        <FaqAccordion />
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link href="/catalog" className="btn-primary">
          Перейти в каталог
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
