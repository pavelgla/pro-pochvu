import { PrismaClient } from "@prisma/client";
import * as fs from "fs/promises";
import * as path from "path";

const prisma = new PrismaClient();

// WB nmId → product slug
const WB_PRODUCTS: Record<string, string> = {
  "138576640": "bio-chay-yantar-fosfor",
  "138576638": "bio-chay-dekorativno-listvennye",
  "138576639": "udobrenie-ovoshchi",
  "163686285": "udobrenie-kornevaya",
  "177867849": "bio-chay-orhidei",
  "262136598": "udobrenie-tsitrusovye",
  "820054512": "udobrenie-rassada",
  "819695619": "udobrenie-tsvetushchie",
};

// WB CDN basket calculation (vol = nmId / 100000)
function getBasket(vol: number): number {
  // Verified thresholds (basket 16 = vol ≤ 2621, confirmed probe nmId=262136598)
  const thresholds = [
    143, 287, 431, 575, 719, 863, 1007, 1061, 1115, 1169,
    1313, 1601, 1655, 1919, 2045, 2621, 2837, 3053, 3269, 3485,
  ];
  for (let i = 0; i < thresholds.length; i++) {
    if (vol <= thresholds[i]) return i + 1;
  }
  // After basket 20: probe-based fallback (WB extends CDN dynamically)
  return 20 + Math.ceil((vol - 3269) / 216);
}

function getWbImageUrl(nmId: number, index: number): string {
  const vol = Math.floor(nmId / 100000);
  const part = Math.floor(nmId / 1000);
  const basket = getBasket(vol);
  const bStr = String(basket).padStart(2, "0");
  return `https://basket-${bStr}.wbbasket.ru/vol${vol}/part${part}/${nmId}/images/big/${index}.webp`;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://www.wildberries.ru/",
      },
    });
    if (!res.ok) return false;
    const buf = await res.arrayBuffer();
    await fs.writeFile(dest, Buffer.from(buf));
    return true;
  } catch {
    return false;
  }
}

async function downloadProductImages(nmId: string, slug: string): Promise<string[]> {
  const outDir = path.resolve("public/images/wb");
  await fs.mkdir(outDir, { recursive: true });

  const downloaded: string[] = [];
  const nmIdNum = parseInt(nmId);

  for (let i = 1; i <= 8; i++) {
    const url = getWbImageUrl(nmIdNum, i);
    const filename = `${nmId}_${i}.webp`;
    const dest = path.join(outDir, filename);

    // Skip if already downloaded
    try {
      await fs.access(dest);
      downloaded.push(`/images/wb/${filename}`);
      console.log(`  [SKIP] ${filename} уже есть`);
      continue;
    } catch {}

    const ok = await downloadImage(url, dest);
    if (ok) {
      downloaded.push(`/images/wb/${filename}`);
      console.log(`  [OK] ${filename}`);
      await sleep(300);
    } else {
      console.log(`  [STOP] ${i > 1 ? `у товара ${i - 1} фото` : "нет фото на WB CDN"} (basket=${getBasket(Math.floor(nmIdNum / 100000))})`);
      break;
    }
  }

  return downloaded;
}

async function main() {
  console.log(`[WB-IMAGES] Старт: ${new Date().toISOString()}`);

  for (const [nmId, slug] of Object.entries(WB_PRODUCTS)) {
    console.log(`\n[WB-IMAGES] ${slug} (nmId=${nmId})`);

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      console.warn(`  [SKIP] Товар не найден: ${slug}`);
      continue;
    }

    const wbImages = await downloadProductImages(nmId, slug);
    if (wbImages.length === 0) {
      console.log(`  Фото не скачаны`);
      continue;
    }

    // Merge: keep existing non-WB images first, then add WB images
    const existing = (product.images as string[]) ?? [];
    const existingNonWb = existing.filter((img) => !img.includes("/images/wb/"));
    const existingWb = existing.filter((img) => img.includes("/images/wb/"));
    const newWb = wbImages.filter((img) => !existingWb.includes(img));
    const merged = [...existingNonWb, ...existingWb, ...newWb];

    if (newWb.length > 0) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: merged },
      });
      console.log(`  Добавлено ${newWb.length} новых WB фото, итого: ${merged.length}`);
    } else {
      console.log(`  Все фото уже были в БД (${merged.length} итого)`);
    }

    await sleep(800);
  }

  console.log(`\n[WB-IMAGES] Готово: ${new Date().toISOString()}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("[WB-IMAGES] Ошибка:", err);
  await prisma.$disconnect();
  process.exit(1);
});
