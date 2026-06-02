import { prisma } from "@/lib/prisma";
import { marked } from "marked";
import { blogCategoryLabel } from "@/lib/blog";

export const dynamic = "force-dynamic";

const SITE = "https://pro-pochvu.ru";

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cdata(s: string): string {
  // Безопасно вкладываем HTML в CDATA, экранируя возможный ]]>
  return `<![CDATA[${s.replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}

// Относительные ссылки/картинки в контенте делаем абсолютными для Дзена/ридеров.
function absolutize(html: string): string {
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${SITE}/`);
}

type FeedPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

export async function GET() {
  let posts: FeedPost[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 50,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverImage: true,
        category: true,
        publishedAt: true,
        updatedAt: true,
      },
    });
  } catch (e) {
    console.error("rss feed db error", e);
    // На ошибке БД — отдаём валидный пустой фид, не 500.
  }

  const items = posts
    .map((p) => {
      const url = `${SITE}/blog/${p.slug}`; // ЧПУ без UTM — требование Дзена
      const date = (p.publishedAt ?? p.updatedAt).toUTCString();
      const cover = p.coverImage
        ? `<figure><img src="${SITE}${p.coverImage}" alt="${xmlEscape(p.title)}"></figure>`
        : "";
      const bodyHtml = absolutize(marked.parse(p.content, { async: false }) as string);
      const cat = blogCategoryLabel(p.category);
      return [
        "<item>",
        `<title>${xmlEscape(p.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${date}</pubDate>`,
        `<author>noreply@pro-pochvu.ru (Пропочву)</author>`,
        cat ? `<category>${xmlEscape(cat)}</category>` : "",
        p.excerpt ? `<description>${xmlEscape(p.excerpt)}</description>` : "",
        p.coverImage
          ? `<enclosure url="${SITE}${p.coverImage}" type="image/jpeg" />`
          : "",
        `<content:encoded>${cdata(cover + bodyHtml)}</content:encoded>`,
        "</item>",
      ]
        .filter(Boolean)
        .join("");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>Блог Пропочву — о растениях, удобрениях и озеленении</title>
<link>${SITE}/blog</link>
<description>Уход за растениями, органические удобрения, грунты и вертикальное озеленение от КФХ «Ранчо Мушкино».</description>
<language>ru</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=900",
    },
  });
}
