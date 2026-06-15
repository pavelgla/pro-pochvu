import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Ornament } from "@/components/ui/Ornament";
import { CatalogContent } from "../CatalogContent";
import { getProductLineBySlug, getProductLines } from "@/lib/catalog";
import { SHOW_TSVETOLOGIYA } from "@/lib/constants";

type Props = {
  params: { "product-line": string };
};

export const dynamic = "force-dynamic";

// Уникальные SEO-заголовки и описания по линейкам. title идёт под шаблон "%s | Пропочву",
// поэтому держим его коротким; h1 — видимый заголовок страницы.
const seoByLine: Record<string, { h1: string; title: string; description: string }> = {
  "bio-chay": {
    h1: "Органические удобрения «Био-чай» ЭКО Конь",
    title: "Органические удобрения Био-чай ЭКО Конь",
    description:
      "Био-чай ЭКО Конь — органические удобрения в форме стиков из ферментированного конского навоза. Для комнатных растений, орхидей и рассады. 30 000+ отзывов.",
  },
  grunty: {
    h1: "Органические грунты и субстраты ЭКО Конь",
    title: "Органические грунты для растений ЭКО Конь",
    description:
      "Органические грунты ЭКО Конь для рассады, овощей, цветов и орхидей: 90% органики, агроперлит, без запаха. Лёгкие, воздушные, не слёживаются.",
  },
  specialized: {
    h1: "Специализированные удобрения для растений",
    title: "Специализированные удобрения для растений",
    description:
      "Специализированные органические удобрения ЭКО Конь под культуру: орхидеи, цитрусовые, овощи, рассада. Точная формула на органической основе.",
  },
  fitmoduli: {
    h1: "Фитомодули для вертикального озеленения «Цветология»",
    title: "Фитомодули для вертикального озеленения",
    description:
      "Фитомодули Цветология — модульные системы вертикального озеленения для дома, офиса и ресторана. Монтаж за 15 минут, продуманная система полива.",
  },
  accessories: {
    h1: "Аксессуары для фитомодулей и ухода за растениями",
    title: "Аксессуары для фитомодулей — Цветология",
    description:
      "Аксессуары и расходные материалы Цветология: укрывные материалы, комплектующие для фитомодулей. Совместимы с системами вертикального озеленения.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pl = await getProductLineBySlug(params["product-line"]);
  if (!pl) return {};

  const seo = seoByLine[pl.slug];
  const title = seo?.title || `${pl.name} — ${pl.brand === "ecokon" ? "ЭКО Конь" : "Цветология"}`;
  const description =
    seo?.description || pl.description || `${pl.name} — купить в интернет-магазине pro-pochvu.ru`;

  return {
    title,
    description,
    alternates: { canonical: `https://pro-pochvu.ru/catalog/${pl.slug}` },
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

export default async function ProductLinePage({ params }: Props) {
  const pl = await getProductLineBySlug(params["product-line"]);
  if (!pl) notFound();

  if (!SHOW_TSVETOLOGIYA && pl.brand === "tsvetologiya") notFound();

  const cross = !SHOW_TSVETOLOGIYA ? null : crossSell[pl.brand];
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
      <div className="mt-6 rounded-lg bg-bg-soft p-8 md:p-12">
        <div className="section-label mb-4">
          <Ornament variant="divider" />
          <span>{pl.brand === "ecokon" ? "ЭКО КОНЬ" : "ЦВЕТОЛОГИЯ"}</span>
        </div>
        <h1 className="section-heading text-4xl md:text-5xl lg:text-6xl text-ink">
          {seoByLine[pl.slug]?.h1 || pl.name}
        </h1>
        {pl.description && (
          <p className="mt-4 max-w-2xl text-ink-2 leading-relaxed">
            {pl.description}
          </p>
        )}
      </div>

      {/* Products */}
      <div className="mt-10">
        <Suspense>
          <CatalogContent productLineSlug={pl.slug} />
        </Suspense>
      </div>

      {/* Why choose */}
      <section className="mt-20">
        <h2 className="font-serif text-3xl font-normal tracking-tight mb-8">
          Почему выбирают {pl.name.toLowerCase()}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-lg bg-bg-soft p-6">
              <span className="text-2xl">{r.emoji}</span>
              <h4 className="mt-3 font-serif text-base font-medium">{r.title}</h4>
              <p className="mt-1.5 text-sm text-ink-2">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-sell */}
      {cross && (
        <section className="mt-20 rounded-lg bg-cream p-8 text-center md:p-12">
          <h2 className="font-serif text-3xl font-normal tracking-tight">
            Отлично сочетается с
          </h2>
          <p className="mt-3 text-ink-2">{cross.text}</p>
          <div className="mt-6">
            <Link href={`/catalog/${cross.slug}`} className="btn-outline">
              {cross.title} →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
