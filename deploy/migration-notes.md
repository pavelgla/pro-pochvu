# Миграция на общую Docker-сеть (webproxy)

## Одноразовая настройка на VPS:

### 1. Создать внешнюю сеть
```bash
docker network create webproxy
```

### 2. Обновить pdnguard docker-compose.prod.yml
Добавить в services nginx, api, web:
```yaml
networks:
  - internal
  - webproxy
```

Добавить в корень:
```yaml
networks:
  internal:
    driver: bridge
  webproxy:
    external: true
```

### 3. Обновить pdnguard nginx
Заменить один файл nginx.conf на два:
- `deploy/nginx/pdnguard.conf` (текущий конфиг с server_name pdnguard.ru)
- `deploy/nginx/ecokon.conf` (новый конфиг)

Обновить volumes в nginx сервисе:
```yaml
volumes:
  - ./deploy/nginx/pdnguard.conf:/etc/nginx/conf.d/pdnguard.conf:ro
  - ~/ecokon/deploy/nginx/ecokon.conf:/etc/nginx/conf.d/ecokon.conf:ro
  - certbot-conf:/etc/letsencrypt:ro
  - certbot-www:/var/www/certbot:ro
```

### 4. Получить SSL для ecokon.ru
```bash
bash ~/ecokon/deploy/init-ssl.sh
```

### 5. Перезапустить всё
```bash
cd ~/pdnguard && docker compose -f docker-compose.prod.yml up -d
cd ~/ecokon && docker compose -f docker-compose.prod.yml up -d
```
