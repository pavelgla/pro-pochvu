#!/usr/bin/env bash
# Временно открывает репо public, прогоняет GitHub Actions, возвращает private.
# Зачем: при заблокированном/исчерпанном биллинге private-репо Actions не стартуют;
# public-репо дают безлимит. См. паттерн из conv42 (memory repo-visibility-ci-toggle).
#
# Использование:
#   tools/ci-public-run.sh [run_id]
#     run_id — id упавшего/нужного run для rerun. Если не задан — берётся последний
#              run на текущей ветке. (deploy.yml без workflow_dispatch → только rerun.)
#
# ВАЖНО: пока репо public, виден весь код и ВСЯ git-история. Скрипт стопает, если в
# истории найдены реальные .env-файлы.
set -euo pipefail

REPO="pavelgla/pro-pochvu"

restore_private() {
  echo ">>> Возвращаю репо в private…"
  gh repo edit "$REPO" --visibility private --accept-visibility-change-consequences || true
  echo -n "visibility: "; gh repo view "$REPO" --json visibility -q .visibility
}
trap restore_private EXIT  # вернуть private даже при ошибке/прерывании

# Защита от утечки секретов в истории (реальные .env, не .example)
if git log --all --pretty=format: --name-only 2>/dev/null \
     | grep -iE '(^|/)\.env(\.local|\.production)?$' | grep -q .; then
  echo "СТОП: реальный .env найден в git-истории — открывать репо нельзя." >&2
  exit 1
fi

RUN_ID="${1:-$(gh run list --branch "$(git rev-parse --abbrev-ref HEAD)" --limit 1 --json databaseId -q '.[0].databaseId')}"
echo ">>> Run для перезапуска: $RUN_ID"

echo ">>> Открываю репо public…"
gh repo edit "$REPO" --visibility public --accept-visibility-change-consequences

echo ">>> Перезапускаю run $RUN_ID…"
gh run rerun "$RUN_ID" 2>&1 || {
  echo "(rerun не сработал — делаю пустой коммит для триггера push)"
  git commit -q --allow-empty -m "ci: trigger deploy (public window)"
  git push origin "$(git rev-parse --abbrev-ref HEAD)"
}

sleep 8
RUN_ID="$(gh run list --branch "$(git rev-parse --abbrev-ref HEAD)" --limit 1 --json databaseId -q '.[0].databaseId')"
echo ">>> Жду завершения run $RUN_ID…"
gh run watch "$RUN_ID" --interval 20 --exit-status

echo ">>> Итог:"
gh run view "$RUN_ID" --json name,conclusion,url -q '"\(.name): \(.conclusion) — \(.url)"'
# private вернётся автоматически через trap
