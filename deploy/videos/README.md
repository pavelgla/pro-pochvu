# Видеоинструкции (self-hosted)

Файлы mp4 не лежат в репозитории. На sel1 они в `/opt/ecokon/videos/`, этот каталог
смонтирован в `proxy-nginx` как `/srv/pro-pochvu/videos` (`/opt/proxy/docker-compose.yml`)
и отдаётся через `location /videos/` в `deploy/nginx/pro-pochvu.conf`.

Оригиналы пропали вместе с VPS spb1 (удалён 09.07.2026), восстановлены 29.10.2026
из исходников. Ролики ЭКО Конь лежат на YouTube-канале Насти Гладышевой как скрытые
(unlisted): поиском их не найти, только по ID.

| Файл | Источник |
|---|---|
| `udobrenie-kornevaya-instruction.mp4` | YouTube `P_I_R5WmxO8` «инструкция био чай с ЭМ» |
| `udobrenie-kornevaya-granuly-instruction.mp4` | YouTube `fOnRVHGD6nU` «гранулы 1» |
| `udobrenie-rassada-instruction.mp4` | YouTube `YIMyZMY3Eao` «гранулы 2 с янтарем» |
| `udobrenie-ovoshchi-instruction.mp4` | YouTube `dralzoPQ-VU` «гранулы 3 с эм» |
| `bio-chay-orhidei-instruction.mp4` | YouTube `rVCMpc1y31w` «инструкция орхидеи» |
| `bio-chay-dekorativno-listvennye-instruction.mp4` | YouTube `_H_YTYlNpFE` «Био чай для Декоротивнолиственных» |
| `bio-chay-yantar-fosfor-instruction.mp4` | YouTube `SRJIaeYFS10` «Инструкция Био чай Янтарный» |
| `fitomodul-instruction.mp4` | Rutube `7a7bcfc0e9d13742b06805fa737032dc` «Цветология: фитомодули для фитильного полива» |

Скачивание: `yt-dlp --proxy socks5://127.0.0.1:1080 --js-runtimes node --remote-components ejs:github -f "136+140"`
(без JS-рантайма YouTube отдаёт только 360p и рвёт загрузку 403).
Кодирование: `ffmpeg -vf scale=720:-2 -c:v libx264 -preset slow -crf 24 -r 30 -c:a aac -b:a 128k -movflags +faststart`.

Добавить ролик: положить файл в `/opt/ecokon/videos/`, внести в `src/app/knowledge-base/video/page.tsx`,
при необходимости проставить `videoUrl` у товара (SQL через stdin в `ecokon-db`).
