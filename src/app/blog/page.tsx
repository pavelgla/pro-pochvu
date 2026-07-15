import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedCardsWithTags } from "@/lib/blog-posts";
import {
  BLOG_CATEGORIES,
  BLOG_COLLECTIONS,
  categorySlugForRaw,
  tagToSlug,
} from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Блог о растениях, удобрениях и озеленении | Пропочву",
  description:
    "База знаний Пропочву: уход за комнатными растениями, органические удобрения, грунты и вертикальное озеленение. Рубрики, подборки и статьи от команды «Пропочву».",
  alternates: { canonical: "https://pro-pochvu.ru/blog" },
  openGraph: {
    title: "Блог о садоводстве и удобрениях | Пропочву",
    description:
      "Уход за растениями, органические удобрения, грунты и вертикальное озеленение.",
    url: "https://pro-pochvu.ru/blog",
    type: "website",
  },
};

const PER_CATEGORY = 3;

export default async function BlogPage() {
  const posts = await getPublishedCardsWithTags();

  // Топ-теги по частоте (облако)
  const tagCount = new Map<string, number>();
  for (const p of posts)
    for (const t of p.tags) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
  const topTags = Array.from(tagCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([tag]) => tag);

  // Группировка по каноническим рубрикам
  const byCategory = BLOG_CATEGORIES.map((cat) => ({
    cat,
    items: posts.filter((p) => categorySlugForRaw(p.category) === cat.slug),
  })).filter((g) => g.items.length > 0);

  if (posts.length === 0) {
    return (
      <div className="container-main section-padding">
        <h1 className="text-3xl font-bold text-ink mb-3">Блог</h1>
        <p className="text-lg text-mute">Статьи — скоро здесь.</p>
      </div>
    );
  }

  return (
    <div className="container-main section-padding">
      {/* Intro */}
      <div className="mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          База знаний о растениях
        </h1>
        <p className="text-mute">
          Уход за комнатными растениями, органические удобрения, грунты и
          вертикальное озеленение — простыми словами и из практики.
        </p>
      </div>

      {/* Подборки */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-ink mb-5">Подборки</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_COLLECTIONS.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/podborka/${c.slug}`}
              className="group rounded-2xl border border-line p-5 hover:border-accent hover:shadow-md transition-all"
            >
              <span className="text-xs font-medium text-accent uppercase tracking-wide">
                Подборка · {c.postSlugs.length}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-ink group-hover:text-accent transition-colors">
                {c.title}
              </h3>
              <p className="mt-2 text-sm text-mute line-clamp-2">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Рубрики: секция на каждую категорию */}
      {byCategory.map(({ cat, items }) => (
        <section key={cat.slug} className="mb-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-ink">{cat.label}</h2>
              <p className="mt-1 text-sm text-mute max-w-xl">{cat.intro}</p>
            </div>
            {items.length > PER_CATEGORY && (
              <Link
                href={`/blog/category/${cat.slug}`}
                className="shrink-0 text-sm font-medium text-accent hover:text-accent-deep transition-colors"
              >
                Все статьи →
              </Link>
            )}
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, PER_CATEGORY).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ))}

      {/* Облако тегов */}
      {topTags.length > 0 && (
        <section className="mt-4 border-t border-line pt-10">
          <h2 className="text-xl font-bold text-ink mb-5">Темы</h2>
          <div className="flex flex-wrap gap-2.5">
            {topTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tagToSlug(tag)}`}
                className="rounded-full border border-line px-4 py-1.5 text-sm text-ink/80 hover:border-accent hover:text-accent transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
