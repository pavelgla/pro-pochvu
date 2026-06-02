import Link from "next/link";
import Image from "next/image";
import { blogCategoryLabel } from "@/lib/blog";

export type BlogCardPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
};

export function BlogCard({ post }: { post: BlogCardPost }) {
  return (
    <Link
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
          <p className="text-sm text-mute line-clamp-3 flex-1">{post.excerpt}</p>
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
  );
}
