# pro-pochvu.ru — D2C экосистема (ранее ecokon.ru)

> **Источник истины этого файла обновлён 2026-05-07.** Сверять с git и `_SUMMARY.md` при сомнениях.

## Что это

D2C интернет-магазин КФХ «Ранчо Мушкино». Зонтичный бренд витрины — **«Пропочву»**. Под зонтиком два товарных бренда:
- **ЭКО Конь** — органические удобрения (биогумус, конский навоз).
- **Цветология** — фитомодули для вертикального озеленения. Управляется feature-флагом, может быть скрыт без потери данных в БД.

Домен: `pro-pochvu.ru`, зеркало `пропочву.рф`. Старое имя `ecokon.ru` больше не используется на витрине, но остаётся в служебных названиях (контейнеры, путь на VPS).

## Стек (зафиксирован — альтернативы не предлагать)

- **Frontend:** Next.js 14 (App Router) + TypeScript (strict) + Tailwind CSS
- **БД / ORM:** PostgreSQL 16 (self-hosted в Docker, контейнер `ecokon-db`) + Prisma 5
- **Auth:** NextAuth (JWT strategy) + `@next-auth/prisma-adapter` + `CredentialsProvider` (bcryptjs). Никакого Supabase Auth.
- **State:** Zustand (`src/store/cartStore.ts`, persist в localStorage)
- **Формы:** React Hook Form + Zod
- **Платежи:** YooKassa с 54-ФЗ (`src/lib/yookassa.ts`, mock-mode если нет ключей)
- **Доставка:** ApiShip (`src/lib/apiship.ts`) — 5Post, Boxberry, Почта России, СДЭК. Карты ПВЗ — Yandex Maps JS API.
- **Уведомления:** Telegram Bot (`src/lib/telegram.ts`) + nodemailer SMTP через Mail.ru для бизнеса (`src/lib/email.ts`)
- **Маркетплейсы:** скрипты синхронизации цен/отзывов с WB и Ozon (`scripts/sync-*.ts`)
- **Аналитика:** Яндекс.Метрика (soft mode, webvisor + clickmap) + серверный канал purchase через offline conversions API (`src/lib/analytics-server.ts`)

> Папка `supabase/` — наследие до миграции на Prisma (см. `docs/Промпт_12.1_Миграция_Prisma_NextAuth.md`). SQL-миграции там не используются, истинная схема — `prisma/schema.prisma`.

## Структура

```
src/
  app/                   # App Router — страницы и API routes
    api/                 # auth, catalog, orders, payment, delivery, promo, leads,
                         #   user, notifications, reviews, blog, sync, indexnow
    catalog/             # /catalog и /catalog/[product-line]
    account/             # ЛК — orders, favorites, profile
    admin/               # пока заглушка (роль admin через middleware)
    checkout/, cart/, product/[slug]/, order/[id]/
    knowledge-base/, knowledge-base/video/
    blog/                # пустой раздел — ждёт контент
    yandex_53a70f2c26dfd38f.html/   # route handler — Я.Вебмастер verification
  components/
    ui/                  # Button, Card, Badge, Input, Select, Modal, Tabs, Spinner, Ornament, ConsentCheckbox
    sections/            # секции главной (Hero, ProductLines, BrandSplit и т.д.)
    checkout/            # шаги checkout
    analytics/           # Metrika.tsx, ClickTracker.tsx, PurchaseTracker.tsx
    admin/               # компоненты админки
    Header, Footer, ProductCard, DeliveryMap, MarketplaceLeadModal, CookieBanner, …
  lib/
    prisma.ts, auth.ts, catalog.ts, yookassa.ts, apiship.ts,
    telegram.ts, email.ts, structured-data.ts, marketplace-map.ts,
    analytics.ts, analytics-server.ts, indexnow.ts, constants.ts, utils.ts
  store/cartStore.ts
  types/                 # database.ts, delivery.ts, yookassa.ts, analytics.d.ts, next-auth.d.ts
  hooks/                 # useCart, useAuth
  middleware.ts          # rewrite IndexNow ключ-файла + защита /admin, /account
prisma/
  schema.prisma, migrations/, seed.ts
scripts/                 # backup-db, deploy-migrate, indexnow-bulk, sync-wb-*, sync-ozon-*, download-wb-images
deploy/                  # nginx-конфиг pro-pochvu.conf и скрипты для VPS
```

## Команды

```bash
npm run dev                                       # dev на localhost:3000
npm run build                                     # production build
npm run lint                                      # ESLint
npx prisma migrate dev                            # локальная миграция
npx prisma generate                               # регенерация клиента после правок schema.prisma

# Маркетплейсы (прод-данные!)
npm run sync:reviews:wb
npm run sync:reviews:ozon
npm run sync:reviews:all
npx tsx scripts/sync-wb-prices.ts
npx tsx scripts/sync-ozon-prices.ts

# Прод (на VPS)
docker compose -f docker-compose.prod.yml up -d
```

## Деплой

GitHub Actions (`.github/workflows/deploy.yml`) → GHCR → SSH деплой на VPS spb1. Триггер — push в `main`. CI прогоняет `prisma migrate deploy` + `next build` против тестового postgres, потом собирает образ и деплоит.

- **GHCR-образ:** `ghcr.io/pavelgla/pro-pochvu/web:latest` (плюс тег по SHA)
- **VPS-путь:** `~/ecokon/` (намеренно НЕ переименован при ребрендинге — рядом с `~/pdnguard/`)
- **Контейнеры:** `ecokon-web` (Next.js standalone, порт `3002`) и `ecokon-db` (postgres:16-alpine). Имена тоже намеренно сохранены.
- **Nginx:** общий с pdnguard, конфиг `~/ecokon/deploy/nginx/pro-pochvu.conf` маунтится в контейнер `pdnguard-nginx`.
- **SSL:** Let's Encrypt через Certbot.
- **Локальный путь репо:** `~/Obsidian/pro-pochvu` (с 2026-05-04, переехало с `~/Obsidian/ecokon.ru/ecokon`).
- **Origin:** `https://github.com/pavelgla/pro-pochvu.git` (репо переименован 2026-05-04 с `pavelgla/ecokon`).
- **Миграции БД:** прогоняются при старте контейнера автоматически (`scripts/deploy-migrate.sh` или entrypoint).

## Env

`NEXT_PUBLIC_*` зашиваются в бандл при build (Docker build-args через `docker-compose.prod.yml` и через workflow `build-args`). Серверные секреты — через `environment` в compose, реальные значения подставляются `set_env` в SSH-шаге деплоя из GitHub Secrets.

Минимально необходимый набор серверных env (см. `.env.example`):
`DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`,
`YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY`,
`APISHIP_API_KEY`, `APISHIP_FROM_CITY_ID`, `APISHIP_PLATFORM_ID`, `APISHIP_WEBHOOK_SECRET`,
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`,
`EMAIL_SMTP_HOST/PORT/USER/PASS/FROM/SECURE`,
`OZON_CLIENT_ID/API_KEY` (+ `OZON2_*` для второго кабинета),
`WB_API_KEY`, `WB2_API_KEY`, `WB_STATS_KEY`, `WB2_STATS_KEY`, `WB_PRICES_KEY`, `WB2_PRICES_KEY`,
`INDEXNOW_KEY`, `ADMIN_API_TOKEN`, `YANDEX_OAUTH_TOKEN`.

Build-args: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_YMAPS_API_KEY`, `NEXT_PUBLIC_METRIKA_ID`, `NEXT_PUBLIC_VK_PIXEL_ID`, `NEXT_PUBLIC_SHOW_TSVETOLOGIYA`, `NEXT_PUBLIC_YANDEX_VERIFICATION`, `NEXT_PUBLIC_GOOGLE_VERIFICATION`, `NEXT_PUBLIC_MAILRU_VERIFICATION`.

## Feature flag: Цветология

`NEXT_PUBLIC_SHOW_TSVETOLOGIYA` (build-arg, по умолчанию `true`). Зашит в бандл — после смены **обязателен редеплой**.

При `"false"` скрываются:
- логотип «Цветология» в шапке;
- пункт «Фитомодули» в меню (desktop + mobile);
- секция «Цветология» на главной (ProductLines);
- чекбокс бренда в фильтрах каталога;
- URL `/catalog/fitmoduli` и все tsvetologiya-линейки → 404;
- cross-sell блоки с фитомодулями на карточках ЭКО Конь.

Данные в БД (товары, заказы, отзывы) при этом не трогаются.

## SEO

**Подтверждение прав:**
- Яндекс.Вебмастер — route handler `src/app/yandex_53a70f2c26dfd38f.html/route.ts` + мета-тег `yandex-verification` (env). Хэш `53a70f2c26dfd38f` зашит в CI build-args как fallback.
- Google Search Console — мета-тег `google-site-verification` через env (build-arg в CI).
- Mail.ru вебмастер — env `NEXT_PUBLIC_MAILRU_VERIFICATION` (опционально, не подключён).

**Sitemap & robots:** App Router — `src/app/sitemap.ts`, `src/app/robots.ts`. Sitemap тянет товары и линейки из БД через Prisma, учитывает `SHOW_TSVETOLOGIYA`, исключает `?brand=`/`/auth/*`/`/cart`/`/checkout`/`/order/*`/`/test-ui`/`/legal`.

**JSON-LD:** `src/lib/structured-data.ts` — `generateProductJsonLd`, `generateBreadcrumbJsonLd`, `generateOrganizationJsonLd`, `generateWebSiteJsonLd`, `generateFaqJsonLd`. Organization + WebSite инжектятся в `<head>` через `layout.tsx`.

**IndexNow:**
- Ключ в env `INDEXNOW_KEY`. Файл `/{KEY}.txt` отдаётся динамически через `src/middleware.ts` → `/api/indexnow/verify`.
- Admin-эндпоинты: `POST /api/indexnow/bulk`, `POST /api/indexnow/ping`. Авторизация: NextAuth `role=admin` **или** заголовок `X-Admin-Token: $ADMIN_API_TOKEN`.
- CLI: `npx tsx scripts/indexnow-bulk.ts`.
- Клиент: `src/lib/indexnow.ts` (`pingIndexNow`, `pingIndexNowBulk`, `pingIndexNowAsync`).

**Текущий статус и TODO:** см. `SEO_TODO.md` в корне репо.

## Аналитика (Я.Метрика)

- **Soft mode** (решено 2026-05-04): счётчик грузится сразу с webvisor + clickmap, cookie-баннер только информационный — не блокирует трекинг. Без согласия пользователя данные собираются — типовая практика на RU-сайтах. Жёсткий режим теряет данные тех, кто не нажимает кнопки.
- `src/components/analytics/Metrika.tsx` — Server Component + `next/script`.
- `src/components/analytics/ClickTracker.tsx` — делегатор: один listener на `document` для `tel:` / `t.me/` / `wa.me/` ссылок и сабмитов форм с `data-track-form="<id>"`. Не нужно оборачивать каждую ссылку.
- `src/components/analytics/PurchaseTracker.tsx` — клиентский трекер на `/order/[id]?payment=success`, идемпотентен через `sessionStorage[metrika:purchase:<orderId>]`.
- `src/lib/analytics.ts` — типизированные обёртки: `trackGoal`, `trackAddToCart`/`trackRemoveFromCart` (вшиты в `cartStore`), `trackBeginCheckout` (на `/checkout`), `trackPurchase`, `trackPhoneClick`, `trackTelegramClick`, `trackLeadFormSubmit`, `pushEcommerce`, `readYandexClientId` (читает `_ym_uid`).
- **Серверный канал (offline conversions):** `_ym_uid` → `/api/orders/create` → `/api/payment/create` → YooKassa `metadata.ym_client_id` → `/api/payment/webhook` → `pushPurchaseToMetrika()` (`api-metrika.yandex.net/.../offline_conversions/upload`, CSV upload, OAuth). Если `YANDEX_OAUTH_TOKEN` пуст — серверный канал тихо отключается, клиентский трекинг работает.
- Цели и YANDEX_OAUTH_TOKEN надо настроить вручную в UI Метрики после деплоя — см. `SEO_TODO.md`.

## Правила работы с кодом

- **Язык:** код, имена переменных, комментарии — английский. Контент сайта и UI-строки — русский.
- **TypeScript strict:** не использовать `any`. Re-export типов из `prisma/client` через `src/types/database.ts`.
- **Server Components по умолчанию.** `"use client"` только там, где нужен state/effects/браузерные API.
- **API routes:** всегда возвращать `Response.json()` или `NextResponse.json()` со статусом, валидировать вход Zod, не отдавать `500` без логирования.
- **Платежи:** любые изменения payment flow → проверять 54-ФЗ (чек, состав корзины, налоги). Webhook `/api/payment/webhook` обязан быть идемпотентным.
- **Цена и скидка** — только из БД. Не доверять `body.total`/`body.promoDiscount` от клиента (см. `docs/SECURITY_AUDIT_2026-04-09.md`).
- **Промокоды:** инкремент `usesCount` — внутри `prisma.$transaction` вместе с созданием Order.
- **Доставка:** не хардкодить тарифы — всё через ApiShip API. Для ПВЗ кэшировать ответы.
- **Prisma:** Service-side singleton через `src/lib/prisma.ts`. Никогда не импортировать `PrismaClient` напрямую в Server Components.
- **Не коммитить:** `.env*`, `node_modules`, `.next`, `_SUMMARY.md` (vault-only artefact, в `.gitignore`), секреты, дампы БД.

## Перед коммитом

1. `npm run build` — должен проходить чисто.
2. `npm run lint` — без ошибок.
3. `npx prisma validate` — если трогали `schema.prisma`.
4. Проверить, что не сломан feature-flag Цветологии (при `false` нет битых ссылок).

## Чего не делать

- Не предлагать миграцию обратно на Supabase / на другой ORM / другой фреймворк / другую платёжку — стек зафиксирован.
- Не использовать `pages/` — только App Router.
- Не писать псевдокод — давать рабочие сниппеты с импортами.
- Не добавлять новые UI-библиотеки без обсуждения (есть Tailwind + свои компоненты в `src/components/ui/`).
- Не предлагать Vercel/Netlify — деплой только Docker на свой VPS.
- Не переименовывать VPS-путь `~/ecokon/` и контейнеры `ecokon-web`/`ecokon-db` — это сломает nginx и существующий volume `ecokon_pgdata`.

## Стиль ответов (от Павла)

Конкретно, по-русски, код и термины — английские. Если задача большая — сначала план, потом реализация. Если не уверен — сказать прямо.

## Ключевые внутренние документы

- `_SUMMARY.md` — vault-only снимок состояния и текущих задач (в `.gitignore`).
- `SEO_TODO.md` — план SEO, статус по этапам.
- `docs/PROJECT_BRIEF.md` — полный технический бриф (от 2026-04-09).
- `docs/Отчёт_2026-04-21_2026-05-04.md` — что сделано за двухнедельный спринт ребрендинга и SEO-фундамента.
- `docs/SECURITY_AUDIT_2026-04-09.md` — найденные уязвимости и принципы фиксов.
- `docs/Промпт_12.1_Миграция_Prisma_NextAuth.md` — миграция со Supabase Auth на Prisma + NextAuth (исторический контекст).
