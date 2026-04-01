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
