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
};
