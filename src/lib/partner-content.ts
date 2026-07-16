// Партнёрский контент: Telegram-канал Екатерины (@spottykit, «Дом соломинки»).
// Полные права на использование. Встраиваем официальным виджетом Telegram, но
// т.к. в РФ Telegram режется РКН и без VPN эмбед не грузится — у каждого поста
// есть self-hosted превью (image) + заголовок (title) для карточки-фолбэка.
//
// Превью лежат в /public/images/partner/ (скачаны с cdn.telesco.pe).
// ID постов сверены вручную из t.me/s/spottykit; обновляются скиллом tg-parser.

export const PARTNER = {
  name: "Катя",
  nameGenitive: "Кати",
  fullName: "Катя · Дом соломинки",
  channel: "spottykit",
  url: "https://t.me/spottykit",
  subscribers: "163 000",
  blurb:
    "Блогер и эксперт по домашнему озеленению. Рассказывает про уход за растениями и наш грунт своим 163 000 подписчиков в Telegram.",
} as const;

export type PartnerPost = {
  post: string; // "channel/messageId" для виджета
  title: string; // подпись для карточки-фолбэка
  image: string; // self-hosted превью (РКН-устойчиво)
};

// Курируемая лента для витрины «Нас рекомендует Катя».
export const PARTNER_SHOWCASE_POSTS: PartnerPost[] = [
  {
    post: "spottykit/10794",
    title: "Новая партия нашего воздушного грунта уже в пути",
    image: "/images/partner/spottykit-10794.jpg",
  },
  {
    post: "spottykit/10792",
    title: "Топ-3 растения для южных окон — без кактусов и суккулентов",
    image: "/images/partner/spottykit-10792.jpg",
  },
  {
    post: "spottykit/10793",
    title: "Зелёный календарь на месяц",
    image: "/images/partner/spottykit-10793.jpg",
  },
  {
    post: "spottykit/10783",
    title: "Ароматные растения: рубрика «Да, но»",
    image: "/images/partner/spottykit-10783.jpg",
  },
];

// Карта товар (slug) → пост-обзор Кати для блока на карточке товара.
export const PARTNER_PRODUCT_POSTS: Record<string, PartnerPost> = {
  "grunt-ecokon-20l": {
    post: "spottykit/10794",
    title: "Катя о нашем грунте: новая партия уже в пути",
    image: "/images/partner/spottykit-10794.jpg",
  },
  "grunt-ecokon-organicheskiy": {
    post: "spottykit/10794",
    title: "Катя о нашем грунте: новая партия уже в пути",
    image: "/images/partner/spottykit-10794.jpg",
  },
};
