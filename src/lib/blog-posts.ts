import { prisma } from "@/lib/prisma";
import type { BlogCardPost } from "@/components/blog/BlogCard";

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
