import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedCards } from "@/lib/blog-posts";
import {
  BLOG_CATEGORIES,
  getCategoryMeta,
  categorySlugForRaw,
} from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";

const SITE_URL = "https://pro-pochvu.ru";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategoryMeta(params.slug);
  if (!cat) return {};
  const url = `${SITE_URL}/blog/category/${cat.slug}`;
  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: url },
    openGraph: { title: cat.title, description: cat.description, url, type: "website" },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const cat = getCategoryMeta(params.slug);
  if (!cat) notFound();

  const all = await getPublishedCards();
  const posts = all.filter((p) => categorySlugForRaw(p.category) === cat.slug);

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
        <span>{cat.label}</span>
      </nav>

      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          {cat.label}
        </h1>
        <p className="text-mute">{cat.intro}</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-mute">В этой рубрике пока нет статей.</p>
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
          ← Все рубрики
        </Link>
      </div>
    </div>
  );
}
