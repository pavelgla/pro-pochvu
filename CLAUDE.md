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
