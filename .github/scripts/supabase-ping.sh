#!/usr/bin/env bash
set -euo pipefail

# Santarita keeps its existing URL secret; SYSMP projects use explicit references.
if [[ -n "${SUPABASE_URL:-}" ]]; then
  if [[ "$SUPABASE_URL" =~ ^https://([a-z]{20})\.supabase\.co/?$ ]]; then
    url_ref="${BASH_REMATCH[1]}"
  else
    echo "Expected a Supabase project API URL" >&2
    exit 1
  fi
  if [[ -n "${SUPABASE_PROJECT_REF:-}" && "$SUPABASE_PROJECT_REF" != "$url_ref" ]]; then
    echo "Project reference does not match API URL" >&2
    exit 1
  fi
  SUPABASE_PROJECT_REF="$url_ref"
fi
: "${SUPABASE_PROJECT_REF:?SUPABASE_PROJECT_REF is required}"
api_key="${SUPABASE_API_KEY:-${SUPABASE_ANON_KEY:-}}"
if [[ -z "$api_key" ]]; then
  echo "Supabase API key is required" >&2
  exit 1
fi
monitor_table="${SUPABASE_MONITOR_TABLE:-service_health}"

if [[ ! "$SUPABASE_PROJECT_REF" =~ ^[a-z]{20}$ ]]; then
  echo "Invalid Supabase project reference" >&2
  exit 1
fi

headers=(--header "apikey: ${api_key}")
case "$api_key" in
  sb_publishable_*) echo "API key type: publishable" ;;
  sb_secret_*)
    # Santarita is a private server job; retain its existing credential compatibility.
    if [[ "$monitor_table" != categories ]]; then
      echo "Monitoring sentinel requires an anon or publishable key" >&2
      exit 1
    fi
    echo "API key type: secret (existing categories job)"
    ;;
  *)
    if ! printf '%s' "$api_key" | jq -eR --arg ref "$SUPABASE_PROJECT_REF" --arg table "$monitor_table" \
      'split(".") | .[1] | @base64d | fromjson |
        .ref == $ref and (.role == "anon" or ($table == "categories" and .role == "service_role"))' >/dev/null 2>&1; then
      echo "Unexpected key role or project reference" >&2
      exit 1
    fi
    key_role=$(printf '%s' "$api_key" | jq -rR 'split(".") | .[1] | @base64d | fromjson | .role')
    echo "API key type: legacy ${key_role}"
    headers+=(--header "Authorization: Bearer ${api_key}")
    ;;
esac

response_file=$(mktemp)
trap 'rm -f "$response_file"' EXIT
case "$monitor_table" in
  service_health) query='select=id,status,project_ref&id=eq.1&limit=2' ;;
  categories) query='select=id&limit=1' ;;
  *) echo "Unsupported monitoring table" >&2; exit 1 ;;
esac
url="https://${SUPABASE_PROJECT_REF}.supabase.co/rest/v1/${monitor_table}?${query}"

validate_response() {
  if [[ "$monitor_table" == service_health ]]; then
    jq -e --arg ref "$SUPABASE_PROJECT_REF" \
      '. == [{"id": 1, "status": "ok", "project_ref": $ref}]' "$response_file" >/dev/null 2>&1
  else
    # Santarita already exposes harmless public category ids; require one real row.
    jq -e '(type == "array") and (length == 1) and
      (.[0] | (type == "object") and (keys == ["id"]) and
        (.id | (type == "string") and (length > 0)))' "$response_file" >/dev/null 2>&1
  fi
}

for attempt in 1 2 3; do
  : > "$response_file"
  # The conditional prevents bash -e from aborting retries on DNS/timeout errors.
  if http_status=$(curl --silent --show-error --connect-timeout 10 --max-time 30 \
    "${headers[@]}" \
    --output "$response_file" --write-out '%{http_code}' "$url"); then
    curl_status=0
  else
    curl_status=$?
  fi

  echo "Attempt ${attempt}/3: curl exit=${curl_status}, HTTP=${http_status}"
  if [[ "$curl_status" == 0 && "$http_status" == 200 ]] && validate_response; then
    echo "Database monitoring row verified for ${SUPABASE_PROJECT_REF}"
    exit 0
  fi

  echo "Database monitoring response failed validation" >&2
  if (( attempt < 3 )); then
    sleep "$((attempt * 10))"
  fi
done

echo "Supabase database check failed after 3 attempts" >&2
exit 1
