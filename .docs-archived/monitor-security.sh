#!/bin/bash
# 📊 SynapFlows Security Monitoring Script
# Usage: ./monitor-security.sh
# Check production security headers and TLS status

DOMAIN="www.synapflows.fr"
LOGFILE="/var/log/synapflows-monitor.log"

echo "===== SynapFlows Security Monitoring =====" | tee -a $LOGFILE
echo "Timestamp: $(date)" | tee -a $LOGFILE
echo "" | tee -a $LOGFILE

# 1. Check Security Headers
echo "🔒 1. SECURITY HEADERS CHECK" | tee -a $LOGFILE
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $LOGFILE

declare -a HEADERS=(
  "Content-Security-Policy-Report-Only"
  "Strict-Transport-Security" 
  "X-Frame-Options"
  "X-Content-Type-Options"
  "Referrer-Policy"
  "Permissions-Policy"
  "Expect-CT"
)

MISSING_HEADERS=0
for header in "${HEADERS[@]}"; do
  RESULT=$(curl -s -I "https://$DOMAIN" | grep -i "^$header:" | head -1)
  if [ -z "$RESULT" ]; then
    echo "❌ MISSING: $header" | tee -a $LOGFILE
    ((MISSING_HEADERS++))
  else
    echo "✅ PRESENT: $header" | tee -a $LOGFILE
  fi
done

echo "" | tee -a $LOGFILE

# 2. Check TLS Certificate
echo "🔐 2. TLS CERTIFICATE CHECK" | tee -a $LOGFILE
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $LOGFILE

CERT_EXPIRY=$(echo "" | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
CERT_DAYS=$(($(date -d "$CERT_EXPIRY" +%s) - $(date +%s))) 
CERT_DAYS=$((CERT_DAYS / 86400))

echo "Certificate expires: $CERT_EXPIRY" | tee -a $LOGFILE
echo "Days remaining: $CERT_DAYS" | tee -a $LOGFILE

if [ $CERT_DAYS -lt 14 ]; then
  echo "⚠️  WARNING: Certificate expires in less than 14 days!" | tee -a $LOGFILE
elif [ $CERT_DAYS -lt 0 ]; then
  echo "❌ CRITICAL: Certificate has expired!" | tee -a $LOGFILE
else
  echo "✅ Certificate is valid" | tee -a $LOGFILE
fi

echo "" | tee -a $LOGFILE

# 3. Check HTTP to HTTPS Redirect
echo "🔄 3. HTTP → HTTPS REDIRECT CHECK" | tee -a $LOGFILE
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $LOGFILE

REDIRECT=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN)
if [ "$REDIRECT" = "301" ] || [ "$REDIRECT" = "308" ]; then
  echo "✅ HTTP → HTTPS redirect active (HTTP $REDIRECT)" | tee -a $LOGFILE
else
  echo "⚠️  WARNING: HTTP not redirecting properly (HTTP $REDIRECT)" | tee -a $LOGFILE
fi

echo "" | tee -a $LOGFILE

# 4. Check CSP Violations
echo "📋 4. CSP VIOLATION REPORTS" | tee -a $LOGFILE
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $LOGFILE

CSP_VIOLATIONS=$(docker logs synapflows-project 2>&1 | grep -c "CSP VIOLATION REPORT" || echo "0")
echo "CSP violations (last logs): $CSP_VIOLATIONS" | tee -a $LOGFILE

if [ "$CSP_VIOLATIONS" -gt 10 ]; then
  echo "⚠️  WARNING: Many CSP violations detected - review whitelist" | tee -a $LOGFILE
else
  echo "✅ CSP violations within acceptable range" | tee -a $LOGFILE
fi

echo "" | tee -a $LOGFILE

# 5. Check Container Health
echo "🏥 5. CONTAINER HEALTH CHECK" | tee -a $LOGFILE
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $LOGFILE

HEALTH=$(docker inspect synapflows-project --format='{{.State.Health.Status}}' 2>/dev/null)
if [ "$HEALTH" = "healthy" ]; then
  echo "✅ Container status: HEALTHY" | tee -a $LOGFILE
else
  echo "❌ Container status: $HEALTH" | tee -a $LOGFILE
fi

echo "" | tee -a $LOGFILE

# 6. Check Response Time
echo "⏱️  6. RESPONSE TIME CHECK" | tee -a $LOGFILE
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $LOGFILE

RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "https://$DOMAIN")
echo "Response time: ${RESPONSE_TIME}s" | tee -a $LOGFILE

if (( $(echo "$RESPONSE_TIME > 2" | bc -l) )); then
  echo "⚠️  WARNING: Slow response time" | tee -a $LOGFILE
else
  echo "✅ Response time acceptable" | tee -a $LOGFILE
fi

echo "" | tee -a $LOGFILE

# 7. Summary
echo "📊 SUMMARY" | tee -a $LOGFILE
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $LOGFILE

if [ $MISSING_HEADERS -eq 0 ] && [ "$HEALTH" = "healthy" ] && [ $CERT_DAYS -gt 14 ]; then
  echo "✅ All security checks PASSED" | tee -a $LOGFILE
  EXIT_CODE=0
else
  echo "⚠️  Some checks require attention" | tee -a $LOGFILE
  EXIT_CODE=1
fi

echo "" | tee -a $LOGFILE
echo "Log saved to: $LOGFILE" 
exit $EXIT_CODE
