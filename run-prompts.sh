#!/bin/bash
# Ecokon.ru MVP Phase 1: последовательный запуск промптов через Claude Code CLI
# Каждый промпт = отдельная сессия (чистый контекст)
# Между промптами — git commit
#
# Использование:
#   ./run-prompts.sh        — запустить все с 1-го
#   ./run-prompts.sh 3      — начать с 3-го промпта
#   ./run-prompts.sh 3 7    — запустить только с 3-го по 7-й

set -e
cd "$(dirname "$0")"

START=${1:-1}
END=${2:-999}

# Инициализация git если нет
if [ ! -d .git ]; then
  git init
  git add -A
  git commit -m "Initial state before MVP Phase 1"
  echo "✅ Git инициализирован"
fi

PROMPTS=(
  "01-seed|Seed: загрузка 13 товаров в БД (seed.ts)"
  "02-images|Images: копирование фото из knowledge_base в public/"
  "03-header|Header: навигация, корзина, мобильное меню"
  "04-footer|Footer: колонки, копирайт, ссылки маркетплейсов"
  "05-homepage|Homepage: Hero, секции ProductLines/Bestsellers/Benefits/Testimonials/Newsletter"
  "06-catalog|Catalog: фильтры, сортировка, сетка товаров, API route"
  "07-product|Product: галерея, ProductInfo, вкладки, отзывы"
  "08-cart-checkout|Cart + Checkout: корзина, 3-шаговый checkout, промокод"
  "09-api-orders|API: создание заказа, промокод, YooKassa mock, Telegram"
  "10-auth|Auth: login, signup, личный кабинет, middleware"
  "11-order-seo|Order page + SEO: подтверждение заказа, sitemap, robots, manifest"
  "12-final-build|Final: финальная проверка сборки, TypeScript, зависимости"
  "13-delivery-page|Page: Доставка и оплата — способы доставки, оплата, FAQ"
  "14-returns-page|Page: Возврат товара — условия, 3 шага, гарантия фитомодулей"
  "15-contacts-page|Page: Контакты — Telegram, каталог, маркетплейсы, юр.данные"
  "16-about-page|Page: О бренде — история, цифры, торговые марки"
  "17-reviews-seed|Seed: отзывы покупателей для 5 товаров (20 отзывов)"
  "18-trademark|Trademark: ® в Footer, BrandLabel, мета, страница /legal"
  "19-final-phase2|Final Phase 2: проверка всех страниц, навигация, TypeScript"
  "20-privacy-policy|Privacy: Политика обработки ПДн (152-ФЗ), ООО Цветология"
  "21-cookie-banner|Cookie: баннер согласия, localStorage, анимация"
  "22-consent-forms|Consent: чекбоксы ПДн в регистрации, checkout, рассылке"
  "23-contacts-legal|Contacts: ООО Цветология + КФХ Мушкино во всех юр.блоках"
  "24-terms-of-service|Terms: Пользовательское соглашение / оферта"
  "25-final-pdn|Final Phase 3: чеклист 152-ФЗ, sitemap, TypeScript"
  "26-fix-404|Fix 404: blog, knowledge-base, admin страницы + legal контент"
  "27-product-images|Images: скачать фото для 5 товаров + fix ProductCard"
  "28-wb-reviews-sync|WB Sync: парсер отзывов через публичный feedbacks API"
  "29-reviews-display|Reviews: отображение с бейджами WB/Ozon, пагинация"
  "30-final-phase4|Final Phase 4: 404 проверка, изображения, TypeScript"
)

TOTAL=${#PROMPTS[@]}

# Извлечение текста промпта из PROMPTS.md по номеру
get_prompt_text() {
  local num=$1
  local padded=$(printf "%02d" $num)
  # Ищем блок ```...``` после строки "## ПРОМПТ N:"
  awk "/^## ПРОМПТ ${num}:/{found=1} found && /^\`\`\`$/{if(inblock){exit}else{inblock=1;next}} found && inblock{print} found && /^\`\`\`$/{exit}" PROMPTS.md
}

for i in "${!PROMPTS[@]}"; do
  NUM=$((i + 1))

  # Диапазон запуска
  if [ "$NUM" -lt "$START" ] || [ "$NUM" -gt "$END" ]; then
    continue
  fi

  IFS='|' read -r SLUG DESC <<< "${PROMPTS[$i]}"

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 Промпт $NUM/$TOTAL: $DESC"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  # Читаем текст промпта из PROMPTS.md
  PROMPT_TEXT=$(get_prompt_text $NUM)

  if [ -z "$PROMPT_TEXT" ]; then
    echo "❌ Промпт $NUM не найден в PROMPTS.md, пропускаю"
    continue
  fi

  # Запускаем claude в pipe mode (чистая сессия, без интерактива)
  echo "$PROMPT_TEXT" | claude -p --dangerously-skip-permissions

  # Коммитим если есть изменения
  if [ -n "$(git status --porcelain)" ]; then
    git add -A
    git commit -m "Prompt $NUM: $DESC"
    echo ""
    echo "✅ Промпт $NUM закоммичен: $DESC"
  else
    echo ""
    echo "⚠️  Промпт $NUM: нет изменений для коммита"
  fi

  # Пауза между промптами
  if [ "$NUM" -lt "$TOTAL" ] && [ "$NUM" -lt "$END" ]; then
    echo ""
    echo "⏳ Пауза 5 сек перед следующим промптом..."
    sleep 5
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Готово! Промпты $START-$([ $END -eq 999 ] && echo $TOTAL || echo $END) выполнены."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Последние коммиты:"
git log --oneline -$((TOTAL > 12 ? 12 : TOTAL))
