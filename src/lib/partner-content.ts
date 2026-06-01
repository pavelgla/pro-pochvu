// Партнёрский контент: Telegram-канал Екатерины (@spottykit, «Дом соломинки»).
// Полные права на использование получены. Встраиваем официальным виджетом Telegram —
// контент остаётся за автором, с атрибуцией и ссылкой на канал.
//
// ID постов сверены вручную из t.me/s/spottykit. В дальнейшем обновляются
// скиллом tg-parser (см. plans/declarative-discovering-harbor.md).

export const PARTNER = {
  name: "Катя",
  fullName: "Катя · Дом соломинки",
  channel: "spottykit",
  url: "https://t.me/spottykit",
  subscribers: "163 000",
  blurb:
    "Блогер и эксперт по домашнему озеленению. Рассказывает про уход за растениями и наш грунт своим 163 000 подписчиков в Telegram.",
} as const;

// Курируемая лента для витрины «Нас рекомендует Катя».
export const PARTNER_SHOWCASE_POSTS: readonly string[] = [
  "spottykit/10794", // видео: наш грунт — новая партия
  "spottykit/10792", // видео: топ-3 растения для южных окон
  "spottykit/10793", // зелёный календарь на месяц
  "spottykit/10783", // ароматные растения, рубрика «Да, но»
];

// Карта товар (slug) → пост-обзор Кати для блока на карточке товара.
export const PARTNER_PRODUCT_POSTS: Record<string, string> = {
  "grunt-ecokon-20l": "spottykit/10794",
  "grunt-ecokon-organicheskiy": "spottykit/10794",
};
