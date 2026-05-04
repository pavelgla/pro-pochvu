# pro-pochvu.ru — D2C экосистема (ранее ecokon.ru)

## Стек
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (PostgreSQL + Auth + Storage)
- YooKassa (платежи, 54-ФЗ)
- ApiShip (мультидоставка: 5Post, Boxberry, Почта, СДЭК)
- Yandex Maps JS API

## Деплой
- Docker (Next.js standalone, порт 3002)
- Nginx reverse proxy (общий с pdnguard)
- GitHub Actions → GHCR → SSH deploy на VPS
- SSL: Let's Encrypt через Certbot
- VPS: ~/ecokon (рядом с ~/pdnguard)

## Команды
- `npm run dev` — dev сервер (localhost:3000)
- `npm run build` — production build
- `docker compose -f docker-compose.prod.yml up -d` — production

## Env
- NEXT_PUBLIC_* — зашиваются при build (Docker build-args)
- Серверные — передаются через environment в docker-compose

## Включение/выключение бренда Цветология

Управляется флагом `NEXT_PUBLIC_SHOW_TSVETOLOGIYA` в `docker-compose.prod.yml` (build args).
Флаг зашивается в бандл при сборке — нужен **редеплой** при смене.

**Выключить** (скрыть с сайта, данные в БД остаются):
```yaml
# docker-compose.prod.yml → services.web.build.args:
NEXT_PUBLIC_SHOW_TSVETOLOGIYA: "false"
```
Затем: `git push` → CI/CD пересоберёт образ → задеплоит автоматически.

**Включить** (вернуть Цветологию):
```yaml
NEXT_PUBLIC_SHOW_TSVETOLOGIYA: "true"
```
Или удалить строку — по умолчанию `true`.

**Что скрывается при `false`:**
- Логотип «Цветология» в шапке
- Пункт «Фитомодули» в меню (desktop + mobile)
- Секция «Цветология» на главной (ProductLines)
- Чекбокс бренда в фильтрах каталога
- URL `/catalog/fitmoduli` и все tsvetologiya-линейки → 404
- Cross-sell блоки с фитомодулями на карточках товаров ЭКО Конь

**Данные в БД** (товары, заказы, отзывы) не трогаются.

## SEO

**Подтверждение прав:**
- Яндекс.Вебмастер — `public/yandex_53a70f2c26dfd38f.html` (хэш `53a70f2c26dfd38f` = значение мета-тега `yandex-verification`).
- Google Search Console — подтверждён.
- Мета-теги через env (build-args): `NEXT_PUBLIC_YANDEX_VERIFICATION`, `NEXT_PUBLIC_GOOGLE_VERIFICATION`, `NEXT_PUBLIC_MAILRU_VERIFICATION`.

**Sitemap & robots:** генерятся App Router — `src/app/sitemap.ts` и `src/app/robots.ts`. Sitemap тянет товары и линейки из БД, учитывает `SHOW_TSVETOLOGIYA`.

**JSON-LD:** `src/lib/structured-data.ts` — Product, Breadcrumb, Organization, WebSite, FAQ. Organization + WebSite инжектятся в `<head>` через `layout.tsx`.

**IndexNow:**
- Ключ в env: `INDEXNOW_KEY` (8–128 hex/alphanum).
- Файл-подтверждение отдаётся динамически: `/{KEY}.txt` → middleware → `/api/indexnow/verify` (в `/public` ничего не лежит).
- Admin-эндпоинты: `POST /api/indexnow/bulk` (весь sitemap), `POST /api/indexnow/ping` (точечно). Авторизация: NextAuth role=admin **или** заголовок `X-Admin-Token: $ADMIN_API_TOKEN`.
- CLI: `npx tsx scripts/indexnow-bulk.ts`.
- Клиент: `src/lib/indexnow.ts`.

**Текущий статус и TODO:** см. `SEO_TODO.md` в корне репо.
