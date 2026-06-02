import { prisma } from "@/lib/prisma";
import { BlogCommentForm } from "@/components/blog/BlogCommentForm";

export async function BlogComments({ slug }: { slug: string }) {
  const comments = await prisma.blogComment.findMany({
    where: { postSlug: slug, status: "APPROVED" },
    orderBy: { approvedAt: "asc" },
    select: { id: true, authorName: true, body: true, approvedAt: true },
  });

  return (
    <section className="mt-12 border-t border-line pt-10">
      <h2 className="mb-6 text-xl font-bold text-ink">
        Комментарии {comments.length > 0 && `(${comments.length})`}
      </h2>

      {comments.length === 0 ? (
        <p className="mb-8 text-sm text-mute">
          Будьте первым, кто оставит комментарий.
        </p>
      ) : (
        <ul className="mb-10 space-y-6">
          {comments.map((c) => (
            <li key={c.id} className="rounded-2xl border border-line p-5">
              <div className="mb-1.5 flex items-center gap-3">
                <span className="text-sm font-semibold text-ink">
                  {c.authorName}
                </span>
                {c.approvedAt && (
                  <span className="text-xs text-mute">
                    {new Date(c.approvedAt).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <p className="whitespace-pre-line text-sm text-ink/90">{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      <BlogCommentForm slug={slug} />
    </section>
  );
}
