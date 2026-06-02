import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function page(title: string): Response {
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>${title}</title>` +
      `<body style="font-family:sans-serif;padding:40px;text-align:center">` +
      `<h1>${title}</h1><p><a href="https://pro-pochvu.ru/blog">← В блог</a></p></body>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const action = url.searchParams.get("action");
  if (!token || (action !== "approve" && action !== "reject")) {
    return new Response("Bad request", { status: 400 });
  }

  const comment = await prisma.blogComment.findUnique({
    where: { id: params.id },
    select: { id: true, moderationToken: true, status: true },
  });
  if (!comment || comment.moderationToken !== token) {
    return new Response("Forbidden", { status: 403 });
  }

  // Идемпотентность: повторный клик не падает.
  if (comment.status !== "PENDING") {
    return page(
      comment.status === "APPROVED" ? "Уже одобрено" : "Уже отклонено",
    );
  }

  if (action === "approve") {
    await prisma.blogComment.update({
      where: { id: comment.id },
      data: { status: "APPROVED", approvedAt: new Date() },
    });
    return page("Комментарий одобрен ✅");
  }
  await prisma.blogComment.update({
    where: { id: comment.id },
    data: { status: "REJECTED" },
  });
  return page("Комментарий отклонён 🗑");
}
