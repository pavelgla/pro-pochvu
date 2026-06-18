import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPressCards } from "@/lib/blog-posts";
import { PRESS_SOURCES } from "@/lib/blog";

const SITE_URL = "https://pro-pochvu.ru";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "СМИ о нас: публикации в прессе про ЭКО Конь | Пропочву",
  description:
    "Статьи про биоудобрения ЭКО Конь, выходившие в печатной прессе: янтарная кислота, восстановление почвы, подкормка рассады и уход за растениями.",
  alternates: { canonical: `${SITE_URL}/press` },
  openGraph: {
    title: "СМИ о нас | Пропочву",
    description:
      "Публикации про биоудобрения ЭКО Конь в печатной прессе.",
    url: `${SITE_URL}/press`,
    type: "website",
  },
};

export default async function PressPage() {
  const posts = await getPressCards();

  return (
    <div className="container-main section-padding">
      {/* Intro */}
      <div className="mb-12 max-w-2xl">
        <span className="text-xs font-medium text-accent uppercase tracking-[0.15em]">
          Публикации в прессе
        </span>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold text-ink mb-3">
          СМИ о нас
        </h1>
        <p className="text-mute">
          Материалы про биоудобрения ЭКО Конь, выходившие в печатной прессе.
          Републикация с разрешения издателей — открывайте полную версию каждой
          статьи.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-lg text-mute">Публикации скоро появятся здесь.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const src = PRESS_SOURCES[post.slug];
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden border border-line bg-bg-soft hover:shadow-lg transition-shadow"
              >
                {/* Газетная полоса */}
                {post.coverImage && (
                  <div className="relative aspect-[3/4] bg-cream border-b border-line">
                    <Image
                      src={post.coverImage}
                      alt={`Газетная публикация: ${post.title}`}
                      fill
                      className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  {src && (
                    <span className="text-[11px] font-medium text-mute uppercase tracking-wide mb-2">
                      📰 {src.outlet} · {src.dateLabel}
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
                  <span className="mt-4 text-sm font-medium text-accent">
                    Читать статью →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
