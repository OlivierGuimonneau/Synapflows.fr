#!/usr/bin/env bash
set -euo pipefail
DOMAIN="${1:-www.synapflows.fr}"
HEADERS=("Strict-Transport-Security" "X-Frame-Options" "X-Content-Type-Options" "Referrer-Policy" "Permissions-Policy")
for header in "${HEADERS[@]}"; do
  curl -s -I "https://${DOMAIN}" | grep -i "^${header}:" >/dev/null || echo "Missing header: ${header}"
done
code=$(curl -s -o /dev/null -w "%{http_code}" "http://${DOMAIN}")
if [ "$code" != "301" ] && [ "$code" != "308" ]; then
  echo "Redirect issue: ${code}"
fi
