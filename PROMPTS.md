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

---

## ПРОМПТ 13: Страница «Доставка и оплата»

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Создай или перепиши файл src/app/delivery/page.tsx — полноценная страница «Доставка и оплата».

Структура страницы:

**Metadata:**
title: "Доставка и оплата | ЭКО Конь"
description: "Доставка по всей России: СДЭК, Boxberry, 5Post, Почта России. Оплата картой, СБП, наличными."
alternates.canonical: "https://ecokon.ru/delivery"

**Секция 1 — Способы доставки** (4 карточки в сетке 2×2):
- СДЭК: иконка 📦, "Доставка в ПВЗ или курьером", "1–7 дней", "от 99 ₽"
- Boxberry: иконка 📮, "Более 9 000 пунктов выдачи", "2–7 дней", "от 99 ₽"
- 5Post: иконка 🏪, "Пункты выдачи в магазинах", "2–5 дней", "от 99 ₽"
- Почта России: иконка ✉️, "Доставка в любой регион РФ", "3–14 дней", "от 99 ₽"

**Бесплатная доставка:**
- Зелёный баннер: "🎁 Бесплатная доставка при заказе от 3 000 ₽ (любой способ)"

**Секция 2 — Способы оплаты** (3 варианта):
- Банковская карта (Visa, MasterCard, МИР): "Безопасная оплата через ЮKassa. Данные карты не хранятся на нашем сайте."
- СБП (Система быстрых платежей): "Оплата по QR-коду через приложение банка. Без комиссии."
- Наличными при получении: "Только для пунктов выдачи, где поддерживается. Уточняйте у оператора."

**Секция 3 — Сроки и условия:**
- Обработка заказа: 1 рабочий день
- Отгрузка: на следующий рабочий день после оплаты
- Доставка в Москву/СПб: 1–3 дня, в регионы: 3–10 дней
- Трекинг: номер отслеживания отправляем на email

**Секция 4 — Частые вопросы (FAQ)** (accordion или просто блоки):
- Q: "Можно ли изменить адрес доставки после оформления?"
  A: "Свяжитесь с нами через Telegram до момента отгрузки заказа."
- Q: "Что если товар пришёл повреждённым?"
  A: "Сфотографируйте упаковку и товар, напишите нам — заменим или вернём деньги."
- Q: "Доставляете ли в страны СНГ?"
  A: "Пока только по России. Следите за обновлениями."

В конце страницы: кнопка "Перейти в каталог" → /catalog

Дизайн: используй bg-white, card-блоки с rounded-2xl shadow-sm, brand-green для акцентов.
Никаких внешних библиотек — только tailwind + lucide-react для иконок.

После создания запусти npm run build.
```

---

## ПРОМПТ 14: Страница «Возврат товара»

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Создай или перепиши src/app/returns/page.tsx — НЕТ, правильный путь: нужно создать src/app/returns/ папку и page.tsx.

Подожди — проверь существует ли src/app/returns/, если нет — создай.

Metadata:
title: "Возврат товара | ЭКО Конь"
description: "Условия возврата товара. 14 дней на возврат. Возвращаем деньги в течение 10 дней."
alternates.canonical: "https://ecokon.ru/returns"

**Структура страницы:**

**Блок 1 — Главное (зелёный баннер):**
"✅ 14 дней на возврат без вопросов"
Подтекст: "Если товар не подошёл — вернём полную стоимость. Это наша гарантия."

**Блок 2 — Условия возврата:**
Можно вернуть:
- Товар в оригинальной упаковке, не вскрытый
- Товар с браком или повреждением при доставке (в любом состоянии)
- Товар, не соответствующий описанию

Нельзя вернуть:
- Вскрытые удобрения (по санитарным нормам)
- Товары с явными следами использования

**Блок 3 — Как оформить возврат (3 шага):**
1. 📩 Напишите нам — Telegram: t.me/+7cAd9gatgP44MDcy или на email через форму на странице /contacts
2. 📸 Пришлите фото товара и упаковки (для брака обязательно)
3. 🔄 Получите подтверждение и инструкции по отправке. Деньги вернём в течение 10 рабочих дней.

**Блок 4 — Гарантия на фитомодули:**
Отдельный блок (bg-brand-cream):
"Фитомодули Цветология — гарантия 5 лет"
Производственный брак, трещины, деформация без механических повреждений — заменим бесплатно.
Гарантия не распространяется на: механические повреждения, неправильную установку.

**Блок 5 — Контакты для возврата:**
- Telegram: кнопка-ссылка "Написать в Telegram" → https://t.me/+7cAd9gatgP44MDcy
- Каталог: ссылка → https://ecokon.ru/catalog

В конце: ссылка на полное Пользовательское соглашение → /terms

Дизайн: чистый, информационный. Используй иконки CheckCircle, XCircle, MessageCircle из lucide-react.

После создания запусти npm run build.
```

---

## ПРОМПТ 15: Страница «Контакты»

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Проверь существует ли src/app/contacts/page.tsx. Если нет — создай папку и файл.

Metadata:
title: "Контакты | ЭКО Конь и Цветология"
description: "Свяжитесь с нами через Telegram. Ответим в течение 1 часа в рабочее время."
alternates.canonical: "https://ecokon.ru/contacts"

**Структура:**

**Заголовок:** "Свяжитесь с нами"
Подзаголовок: "Ответим в течение 1 часа в рабочее время (пн–пт, 9:00–18:00 по МСК)"

**Блок 1 — Основные контакты (2 карточки):**

Карточка 1 — Telegram (главный канал):
- Иконка MessageCircle (lucide-react), brand-green
- Заголовок: "Telegram — быстрее всего"
- Текст: "Напишите нам напрямую. Отвечаем быстро."
- Кнопка: "Написать в Telegram" → https://t.me/+7cAd9gatgP44MDcy (target="_blank")
- Badge: "Рекомендуем"

Карточка 2 — Каталог на сайте:
- Иконка ShoppingBag (lucide-react)
- Заголовок: "Каталог товаров"
- Текст: "Смотрите все наши товары: удобрения ЭКО Конь и фитомодули Цветология."
- Кнопка: "Открыть каталог" → https://ecokon.ru/catalog

**Блок 2 — Маркетплейсы (в один ряд, 3 ссылки):**
Заголовок: "Наши магазины на маркетплейсах"
- Ozon — ЭКО Конь → https://www.ozon.ru/brand/eko-kon-147553078/
- Ozon — Цветология → https://www.ozon.ru/seller/tsvetologiya-1448738/
- Wildberries → https://www.wildberries.ru/brands/eko-kon

**Блок 3 — Юридические данные (мелким текстом, bg-gray-50):**
"КФХ «Ранчо Мушкино»
Глава КФХ: Гладышев Юрий Евгеньевич
Регион: Калининградская область, Россия
Торговые марки: «ЭКО Конь» и «Цветология» зарегистрированы в установленном порядке."

**Блок 4 — FAQ:**
- Q: "В какое время отвечаете?"
  A: "Пн–пт, 9:00–18:00 МСК. В выходные — по возможности."
- Q: "По каким вопросам можно писать?"
  A: "Любые: состав товара, условия доставки, возврат, оптовые заказы, сотрудничество."
- Q: "Можно ли оформить оптовый заказ?"
  A: "Да, обсуждаем индивидуальные условия. Напишите в Telegram."

Дизайн: карточки с hover:shadow-md, brand-green акценты, кнопки с иконками.

После создания запусти npm run build.
```

---

## ПРОМПТ 16: Страница «О бренде» + торговая марка

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Проверь src/app/about/page.tsx. Создай или перепиши полноценную страницу «О бренде».

Metadata:
title: "О бренде ЭКО Конь и Цветология | КФХ «Ранчо Мушкино»"
description: "История бренда органических удобрений ЭКО Конь и систем вертикального озеленения Цветология. КФХ «Ранчо Мушкино», Калининградская область."
alternates.canonical: "https://ecokon.ru/about"

**Структура:**

**Hero-секция:**
Заголовок: "Органика с фермы — прямо к вам"
Подзаголовок: "КФХ «Ранчо Мушкино» производит удобрения на основе конского навоза и системы вертикального озеленения с 2020 года."

**Цифры (горизонтальная полоска, 4 блока):**
- 50 000+ довольных покупателей
- 4.9★ средний рейтинг
- 18 товаров в линейке
- 5 лет гарантии на фитомодули

**Секция "Наша история":**
"КФХ «Ранчо Мушкино» — семейное фермерское хозяйство в Калининградской области. Мы начинали с переработки конского навоза в качественное органическое удобрение, а сейчас развиваем два направления: органические удобрения под брендом «ЭКО Конь» и системы вертикального озеленения «Цветология».

Наши удобрения на основе конского навоза — один из лучших органических субстратов: они богаче коровьего навоза по содержанию азота и фосфора, быстрее разлагаются и не закисляют почву."

**Секция "Два бренда":**
Два блока рядом:
- ЭКО Конь: bg-green-50, "Органические удобрения. Био-чай в стиках, специализированные составы для разных культур. Без химии, только натуральное."
- Цветология: bg-slate-50, "Фитомодули для вертикального озеленения. Производство Россия, ABS-пластик, гарантия 5 лет."

**Секция "Правовая информация" (важно!):**
Отдельный блок с иконкой Shield (lucide-react), bg-amber-50 border border-amber-200:
Заголовок: "Товарные знаки"
Текст:
"Торговые марки «ЭКО Конь» и «Цветология» зарегистрированы в установленном порядке на территории Российской Федерации и принадлежат КФХ «Ранчо Мушкино» (глава — Гладышев Юрий Евгеньевич).

Любое несанкционированное использование названий, логотипов и фирменного стиля брендов преследуется в соответствии с действующим законодательством РФ.

© КФХ «Ранчо Мушкино». Все права защищены."

**Секция "На маркетплейсах":**
Карточки с ссылками (те же что в /contacts).

В конце: CTA "Смотреть каталог" → /catalog

После создания запусти npm run build.
```

---

## ПРОМПТ 17: Seed отзывов в БД

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + Prisma + PostgreSQL.

Задача: добавить реалистичные отзывы для товаров в seed.ts.

В конце функции main() в prisma/seed.ts добавь seed отзывов через prisma.review.upsert или createMany.

Используй следующие отзывы (взяты из реальных паттернов покупателей на Ozon и WB):

**Для bio-chay-yantar-fosfor** (найди productId через prisma.product.findUnique({where:{slug:"bio-chay-yantar-fosfor"}})):
1. author: "Наталья К.", rating: 5, source: "ozon", isVerified: true,
   text: "Пользуюсь уже полгода — орхидеи просто расцвели! Раньше один цветонос в год, теперь три. Стики удобно дозировать, не пачкаешься. Запах специфический но терпимый. Заказала ещё 3 упаковки про запас."
   createdAt: new Date("2025-08-15")

2. author: "Марина В.", rating: 5, source: "ozon", isVerified: true,
   text: "Отличное удобрение! Фикус стоял грустный год, после месяца подкормки пошёл в рост и дал несколько новых листьев. Натуральный состав — это важно, дома дети и кошка. Рекомендую."
   createdAt: new Date("2025-09-02")

3. author: "Светлана П.", rating: 5, source: "wildberries", isVerified: true,
   text: "Брала с недоверием — казалось дорого. Но результат виден уже через 2 недели! Все мои 20+ растений ожили. Особенно хорошо сработало на монстере — три новых листа за месяц. Буду брать постоянно."
   createdAt: new Date("2025-10-18")

4. author: "Ольга Д.", rating: 5, source: "ozon", isVerified: false,
   text: "Моя находка этого года. Хойя цвела дважды, хлорофитум разросся в куст. Удобно что стики — просто воткнул и забыл. Расход экономный, хватает надолго."
   createdAt: new Date("2025-11-05")

5. author: "Татьяна М.", rating: 4, source: "ozon", isVerified: true,
   text: "Хорошее удобрение, результат есть. Минус один — хотелось бы больше инструкции на упаковке. Но для растений работает, фиалки зацвели активнее обычного."
   createdAt: new Date("2025-12-10")

**Для bio-chay-dekorativno-listvennye:**
1. author: "Ирина С.", rating: 5, source: "ozon", isVerified: true,
   text: "Специально взяла именно для декоративно-лиственных — не пожалела. Диффенбахия за месяц выдала 4 новых листа, каладиум стал ярче. Органика без резкого запаха, что для меня важно."
   createdAt: new Date("2025-07-22")

2. author: "Людмила Р.", rating: 5, source: "ozon", isVerified: true,
   text: "Беру уже третий раз. Все монстеры, фикусы и аглаонемы отлично реагируют. Главное не переусердствовать — одного стика на горшок 20 см хватает на месяц."
   createdAt: new Date("2025-10-01")

3. author: "Анна Г.", rating: 5, source: "wildberries", isVerified: true,
   text: "Подруга посоветовала. Теперь сама рекомендую всем кто любит растения. Сингониум после болезни полностью восстановился, даёт красивые пёстрые листья."
   createdAt: new Date("2025-11-14")

**Для udobrenie-kornevaya:**
1. author: "Елена Б.", rating: 5, source: "ozon", isVerified: true,
   text: "Спасла любимый фикус Бенджамина после пересадки — листья сыпались, я уже попрощалась. Полила с этим удобрением раз в неделю — через месяц пошёл в рост. Теперь покупаю регулярно."
   createdAt: new Date("2025-06-30")

2. author: "Валентина К.", rating: 5, source: "ozon", isVerified: true,
   text: "Очень понравилось. Орхидеи укрепили корни, замия дала новый побег. Использую как профилактику — раз в 2 месяца. Результат стабильный."
   createdAt: new Date("2025-09-17")

3. author: "Жанна Л.", rating: 4, source: "wildberries", isVerified: true,
   text: "Хорошее средство, корни у растений действительно стали крепче — видно при пересадке. Буду брать снова, хотя цена немного выросла."
   createdAt: new Date("2025-12-03")

**Для fitomodul-50-4-white:**
1. author: "Марина П.", rating: 5, source: "ozon", isVerified: true,
   text: "Сделала целую стену из цветов в гостиной — просто чудо! Модули крепкие, монтаж несложный, муж справился за час. Белый цвет идеально под интерьер. Уже докупила ещё 2 комплекта для спальни."
   createdAt: new Date("2025-08-09")

2. author: "Наталья Ф.", rating: 5, source: "ozon", isVerified: true,
   text: "Очень качественный товар. Пластик плотный, не гнётся, не желтеет. Живу с ними уже 8 месяцев — как новые. Под бегонии и традесканции подходит отлично."
   createdAt: new Date("2025-10-22")

3. author: "Екатерина В.", rating: 5, source: "ozon", isVerified: false,
   text: "Модули отличные! Взяла для офиса — сотрудники в восторге, посетители фотографируются. Растения держатся хорошо, ничего не падает. Гарантия 5 лет — это серьёзно."
   createdAt: new Date("2025-11-30")

**Для kolyshki-skoby-silikon:**
1. author: "Галина В.", rating: 5, source: "ozon", isVerified: true,
   text: "Мягкие, не травмируют стебли совсем. У меня хрупкие орхидеи — раньше всё пластиковыми прищепками крепила и оставляла следы. Эти силиконовые идеальны. Куплю ещё."
   createdAt: new Date("2025-09-25")

2. author: "Оксана Ш.", rating: 5, source: "ozon", isVerified: true,
   text: "Недорого и очень удобно. Скобы держат даже тяжёлые ветки томатов. Силикон не рвётся, можно переставлять много раз. Отличная покупка."
   createdAt: new Date("2025-12-15")

Для каждого отзыва:
1. Найди productId: const product = await prisma.product.findUnique({ where: { slug: "..." }, select: { id: true } })
2. Создай: await prisma.review.upsert({ where: { id: "review-slug-N" }, update: {}, create: { id: "review-slug-N", productId: product.id, author, rating, text, source, isVerified, isVisible: true, createdAt } })

Используй уникальные id вида "review-bio-chay-yantar-1", "review-bio-chay-yantar-2" и т.д.

После добавления проверь: npx tsc --noEmit
Запусти npm run build.
```

---

## ПРОМПТ 18: Footer и мета — торговая марка

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Задача: добавить информацию о зарегистрированных торговых марках в три места.

**1. Footer (src/components/Footer.tsx):**
В копирайт-строку добавь после текущего копирайта:
"® «ЭКО Конь» и «Цветология» — зарегистрированные торговые марки КФХ «Ранчо Мушкино»"
(мелкий текст, text-white/40, text-xs)

**2. Страница товара (src/app/product/[slug]/page.tsx):**
В generateMetadata добавь в description суффикс если товар принадлежит бренду ecokon или tsvetologiya:
- ecokon: добавь "® Торговая марка «ЭКО Конь» зарегистрирована."
- tsvetologiya: добавь "® Торговая марка «Цветология» зарегистрирована."

**3. BrandLabel (src/components/BrandLabel.tsx):**
Прочитай файл. Добавь tooltip (title attribute) к элементу:
- brand "ecokon": title="ЭКО Конь® — зарегистрированная торговая марка"
- brand "tsvetologiya": title="Цветология® — зарегистрированная торговая марка"
И добавь символ ® после названия бренда в лейбле (маленький, text-[10px] align-top).

**4. Создай src/app/legal/page.tsx — страница "Правовая информация":**
Metadata: title "Правовая информация | ЭКО Конь", canonical "https://ecokon.ru/legal"

Контент:
Заголовок: "Правовая информация"

Блок "Правообладатель":
"Интернет-магазин ecokon.ru принадлежит и управляется КФХ «Ранчо Мушкино».
Глава КФХ: Гладышев Юрий Евгеньевич
Регион: Калининградская область, Российская Федерация"

Блок "Торговые марки":
"Торговые марки «ЭКО Конь» и «Цветология» зарегистрированы на территории Российской Федерации в соответствии с Гражданским кодексом РФ (часть IV) и принадлежат КФХ «Ранчо Мушкино».
Несанкционированное использование торговых марок, логотипов, фирменного стиля и наименований запрещено и преследуется по закону."

Блок "Исключительные права":
"Все материалы сайта (тексты, изображения, дизайн) являются собственностью КФХ «Ранчо Мушкино» и защищены законодательством об авторском праве.
Копирование без письменного разрешения запрещено."

Ссылки в Footer.tsx: добавь "Правовая информация" → /legal рядом со ссылками Privacy/Terms.

После всех изменений запусти npm run build.
```

---

## ПРОМПТ 19: Финальная проверка Phase 2

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14.

Задача: финальная проверка всех новых страниц.

1. Запусти npm run build — должно собраться без ошибок. Исправь все TypeScript ошибки.

2. Проверь что все новые страницы присутствуют в билде:
   - /delivery
   - /contacts
   - /about
   - /legal
   - (returns если создана)

3. Проверь что в Footer есть ссылки: /delivery, /contacts, /about, /returns, /legal, /privacy, /terms

4. Проверь навигацию в Header: убедись что ссылки "О бренде" → /about есть в меню.

5. Добавь в Header мобильное меню ссылку "Доставка и оплата" → /delivery

6. Запусти npx tsc --noEmit — должно быть 0 ошибок.

7. Выведи итоговый список всех страниц из билда.
```

---

---

## ПРОМПТ 20: Политика обработки персональных данных (152-ФЗ)

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Задача: создать полноценную страницу Политики обработки персональных данных, соответствующую требованиям 152-ФЗ РФ.

**Создай файл src/app/privacy/page.tsx**

Metadata:
title: "Политика обработки персональных данных | ЭКО Конь"
description: "Политика обработки персональных данных ООО «Цветология». Как мы собираем, используем и защищаем ваши данные."
alternates.canonical: "https://ecokon.ru/privacy"

**Реквизиты оператора (жёстко в коде):**
- Оператор: ООО «Цветология»
- ИНН: 3900034368
- ОГРН: 1243900014830
- Адрес: 236017, Калининградская обл., г. Калининград, пр-кт Победы, д. 3, помещ. литер Б
- Генеральный директор: Кузнецова Екатерина Александровна
- Email для обращений по ПДн: info@ecokon.ru
- Сайт: https://ecokon.ru
- Дата последнего обновления: 01.04.2026

**Структура документа (пронумерованные разделы, как в официальных документах):**

### 1. Общие положения
"Настоящая Политика обработки персональных данных (далее — Политика) разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных пользователей сайта ecokon.ru.

Оператором персональных данных является ООО «Цветология» (ИНН 3900034368, ОГРН 1243900014830), адрес: 236017, Калининградская обл., г. Калининград, пр-кт Победы, д. 3, помещ. литер Б.

Используя сайт ecokon.ru, вы подтверждаете, что ознакомились с настоящей Политикой и даёте согласие на обработку персональных данных на условиях, изложенных в ней."

### 2. Какие персональные данные мы собираем
Таблица:
| Категория | Данные | Когда собираем |
|---|---|---|
| Идентификационные | Имя, фамилия | При регистрации и оформлении заказа |
| Контактные | Адрес электронной почты, номер телефона | При регистрации, оформлении заказа, подписке |
| Адресные | Адрес доставки, город | При оформлении заказа |
| Платёжные | Не хранятся — обрабатываются платёжным сервисом ЮKassa | При оплате |
| Технические | IP-адрес, cookie, данные браузера | Автоматически при посещении сайта |
| Аналитические | Действия на сайте, статистика | Через Яндекс.Метрику |

### 3. Цели обработки персональных данных
Список:
- Оформление и исполнение заказов (доставка, связь по заказу)
- Идентификация пользователя в личном кабинете
- Направление уведомлений о заказе (email, Telegram)
- Направление маркетинговых рассылок (только с явного согласия)
- Улучшение работы сайта и пользовательского опыта
- Соблюдение требований законодательства РФ (54-ФЗ, налоговый учёт)

### 4. Правовые основания обработки
- Согласие субъекта персональных данных (ст. 6 ч. 1 п. 1, ст. 9 152-ФЗ) — для регистрации, рассылок
- Исполнение договора (ст. 6 ч. 1 п. 5 152-ФЗ) — для обработки заказов
- Законный интерес (ст. 6 ч. 1 п. 7 152-ФЗ) — для обеспечения безопасности сайта

### 5. Срок хранения данных
- Данные аккаунта: до удаления аккаунта пользователем + 3 года (налоговые требования)
- Данные заказов: 5 лет (требования налогового законодательства)
- Cookie и технические данные: согласно настройкам браузера / до 1 года
- Данные рассылок: до отзыва согласия

### 6. Передача данных третьим лицам
"Мы передаём персональные данные следующим получателям исключительно для исполнения договора:"
- Службы доставки: СДЭК, Boxberry, 5Post, Почта России — адрес и контакты получателя
- Платёжный сервис: ЮKassa (НКО «Национальная платёжная корпорация») — контактные данные плательщика
- Сервис аналитики: Яндекс.Метрика — обезличенные поведенческие данные
- Telegram: при использовании уведомлений через Telegram-бот

"Мы не продаём персональные данные третьим лицам."

### 7. Хранение данных
"Персональные данные хранятся на серверах, расположенных на территории Российской Федерации, в соответствии с требованиями ст. 18.1 152-ФЗ."

### 8. Права субъекта персональных данных
Список прав:
- Получить информацию об обработке своих данных
- Требовать уточнения, блокирования или уничтожения данных
- Отозвать согласие на обработку в любой момент
- Обратиться в Роскомнадзор (rkn.gov.ru) в случае нарушений

"Для реализации прав направьте запрос на: info@ecokon.ru. Мы ответим в течение 30 дней."

### 9. Файлы cookie
"Сайт использует cookie для корректной работы, аналитики и улучшения пользовательского опыта. Продолжая использовать сайт, вы соглашаетесь с использованием cookie. Вы можете отключить cookie в настройках браузера."

Виды cookie:
- Обязательные: корзина, сессия авторизации (без них сайт не работает)
- Аналитические: Яндекс.Метрика (можно отключить)

### 10. Изменения Политики
"Мы вправе изменять Политику. При существенных изменениях уведомим по email или через уведомление на сайте. Актуальная версия всегда доступна по адресу: https://ecokon.ru/privacy"

### 11. Контакты
ООО «Цветология», info@ecokon.ru, 236017, г. Калининград, пр-кт Победы, д. 3, помещ. литер Б.
Также: КФХ «Ранчо Мушкино», Гладышев Юрий Евгеньевич (Калининградская обл.).

**Дизайн:** чистый документ, заголовки h2 для разделов, prose-стиль, таблицы с border. Добавь вверху дату: "Редакция от 01.04.2026". Кнопка "Вернуться назад" в начале.

После создания запусти npm run build.
```

---

## ПРОМПТ 21: Cookie-баннер (глобальный компонент)

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Задача: создать cookie-баннер, который показывается при первом посещении и исчезает после согласия.

**Создай src/components/CookieBanner.tsx:**

"use client"
- Используй useState + useEffect для проверки localStorage["cookie-consent"]
- Показывай баннер если localStorage["cookie-consent"] не установлен
- При клике "Принять все" → localStorage.setItem("cookie-consent", "all") + скрыть баннер
- При клике "Только необходимые" → localStorage.setItem("cookie-consent", "essential") + скрыть баннер

**Внешний вид (fixed bottom, z-50):**
- Полоска снизу экрана: bg-brand-gray-dark text-white
- Или карточка в левом нижнем углу на мобильном и десктопе: max-w-sm, rounded-xl, shadow-2xl, bg-white border
- Текст: "Мы используем cookie для работы сайта, аналитики и улучшения опыта. Подробнее в " + ссылка "Политике конфиденциальности" → /privacy
- Две кнопки:
  - "Принять все" — зелёная (brand-green), primary
  - "Только необходимые" — серая, outline

**Подключи в src/app/layout.tsx** после Footer, внутри AuthProvider:
```tsx
import { CookieBanner } from "@/components/CookieBanner";
// ...
<CookieBanner />
```

**Важно:**
- Баннер не должен мешать скроллу и основному контенту
- На мобильном: full-width полоска снизу с кнопками в ряд
- Нет React-порталов — просто обычный fixed div
- Анимация появления: opacity transition 300ms

После создания запусти npm run build.
```

---

## ПРОМПТ 22: Согласие на ПДн в формах

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Задача: добавить обязательный чекбокс согласия на обработку персональных данных в все формы сбора данных. Без отметки чекбокса форма не отправляется.

**Создай переиспользуемый компонент src/components/ui/ConsentCheckbox.tsx:**

```tsx
"use client";
interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  className?: string;
}
```

Текст: "Я даю согласие на [обработку персональных данных](ссылка на /privacy) в соответствии с Политикой конфиденциальности ООО «Цветология» (152-ФЗ)"
- Ссылка открывается в новой вкладке (target="_blank")
- Стиль: маленький checkbox (h-4 w-4, accent-brand-green) + текст text-sm text-brand-gray-dark/70
- При required=true и не отмечен: показывает красную обводку и сообщение "Необходимо ваше согласие"

**Место 1 — Регистрация (src/app/auth/signup/page.tsx):**
- Добавь ConsentCheckbox перед кнопкой "Зарегистрироваться"
- Блокируй кнопку если не отмечен
- В handleSubmit: если !consentChecked → return (не отправлять)

**Место 2 — Checkout (src/components/checkout/PersonalStep.tsx):**
- Добавь ConsentCheckbox перед кнопкой "Далее"
- Блокируй кнопку "Далее" если не отмечен
- Текст дополнительно: "Соглашаюсь с [Пользовательским соглашением](/terms) и [Политикой конфиденциальности](/privacy)"

**Место 3 — Newsletter (src/components/sections/Newsletter.tsx):**
- Добавь ConsentCheckbox перед кнопкой "Подписаться"
- Блокируй кнопку если не отмечен
- Дополнительный текст: "Соглашаюсь получать рассылку и даю согласие на обработку email"

**Место 4 — Форма на странице Контакты (если есть контактная форма):**
- Добавь ConsentCheckbox если там есть форма с полями ввода

Убедись что во всех местах:
- Чекбокс визуально красиво вписан
- Валидация работает (форма не отправляется без отметки)
- Ссылка на /privacy открывается в новой вкладке

После всех изменений запусти npm run build.
```

---

## ПРОМПТ 23: Контакты — добавить ООО «Цветология»

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Задача: обновить страницу /contacts и все места с юридической информацией, добавив ООО «Цветология».

**Обнови src/app/contacts/page.tsx:**

В блоке "Юридические данные" замени/дополни:
```
Оператор персональных данных и владелец интернет-магазина:
ООО «Цветология»
ИНН: 3900034368 | ОГРН: 1243900014830
Генеральный директор: Кузнецова Екатерина Александровна
Адрес: 236017, Калининградская обл., г. Калининград, пр-кт Победы, д. 3, помещ. литер Б
Email: info@ecokon.ru

Производитель и правообладатель брендов «ЭКО Конь» и «Цветология»:
КФХ «Ранчо Мушкино»
Глава: Гладышев Юрий Евгеньевич
Регион: Калининградская область, Россия
```

Добавь ссылки:
- "Политика конфиденциальности" → /privacy
- "Пользовательское соглашение" → /terms
- "Правовая информация" → /legal

**Обнови src/app/about/page.tsx** — секция "Правовая информация":
Добавь оба юрлица:
- ООО «Цветология» (ИНН 3900034368) — оператор интернет-магазина ecokon.ru
- КФХ «Ранчо Мушкино» (Гладышев Ю.Е.) — производитель, правообладатель ТМ

**Обнови src/app/legal/page.tsx** (если создана в промпте 18):
Добавь блок "Оператор персональных данных":
```
ООО «Цветология»
ИНН: 3900034368, ОГРН: 1243900014830
Адрес: 236017, г. Калининград, пр-кт Победы, д. 3, помещ. литер Б
Email: info@ecokon.ru
```

**Обнови src/components/Footer.tsx:**
В копирайт-строку добавь:
"ООО «Цветология» (ИНН 3900034368) | КФХ «Ранчо Мушкино»"
(мелким текстом, text-white/40, text-xs, на отдельной строке под основным копирайтом)

Убедись что везде email info@ecokon.ru — кликабельный mailto: ссылка.

После всех изменений запусти npm run build.
```

---

## ПРОМПТ 24: Пользовательское соглашение (Terms of Service)

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14 + TypeScript + Tailwind.

Задача: создать страницу Пользовательского соглашения (оферты).

Проверь существует ли src/app/terms/page.tsx. Создай или перепиши.

Metadata:
title: "Пользовательское соглашение | ЭКО Конь"
description: "Условия использования интернет-магазина ecokon.ru. Договор оферты."
alternates.canonical: "https://ecokon.ru/terms"

**Оператор (вверху документа):**
ООО «Цветология», ИНН 3900034368, ОГРН 1243900014830, г. Калининград, пр-кт Победы, д. 3, помещ. литер Б.
Редакция от 01.04.2026.

**Разделы:**

### 1. Предмет соглашения
"Настоящее соглашение регулирует отношения между ООО «Цветология» (далее — Продавец) и физическим лицом (далее — Покупатель), использующим сайт ecokon.ru для приобретения товаров. Совершение заказа означает принятие условий настоящего соглашения."

### 2. Условия заказа и оплаты
- Заказ оформляется через сайт ecokon.ru
- Цены указаны в рублях РФ, включая НДС
- Оплата: банковская карта, СБП, наличные при получении
- Заказ считается принятым после подтверждения по email
- Продавец вправе отказать в заказе при отсутствии товара

### 3. Доставка
- Доставка осуществляется по России через СДЭК, Boxberry, 5Post, Почту России
- Срок доставки: 1–14 рабочих дней в зависимости от региона
- Бесплатная доставка при заказе от 3 000 рублей
- Риск случайной гибели товара переходит к Покупателю с момента передачи службе доставки

### 4. Возврат и обмен
- Возврат товара надлежащего качества: в течение 14 дней при сохранении упаковки
- Возврат товара ненадлежащего качества (брак): в любой срок
- Возврат денежных средств: в течение 10 рабочих дней на исходный способ оплаты
- Вскрытые удобрения возврату не подлежат по санитарным нормам
- Для возврата: написать на info@ecokon.ru или в Telegram

### 5. Права и обязанности сторон
Продавец обязуется: передать товар надлежащего качества, предоставить информацию о товаре, соблюдать сроки доставки.
Покупатель обязуется: предоставить достоверные данные, оплатить заказ, принять товар.

### 6. Ответственность
- Продавец не несёт ответственности за задержки доставки, вызванные службами доставки
- Претензии принимаются в течение 30 дней с момента получения товара

### 7. Персональные данные
"Обработка персональных данных осуществляется в соответствии с [Политикой конфиденциальности](/privacy) ООО «Цветология»."

### 8. Применимое право
"Настоящее соглашение регулируется законодательством Российской Федерации. Все споры решаются в суде по месту нахождения Продавца (г. Калининград)."

### 9. Контакты
ООО «Цветология», info@ecokon.ru, г. Калининград, пр-кт Победы, д. 3.
КФХ «Ранчо Мушкино», Гладышев Юрий Евгеньевич.

**Дизайн:** аналогично /privacy — документальный стиль, нумерованные разделы, prose. Кнопка "Назад" вверху.

После создания запусти npm run build.
```

---

## ПРОМПТ 25: Финальная проверка Phase 3 (ПДн-compliance)

```
Ты работаешь в папке ~/Obsidian/ecokon.ru/ecokon — Next.js 14.

Задача: финальная проверка ПДн-соответствия и всех новых страниц.

1. npm run build — без ошибок. Исправь если есть.

2. Проверь все формы — везде есть ConsentCheckbox:
   grep -r "ConsentCheckbox\|consent" src/ --include="*.tsx" | grep -v "node_modules"

3. Проверь что CookieBanner подключён в layout.tsx:
   grep "CookieBanner" src/app/layout.tsx

4. Проверь что все юридические страницы присутствуют:
   - /privacy — Политика обработки ПДн
   - /terms — Пользовательское соглашение
   - /legal — Правовая информация

5. Проверь Footer — есть ли ссылки на /privacy, /terms, /legal:
   grep -A 20 "копирайт\|copyright\|privacy\|terms" src/components/Footer.tsx

6. Убедись что email info@ecokon.ru встречается везде где нужно:
   grep -r "info@ecokon.ru" src/ --include="*.tsx"

7. Проверь sitemap.ts — добавь /privacy, /terms, /delivery, /contacts, /about, /returns, /legal если их нет.

8. npx tsc --noEmit — 0 ошибок.

9. Выведи итоговый чеклист 152-ФЗ:
   ✅/❌ Политика конфиденциальности
   ✅/❌ Cookie-баннер
   ✅/❌ Чекбокс в форме регистрации
   ✅/❌ Чекбокс в checkout
   ✅/❌ Чекбокс в подписке на email
   ✅/❌ Указан оператор ПДн (ООО «Цветология»)
   ✅/❌ Email для отзыва согласия
   ✅/❌ Пользовательское соглашение
   ✅/❌ Данные хранятся на серверах в РФ (указано в политике)
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

# Запустить только Phase 2 (страницы):
./run-prompts.sh 13 19

# Запустить только Phase 3 (ПДн-compliance):
./run-prompts.sh 20 25
```
