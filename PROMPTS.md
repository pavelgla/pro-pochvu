# Ecokon.ru — Последовательные промпты для Claude Code CLI

**Проект:** D2C интернет-магазин КФХ «Ранчо Мушкино»
**Рабочая папка:** `~/Obsidian/ecokon.ru/ecokon`
**Запуск:** `./run-prompts.sh` или `./run-prompts.sh 3` (начать с промпта 3)

После каждого промпта: `npm run build` внутри промпта → git commit → следующий.

---

## ПРОМПТ 1: Seed — загрузка товаров в БД

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — D2C интернет-магазин на Next.js 14 + Prisma + PostgreSQL.

Задача: улучшить файл prisma/seed.ts — добавить все 13 реальных товаров с данными из маркетплейсов.

Текущий seed содержит ProductLine и Category, но товары (Product) отсутствуют или неполные. Добавь upsert для всех 13 SKU:

**ЭКО Конь — Био-чай (productLineId: "a1000000-0000-0000-0000-000000000001", categoryId: "b1000000-0000-0000-0000-000000000001"):**

1. slug: "bio-chay-yantar-fosfor", name: "Удобрение ЭКО КОНЬ Био-чай с янтарём и фосфором", price: 626, oldPrice: 1100, rating: 4.9, reviewsCount: 9762, badge: "bestseller"
   images: ["/images/ecokon/bio-chay-yantar-fosfor_0.jpg","/images/ecokon/bio-chay-yantar-fosfor_1.jpg","/images/ecokon/bio-chay-yantar-fosfor_2.jpg","/images/ecokon/bio-chay-yantar-fosfor_3.jpg","/images/ecokon/bio-chay-yantar-fosfor_4.jpg"]
   shortDesc: "Органическое удобрение в стиках для всех видов растений. Янтарная кислота + фосфор для пышного цветения и крепкой корневой системы."
   weightGrams: 80, stock: 500

2. slug: "bio-chay-dekorativno-listvennye", name: "Удобрение ЭКО КОНЬ Био-чай для декоративно-лиственных", price: 609, oldPrice: 1100, rating: 4.9, reviewsCount: 6287, badge: "bestseller"
   images: ["/images/ecokon/bio-chay-dekorativno-listvennye_0.jpg"]
   shortDesc: "Специальный органический состав для декоративно-лиственных растений. Усиливает насыщенность цвета и блеск листьев."
   weightGrams: 80, stock: 300

3. slug: "bio-chay-orhidei", name: "Удобрение ЭКО КОНЬ Био-чай для орхидей", price: 611, oldPrice: 1150, rating: 4.9, reviewsCount: 1727
   images: ["/images/ecokon/bio-chay-orhidei_0.jpg"]
   shortDesc: "Деликатная органическая подкормка для орхидей. Стимулирует цветение, укрепляет корни."
   weightGrams: 80, stock: 200

**ЭКО Конь — Специализированные (productLineId: "a1000000-0000-0000-0000-000000000002", categoryId: "b1000000-0000-0000-0000-000000000002"):**

4. slug: "udobrenie-kornevaya", name: "Удобрение ЭКО Конь для укрепления корневой системы универсальное", price: 633, oldPrice: 1200, rating: 4.9, reviewsCount: 5784, badge: "bestseller"
   images: ["/images/wb/163686285_1.webp"]
   shortDesc: "Стимулирует рост и ветвление корней. Подходит для всех видов растений, особенно после пересадки."
   weightGrams: 80, stock: 400

5. slug: "udobrenie-rassada", name: "Удобрение ЭКО Конь для рассады", price: 608, oldPrice: null, rating: 5.0, reviewsCount: 51, badge: "new"
   images: ["/images/ecokon/udobrenie-rassada_0.jpg"]
   shortDesc: "Органическое удобрение для крепкой и здоровой рассады. Ускоряет прорастание, снижает стресс при пикировке."
   weightGrams: 80, stock: 150

6. slug: "udobrenie-tsvetushchie", name: "Удобрение ЭКО Конь для цветущих растений", price: 608, oldPrice: null, rating: 4.9, reviewsCount: 61
   images: []
   shortDesc: "Специальная формула для обильного и длительного цветения. Продлевает период цветения в 1,5–2 раза."
   weightGrams: 80, stock: 120

7. slug: "udobrenie-ovoshchi", name: "Удобрение ЭКО Конь для овощей", price: 487, oldPrice: 1150, rating: 4.9, reviewsCount: 1789
   images: []
   shortDesc: "Органическое удобрение для овощных культур. Повышает урожайность, улучшает вкус и качество плодов."
   weightGrams: 80, stock: 200

8. slug: "udobrenie-tsitrusovye", name: "Удобрение ЭКО Конь для цитрусовых", price: 487, oldPrice: 1150, rating: 4.9, reviewsCount: 1621
   images: []
   shortDesc: "Специальный состав для лимонов, мандаринов, апельсинов. Предотвращает пожелтение листьев."
   weightGrams: 80, stock: 180

**Цветология — Фитомодули (productLineId: "a1000000-0000-0000-0000-000000000003", categoryId: "b1000000-0000-0000-0000-000000000003"):**

9. slug: "fitomodul-50-4-white", name: "Фитомодуль Цветология настенный 50см 4шт (белый)", price: 5339, oldPrice: null, rating: 4.9, reviewsCount: 466
   images: ["/images/tsvetologiya/fitomodul-50-4-white_0.jpg","/images/tsvetologiya/fitomodul-50-4-white_1.jpg","/images/tsvetologiya/fitomodul-50-4-white_2.jpg","/images/tsvetologiya/fitomodul-50-4-white_3.jpg","/images/tsvetologiya/fitomodul-50-4-white_4.jpg"]
   shortDesc: "Настенный модуль для вертикального озеленения. Комплект 4 секции, 50 см, цвет: белый. Гарантия 5 лет. Производство Россия."
   weightGrams: 1200, stock: 80
   characteristics: {"Цвет": "Белый", "Размер модуля": "50 см", "Количество секций": "4 шт", "Материал": "ABS-пластик", "Гарантия": "5 лет", "Производство": "Россия"}

10. slug: "fitomodul-50-4-black", name: "Фитомодуль Цветология настенный 50см 4шт (чёрный)", price: 5333, oldPrice: null, rating: 4.9, reviewsCount: 575
    images: ["/images/tsvetologiya/fitomodul-50-4-black_0.jpg"]
    shortDesc: "Настенный модуль для вертикального озеленения. Комплект 4 секции, 50 см, цвет: чёрный. Гарантия 5 лет. Производство Россия."
    weightGrams: 1200, stock: 60
    characteristics: {"Цвет": "Чёрный", "Размер модуля": "50 см", "Количество секций": "4 шт", "Материал": "ABS-пластик", "Гарантия": "5 лет", "Производство": "Россия"}

11. slug: "fitomodul-50-4-green", name: "Фитомодуль Цветология настенный 50см 4шт (зелёный)", price: 5407, oldPrice: null, rating: 4.9, reviewsCount: 179
    images: []
    shortDesc: "Настенный модуль для вертикального озеленения. Комплект 4 секции, 50 см, цвет: зелёный. Гарантия 5 лет. Производство Россия."
    weightGrams: 1200, stock: 40
    characteristics: {"Цвет": "Зелёный", "Размер модуля": "50 см", "Количество секций": "4 шт", "Материал": "ABS-пластик", "Гарантия": "5 лет", "Производство": "Россия"}

12. slug: "fitomodul-15-6", name: "Фитомодуль Цветология компактный 15см 6шт", price: 614, oldPrice: null, rating: 4.9, reviewsCount: 182
    images: []
    shortDesc: "Компактный модуль для настольного или подоконного вертикального сада. 6 секций, 15 см."
    weightGrams: 600, stock: 100
    characteristics: {"Размер модуля": "15 см", "Количество секций": "6 шт", "Материал": "ABS-пластик", "Гарантия": "5 лет", "Производство": "Россия"}

**Цветология — Аксессуары (productLineId: "a1000000-0000-0000-0000-000000000004", categoryId: "b1000000-0000-0000-0000-000000000004"):**

13. slug: "kolyshki-skoby-silikon", name: "Колышки-скобы садовые силиконовые Цветология", price: 233, oldPrice: 399, rating: 5.0, reviewsCount: 182, badge: "sale"
    images: ["/images/tsvetologiya/kolyshki-skoby-silikon_0.jpg"]
    shortDesc: "Силиконовые скобы для подвязки растений. Не травмируют стебли, многоразовые, мягкие."
    weightGrams: 50, stock: 500

Для каждого товара используй prisma.product.upsert с where: { slug } и create/update содержащими все поля.
Каждый Product нужно linked к правильному productLineId и categoryId через строковые ID выше.
После добавления всех товаров запусти: npx tsx prisma/seed.ts
Если возникнет ошибка БД (DATABASE_URL не задан) — это нормально, файл seed.ts должен просто корректно компилироваться. Проверь typescript: npx tsc --noEmit
```

---

## ПРОМПТ 2: Копирование изображений в public/

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — D2C интернет-магазин.

Задача: скопировать изображения товаров из knowledge_base в папку public/ проекта.

Источник: ~/Obsidian/ecokon.ru/КФХ/knowledge_base/images/
Назначение: public/images/ (создай структуру)

Выполни:
1. mkdir -p public/images/ecokon public/images/tsvetologiya public/images/wb
2. cp ~/Obsidian/ecokon.ru/КФХ/knowledge_base/images/ecokon/* public/images/ecokon/
3. cp ~/Obsidian/ecokon.ru/КФХ/knowledge_base/images/tsvetologiya/* public/images/tsvetologiya/
4. cp ~/Obsidian/ecokon.ru/КФХ/knowledge_base/images/wb/* public/images/wb/
5. Создай public/images/placeholder.jpg — серый прямоугольник 800x800 (используй любой способ: скопируй существующее или создай svg-заглушку как public/images/placeholder.svg с viewBox 800x800, цвет #F0F0F0, текст "Нет фото")
6. Проверь ls -la public/images/ecokon/ public/images/tsvetologiya/ public/images/wb/
7. Запусти npm run build — должно собраться без ошибок

Это важно: без изображений в public/ компонент Image в ProductGallery не найдёт файлы.
```

---

## ПРОМПТ 3: Header — навигация, поиск, корзина

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Прочитай файл src/components/Header.tsx. Скорее всего это заглушка. Сделай полноценный Header:

Требования:
- "use client" (нужен useCartStore)
- Логотип: слева "ЭКО Конь" (зелёный) + "Цветология" (серый), link → /
- Навигация (десктоп): Каталог → /catalog, Удобрения → /catalog?brand=ecokon, Фитомодули → /catalog?brand=tsvetologiya, О бренде → /about
- Иконка корзины (lucide-react ShoppingCart) с бейджем количества товаров из useCartStore → link /cart
- Иконка пользователя (User) → /account (если нет сессии → /auth/login)
- Мобильное меню (hamburger): показывает навигацию + ссылки на /auth/login и /account
- Sticky header: bg-white/95 backdrop-blur border-b
- Брендинг: используй цвета brand-green и brand-gray-dark из tailwind.config

Цвета из tailwind.config.ts:
- brand.green: #2D5016
- brand.gray.dark: #333333
- brand.gray.light: #F0F0F0

Используй import { useSession } from "next-auth/react" для состояния авторизации.
Используй import { useCartStore } from "@/store/cartStore" для количества товаров.

После реализации запусти npm run build — должно собраться без ошибок TypeScript.
```

---

## ПРОМПТ 4: Footer

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Прочитай src/components/Footer.tsx. Сделай полноценный Footer:

Структура (3 колонки + копирайт):

Колонка 1 — О компании:
- Логотип / название "ЭКО Конь + Цветология"
- Текст: "Органические удобрения и системы вертикального озеленения. КФХ «Ранчо Мушкино», Калининградская обл."
- Рейтинг: ⭐ 4.9 на Ozon • 51 000+ отзывов

Колонка 2 — Покупателям:
- Ссылки: Каталог (/catalog), Доставка и оплата (/delivery), Возврат (/returns), Контакты (/contacts)

Колонка 3 — Маркетплейсы:
- Заголовок "Мы на маркетплейсах"
- Кнопка/ссылка "Ozon — ЭКО Конь" → https://www.ozon.ru/seller/eko-kon
- Кнопка/ссылка "Ozon — Цветология" → https://www.ozon.ru/seller/tsvetologiya
- Кнопка/ссылка "Wildberries" → https://www.wildberries.ru/seller/eko-kon

Копирайт-строка:
- "© 2026 ЭКО Конь / Цветология. КФХ «Ранчо Мушкино»"
- Ссылки: Политика конфиденциальности (/privacy), Пользовательское соглашение (/terms)

Дизайн: bg-brand-gray-dark (тёмный фон), text-white/70, ссылки hover:text-white
Используй только tailwind, без внешних зависимостей.

После реализации запусти npm run build.
```

---

## ПРОМПТ 5: Главная страница — Hero и секции

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Задача: улучшить секции главной страницы (src/components/sections/).

Прочитай текущие файлы: Hero.tsx, ProductLines.tsx, Bestsellers.tsx, Benefits.tsx, Testimonials.tsx, Newsletter.tsx.

Исправь/улучши каждый:

**Hero.tsx** — уже есть базовый, улучши:
- Заменить эмодзи-заглушку на реальный Image (next/image) из /images/ecokon/bio-chay-yantar-fosfor_0.jpg
- Добавить атрибут priority на image
- Кнопки уже правильные, оставь как есть

**ProductLines.tsx** — секция с двумя брендами:
- Читает данные через fetch("/api/catalog") или статически
- Статическая версия: два блока-карточки
  - ЭКО Конь: bg-green-50, иконка 🌿, заголовок "ЭКО Конь", описание "Органические удобрения на основе конского навоза. Для комнатных, садовых и огородных растений.", кнопка "Смотреть удобрения" → /catalog?brand=ecokon
  - Цветология: bg-slate-50, иконка 🌱, заголовок "Цветология", описание "Модульные системы вертикального озеленения. Для дома, офиса, ресторана.", кнопка "Смотреть фитомодули" → /catalog?brand=tsvetologiya

**Bestsellers.tsx** — хиты продаж:
- Если это серверный компонент — оставь async и вызов getProducts
- Показывай 4 товара с badge="bestseller" или просто первые 4 по рейтингу
- Используй компонент ProductCard
- Если БД не доступна (нет DATABASE_URL) — покажи заглушку с 4 карточками ProductCard с моковыми данными

**Benefits.tsx** — 4 преимущества:
- ♻️ Органический состав — "100% натуральные компоненты без химии"
- ⭐ 4.9 на маркетплейсах — "51 000+ проверенных отзывов"
- 🚚 Доставка по России — "5Post, Boxberry, СДЭК, Почта России"
- 🔄 Лёгкий возврат — "Вернём деньги если не подойдёт"

**Testimonials.tsx** — 3 отзыва (статические, реальные с маркетплейса):
- "Наташа К.", 5★, "Пользуюсь Bio-чаем уже полгода — орхидеи просто расцвели! Заказала ещё."
- "Марина П.", 5★, "Фитомодуль белый — просто чудо! Сделала целую стену из цветов в гостиной."
- "Галина В.", 5★, "Удобрение для корневой системы — спасла любимый фикус после пересадки. Спасибо!"

**Newsletter.tsx** — форма подписки на email:
- Заголовок "Получайте советы по уходу за растениями"
- Описание "Только полезный контент: рецепты подкормок, сезонные советы, скидки для подписчиков"
- Input email + кнопка "Подписаться"
- При submit: POST /api/notifications/email (или просто alert("Спасибо за подписку!") как заглушка)
- "use client" для формы

После всех изменений запусти npm run build.
```

---

## ПРОМПТ 6: Каталог — фильтры, сортировка, сетка товаров

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Задача: убедиться что каталог полностью работает. Прочитай файлы:
- src/app/catalog/page.tsx
- src/app/catalog/CatalogContent.tsx
- src/app/catalog/[product-line]/page.tsx
- src/components/CatalogFilters.tsx
- src/components/CatalogSort.tsx
- src/components/CatalogPagination.tsx
- src/app/api/catalog/route.ts

Проверь и доработай:

**API route: /api/catalog** (route.ts):
- GET запрос, читает searchParams: brand, productLine, category, priceMin, priceMax, sort, page, limit
- Вызывает getProducts() из @/lib/catalog с этими фильтрами
- Возвращает JSON: { products, total, page, totalPages }
- Обёрнут в try/catch — при ошибке возвращает мок (4 пустые карточки) чтобы не падал без БД

**CatalogContent.tsx** (клиентский компонент):
- Читает searchParams из useSearchParams()
- Делает fetch к /api/catalog с текущими фильтрами
- Показывает: CatalogFilters слева (или сверху на мобильном), сетку ProductCard, CatalogPagination снизу
- Loading state: skeleton или Spinner
- Empty state: "Товары не найдены. Попробуйте изменить фильтры."

**CatalogFilters.tsx**:
- Бренд: чекбоксы "ЭКО Конь" (brand=ecokon) и "Цветология" (brand=tsvetologiya)
- Цена: range input от 0 до 10000
- Рейтинг: кнопки 4+, 4.5+, 5.0
- Кнопка "Сбросить фильтры"
- Обновляет URL через router.push с новыми searchParams

**CatalogSort.tsx**:
- Select с вариантами: Популярные (popularity), Дешевле (price_asc), Дороже (price_desc), По рейтингу (rating), Новинки (newest)

**CatalogPagination.tsx**:
- Кнопки ← → и номера страниц
- Активная страница выделена brand-green

После доработки запусти npm run build.
```

---

## ПРОМПТ 7: Страница товара — галерея, информация, вкладки

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Задача: убедиться что страница товара /product/[slug] полностью работает. Прочитай:
- src/app/product/[slug]/page.tsx
- src/components/ProductGallery.tsx
- src/components/ProductInfo.tsx
- src/components/ProductTabs.tsx
- src/components/ProductCharacteristics.tsx
- src/components/VariantSelector.tsx
- src/components/Reviews.tsx

Проверь и доработай:

**ProductGallery.tsx**:
- Список миниатюр (thumbnails) слева или снизу, главное изображение справа
- При клике на миниатюру — меняет главное изображение
- Если images[] пуст — показывает /images/placeholder.svg
- Использует next/image с заполнением контейнера
- Нет videoUrl-поддержки пока (просто игнорировать)

**ProductInfo.tsx** — "use client" (нужна корзина):
- Название h1, BrandLabel (brand из productLine.brand)
- Рейтинг: звёзды + число отзывов + badge если есть
- Цена: жирная текущая + зачёркнутая старая + % скидки если есть
- Кнопка "В корзину" → useCartStore.addItem
- Кнопка "В избранное" (иконка сердечко, визуально только)
- Короткое описание (shortDesc)
- Вес и наличие (stock > 0 ? "В наличии" : "Нет в наличии")

**ProductTabs.tsx** — вкладки через компонент Tabs из @/components/ui/Tabs:
- "Описание" — fullDesc (markdown или plain text)
- "Характеристики" — ProductCharacteristics (таблица из JSON characteristics)
- "Применение" — howToUse (текст)
- "Отзывы (N)" — Reviews компонент

**ProductCharacteristics.tsx**:
- Таблица из JSON-объекта characteristics
- Чередующиеся строки bg-white / bg-brand-gray-light/30

**Reviews.tsx**:
- Список отзывов из product.reviews
- Каждый: имя автора, рейтинг (звёзды), дата, текст
- Если reviews пуст — "Пока нет отзывов. Будьте первым!"

После доработки запусти npm run build.
```

---

## ПРОМПТ 8: Корзина и checkout — полный flow

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Задача: убедиться что корзина и checkout полностью работают. Прочитай:
- src/app/cart/page.tsx
- src/components/CartItem.tsx
- src/components/CartSummary.tsx
- src/components/CartRecommendations.tsx
- src/app/checkout/page.tsx
- src/components/checkout/StepIndicator.tsx
- src/components/checkout/DeliveryStep.tsx
- src/components/checkout/PersonalStep.tsx
- src/components/checkout/PaymentStep.tsx
- src/components/checkout/OrderSummary.tsx
- src/lib/constants.ts

Проверь и доработай:

**CartItem.tsx**:
- Показывает: image (next/image или заглушку), название, бренд (BrandLabel), цену, кнопки − / + количества, кнопку удалить (X)
- Использует useCartStore.updateQuantity, removeItem

**CartSummary.tsx**:
- Подытог (subtotal)
- Поле промокода: input + кнопка "Применить" → POST /api/promo/validate
- Скидка если промокод применён
- Доставка: "Рассчитывается при оформлении" (пока нет выбора)
- Итого = subtotal - discount
- Кнопка "Оформить заказ" → /checkout
- Текст "Бесплатная доставка от 3 000 ₽" (FREE_DELIVERY_THRESHOLD из constants)

**CartRecommendations.tsx**:
- Заголовок "С этим товаром берут"
- Статические 2-3 карточки ProductCard из bestellers (можно захардкодить slugи или fetch /api/catalog?sort=popularity&limit=3)

**StepIndicator.tsx**:
- 3 шага: Доставка → Контакты → Оплата
- Текущий шаг выделен brand-green, пройденные — галочка

**DeliveryStep.tsx** — наиболее сложный, убедись что:
- Есть поле выбора города (CityAutocomplete или простой input)
- Есть DeliveryOptions компонент с вариантами доставки
- Кнопка "Далее" активна только если выбран способ доставки

**PersonalStep.tsx**:
- Поля: Имя, Email, Телефон (+7 маска), Комментарий (необязательно)
- Валидация (React Hook Form + Zod)
- Кнопки "Назад" и "Далее"

**PaymentStep.tsx**:
- Список методов оплаты: Банковская карта (card), СБП (sbp), Наличными при получении (cod)
- Кнопка "Оплатить N ₽" — вызывает onSubmit(method)
- Показывает итоговую сумму

**OrderSummary.tsx** (боковая панель):
- Список товаров в заказе (из cartStore)
- Подытог, доставка (если выбрана), итого

После доработки запусти npm run build.
```

---

## ПРОМПТ 9: API — создание заказа, промокод

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Prisma.

Задача: убедиться что API routes для заказов и промокодов корректно реализованы. Прочитай:
- src/app/api/orders/create/route.ts
- src/app/api/promo/validate/route.ts
- src/app/api/payment/create/route.ts
- src/app/api/payment/webhook/route.ts
- src/lib/yookassa.ts
- src/lib/telegram.ts

**POST /api/orders/create** должен:
1. Валидировать тело запроса (items, customer_name, customer_email, customer_phone, delivery_*)
2. Создать Order в БД через prisma.order.create с OrderItems
3. Если payment_method === "card" или "sbp": создать платёж через yookassa.createPayment(), вернуть { orderId, redirectUrl }
4. Если payment_method === "cod": вернуть { orderId, redirectUrl: `/order/${orderId}?status=created` }
5. Отправить Telegram-уведомление через lib/telegram.ts (async, не ждать)
6. При ошибке БД — вернуть мок-ответ { orderId: "mock-xxx", redirectUrl: "/order/mock-xxx" }

**POST /api/promo/validate** должен:
1. Принять { code, subtotal }
2. Найти промокод в БД prisma.promoCode.findFirst({ where: { code, isActive: true }})
3. Проверить: validUntil > now, usesCount < usesLimit (если задан), subtotal >= minOrderAmount
4. Вернуть { valid: true, discount_type, discount_value, discount_amount } или { valid: false, error }
5. При ошибке БД — вернуть { valid: false, error: "Сервис временно недоступен" }

**lib/yookassa.ts** — проверь mock mode:
- Если YOOKASSA_SHOP_ID не задан → возвращает мок: { id: "mock-payment-xxx", status: "pending", confirmation: { confirmation_url: `/order/mock?status=pending` } }
- Если задан — реальный API запрос к api.yookassa.ru

**lib/telegram.ts** — отправка уведомлений:
- Функция sendOrderNotification(order) отправляет сообщение в TELEGRAM_CHAT_ID
- Если TELEGRAM_BOT_TOKEN не задан — тихо игнорирует

После проверки/доработки запусти npm run build.
```

---

## ПРОМПТ 10: Авторизация — login, signup, профиль

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + NextAuth.

Задача: убедиться что страницы авторизации и личного кабинета работают. Прочитай:
- src/app/auth/login/page.tsx
- src/app/auth/signup/page.tsx
- src/app/auth/reset-password/page.tsx
- src/app/account/page.tsx
- src/app/account/orders/page.tsx
- src/app/account/favorites/page.tsx
- src/app/account/layout.tsx
- src/app/api/auth/register/route.ts
- src/lib/auth.ts
- src/middleware.ts

**auth/login/page.tsx**:
- Форма: Email + Пароль + кнопка "Войти"
- signIn("credentials", { email, password, redirect: false }) из next-auth/react
- При успехе → router.push("/account")
- Ссылки: "Забыли пароль?" → /auth/reset-password, "Нет аккаунта? Регистрация" → /auth/signup
- React Hook Form + Zod валидация

**auth/signup/page.tsx**:
- Форма: Имя + Email + Пароль + Подтвердить пароль
- POST /api/auth/register
- При успехе → автовход через signIn + redirect /account

**account/page.tsx** — личный кабинет:
- Приветствие: "Привет, {user.name}!"
- 4 блока-ссылки: Заказы (/account/orders), Избранное (/account/favorites), Адреса, Настройки
- Кнопка "Выйти" → signOut()
- Используй useSession() из next-auth/react

**account/orders/page.tsx**:
- Fetch GET /api/user/profile (или прямо через server component + prisma)
- Список заказов: дата, номер, сумма, статус (badge цветной)
- Если пусто: "У вас пока нет заказов"

**middleware.ts** — убедись что:
- Защищены пути: /account/*, /admin/*
- Редирект на /auth/login?callbackUrl=...

После доработки запусти npm run build.
```

---

## ПРОМПТ 11: Страница заказа и SEO

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript.

Задача: страница подтверждения заказа + базовое SEO. Прочитай:
- src/app/order/[id]/page.tsx
- src/lib/structured-data.ts
- src/app/layout.tsx

**order/[id]/page.tsx**:
- Читает orderId из params.id
- Если id === "mock-xxx" или содержит "mock" — показывает моковое подтверждение
- GET /api/orders/{id} или prisma.order.findUnique
- Показывает: ✅ "Заказ оформлен!", номер заказа, сумма, email для подтверждения
- Если paymentStatus === "pending" и не cod — кнопка "Оплатить" (ссылка на redirectUrl)
- Ссылка "Вернуться в каталог" → /catalog

**SEO в layout.tsx** — добавь в metadata:
- metadataBase: new URL("https://ecokon.ru")
- Yandex verification (если нет): verification: { yandex: "placeholder" }
- robots: { index: true, follow: true }

**Создай src/app/sitemap.ts**:
- Статические страницы: /, /catalog, /catalog?brand=ecokon, /catalog?brand=tsvetologiya, /auth/login
- Динамические: /product/[slug] для всех активных товаров из getAllProductSlugs()
- Возвращай массив с url, lastModified, changeFrequency, priority

**Создай src/app/robots.ts**:
- Allow: /
- Disallow: /admin/, /api/, /account/
- Sitemap: https://ecokon.ru/sitemap.xml

**Создай public/manifest.json**:
- name: "ЭКО Конь — органические удобрения", short_name: "ЭКО Конь"
- start_url: "/", display: "standalone"
- theme_color: "#2D5016", background_color: "#ffffff"
- icons: [{ src: "/images/placeholder.svg", sizes: "192x192" }]

После всех изменений запусти npm run build — должно собраться. Исправь все TypeScript ошибки.
```

---

## ПРОМПТ 12: Финальная проверка сборки и деплой

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14.

Задача: финальная проверка перед деплоем.

1. Запусти npm run build — должно собраться без ошибок. Если есть ошибки — исправь их.

2. Проверь что нет забытых TODO/FIXME связанных с критическим функционалом:
   grep -r "TODO\|FIXME\|placeholder\|заглушка" src/ --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v ".next"

3. Проверь что все импорты разрешены:
   npx tsc --noEmit

4. Проверь package.json — должны быть все зависимости:
   - next, react, react-dom
   - @prisma/client, prisma
   - next-auth
   - zustand
   - react-hook-form, @hookform/resolvers, zod
   - lucide-react
   - bcryptjs, @types/bcryptjs
   Если чего-то нет — npm install <package>

5. Убедись что .env.example существует с правильными ключами:
   DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY,
   APISHIP_API_KEY, APISHIP_FROM_CITY_ID, APISHIP_PLATFORM_ID,
   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, BREVO_API_KEY, BREVO_SENDER_EMAIL,
   NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_YMAPS_API_KEY, NEXT_PUBLIC_METRIKA_ID, NEXT_PUBLIC_VK_PIXEL_ID
   Если нет — создай src/app/.env.example

6. Выведи итоговый отчёт: список страниц в билде, размер bundle, что готово, что нужно настроить перед production.
```

---

## Порядок запуска

```bash
cd ~/Obsidian/ecokon.ru/ecokon

# Инициализировать git если нет
git init && git add -A && git commit -m "Initial state before MVP Phase 1"

# Запустить все промпты автоматически:
./run-prompts.sh

# Или начать с конкретного:
./run-prompts.sh 3
```
