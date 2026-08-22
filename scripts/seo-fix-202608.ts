/**
 * SEO-фикс 22.08.2026 — CTR блоговых лидеров.
 *
 * Замер: Яндекс 1724 показа / 54 клика за 28 дней (CTR 3.1%), средняя позиция 8.6;
 * Google ~200 показов/сутки, позиция 7–11. Показы есть, кликов нет — низ первой
 * страницы, где решает совпадение заголовка с запросом.
 *
 * Правим только те статьи, где title не содержит формулировку, которой реально
 * ищут (данные: Я.Вебмастер popular queries + GSC page+query).
 *
 * Запуск:  npx tsx scripts/seo-fix-202608.ts
 * Идемпотентен: content-правка применяется, только если якорного текста ещё нет.
 */
import { prisma } from "../src/lib/prisma";

type MetaFix = {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  /** почему меняем — для истории, в БД не пишется */
  why: string;
};

const META_FIXES: MetaFix[] = [
  {
    slug: "krestovnik-rowli-uhod",
    seoTitle: "Крестовник Роули: уход в домашних условиях — полив, горшок, пересадка",
    seoDescription:
      "Уход за крестовником Роули (нитка жемчуга) в домашних условиях: сколько нужно света, как поливать, чтобы бусины не лопались, какой горшок подобрать и как пересадить, не оборвав нити.",
    why: "293 показа в Яндексе, поз. 8.1. Три из топ-запросов — «...уход и содержание в домашних условиях», в title этой формулировки не было.",
  },
  {
    slug: "razmnozhenie-hoyi-cherenkom-ili-listom",
    seoTitle: "Как укоренить хойю: черенком или листом — пошагово",
    seoDescription:
      "Как укоренить хойю в домашних условиях: почему лист даёт корни, но не даёт побега, какой черенок брать, в каком субстрате и за сколько недель появляются корни. Без теплички.",
    why: "~60 показов, 0 кликов. Запросы идут через глагол «укоренить» («как укоренить хойю», «как укоренять хойю», «как укоренить срез хойи»), в title было только «размножение».",
  },
  {
    slug: "spatifillum-opustil-listya",
    seoTitle: "Спатифиллум опустил листья: как за 5 минут понять причину",
    seoDescription:
      "Почему у спатифиллума опускаются листья: пересушка, перелив и гниль корней, тесный горшок, холод, солнце. Диагностика по шагам и что делать в каждом случае.",
    why: "125 показов, поз. 6.7, CTR 1.6%. Заголовок совпадал с запросом, но ничем не отличался от соседей в выдаче — добавлен конкретный обещанный результат.",
  },
  {
    slug: "monstera-uhod-vidy",
    seoTitle: "Монстера борзига и деликатесная: отличия и уход дома",
    seoDescription:
      "Чем монстера борзига отличается от деликатесной и как отличить их в магазине. Уход дома: свет, полив, грунт, воздушные корни, почему листья без резных отверстий.",
    why: "46 показов, поз. 7.8. Запрос — про разницу сортов, а title начинался с общего «Монстера: уход дома».",
  },
  {
    slug: "bio-chay-ekokon-obzor",
    seoTitle: "Био-чай ЭКО Конь: инструкция по применению и обзор линейки",
    seoDescription:
      "Как применять Био-чай ЭКО Конь: как заваривать стик, сколько раз подкармливать, на сколько хватает упаковки. Состав и NPK каждого вида линейки и когда подкормку лучше отложить.",
    why: "153 показа, поз. 5.7 — лучшая коммерческая страница. Топ-запрос «эко конь био чай инструкция по применению», в title было «как заваривать».",
  },
  {
    slug: "rasteniya-dlya-fitosteny-v-kvartire",
    seoTitle: "Растения для фитостены и фитомодуля в квартире: что выбрать",
    seoDescription:
      "Какие растения сажать в фитостену и фитомодуль в квартире: под яркий свет и для тени, самые простые для новичка, как сочетать в одном модуле и кого сажать не стоит.",
    why: "127 показов по двум вариантам запроса («растения для фитостены» и «растения для фитомодуля»), в title был только первый.",
  },
];

/** Врезка со ссылкой в каталог для статей, где её нет. */
const BODY_LINKS: { slug: string; after: string; insert: string }[] = [
  {
    slug: "krestovnik-rowli-uhod",
    after:
      "Про подбор разрыхлителей для лёгкого грунта — в статье [агроперлит и вермикулит в грунте](/blog/agroperlit-vermikulit-v-grunte).",
    insert:
      " Если не хочется собирать смесь самому, подойдёт готовый [органический грунт с агроперлитом](/product/grunt-ecokon-20l) — лёгкий, не слёживается и не держит лишнюю воду.",
  },
];

async function main() {
  for (const fix of META_FIXES) {
    const post = await prisma.blogPost.findUnique({ where: { slug: fix.slug } });
    if (!post) {
      console.error(`  ПРОПУСК ${fix.slug} — нет такой статьи`);
      continue;
    }
    await prisma.blogPost.update({
      where: { slug: fix.slug },
      data: { seoTitle: fix.seoTitle, seoDescription: fix.seoDescription },
    });
    console.log(`  meta  ${fix.slug}`);
  }

  for (const link of BODY_LINKS) {
    const post = await prisma.blogPost.findUnique({ where: { slug: link.slug } });
    if (!post) {
      console.error(`  ПРОПУСК ${link.slug} — нет такой статьи`);
      continue;
    }
    if (post.content.includes(link.insert.trim())) {
      console.log(`  body  ${link.slug} — ссылка уже стоит`);
      continue;
    }
    if (!post.content.includes(link.after)) {
      console.error(`  ПРОПУСК ${link.slug} — якорный абзац не найден, текст правился`);
      continue;
    }
    await prisma.blogPost.update({
      where: { slug: link.slug },
      data: { content: post.content.replace(link.after, link.after + link.insert) },
    });
    console.log(`  body  ${link.slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
