import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedCardsWithTags } from "@/lib/blog-posts";
import { slugToTag } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";

const SITE_URL = "https://pro-pochvu.ru";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const tag = slugToTag(params.slug);
  const url = `${SITE_URL}/blog/tag/${params.slug}`;
  const title = `Статьи по теме «${tag}» | Блог Пропочву`;
  const description = `Все статьи блога Пропочву по теме «${tag}»: уход за растениями, удобрения и озеленение.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

export default async function BlogTagPage({ params }: Props) {
  const tag = slugToTag(params.slug);
  const all = await getPublishedCardsWithTags();
  const posts = all.filter((p) => p.tags.some((t) => t.toLowerCase() === tag));

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
        <span>Тема: {tag}</span>
      </nav>

      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">
          Тема: {tag}
        </h1>
        <p className="text-mute">
          {posts.length > 0
            ? `Статьи по теме «${tag}».`
            : `По теме «${tag}» пока нет статей.`}
        </p>
      </div>

      {posts.length > 0 && (
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
          ← Все темы
        </Link>
      </div>
    </div>
  );
}
