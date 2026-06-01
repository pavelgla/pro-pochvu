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
