# SEO — план работ pro-pochvu.ru

Статус на **2026-05-04** (обновлено в конце дня). Источник истины — этот файл.

## Сделано

### Этап 1 — техфундамент SEO (код)
- [x] `src/app/layout.tsx` — Metadata API: OG, Twitter Card, canonical, verification (env), viewport, icons
- [x] `src/lib/structured-data.ts` — JSON-LD: Product, Breadcrumb, Organization, WebSite, FAQ
- [x] `src/app/sitemap.ts` — динамика по `/catalog/[product-line]` + продукты, фильтр Цветологии, чистка от параметров
- [x] `src/app/robots.ts` — расширен disallow, host
- [x] Графика: `public/{logo.png, og-image.jpg, favicon*.png, apple-touch-icon.png}`
- [x] `description` на `/blog`, `/knowledge-base`

### Этап 2 — регистрация в панелях (вручную)
- [x] Яндекс.Вебмастер — route handler `src/app/yandex_53a70f2c26dfd38f.html/route.ts` + мета-тег `yandex-verification` ✓ (подтверждён на проде)
- [x] Google Search Console — мета-тег `google-site-verification` ✓ (подтверждён на проде)
- [x] IndexNow ключ зарегистрирован в Я.Вебмастере
- [x] `NEXT_PUBLIC_YANDEX_VERIFICATION` + `NEXT_PUBLIC_GOOGLE_VERIFICATION` — добавлены в `deploy.yml` build-args, оба `.env`

### Этап 4 — IndexNow API (код)
- [x] `src/lib/indexnow.ts` — клиент (`pingIndexNow`, `pingIndexNowBulk`, `pingIndexNowAsync`)
- [x] `src/app/api/indexnow/verify/route.ts` — отдача ключа
- [x] `src/app/api/indexnow/bulk/route.ts` — admin: пуш всего sitemap'а
- [x] `src/app/api/indexnow/ping/route.ts` — admin: точечный пинг
- [x] `src/middleware.ts` — rewrite `/{KEY}.txt` → `/api/indexnow/verify`
- [x] `scripts/indexnow-bulk.ts` — CLI
- [x] env: `INDEXNOW_KEY`, `ADMIN_API_TOKEN` в `.env.example` + `Dockerfile` + `docker-compose.prod.yml`

## Сразу после деплоя — действия (вручную)

- [x] На VPS в `~/ecokon/.env` прописать `INDEXNOW_KEY` и `ADMIN_API_TOKEN` ✓
- [x] `NEXT_PUBLIC_YANDEX_VERIFICATION` и `NEXT_PUBLIC_GOOGLE_VERIFICATION` — прописаны ✓
- [x] Проверить IndexNow ключ-файл: `curl https://pro-pochvu.ru/${INDEXNOW_KEY}.txt` ✓ (200 OK)
- [x] Первичный прогрев: 29 URLs отправлено через `scripts/indexnow-bulk.ts`, статус 202 ✓
- [x] В Яндекс.Вебмастере: «Индексирование → Файлы Sitemap» → добавить `https://pro-pochvu.ru/sitemap.xml`
- [x] В Я.Вебмастере: «Переобход страниц» → главная, `/catalog`, топ-3 товара
- [x] В GSC: Sitemaps → отправить `sitemap.xml`; URL Inspection → Request Indexing для главной
- [x] Bing Webmaster Tools — импорт из GSC одной кнопкой

## Что осталось делать (TODO)

### Этап 3 — Аналитика (код готов, ждёт деплой + настройку Метрики)
- [x] `src/components/analytics/Metrika.tsx` — Server Component + `next/script`, **мягкий режим**: счётчик грузится сразу с webvisor+clickmap, cookie-баннер только информационный (не блокирует трекинг). Без согласия пользователя данные собираются — типовая практика на RU-сайтах
- [x] `src/lib/analytics.ts` — типизированные обёртки: `trackGoal`, `trackAddToCart`, `trackRemoveFromCart`, `trackBeginCheckout`, `trackPurchase`, `trackPhoneClick`, `trackTelegramClick`, `trackLeadFormSubmit`, `pushEcommerce`, `readYandexClientId`
- [x] `src/lib/analytics-server.ts` — серверный fallback `purchase` через Я.Метрика **offline conversions API** (CSV-upload, OAuth)
- [x] `src/components/analytics/PurchaseTracker.tsx` — клиентский трекер на `/order/[id]`, идемпотентен через `sessionStorage`
- [x] `src/components/analytics/ClickTracker.tsx` — делегатор: ловит клики на `tel:`/`t.me`/`wa.me` и сабмиты форм с `data-track-form="<id>"`
- [x] `cartStore.addItem` / `removeItem` стреляют `add_to_cart` / `remove_from_cart` + `dataLayer.ecommerce`
- [x] `/checkout` стреляет `begin_checkout` при гидрации
- [x] `_ym_uid` cookie прокидывается клиент → `/api/orders/create` → `/api/payment/create` → YooKassa `metadata.ym_client_id` → webhook → offline conversion
- [x] Webhook `/api/payment/webhook` идемпотентен и зовёт `pushPurchaseToMetrika` fire-and-forget
- [x] CookieBanner оставлен как информационный (диспатчит `cookie-consent-changed`, но Метрика на это больше не реагирует — soft mode)
- [x] Лид-форма `MarketplaceLeadModal` помечена `data-track-form="marketplace_lead"`
- [ ] **После деплоя** — в Я.Метрике вручную создать цели типа «JavaScript-событие»: `add_to_cart`, `remove_from_cart`, `begin_checkout`, `purchase`, `lead_form_submit`, `phone_click`, `telegram_click`, `whatsapp_click`
- [ ] **После деплоя** — для серверного канала получить `YANDEX_OAUTH_TOKEN` (https://oauth.yandex.ru, scope «Метрика: запись»), прописать в `~/pro-pochvu/.env`, редеплой
- [ ] Включить webvisor и карту скроллинга в самой Метрике (UI → Настройки)
- [ ] Опционально GA4 — компонент `src/components/analytics/GA4.tsx`, env `NEXT_PUBLIC_GA4_ID`
- [ ] Опционально VK Pixel — `NEXT_PUBLIC_VK_PIXEL_ID` уже зарезервирован

### Этап 5 — внешние сигналы
- [ ] Яндекс.Бизнес — карточка КФХ «Ранчо Мушкино»
  - Зайти: https://business.yandex.ru
  - Тип: Производство / Интернет-магазин
  - Название: КФХ «Ранчо Мушкино»
  - Сайт: https://pro-pochvu.ru
  - Телефон + физический адрес фермы (Карелия)
  - Фото: логотип (`/public/logo.png`) + фото продукции (`/public/images/ecokon/`)
  - Категории: органические удобрения, грунты для растений, озеленение
- [ ] 2ГИС — добавить организацию
- [ ] Zoon — отзывы и карточка
- [ ] Mail.ru Webmaster (опционально, env уже есть: `NEXT_PUBLIC_MAILRU_VERIFICATION`)
- [ ] Яндекс.Маркет — YML-фид (`/api/yml-feed/route.ts` — задача отдельная)
- [ ] Обновить ссылки на pro-pochvu.ru в карточках брендов на WB/Ozon (если регламент позволяет)

### Этап 6 — контент-SEO
- [ ] FAQ JSON-LD на `/delivery` (контент в `delivery/FaqAccordion.tsx` — обернуть в schema.org через `generateFaqJsonLd`)
- [ ] FAQ JSON-LD на `/returns` и `/contacts`
- [ ] Уникальные H1 + SEO-описания категорий в `/catalog/[product-line]` (поле `description` уже в БД через ProductLine)
- [ ] 5–10 SEO-статей в `/blog`. Темы под Карелию/Россию: «биогумус для рассады», «вертикальный сад в квартире», «удобрение для орхидей», «выращивание зелени зимой», «вертикальное озеленение балкона»
- [ ] Хлебные крошки JSON-LD — проверить вывод на всех листовых страницах

### Этап 7 — автоматизация IndexNow
- [ ] Хук `pingIndexNowAsync([url])` в `/api/admin/products/route.ts` (после создания/обновления товара) — **появится когда сделаем админку**
- [ ] То же для блога (`/api/admin/blog/route.ts`)
- [ ] Cron на VPS: ежесуточный `npx tsx scripts/indexnow-bulk.ts` — на случай если хук пропустил

## Разбор 22.08.2026 — индексация и CTR

**Замер.** Яндекс, окна по 28 дней: показы 464 → 803 → 1724, клики 30 → 49 → 54,
CTR 6.5% → 6.1% → 3.1%, средняя позиция показа 7.3 → 8.6. Google (доменный ресурс,
подключён в этот же день) — ~200 показов/сутки, позиция 7–11.

**Про «падение индекса 124 → 95» — формулировка неверная.** История `search-urls/in-search`
показывает разовый обвал 13.06 (124 → 41) — это известный LOW_QUALITY-деиндекс блога, —
а дальше монотонный рост: 41 → 74 → 88 → 95. Против 90 URL в sitemap индекс полный,
восстановление закрыто. Исключений после июня всего 7 (июнь — 101).

**Что было реально сломано и починено** (коммиты 4b7cbd6, 135bd67):

| Дефект | Как проявлялся | Фикс |
|---|---|---|
| `/product/grunt-ecokon-organicheskiy` и `grunt-ecokon-ovoshchi` → 404 (isActive=false после консолидации SKU) | топ-посадочная Google по «грунт эко конь» (52 показа, 4 клика, поз. 6.5), Яндекс выкинул обе как HTTP_ERROR | 301 на `grunt-ecokon-20l` |
| `BlogProductCta` искал товар без фильтра `isActive` | 9 статей, включая топового «крестовника роули», рисовали блок «Товар из статьи» со ссылками в 404 — вся воронка блог→каталог | фильтр `isActive` + сторож `scripts/check-blog-anchors.ts` |
| `/delivery` не в sitemap | страница индексируется, но не заявлена | добавлена |
| `permanent: true` в redirects → Next отдаёт 308 | Яндекс не склеивал: `/product/kolyshki-skoby-silikon` месяцами висел рядом с новым слагом | `statusCode: 301` |
| в `robots.ts` блок `User-agent: Yandex` без параметрических disallow | свой блок читается ВМЕСТО общего → Яндекс ходил в `/catalog?brand=…` и регулярно выкидывал их как NOT_CANONICAL (последний раз 17.08) | запреты продублированы в Yandex-блок |
| в title и description главной нет слов «ЭКО Конь» | по «эко конь»/«экоконь»/«удобрение эко конь» ~230 показов в Google, поз. 6.6–7, **0 кликов** | бренд вписан в title и description |

**CTR.** Переписаны `seoTitle`/`seoDescription` шести лидеров под реальные формулировки
запросов (`scripts/seo-fix-202608.ts`, применён на прод): крестовник Роули («…в домашних
условиях»), хойя («как укоренить», а не «размножение»), спатифиллум, монстера борзига,
Био-чай («инструкция по применению»), растения для фитостены (+ «фитомодуля»).
В статью про крестовника добавлена контекстная ссылка в каталог — она была единственной
из непрессовых статей без ссылки на товар в теле.

**Замер эффекта — после 20.09.2026** (месяц на переиндексацию). Смотреть в
https://seo.pro-pochvu.ru: CTR Яндекса против 3.1%, клики против 54 за 28 дней,
и появление кликов по брендовым «эко конь» в Google.

**Хвосты:**
- [ ] 3 RECOMMENDATION в Вебмастере — API отдаёт только severity/state без `problem_type`,
      смотреть глазами в UI: https://webmaster.yandex.ru/site/https:pro-pochvu.ru:443/diagnostics/
- [ ] `/partnery` отдаёт 404 (роут есть, страница noindex) — решить: удалить роут или наполнить
- [ ] Позиции 10–12 у `/blog/grunt-dlya-orhidey` (108 показов) и
      `/blog/rasteniya-dlya-fitosteny-v-kvartire` (127) — тут CTR не поможет, нужен рост позиции

## Полезные ссылки

- Яндекс.Вебмастер: https://webmaster.yandex.ru/
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster: https://www.bing.com/webmasters
- IndexNow API docs: https://www.indexnow.org/documentation
- Schema.org валидатор: https://validator.schema.org/
- Google Rich Results Test: https://search.google.com/test/rich-results
