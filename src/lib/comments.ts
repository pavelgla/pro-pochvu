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
