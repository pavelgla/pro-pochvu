/**
 * Replace the main (first) product image with the new WB infographics.
 * Old first image is dropped from the array; files stay on disk.
 *
 * Usage: npx tsx scripts/update-main-images-202608.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MAIN_IMAGES: Record<string, string> = {
  'udobrenie-tsitrusovye': '/images/main/udobrenie-tsitrusovye.webp',
  'udobrenie-rassada': '/images/main/udobrenie-rassada.webp',
  'bio-chay-yantar-fosfor': '/images/main/bio-chay-yantar-fosfor.webp',
  'udobrenie-ovoshchi': '/images/main/udobrenie-ovoshchi.webp',
  'udobrenie-kornevaya': '/images/main/udobrenie-kornevaya.webp',
  'bio-chay-orhidei': '/images/main/bio-chay-orhidei.webp',
  'bio-chay-dekorativno-listvennye': '/images/main/bio-chay-dekorativno-listvennye.webp',
  'udobrenie-tsvetushchie': '/images/main/udobrenie-tsvetushchie.webp',
};

async function main() {
  for (const [slug, mainImage] of Object.entries(MAIN_IMAGES)) {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, images: true },
    });

    if (!product) {
      console.error(`SKIP ${slug}: product not found`);
      continue;
    }

    const current = Array.isArray(product.images) ? (product.images as string[]) : [];

    if (current[0] === mainImage) {
      console.log(`OK   ${slug}: already up to date`);
      continue;
    }

    // Drop the old main infographic (position 0) and any earlier copy of the new one.
    const rest = current.slice(1).filter((src) => src !== mainImage);
    const images = [mainImage, ...rest];

    await prisma.product.update({ where: { id: product.id }, data: { images } });
    console.log(`DONE ${slug}: ${current.length} -> ${images.length} images, main = ${mainImage}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
