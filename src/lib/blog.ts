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
