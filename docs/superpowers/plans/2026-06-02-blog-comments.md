# Blog Comments (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add native, SEO-indexed blog comments with anonymous submission, automated spam moderation, one-click approval from Telegram, and 152-FZ consent.

**Architecture:** New Prisma model `BlogComment` (statuses PENDING/APPROVED/REJECTED). A POST API runs a pure auto-moderation pipeline (honeypot → rate-limit → spam heuristics); clean comments land in PENDING and ping admin in Telegram with tokenized approve/reject links. Approved comments are server-rendered under each article (`/blog/[slug]` is already `force-dynamic`, so no cache revalidation needed). Pure logic is unit-tested with Vitest; routes/rendering are verified live on prod (local Next build/dev fails with SIGBUS on this host).

**Tech Stack:** Next.js 14 App Router, Prisma 5 + PostgreSQL, Zod, NextAuth (admin role for optional moderation page), Vitest (new, for pure logic only), existing `src/lib/telegram.ts` and `src/components/ui/ConsentCheckbox.tsx`.

**Spec:** `docs/superpowers/specs/2026-06-02-blog-engagement-design.md` (Phase 1). Phase 2 (Dzen) is a separate plan.

---

## File Structure

**Create:**
- `src/lib/comments.ts` — pure auto-moderation logic (honeypot, spam classifier, IP hash, token, Telegram message builder). Isolated & unit-tested.
- `src/lib/comments.test.ts` — Vitest unit tests for the above.
- `src/app/api/blog/comments/route.ts` — `POST` submission + rate-limit + pipeline + store + notify.
- `src/app/api/blog/comments/[id]/moderate/route.ts` — `GET` tokenized approve/reject.
- `src/components/blog/BlogComments.tsx` — server component, renders APPROVED comments.
- `src/components/blog/BlogCommentForm.tsx` — client component, submission form.
- `vitest.config.ts` — Vitest config scoped to `src/`.

**Modify:**
- `prisma/schema.prisma` — `BlogComment` model + `CommentStatus` enum + `BlogPost.comments` back-relation.
- `src/lib/telegram.ts` — add `notifyNewComment()` (wrapper) using existing `sendMessage`.
- `src/app/blog/[slug]/page.tsx` — embed `BlogComments` + `BlogCommentForm`, extend JSON-LD with `commentCount`/`comment`.
- `src/app/privacy/page.tsx` — add comment-data processing section.
- `package.json` — `vitest` devDependency + `"test"` script.
- `.env.example` — document any new optional env.

---

## Task 1: Vitest setup + pure auto-moderation module

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/comments.ts`
- Test: `src/lib/comments.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Vitest**

Run:
```bash
npm install -D vitest
```
Expected: `vitest` added to devDependencies.

- [ ] **Step 2: Add test script and Vitest config**

In `package.json` `"scripts"` add:
```json
"test": "vitest run"
```

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
```

- [ ] **Step 3: Write the failing tests**

Create `src/lib/comments.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { classifyBody, isHoneypotTripped, hashIp, newCommentMessage } from "./comments";

describe("classifyBody", () => {
  it("accepts a clean comment", () => {
    expect(classifyBody("Спасибо, очень полезная статья про грунт!").ok).toBe(true);
  });
  it("rejects comments containing links", () => {
    expect(classifyBody("Загляните на http://spam.ru дешево").ok).toBe(false);
    expect(classifyBody("пишите на www.casino.com").ok).toBe(false);
  });
  it("rejects banned words", () => {
    expect(classifyBody("Лучшее казино и ставки тут").ok).toBe(false);
  });
  it("rejects all-caps shouting", () => {
    expect(classifyBody("КУПИТЕ СРОЧНО ВЫГОДНО ЖМИ СЮДА ПРЯМ СЕЙЧАС").ok).toBe(false);
  });
  it("rejects mostly-latin spam for RU audience", () => {
    expect(classifyBody("Buy cheap pills online best price now click").ok).toBe(false);
  });
  it("rejects too-short bodies", () => {
    expect(classifyBody("ок").ok).toBe(false);
  });
});

describe("isHoneypotTripped", () => {
  it("trips when the hidden field is filled", () => {
    expect(isHoneypotTripped("http://bot.com")).toBe(true);
  });
  it("passes when empty", () => {
    expect(isHoneypotTripped("")).toBe(false);
    expect(isHoneypotTripped(undefined)).toBe(false);
  });
});

describe("hashIp", () => {
  it("is deterministic and not the raw ip", () => {
    const h = hashIp("1.2.3.4");
    expect(h).toMatch(/^[a-f0-9]{64}$/);
    expect(h).toBe(hashIp("1.2.3.4"));
    expect(h).not.toContain("1.2.3.4");
  });
});

describe("newCommentMessage", () => {
  it("includes article title, author and both action links", () => {
    const msg = newCommentMessage({
      articleTitle: "Монстера: уход",
      slug: "monstera-uhod-vidy",
      authorName: "Аня",
      body: "Класс!",
      commentId: "c1",
      token: "tok123",
    });
    expect(msg).toContain("Монстера: уход");
    expect(msg).toContain("Аня");
    expect(msg).toContain("action=approve");
    expect(msg).toContain("action=reject");
    expect(msg).toContain("tok123");
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './comments'` (module not yet created).

- [ ] **Step 5: Implement `src/lib/comments.ts`**

```ts
import crypto from "crypto";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pro-pochvu.ru";

// Минимальный расширяемый список стоп-слов (типичный RU/EN спам).
export const BANNED_WORDS = [
  "казино", "ставки", "ставк", "viagra", "casino", "porn", "porno",
  "loan", "кредит наличными", "заработок без вложений", "binary",
  "btc", "крипт", "investment", "займ онлайн",
];

const URL_RE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(ru|com|net|org|info|xyz|online|shop)\b)/i;
const CYRILLIC_RE = /[а-яё]/gi;
const LATIN_RE = /[a-z]/gi;

export type SpamVerdict = { ok: boolean; reason?: string };

// Чистая эвристика спама. Возвращает ok:false с причиной для авто-REJECT.
export function classifyBody(body: string): SpamVerdict {
  const text = (body ?? "").trim();
  if (text.length < 3) return { ok: false, reason: "too_short" };
  if (text.length > 2000) return { ok: false, reason: "too_long" };
  if (URL_RE.test(text)) return { ok: false, reason: "link" };

  const lower = text.toLowerCase();
  if (BANNED_WORDS.some((w) => lower.includes(w)))
    return { ok: false, reason: "banned_word" };

  // Сплошной капс среди букв длиной > 15.
  const letters = text.replace(/[^a-zа-яё]/gi, "");
  if (letters.length > 15) {
    const upper = text.replace(/[^A-ZА-ЯЁ]/g, "").length;
    if (upper / letters.length > 0.7) return { ok: false, reason: "caps" };
  }

  // Доля латиницы для RU-аудитории: если латиницы заметно больше кириллицы — спам.
  const cyr = (text.match(CYRILLIC_RE) || []).length;
  const lat = (text.match(LATIN_RE) || []).length;
  if (lat + cyr > 10 && lat > cyr * 1.5) return { ok: false, reason: "latin" };

  // Повторяющиеся символы (аааааа / !!!!!!).
  if (/(.)\1{6,}/.test(text)) return { ok: false, reason: "repeat" };

  return { ok: true };
}

export function isHoneypotTripped(value?: string): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function hashIp(ip: string): string {
  const salt = process.env.NEXTAUTH_SECRET || "pp-comment-salt";
  return crypto.createHash("sha256").update(ip + salt).digest("hex");
}

export function generateModerationToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export type NewCommentMessageInput = {
  articleTitle: string;
  slug: string;
  authorName: string;
  body: string;
  commentId: string;
  token: string;
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// HTML-сообщение для Telegram с двумя токен-ссылками одобрения/отклонения.
export function newCommentMessage(i: NewCommentMessageInput): string {
  const base = `${SITE_URL}/api/blog/comments/${i.commentId}/moderate?token=${i.token}`;
  const excerpt = i.body.length > 300 ? i.body.slice(0, 300) + "…" : i.body;
  return [
    `💬 <b>Новый комментарий</b> к статье «${esc(i.articleTitle)}»`,
    ``,
    `<b>${esc(i.authorName)}</b>: ${esc(excerpt)}`,
    ``,
    `<a href="${base}&action=approve">✅ Одобрить</a>  ·  <a href="${base}&action=reject">🗑 Отклонить</a>`,
    `<a href="${SITE_URL}/blog/${i.slug}">Открыть статью</a>`,
  ].join("\n");
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all `comments.test.ts` cases green.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/comments.ts src/lib/comments.test.ts
git commit -m "feat(comments): pure auto-moderation logic + vitest"
```

---

## Task 2: Prisma model `BlogComment`

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add enum, model, and back-relation**

In `prisma/schema.prisma` add:
```prisma
enum CommentStatus {
  PENDING
  APPROVED
  REJECTED
}

model BlogComment {
  id              String        @id @default(cuid())
  postSlug        String
  post            BlogPost      @relation(fields: [postSlug], references: [slug], onDelete: Cascade)
  authorName      String
  authorEmail     String?
  body            String        @db.Text
  status          CommentStatus @default(PENDING)
  ipHash          String?
  moderationToken String        @unique
  createdAt       DateTime      @default(now())
  approvedAt      DateTime?

  @@index([postSlug, status, createdAt])
  @@map("blog_comments")
}
```

In the existing `BlogPost` model add the back-relation field (and confirm `slug` is `@unique`, which it already is):
```prisma
  comments BlogComment[]
```

- [ ] **Step 2: Validate schema**

Run: `npx prisma validate`
Expected: "The schema at prisma/schema.prisma is valid 🚀"

- [ ] **Step 3: Create migration against the local dev DB and regenerate client**

Run:
```bash
npx prisma migrate dev --name blog_comments
npx prisma generate
```
Expected: new folder under `prisma/migrations/*_blog_comments/`, client regenerated. (Prod runs `prisma migrate deploy` at container start.)

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(comments): BlogComment prisma model + migration"
```

---

## Task 3: Telegram `notifyNewComment()`

**Files:**
- Modify: `src/lib/telegram.ts`

- [ ] **Step 1: Add the notify wrapper**

At the end of `src/lib/telegram.ts`, using existing `sendMessage`, `isMockMode`, `ADMIN_CHAT_ID`, and the message builder from `comments.ts`:
```ts
import { newCommentMessage, type NewCommentMessageInput } from "@/lib/comments";

export async function notifyNewComment(input: NewCommentMessageInput) {
  if (isMockMode()) {
    console.log("[telegram mock] new comment:", input.commentId, input.authorName);
    return;
  }
  await sendMessage({
    chatId: ADMIN_CHAT_ID!,
    text: newCommentMessage(input),
    parseMode: "HTML",
  });
}
```
Note: if `sendMessage`/`ADMIN_CHAT_ID` are not exported from module scope, they are already in-file — call directly (no export needed). Keep `newCommentMessage` imported from `comments.ts` (already tested in Task 1).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/telegram.ts
git commit -m "feat(comments): telegram notifyNewComment"
```

---

## Task 4: Submission API — `POST /api/blog/comments`

**Files:**
- Create: `src/app/api/blog/comments/route.ts`

- [ ] **Step 1: Implement the route**

```ts
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
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: 0 type errors; lint clean for the new file.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/blog/comments/route.ts
git commit -m "feat(comments): POST submission API with auto-moderation"
```

---

## Task 5: Moderation API — `GET /api/blog/comments/[id]/moderate`

**Files:**
- Create: `src/app/api/blog/comments/[id]/moderate/route.ts`

- [ ] **Step 1: Implement the tokenized moderation endpoint**

```ts
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
```
Note: `/blog/[slug]` is `force-dynamic`, so an approved comment appears on the next page load without explicit `revalidatePath`.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add "src/app/api/blog/comments/[id]/moderate/route.ts"
git commit -m "feat(comments): tokenized one-click moderation endpoint"
```

---

## Task 6: UI components — list + form

**Files:**
- Create: `src/components/blog/BlogComments.tsx`
- Create: `src/components/blog/BlogCommentForm.tsx`

- [ ] **Step 1: Server component — approved comments list**

Create `src/components/blog/BlogComments.tsx`:
```tsx
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
```

- [ ] **Step 2: Client component — submission form**

Create `src/components/blog/BlogCommentForm.tsx`:
```tsx
"use client";

import { useState } from "react";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";

export function BlogCommentForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug: slug,
          authorName: name,
          authorEmail: email || undefined,
          body,
          consent,
          website,
        }),
      });
      if (res.ok) {
        setState("done");
        setName(""); setEmail(""); setBody(""); setConsent(false);
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Не удалось отправить. Попробуйте позже.");
        setState("error");
      }
    } catch {
      setError("Сеть недоступна. Попробуйте позже.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="rounded-2xl border border-accent/30 bg-accent/5 p-5 text-sm text-ink">
        Спасибо! Комментарий отправлен на модерацию и появится после проверки.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <h3 className="text-base font-semibold text-ink">Оставить комментарий</h3>
      <input
        type="text" required value={name} onChange={(e) => setName(e.target.value)}
        placeholder="Ваше имя" maxLength={60}
        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm"
      />
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (необязательно, не публикуется)" maxLength={120}
        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm"
      />
      <textarea
        required value={body} onChange={(e) => setBody(e.target.value)}
        placeholder="Ваш комментарий" rows={4} maxLength={2000}
        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm"
      />
      {/* honeypot — скрыто от людей, видно ботам */}
      <input
        type="text" tabIndex={-1} autoComplete="off" value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden" aria-hidden="true"
      />
      <ConsentCheckbox checked={consent} onChange={setConsent} required />
      {state === "error" && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit" disabled={state === "sending" || !consent}
        className="rounded-full bg-ink px-6 py-3 text-[13px] font-medium text-bg transition-colors hover:bg-accent disabled:opacity-50"
      >
        {state === "sending" ? "Отправка…" : "Отправить"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: 0 type errors; lint clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/BlogComments.tsx src/components/blog/BlogCommentForm.tsx
git commit -m "feat(comments): list + submission UI components"
```

---

## Task 7: Integrate into article page + JSON-LD

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Import and render the comments section**

In `src/app/blog/[slug]/page.tsx` add the import near the other component imports:
```tsx
import { BlogComments } from "@/components/blog/BlogComments";
```
Render it inside the article container, right after the back-link/image-credit block (still inside `<div className="max-w-2xl">`), so it appears under the article body:
```tsx
            {/* Комментарии */}
            <BlogComments slug={post.slug} />
```

- [ ] **Step 2: Extend Article JSON-LD with comment data**

Still in `src/app/blog/[slug]/page.tsx`, before building `jsonLd`, fetch approved comments (lightweight, same request) and add fields. Add after `if (!post) notFound();`:
```tsx
  const approvedComments = await prisma.blogComment.findMany({
    where: { postSlug: post.slug, status: "APPROVED" },
    orderBy: { approvedAt: "asc" },
    select: { authorName: true, body: true, approvedAt: true },
    take: 10,
  });
```
Then inside the `jsonLd` object literal add:
```tsx
    ...(approvedComments.length > 0 && {
      commentCount: approvedComments.length,
      comment: approvedComments.map((c) => ({
        "@type": "Comment",
        author: { "@type": "Person", name: c.authorName },
        ...(c.approvedAt && { datePublished: c.approvedAt.toISOString() }),
        text: c.body,
      })),
    }),
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add "src/app/blog/[slug]/page.tsx"
git commit -m "feat(comments): render comments + JSON-LD commentCount on article page"
```

---

## Task 8: Privacy policy — comments data section

**Files:**
- Modify: `src/app/privacy/page.tsx`

- [ ] **Step 1: Add a section about comment data**

Open `src/app/privacy/page.tsx`, locate the list/section of processed-data purposes, and add a paragraph/section (match the file's existing markup style) stating: при отправке комментария обрабатываются имя (публикуется), email (необязателен, не публикуется, для возможных уведомлений), текст комментария и технический хэш IP-адреса (для защиты от спама, не является общедоступным и не позволяет идентифицировать устройство); основание — согласие, которое даётся отметкой чекбокса при отправке; срок хранения — до отзыва согласия или удаления комментария.

Example block to insert (adapt heading level/classes to the file):
```tsx
        <h2>Комментарии в блоге</h2>
        <p>
          При отправке комментария мы обрабатываем имя автора (публикуется
          рядом с комментарием), адрес электронной почты (указывается по желанию,
          не публикуется и используется только для возможных уведомлений), текст
          комментария и технический хэш IP-адреса (для защиты от спама; он не
          публикуется и не позволяет идентифицировать устройство). Основание
          обработки — ваше согласие, выражаемое отметкой соответствующего поля при
          отправке комментария. Данные хранятся до отзыва согласия или удаления
          комментария.
        </p>
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/privacy/page.tsx
git commit -m "docs(privacy): add blog comments data processing section"
```

---

## Task 9: Deploy + end-to-end verification on prod

**Files:** none (verification only). Local `next build`/`next dev` fail with SIGBUS on this host, so the full stack is verified live after CI deploy.

- [ ] **Step 1: Document env (no new required vars)**

Confirm `.env.example` already lists `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_SITE_URL` (all reused — no new env). If `TELEGRAM_ADMIN_CHAT_ID` is absent from `.env.example`, add it with a comment. Commit only if changed:
```bash
git add .env.example && git commit -m "docs(env): note comment moderation reuses telegram + nextauth env"
```

- [ ] **Step 2: Push and wait for CI (runs prisma migrate deploy + build + deploy)**

```bash
git push origin main
RID=$(gh run list --limit 1 --json databaseId -q '.[0].databaseId')
gh run watch "$RID"
```
Expected: workflow completes `success` (migration `blog_comments` applied to prod DB).

- [ ] **Step 3: Verify submission API on prod (clean comment → PENDING)**

Run:
```bash
curl -s -X POST https://pro-pochvu.ru/api/blog/comments \
  -H "Content-Type: application/json" \
  -d '{"postSlug":"monstera-uhod-vidy","authorName":"Тест","body":"Очень полезная статья, спасибо за подробности про виды монстеры.","consent":true}' -w "\n%{http_code}\n"
```
Expected: `{"ok":true,...}` and `200`. A Telegram message with ✅/🗑 links arrives in the admin chat.

- [ ] **Step 4: Verify spam + honeypot are rejected**

Run:
```bash
# link → auto-reject, still neutral 200
curl -s -X POST https://pro-pochvu.ru/api/blog/comments -H "Content-Type: application/json" \
  -d '{"postSlug":"monstera-uhod-vidy","authorName":"Spam","body":"Лучшие цены http://spam.ru","consent":true}' -w "\n%{http_code}\n"
# honeypot → neutral 200, not stored
curl -s -X POST https://pro-pochvu.ru/api/blog/comments -H "Content-Type: application/json" \
  -d '{"postSlug":"monstera-uhod-vidy","authorName":"Bot","body":"hello there friend","consent":true,"website":"http://bot.com"}' -w "\n%{http_code}\n"
```
Expected: both return `200` neutral message; no Telegram ping for these (REJECTED / honeypot).

- [ ] **Step 5: Approve the test comment via the Telegram link, then confirm it renders (SSR-indexed)**

Click the ✅ link from Step 3 (or open the moderate URL). Then:
```bash
curl -s "https://pro-pochvu.ru/blog/monstera-uhod-vidy" | grep -c "Очень полезная статья"
```
Expected: `1` — the approved comment text is present in the **server-rendered HTML** (proves indexability). Also confirm `"commentCount"` appears:
```bash
curl -s "https://pro-pochvu.ru/blog/monstera-uhod-vidy" | grep -o '"commentCount":[0-9]*'
```
Expected: `"commentCount":1`.

- [ ] **Step 6: Visual check + 152-FZ via chrome-devtools**

Use chrome-devtools MCP: navigate to `https://pro-pochvu.ru/blog/monstera-uhod-vidy`, scroll to the comments section, screenshot. Confirm: approved comment shown, form present, submit disabled until consent checkbox is checked (button has `disabled={!consent}`).

- [ ] **Step 7: Clean up the test comment**

Reject/delete the test comment via the 🗑 moderation link (or DB). Confirm it disappears from the page on next load.

---

## Notes for the implementer

- **No new runtime env.** Reuses `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`.
- **Local build is unavailable** (SIGBUS on this host) — rely on `npx tsc --noEmit`, `npm run lint`, `npm test` (vitest works, it's not the Next build), and prod verification via CI.
- **`/blog/[slug]` is `force-dynamic`** — approved comments appear on next load without cache revalidation.
- **Admin moderation page** (`/admin/comments`) is intentionally out of v1 scope — tokenized Telegram links are the moderation UX. Add later only if the PENDING volume justifies it.
- **Phase 2 (Dzen)** — separate plan; not covered here.
