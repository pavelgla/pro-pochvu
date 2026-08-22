/**
 * Guard: every BLOG_PRODUCT_ANCHORS target must resolve to an ACTIVE product.
 *
 * A dead anchor is invisible in the UI — BlogProductCta still renders a full
 * "Товар из статьи" block, but its links 404. That silently broke the whole
 * blog -> catalog funnel in Aug 2026 (9 articles pointed at a deactivated
 * grunt SKU, including the top organic entry page).
 *
 * Run:  npx tsx scripts/check-blog-anchors.ts
 * Exits 1 and lists offenders when anything is missing or inactive.
 */
import { prisma } from "../src/lib/prisma";
import { BLOG_PRODUCT_ANCHORS } from "../src/lib/blog";

async function main() {
  const targets = Array.from(new Set(Object.values(BLOG_PRODUCT_ANCHORS)));
  const products = await prisma.product.findMany({
    where: { slug: { in: targets } },
    select: { slug: true, isActive: true },
  });
  const state = new Map(products.map((p) => [p.slug, p.isActive]));

  const broken: { article: string; product: string; reason: string }[] = [];
  for (const [article, product] of Object.entries(BLOG_PRODUCT_ANCHORS)) {
    if (!state.has(product)) broken.push({ article, product, reason: "нет такого товара" });
    else if (!state.get(product)) broken.push({ article, product, reason: "isActive=false — карточка отдаёт 404" });
  }

  const articles = Object.keys(BLOG_PRODUCT_ANCHORS).length;
  if (broken.length === 0) {
    console.log(`OK: ${articles} якорей, все ${targets.length} товаров активны`);
    return;
  }
  console.error(`СЛОМАНО: ${broken.length} из ${articles} якорей ведут в никуда\n`);
  for (const b of broken) console.error(`  /blog/${b.article}  ->  /product/${b.product}  (${b.reason})`);
  process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
