import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Ornament } from "@/components/ui/Ornament";

export const metadata: Metadata = {
  title: "О бренде ЭКО Конь и Цветология | КФХ «Ранчо Мушкино»",
  description:
    "История бренда органических удобрений ЭКО Кон�� и систем вертикального озеленения Цветология. КФХ «Ранчо Мушкино», Калининградская область.",
  alternates: { canonical: "https://pro-pochvu.ru/about" },
};

const stats = [
  { value: "50 000+", label: "довольных покупателей" },
  { value: "4.9★", label: "средний рейтинг" },
  { value: "18", label: "товаров в линейке" },
  { value: "5 лет", label: "гарантия на фитомодули" },
];

const timeline = [
  { year: "2012", text: "Первые эксперименты с ферментацией конского навоза на ферме" },
  { year: "2020", text: "Запуск бренда «ЭКО Конь» на Ozon — первые 100 заказов за месяц" },
  { year: "2022", text: "Старт «Цветология» — фитомодули для вертикального озеленения" },
  { year: "2024", text: "50 000 довольных клиентов, рейтинг 4.9 на маркетплейсах" },
  { year: "2026", text: "Собственный D2C сайт pro-pochvu.ru — напрямую от производителя" },
];

const principles = [
  { title: "Натуральный состав", text: "Только органика: конский навоз, янтарная кислота, фосфор. Без химии." },
  { title: "Ручная фасовка", text: "Каждую партию проверяем и фасуем вручную на ферме." },
  { title: "Прямая связь", text: "Консультируем по подбору и уходу — отвечаем в чате и по телефону." },
];

export default function AboutPage() {
  return (
    <div className="container-main section-padding">
      {/* Hero */}
      <div className="mb-16">
        <div className="section-label mb-5">
          <Ornament variant="divider" />
          <span>О НАС</span>
        </div>
        <h1 className="section-heading text-4xl md:text-5xl lg:text-6xl">
          Органика с фермы —<br />��рямо <span className="text-accent">к вам.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-2 leading-relaxed">
          КФХ «Ранчо Мушкино» производит удобрения на основе конского навоза и
          системы вертикального озеленения с 2012 года.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="rounded-lg border border-line bg-bg p-6 text-center"
          >
            <div className="font-serif text-3xl font-medium text-accent mb-1">
              {value}
            </div>
            <div className="text-sm text-mute">{label}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <h2 className="font-serif text-3xl font-normal tracking-tight mb-8">
          Наша история
        </h2>
        <div className="space-y-6 border-l-2 border-line pl-8">
          {timeline.map((t) => (
            <div key={t.year} className="relative">
              <div className="absolute -left-[41px] top-0.5 h-4 w-4 rounded-full border-2 border-accent bg-bg" />
              <div className="font-serif text-xl font-medium text-accent">{t.year}</div>
              <p className="mt-1 text-ink-2">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Principles */}
      <div className="mb-16">
        <h2 className="font-serif text-3xl font-normal tracking-tight mb-8">
          Принципы
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="rounded-lg border border-line p-7">
              <h3 className="font-serif text-xl font-medium tracking-tight">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Два бренда */}
      <div className="mb-16">
        <h2 className="font-serif text-3xl font-normal tracking-tight mb-8">
          Два бренда
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-bg-soft p-7">
            <div className="font-serif text-xl font-medium mb-2">ЭКО Конь</div>
            <p className="text-sm leading-relaxed text-ink-2">
              Органические удобрения. Био-чай в стиках, специализированные
              составы для разных культур. Без химии, только натуральное.
            </p>
          </div>
          <div className="rounded-lg bg-bg-soft p-7">
            <div className="font-serif text-xl font-medium mb-2">Цветология</div>
            <p className="text-sm leading-relaxed text-ink-2">
              Фитомодули для вертикального озеленения. Производство Россия,
              ABS-пластик, гарантия 5 лет.
            </p>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="mb-16">
        <div className="rounded-lg border border-line bg-cream/50 p-7">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-accent shrink-0" />
            <h2 className="font-serif text-lg font-medium">Товарные знаки</h2>
          </div>
          <p className="text-sm leading-relaxed text-ink-2 mb-2">
            Торговые марки «ЭКО Конь» и «Цветология» зарегистрированы в
            установленном порядке на территории Российской Федерации и
            принадлежат КФХ «Ранчо Мушкино» (глава — Гладышев Юрий Евгеньевич).
          </p>
          <p className="text-sm text-mute">
            © КФХ «Ранчо Мушкино». Все права защищены.
          </p>
        </div>
      </div>

      {/* Marketplaces */}
      <div className="mb-16">
        <h2 className="font-serif text-3xl font-normal tracking-tight mb-6">
          Наши магазины
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "https://www.ozon.ru/brand/eko-kon-147553078/", label: "Ozon — ЭКО Конь" },
            { href: "https://www.ozon.ru/seller/tsvetologiya-1448738/", label: "Ozon — Цветология" },
            { href: "https://www.wildberries.ru/brands/eko-kon", label: "Wildberries" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/catalog" className="btn-primary">
          Смотреть каталог →
        </Link>
      </div>
    </div>
  );
}
