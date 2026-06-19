import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedCards } from "@/lib/blog-posts";
import { BLOG_COLLECTIONS, getCollection, brandTitle } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";

const SITE_URL = "https://pro-pochvu.ru";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return BLOG_COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const col = getCollection(params.slug);
  if (!col) return {};
  const url = `${SITE_URL}/blog/podborka/${col.slug}`;
  return {
    title: { absolute: brandTitle(col.title) },
    description: col.description,
    robots: { index: false, follow: true },
    alternates: { canonical: url },
    openGraph: { title: col.title, description: col.description, url, type: "website" },
  };
}

export default async function BlogCollectionPage({ params }: Props) {
  const col = getCollection(params.slug);
  if (!col) notFound();

  const all = await getPublishedCards();
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  // сохраняем порядок, заданный в подборке; пропускаем неопубликованные
  const posts = col.postSlugs
    .map((s) => bySlug.get(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="container-main section-padding">
      <nav className="text-sm text-mute mb-6">
        <Link href="/" className="hover:text-accent">
          Главная
        </Link>
        {" / "}
        <Link href="/blog" className="hover:text-accent">
          Блог
        </Link>
        {" / "}
        <span>{col.title}</span>
      </nav>

      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-medium text-accent uppercase tracking-wide">
          Подборка
        </span>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-ink mb-3">
          {col.title}
        </h1>
        <p className="text-mute">{col.intro}</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-mute">Статьи подборки готовятся.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      <div className="mt-12 border-t border-line pt-8">
        <Link
          href="/blog"
          className="text-sm text-mute hover:text-accent transition-colors"
        >
          ← Все подборки
        </Link>
      </div>
    </div>
  );
}
