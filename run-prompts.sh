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
