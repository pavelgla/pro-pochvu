#!/usr/bin/env node
// Скрейпер публичной веб-версии Telegram-канала (t.me/s/<channel>).
// Без API-ключей: тянет посты + метаданные из HTML-превью, листает историю
// через ?before=<id>. Видеофайлы НЕ скачивает (для них нужен MTProto) — но
// фиксирует факт видео и прямую ссылку на пост.
//
// Использование:
//   node scripts/tg-scrape-public.mjs spottykit --limit=150 --out=/tmp/tg-parsed
//
// Флаги:
//   --limit=N   максимум постов (по умолчанию 120)
//   --out=DIR   куда писать (по умолчанию /tmp/tg-parsed)
//   --all       без фильтра по контексту (иначе помечает relevant по ключевым словам)

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const channel = process.argv[2]?.replace(/^@/, "") || "spottykit";
const args = process.argv.slice(3);
const limit = Number(args.find((a) => a.startsWith("--limit="))?.split("=")[1] || 120);
const outRoot = args.find((a) => a.startsWith("--out="))?.split("=")[1] || "/tmp/tg-parsed";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

// Ключевые слова нашего контекста (грунты / удобрения / растения / озеленение).
const KEYWORDS = [
  "грунт", "почв", "земл", "субстрат", "перлит", "вермикулит", "дренаж",
  "удобрен", "подкорм", "биогумус", "навоз", "компост", "биочай", "био-чай",
  "растен", "цвет", "орхиде", "фиал", "рассад", "корн", "лист", "пересад",
  "полив", "горшок", "кашпо", "фитомодул", "озеленен", "фитостен", "уход",
  "балкон", "подоконник", "свет", "зелен", "конск",
];

function decode(s) {
  return s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parsePage(html) {
  const posts = [];
  // Режем по началу message-обёртки.
  const blocks = html.split(/(?=data-post="[^"]+\/\d+")/);
  for (const b of blocks) {
    const idM = b.match(/data-post="[^"]+\/(\d+)"/);
    if (!idM) continue;
    const id = Number(idM[1]);

    const tM = b.match(/datetime="([^"]+)"/);
    const date = tM ? tM[1] : null;

    const vM = b.match(/tgme_widget_message_views"[^>]*>([^<]+)</);
    const views = vM ? vM[1].trim() : null;

    const hasVideo =
      /tgme_widget_message_video|message_video_player|tgme_widget_message_roundvideo|video_duration/.test(b);
    const hasPhoto = /tgme_widget_message_photo_wrap/.test(b);

    const txtM = b.match(/tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>\s*(?:<div class="tgme_widget_message_(?:footer|reply_markup|video|photo)|<\/div>)/);
    let text = "";
    if (txtM) text = decode(txtM[1]);

    posts.push({ id, date, views, hasVideo, hasPhoto, text });
  }
  // уникальные по id, по возрастанию
  const seen = new Map();
  for (const p of posts) if (!seen.has(p.id)) seen.set(p.id, p);
  return [...seen.values()].sort((a, b) => a.id - b.id);
}

async function fetchPage(before) {
  const url = `https://t.me/s/${channel}${before ? `?before=${before}` : ""}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

const isRelevant = (t) => {
  const low = (t || "").toLowerCase();
  return KEYWORDS.some((k) => low.includes(k));
};

async function main() {
  const all = new Map();
  let before = null;
  let guard = 0;
  while (all.size < limit && guard < 40) {
    guard++;
    const html = await fetchPage(before);
    const page = parsePage(html);
    if (!page.length) break;
    for (const p of page) if (!all.has(p.id)) all.set(p.id, p);
    const minId = Math.min(...page.map((p) => p.id));
    if (before && minId >= before) break; // дальше не листается
    before = minId;
    process.stderr.write(`page ${guard}: collected ${all.size} (before=${before})\n`);
    await new Promise((r) => setTimeout(r, 400)); // вежливая пауза
  }

  const posts = [...all.values()].sort((a, b) => b.id - a.id).slice(0, limit);
  const dir = join(outRoot, channel);
  await mkdir(join(dir, "posts"), { recursive: true });

  for (const p of posts) {
    const rel = isRelevant(p.text);
    const fm = [
      "---",
      `id: ${p.id}`,
      `url: https://t.me/${channel}/${p.id}`,
      `date: ${p.date || ""}`,
      `views: ${p.views || ""}`,
      `video: ${p.hasVideo}`,
      `photo: ${p.hasPhoto}`,
      `relevant: ${rel}`,
      "---",
      "",
      p.text || "(без текста)",
      "",
    ].join("\n");
    await writeFile(join(dir, "posts", `${p.id}.md`), fm, "utf-8");
  }

  const relevant = posts.filter((p) => isRelevant(p.text));
  await writeFile(
    join(dir, "meta.json"),
    JSON.stringify(
      {
        channel,
        scrapedTotal: posts.length,
        relevantCount: relevant.length,
        idRange: posts.length ? [posts.at(-1).id, posts[0].id] : [],
      },
      null,
      2,
    ),
    "utf-8",
  );

  // Дайджест релевантных постов — для решения «про что писать».
  const digest =
    `# ${channel} — релевантные посты (${relevant.length} из ${posts.length})\n\n` +
    relevant
      .map(
        (p) =>
          `## ${p.id} ${p.hasVideo ? "🎬" : p.hasPhoto ? "🖼" : "📝"} · ${p.date?.slice(0, 10) || "?"} · 👁 ${p.views || "?"}\n` +
          `https://t.me/${channel}/${p.id}\n\n${p.text || "(без текста)"}\n`,
      )
      .join("\n---\n\n");
  await writeFile(join(dir, "relevant-digest.md"), digest, "utf-8");

  console.log(
    `Готово: ${posts.length} постов, релевантных ${relevant.length}. → ${dir}\n` +
      `Дайджест: ${join(dir, "relevant-digest.md")}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
