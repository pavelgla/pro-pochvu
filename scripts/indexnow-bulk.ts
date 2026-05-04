/**
 * Bulk-submit all known URLs to IndexNow (initial warm-up).
 * Pulls product/product-line slugs from DB, builds full URL list, sends to api.indexnow.org.
 *
 * Usage:
 *   npx tsx scripts/indexnow-bulk.ts
 *
 * Requires:
 *   INDEXNOW_KEY  — same key as deployed on the site (key file must be reachable)
 *   DATABASE_URL  — for Prisma
 *
 * Run AFTER the site is deployed and /{KEY}.txt is reachable, otherwise
 * IndexNow will reject submissions.
 */

import { PrismaClient } from "@prisma/client";

const SITE_HOST = "pro-pochvu.ru";
const SITE_URL = `https://${SITE_HOST}`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_BATCH = 10000;

const STATIC_PATHS = [
  "/",
  "/catalog",
  "/about",
  "/contacts",
  "/delivery",
  "/returns",
  "/blog",
  "/knowledge-base",
  "/knowledge-base/video",
];

async function main() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    console.error("ERROR: INDEXNOW_KEY env is not set");
    process.exit(1);
  }

  const showTsvetologiya = process.env.NEXT_PUBLIC_SHOW_TSVETOLOGIYA !== "false";

  const prisma = new PrismaClient();

  try {
    const [productLines, products] = await Promise.all([
      prisma.productLine.findMany({
        where: { isActive: true },
        select: { slug: true, brand: true },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true },
      }),
    ]);

    const productLinePaths = productLines
      .filter((pl) => showTsvetologiya || pl.brand !== "tsvetologiya")
      .map((pl) => `/catalog/${pl.slug}`);

    const productPaths = products.map((p) => `/product/${p.slug}`);

    const urls = [...STATIC_PATHS, ...productLinePaths, ...productPaths].map(
      (p) => `${SITE_URL}${p}`
    );

    console.log(`Total URLs to submit: ${urls.length}`);
    console.log(`Static: ${STATIC_PATHS.length}`);
    console.log(`Product lines: ${productLinePaths.length}`);
    console.log(`Products: ${productPaths.length}`);
    console.log("");

    let totalOk = 0;
    let totalFail = 0;

    for (let i = 0; i < urls.length; i += MAX_BATCH) {
      const chunk = urls.slice(i, i + MAX_BATCH);
      const batchNum = Math.floor(i / MAX_BATCH) + 1;
      const batchTotal = Math.ceil(urls.length / MAX_BATCH);

      console.log(`Batch ${batchNum}/${batchTotal}: ${chunk.length} URLs`);

      const body = {
        host: SITE_HOST,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: chunk,
      };

      try {
        const res = await fetch(INDEXNOW_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(body),
        });

        if (res.status === 200 || res.status === 202) {
          console.log(`  ✓ ${res.status} — accepted`);
          totalOk += chunk.length;
        } else {
          const text = await res.text().catch(() => "");
          console.error(`  ✗ ${res.status} — ${text.slice(0, 200)}`);
          totalFail += chunk.length;
        }
      } catch (err) {
        console.error(`  ✗ network error:`, err);
        totalFail += chunk.length;
      }

      // Avoid rate limiting between batches
      if (i + MAX_BATCH < urls.length) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    console.log("");
    console.log(`Done. Submitted: ${totalOk}, failed: ${totalFail}`);
    process.exit(totalFail > 0 ? 1 : 0);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
