---
type: plan
status: in-progress
date: 2026-08-27
updated: 2026-08-27
project: pro-pochvu
source_plan: docs/superpowers/specs/2026-08-27-ai-assistant-conomni-design.md
---

# План: AI-ассистент «Пропочву» + кабинет ConOmni

Спека: `docs/superpowers/specs/2026-08-27-ai-assistant-conomni-design.md` (отрецензирована).
Ветка сайта: `w-assistant`. Пер-бот репо: `~/Obsidian/Боты/propochvu-bot`.

## A. Сайт (ветка `w-assistant`, TDD)

- ⏳ A1. `src/lib/bot-catalog.ts` — чистая логика бот-поиска (парсинг параметров, фильтр, сериализация карточки) + `bot-catalog.test.ts`
- ⏳ A2. `src/app/api/catalog/search/route.ts` — тонкий route: авторизация `x-bot-secret`, Prisma, 503 при падении БД
- ⏳ A3. `src/lib/widget.ts` (`shouldShowConomniWidget`) + `widget.test.ts`
- ⏳ A4. `src/components/ConomniWidget.tsx` + монтаж в `src/app/layout.tsx`
- ⏳ A5. Абзац про чат-виджет в `/privacy`
- ⏳ A6. Env: `.env.example`, build-arg `NEXT_PUBLIC_CONOMNI_WIDGET_TOKEN` (deploy.yml + docker-compose.prod.yml), секрет `BOT_API_SECRET` (set_env в deploy.yml)
- ⏳ A7. `npm test` + `npm run build` + `npm run lint` зелёные → мерж `--no-ff` → push (деплой)

## B. Бот (пер-бот репо)

- ⏳ B1. Скаффолд `propochvu-bot` из шаблона kit
- ⏳ B2. KB: 01-brand, 02-lines, 03-usage, 04-delivery-payment, 05-marketplaces, 06-reviews-faq, 07-press
- ⏳ B3. `prompts/system-prompt.md` (идентичность, правила, эскалация, KB) — `prompt-lint` чисто
- ⏳ B4. `bot.config.js`: chatwoot-канал, site-tool `search_catalog`, logging postgres, pdMask
- ⏳ B5. `eval/eval-set.md` ≥ 12 кейсов
- ⏳ B6. Ранбук `deploy/sel1-conomni.md` (дельта от Уи)

## C. Раскатка (порядок ранбука Уи)

- ⏳ C0. БД `propochvu_bot` в `pdnguard-postgres` + n8n-credential → `PG_CRED_ID`
- ⏳ C1. Аккаунт ConOmni «Пропочву» + `gpaul@conomni.ru` (administrator) + тариф `team/perpetual` + `keep_pending_on_bot_failure: true`
- ⏳ C2. Инбокс «Сайт — Пропочву» (домен pro-pochvu.ru) → `websiteToken`
- ⏳ C3. Agent Bot «Ассистент Пропочву» без привязки → `CONOMNI_BOT_TOKEN`; коннектор-юзер → `CONOMNI_API_TOKEN`
- ⏳ C4. `build.js` → `deploy.js --create` → активация в n8n UI → смоук вебхука (не 404)
- ⏳ C5. Привязка бота к инбоксу; `enable_email_collect: false`, `pre_chat_form_enabled: false`
- ⏳ C6. Токен виджета в GitHub Secrets → редеплой сайта → живой смоук (3 сообщения подряд, цена, эскалация)
- ⏳ C7. `eval.js` ≥ 90 %

## D. Хвосты

- ⏳ D1. Реестры: FLEET.md, `_HOW-THIS-IS-BUILT.md`, `_BACKLOG.md`, `_SUMMARY.md`, дейли, память
- ⏳ D2. Глобальный скилл «ассистент сайта + кабинет ConOmni» на фактах этой раскатки
- ⏳ D3. Вопрос Павлу: расхождение дозировки био-чая — статья БЗ сайта (1 стик / 1 л / 30–40 °C / 15 мин) против описаний товаров и маркетплейсов (1 пакетик / 1,5 л / 50 °C / 2 часа)
