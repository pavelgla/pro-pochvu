// Canonical blog category → display label.
// Tolerant of legacy/raw values stored by the SMM import (e.g. "озеленение", "уход")
// so the listing renders correct labels even before the DB is normalized.
const BLOG_CATEGORY_LABELS: Record<string, string> = {
  ecokon: "Удобрения",
  udobreniya: "Удобрения",
  udobrenie: "Удобрения",
  grunty: "Грунты",
  grunt: "Грунты",
  tsvetologiya: "Цветология",
  ozelenenie: "Цветология",
  озеленение: "Цветология",
  uhod: "Уход за растениями",
  уход: "Уход за растениями",
};

export function blogCategoryLabel(category?: string | null): string | null {
  if (!category) return null;
  return BLOG_CATEGORY_LABELS[category.trim().toLowerCase()] ?? "Статьи";
}

// --- Блог-хаб: канонические категории (рубрики) ---
// raw-значения category в БД разнородны (ecokon/udobreniya, grunty/grunt, …),
// поэтому каждую рубрику задаём списком match-значений + URL-slug + SEO-мета.
export type BlogCategoryMeta = {
  slug: string; // URL: /blog/category/<slug>
  label: string; // отображаемое имя рубрики
  title: string; // <title> страницы рубрики
  description: string; // meta description
  intro: string; // вводный абзац на странице рубрики
  match: string[]; // raw-значения category (lowercase), относящиеся к рубрике
};

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  {
    slug: "udobreniya",
    label: "Удобрения",
    title: "Удобрения для растений: подкормки и питание — блог Пропочву",
    description:
      "Статьи об органических удобрениях и подкормке комнатных растений, рассады и сада: когда, чем и как часто кормить растения.",
    intro:
      "Как и чем подкармливать растения, рассаду и цветы, чтобы не навредить: органика, дозировки, схемы и частые ошибки.",
    match: ["ecokon", "udobreniya", "udobrenie"],
  },
  {
    slug: "grunty",
    label: "Грунты",
    title: "Грунты и субстраты для растений — блог Пропочву",
    description:
      "Как выбрать и составить грунт для рассады, комнатных растений и орхидей. Состав, разрыхлители, живая микрофлора почвы.",
    intro:
      "Из чего состоит хороший грунт, зачем нужны перлит и вермикулит и почему живая почва важнее стерильной.",
    match: ["grunty", "grunt"],
  },
  {
    slug: "tsvetologiya",
    label: "Цветология",
    title: "Вертикальное озеленение и фитомодули — блог Пропочву",
    description:
      "Вертикальные сады, фитомодули и зелёные стены для дома и офиса: подбор растений, монтаж, уход, фитильный полив.",
    intro:
      "Вертикальное озеленение для квартиры и офиса: как устроены фитомодули, что на них растёт и как за этим ухаживать.",
    match: ["tsvetologiya", "ozelenenie", "озеленение"],
  },
  {
    slug: "uhod",
    label: "Уход за растениями",
    title: "Уход за комнатными растениями — блог Пропочву",
    description:
      "Практичные советы по уходу за комнатными растениями: освещение, полив, пересадка, борьба с вредителями и сезонные работы.",
    intro:
      "Свет, полив, пересадка и защита от вредителей — практичные советы по уходу за домашними растениями круглый год.",
    match: ["uhod", "уход"],
  },
];

export function categorySlugForRaw(raw?: string | null): string | null {
  if (!raw) return null;
  const low = raw.trim().toLowerCase();
  return BLOG_CATEGORIES.find((c) => c.match.includes(low))?.slug ?? null;
}

export function getCategoryMeta(slug: string): BlogCategoryMeta | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

// --- Кураторские подборки ---
export type BlogCollection = {
  slug: string; // URL: /blog/podborka/<slug>
  title: string;
  description: string;
  intro: string;
  postSlugs: string[]; // порядок статей в подборке
};

export const BLOG_COLLECTIONS: BlogCollection[] = [
  {
    slug: "s-chego-nachat",
    title: "С чего начать новичку",
    description:
      "Подборка статей для тех, кто только завёл растения: неприхотливые виды, полив, подкормка и первый грунт.",
    intro:
      "Если растения появились недавно — начните отсюда. Самое важное про выбор, полив и питание простыми словами.",
    postSlugs: [
      "neprihotlivye-komnatnye-rasteniya",
      "chem-podkormit-komnatnye-cvety",
      "zhivaya-mikroflora-grunta",
      "kak-vybrat-grunt-dlya-rassady",
    ],
  },
  {
    slug: "sezonnoe-leto",
    title: "Сезонное: лето",
    description:
      "Что важно для растений летом: солнечные ожоги, растения для южных окон, вертикальные грядки и подкормка в жару.",
    intro:
      "Летние заботы цветовода: защита от солнца, подбор растений для ярких окон и урожай на вертикальной грядке.",
    postSlugs: [
      "vesennie-solnechnye-ozhogi",
      "rasteniya-dlya-solnechnyh-okon",
      "klubnika-na-fitomodule",
      "uhod-za-domashnimi-tsitrusami",
    ],
  },
  {
    slug: "rassada",
    title: "Всё про рассаду",
    description:
      "Грунт, подкормка и частые проблемы рассады: как вырастить крепкие сеянцы томатов, перца и цветов.",
    intro:
      "От выбора грунта до подкормки по неделям — всё, что нужно для крепкой рассады без вытягивания.",
    postSlugs: [
      "kak-vybrat-grunt-dlya-rassady",
      "podkormka-rassady-tomatov-pertsa",
      "pochemu-rassada-vytyagivaetsya",
      "biogumus-dlya-rassady",
      "grunt-dlya-rassady-svoimi-rukami",
    ],
  },
];

export function getCollection(slug: string): BlogCollection | undefined {
  return BLOG_COLLECTIONS.find((c) => c.slug === slug);
}

// --- Теги ---
export function tagToSlug(tag: string): string {
  return encodeURIComponent(tag.trim().toLowerCase());
}

export function slugToTag(slug: string): string {
  return decodeURIComponent(slug).toLowerCase();
}

// Статья → товар-якорь для CTA в конце материала.
export const BLOG_PRODUCT_ANCHORS: Record<string, string> = {
  "bio-chay-ekokon-obzor": "bio-chay-yantar-fosfor",
  "biogumus-dlya-rassady": "udobrenie-rassada",
  "udobrenie-dlya-orhidey": "bio-chay-orhidei",
  "kak-vybrat-grunt-dlya-rassady": "grunt-ecokon-20l",
  "vertikalnyy-sad-v-kvartire": "fitomodul-50-4-white",
  "vertikalnoe-ozelenenie-v-kvartire": "fitomodul-50-4-green",
  "kak-pravilno-uhazhivat-za-komnatnymi-rasteniyami": "bio-chay-dekorativno-listvennye",
  "chem-podkormit-komnatnye-cvety": "bio-chay-yantar-fosfor",
  "yantarnaya-kislota-dlya-rasteniy": "bio-chay-yantar-fosfor",
  "podkormka-rassady-tomatov-pertsa": "udobrenie-rassada",
  "konskiy-navoz-kak-udobrenie": "udobrenie-kornevaya",
  "chem-podkormit-fialki": "bio-chay-dekorativno-listvennye",
  "grunt-dlya-rassady-svoimi-rukami": "grunt-ecokon-20l",
  "grunt-dlya-orhidey": "grunt-ecokon-organicheskiy",
  "pochemu-rassada-vytyagivaetsya": "grunt-ecokon-20l",
  "agroperlit-vermikulit-v-grunte": "grunt-ecokon-organicheskiy",
  "vertikalnoe-ozelenenie-ofisa": "fitomodul-50-4-black",
  "rasteniya-dlya-fitosteny-v-kvartire": "fitomodul-50-4-white",
  "fitomodul-svoimi-rukami-vs-gotovyy": "fitomodul-50-4-white",
  "uhod-za-fitostenoy": "fitomodul-50-4-green",
  // Батч по материалам @spottykit (июнь 2026)
  "zhivaya-mikroflora-grunta": "grunt-ecokon-organicheskiy",
  "rasteniya-dlya-solnechnyh-okon": "bio-chay-yantar-fosfor",
  "uhod-za-domashnimi-tsitrusami": "udobrenie-tsitrusovye",
  "klubnika-na-fitomodule": "fitomodul-50-4-white",
  "neprihotlivye-komnatnye-rasteniya": "bio-chay-dekorativno-listvennye",
  "vesennie-solnechnye-ozhogi": "bio-chay-yantar-fosfor",
  // Батч 2 по материалам @spottykit (июнь 2026)
  "monstera-uhod-vidy": "grunt-ecokon-organicheskiy",
  "anturium-uhod-pochemu-ne-cvetet": "udobrenie-tsvetushchie",
  "tripsy-na-komnatnyh-rasteniyah": "bio-chay-yantar-fosfor",
  "pryanye-travy-v-kashpo": "fitomodul-50-4-white",
  "yadovitye-komnatnye-rasteniya": "bio-chay-dekorativno-listvennye",
  "razmnozhenie-rasteniy-cherenkami": "udobrenie-kornevaya",
};

// Источник обложки статьи (стоковые фото Pexels). Показываем в футере статьи.
export type ImageCredit = { author: string; source: string };
export const BLOG_IMAGE_CREDITS: Record<string, ImageCredit> = {
  "chem-podkormit-komnatnye-cvety": { author: "primitive-spaces", source: "https://www.pexels.com/photo/indoor-potted-plants-by-a-glass-window-36065272/" },
  "yantarnaya-kislota-dlya-rasteniy": { author: "cottonbro studio", source: "https://www.pexels.com/photo/a-man-watering-green-houseplants-9710641/" },
  "kak-pravilno-uhazhivat-za-komnatnymi-rasteniyami": { author: "Karola G", source: "https://www.pexels.com/photo/person-watering-plants-on-white-table-6640487/" },
  "podkormka-rassady-tomatov-pertsa": { author: "Judith Knight", source: "https://www.pexels.com/photo/green-plants-in-black-plastic-pots-14057978/" },
  "pochemu-rassada-vytyagivaetsya": { author: "Karol Dach", source: "https://www.pexels.com/photo/plants-in-plastic-cups-12258688/" },
  "kak-vybrat-grunt-dlya-rassady": { author: "Gary Barnes", source: "https://www.pexels.com/photo/gardeners-planting-seedling-in-pots-in-greenhouse-6231852/" },
  "biogumus-dlya-rassady": { author: "Joice Rivas", source: "https://www.pexels.com/photo/potted-plants-placed-on-rows-9512341/" },
  "grunt-dlya-rassady-svoimi-rukami": { author: "Rocketmann Prod", source: "https://www.pexels.com/photo/a-person-putting-in-some-soil-in-a-white-pot-9507236/" },
  "agroperlit-vermikulit-v-grunte": { author: "Teona Swift", source: "https://www.pexels.com/photo/gardener-planting-cactus-in-pot-with-soil-6912844/" },
  "konskiy-navoz-kak-udobrenie": { author: "Juanmt", source: "https://www.pexels.com/photo/hands-holding-rich-organic-compost-in-garden-33995853/" },
  "chem-podkormit-fialki": { author: "Mikhail Nilov", source: "https://www.pexels.com/photo/an-african-violet-plant-in-close-up-photography-7814292/" },
  "grunt-dlya-orhidey": { author: "Pixabay", source: "https://www.pexels.com/photo/white-moth-orchids-87016/" },
  "udobrenie-dlya-orhidey": { author: "Andromeda99", source: "https://www.pexels.com/photo/beautiful-phalaenopsis-in-close-up-photography-11205261/" },
  "vertikalnoe-ozelenenie-ofisa": { author: "Asanjorjo", source: "https://www.pexels.com/photo/lush-vertical-garden-in-singapore-s-marina-bay-31712918/" },
  "rasteniya-dlya-fitosteny-v-kvartire": { author: "Sayeed X Chowdhury", source: "https://www.pexels.com/photo/colorful-vertical-garden-wall-with-potted-plants-33628019/" },
  "fitomodul-svoimi-rukami-vs-gotovyy": { author: "Sukrit Lamthong", source: "https://www.pexels.com/photo/green-plants-hanging-on-the-brick-wall-7443025/" },
  "uhod-za-fitostenoy": { author: "Magda Ehlers", source: "https://www.pexels.com/photo/green-plants-on-black-pots-5958769/" },
  "vertikalnyy-sad-v-kvartire": { author: "Ian Panelo", source: "https://www.pexels.com/photo/various-potted-plants-in-orangery-6911178/" },
  "vertikalnoe-ozelenenie-v-kvartire": { author: "Ian Panelo", source: "https://www.pexels.com/photo/assorted-plants-in-plastic-containers-6911177/" },
  // Батч 2 @spottykit — переиспользованы существующие фото Pexels (тот же автор/источник)
  "monstera-uhod-vidy": { author: "primitive-spaces", source: "https://www.pexels.com/photo/indoor-potted-plants-by-a-glass-window-36065272/" },
  "anturium-uhod-pochemu-ne-cvetet": { author: "cottonbro studio", source: "https://www.pexels.com/photo/a-man-watering-green-houseplants-9710641/" },
  "tripsy-na-komnatnyh-rasteniyah": { author: "Karola G", source: "https://www.pexels.com/photo/person-watering-plants-on-white-table-6640487/" },
  "pryanye-travy-v-kashpo": { author: "Sukrit Lamthong", source: "https://www.pexels.com/photo/green-plants-hanging-on-the-brick-wall-7443025/" },
  "yadovitye-komnatnye-rasteniya": { author: "Ian Panelo", source: "https://www.pexels.com/photo/various-potted-plants-in-orangery-6911178/" },
  "razmnozhenie-rasteniy-cherenkami": { author: "Rocketmann Prod", source: "https://www.pexels.com/photo/a-person-putting-in-some-soil-in-a-white-pot-9507236/" },
};
