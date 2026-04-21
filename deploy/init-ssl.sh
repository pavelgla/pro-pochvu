#!/bin/bash
set -e

DOMAIN="pro-pochvu.ru"
IDN_DOMAIN="xn--b1axacbez4a.xn--p1ai"
EMAIL="${CERTBOT_EMAIL:-admin@pro-pochvu.ru}"

echo "=== Получение SSL-сертификата для $DOMAIN + $IDN_DOMAIN ==="

# Получить сертификат
docker compose -f ~/pdnguard/docker-compose.prod.yml run --rm certbot \
  certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d $DOMAIN \
  -d www.$DOMAIN \
  -d $IDN_DOMAIN \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  --force-renewal

echo "=== SSL-сертификат получен! ==="
echo "Перезагрузка Nginx..."
docker exec pdnguard-nginx nginx -s reload
