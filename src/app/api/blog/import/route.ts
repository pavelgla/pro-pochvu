// POST /api/blog/import — SMM-agent blog import endpoint
// Auth: Bearer token from SMM_AGENT_API_KEY env var
// Creates blog post as draft (isPublished=false), returns { id, slug, url }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ImportBodySchema = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(300),
  content: z.string().min(1),
  excerpt: z.string().optional().default(""),
  category: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isPublished: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  // Auth
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.SMM_AGENT_API_KEY;

  if (!expectedKey) {
    return NextResponse.json({ error: "SMM_AGENT_API_KEY not configured" }, { status: 500 });
  }

  if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ImportBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation error", details: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;

  // Ensure unique slug (append suffix if collision)
  let slug = data.slug;
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      category: data.category,
      tags: data.tags,
      seoTitle: data.seoTitle ?? data.title,
      seoDescription: data.seoDescription ?? data.excerpt,
      isPublished: data.isPublished,
      publishedAt: data.isPublished ? new Date() : null,
    },
  });

  const url = `https://pro-pochvu.ru/blog/${post.slug}`;

  return NextResponse.json({ id: post.id, slug: post.slug, url }, { status: 201 });
}
