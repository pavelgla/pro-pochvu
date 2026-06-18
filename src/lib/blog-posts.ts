import { prisma } from "@/lib/prisma";
import type { BlogCardPost } from "@/components/blog/BlogCard";
import { PRESS_SLUGS } from "@/lib/blog";

// Все опубликованные посты в проекции для карточек, новые сверху.
// Датасет небольшой — фильтрацию по рубрике/тегу/подборке делаем в JS.
export async function getPublishedCards(): Promise<BlogCardPost[]> {
  return prisma.blogPost.findMany({
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
}

export type CardWithTags = BlogCardPost & { tags: string[] };

export async function getPublishedCardsWithTags(): Promise<CardWithTags[]> {
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
      tags: true,
    },
  });
  return posts.map((p) => ({
    ...p,
    tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
  }));
}

// Опубликованные статьи из печатной прессы для витрины /press,
// в порядке PRESS_SLUGS (отсутствующие в БД молча пропускаются).
export async function getPressCards(): Promise<BlogCardPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true, slug: { in: PRESS_SLUGS } },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      coverImage: true,
      publishedAt: true,
    },
  });
  const order = new Map(PRESS_SLUGS.map((s, i) => [s, i]));
  return posts.sort(
    (a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999)
  );
}
