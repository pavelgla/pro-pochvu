# Видеоинструкции (self-hosted)

Файлы mp4 не лежат в репозитории. На sel1 они в `/opt/ecokon/videos/`, этот каталог
смонтирован в `proxy-nginx` как `/srv/pro-pochvu/videos` (`/opt/proxy/docker-compose.yml`)
и отдаётся через `location /videos/` в `deploy/nginx/pro-pochvu.conf`.

Оригиналы апреля 2026 пропали вместе с VPS spb1 (удалён 09.07.2026). Восстановлено 29.10.2026:

| Файл | Источник |
|---|---|
| `bio-chay-yantar-fosfor-instruction.mp4` | YouTube `SRJIaeYFS10` «Инструкция Био чай Янтарный» (канал Насти Гладышевой), 720×1280 |
| `fitomodul-instruction.mp4` | Rutube `7a7bcfc0e9d13742b06805fa737032dc` «Цветология: фитомодули для фитильного полива», 720×1280 |

Не найдены (ищем, вероятно по QR на упаковке): био-чай с ЭМ (`udobrenie-kornevaya`),
для орхидей, для декоративно-лиственных, гранулы (корневая, рассада, овощи).
У этих товаров `videoUrl` обнулён (`deploy/videos/clear-missing-video-urls-2026-10.sql`).

Кодирование: `ffmpeg -c:v libx264 -crf 24..25 -r 30 -c:a aac -b:a 128k -movflags +faststart`.

Добавить ролик: положить файл в `/opt/ecokon/videos/`, внести в `src/app/knowledge-base/video/page.tsx`,
при необходимости проставить `videoUrl` у товара (SQL через stdin в `ecokon-db`).
