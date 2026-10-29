-- 2026-10-29: video instructions restored only partially (originals lost with spb1).
-- Clear videoUrl for products whose video file does not exist on sel1,
-- so the "Применение" tab doesn't show a broken player. Restore when files are found.
BEGIN;
UPDATE products SET "videoUrl" = NULL WHERE slug IN (
  'udobrenie-kornevaya',
  'udobrenie-rassada',
  'udobrenie-ovoshchi',
  'bio-chay-orhidei',
  'bio-chay-dekorativno-listvennye'
);
SELECT slug, "videoUrl" FROM products WHERE "videoUrl" IS NOT NULL ORDER BY slug;
COMMIT;
