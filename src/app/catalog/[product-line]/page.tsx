import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { CatalogContent } from "../CatalogContent";
import { getProductLineBySlug, getProductLines } from "@/lib/catalog";

type Props = {
  params: { "product-line": string };
};

export function generateStaticParams() {
  return getProductLines().map((pl) => ({
    "product-line": pl.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const pl = getProductLineBySlug(params["product-line"]);
  if (!pl) return {};

  const title = `${pl.name} — ${pl.brand === "ecokon" ? "ЭКО Конь" : "Цветология"}`;
  const description = pl.description || `${pl.name} — купить в интернет-магазине ecokon.ru`;

  return {
    title,
    description,
    alternates: { canonical: `https://ecokon.ru/catalog/${pl.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

const crossSell: Record<string, { slug: string; title: string; text: string }> = {
  ecokon: {
    slug: "fitmoduli",
    title: "Фитомодули Цветология",
    text: "Дополните уход за растениями стильными модулями для вертикального озеленения",
  },
  tsvetologiya: {
    slug: "bio-chay",
    title: "Удобрения ЭКО Конь",
    text: "Подберите органические удобрения для растений в ваших фитомодулях",
  },
};

const whyChoose: Record<string, { emoji: string; title: string; text: string }[]> = {
  "bio-chay": [
    { emoji: "🌿", title: "100% органика", text: "На основе конского компоста без химических добавок" },
    { emoji: "📦", title: "Удобный формат", text: "Стики — просто заварите в воде, не нужно отмерять" },
    { emoji: "🛡️", title: "Безопасно", text: "Для детей, животных и окружающей среды" },
    { emoji: "⭐", title: "Проверено", text: "Более 20 000 отзывов с рейтингом 4.9+" },
  ],
  specialized: [
    { emoji: "🎯", title: "Точная формула", text: "Состав подобран под конкретные культуры" },
    { emoji: "💪", title: "Результат", text: "Видимый эффект уже через 7-14 дней" },
    { emoji: "🌿", title: "Органическая основа", text: "Конский компост + специализированные добавки" },
    { emoji: "📋", title: "Инструкция", text: "Понятные рекомендации по применению" },
  ],
  fitmoduli: [
    { emoji: "🏡", title: "Для дома и офиса", text: "Стильное вертикальное озеленение любого пространства" },
    { emoji: "♻️", title: "Эко-материалы", text: "Из переработанного пластика" },
    { emoji: "🔧", title: "Простой монтаж", text: "Установка за 15 минут без специальных инструментов" },
    { emoji: "💧", title: "Удобный полив", text: "Продуманная система дренажа" },
  ],
  accessories: [
    { emoji: "🛡️", title: "Защита растений", text: "Укрывные материалы от заморозков и вредителей" },
    { emoji: "🌱", title: "Совместимость", text: "Идеально подходят к фитомодулям Цветология" },
    { emoji: "📏", title: "Разные размеры", text: "Подберите под ваши задачи" },
    { emoji: "✅", title: "Проверено", text: "Тестируется на нашей ферме" },
  ],
};

export default function ProductLinePage({ params }: Props) {
  const pl = getProductLineBySlug(params["product-line"]);
  if (!pl) notFound();

  const cross = crossSell[pl.brand];
  const reasons = whyChoose[pl.slug] || whyChoose["bio-chay"];

  return (
    <div className="container-main section-padding">
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Каталог", href: "/catalog" },
          { label: pl.name },
        ]}
      />

      {/* Hero banner */}
      <div
        className={`mt-6 rounded-2xl p-6 md:p-10 ${
          pl.brand === "ecokon" ? "bg-ecokon/5" : "bg-tsvetologiya/5"
        }`}
      >
        <h1
          className={
            pl.brand === "ecokon" ? "text-ecokon" : "text-tsvetologiya"
          }
        >
          {pl.name}
        </h1>
        {pl.description && (
          <p className="mt-2 max-w-2xl text-brand-gray-dark/70">
            {pl.description}
          </p>
        )}
      </div>

      {/* Products */}
      <div className="mt-8">
        <Suspense>
          <CatalogContent productLineSlug={pl.slug} />
        </Suspense>
      </div>

      {/* Why choose */}
      <section className="mt-16">
        <h2 className="mb-6">Почему выбирают {pl.name.toLowerCase()}</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="rounded-xl bg-brand-gray-light/50 p-5"
            >
              <span className="text-2xl">{r.emoji}</span>
              <h4 className="mt-2 text-sm font-bold">{r.title}</h4>
              <p className="mt-1 text-sm text-brand-gray-dark/60">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-sell */}
      {cross && (
        <section className="mt-16 rounded-2xl bg-brand-cream p-6 text-center md:p-10">
          <h2>Отлично сочетается с</h2>
          <p className="mt-2 text-brand-gray-dark/60">{cross.text}</p>
          <div className="mt-4">
            <Link href={`/catalog/${cross.slug}`}>
              <Button variant="secondary">{cross.title} →</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
