/**
 * Обновляет обложки блога на тематические стоковые фото (Pexels, self-hosted в /images/blog/).
 * Идемпотентно. Запуск: npx tsx scripts/update-blog-covers.ts
 * Источники см. docs/IMAGE_CREDITS.md.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COVERS: Record<string, string> = {
  "chem-podkormit-komnatnye-cvety": "/images/blog/houseplants-window.jpg",
  "yantarnaya-kislota-dlya-rasteniy": "/images/blog/watering-houseplants.jpg",
  "kak-pravilno-uhazhivat-za-komnatnymi-rasteniyami": "/images/blog/plant-care-table.jpg",
  "podkormka-rassady-tomatov-pertsa": "/images/blog/seedlings-pots.jpg",
  "pochemu-rassada-vytyagivaetsya": "/images/blog/seedlings-cups.jpg",
  "kak-vybrat-grunt-dlya-rassady": "/images/blog/seedling-greenhouse.jpg",
  "biogumus-dlya-rassady": "/images/blog/seedlings-rows.jpg",
  "grunt-dlya-rassady-svoimi-rukami": "/images/blog/soil-into-pot.jpg",
  "agroperlit-vermikulit-v-grunte": "/images/blog/soil-planting.jpg",
  "konskiy-navoz-kak-udobrenie": "/images/blog/compost-hands.jpg",
  "chem-podkormit-fialki": "/images/blog/african-violet.jpg",
  "grunt-dlya-orhidey": "/images/blog/white-orchids.jpg",
  "udobrenie-dlya-orhidey": "/images/blog/phalaenopsis.jpg",
  "vertikalnoe-ozelenenie-ofisa": "/images/blog/vertical-garden-lush.jpg",
  "rasteniya-dlya-fitosteny-v-kvartire": "/images/blog/green-wall-pots.jpg",
  "fitomodul-svoimi-rukami-vs-gotovyy": "/images/blog/plants-brick-wall.jpg",
  "uhod-za-fitostenoy": "/images/blog/green-wall-black-pots.jpg",
  "vertikalnyy-sad-v-kvartire": "/images/blog/indoor-plants-orangery.jpg",
  "vertikalnoe-ozelenenie-v-kvartire": "/images/blog/green-wall-containers.jpg",
};

async function main() {
  for (const [slug, coverImage] of Object.entries(COVERS)) {
    const res = await prisma.blogPost.updateMany({ where: { slug }, data: { coverImage } });
    console.log(`${slug}: ${res.count}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
