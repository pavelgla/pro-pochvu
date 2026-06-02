import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  classifyBody,
  isHoneypotTripped,
  hashIp,
  generateModerationToken,
} from "@/lib/comments";
import { notifyNewComment } from "@/lib/telegram";

export const dynamic = "force-dynamic";

const schema = z.object({
  postSlug: z.string().min(1).max(160),
  authorName: z.string().trim().min(2).max(60),
  authorEmail: z.string().email().max(120).optional().or(z.literal("")),
  body: z.string().trim().min(3).max(2000),
  consent: z.literal(true),
  website: z.string().optional(), // honeypot
});

const ACCEPTED = NextResponse.json(
  { ok: true, message: "Комментарий отправлен на модерацию." },
  { status: 200 },
);

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
  let data: z.infer<typeof schema>;
  try {
    data = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Проверьте поля формы." }, { status: 422 });
  }

  // 1. Honeypot — тихий успех, ничего не сохраняем.
  if (isHoneypotTripped(data.website)) return ACCEPTED;

  // Статья должна существовать и быть опубликованной.
  const post = await prisma.blogPost.findFirst({
    where: { slug: data.postSlug, isPublished: true },
    select: { slug: true, title: true },
  });
  if (!post) return NextResponse.json({ error: "Статья не найдена." }, { status: 404 });

  const ipHash = hashIp(clientIp(req));

  // 2. Rate-limit по ipHash.
  const since10m = new Date(Date.now() - 10 * 60 * 1000);
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [recent, daily] = await Promise.all([
    prisma.blogComment.count({ where: { ipHash, createdAt: { gte: since10m } } }),
    prisma.blogComment.count({ where: { ipHash, createdAt: { gte: since24h } } }),
  ]);
  if (recent >= 3 || daily >= 10) {
    return NextResponse.json(
      { error: "Слишком много комментариев. Попробуйте позже." },
      { status: 429 },
    );
  }

  // 3. Спам-эвристики → авто-REJECT (нейтральный ответ, без обратной связи спамеру).
  const verdict = classifyBody(data.body);
  const status = verdict.ok ? "PENDING" : "REJECTED";
  const token = generateModerationToken();

  const comment = await prisma.blogComment.create({
    data: {
      postSlug: post.slug,
      authorName: data.authorName,
      authorEmail: data.authorEmail || null,
      body: data.body,
      status,
      ipHash,
      moderationToken: token,
    },
    select: { id: true },
  });

  // 5. Уведомление только для попавших в очередь (PENDING).
  if (status === "PENDING") {
    try {
      await notifyNewComment({
        articleTitle: post.title,
        slug: post.slug,
        authorName: data.authorName,
        body: data.body,
        commentId: comment.id,
        token,
      });
    } catch (e) {
      console.error("notifyNewComment failed", e);
    }
  }

  return ACCEPTED;
}
