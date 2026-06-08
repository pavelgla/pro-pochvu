#!/usr/bin/env bash
# Аутентифицированный запрос к Google Search Console API через service-account ключ.
# Ключ: .gsc-sa.json в корне репо (chmod 600, вне git). Scope: webmasters.readonly.
#
# Использование:
#   scripts/gsc.sh sites
#       список доступных ресурсов
#   scripts/gsc.sh query <siteUrl> <startDate> <endDate> [dimensions]
#       Search Analytics (по умолчанию dimensions=query), даты YYYY-MM-DD
#   scripts/gsc.sh inspect <siteUrl> <inspectUrl>
#       статус индексации конкретного URL (URL Inspection API)
#   scripts/gsc.sh raw <method> <path> [json-body]
#       произвольный вызов, path от https://www.googleapis.com
#
# siteUrl: для URL-prefix — "https://pro-pochvu.ru/"; для домена — "sc-domain:pro-pochvu.ru".
set -euo pipefail
cd "$(dirname "$0")/.."
KEY=".gsc-sa.json"
[ -f "$KEY" ] || { echo "нет $KEY" >&2; exit 1; }

mint_token() {
  local email uri now exp header claim sig jwt
  email=$(jq -r .client_email "$KEY"); uri=$(jq -r .token_uri "$KEY")
  jq -r .private_key "$KEY" > /tmp/.gsc_pk.$$.pem; chmod 600 /tmp/.gsc_pk.$$.pem
  now=$(date +%s); exp=$((now+3600))
  header=$(printf '{"alg":"RS256","typ":"JWT"}' | openssl base64 -e -A | tr '+/' '-_' | tr -d '=')
  claim=$(printf '{"iss":"%s","scope":"https://www.googleapis.com/auth/webmasters.readonly","aud":"%s","iat":%s,"exp":%s}' "$email" "$uri" "$now" "$exp" | openssl base64 -e -A | tr '+/' '-_' | tr -d '=')
  sig=$(printf '%s.%s' "$header" "$claim" | openssl dgst -sha256 -sign /tmp/.gsc_pk.$$.pem | openssl base64 -e -A | tr '+/' '-_' | tr -d '=')
  rm -f /tmp/.gsc_pk.$$.pem
  jwt="$header.$claim.$sig"
  curl -s -X POST "$uri" -d grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer -d "assertion=$jwt" | jq -r '.access_token // empty'
}

TOK=$(mint_token)
[ -n "$TOK" ] || { echo "не удалось получить токен" >&2; exit 1; }
API="https://www.googleapis.com/webmasters/v3"

cmd="${1:-sites}"; shift || true
case "$cmd" in
  sites)
    curl -s -H "Authorization: Bearer $TOK" "$API/sites" | jq . ;;
  query)
    site="$1"; start="$2"; end="$3"; dims="${4:-query}"
    body=$(jq -nc --arg s "$start" --arg e "$end" --arg d "$dims" \
      '{startDate:$s,endDate:$e,dimensions:($d|split(",")),rowLimit:100}')
    curl -s -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
      "$API/sites/$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1],safe=''))" "$site")/searchAnalytics/query" \
      -d "$body" | jq . ;;
  inspect)
    site="$1"; url="$2"
    body=$(jq -nc --arg u "$url" --arg s "$site" '{inspectionUrl:$u,siteUrl:$s}')
    curl -s -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
      "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" -d "$body" | jq . ;;
  raw)
    method="$1"; path="$2"; data="${3:-}"
    curl -s -X "$method" -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
      "https://www.googleapis.com$path" ${data:+-d "$data"} | jq . ;;
  *) echo "неизвестная команда: $cmd" >&2; exit 1 ;;
esac
