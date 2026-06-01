export const SITE_NAME = "Пропочву";

export const SHOW_TSVETOLOGIYA =
  process.env.NEXT_PUBLIC_SHOW_TSVETOLOGIYA !== "false";

export const BRANDS = {
  ecokon: { name: "ЭКО Конь", color: "#2D5016" },
  tsvetologiya: { name: "Цветология", color: "#4A5568" },
} as const;

export const FREE_DELIVERY_THRESHOLD = 3000;

export const DEFAULT_CURRENCY = "RUB";

// Официальные магазины на маркетплейсах (продажи идут здесь, пока нет своей доставки).
export const MARKETPLACE_STORES = {
  ozonEcokon: "https://www.ozon.ru/seller/eko-kon",
  ozonTsvetologiya: "https://www.ozon.ru/seller/tsvetologiya",
  wildberries: "https://www.wildberries.ru/seller/eko-kon",
} as const;

export const TELEGRAM_URL = "https://t.me/+7cAd9gatgP44MDcy";
