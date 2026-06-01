/**
 * Idempotent fix for blog posts imported by the SMM agent:
 *  - normalize free-form categories to the canonical taxonomy
 *  - fill missing cover images
 *
 * Run locally:  npx tsx scripts/fix-blog-content.ts
 * On prod:      scp to /tmp, docker cp into ecokon-web, docker exec ... npx tsx ...
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FIXES: { slug: string; category?: string; coverImage?: string }[] = [
  {
    slug: "vertikalnoe-ozelenenie-v-kvartire",
    category: "tsvetologiya",
    coverImage: "/images/tsvetologiya/fitomodul-50-4-white_0.jpg",
  },
  {
    slug: "kak-pravilno-uhazhivat-za-komnatnymi-rasteniyami",
    category: "uhod",
    coverImage: "/images/ecokon/bio-chay-dekorativno-listvennye_0.jpg",
  },
  {
    slug: "kak-vybrat-grunt-dlya-rassady",
    category: "grunty",
  },
];

async function main() {
  for (const fix of FIXES) {
    const data: Record<string, string> = {};
    if (fix.category) data.category = fix.category;
    if (fix.coverImage) data.coverImage = fix.coverImage;
    const res = await prisma.blogPost.updateMany({ where: { slug: fix.slug }, data });
    console.log(`${fix.slug}: ${res.count} updated`, data);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
