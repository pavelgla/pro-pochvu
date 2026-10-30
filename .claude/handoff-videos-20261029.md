# Хэндофф из Jarvis (29.10.2026, 12:2x MSK): пропали видеоинструкции pro-pochvu.ru

## Симптом
Все 8 видео на /knowledge-base/video и во вкладке «Применение» у 6 товаров не грузятся: `https://pro-pochvu.ru/videos/*.mp4` → 404.

## Что уже выяснено
- Ролики добавлены 21.04.2026 (коммиты 2bb6a0a, 7092746). mp4 НЕ в репо: лежали на старом VPS spb1 (217.18.60.83) в `/home/sites/proxy/videos`, отдавались nginx через `location /videos/` (см. `docs/deploy_videos.sh`). Исходники брались из `/tmp/ecokon-videos/` — откуда скачаны, не записано.
- spb1 удалён 09.07.2026 при переезде на sel1. Видео не перенесли; в `deploy/nginx/pro-pochvu.conf` нет `location /videos/`.
- Копий не найдено: ноут (весь диск), ~/Yandex.Disk, sel1 (/root /opt /home /srv), NAS /mnt/dns320l. spb1 не отвечает.
- Список файлов: `src/app/knowledge-base/video/page.tsx` (8 шт.), videoUrl в БД — `docs/update_video_urls.sql` (6 товаров).
- Павел полагает, что ролики тянули с YouTube или с канала Кати (@spottykit / её соцсети).

## Задача
Разбираемся вместе с Павлом письменно: найти исходники (YouTube/канал Кати), скачать, залить на sel1, добавить `location /videos/` в nginx-конфиг (через репо, деплой по ранбуку), проверить 200 + Range. Ничего не делать в прод без команды Павла.
