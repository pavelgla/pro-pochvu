import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/prisma";
import {
  blogCategoryLabel,
  BLOG_PRODUCT_ANCHORS,
  BLOG_IMAGE_CREDITS,
  PRESS_SOURCES,
  categorySlugForRaw,
  getCategoryMeta,
} from "@/lib/blog";
import { BlogProductCta } from "@/components/BlogProductCta";
import { BlogComments } from "@/components/blog/BlogComments";

const SITE_URL = "https://pro-pochvu.ru";

interface Props {
  // Next.js 14: params is a plain object (NOT a Promise — that's Next.js 15+)
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findFirst({
    where: { slug: params.slug, isPublished: true },
    select: {
      title: true,
      seoTitle: true,
      seoDescription: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
    },
  });

  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || "";
  const url = `${SITE_URL}/blog/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      ...(post.publishedAt && { publishedTime: post.publishedAt.toISOString() }),
      ...(post.coverImage && {
        images: [{ url: `${SITE_URL}${post.coverImage}`, width: 1200, height: 630 }],
      }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findFirst({
    where: { slug: params.slug, isPublished: true },
  });

  if (!post) notFound();

  const approvedComments = await prisma.blogComment.findMany({
    where: { postSlug: post.slug, status: "APPROVED" },
    orderBy: { approvedAt: "asc" },
    select: { authorName: true, body: true, approvedAt: true },
    take: 10,
  });

  const catSlug = categorySlugForRaw(post.category);
  const catMeta = catSlug ? getCategoryMeta(catSlug) : undefined;
  const press = PRESS_SOURCES[post.slug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "КФХ Ранчо Мушкино",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Пропочву",
      url: SITE_URL,
    },
    ...(post.coverImage && {
      image: `${SITE_URL}${post.coverImage}`,
    }),
    ...(approvedComments.length > 0 && {
      commentCount: approvedComments.length,
      comment: approvedComments.map((c) => ({
        "@type": "Comment",
        author: { "@type": "Person", name: c.authorName },
        ...(c.approvedAt && { datePublished: c.approvedAt.toISOString() }),
        text: c.body,
      })),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Hero cover */}
        {post.coverImage &&
          (press ? (
            /* Газетная полоса — вписываем целиком (без обрезки), поля = фон */
            <div className="w-full bg-bg-soft mb-8 flex justify-center px-4 py-8 md:py-10">
              <div className="relative aspect-[3/4] w-full max-w-md shadow-lg ring-1 ring-line">
                <Image
                  src={post.coverImage}
                  alt={`Газетная публикация: ${post.title}`}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 448px"
                />
              </div>
            </div>
          ) : (
            <div className="relative w-full h-64 md:h-96 bg-bg-soft mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}

        <div className="container-main pb-16">
          {/* Breadcrumb */}
          <nav className="text-sm text-mute mb-6">
            <Link href="/" className="hover:text-accent">Главная</Link>
            {" / "}
            <Link href="/blog" className="hover:text-accent">Блог</Link>
            {" / "}
            {catMeta && (
              <>
                <Link href={`/blog/category/${catMeta.slug}`} className="hover:text-accent">
                  {catMeta.label}
                </Link>
                {" / "}
              </>
            )}
            <span>{post.title}</span>
          </nav>

          <div className="max-w-2xl">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-4">
              {blogCategoryLabel(post.category) && (
                <span className="text-xs font-medium text-accent uppercase tracking-wide">
                  {blogCategoryLabel(post.category)}
                </span>
              )}
              {post.publishedAt && (
                <span className="text-xs text-mute">
                  {new Date(post.publishedAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Плашка: публиковалось в прессе */}
            {press && (
              <div className="mb-8 flex items-center gap-2 rounded-xl border border-line bg-bg-soft px-4 py-3 text-sm text-ink/80">
                <span aria-hidden>📰</span>
                <span>
                  Материал публиковался в&nbsp;печатной прессе ·{" "}
                  {press.dateLabel}. Републикация с&nbsp;разрешения издателя.{" "}
                  <Link href="/press" className="text-accent hover:text-accent-deep underline underline-offset-2">
                    Все публикации в&nbsp;СМИ
                  </Link>
                </span>
              </div>
            )}

            {/* Markdown content */}
            <div className="prose prose-lg max-w-none [&_a]:text-accent [&_a:hover]:text-accent-deep [&_h2]:text-ink [&_h3]:text-ink [&_strong]:text-ink">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* CTA — товар из статьи + прямые кнопки маркетплейса */}
            <BlogProductCta productSlug={BLOG_PRODUCT_ANCHORS[post.slug]} />

            {/* Back link + источник изображения */}
            <div className="mt-12 pt-8 border-t border-line flex flex-wrap items-center justify-between gap-3">
              <Link href="/blog" className="text-sm text-mute hover:text-accent transition-colors">
                ← Все статьи
              </Link>
              {BLOG_IMAGE_CREDITS[post.slug] && (
                <span className="text-xs text-mute/70">
                  Изображение:{" "}
                  <a
                    href={BLOG_IMAGE_CREDITS[post.slug].source}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="underline underline-offset-2 hover:text-accent"
                  >
                    {BLOG_IMAGE_CREDITS[post.slug].author} / Pexels
                  </a>
                </span>
              )}
            </div>

            {/* Комментарии */}
            <BlogComments slug={post.slug} />
          </div>
        </div>
      </article>
    </>
  );
}
