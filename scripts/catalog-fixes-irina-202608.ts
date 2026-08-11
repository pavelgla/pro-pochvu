/**
 * Catalog corrections from Irina's answers (2026-08-11):
 *
 *   1. zaglushki-fitomodul: fills in real characteristics (material, weight,
 *      dimensions, compatibility) — weightGrams was a 50g placeholder, real is 8g.
 *   2. fitomodul-50-4-green: the physical module is grey, not green — confirmed
 *      by product photos and by Ozon's own offer_id "FITOCVET GREY" for the same
 *      SKU (2439041908). Renamed "зелёный" -> "серый".
 *   3. fitomodul-50-4-black: Irina's term for this SKU (2081828814) is
 *      "графитовый", not "чёрный" — same product, more accurate color name.
 *   4. kolyshki-skoby-silikon -> gorshki-prozrachnye-fitomodul: the product was
 *      renamed from "Колышки-скобы" to "Набор горшков прозрачных" back in
 *      catalog-fixes-202608.ts, but the slug (URL) was never updated and still
 *      misleads on search/SEO. Redirect for the old URL lives in next.config.mjs.
 *
 * Idempotent: safe to re-run.
 *
 * Usage: npx tsx scripts/catalog-fixes-irina-202608.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixPlugs() {
  const slug = 'zaglushki-fitomodul';
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    console.error(`SKIP plugs: ${slug} not found`);
    return;
  }
  if (product.weightGrams === 8) {
    console.log(`OK   plugs: already fixed`);
    return;
  }

  await prisma.product.update({
    where: { id: product.id },
    data: {
      weightGrams: 8,
      characteristics: {
        Материал: 'Силикон',
        'Вес набора': '8 г',
        Размеры: '150×100×10 мм (упаковка, 6 шт.)',
        Совместимость: 'Фитомодули Цветология — серый, графитовый, белый (отличаются только цветом)',
      },
    },
  });
  console.log(`DONE plugs: weight 50g -> 8g, characteristics filled`);
}

async function renameColor(slug: string, fromWord: string, toWord: string, newColorLabel: string) {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    console.error(`SKIP ${slug}: not found`);
    return;
  }
  if (!product.name.includes(fromWord)) {
    console.log(`OK   ${slug}: already renamed`);
    return;
  }

  const characteristics = (product.characteristics ?? {}) as Record<string, string>;

  await prisma.product.update({
    where: { id: product.id },
    data: {
      name: product.name.replace(fromWord, toWord),
      characteristics: { ...characteristics, Цвет: newColorLabel },
    },
  });
  console.log(`DONE ${slug}: "${fromWord}" -> "${toWord}"`);
}

async function renamePotsSlug() {
  const oldSlug = 'kolyshki-skoby-silikon';
  const newSlug = 'gorshki-prozrachnye-fitomodul';

  const existing = await prisma.product.findUnique({ where: { slug: newSlug } });
  if (existing) {
    console.log(`OK   pots: ${newSlug} already exists`);
    return;
  }

  const product = await prisma.product.findUnique({ where: { slug: oldSlug } });
  if (!product) {
    console.error(`SKIP pots: ${oldSlug} not found`);
    return;
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { slug: newSlug },
  });
  console.log(`DONE pots: slug ${oldSlug} -> ${newSlug}`);
}

async function main() {
  await fixPlugs();
  await renameColor('fitomodul-50-4-green', 'зелёный', 'серый', 'Серый');
  await renameColor('fitomodul-50-4-black', 'чёрный', 'графитовый', 'Графитовый');
  await renamePotsSlug();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
