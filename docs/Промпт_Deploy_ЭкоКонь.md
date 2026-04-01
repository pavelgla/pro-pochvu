# ПРОМПТ ДЛЯ CLAUDE CODE: Production Deploy ecokon.ru

> Запускать в папке `/home/gpaul/Obsidian/ecokon.ru`
> Перед запуском: убедись что есть доступ к `/home/gpaul/Obsidian/pdnguard`

---

```
Подготовь production-деплой для ecokon.ru по аналогии с существующим проектом pdnguard. Оба проекта будут работать на одном VPS через общий Nginx reverse proxy.

== КОНТЕКСТ ==

На VPS (~/pdnguard) уже работает pdnguard.ru:
- Docker Compose: PostgreSQL, Redis, Express API (:3001), Next.js Web (:3000), Nginx (:80/:443), Certbot
- CI/CD: GitHub Actions → GHCR → SSH deploy
- SSL: Let's Encrypt через Certbot

Проект ecokon.ru — это Next.js 14 (App Router) + Supabase (внешний). Своей БД нет — только контейнер с Next.js приложением.

Оба проекта должны жить на одном VPS, за общим Nginx, каждый со своим доменом и SSL.

== АРХИТЕКТУРА ==

1. Общая Docker-сеть `webproxy` (external) связывает контейнеры обоих проектов
2. Nginx обслуживает оба домена (pdnguard.ru + ecokon.ru)
3. Certbot выдаёт сертификаты для обоих доменов
4. Каждый проект — свой docker-compose, свой GitHub repo, свой CI/CD pipeline

Схема:
```
Internet
  │
  ▼
Nginx (:80/:443)  ← общий контейнер
  ├── pdnguard.ru → pdnguard-web:3000 + pdnguard-api:3001
  └── ecokon.ru   → ecokon-web:3002
```

== ЗАДАЧИ ==

### 1. Создай Dockerfile для ecokon

Путь: `Dockerfile` (в корне ecokon.ru, рядом с package.json)

Аналогичен pdnguard/apps/web/Dockerfile, но проще (нет монорепо):

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args для клиентских env
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL=https://ecokon.ru
ARG NEXT_PUBLIC_YMAPS_API_KEY
ARG NEXT_PUBLIC_METRIKA_ID
ARG NEXT_PUBLIC_VK_PIXEL_ID

ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_YMAPS_API_KEY=${NEXT_PUBLIC_YMAPS_API_KEY}
ENV NEXT_PUBLIC_METRIKA_ID=${NEXT_PUBLIC_METRIKA_ID}
ENV NEXT_PUBLIC_VK_PIXEL_ID=${NEXT_PUBLIC_VK_PIXEL_ID}

RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3002
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3002/ || exit 1

CMD ["node", "server.js"]
```

ВАЖНО: ecokon — НЕ монорепо, поэтому:
- Standalone build даёт server.js в корне (не apps/web/server.js)
- Static файлы в .next/static (не apps/web/.next/static)
- Порт 3002 (чтобы не конфликтовать с pdnguard на 3000)

Проверь что в next.config.mjs (или next.config.js) есть:
```js
output: 'standalone'
```
Если нет — добавь.

### 2. Создай docker-compose.prod.yml для ecokon

Путь: `docker-compose.prod.yml`

```yaml
services:
  web:
    image: ghcr.io/pavelgla/ecokon/web:${IMAGE_TAG:-latest}
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
        NEXT_PUBLIC_SITE_URL: https://ecokon.ru
        NEXT_PUBLIC_YMAPS_API_KEY: ${NEXT_PUBLIC_YMAPS_API_KEY:-}
        NEXT_PUBLIC_METRIKA_ID: ${NEXT_PUBLIC_METRIKA_ID:-}
        NEXT_PUBLIC_VK_PIXEL_ID: ${NEXT_PUBLIC_VK_PIXEL_ID:-}
    container_name: ecokon-web
    restart: always
    environment:
      NODE_ENV: production
      # Server-side env (не NEXT_PUBLIC_)
      SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY}
      YOOKASSA_SHOP_ID: ${YOOKASSA_SHOP_ID}
      YOOKASSA_SECRET_KEY: ${YOOKASSA_SECRET_KEY}
      APISHIP_API_KEY: ${APISHIP_API_KEY}
      APISHIP_FROM_CITY_ID: ${APISHIP_FROM_CITY_ID}
      APISHIP_PLATFORM_ID: ${APISHIP_PLATFORM_ID:-}
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
      TELEGRAM_CHAT_ID: ${TELEGRAM_CHAT_ID}
      BREVO_API_KEY: ${BREVO_API_KEY}
      BREVO_SENDER_EMAIL: ${BREVO_SENDER_EMAIL:-noreply@ecokon.ru}
    networks:
      - webproxy

networks:
  webproxy:
    external: true
```

### 3. Создай deploy/ конфигурации

#### deploy/nginx/ecokon.conf

Nginx server block для ecokon.ru:

```nginx
# ecokon.ru — redirect HTTP → HTTPS
server {
    listen 80;
    server_name ecokon.ru www.ecokon.ru;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://ecokon.ru$request_uri;
    }
}

# ecokon.ru — HTTPS
server {
    listen 443 ssl;
    http2 on;
    server_name ecokon.ru www.ecokon.ru;

    ssl_certificate /etc/letsencrypt/live/ecokon.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ecokon.ru/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;

    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml image/svg+xml;

    # Next.js API routes (payment webhooks, delivery webhooks, etc.)
    location /api/ {
        proxy_pass http://ecokon-web:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
        proxy_buffering off;
    }

    # Next.js static assets — long cache
    location /_next/static/ {
        proxy_pass http://ecokon-web:3002;
        proxy_http_version 1.1;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Next.js app
    location / {
        proxy_pass http://ecokon-web:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    client_max_body_size 10M;
}
```

#### deploy/init-ssl.sh

Скрипт для получения SSL-сертификата ecokon.ru:

```bash
#!/bin/bash
set -e

DOMAIN="ecokon.ru"
EMAIL="${CERTBOT_EMAIL:-admin@ecokon.ru}"

echo "=== Получение SSL-сертификата для $DOMAIN ==="

# Убедимся что Nginx запущен с HTTP-only конфигом
# (временно без SSL блока, только для ACME challenge)

# Получить сертификат
docker compose -f ~/pdnguard/docker-compose.prod.yml run --rm certbot \
  certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d $DOMAIN \
  -d www.$DOMAIN \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  --force-renewal

echo "=== SSL-сертификат получен! ==="
echo "Перезагрузка Nginx..."
docker exec pdnguard-nginx nginx -s reload
```

### 4. Обнови pdnguard для поддержки общей сети

Создай файл `deploy/migration-notes.md` с инструкцией:

```markdown
# Миграция на общую Docker-сеть (webproxy)

## Одноразовая настройка на VPS:

### 1. Создать внешнюю сеть
docker network create webproxy

### 2. Обновить pdnguard docker-compose.prod.yml
Добавить в services nginx, api, web:
  networks:
    - internal
    - webproxy

Добавить в корень:
  networks:
    internal:
      driver: bridge
    webproxy:
      external: true

### 3. Обновить pdnguard nginx
Заменить один файл nginx.conf на два:
- deploy/nginx/pdnguard.conf (текущий конфиг с server_name pdnguard.ru)
- deploy/nginx/ecokon.conf (новый конфиг)

Обновить volumes в nginx сервисе:
  volumes:
    - ./deploy/nginx/pdnguard.conf:/etc/nginx/conf.d/pdnguard.conf:ro
    - ~/ecokon/deploy/nginx/ecokon.conf:/etc/nginx/conf.d/ecokon.conf:ro
    - certbot-conf:/etc/letsencrypt:ro
    - certbot-www:/var/www/certbot:ro

### 4. Получить SSL для ecokon.ru
bash ~/ecokon/deploy/init-ssl.sh

### 5. Перезапустить всё
cd ~/pdnguard && docker compose -f docker-compose.prod.yml up -d
cd ~/ecokon && docker compose -f docker-compose.prod.yml up -d
```

### 5. Создай .env.production.example

```env
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# === YooKassa ===
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=

# === ApiShip (мультидоставка) ===
APISHIP_API_KEY=
APISHIP_FROM_CITY_ID=
APISHIP_PLATFORM_ID=

# === Yandex Maps ===
NEXT_PUBLIC_YMAPS_API_KEY=

# === Analytics ===
NEXT_PUBLIC_METRIKA_ID=
NEXT_PUBLIC_VK_PIXEL_ID=

# === Telegram ===
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# === Email (Brevo) ===
BREVO_API_KEY=
BREVO_SENDER_EMAIL=noreply@ecokon.ru

# === Site ===
NEXT_PUBLIC_SITE_URL=https://ecokon.ru

# === Docker / Deploy ===
IMAGE_TAG=latest
```

### 6. Создай GitHub Actions CI/CD

Путь: `.github/workflows/deploy.yml`

```yaml
name: Deploy Ecokon

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ghcr.io/${{ github.repository }}/web

jobs:
  build-and-push:
    name: Build & push Docker image
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build & push
        uses: docker/build-push-action@v6
        with:
          context: .
          file: Dockerfile
          push: true
          tags: |
            ${{ env.IMAGE_NAME }}:latest
            ${{ env.IMAGE_NAME }}:${{ github.sha }}
          build-args: |
            NEXT_PUBLIC_SUPABASE_URL=${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
            NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
            NEXT_PUBLIC_SITE_URL=https://ecokon.ru
            NEXT_PUBLIC_YMAPS_API_KEY=${{ secrets.NEXT_PUBLIC_YMAPS_API_KEY }}
            NEXT_PUBLIC_METRIKA_ID=${{ secrets.NEXT_PUBLIC_METRIKA_ID }}
            NEXT_PUBLIC_VK_PIXEL_ID=${{ secrets.NEXT_PUBLIC_VK_PIXEL_ID }}
          cache-from: type=gha,scope=web
          cache-to: type=gha,mode=max,scope=web

  deploy:
    name: Deploy to VPS
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4

      - name: Sync config files to VPS
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "docker-compose.prod.yml,deploy/"
          target: ~/ecokon
          overwrite: true

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd ~/ecokon

            # Login to GHCR
            echo "${{ secrets.GHCR_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin

            # Ensure webproxy network exists
            docker network create webproxy 2>/dev/null || true

            # Pull latest image
            docker compose -f docker-compose.prod.yml pull web

            # Restart service
            docker compose -f docker-compose.prod.yml up -d --no-deps web

            # Reload nginx (from pdnguard stack)
            docker exec pdnguard-nginx nginx -s reload 2>/dev/null || true

            # Cleanup old images
            docker image prune -f

            # Verify health
            sleep 10
            curl -sf http://localhost:3002/ || echo "⚠️ Health check failed"
```

### 7. Создай .dockerignore

```
node_modules
.next
.git
.github
.env
.env.local
.env*.local
deploy
docs
*.md
!README.md
```

### 8. Создай CLAUDE.md (память проекта для Claude Code)

```markdown
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
```

### 9. Итоговая структура файлов

Проверь что в корне проекта (рядом с package.json) созданы:

```
ecokon.ru/
├── Dockerfile
├── .dockerignore
├── docker-compose.prod.yml
├── .env.production.example
├── CLAUDE.md
├── .github/
│   └── workflows/
│       └── deploy.yml
├── deploy/
│   ├── nginx/
│   │   └── ecokon.conf
│   ├── init-ssl.sh
│   └── migration-notes.md
├── next.config.mjs          (убедись что output: 'standalone')
├── package.json
├── src/
│   └── ...
└── ...
```

### 10. Обнови next.config

Убедись что next.config.mjs содержит:
```js
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};
export default nextConfig;
```

== ПРОВЕРКИ ==

- [ ] Dockerfile: `docker build -t ecokon-test .` собирается без ошибок
- [ ] docker-compose.prod.yml валиден: `docker compose -f docker-compose.prod.yml config`
- [ ] .dockerignore не включает node_modules и .next
- [ ] next.config.mjs: output: 'standalone' присутствует
- [ ] GitHub Actions workflow синтаксически корректен
- [ ] Nginx конфиг: server_name ecokon.ru, proxy_pass на ecokon-web:3002
- [ ] init-ssl.sh: chmod +x
- [ ] .env.production.example содержит все переменные
- [ ] CLAUDE.md создан
```

---
