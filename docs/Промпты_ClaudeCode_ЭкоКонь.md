# ПРОМПТЫ ДЛЯ CLAUDE CODE
# Цифровая экосистема «Эко Конь / Цветология» (ecokon.ru)

**Версия:** 2.1
**Дата:** март 2026
**Использование:** каждый промпт копируется целиком в Claude Code и выполняется последовательно (1 → 2 → 3 → ...)

> **Важно:** перед каждым промптом убедись, что предыдущий выполнен и протестирован. Не переходи к следующему, пока текущий не работает.

---

## ПРОМПТ 1: Project Setup и инициализация

```
Создай Next.js 14 проект для интернет-магазина ecokon.ru. Это D2C экосистема для КФХ "Ранчо Мушкино" — два бренда: "ЭКО Конь" (органические удобрения) и "Цветология" (фитомодули для вертикального озеленения).

Требования:

1. Инициализируй проект:
   npx create-next-app@14 ecokon --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

2. Установи зависимости:
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs zustand react-hook-form zod @hookform/resolvers lucide-react clsx tailwind-merge next-themes

3. Создай структуру папок:
   src/
   ├── app/
   │   ├── layout.tsx
   │   ├── page.tsx
   │   ├── globals.css
   │   ├── catalog/
   │   ├── product/
   │   ├── cart/
   │   ├── checkout/
   │   ├── order/
   │   ├── auth/
   │   ├── account/
   │   ├── admin/
   │   ├── blog/
   │   ├── knowledge-base/
   │   ├── about/
   │   ├── delivery/
   │   ├── contacts/
   │   ├── privacy/
   │   ├── terms/
   │   └── api/
   │       ├── delivery/
   │       ├── payment/
   │       ├── notifications/
   │       └── sync/
   ├── components/
   │   ├── ui/
   │   ├── sections/
   │   ├── checkout/
   │   └── admin/
   ├── lib/
   │   ├── supabase.ts (клиент + server клиент)
   │   ├── utils.ts (cn() helper из clsx + tailwind-merge)
   │   └── constants.ts
   ├── hooks/
   ├── store/
   └── types/
       └── index.ts (заглушка)

4. Создай .env.local.example:
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   # YooKassa
   YOOKASSA_SHOP_ID=
   YOOKASSA_SECRET_KEY=
   # ApiShip (агрегатор доставки: 5Post, Boxberry, Почта России, СДЭК)
   APISHIP_API_KEY=
   APISHIP_FROM_CITY_ID=
   APISHIP_PLATFORM_ID=
   # Yandex Maps
   NEXT_PUBLIC_YMAPS_API_KEY=
   # Analytics
   NEXT_PUBLIC_METRIKA_ID=
   NEXT_PUBLIC_VK_PIXEL_ID=
   # Notifications
   TELEGRAM_BOT_TOKEN=
   TELEGRAM_CHAT_ID=
   # Email
   BREVO_API_KEY=
   BREVO_SENDER_EMAIL=noreply@ecokon.ru
   # Domain
   NEXT_PUBLIC_SITE_URL=https://ecokon.ru

5. В lib/supabase.ts создай два клиента:
   - createClient() — для клиентских компонентов (browser)
   - createServerClient() — для серверных компонентов и API routes

6. В lib/utils.ts создай cn() helper:
   import { clsx, type ClassValue } from "clsx"
   import { twMerge } from "tailwind-merge"
   export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

7. В lib/constants.ts:
   - SITE_NAME = "Эко Конь | Цветология"
   - BRANDS = { ecokon: { name: "ЭКО Конь", color: "#2D5016" }, tsvetologiya: { name: "Цветология", color: "#4A5568" } }
   - FREE_DELIVERY_THRESHOLD = 3000
   - DEFAULT_CURRENCY = "RUB"

8. В app/layout.tsx — минимальный layout с:
   - <html lang="ru">
   - Meta: charset, viewport, title "Эко Конь — органические удобрения и вертикальные сады"
   - Шрифт Inter из Google Fonts (next/font/google)
   - Заглушка: <main>{children}</main>

9. В app/page.tsx — заглушка:
   <h1>Эко Конь / Цветология</h1>
   <p>Сайт в разработке</p>

Проверь:
- npm run build проходит без ошибок
- npm run dev запускает localhost:3000
- Tailwind стили применяются (добавь тестовый className)
- lib/supabase.ts компилируется без ошибок
```

---

## ПРОМПТ 2: Database Schema и Supabase Setup

```
Создай все таблицы для БД Supabase (PostgreSQL) проекта ecokon.ru. Всего 15 таблиц. Сгенерируй TypeScript типы и загрузи seed-данные.

1. Создай папку supabase/migrations/ и файлы миграций:

=== 001_product_lines.sql ===
CREATE TABLE product_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  brand VARCHAR NOT NULL,  -- "ecokon" | "tsvetologiya"
  description TEXT,
  image VARCHAR,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

=== 002_categories.sql ===
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  parent_id UUID REFERENCES categories(id),
  product_line_id UUID REFERENCES product_lines(id),
  description TEXT,
  image VARCHAR,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

=== 003_products.sql ===
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  description TEXT,
  short_description VARCHAR(200),
  price DECIMAL(10, 2) NOT NULL,
  price_old DECIMAL(10, 2),
  discount_percent INT,
  brand VARCHAR NOT NULL,
  product_line_id UUID NOT NULL REFERENCES product_lines(id),
  category_id UUID REFERENCES categories(id),
  images TEXT[] NOT NULL DEFAULT '{}',
  video_url VARCHAR,
  characteristics JSONB DEFAULT '{}',
  variants JSONB DEFAULT '[]',
  weight_grams INT NOT NULL DEFAULT 300,
  dimensions JSONB,
  stock INT DEFAULT 0,
  badge VARCHAR,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  marketplace_ids JSONB DEFAULT '{}',
  seo_title VARCHAR(70),
  seo_description VARCHAR(160),
  seo_og_image VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

=== 004_orders.sql ===
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  channel VARCHAR DEFAULT 'site',
  status VARCHAR DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_cost DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  promo_code VARCHAR,
  delivery_provider VARCHAR,       -- "fivepost" | "boxberry" | "pochta" | "cdek"
  delivery_method VARCHAR,         -- "pvz" | "courier" | "postamat" | "post_office"
  delivery_address JSONB,
  delivery_city_code INT,
  delivery_order_id VARCHAR,       -- ID заказа в ApiShip
  delivery_track VARCHAR,
  delivery_status VARCHAR,
  delivery_provider_track VARCHAR,
  payment_method VARCHAR,
  payment_id VARCHAR,
  payment_status VARCHAR DEFAULT 'pending',
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  customer_phone VARCHAR NOT NULL,
  customer_comment TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

=== 005_order_items.sql ===
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id VARCHAR,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  name VARCHAR NOT NULL,
  image VARCHAR
);

=== 006_profiles.sql ===
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR,
  phone VARCHAR,
  addresses JSONB DEFAULT '[]',
  loyalty_points INT DEFAULT 0,
  referral_code VARCHAR UNIQUE,
  referred_by UUID REFERENCES profiles(id),
  role VARCHAR DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

=== 007_promo_codes.sql ===
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR UNIQUE NOT NULL,
  discount_type VARCHAR NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  uses_limit INT,
  uses_count INT DEFAULT 0,
  applicable_brands TEXT[],
  applicable_product_lines UUID[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

=== 008_reviews.sql ===
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  source VARCHAR DEFAULT 'site',
  source_id VARCHAR,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  author_name VARCHAR,
  text TEXT,
  images TEXT[],
  is_verified BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

=== 009_blog_posts.sql ===
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(300),
  category VARCHAR,
  tags TEXT[],
  cover_image VARCHAR,
  seo_title VARCHAR(70),
  seo_description VARCHAR(160),
  author VARCHAR DEFAULT 'Эко Конь',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

=== 010_knowledge_base.sql ===
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR UNIQUE NOT NULL,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR NOT NULL,
  product_ids UUID[],
  category VARCHAR,
  cover_image VARCHAR,
  video_url VARCHAR,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

=== 011_favorites.sql ===
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, product_id)
);

=== 012_subscriptions.sql ===
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id VARCHAR,
  quantity INT DEFAULT 1,
  status VARCHAR DEFAULT 'active',
  interval_months INT DEFAULT 1,
  next_delivery DATE,
  last_payment_id VARCHAR,
  pause_until DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

=== 013_notifications.sql ===
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

=== 014_sync_log.sql ===
CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR NOT NULL,
  entity_id UUID NOT NULL,
  channel VARCHAR NOT NULL,
  action VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT now()
);

=== 015_rls_policies.sql ===
-- Включить RLS на всех таблицах
-- profiles: только свой профиль (SELECT/UPDATE WHERE auth.uid() = user_id)
-- orders: свои заказы + admin
-- favorites: только свои
-- products, product_lines, categories, blog_posts, knowledge_base: public SELECT
-- reviews: public SELECT, authenticated INSERT
-- promo_codes: public SELECT (is_active = true)
-- Все INSERT/UPDATE/DELETE кроме favorites: только admin (role = 'admin' в profiles)

2. Создай supabase/seed.sql с данными:

Продуктовые линейки (5):
- bio-chay | Био-чай | ecokon
- specialized | Специализированные удобрения | ecokon
- fitmoduli | Фитомодули | tsvetologiya
- accessories | Аксессуары | tsvetologiya
- grunty | Грунты (планируется) | ecokon

Категории (8):
- bio-chay-stiki → bio-chay
- specialized-udobreniya → specialized
- nastennye-fitmoduli → fitmoduli
- napolnye-fitmoduli → fitmoduli
- ukryvnoy-material → accessories
- и т.д.

Товары (13 штук, реальные данные):
1. Био-чай Универсальный с янтарём — 626₽, rating 4.9, 9762 отзыва, 300г
2. Био-чай Для декоративно-лиственных — 609₽, 4.9, 6287
3. Био-чай Для орхидей — 611₽, 4.9, 1727
4. Био-чай Для рассады — 608₽, 5.0, 51
5. Био-чай Для цветущих — 608₽, 4.9, 61
6. Для укрепления корневой системы — 633₽, 4.9, 5784
7. Для овощей — 487₽, 4.9, 1789
8. Для цитрусовых — 487₽, 4.9, 1621
9. Фитомодуль настенный 3 кармана (антрацит) — 2748₽, 4.8, 4899
10. Фитомодуль настенный 3 кармана (зелёный) — 2748₽, 4.7, 500
11. Фитомодуль настенный 6 карманов — 4200₽, 4.6, 200
12. Фитомодуль напольный — 4800₽, 4.5, 100
13. Укрывной материал — 159₽, 4.7, 300

У каждого товара заполни: slug, short_description (150 символов), characteristics (JSONB: вес, состав, назначение), badge (bestseller для топ-3 по отзывам), stock (100).

Промокод: WELCOME10, percent, 10%, min 500₽, без срока.

3. Создай src/types/database.ts — TypeScript типы для всех таблиц (type Database с Tables, не interface). Используй формат совместимый с @supabase/supabase-js.

Проверь:
- Все 15 таблиц описаны в миграциях
- SQL синтаксически корректен (можно проверить через echo + psql --dry-run или просто внимательно)
- seed.sql содержит 5 product_lines, 8+ categories, 13 products, 1 promo_code
- TypeScript типы соответствуют SQL схеме
- FK связи корректны
```

---

## ПРОМПТ 3: Design System, Layout и UI Components

```
Создай дизайн-систему и глобальный layout для ecokon.ru. Два бренда под одной крышей: "ЭКО Конь" (зелёно-коричневый) и "Цветология" (зелёно-серый).

1. Обнови tailwind.config.ts — добавь кастомные цвета:
   colors: {
     brand: {
       green: '#2D5016',      // CTA кнопки, заголовки
       brown: '#8B4513',      // вторичные элементы
       cream: '#FFF8DC',      // фон секций
       gray: { light: '#F0F0F0', dark: '#333333' }
     },
     ecokon: '#2D5016',       // бренд ЭКО Конь
     tsvetologiya: '#4A5568', // бренд Цветология
     error: '#E63946',
     success: '#06D6A0'
   }
   fontFamily: { sans: ['Inter', 'sans-serif'] }

2. Обнови app/globals.css — базовые стили:
   - @layer base: body bg-white text-brand-gray-dark
   - Кастомные @layer components для повторяющихся элементов

3. Создай UI компоненты в src/components/ui/:

   Button.tsx — variants: primary (bg-brand-green), secondary (outline), ghost, disabled. Sizes: sm, md, lg. Props: variant, size, loading (спиннер), asChild (для ссылок).

   Card.tsx — белый фон, shadow-md, rounded-xl, padding. Variants: default, hover (scale + shadow-lg).

   Badge.tsx — sm/md, variants: success, warning, info, bestseller, new, sale. Пример: <Badge variant="bestseller">Хит</Badge>

   Input.tsx — с label сверху, placeholder, error message, helper text. Интеграция с react-hook-form (forwardRef).

   Select.tsx — dropdown, поддержка поиска (для городов). Props: options, searchable, placeholder, onChange.

   Modal.tsx — overlay (backdrop blur), close button, анимация fade-in. Props: isOpen, onClose, title, children.

   Tabs.tsx — горизонтальные табы, activeTab подчёркнут brand-green. Props: tabs: {id, label}[], activeTab, onChange.

   Spinner.tsx — animated SVG спиннер, sizes: sm/md/lg.

4. Создай BrandLabel.tsx в src/components/:
   Маленький лейбл-бейдж для карточек товаров.
   brand="ecokon" → зелёный фон, текст "ЭКО Конь"
   brand="tsvetologiya" → серо-зелёный фон, текст "Цветология"
   Размер: text-xs, px-2 py-0.5, rounded-full.

5. Создай Header.tsx в src/components/:
   - Логотип (текст "ЭКО Конь | Цветология" пока без картинки)
   - Навигация десктоп: Удобрения (/catalog/udobreniya), Вертикальное озеленение (/catalog/vertikalnoe-ozelenenie), Блог (/blog), О компании (/about)
   - Справа: иконка корзины с badge (количество товаров), иконка профиля
   - Sticky header (sticky top-0 z-50 bg-white/95 backdrop-blur)
   - На мобиле: логотип + бургер-меню + корзина

6. Создай MobileMenu.tsx:
   - Выезжает справа (transform translateX)
   - Те же ссылки + Доставка, Контакты
   - Overlay затемнение
   - Закрытие по клику вне меню и по крестику

7. Создай Footer.tsx:
   - 3 колонки: О компании (ссылки), Покупателям (Доставка, Оплата, Оферта, Политика), Контакты (email, телефон)
   - Соцсети: VK, Telegram (иконки из lucide-react или SVG)
   - Copyright: "© 2026 КФХ Ранчо Мушкино. Все права защищены."
   - Фон: brand-gray-dark, текст белый

8. Обнови app/layout.tsx:
   - Inter font из next/font/google
   - <Header />
   - <main className="min-h-screen">{children}</main>
   - <Footer />
   - Metadata: title template "%s | Эко Конь", description

Responsive breakpoints:
- Mobile: 375px (design first)
- Tablet: 768px (md:)
- Desktop: 1440px (xl:)
- Touch targets: минимум 48px

Проверь:
- npm run build без ошибок
- Layout видён на всех страницах
- Header sticky, навигация работает
- Мобильное меню открывается/закрывается
- Footer на месте
- BrandLabel отличается для двух брендов
- Все UI компоненты рендерятся (можно сделать тестовую страницу /test-ui)
```

---

## ПРОМПТ 4: Home Page

```
Создай главную страницу ecokon.ru. Это landing для зонтичного бренда — два суббренда, 5 продуктовых линеек, 18+ SKU.

Файлы:
- src/app/page.tsx
- src/components/sections/Hero.tsx
- src/components/sections/ProductLines.tsx
- src/components/sections/Bestsellers.tsx
- src/components/sections/Benefits.tsx
- src/components/sections/Testimonials.tsx
- src/components/sections/Newsletter.tsx

1. Hero.tsx:
   - Фон: градиент от brand-cream к white или большое фото (placeholder пока)
   - Заголовок H1: "Органические удобрения и вертикальные сады для вашего дома"
   - Подзаголовок: "Более 45 000 довольных клиентов. Доставка по всей России от 99 ₽"
   - Два CTA:
     - Button primary: "Удобрения →" → /catalog/udobreniya
     - Button secondary: "Фитомодули →" → /catalog/vertikalnoe-ozelenenie
   - Десктоп: текст слева, фото справа (placeholder)
   - Мобиль: текст сверху, фото снизу
   - Внизу hero: полоска "доверия": "⭐ 4.9 на Ozon • 45 000+ отзывов • Доставка от 99 ₽ • Экологично"

2. ProductLines.tsx:
   - Заголовок H2: "Наши продукты"
   - 2 большие карточки:
     - "ЭКО Конь — Органические удобрения" (зелёно-коричневая тема, 3 подлинейки: Био-чай, Специализированные, Грунты)
     - "Цветология — Вертикальное озеленение" (зелёно-серая тема, 2 подлинейки: Фитомодули, Аксессуары)
   - Каждая карточка: фото-placeholder, заголовок, описание (2 строки), кнопка "Перейти →"
   - Десктоп: 2 колонки. Мобиль: 1 колонка.

3. Bestsellers.tsx:
   - Заголовок H2: "Бестселлеры"
   - Загрузка 4 товаров из Supabase (ORDER BY reviews_count DESC LIMIT 4)
   - Используй ProductCard (создай его тут или импортируй):
     - Фото (placeholder 300x300 серый), BrandLabel, название, цена (старая зачёркнута если есть), рейтинг (⭐ + число), badge, кнопка "В корзину"
   - Grid: 4 колонки десктоп, 2 планшет, 1 мобиль
   - Кнопка "Все товары →" → /catalog

4. Benefits.tsx:
   - 4 блока в ряд (иконки из lucide-react):
     - 🌿 Leaf → "Органический состав" / "Без химии. Безопасно для детей и животных"
     - ⭐ Star → "45 000+ отзывов" / "Средний рейтинг 4.9 на маркетплейсах"
     - 🚚 Truck → "Доставка от 99 ₽" / "4 службы доставки по всей России"
     - ♻️ Recycle → "Эко-упаковка" / "Перерабатываемые материалы"
   - Десктоп: 4 колонки. Планшет: 2×2. Мобиль: 1 колонка.

5. Testimonials.tsx:
   - Заголовок H2: "Отзывы наших клиентов"
   - 6 карточек отзывов (статические данные, как с маркетплейсов):
     - Имя, рейтинг (⭐), текст (2-3 предложения), источник ("Ozon" / "Wildberries"), дата
   - Горизонтальный скролл на мобиле, grid 3×2 на десктопе
   - Создай реалистичные тексты отзывов про удобрения и фитомодули

6. Newsletter.tsx:
   - Фон brand-cream, текст по центру
   - "Подпишитесь на новинки и акции"
   - Input email + Button "Подписаться"
   - Текст: "Скидка 10% на первый заказ по промокоду WELCOME10"
   - Пока без логики отправки (заглушка)

7. page.tsx — собери все секции:
   <Hero />
   <ProductLines />
   <Bestsellers />
   <Benefits />
   <Testimonials />
   <Newsletter />

8. SEO: metadata в page.tsx:
   title: "Эко Конь — органические удобрения и вертикальные сады | Доставка по России"
   description: "Био-чай для растений, фитомодули для вертикального озеленения. 45 000+ отзывов, рейтинг 4.9. Доставка от 99 ₽."
   openGraph с title, description, type: 'website'

Проверь:
- Все 6 секций видны и корректно расположены
- CTA в Hero ведут на /catalog/*
- Бестселлеры загружаются из Supabase (если БД не подключена — используй моковые данные)
- Responsive на 375px / 768px / 1440px
- Lighthouse > 85
```

---

## ПРОМПТ 5: Product Catalog (мультилинейный)

```
Создай каталог товаров с фильтрами по линейкам, категориям, бренду, цене. Это мультилинейный каталог для двух брендов.

Файлы:
- src/app/catalog/page.tsx
- src/app/catalog/[product-line]/page.tsx
- src/components/ProductCard.tsx (если ещё нет — создай)
- src/components/CatalogFilters.tsx
- src/components/CatalogSort.tsx
- src/lib/catalog.ts

1. lib/catalog.ts — функции запросов:
   - getProducts(filters) → products[] с пагинацией
   - getProductLines() → product_lines[]
   - getCategories(productLineId?) → categories[]
   Фильтры: brand, product_line, category, priceMin, priceMax, rating, sort (popularity/price_asc/price_desc/rating/newest), page, limit

2. ProductCard.tsx:
   - Фото (300×300, object-cover, rounded-t-xl)
   - BrandLabel (ЭКО Конь / Цветология) в левом верхнем углу фото
   - Badge (bestseller/new/sale) в правом верхнем
   - Название (line-clamp-2)
   - Рейтинг: ⭐ 4.9 (9 762)
   - Цена: 626 ₽ (если price_old: ~~1 160 ₽~~ зачёркнута + badge "-46%")
   - Кнопка "В корзину" (пока без логики, добавим в промпте 7)
   - Hover: shadow-lg, небольшой scale
   - Ссылка на /product/[slug] по клику на карточку (кроме кнопки)

3. CatalogFilters.tsx:
   - Десктоп: сайдбар слева (w-64)
   - Мобиль: кнопка "Фильтры" → выдвижная панель снизу (sheet)
   - Фильтры:
     - Бренд: checkbox ☐ ЭКО Конь ☐ Цветология
     - Категория: checkboxes (зависят от выбранного бренда/линейки)
     - Цена: два input (от / до) или range slider
     - Рейтинг: от 4.0+ (radio)
   - Кнопка "Сбросить фильтры"
   - URL query params (?brand=ecokon&priceMin=500) для шаринга и SEO

4. CatalogSort.tsx:
   - Select dropdown справа над grid
   - Варианты: По популярности (default), Сначала дешёвые, Сначала дорогие, По рейтингу, Новинки
   - Тоже в URL query: ?sort=price_asc

5. /catalog page.tsx:
   - Заголовок H1: "Каталог товаров"
   - Breadcrumbs: Главная → Каталог
   - Layout: CatalogFilters (сайдбар) + Grid товаров + CatalogSort (над grid)
   - Grid: 3 колонки десктоп (с учётом сайдбара), 2 планшет, 1 мобиль
   - Если фильтры пустые — показывать все товары
   - Пагинация внизу (кнопки 1, 2, 3... или "Показать ещё")
   - Если товаров 0: "Товары не найдены. Попробуйте изменить фильтры."

6. /catalog/[product-line] page.tsx:
   - Получает product_line по slug из URL
   - H1: название линейки (например "Био-чай")
   - Breadcrumbs: Главная → Каталог → Био-чай
   - Hero-баннер линейки (описание, фото placeholder)
   - Grid товаров из этой линейки
   - Блок "Почему выбирают [линейку]" (3-4 пункта, статические)
   - Блок "Отлично сочетается с" → ссылка на другую линейку (удобрения ↔ фитомодули)

7. SEO для каждой страницы:
   - generateMetadata() с динамическим title/description
   - Canonical URL
   - JSON-LD BreadcrumbList

Проверь:
- /catalog показывает все 13+ товаров
- Фильтр по бренду работает (показывает только ЭКО Конь или Цветология)
- Фильтр по цене работает
- Сортировка работает
- /catalog/bio-chay показывает только 5 био-чаёв
- /catalog/fitmoduli показывает фитомодули
- BrandLabel и Badge на карточках
- Responsive: 3 → 2 → 1 колонка
- URL query params обновляются при фильтрации
```

---

## ПРОМПТ 6: Product Page

```
Создай страницу товара с галереей, вариантами, характеристиками, отзывами, кросс-продажами и SEO.

Файлы:
- src/app/product/[slug]/page.tsx
- src/components/ProductGallery.tsx
- src/components/VariantSelector.tsx
- src/components/ProductCharacteristics.tsx
- src/components/ProductTabs.tsx
- src/components/Reviews.tsx
- src/components/CrossSell.tsx
- src/components/RelatedProducts.tsx
- src/lib/structured-data.ts

1. page.tsx — Server Component:
   - Загрузка товара по slug из Supabase (с product_line, category)
   - Если не найден → notFound()
   - generateMetadata() — динамический title, description, OG image
   - generateStaticParams() — для SSG всех товаров
   - Layout: 2 колонки (gallery | info), ниже tabs full-width

2. ProductGallery.tsx:
   - Главное фото (aspect-square, rounded-xl)
   - Thumbnails под ним (горизонтальный ряд, max 10)
   - Клик по thumbnail → смена главного фото
   - Zoom on hover (десктоп): scale-150 + cursor-zoom-in
   - Если есть video_url — последний thumbnail с иконкой Play
   - Мобиль: горизонтальный свайп (scroll-snap)

3. Правая часть (info):
   - Breadcrumbs: Главная → Удобрения → Био-чай → [Товар]
   - BrandLabel
   - H1: название
   - Рейтинг: ⭐ 4.9 из 5 (9 762 отзыва) — кликабельно, скролл к отзывам
   - Цена: 626 ₽ (если price_old: ~~1 160 ₽~~ -46%)
   - VariantSelector (если есть variants)
   - Характеристики (краткая таблица: 3-4 ключевых)
   - Количество: input с кнопками +/–, min 1, max stock
   - "Добавить в корзину" (Button primary, full-width)
   - "Купить в 1 клик" (Button secondary) — пока заглушка
   - "В избранное" ♡ (toggle, нужен auth)
   - Информация о доставке: "📦 Доставка от 99 ₽ по всей России (5Post, Boxberry, Почта, СДЭК)"

4. VariantSelector.tsx:
   - Для фитомодулей: выбор цвета (антрацит/зелёный) — цветные кружки
   - При смене варианта: обновить цену (если price_diff != 0) и фото (если есть)

5. ProductTabs.tsx + контент:
   - Tabs: Описание | Характеристики | Отзывы | Как применять
   - Описание: длинный текст из product.description (Markdown → HTML)
   - Характеристики: ProductCharacteristics — таблица из characteristics JSONB
   - Отзывы: Reviews компонент
   - Как применять: из knowledge_base (если привязана статья) или заглушка

6. Reviews.tsx:
   - Rating distribution bar chart (5 звёзд → 4 → 3 → 2 → 1 с процентами)
   - Список отзывов из reviews таблицы (public SELECT)
   - Каждый: автор, рейтинг (звёзды), текст, дата, источник (Ozon/WB/site), badge "Проверенная покупка"
   - Кнопка "Оставить отзыв" → форма (для залогиненных): рейтинг (кликабельные звёзды) + текст + фото upload
   - Если нет отзывов на сайте — показать "Этот товар имеет X отзывов на маркетплейсах" + рейтинг

7. CrossSell.tsx:
   - "С этим покупают" — товары из ДРУГОЙ линейки (если удобрение → фитомодуль, и наоборот)
   - 2-4 карточки ProductCard
   - Логика: если текущий brand=ecokon → показать tsvetologiya, и наоборот

8. RelatedProducts.tsx:
   - "Похожие товары" — товары из той же категории, исключая текущий
   - 4 карточки ProductCard

9. lib/structured-data.ts:
   - generateProductJsonLd(product) → JSON-LD Product schema:
     @type: Product, name, description, image, brand, sku,
     offers: { @type: Offer, price, priceCurrency: RUB, availability, url },
     aggregateRating: { @type: AggregateRating, ratingValue, reviewCount }
   - generateBreadcrumbJsonLd(items) → BreadcrumbList
   - Вставить через <script type="application/ld+json"> в head

Проверь:
- /product/bio-chay-universal-yantar открывается и показывает товар
- Галерея: клик по thumbnail меняет фото
- Варианты переключают цену (для фитомодулей)
- Характеристики отображаются из JSONB
- Кросс-продажи: удобрение показывает фитомодули
- Breadcrumbs корректные
- JSON-LD валиден (проверь через console.log или validator)
- SEO meta теги present
- Responsive: 2 колонки → 1 колонка
```

---

## ПРОМПТ 7: Cart и Zustand Store

```
Создай систему корзины на Zustand с localStorage persist, страницу корзины и проверку промокодов.

Файлы:
- src/store/cartStore.ts
- src/app/cart/page.tsx
- src/components/CartItem.tsx
- src/components/CartSummary.tsx
- src/components/CartRecommendations.tsx
- src/hooks/useCart.ts
- src/app/api/promo/validate/route.ts

1. store/cartStore.ts (Zustand + persist middleware):

interface CartItem {
  product_id: string;
  variant_id?: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  weight_grams: number;
}

interface CartStore {
  items: CartItem[];
  promo: { code: string; discount_type: 'percent'|'fixed'; discount_value: number; discount_amount: number } | null;
  addItem: (item: CartItem) => void;       // если уже есть — +quantity
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  setPromo: (promo: CartStore['promo']) => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotalWeight: () => number;
  getItemCount: () => number;
}

- persist в localStorage, имя 'ecokon-cart'
- addItem: если товар (product_id+variant_id) уже есть → увеличить quantity

2. hooks/useCart.ts — SSR-safe обёртка (useEffect для hydration)

3. /api/promo/validate (POST):
   Body: { code, subtotal, brands }
   Проверка в БД: exists, is_active, valid_from/until, uses_count < uses_limit, min_order_amount, applicable_brands

4. CartItem.tsx: фото 64×64, название (link), вариант, цена, кнопки –/+, сумма строки, удалить

5. CartSummary.tsx:
   - Промокод: input + "Применить"
   - Итого: товары, скидка, доставка (TBD), total
   - Progress bar "Ещё X ₽ до бесплатной доставки" (порог 3000₽)
   - Кнопка "Оформить заказ" → /checkout

6. CartRecommendations.tsx: 2-3 товара кросс-продажи из другой линейки

7. cart/page.tsx: пустая корзина → placeholder; иначе CartItems + CartSummary + Recommendations

8. Обнови Header badge (getItemCount) и кнопку "В корзину" на ProductCard + странице товара

Проверь:
- Добавить товар → виден в /cart
- Количество +/–, удаление
- WELCOME10 → 10% скидка
- Persist при перезагрузке
- Header badge обновляется
- Пустая корзина → placeholder
```

---

## ПРОМПТ 8: Мультидоставка через ApiShip

```
Создай полную интеграцию мультидоставки через ApiShip — агрегатор 4 служб доставки (5Post от 99₽, Boxberry от 200₽, Почта России от 150₽, СДЭК от 250₽).

Файлы:
- src/lib/apiship.ts
- src/types/delivery.ts
- src/app/api/delivery/calculate/route.ts
- src/app/api/delivery/pvz/route.ts
- src/app/api/delivery/cities/route.ts
- src/app/api/delivery/create-order/route.ts
- src/app/api/delivery/track/[id]/route.ts
- src/app/api/delivery/webhook/route.ts
- src/components/DeliveryMap.tsx
- src/components/DeliveryOptions.tsx
- src/components/CityAutocomplete.tsx

1. types/delivery.ts:
   DeliveryOption { provider: 'fivepost'|'boxberry'|'pochta'|'cdek'; provider_name; tariff_id; tariff_name; delivery_type: 'pvz'|'courier'|'postamat'|'post_office'; cost; days_min; days_max }
   PickupPoint { id; provider; name; address; lat; lng; work_time; phone?; type; provider_color }
   City { id; name; region? }

2. lib/apiship.ts:
   BASE_URL = 'https://api.apiship.ru/v1', Authorization: Bearer APISHIP_API_KEY
   - calculateAll(from, to, weight, dims) → DeliveryOption[] sorted by cost
   - getPickupPoints(cityId, providers?) → PickupPoint[]
   - getCities(query) → City[]
   - createOrder(provider, tariffId, orderData) → { orderId, providerNumber }
   - trackOrder(orderId) → { status, history }
   ВАЖНО: если API недоступен — использовать мок-данные (5-6 вариантов тарифов, 20 точек в Москве)

3. API routes: calculate (POST), pvz (POST), cities (GET ?q=), create-order (POST), track/[id] (GET), webhook (POST)

4. CityAutocomplete.tsx: input + debounce 300ms + dropdown городов

5. DeliveryOptions.tsx:
   - Запрос calculate при выборе города
   - Radio buttons: "5Post ПВЗ — 99₽, 5-7 дн." и т.д.
   - Сортировка по цене, первый badge "Выгодно"
   - ПВЗ → показать DeliveryMap
   - Курьер → форма адреса

6. DeliveryMap.tsx (Yandex Maps):
   - Маркеры ПВЗ всех СД (цвета: 5Post=#FF6B35, Boxberry=#E4002B, Почта=#003DA5, СДЭК=#00B33C)
   - Фильтры-чекбоксы по СД
   - Кластеризация
   - Popup: СД, адрес, часы, "Выбрать"
   - Responsive: h-96 desktop, h-64 mobile + список под картой

Проверь:
- Autocomplete городов
- Тарифы всех 4 СД отображаются и сортируются
- Карта: разноцветные маркеры, фильтры, popup, выбор
- Курьер: форма адреса
- Мок-данные работают если нет API ключа
```

---

## ПРОМПТ 9: YooKassa Payment

```
Создай интеграцию YooKassa: создание платежа (5 методов), webhook, онлайн-касса 54-ФЗ.

Файлы:
- src/lib/yookassa.ts
- src/types/yookassa.ts
- src/app/api/payment/create/route.ts
- src/app/api/payment/webhook/route.ts

1. types/yookassa.ts:
   PaymentMethod = 'bank_card'|'sbp'|'sberbank'|'tinkoff_bank'|'installments'
   CreatePaymentRequest { amount, confirmation: {type:'redirect', return_url}, capture: true, description, metadata: {order_id, order_number}, payment_method_data?, receipt }
   YooKassaReceipt { customer: {email, phone?}, items: [{description, amount, vat_code:1, quantity, payment_mode:'full_payment', payment_subject:'commodity'}] }

2. lib/yookassa.ts:
   Auth: Basic base64(shopId:secretKey), Idempotency-Key: uuid
   createPayment(orderData) → { paymentId, confirmationUrl }
   Receipt: каждый order_item + доставка как отдельная позиция, vat_code:1

3. /api/payment/create (POST):
   Загрузить order → сформировать receipt → createPayment → обновить order (payment_id) → return confirmationUrl

4. /api/payment/webhook (POST):
   IP whitelist (YooKassa ranges), идемпотентность
   payment.succeeded → order.status='paid', payment_status='succeeded', создать заказ ApiShip, уведомления
   payment.canceled → order.status='cancelled'
   Return 200 OK

5. Тестовый режим: если YOOKASSA_SHOP_ID не установлен → mock confirmationUrl → /order/{id}?payment=success

Проверь:
- /api/payment/create возвращает confirmationUrl
- Receipt корректен (items + доставка)
- Webhook succeeded → status paid
- Webhook canceled → status cancelled
- Тестовый режим без ключей
```

---

## ПРОМПТ 10: Checkout Flow

```
Создай полный checkout: 3 шага (доставка → данные → оплата), создание заказа, redirect на оплату.

Файлы:
- src/app/checkout/page.tsx
- src/components/checkout/StepIndicator.tsx
- src/components/checkout/DeliveryStep.tsx
- src/components/checkout/PersonalStep.tsx
- src/components/checkout/PaymentStep.tsx
- src/components/checkout/OrderSummary.tsx
- src/app/order/[id]/page.tsx
- src/app/api/orders/create/route.ts

1. StepIndicator: 3 шага визуально (зелёный текущий, галочка пройденный, серый будущий), кликабельные

2. DeliveryStep: CityAutocomplete → DeliveryOptions → DeliveryMap (для ПВЗ) или форма адреса (для курьера). Кнопка "Далее"

3. PersonalStep: react-hook-form + zod: name (min 2), email, phone (маска +7), comment. Если залогинен → подтянуть из profile. "Назад" и "Далее"

4. PaymentStep: radio (карта, СБП, SberPay, Tinkoff Pay, рассрочка, наложенный). Наложенный только для СДЭК/Почта +3%. Чекбокс оферты. "Оплатить XXX₽"

5. OrderSummary: sticky сайдбар — товары мини-список, subtotal, доставка, скидка, total

6. /api/orders/create (POST):
   Валидация zod. Создать order + order_items. Рассчитать total серверно. Если не наложенный → /api/payment/create → return confirmationUrl. Если наложенный → ApiShip сразу → return /order/{id}

7. checkout/page.tsx: корзина пуста → redirect /cart. State: step 1-3. "Оплатить" → create order → redirect → clearCart

8. order/[id]/page.tsx: номер, дата, сумма, статус, доставка (СД+адрес), трек, товары, "Продолжить покупки"

Проверь:
- Полный flow cart → checkout → 3 шага → оплата → order confirmation
- Guest + registered checkout
- Валидация данных
- Order в БД с правильными данными
- Responsive
```

---

## ПРОМПТ 11: Auth и Личный кабинет

```
Создай аутентификацию (Supabase Auth, email/пароль) и личный кабинет.

Файлы:
- src/app/auth/login/page.tsx
- src/app/auth/signup/page.tsx
- src/app/auth/reset-password/page.tsx
- src/app/auth/callback/route.ts
- src/app/account/page.tsx
- src/app/account/orders/page.tsx
- src/app/account/favorites/page.tsx
- src/app/account/layout.tsx
- src/hooks/useAuth.ts
- src/middleware.ts

1. useAuth(): user, profile, loading, signIn, signUp, signOut, resetPassword

2. signup: имя, email, пароль (min 8), confirm. signUp → create profile (role='customer'). "Промокод WELCOME10 на 10%"

3. login: email + пароль. Ошибки. redirect → /account или return_url

4. reset-password: email → resetPasswordForEmail

5. callback/route.ts: exchange code → session → redirect

6. middleware.ts: /account/* → требует auth (redirect /auth/login), /admin/* → требует role='admin'

7. account/layout.tsx: сайдбар (Профиль, Заказы, Избранное, Подписка disabled). "Выйти"

8. account/page.tsx (Профиль): имя, email (readonly), телефон (маска), адреса CRUD. "Сохранить"

9. account/orders: таблица (номер, дата, сумма, статус badge, трек). Expand → товары, доставка, "Повторить заказ" (→ addItems в корзину). Пагинация

10. account/favorites: grid ProductCard из favorites JOIN products. "Удалить", "В корзину"

11. Header: не авторизован → User icon → /auth/login. Авторизован → filled icon → /account

12. "В избранное" на странице товара: не авторизован → login redirect. Авторизован → toggle favorites

Проверь:
- Регистрация → user + profile
- Вход, неверный пароль → ошибка
- /account без auth → redirect
- /admin без admin → redirect
- Профиль: edit name/phone/addresses
- Заказы: список, детали, "Повторить"
- Избранное: add/remove
```

---

## ПРОМПТ 12: Order Tracking и Notifications

```
Создай отслеживание заказов, Telegram-уведомления владельцу, email-уведомления клиентам.

Файлы:
- src/lib/telegram.ts
- src/lib/email.ts
- src/app/api/notifications/telegram/route.ts
- src/app/api/notifications/email/route.ts
- src/components/OrderTracker.tsx

1. lib/telegram.ts:
   sendMessage(chatId, text, parseMode='HTML') → POST telegram API
   Шаблоны:
   - newOrder: "🎉 Новый заказ #N! 💰 Сумма 📍 СД+адрес 📦 Товары 💳 Оплата"
   - statusChange: "📋 Заказ #N — новый статус + трек"

2. lib/email.ts (Brevo API):
   sendTransactional(to, subject, htmlContent)
   Шаблоны HTML (inline CSS, responsive 600px, brand-цвета):
   - orderConfirmation: "Спасибо за заказ!", таблица товаров, итоги, доставка
   - shippingNotification: "Заказ отправлен", трек, ссылка на трекинг, сроки
   - deliveryConfirmation: "Заказ доставлен!", кнопка "Оставить отзыв"

3. /api/notifications/telegram (POST): { type, orderId } → загрузить order+items → отправить

4. /api/notifications/email (POST): { type, orderId } → загрузить → отправить

5. Подключи в payment webhook: succeeded → telegram(new_order) + email(confirmation)
   В delivery webhook: shipped → telegram + email(shipping). delivered → telegram + email(delivery)

6. OrderTracker.tsx:
   Горизонтальная шкала: Оформлен → Оплачен → Отправлен → В пути → Доставлен
   Текущий зелёный, будущие серые. Дата каждого. Кнопка "Отследить на сайте {provider}"
   Показывать на /order/[id] и /account/orders

Проверь:
- Telegram сообщение при заказе (или console.log без TOKEN)
- Email confirmation
- OrderTracker визуально
- Graceful fallback без ключей
```

---

## ПРОМПТ 13: Subscription System (Phase 2)

```
Создай подписку на регулярную доставку удобрений: лендинг, оформление, управление в ЛК, рекуррентные платежи.

Файлы:
- src/app/subscription/page.tsx
- src/app/account/subscription/page.tsx
- src/app/api/subscription/create/route.ts
- src/app/api/subscription/update/route.ts
- src/app/api/subscription/process/route.ts

1. subscription/page.tsx — лендинг подписки:
   - Hero: "Удобрения по подписке — выгоднее на 15%"
   - Как работает: 3 шага (Выбрать товар → Указать интервал → Получать автоматически)
   - Преимущества: скидка 15%, бесплатная доставка от 2000₽, можно пауза/отмена
   - Популярные подписки: 3 карточки (Био-чай универсальный 1 мес, Для орхидей 2 мес, Набор 3 вида)
   - CTA: "Оформить подписку" → /catalog с пометкой subscription mode

2. /api/subscription/create (POST):
   Body: { productId, variantId?, quantity, intervalMonths (1|2|3|6) }
   - Требует auth
   - Создать subscription в БД: status='active', next_delivery=now()+interval
   - Создать первый заказ + платёж (как обычный checkout, но с пометкой)
   - Return: { subscriptionId, orderId, confirmationUrl }

3. /api/subscription/update (POST):
   Body: { subscriptionId, action: 'pause'|'resume'|'cancel'|'change_interval', pauseUntil?, intervalMonths? }
   - pause: status='paused', pause_until
   - resume: status='active', пересчитать next_delivery
   - cancel: status='cancelled'
   - change_interval: обновить interval_months и next_delivery

4. /api/subscription/process (POST):
   - Cron job (вызывается Edge Function или Vercel Cron)
   - SELECT * FROM subscriptions WHERE status='active' AND next_delivery <= CURRENT_DATE
   - Для каждой: создать order, создать платёж (YooKassa saved_payment_method), обновить next_delivery
   - Если оплата не прошла → retry через 3 дня, после 3 попыток → статус 'payment_failed'

5. account/subscription/page.tsx:
   - Список активных подписок: товар, интервал, следующая доставка, статус
   - Действия: "Пауза", "Изменить интервал" (select 1/2/3/6 мес), "Отменить"
   - История платежей по подписке
   - Если нет подписок: "У вас нет активных подписок" + ссылка на /subscription

Проверь:
- Лендинг информативен
- Оформление подписки → order + payment
- Пауза/возобновление/отмена в ЛК
- next_delivery обновляется
```

---

## ПРОМПТ 14: Blog и Knowledge Base (Phase 2)

```
Создай блог и базу знаний с SEO-оптимизацией. Контент хранится в БД (не MDX файлы).

Файлы:
- src/app/blog/page.tsx
- src/app/blog/[slug]/page.tsx
- src/app/knowledge-base/page.tsx
- src/app/knowledge-base/[slug]/page.tsx
- src/components/BlogCard.tsx
- src/lib/blog.ts
- src/lib/markdown.ts

1. lib/markdown.ts:
   - renderMarkdown(content) → HTML (используй простой markdown parser: можно marked или remark)
   - Sanitize HTML (XSS protection)

2. lib/blog.ts:
   - getPosts(category?, page?, limit?) → posts[] с пагинацией
   - getPost(slug) → post + related posts
   - getCategories() → уникальные категории из blog_posts
   - getKBArticles(type?, productId?) → articles[]
   - getKBArticle(slug) → article

3. BlogCard.tsx: cover_image, category badge, title, excerpt (line-clamp-3), date, "Читать →"

4. blog/page.tsx:
   - H1: "Блог"
   - Фильтр по категориям (табы): Все | Комнатные растения | Сад и огород | О продукте | Вертикальное озеленение
   - Grid карточек: 3 колонки desktop, 2 tablet, 1 mobile
   - Пагинация

5. blog/[slug]/page.tsx:
   - Breadcrumbs: Главная → Блог → [Категория] → [Статья]
   - Cover image (full width, max-h-96)
   - H1: title, автор, дата, категория
   - Content → renderMarkdown
   - Блок "Рекомендуемые товары" (если статья о продукте — показать ProductCard)
   - Related posts: 3 карточки из той же категории
   - SEO: generateMetadata, JSON-LD Article

6. knowledge-base/page.tsx:
   - H1: "База знаний"
   - Группировка по типу: Инструкции | Гиды | FAQ | Видео
   - Карточки: иконка типа, title, привязанные товары

7. knowledge-base/[slug]/page.tsx:
   - Content → renderMarkdown
   - Если type='video' и video_url → embed YouTube/VK player
   - Привязанные товары: ProductCard grid
   - SEO: generateMetadata

8. Seed-контент (добавь в seed.sql или отдельный seed):
   Blog:
   - "Как ухаживать за комнатными растениями: полное руководство" (2000+ слов)
   - "Органические удобрения vs химические: честное сравнение" (1500 слов)
   - "Вертикальное озеленение в квартире: от идеи до результата" (1500 слов)
   Knowledge Base:
   - "Инструкция: как применять био-чай ЭКО Конь" (instruction)
   - "Установка настенного фитомодуля Цветология" (instruction, video_url)
   - "Частые вопросы о наших удобрениях" (faq)

Проверь:
- /blog — список статей, фильтр по категориям
- /blog/[slug] — статья рендерится, related posts
- /knowledge-base — список, группировка
- /knowledge-base/[slug] — контент, привязанные товары
- SEO: meta tags, JSON-LD Article
- Markdown рендерится корректно (заголовки, списки, ссылки, изображения)
```

---

## ПРОМПТ 15: Analytics и Retargeting (Phase 2)

```
Подключи Yandex.Metrika e-commerce, VK Pixel, cookie consent, UTM tracking.

Файлы:
- src/components/Analytics.tsx
- src/components/CookieConsent.tsx
- src/lib/analytics.ts
- src/hooks/useAnalytics.ts

1. lib/analytics.ts:
   - trackEvent(name, params) — универсальный трекер
   - E-commerce events (Yandex.Metrika dataLayer):
     - detail (просмотр товара)
     - add (добавление в корзину)
     - remove (удаление из корзины)
     - purchase (покупка)
   - VK Pixel events: PageView, AddToCart, Purchase
   - UTM: парсинг и сохранение в sessionStorage (utm_source, utm_medium, utm_campaign, utm_content, utm_term)

2. hooks/useAnalytics.ts:
   - useTrackPageView() — трекинг при навигации
   - useTrackEvent(name, params) — для кнопок и действий

3. Analytics.tsx (подключение в layout):
   - Yandex.Metrika: <Script> с id из NEXT_PUBLIC_METRIKA_ID, webvisor: true, ecommerce: 'dataLayer'
   - VK Pixel: <Script> с NEXT_PUBLIC_VK_PIXEL_ID
   - Оба загружаются только после принятия cookies

4. CookieConsent.tsx:
   - Баннер внизу экрана (fixed bottom)
   - "Мы используем файлы cookie для улучшения работы сайта"
   - Кнопки: "Принять" (сохранить consent в localStorage, загрузить аналитику) и "Подробнее" → /privacy
   - Если уже принято — не показывать

5. Подключи события:
   - Просмотр товара (/product/[slug]) → detail
   - "В корзину" → add
   - Удаление из корзины → remove
   - Успешная оплата (/order/[id] с payment=success) → purchase

6. UTM tracking:
   - При первом визите: сохранить UTM из URL в sessionStorage
   - При создании заказа: записать utm_* в order metadata (JSONB)

Проверь:
- Метрика загружается после cookie consent
- E-commerce events в dataLayer
- VK Pixel events
- Cookie consent: показывается, запоминает выбор
- UTM сохраняются и передаются в заказ
```

---

## ПРОМПТ 16: Admin — Dashboard и Orders

```
Создай админ-панель: dashboard с KPI и управление заказами.

Файлы:
- src/app/admin/page.tsx
- src/app/admin/layout.tsx
- src/app/admin/orders/page.tsx
- src/components/admin/KpiCards.tsx
- src/components/admin/OrdersTable.tsx
- src/components/admin/OrderDetails.tsx
- src/components/admin/AdminSidebar.tsx

1. admin/layout.tsx:
   - Проверка role='admin' (middleware уже есть, но дополнительная защита)
   - Layout: AdminSidebar (слева, w-64) + content (справа)
   - AdminSidebar: логотип "Админ", навигация:
     📊 Dashboard (/admin)
     📦 Заказы (/admin/orders)
     🛍 Товары (/admin/products)
     ✏️ Контент (/admin/content)
     🏷 Промокоды (/admin/promo-codes)
     📈 Аналитика (/admin/analytics)
     👥 Клиенты (/admin/customers)
     🔄 Синхронизация (/admin/sync) — Phase 3

2. KpiCards.tsx:
   - 4 карточки в ряд:
     - Заказы сегодня / за неделю / за месяц (SELECT COUNT WHERE created_at > ...)
     - Выручка сегодня / за неделю / за месяц (SUM total)
     - Средний чек (AVG total)
     - Конверсия (если есть данные Метрики, иначе placeholder)
   - Каждая: значение (крупно), label, тренд (↑ +12% vs прошлый период) — пока без тренда

3. Dashboard (/admin/page.tsx):
   - KpiCards
   - График заказов по дням (последние 30 дней) — можно recharts или простой SVG
   - Top-5 товаров по продажам (таблица: название, продано шт, выручка)
   - Top-5 городов доставки (таблица: город, заказов)
   - Быстрые действия: "Новый товар", "Новый промокод", "Новая статья"

4. OrdersTable.tsx:
   - Таблица: #, дата, клиент (имя+email), сумма, канал (site/vk/app), статус (Badge), трек, действия
   - Фильтры над таблицей:
     - Статус (select: Все/Pending/Paid/Processing/Shipped/Delivered/Cancelled)
     - Канал (select: Все/Site/VK/App)
     - Дата (от-до date picker)
     - Поиск по номеру заказа или имени клиента
   - Сортировка по дате (desc default), сумме, статусу
   - Пагинация (20 на страницу)
   - Массовые действия: checkbox + "Экспорт CSV", "Изменить статус"

5. OrderDetails.tsx:
   - Modal или expand при клике на заказ
   - Полная информация: товары (таблица), доставка (СД, адрес, трек), оплата (метод, ID), клиент
   - Действия:
     - Изменить статус (select → update order)
     - Ввести трек-номер → update delivery_track
     - Отправить уведомление клиенту (кнопка → /api/notifications/email)
   - История статусов (timeline)

Проверь:
- /admin без роли admin → redirect
- Dashboard: KPI карточки с реальными данными
- График заказов рендерится
- OrdersTable: фильтры, сортировка, поиск
- Смена статуса заказа
- Ввод трек-номера
- Экспорт CSV
```

---

## ПРОМПТ 17: Admin — Products CRUD и Content

```
Создай управление товарами (CRUD) и контентом (блог + база знаний) из админки.

Файлы:
- src/app/admin/products/page.tsx
- src/app/admin/products/new/page.tsx
- src/app/admin/products/[id]/page.tsx
- src/app/admin/content/page.tsx
- src/app/admin/content/blog/new/page.tsx
- src/app/admin/content/blog/[id]/page.tsx
- src/app/admin/content/kb/new/page.tsx
- src/app/admin/content/kb/[id]/page.tsx
- src/components/admin/ProductForm.tsx
- src/components/admin/ContentEditor.tsx
- src/components/admin/ImageUpload.tsx

1. Products list (/admin/products):
   - Таблица: фото (48×48), название, бренд, линейка, цена, остаток, badge, активность (toggle)
   - Поиск по названию
   - Фильтр по бренду/линейке
   - Кнопка "Новый товар" → /admin/products/new
   - Клик по строке → /admin/products/[id]

2. ProductForm.tsx (используется для create и edit):
   - react-hook-form + zod
   - Поля: name, slug (auto-generate из name), short_description, description (textarea), price, price_old, brand (select), product_line (select), category (select), weight_grams, stock, badge (select), rating, reviews_count
   - characteristics: динамические key-value пары (добавить/удалить)
   - variants: динамический список (name, type, value, price_diff, stock, sku)
   - SEO: seo_title, seo_description, seo_og_image

3. ImageUpload.tsx:
   - Drag&drop зона
   - Upload в Supabase Storage (bucket 'products')
   - Превью загруженных фото
   - Сортировка drag&drop (первое фото = основное)
   - Удаление фото
   - Ресайз до 800×800 перед upload (client-side canvas)

4. Create/Edit product:
   - /admin/products/new → пустая ProductForm → INSERT
   - /admin/products/[id] → ProductForm с данными → UPDATE
   - При сохранении: уведомление "Товар сохранён" (toast)
   - Кнопка "Удалить" (с confirm dialog) → soft delete (is_active=false)

5. Content management (/admin/content):
   - 2 табы: Блог | База знаний
   - Блог: таблица (title, category, published/draft, date). "Новая статья"
   - БЗ: таблица (title, type, published/draft). "Новая статья"

6. ContentEditor.tsx:
   - Поля: title, slug, content (textarea с preview или простой WYSIWYG)
   - Для блога: category (select), tags (multi-input), excerpt, cover_image (ImageUpload)
   - Для БЗ: type (select: instruction/guide/faq/video), product_ids (multi-select), video_url
   - SEO: seo_title, seo_description
   - Toggle: "Опубликовать" / "Черновик"

Проверь:
- Список товаров загружается
- Создание нового товара (все поля)
- Редактирование существующего
- Загрузка фото в Supabase Storage
- Drag&drop сортировка фото
- Управление вариантами (add/remove)
- Характеристики (add/remove key-value)
- CRUD блог-статей
- CRUD статей БЗ
- Toggle publish/draft
```

---

## ПРОМПТ 18: Admin — Promo, Analytics, Customers

```
Создай управление промокодами, аналитику по каналам и линейкам, управление клиентами.

Файлы:
- src/app/admin/promo-codes/page.tsx
- src/app/admin/analytics/page.tsx
- src/app/admin/customers/page.tsx
- src/components/admin/PromoForm.tsx
- src/components/admin/Charts.tsx
- src/components/admin/CustomerTable.tsx

1. Промокоды (/admin/promo-codes):
   - Таблица: код, тип (% / фикс), значение, мин.сумма, срок, использований, лимит, активность
   - Кнопка "Новый промокод"
   - PromoForm: code, discount_type (radio: percent/fixed), discount_value, min_order_amount, valid_from, valid_until, uses_limit, applicable_brands (multi-select), is_active
   - Edit/delete существующих
   - Копировать код по клику

2. Аналитика (/admin/analytics):
   - Период: select (7 дней / 30 дней / 90 дней / год)
   - Графики (recharts):
     a) Выручка по дням (LineChart)
     b) Заказы по дням (BarChart)
     c) Продажи по каналам: site vs vk vs app (PieChart)
     d) Продажи по продуктовым линейкам (PieChart)
     e) Продажи по регионам: top-10 городов (BarChart horizontal)
   - Таблица: дата, заказов, выручка, средний чек, конверсия (placeholder)
   - Источники трафика (по UTM): таблица utm_source → заказов, выручка

3. Клиенты (/admin/customers):
   - CustomerTable: имя, email, телефон, заказов (COUNT), LTV (SUM total), дата регистрации, последний заказ
   - Сегменты (табы): Все | Новые (1 заказ) | Повторные (2+) | Подписчики | Неактивные (>90 дней без заказа)
   - Поиск по имени/email
   - Клик → детали: все заказы, LTV, адреса
   - Кнопка "Экспорт CSV" (для email-рассылок через Brevo)

Проверь:
- CRUD промокодов
- Графики рендерятся с реальными данными
- Разбивка по каналам и линейкам
- Список клиентов с LTV
- Сегменты работают
- Экспорт CSV
```

---

## ПРОМПТ 19: SEO, Performance и Accessibility

```
Оптимизируй SEO, производительность и доступность сайта.

Файлы:
- public/robots.txt
- src/app/sitemap.ts
- src/app/manifest.ts
- next.config.js (обновить)
- src/app/about/page.tsx
- src/app/delivery/page.tsx
- src/app/contacts/page.tsx
- src/app/privacy/page.tsx
- src/app/terms/page.tsx

1. robots.txt:
   User-agent: *
   Allow: /
   Disallow: /admin
   Disallow: /account
   Disallow: /api
   Disallow: /auth
   Disallow: /checkout
   Sitemap: https://ecokon.ru/sitemap.xml

2. sitemap.ts (dynamic):
   - Статические: /, /catalog, /blog, /knowledge-base, /about, /delivery, /contacts, /subscription
   - Динамические: /product/[slug] (все товары), /catalog/[line] (все линейки), /blog/[slug] (все статьи), /knowledge-base/[slug]
   - lastModified из updated_at

3. manifest.ts (PWA):
   - name: "Эко Конь — органические удобрения"
   - short_name: "Эко Конь"
   - theme_color: "#2D5016"
   - background_color: "#FFFFFF"
   - display: "standalone"
   - icons: 192×192 и 512×512 (создай placeholder SVG)

4. next.config.js оптимизация:
   - images: { remotePatterns (Supabase Storage), formats: ['image/avif', 'image/webp'] }
   - compress: true
   - headers: cache-control для статики

5. Статические страницы (минимальный контент):
   - /about: "О компании" — история КФХ Ранчо Мушкино, миссия, команда
   - /delivery: "Доставка и оплата" — таблица 4 СД (5Post, Boxberry, Почта, СДЭК) + сроки + цены, способы оплаты, бесплатная доставка от 3000₽
   - /contacts: email, телефон, адрес, карта (Yandex Maps embed), форма обратной связи (заглушка)
   - /privacy: заглушка "Политика конфиденциальности" (стандартный текст)
   - /terms: заглушка "Публичная оферта" (стандартный текст)
   - Все с metadata

6. SEO audit по сайту:
   - JSON-LD Organization на главной
   - JSON-LD WebSite с SearchAction
   - Canonical URL на каждой странице
   - OG tags на каждой странице
   - Alt text на всех <img> (проверь и добавь где нет)
   - Heading hierarchy: один H1 на страницу

7. Performance:
   - Lazy load для изображений ниже fold (next/image уже делает, но проверь)
   - Dynamic import для тяжёлых компонентов (DeliveryMap, Charts)
   - Prefetch для ключевых маршрутов (/catalog, /product)

8. Accessibility (WCAG 2.1 AA):
   - Keyboard navigation: все интерактивные элементы focusable, Tab order логичен
   - Contrast ratio ≥ 4.5:1 (проверь brand-green #2D5016 на белом → OK ✓)
   - Focus visible: outline на кнопках и ссылках
   - ARIA labels на иконках (корзина, профиль, закрыть)
   - Skip to content link

Проверь:
- Lighthouse > 90 на /, /catalog, /product/[slug]
- LCP < 2.5s
- robots.txt правильный
- sitemap.xml содержит все URL (статические + динамические)
- JSON-LD валиден (Organization, WebSite, Product, Article, BreadcrumbList)
- Alt text на всех изображениях
- Keyboard navigation работает
- Contrast ≥ 4.5:1
```

---

## ПРОМПТ 20: QA, Security и Deploy

```
Финальный промпт: security audit, QA проверка, подготовка к production deploy на Vercel.

Файлы:
- vercel.json
- .env.example (финальный)
- src/app/not-found.tsx
- src/app/error.tsx

1. Security audit — проверь и исправь:
   - [ ] Все secrets только в .env, ни одного hardcoded
   - [ ] RLS активирован на ВСЕХ таблицах (проверь каждую)
   - [ ] API routes: все POST body валидируются через zod
   - [ ] CORS: только ecokon.ru в production
   - [ ] Rate limiting на /api/payment/*, /api/delivery/*, /api/promo/* (простой in-memory или Upstash Redis)
   - [ ] XSS: sanitize user input (отзывы, комментарии)
   - [ ] CSRF: проверка origin header
   - [ ] Webhook signatures: YooKassa (IP whitelist), ApiShip (проверка токена)
   - [ ] SQL injection: параметризованные запросы (Supabase SDK уже делает, но проверь raw queries)
   - [ ] File upload: проверка типа и размера (только изображения, max 5MB)
   - [ ] Admin routes: double-check role='admin' enforcement

2. Error pages:
   - not-found.tsx: "404 — Страница не найдена", ссылки на каталог и главную, дизайн в стиле сайта
   - error.tsx: "Что-то пошло не так", кнопка "Попробовать снова" (reset), кнопка "На главную"

3. vercel.json:
   {
     "framework": "nextjs",
     "regions": ["fra1"],
     "crons": [
       { "path": "/api/subscription/process", "schedule": "0 6 * * *" }
     ]
   }
   Регион fra1 (Frankfurt) — ближайший к России из доступных.

4. .env.example — финальный список всех переменных с комментариями

5. QA checklist — пройди по всему сайту:

   Каталог:
   - [ ] Все 13+ товаров видны
   - [ ] Фильтры (бренд, линейка, цена, рейтинг)
   - [ ] Сортировка
   - [ ] /catalog/bio-chay — только био-чай
   - [ ] BrandLabel и Badge на карточках

   Товар:
   - [ ] Галерея (thumbnails, zoom)
   - [ ] Варианты (цвет для фитомодулей)
   - [ ] "В корзину" работает
   - [ ] "В избранное" работает
   - [ ] JSON-LD валиден

   Корзина → Checkout:
   - [ ] Добавить/удалить товары
   - [ ] Промокод WELCOME10
   - [ ] 3 шага checkout
   - [ ] Расчёт доставки (4 СД)
   - [ ] Карта ПВЗ
   - [ ] Оплата → order confirmation

   Auth:
   - [ ] Регистрация
   - [ ] Вход
   - [ ] ЛК: профиль, заказы, избранное
   - [ ] /admin без admin → redirect

   Build:
   - [ ] npm run build — 0 errors
   - [ ] npm run lint — 0 errors
   - [ ] Lighthouse > 90 на /, /catalog, /product/[slug]

6. Deploy:
   - npm run build && проверить что нет ошибок
   - Настроить environment variables в Vercel Dashboard
   - Подключить домен ecokon.ru
   - Настроить Supabase production project (отдельный от dev)
   - Проверить все интеграции в production: YooKassa, ApiShip, Telegram, Brevo

Проверь:
- npm run build — 0 errors, 0 warnings (критических)
- Все security items ✓
- Error pages отображаются
- vercel.json корректен
- .env.example полный
- QA checklist пройден
```

---

**Готово! Все 20 промптов написаны. Выполняй последовательно: 1 → 2 → 3 → ... → 20. Не переходи к следующему, пока текущий не работает и не протестирован.**
