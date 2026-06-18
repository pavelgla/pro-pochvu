import { MetadataRoute } from "next";
import { getAllProductSlugs, getProductLines } from "@/lib/catalog";
import { SHOW_TSVETOLOGIYA } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { BLOG_CATEGORIES, BLOG_COLLECTIONS, tagToSlug } from "@/lib/blog";

const SITE_URL = "https://pro-pochvu.ru";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [slugs, productLines, blogPosts] = await Promise.all([
    getAllProductSlugs(),
    getProductLines(),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, tags: true },
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/catalog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contacts`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      url: `${SITE_URL}/returns`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/press`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/knowledge-base`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/knowledge-base/video`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Линейки товаров (страницы /catalog/[product-line])
  const productLinePages: MetadataRoute.Sitemap = productLines
    .filter((pl) => {
      // Скрываем линейки Цветологии при выключенном фиче-флаге
      if (!SHOW_TSVETOLOGIYA && pl.brand === "tsvetologiya") return false;
      return true;
    })
    .map((pl) => ({
      url: `${SITE_URL}/catalog/${pl.slug}`,
      lastModified: pl.updatedAt || now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const productPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/product/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Рубрики блога
  const blogCategoryPages: MetadataRoute.Sitemap = BLOG_CATEGORIES.map((c) => ({
    url: `${SITE_URL}/blog/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Подборки
  const blogCollectionPages: MetadataRoute.Sitemap = BLOG_COLLECTIONS.map((c) => ({
    url: `${SITE_URL}/blog/podborka/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Теги (уникальные по всем постам)
  const tagSet = new Set<string>();
  for (const p of blogPosts) {
    const tags = Array.isArray(p.tags) ? (p.tags as string[]) : [];
    for (const t of tags) tagSet.add(t);
  }
  const blogTagPages: MetadataRoute.Sitemap = Array.from(tagSet).map((t) => ({
    url: `${SITE_URL}/blog/tag/${tagToSlug(t)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [
    ...staticPages,
    ...productLinePages,
    ...productPages,
    ...blogPostPages,
    ...blogCategoryPages,
    ...blogCollectionPages,
    ...blogTagPages,
  ];
}
