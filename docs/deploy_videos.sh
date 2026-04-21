#!/bin/bash
# Скрипт для заливки видео на VPS и обновления nginx
# Выполнять с локальной машины

VPS="217.18.60.83"
REMOTE_DIR="/home/sites/proxy/videos"

echo "=== 1. Создаём директорию на VPS ==="
ssh root@$VPS "mkdir -p $REMOTE_DIR"

echo "=== 2. Заливаем видео ==="
scp /tmp/ecokon-videos/*.mp4 root@$VPS:$REMOTE_DIR/

echo "=== 3. Проверяем файлы на VPS ==="
ssh root@$VPS "ls -lh $REMOTE_DIR/"

echo "=== 4. Добавляем volume в docker-compose proxy (если нужно) ==="
echo "Добавь в /home/sites/proxy/docker-compose.yml → nginx → volumes:"
echo "  - /home/sites/proxy/videos:/home/sites/proxy/videos:ro"

echo "=== 5. Добавляем location в nginx конфиг ==="
echo "Добавь в /home/sites/proxy/nginx/conf.d/pro-pochvu.conf:"
cat << 'NGINX'

    location /videos/ {
        alias /home/sites/proxy/videos/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header Accept-Ranges bytes;
    }

NGINX

echo "=== 6. Перезапускаем nginx ==="
echo "ssh root@$VPS 'cd /home/sites/proxy && docker compose restart nginx'"

echo "=== 7. Обновляем videoUrl в БД ==="
echo "Выполни docs/update_video_urls.sql на dev и prod БД"
