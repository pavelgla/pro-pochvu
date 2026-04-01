#!/bin/bash
set -e

echo "=== Initial deploy ecokon.ru ==="

# 1. Создать Docker network если не существует
docker network create webproxy 2>/dev/null || echo "Network webproxy already exists"

# 2. Создать директорию
mkdir -p ~/ecokon
cd ~/ecokon

# 3. Скопируй .env из .env.production.example и заполни значения
# cp .env.production.example .env
# nano .env

# 4. Запусти PostgreSQL
docker compose -f docker-compose.prod.yml up -d postgres

# 5. Подожди пока PostgreSQL будет готов
echo "Waiting for PostgreSQL..."
sleep 5

# 6. Запусти миграции
docker compose -f docker-compose.prod.yml run --rm web npx prisma migrate deploy

# 7. Засей БД (только первый раз!)
docker compose -f docker-compose.prod.yml run --rm web npx prisma db seed

# 8. Запусти web
docker compose -f docker-compose.prod.yml up -d

# 9. Получи SSL (если ещё нет)
# docker compose -f ~/pdnguard/docker-compose.prod.yml run --rm certbot certonly --webroot -w /var/www/certbot -d ecokon.ru -d www.ecokon.ru

# 10. Перезагрузи Nginx
# docker exec pdnguard-nginx nginx -s reload

echo "=== Deploy complete ==="
echo "Check: curl -I https://ecokon.ru"
