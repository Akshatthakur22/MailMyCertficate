#!/usr/bin/env bash
# Verify marketing pages ship semantic HTML without CSR bailout.
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
PATHS=("/" "/guide" "/about" "/privacy-policy" "/contact" "/google-sheets-certificate-generator" "/google-forms-to-certificates" "/send-certificates-gmail-bulk" "/hackathon-certificate-generator" "/canva-certificate-alternative" "/vs/certifier")

fail=0

for path in "${PATHS[@]}"; do
  html=$(curl -fsS "${BASE_URL}${path}")
  h1=$(echo "$html" | grep -c '<h1' || true)
  bailout=$(echo "$html" | grep -c 'BAILOUT_TO_CLIENT_SIDE_RENDERING' || true)

  echo "${BASE_URL}${path} | h1=${h1} | bailout=${bailout}"

  if [[ "$h1" -lt 1 ]]; then
    echo "  FAIL: expected at least one <h1>"
    fail=1
  fi

  if [[ "$bailout" -gt 0 ]]; then
    echo "  FAIL: CSR bailout detected"
    fail=1
  fi
done

llms_status=$(curl -s -o /dev/null -w '%{http_code}' "${BASE_URL}/llms.txt")
echo "${BASE_URL}/llms.txt | status=${llms_status}"
if [[ "$llms_status" != "200" ]]; then
  echo "  FAIL: llms.txt should return 200"
  fail=1
fi

exit "$fail"
