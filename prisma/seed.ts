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
    {
      id: "c1000000-0000-0000-0000-000000000001",
      slug: "bio-chay-universalnyj-s-yantaryom",
      name: "Био-чай Универсальный с янтарём",
      shortDesc: "Органическое удобрение с янтарной кислотой для всех типов растений. Стимулирует рост, укрепляет иммунитет, улучшает цветение.",
      price: 626,
      productLineId: "a1000000-0000-0000-0000-000000000001",
      categoryId: "b1000000-0000-0000-0000-000000000001",
      weightGrams: 300,
      characteristics: { weight: "300 г", composition: "конский компост, янтарная кислота, гуминовые кислоты", purpose: "все типы растений", form: "стик", quantity_in_pack: "10 стиков" },
      badge: "bestseller",
      rating: 4.9,
      reviewsCount: 9762,
      stock: 100,
    },
    {
      id: "c1000000-0000-0000-0000-000000000002",
      slug: "bio-chay-dlya-dekorativno-listvennyh",
      name: "Био-чай Для декоративно-лиственных",
      shortDesc: "Специальная формула для фикусов, монстер, пальм и других декоративно-лиственных. Усиливает яркость листвы.",
      price: 609,
      productLineId: "a1000000-0000-0000-0000-000000000001",
      categoryId: "b1000000-0000-0000-0000-000000000001",
      weightGrams: 300,
      characteristics: { weight: "300 г", composition: "конский компост, микроэлементы, азот", purpose: "декоративно-лиственные растения", form: "стик", quantity_in_pack: "10 стиков" },
      badge: "bestseller",
      rating: 4.9,
      reviewsCount: 6287,
      stock: 100,
    },
    {
      id: "c1000000-0000-0000-0000-000000000003",
      slug: "bio-chay-dlya-orhidej",
      name: "Био-чай Для орхидей",
      shortDesc: "Мягкая формула для орхидей и эпифитов. Поддерживает длительное цветение без риска передозировки.",
      price: 611,
      productLineId: "a1000000-0000-0000-0000-000000000001",
      categoryId: "b1000000-0000-0000-0000-000000000001",
      weightGrams: 300,
      characteristics: { weight: "300 г", composition: "конский компост, калий, фосфор", purpose: "орхидеи и эпифиты", form: "стик", quantity_in_pack: "10 стиков" },
      rating: 4.9,
      reviewsCount: 1727,
      stock: 100,
    },
    {
      id: "c1000000-0000-0000-0000-000000000004",
      slug: "bio-chay-dlya-rassady",
      name: "Био-чай Для рассады",
      shortDesc: "Безопасное удобрение для рассады и молодых растений. Укрепляет корневую систему на ранних стадиях роста.",
      price: 608,
      productLineId: "a1000000-0000-0000-0000-000000000001",
      categoryId: "b1000000-0000-0000-0000-000000000001",
      weightGrams: 300,
      characteristics: { weight: "300 г", composition: "конский компост, гуматы, микроэлементы", purpose: "рассада и молодые растения", form: "стик", quantity_in_pack: "10 стиков" },
      rating: 5.0,
      reviewsCount: 51,
      stock: 100,
    },
    {
      id: "c1000000-0000-0000-0000-000000000005",
      slug: "bio-chay-dlya-tsvetushchih",
      name: "Био-чай Для цветущих",
      shortDesc: "Формула с повышенным содержанием фосфора и калия для обильного и продолжительного цветения.",
      price: 608,
      productLineId: "a1000000-0000-0000-0000-000000000001",
      categoryId: "b1000000-0000-0000-0000-000000000001",
      weightGrams: 300,
      characteristics: { weight: "300 г", composition: "конский компост, фосфор, калий", purpose: "цветущие растения", form: "стик", quantity_in_pack: "10 стиков" },
      rating: 4.9,
      reviewsCount: 61,
      stock: 100,
    },
    {
      id: "c1000000-0000-0000-0000-000000000006",
      slug: "dlya-ukrepleniya-kornevoj-sistemy",
      name: "Для укрепления корневой системы",
      shortDesc: "Стимулятор корнеобразования на основе конского компоста. Идеален при пересадке и для ослабленных растений.",
      price: 633,
      productLineId: "a1000000-0000-0000-0000-000000000002",
      categoryId: "b1000000-0000-0000-0000-000000000002",
      weightGrams: 300,
      characteristics: { weight: "300 г", composition: "конский компост, фосфор, микориза", purpose: "укрепление корней", form: "стик", quantity_in_pack: "10 стиков" },
      badge: "bestseller",
      rating: 4.9,
      reviewsCount: 5784,
      stock: 100,
    },
    {
      id: "c1000000-0000-0000-0000-000000000007",
      slug: "dlya-ovoshchej",
      name: "Для овощей",
      shortDesc: "Органическое удобрение для томатов, огурцов, перцев и других овощных культур. Безопасно для урожая.",
      price: 487,
      productLineId: "a1000000-0000-0000-0000-000000000002",
      categoryId: "b1000000-0000-0000-0000-000000000002",
      weightGrams: 300,
      characteristics: { weight: "300 г", composition: "конский компост, азот, калий, микроэлементы", purpose: "овощные культуры", form: "стик", quantity_in_pack: "10 стиков" },
      rating: 4.9,
      reviewsCount: 1789,
      stock: 100,
    },
    {
      id: "c1000000-0000-0000-0000-000000000008",
      slug: "dlya-tsitrusovyh",
      name: "Для цитрусовых",
      shortDesc: "Специальная формула для лимонов, мандаринов и других цитрусовых. Поддерживает плодоношение в домашних условиях.",
      price: 487,
      productLineId: "a1000000-0000-0000-0000-000000000002",
      categoryId: "b1000000-0000-0000-0000-000000000002",
      weightGrams: 300,
      characteristics: { weight: "300 г", composition: "конский компост, железо, магний, цинк", purpose: "цитрусовые растения", form: "стик", quantity_in_pack: "10 стиков" },
      rating: 4.9,
      reviewsCount: 1621,
      stock: 100,
    },
    {
      id: "c1000000-0000-0000-0000-000000000009",
      slug: "fitomodul-nastennyj-3-karmana-antratsit",
      name: "Фитомодуль настенный 3 кармана (антрацит)",
      shortDesc: "Модуль вертикального озеленения на 3 кармана цвета антрацит. Подходит для дома и офиса, простой монтаж.",
      price: 2748,
      productLineId: "a1000000-0000-0000-0000-000000000003",
      categoryId: "b1000000-0000-0000-0000-000000000003",
      weightGrams: 800,
      characteristics: { weight: "800 г", material: "переработанный пластик", pockets: 3, color: "антрацит", dimensions: "60×20×15 см", mounting: "настенный" },
      rating: 4.8,
      reviewsCount: 4899,
      stock: 100,
    },
    {
      id: "c1000000-0000-0000-0000-000000000010",
      slug: "fitomodul-nastennyj-3-karmana-zelenyj",
      name: "Фитомодуль настенный 3 кармана (зелёный)",
      shortDesc: "Модуль вертикального озеленения на 3 кармана зелёного цвета. Идеально вписывается в интерьер с растениями.",
      price: 2748,
      productLineId: "a1000000-0000-0000-0000-000000000003",
      categoryId: "b1000000-0000-0000-0000-000000000003",
      weightGrams: 800,
      characteristics: { weight: "800 г", material: "переработанный пластик", pockets: 3, color: "зелёный", dimensions: "60×20×15 см", mounting: "настенный" },
      rating: 4.7,
      reviewsCount: 500,
      stock: 100,
    },
    {
      id: "c1000000-0000-0000-0000-000000000011",
      slug: "fitomodul-nastennyj-6-karmanov",
      name: "Фитомодуль настенный 6 карманов",
      shortDesc: "Большой модуль вертикального озеленения на 6 карманов. Создаёт эффектную зелёную стену в любом помещении.",
      price: 4200,
      productLineId: "a1000000-0000-0000-0000-000000000003",
      categoryId: "b1000000-0000-0000-0000-000000000003",
      weightGrams: 1500,
      characteristics: { weight: "1500 г", material: "переработанный пластик", pockets: 6, color: "антрацит", dimensions: "120×20×15 см", mounting: "настенный" },
      rating: 4.6,
      reviewsCount: 200,
      stock: 100,
    },
    {
      id: "c1000000-0000-0000-0000-000000000012",
      slug: "fitomodul-napolnyj",
      name: "Фитомодуль напольный",
      shortDesc: "Напольная система вертикального озеленения. Мобильная конструкция, не требует сверления стен.",
      price: 4800,
      productLineId: "a1000000-0000-0000-0000-000000000003",
      categoryId: "b1000000-0000-0000-0000-000000000004",
      weightGrams: 2500,
      characteristics: { weight: "2500 г", material: "переработанный пластик, металл", pockets: 8, color: "антрацит", dimensions: "40×40×150 см", mounting: "напольный" },
      rating: 4.5,
      reviewsCount: 100,
      stock: 100,
    },
    {
      id: "c1000000-0000-0000-0000-000000000013",
      slug: "ukryvnoj-material",
      name: "Укрывной материал",
      shortDesc: "Нетканый материал для защиты растений от заморозков и вредителей. Пропускает воду и воздух.",
      price: 159,
      productLineId: "a1000000-0000-0000-0000-000000000004",
      categoryId: "b1000000-0000-0000-0000-000000000005",
      weightGrams: 200,
      characteristics: { weight: "200 г", material: "спанбонд", density: "30 г/м²", dimensions: "3.2×10 м", purpose: "защита от заморозков и вредителей" },
      rating: 4.7,
      reviewsCount: 300,
      stock: 100,
    },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
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
