import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Product Lines (5)
  const productLines = await Promise.all([
    prisma.productLine.upsert({
      where: { slug: "bio-chay" },
      update: {},
      create: {
        id: "a1000000-0000-0000-0000-000000000001",
        slug: "bio-chay",
        name: "Био-чай",
        brand: "ecokon",
        description: "Органические удобрения в стиках для комнатных и садовых растений",
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.productLine.upsert({
      where: { slug: "specialized" },
      update: {},
      create: {
        id: "a1000000-0000-0000-0000-000000000002",
        slug: "specialized",
        name: "Специализированные удобрения",
        brand: "ecokon",
        description: "Удобрения для конкретных культур и задач",
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.productLine.upsert({
      where: { slug: "fitmoduli" },
      update: {},
      create: {
        id: "a1000000-0000-0000-0000-000000000003",
        slug: "fitmoduli",
        name: "Фитомодули",
        brand: "tsvetologiya",
        description: "Модульные системы для вертикального озеленения",
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.productLine.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        id: "a1000000-0000-0000-0000-000000000004",
        slug: "accessories",
        name: "Аксессуары",
        brand: "tsvetologiya",
        description: "Аксессуары для фитомодулей и растений",
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.productLine.upsert({
      where: { slug: "grunty" },
      update: {},
      create: {
        id: "a1000000-0000-0000-0000-000000000005",
        slug: "grunty",
        name: "Грунты",
        brand: "ecokon",
        description: "Специализированные грунты для растений (планируется)",
        sortOrder: 5,
        isActive: false,
      },
    }),
  ]);

  console.log(`Seeded ${productLines.length} product lines`);

  // Categories (8)
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "bio-chay-stiki" },
      update: {},
      create: {
        id: "b1000000-0000-0000-0000-000000000001",
        slug: "bio-chay-stiki",
        name: "Био-чай в стиках",
        productLineId: "a1000000-0000-0000-0000-000000000001",
        description: "Органические удобрения в удобных стиках",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "specialized-udobreniya" },
      update: {},
      create: {
        id: "b1000000-0000-0000-0000-000000000002",
        slug: "specialized-udobreniya",
        name: "Специализированные удобрения",
        productLineId: "a1000000-0000-0000-0000-000000000002",
        description: "Удобрения для конкретных культур",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "nastennye-fitmoduli" },
      update: {},
      create: {
        id: "b1000000-0000-0000-0000-000000000003",
        slug: "nastennye-fitmoduli",
        name: "Настенные фитомодули",
        productLineId: "a1000000-0000-0000-0000-000000000003",
        description: "Фитомодули для вертикального размещения на стене",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "napolnye-fitmoduli" },
      update: {},
      create: {
        id: "b1000000-0000-0000-0000-000000000004",
        slug: "napolnye-fitmoduli",
        name: "Напольные фитомодули",
        productLineId: "a1000000-0000-0000-0000-000000000003",
        description: "Напольные модульные системы для озеленения",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "ukryvnoy-material" },
      update: {},
      create: {
        id: "b1000000-0000-0000-0000-000000000005",
        slug: "ukryvnoy-material",
        name: "Укрывной материал",
        productLineId: "a1000000-0000-0000-0000-000000000004",
        description: "Материалы для защиты растений",
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "bio-chay-nabory" },
      update: {},
      create: {
        id: "b1000000-0000-0000-0000-000000000006",
        slug: "bio-chay-nabory",
        name: "Наборы Био-чай",
        productLineId: "a1000000-0000-0000-0000-000000000001",
        description: "Подарочные и стартовые наборы",
        sortOrder: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: "gorshki-kashpo" },
      update: {},
      create: {
        id: "b1000000-0000-0000-0000-000000000007",
        slug: "gorshki-kashpo",
        name: "Горшки и кашпо",
        productLineId: "a1000000-0000-0000-0000-000000000004",
        description: "Горшки и кашпо для растений",
        sortOrder: 7,
      },
    }),
    prisma.category.upsert({
      where: { slug: "grunty-substraty" },
      update: {},
      create: {
        id: "b1000000-0000-0000-0000-000000000008",
        slug: "grunty-substraty",
        name: "Грунты и субстраты",
        productLineId: "a1000000-0000-0000-0000-000000000005",
        description: "Готовые почвосмеси и субстраты",
        sortOrder: 8,
      },
    }),
  ]);

  console.log(`Seeded ${categories.length} categories`);

  // Products (13)
  const productsData = [
    // --- ЭКО Конь — Био-чай ---
    {
      slug: "bio-chay-yantar-fosfor",
      name: "Удобрение ЭКО КОНЬ Био-чай с янтарём и фосфором",
      price: 626,
      oldPrice: 1100,
      rating: 4.9,
      reviewsCount: 9762,
      badge: "bestseller",
      images: [
        "/images/ecokon/bio-chay-yantar-fosfor_0.jpg",
        "/images/ecokon/bio-chay-yantar-fosfor_1.jpg",
        "/images/ecokon/bio-chay-yantar-fosfor_2.jpg",
        "/images/ecokon/bio-chay-yantar-fosfor_3.jpg",
        "/images/ecokon/bio-chay-yantar-fosfor_4.jpg",
      ],
      shortDesc: "Органическое удобрение в стиках для всех видов растений. Янтарная кислота + фосфор для пышного цветения и крепкой корневой системы.",
      weightGrams: 80,
      stock: 500,
      productLineId: "a1000000-0000-0000-0000-000000000001",
      categoryId: "b1000000-0000-0000-0000-000000000001",
    },
    {
      slug: "bio-chay-dekorativno-listvennye",
      name: "Удобрение ЭКО КОНЬ Био-чай для декоративно-лиственных",
      price: 609,
      oldPrice: 1100,
      rating: 4.9,
      reviewsCount: 6287,
      badge: "bestseller",
      images: ["/images/ecokon/bio-chay-dekorativno-listvennye_0.jpg"],
      shortDesc: "Специальный органический состав для декоративно-лиственных растений. Усиливает насыщенность цвета и блеск листьев.",
      weightGrams: 80,
      stock: 300,
      productLineId: "a1000000-0000-0000-0000-000000000001",
      categoryId: "b1000000-0000-0000-0000-000000000001",
    },
    {
      slug: "bio-chay-orhidei",
      name: "Удобрение ЭКО КОНЬ Био-чай для орхидей",
      price: 611,
      oldPrice: 1150,
      rating: 4.9,
      reviewsCount: 1727,
      images: ["/images/ecokon/bio-chay-orhidei_0.jpg"],
      shortDesc: "Деликатная органическая подкормка для орхидей. Стимулирует цветение, укрепляет корни.",
      weightGrams: 80,
      stock: 200,
      productLineId: "a1000000-0000-0000-0000-000000000001",
      categoryId: "b1000000-0000-0000-0000-000000000001",
    },
    // --- ЭКО Конь — Специализированные ---
    {
      slug: "udobrenie-kornevaya",
      name: "Удобрение ЭКО Конь для укрепления корневой системы универсальное",
      price: 633,
      oldPrice: 1200,
      rating: 4.9,
      reviewsCount: 5784,
      badge: "bestseller",
      images: ["/images/wb/163686285_1.webp"],
      shortDesc: "Стимулирует рост и ветвление корней. Подходит для всех видов растений, особенно после пересадки.",
      weightGrams: 80,
      stock: 400,
      productLineId: "a1000000-0000-0000-0000-000000000002",
      categoryId: "b1000000-0000-0000-0000-000000000002",
    },
    {
      slug: "udobrenie-rassada",
      name: "Удобрение ЭКО Конь для рассады",
      price: 608,
      oldPrice: null,
      rating: 5.0,
      reviewsCount: 51,
      badge: "new",
      images: ["/images/ecokon/udobrenie-rassada_0.jpg"],
      shortDesc: "Органическое удобрение для крепкой и здоровой рассады. Ускоряет прорастание, снижает стресс при пикировке.",
      weightGrams: 80,
      stock: 150,
      productLineId: "a1000000-0000-0000-0000-000000000002",
      categoryId: "b1000000-0000-0000-0000-000000000002",
    },
    {
      slug: "udobrenie-tsvetushchie",
      name: "Удобрение ЭКО Конь для цветущих растений",
      price: 608,
      oldPrice: null,
      rating: 4.9,
      reviewsCount: 61,
      images: [],
      shortDesc: "Специальная формула для обильного и длительного цветения. Продлевает период цветения в 1,5–2 раза.",
      weightGrams: 80,
      stock: 120,
      productLineId: "a1000000-0000-0000-0000-000000000002",
      categoryId: "b1000000-0000-0000-0000-000000000002",
    },
    {
      slug: "udobrenie-ovoshchi",
      name: "Удобрение ЭКО Конь для овощей",
      price: 487,
      oldPrice: 1150,
      rating: 4.9,
      reviewsCount: 1789,
      images: [],
      shortDesc: "Органическое удобрение для овощных культур. Повышает урожайность, улучшает вкус и качество плодов.",
      weightGrams: 80,
      stock: 200,
      productLineId: "a1000000-0000-0000-0000-000000000002",
      categoryId: "b1000000-0000-0000-0000-000000000002",
    },
    {
      slug: "udobrenie-tsitrusovye",
      name: "Удобрение ЭКО Конь для цитрусовых",
      price: 487,
      oldPrice: 1150,
      rating: 4.9,
      reviewsCount: 1621,
      images: [],
      shortDesc: "Специальный состав для лимонов, мандаринов, апельсинов. Предотвращает пожелтение листьев.",
      weightGrams: 80,
      stock: 180,
      productLineId: "a1000000-0000-0000-0000-000000000002",
      categoryId: "b1000000-0000-0000-0000-000000000002",
    },
    // --- Цветология — Фитомодули ---
    {
      slug: "fitomodul-50-4-white",
      name: "Фитомодуль Цветология настенный 50см 4шт (белый)",
      price: 5339,
      oldPrice: null,
      rating: 4.9,
      reviewsCount: 466,
      images: [
        "/images/tsvetologiya/fitomodul-50-4-white_0.jpg",
        "/images/tsvetologiya/fitomodul-50-4-white_1.jpg",
        "/images/tsvetologiya/fitomodul-50-4-white_2.jpg",
        "/images/tsvetologiya/fitomodul-50-4-white_3.jpg",
        "/images/tsvetologiya/fitomodul-50-4-white_4.jpg",
      ],
      shortDesc: "Настенный модуль для вертикального озеленения. Комплект 4 секции, 50 см, цвет: белый. Гарантия 5 лет. Производство Россия.",
      weightGrams: 1200,
      stock: 80,
      characteristics: { "Цвет": "Белый", "Размер модуля": "50 см", "Количество секций": "4 шт", "Материал": "ABS-пластик", "Гарантия": "5 лет", "Производство": "Россия" },
      productLineId: "a1000000-0000-0000-0000-000000000003",
      categoryId: "b1000000-0000-0000-0000-000000000003",
    },
    {
      slug: "fitomodul-50-4-black",
      name: "Фитомодуль Цветология настенный 50см 4шт (чёрный)",
      price: 5333,
      oldPrice: null,
      rating: 4.9,
      reviewsCount: 575,
      images: ["/images/tsvetologiya/fitomodul-50-4-black_0.jpg"],
      shortDesc: "Настенный модуль для вертикального озеленения. Комплект 4 секции, 50 см, цвет: чёрный. Гарантия 5 лет. Производство Россия.",
      weightGrams: 1200,
      stock: 60,
      characteristics: { "Цвет": "Чёрный", "Размер модуля": "50 см", "Количество секций": "4 шт", "Материал": "ABS-пластик", "Гарантия": "5 лет", "Производство": "Россия" },
      productLineId: "a1000000-0000-0000-0000-000000000003",
      categoryId: "b1000000-0000-0000-0000-000000000003",
    },
    {
      slug: "fitomodul-50-4-green",
      name: "Фитомодуль Цветология настенный 50см 4шт (зелёный)",
      price: 5407,
      oldPrice: null,
      rating: 4.9,
      reviewsCount: 179,
      images: [],
      shortDesc: "Настенный модуль для вертикального озеленения. Комплект 4 секции, 50 см, цвет: зелёный. Гарантия 5 лет. Производство Россия.",
      weightGrams: 1200,
      stock: 40,
      characteristics: { "Цвет": "Зелёный", "Размер модуля": "50 см", "Количество секций": "4 шт", "Материал": "ABS-пластик", "Гарантия": "5 лет", "Производство": "Россия" },
      productLineId: "a1000000-0000-0000-0000-000000000003",
      categoryId: "b1000000-0000-0000-0000-000000000003",
    },
    {
      slug: "fitomodul-15-6",
      name: "Фитомодуль Цветология компактный 15см 6шт",
      price: 614,
      oldPrice: null,
      rating: 4.9,
      reviewsCount: 182,
      images: [],
      shortDesc: "Компактный модуль для настольного или подоконного вертикального сада. 6 секций, 15 см.",
      weightGrams: 600,
      stock: 100,
      characteristics: { "Размер модуля": "15 см", "Количество секций": "6 шт", "Материал": "ABS-пластик", "Гарантия": "5 лет", "Производство": "Россия" },
      productLineId: "a1000000-0000-0000-0000-000000000003",
      categoryId: "b1000000-0000-0000-0000-000000000003",
    },
    // --- Цветология — Аксессуары ---
    {
      slug: "kolyshki-skoby-silikon",
      name: "Колышки-скобы садовые силиконовые Цветология",
      price: 233,
      oldPrice: 399,
      rating: 5.0,
      reviewsCount: 182,
      badge: "sale",
      images: ["/images/tsvetologiya/kolyshki-skoby-silikon_0.jpg"],
      shortDesc: "Силиконовые скобы для подвязки растений. Не травмируют стебли, многоразовые, мягкие.",
      weightGrams: 50,
      stock: 500,
      productLineId: "a1000000-0000-0000-0000-000000000004",
      categoryId: "b1000000-0000-0000-0000-000000000004",
    },
  ];

  for (const p of productsData) {
    const { slug, ...fields } = p;
    await prisma.product.upsert({
      where: { slug },
      update: fields,
      create: p,
    });
  }

  console.log(`Seeded ${productsData.length} products`);

  // Promo code
  await prisma.promoCode.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      discountType: "percent",
      discountValue: 10,
      minOrderAmount: 500,
      validFrom: new Date("2024-01-01"),
      isActive: true,
    },
  });

  console.log("Seeded promo code WELCOME10");

  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@ecokon.ru" },
    update: {},
    create: {
      email: "admin@ecokon.ru",
      name: "Администратор",
      passwordHash,
      role: "admin",
      referralCode: "ADMIN001",
    },
  });

  console.log("Seeded admin user (admin@ecokon.ru / admin123)");

  // Blog posts
  await prisma.blogPost.upsert({
    where: { slug: "kak-pravilno-uhazhivat-za-komnatnymi-rasteniyami" },
    update: {},
    create: {
      slug: "kak-pravilno-uhazhivat-za-komnatnymi-rasteniyami",
      title: "Как правильно ухаживать за комнатными растениями",
      content: "Комнатные растения — это не только украшение интерьера, но и источник чистого воздуха. В этой статье мы расскажем об основных правилах ухода: полив, освещение, подкормка и пересадка. Используйте органические удобрения Био-чай для здорового роста ваших зелёных питомцев.",
      excerpt: "Основные правила ухода за комнатными растениями: полив, освещение, подкормка.",
      category: "уход",
      tags: ["комнатные растения", "уход", "полив", "удобрения"],
      isPublished: true,
      publishedAt: new Date("2024-06-15"),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "vertikalnoe-ozelenenie-v-kvartire" },
    update: {},
    create: {
      slug: "vertikalnoe-ozelenenie-v-kvartire",
      title: "Вертикальное озеленение в квартире: полное руководство",
      content: "Вертикальное озеленение — тренд, который набирает популярность. Фитомодули Цветология позволяют создать зелёную стену даже в маленькой квартире. Рассказываем, как выбрать модуль, какие растения подойдут и как за ними ухаживать.",
      excerpt: "Как создать зелёную стену дома с помощью фитомодулей.",
      category: "озеленение",
      tags: ["фитомодули", "вертикальное озеленение", "интерьер"],
      isPublished: true,
      publishedAt: new Date("2024-07-20"),
    },
  });

  console.log("Seeded 2 blog posts");

  // Knowledge base
  await prisma.knowledgeBase.upsert({
    where: { slug: "kak-ispolzovat-bio-chay" },
    update: {},
    create: {
      slug: "kak-ispolzovat-bio-chay",
      title: "Как использовать Био-чай",
      content: "Залейте 1 стик 1 литром тёплой воды (30-40°C). Размешайте и дайте настояться 10-15 минут. Полейте растение полученным раствором. Повторяйте 1-2 раза в месяц в период активного роста.",
      type: "guide",
      productIds: ["c1000000-0000-0000-0000-000000000001"],
      category: "инструкции",
      sortOrder: 1,
      isPublished: true,
    },
  });

  await prisma.knowledgeBase.upsert({
    where: { slug: "ustanovka-fitomodulya" },
    update: {},
    create: {
      slug: "ustanovka-fitomodulya",
      title: "Установка фитомодуля",
      content: "Выберите место с достаточным освещением. Закрепите модуль на стене с помощью крепежа из комплекта. Заполните карманы грунтом и посадите растения. Регулярно поливайте через верхние карманы.",
      type: "guide",
      productIds: ["c1000000-0000-0000-0000-000000000009"],
      category: "инструкции",
      sortOrder: 2,
      isPublished: true,
    },
  });

  console.log("Seeded 2 knowledge base articles");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
