/**
 * Catalog fixes requested 2026-08-07:
 *   1. kolyshki-skoby-silikon was named "Колышки-скобы садовые силиконовые" but the
 *      description, images and Ozon SKU all describe a set of transparent pots.
 *      Fix the name, set the price to 1061 and move it to the "Горшки и кашпо"
 *      category (it sat in a category belonging to another product line).
 *   2. Add "Заглушки для фитомодуля Цветология" — 505 ₽.
 *   3. Drop two seeded reviews that describe silicone clips, not this product.
 *
 * Idempotent: safe to re-run.
 *
 * Usage: npx tsx scripts/catalog-fixes-202608.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ACCESSORIES_LINE = 'accessories';
const POTS_SLUG = 'kolyshki-skoby-silikon';
const PLUGS_SLUG = 'zaglushki-fitomodul';

const PLUGS_FULL_DESC = `Силиконовые заглушки к фитомодулям «Цветология» — защита от перелива.

Вставляются в модуль от руки и держатся за счёт конусной формы: инструмент и крепёж не нужны. Силикон не дубеет от влаги и не трескается, форму держит.

Заглушки переставляются и используются повторно — после работы достаточно промыть их водой.

В наборе 6 штук.`;

async function fixPots() {
  const product = await prisma.product.findUnique({ where: { slug: POTS_SLUG } });
  if (!product) {
    console.error(`SKIP pots: ${POTS_SLUG} not found`);
    return;
  }

  const category = await prisma.category.findUnique({ where: { slug: 'gorshki-kashpo' } });
  if (!category) {
    console.error('SKIP pots: category gorshki-kashpo not found');
    return;
  }

  await prisma.product.update({
    where: { id: product.id },
    data: {
      name: 'Набор горшков прозрачных для фитомодуля Цветология',
      price: 1061,
      // old price 399 predates the correction and would render as a discount upwards
      oldPrice: null,
      badge: null,
      categoryId: category.id,
    },
  });
  console.log(`DONE pots: name + price ${product.price} -> 1061, category -> gorshki-kashpo`);
}

async function addPlugs() {
  const existing = await prisma.product.findUnique({ where: { slug: PLUGS_SLUG } });
  if (existing) {
    console.log(`OK   plugs: ${PLUGS_SLUG} already exists`);
    return;
  }

  const line = await prisma.productLine.findUnique({ where: { slug: ACCESSORIES_LINE } });
  if (!line) {
    console.error(`SKIP plugs: product line ${ACCESSORIES_LINE} not found`);
    return;
  }

  const category = await prisma.category.upsert({
    where: { slug: 'komplektuyushchie-fitomodul' },
    update: {},
    create: {
      slug: 'komplektuyushchie-fitomodul',
      name: 'Комплектующие для фитомодулей',
      description: 'Расходные материалы и мелкие детали для модульных систем «Цветология»',
      productLineId: line.id,
      sortOrder: 9,
    },
  });

  await prisma.product.create({
    data: {
      slug: PLUGS_SLUG,
      name: 'Заглушки для фитомодуля Цветология',
      shortDesc:
        'Силиконовые заглушки для фитомодуля «Цветология» — защита от перелива. 6 штук в наборе.',
      fullDesc: PLUGS_FULL_DESC,
      price: 505,
      images: ['/images/tsvetologiya/zaglushki-fitomodul_1.jpg'],
      weightGrams: 50,
      stock: 100,
      sellDirect: true,
      productLineId: line.id,
      categoryId: category.id,
    },
  });
  console.log(`DONE plugs: created ${PLUGS_SLUG} at 505 ₽ in category ${category.slug}`);
}

async function dropMismatchedReviews() {
  // Seeded texts describe silicone clips ("скобы держат ветки томатов"), not the pot set.
  const { count } = await prisma.review.deleteMany({
    where: { id: { in: ['review-kolyshki-1', 'review-kolyshki-2'] } },
  });
  console.log(count ? `DONE reviews: removed ${count} mismatched review(s)` : 'OK   reviews: nothing to remove');
}

async function main() {
  await fixPots();
  await addPlugs();
  await dropMismatchedReviews();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
