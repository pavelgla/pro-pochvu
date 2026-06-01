import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { blogCategoryLabel } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Блог | Пропочву",
  description:
    "Статьи о применении органических удобрений, выращивании рассады, уходе за комнатными растениями и вертикальном озеленении. Опыт КФХ «Ранчо Мушкино».",
  alternates: { canonical: "https://pro-pochvu.ru/blog" },
  openGraph: {
    title: "Блог о садоводстве и удобрениях | Пропочву",
    description:
      "Статьи о применении органических удобрений, выращивании рассады и вертикальном озеленении.",
    url: "https://pro-pochvu.ru/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      coverImage: true,
      publishedAt: true,
    },
  });

  return (
    <div className="container-main section-padding">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-ink mb-3">Блог</h1>
        <p className="text-mute">
          Полезные статьи об уходе за растениями и озеленении
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="max-w-xl mb-10">
          <p className="text-lg text-mute mb-6">Статьи — скоро здесь</p>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <p className="text-gray-700 mb-3">
              Подпишитесь на наш Telegram — публикуем советы там уже сейчас
            </p>
            <a
              href="https://t.me/+7cAd9gatgP44MDcy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
            >
              Открыть Telegram
            </a>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-line hover:shadow-md transition-shadow"
            >
              {post.coverImage && (
                <div className="relative h-48 bg-bg-soft">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="flex flex-col flex-1 p-5">
                {blogCategoryLabel(post.category) && (
                  <span className="text-xs font-medium text-accent uppercase tracking-wide mb-2">
                    {blogCategoryLabel(post.category)}
                  </span>
                )}
                <h2 className="text-base font-semibold text-ink mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-mute line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                )}
                {post.publishedAt && (
                  <p className="text-xs text-mute mt-3">
                    {new Date(post.publishedAt).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
