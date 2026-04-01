# Ecokon.ru — D2C экосистема

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
