---
type: plan
status: in-progress
date: 2026-06-02
updated: 2026-06-02
project: pro-pochvu
source_plan: ~/.claude (this session)
---

# Blog-article Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an autonomous Claude Code skill `blog-article` that publishes 3 SEO blog articles from @spottykit notes — house voice, themed covers + credits, prod deploy, IndexNow — codifying the proven manual workflow.

**Architecture:** A skill at `~/.claude/skills/blog-article/` with a procedural `SKILL.md` plus two reference files: `style-guide.md` (voice + anti-AI-tells checklist + structure template + real excerpts) and `publish.md` (exact dedup/seed/deploy/IndexNow commands). The skill follows the obkatannyy pattern of `seed-blog-batch2-spottykit-202606.ts` and `src/lib/blog.ts` maps.

**Tech Stack:** Markdown skill files; Prisma seed scripts (`npx tsx`); prod = `ssh spb1` + `docker exec ecokon-web/ecokon-db`; IndexNow API.

---

## Reference facts (verified 2026-06-02)

- **Prod DB dedup:** `ssh spb1 'docker exec ecokon-db psql -U ecokon -d ecokon -tAc "SELECT slug FROM blog_posts WHERE \"isPublished\" = true;"'` — table `blog_posts` (Prisma @@map), columns camelCase **quoted** (`"isPublished"`, `"publishedAt"`), `slug` unquoted. 32 posts currently published.
- **ssh spb1 intermittently times out** on banner exchange → every ssh/scp step needs a retry (2–3 attempts).
- **Cover pool:** 19 themed Pexels photos in `/public/images/blog/` (map in `scripts/update-blog-covers.ts`), each credited in `src/lib/blog.ts` → `BLOG_IMAGE_CREDITS`.
- **Wiring maps in `src/lib/blog.ts`:** `BLOG_PRODUCT_ANCHORS` (slug → product slug for CTA), `BLOG_IMAGE_CREDITS` (slug → {author, source}).
- **Categories:** `udobreniya` / `grunty` / `tsvetologiya` / `uhod`.
- **Digest source:** `docs/partner-content/spottykit/relevant-digest.md` (gitignored, 84 posts).
- **Attribution footer constant** (verbatim from batch 2):
  `\n\n---\n\n*Материал подготовлен редакцией Пропочву по экспертным публикациям [Екатерины — Telegram-канал «Дом соломинки»](https://t.me/spottykit), партнёра бренда Цветология.*`

---

## File Structure

```
~/.claude/skills/blog-article/
  SKILL.md                  # procedural workflow + frontmatter triggers
  references/
    style-guide.md          # voice, structure template, anti-AI-tells checklist, real excerpts
    publish.md              # dedup query, dev/prod seed, push, IndexNow — exact commands w/ retry
```

No repo code is created by the skill build itself; the skill *generates* `scripts/seed-blog-batchN-spottykit-YYYYMM.ts` and edits `src/lib/blog.ts` at run time.

---

### Task 1: Scaffold skill + SKILL.md

**Files:**
- Create: `~/.claude/skills/blog-article/SKILL.md`

- [ ] **Step 1: Create the skill directory**

Run: `mkdir -p ~/.claude/skills/blog-article/references`
Expected: no output, dir exists.

- [ ] **Step 2: Write `SKILL.md`** with this exact content:

````markdown
---
name: blog-article
description: Публикует SEO-статьи в блог pro-pochvu из заметок партнёрского канала @spottykit. Используй когда Павел просит "напиши статьи из катиных заметок", "новые статьи в блог", "пополни блог", "статьи из spottykit", "ещё статьи". Полностью автономно: выбирает темы из дайджеста (дедуп по прод-БД), пишет в фирменном стиле без AI-следов, ставит тематическую обложку с кредитом, сидит на прод, пушит, пингует IndexNow. По умолчанию 3 статьи.
---

# blog-article — конвейер статей из заметок @spottykit

Кодифицирует обкатанный вручную процесс (2 батча = 12 статей). Источник прав и стиля: партнёрский канал Екатерины @spottykit, полные права, формат — оригинальный рерайт + атрибуция.

**По умолчанию 3 статьи. Деплой — внутри.** Аргумент = число статей (`/blog-article 5`) или конкретные темы.

## Шаги

1. **Контекст.** Прочитать `references/style-guide.md` (голос + анти-AI-чеклист + шаблон) и `references/publish.md` (команды). Прочитать память `partner-spottykit-content.md` (остаток тем, уже использованное).

2. **Выбор тем.**
   - Дедуп: получить опубликованные slug из прод-БД (см. `references/publish.md` → «Дедуп»).
   - Прочитать `docs/partner-content/spottykit/relevant-digest.md`, выбрать N тем, которых нет среди опубликованных и в «уже использовано», релевантных категориям `udobreniya/grunty/tsvetologiya/uhod`. Стартовый остаток — в памяти.
   - Каждой теме назначить: slug (транслит), category, 3–4 тега, целевой product-анкор и 2–4 внутренние ссылки на существующие статьи (slug сверять по списку из дедупа).

3. **Написание.** Каждую статью — строго по шаблону `references/style-guide.md`: ввод-крючок → секции `##` → болд-лейблы → внутренние + product ссылки → `## Частые вопросы` (3 Q/A) → атрибуция (константа из style-guide). Прогнать финальный текст по анти-AI-чеклисту; применить принципы скилла `humanizer`. ~500–900 слов.

4. **Обложки.** Подобрать каждой статье тематическую из 19 существующих (карта в `scripts/update-blog-covers.ts`). Скопировать кредит исходной в `BLOG_IMAGE_CREDITS[slug]`. Нет тематически подходящей → взять ближайшую и вывести «⚠ нужно фото для <slug>».

5. **Обвязка.** Сгенерить `scripts/seed-blog-batchN-spottykit-YYYYMM.ts` (структура — копия `seed-blog-batch2-spottykit-202606.ts`). Дописать в `src/lib/blog.ts`: `BLOG_PRODUCT_ANCHORS[slug]` и `BLOG_IMAGE_CREDITS[slug]` для каждой статьи.

6. **Публикация** (см. `references/publish.md`): прод-seed → коммит seed+blog.ts → push main → IndexNow-пинг новых URL.

7. **Учёт.** Обновить память `partner-spottykit-content.md` (перенести темы в «использовано»), `docs/CONTENT_PLAN.md`. Залогировать через скилл `log`.

## Правила

- Ссылки — только на реально существующие URL (slug из дедупа, товары из каталога). Битых ссылок не плодить.
- Не выдумывать факты по уходу — держаться исходных тезисов поста Кати.
- Не дублировать темы. Не трогать структуру блога (хаб/рубрики готовы).
- Локальный `npm run build` падает с SIGBUS — не запускать; верификация через прод + CI.
````

- [ ] **Step 3: Verify frontmatter parses**

Run: `head -5 ~/.claude/skills/blog-article/SKILL.md`
Expected: valid YAML frontmatter with `name: blog-article` and a `description:` containing triggers.

- [ ] **Step 4: Commit** (skill lives outside repo; commit nothing here — note in run log). Skip git for `~/.claude/`.

---

### Task 2: references/style-guide.md

**Files:**
- Create: `~/.claude/skills/blog-article/references/style-guide.md`

- [ ] **Step 1: Write `style-guide.md`** with this exact content:

````markdown
# Стиль статей блога pro-pochvu

Голос бренда «Пропочву». Цель — экспертно, тепло, по-человечески. Читатель не должен заподозрить генерацию.

## Структура статьи

1. **Ввод-крючок (1 абзац).** Сенсорный или житейский заход в тему. Сразу к сути проблемы читателя. НИКОГДА: «В этой статье мы рассмотрим…», «Сегодня поговорим о…».
2. **2–5 секций `##`** — по логике вопроса (свет / полив / грунт / частые ошибки и т.п.). Внутри — болд-лейблы: `**Свет** — яркий рассеянный…`.
3. **Внутренние ссылки** (2–4) на существующие статьи: `[якорный текст](/blog/<slug>)`. **Product-ссылки** (1–2): `[название](/product/<slug>)` или `[раздел](/catalog/<line>)`.
4. **`## Частые вопросы`** — ровно 3 пары вопрос/ответ. Вопрос болдом, ответ 1–3 предложения. Питает FAQ-разметку.
5. **Атрибуция** — добавляется автоматически в seed (константа ниже), в тексте статьи её НЕ писать.

Атрибуция-константа (ATTRIBUTION в seed-скрипте):
```
\n\n---\n\n*Материал подготовлен редакцией Пропочву по экспертным публикациям [Екатерины — Telegram-канал «Дом соломинки»](https://t.me/spottykit), партнёра бренда Цветология.*
```

## Чеклист анти-AI-следов (прогнать финальный текст)

Убрать/переписать:
- **Дутый символизм и оценки:** «играет важную роль», «является ключевым», «неотъемлемая часть», «в современном мире».
- **Пустые связки:** «Стоит отметить, что», «Важно понимать, что», «Как известно».
- **Рул-оф-три на автомате:** не каждое перечисление должно быть из трёх «красивых» пунктов.
- **Заключения-обобщения:** финальный абзац вида «Таким образом, правильный уход — залог здоровья растения». Лучше — конкретный практический вывод или вопрос-ответ.
- **Избыток тире** как универсального разделителя — чередовать с двоеточием, запятой, точкой.
- **Симметричные «не X, а Y» параллелизмы** подряд.
- **Канцелярит и пассив:** «может быть осуществлено» → «сделайте».
- **Английские кальки** AI-лексикона: «обеспечивает», «позволяет», «решение» там, где живая речь иная.

Затем применить скилл `humanizer` к тексту.

## Маркеры живого текста (добавлять уместно)

- Конкретика и числа из исходного поста («лист 30–40 см», «через 7–10 дней»).
- Лёгкая разговорность в вводе («та самая, с дырками»; «обидно путать»).
- Прямые императивы читателю («берите деликатесную», «не загущайте»).
- Честные оговорки («теоретически да, но…»).

## Эталонные примеры

Смотреть как образец тона и плотности ссылок — опубликованные статьи в `scripts/seed-blog-batch2-spottykit-202606.ts` (монстера, антуриум, трипсы). Открыть, перечитать 1–2 перед написанием нового батча.

## Поля статьи (для seed)

`slug` (транслит, латиница, дефисы), `title` (≤60 симв. желательно), `excerpt` (1–2 предложения, цепляющие), `category` (одна из 4), `tags` (3–4), `coverImage` (`/images/blog/<file>.jpg`), `seoTitle` (≤60), `seoDescription` (≤160), `publishedAt` (YYYY-MM-DD = сегодня), `content` (markdown без атрибуции — её добавит seed).
````

- [ ] **Step 2: Verify the anti-AI checklist and ATTRIBUTION constant are present**

Run: `grep -c "анти-AI" ~/.claude/skills/blog-article/references/style-guide.md && grep -c "spottykit" ~/.claude/skills/blog-article/references/style-guide.md`
Expected: both ≥ 1.

---

### Task 3: references/publish.md

**Files:**
- Create: `~/.claude/skills/blog-article/references/publish.md`

- [ ] **Step 1: Write `publish.md`** with this exact content:

````markdown
# Публикация: команды (проверены 2026-06-02)

> `ssh spb1` периодически таймаутит на banner exchange. КАЖДУЮ ssh/scp-команду оборачивать в retry (2–3 попытки с паузой).

## Дедуп — опубликованные slug из прод-БД

```bash
ssh -o ConnectTimeout=15 spb1 'docker exec ecokon-db psql -U ecokon -d ecokon -tAc "SELECT slug FROM blog_posts WHERE \"isPublished\" = true;"'
```
Таблица `blog_posts` (Prisma @@map). Колонки camelCase в кавычках: `"isPublished"`, `"publishedAt"`. `slug` без кавычек.

## Прод-seed (контент в выдаче сразу)

Standalone-образ НЕ копирует `.ts` — доставлять файлом:
```bash
F=scripts/seed-blog-batchN-spottykit-YYYYMM.ts
for i in 1 2 3; do scp -o ConnectTimeout=15 "$F" spb1:/tmp/ && break || sleep 5; done
ssh spb1 "docker cp /tmp/$(basename $F) ecokon-web:/app/scripts/ && docker exec -w /app ecokon-web npx tsx scripts/$(basename $F)"
```
Ожидаемо: `upserted: <slug>` по строке на статью.

## Код (кредиты/анкоры) → CI-деплой

```bash
git add scripts/seed-blog-batchN-spottykit-YYYYMM.ts src/lib/blog.ts
git commit -m "feat(blog): N статей из @spottykit (батч M) + обложки/анкоры"
git push origin main          # CI ~9 мин, задеплоит blog.ts
```
Контент уже на проде из прод-seed; push нужен для рендера футер-кредита и CTA-анкоров.

## IndexNow — пинг новых URL

```bash
TOKEN=$(ssh spb1 "docker exec ecokon-web printenv ADMIN_API_TOKEN")
curl -sS -X POST "https://pro-pochvu.ru/api/indexnow/ping" \
  -H "X-Admin-Token: $TOKEN" -H "Content-Type: application/json" \
  -d '{"urls":["https://pro-pochvu.ru/blog/<slug1>","https://pro-pochvu.ru/blog/<slug2>","https://pro-pochvu.ru/blog/<slug3>"]}'
```
Ожидаемо: `{"ok":true,...}`.

## Проверка прода

```bash
for s in <slug1> <slug2> <slug3>; do
  curl -sS -o /dev/null -w "%{http_code} /blog/$s\n" "https://pro-pochvu.ru/blog/$s"
done
```
Ожидаемо: `200` по каждой.
````

- [ ] **Step 2: Verify dedup and seed commands present**

Run: `grep -c "blog_posts" ~/.claude/skills/blog-article/references/publish.md && grep -c "indexnow/ping" ~/.claude/skills/blog-article/references/publish.md`
Expected: both ≥ 1.

---

### Task 4: Acceptance — first real batch of 3 (validates the skill end-to-end)

This is the skill's first production run; it both validates the skill and fulfils the standing request for new articles. Do it by **invoking the skill** (not by hand) so any gaps in SKILL.md/references surface.

**Files:**
- Create (by skill): `scripts/seed-blog-batch3-spottykit-202606.ts`
- Modify (by skill): `src/lib/blog.ts` (`BLOG_PRODUCT_ANCHORS`, `BLOG_IMAGE_CREDITS`)

- [ ] **Step 1: Invoke the skill**

In a session: `/blog-article` (or "напиши 3 статьи из катиных заметок"). Confirm it reads the references, pulls the dedup list, and picks 3 unused topics from the digest (candidates from memory: спатифиллум, петунии/«петуниизаменители», закаливание/вынос на улицу, долгоиграющие удобрения, орхидея после цветения).

- [ ] **Step 2: Verify drafts against the anti-AI checklist**

Read each generated `content`. Confirm: no banned phrases from `style-guide.md`, has hook intro, `## Частые вопросы` with 3 Q/A, 2–4 internal links + product anchor, attribution appended in seed.
Expected: all three pass.

- [ ] **Step 3: Verify prod publish**

Run the prod-check loop from `publish.md`.
Expected: `200 /blog/<slug>` for all 3; `/blog` listing shows them; DB count rises to 35.

```bash
ssh spb1 'docker exec ecokon-db psql -U ecokon -d ecokon -tAc "SELECT count(*) FROM blog_posts WHERE \"isPublished\" = true;"'
```
Expected: `35`.

- [ ] **Step 4: Verify IndexNow + commit landed**

Expected: IndexNow returned `{"ok":true}`; `git log --oneline -1` shows the batch commit; `gh run list --limit 1` shows CI in_progress/success.

- [ ] **Step 5: Verify accounting updated**

Expected: memory `partner-spottykit-content.md` moved the 3 topics to «использовано»; daily note has a `## Что сделано` line; `docs/CONTENT_PLAN.md` updated.

- [ ] **Step 6: Mark this plan `status: done`**

---

## Self-review notes

- **Spec coverage:** topic selection (Task1.S2 step2 + Task3 dedup), house-voice writing + anti-AI (Task2), covers + credits (Task1.S2 step4 + Task2 fields), wiring/seed (Task1.S2 step5), prod deploy + IndexNow (Task3), accounting (Task1.S2 step7 + Task4.S5). All spec sections mapped.
- **Placeholders:** `<slugN>`, `batchN`, `YYYYMM`, `M` are intentional runtime fill-ins (the skill computes them per run), not plan gaps — every command shows exact surrounding form.
- **Consistency:** table `blog_posts`, quoted camelCase columns, attribution constant, and the four category slugs are identical across all tasks and match the spec and verified DB.
