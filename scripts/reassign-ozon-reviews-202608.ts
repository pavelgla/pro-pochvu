/**
 * Ozon SKU 2825417652 was mapped to kolyshki-skoby-silikon (a set of transparent
 * pots), but it is actually the plugs — every synced review talks about closing
 * drain holes and water not spilling out of the phytomodule.
 *
 * Move those reviews to zaglushki-fitomodul and recompute the rating aggregates
 * of both products from the rows that are actually attached to them.
 *
 * Idempotent: safe to re-run.
 *
 * Usage: npx tsx scripts/reassign-ozon-reviews-202608.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FROM_SLUG = 'kolyshki-skoby-silikon';
const TO_SLUG = 'zaglushki-fitomodul';

async function refreshStats(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
  if (!product) return;

  const stats = await prisma.review.aggregate({
    where: { productId: product.id },
    _count: true,
    _avg: { rating: true },
  });

  await prisma.product.update({
    where: { id: product.id },
    data: {
      reviewsCount: stats._count,
      rating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 0,
    },
  });
  console.log(`STATS ${slug}: ${stats._count} отзывов, рейтинг ${stats._avg.rating?.toFixed(1) ?? '0'}`);
}

async function main() {
  const from = await prisma.product.findUnique({ where: { slug: FROM_SLUG }, select: { id: true } });
  const to = await prisma.product.findUnique({ where: { slug: TO_SLUG }, select: { id: true } });

  if (!from || !to) {
    console.error('SKIP: one of the products is missing');
    process.exit(1);
  }

  const { count } = await prisma.review.updateMany({
    where: { productId: from.id, source: 'ozon' },
    data: { productId: to.id },
  });
  console.log(count ? `DONE moved ${count} review(s) ${FROM_SLUG} -> ${TO_SLUG}` : 'OK   nothing to move');

  await refreshStats(FROM_SLUG);
  await refreshStats(TO_SLUG);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
