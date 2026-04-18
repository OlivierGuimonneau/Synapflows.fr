#!/bin/bash
# 📊 SynapFlows Security Monitoring with Alerting
# Usage: ./monitor-with-alerts.sh
# Monitors security and sends alerts if issues detected

set -e

DOMAIN="www.synapflows.fr"
LOGDIR="/var/log/synapflows"
LOGFILE="$LOGDIR/security-monitor.log"
ALERTFILE="$LOGDIR/security-alerts.log"
CONFIGFILE="/etc/synapflows/monitor-config.conf"

# Create log directory if not exists
mkdir -p "$LOGDIR"

# Load configuration (email, thresholds, etc.)
if [ -f "$CONFIGFILE" ]; then
  source "$CONFIGFILE"
fi

# Default values if not configured
ALERT_EMAIL="${ALERT_EMAIL:-admin@synapflows.fr}"
CERT_WARNING_DAYS="${CERT_WARNING_DAYS:-14}"
CSP_VIOLATION_THRESHOLD="${CSP_VIOLATION_THRESHOLD:-20}"
RATELIMIT_ABUSE_THRESHOLD="${RATELIMIT_ABUSE_THRESHOLD:-5}"

# Initialize alert list
ALERTS=()
ALERT_COUNT=0

# Function to add alert
add_alert() {
  local level=$1
  local message=$2
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] [$level] $message" >> "$ALERTFILE"
  ALERTS+=("[$level] $message")
  if [ "$level" = "CRITICAL" ] || [ "$level" = "WARNING" ]; then
    ((ALERT_COUNT++))
  fi
}

# Function to send email alert
send_email_alert() {
  local subject=$1
  local body=$2
  
  if command -v mail &> /dev/null; then
    echo "$body" | mail -s "$subject" "$ALERT_EMAIL"
  elif command -v sendmail &> /dev/null; then
    {
      echo "Subject: $subject"
      echo "To: $ALERT_EMAIL"
      echo ""
      echo "$body"
    } | sendmail "$ALERT_EMAIL"
  else
    echo "WARNING: Mail not configured - Alert not sent" >> "$ALERTFILE"
  fi
}

echo "===== SynapFlows Security Monitoring =====" | tee -a "$LOGFILE"
echo "Timestamp: $(date)" | tee -a "$LOGFILE"
echo "" | tee -a "$LOGFILE"

# 1. Check Security Headers
echo "🔒 1. SECURITY HEADERS CHECK" | tee -a "$LOGFILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOGFILE"

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
  RESULT=$(curl -s -I "https://$DOMAIN" 2>/dev/null | grep -i "^$header:" | head -1)
  if [ -z "$RESULT" ]; then
    echo "❌ MISSING: $header" | tee -a "$LOGFILE"
    add_alert "CRITICAL" "Security header missing: $header"
    ((MISSING_HEADERS++))
  else
    echo "✅ PRESENT: $header" | tee -a "$LOGFILE"
  fi
done

echo "" | tee -a "$LOGFILE"

# 2. Check TLS Certificate
echo "🔐 2. TLS CERTIFICATE CHECK" | tee -a "$LOGFILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOGFILE"

if command -v openssl &> /dev/null; then
  CERT_EXPIRY=$(echo "" | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
  CERT_EPOCH=$(date -d "$CERT_EXPIRY" +%s 2>/dev/null || date -j -f "%b %d %T %Z %Y" "$CERT_EXPIRY" +%s 2>/dev/null)
  CURRENT_EPOCH=$(date +%s)
  CERT_DAYS=$(( ($CERT_EPOCH - $CURRENT_EPOCH) / 86400 ))

  echo "Certificate expires: $CERT_EXPIRY" | tee -a "$LOGFILE"
  echo "Days remaining: $CERT_DAYS" | tee -a "$LOGFILE"

  if [ $CERT_DAYS -lt 0 ]; then
    echo "❌ CRITICAL: Certificate has EXPIRED!" | tee -a "$LOGFILE"
    add_alert "CRITICAL" "SSL Certificate has EXPIRED - Immediate action required!"
  elif [ $CERT_DAYS -lt $CERT_WARNING_DAYS ]; then
    echo "⚠️  WARNING: Certificate expires in less than $CERT_WARNING_DAYS days!" | tee -a "$LOGFILE"
    add_alert "WARNING" "SSL Certificate expires in $CERT_DAYS days - Renewal needed soon"
  else
    echo "✅ Certificate is valid" | tee -a "$LOGFILE"
  fi
else
  echo "⚠️  Note: openssl not available - skipping certificate check" | tee -a "$LOGFILE"
fi

echo "" | tee -a "$LOGFILE"

# 3. Check HTTP to HTTPS Redirect
echo "🔄 3. HTTP → HTTPS REDIRECT CHECK" | tee -a "$LOGFILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOGFILE"

REDIRECT=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN 2>/dev/null)
if [ "$REDIRECT" = "301" ] || [ "$REDIRECT" = "308" ]; then
  echo "✅ HTTP → HTTPS redirect active (HTTP $REDIRECT)" | tee -a "$LOGFILE"
else
  echo "⚠️  WARNING: HTTP not redirecting properly (HTTP $REDIRECT)" | tee -a "$LOGFILE"
  add_alert "WARNING" "HTTP redirect not working - Status: $REDIRECT"
fi

echo "" | tee -a "$LOGFILE"

# 4. Check CSP Violations
echo "📋 4. CSP VIOLATION REPORTS" | tee -a "$LOGFILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOGFILE"

if command -v docker &> /dev/null && docker ps | grep -q synapflows-project; then
  # Count CSP violations in last 24 hours
  CSP_VIOLATIONS=$(docker logs synapflows-project 2>&1 | grep -c "CSP VIOLATION REPORT" || echo "0")
  
  echo "CSP violations (recent logs): $CSP_VIOLATIONS" | tee -a "$LOGFILE"

  if [ "$CSP_VIOLATIONS" -gt $CSP_VIOLATION_THRESHOLD ]; then
    echo "⚠️  WARNING: Many CSP violations detected - review whitelist" | tee -a "$LOGFILE"
    add_alert "WARNING" "CSP violations detected: $CSP_VIOLATIONS (threshold: $CSP_VIOLATION_THRESHOLD)"
  else
    echo "✅ CSP violations within acceptable range" | tee -a "$LOGFILE"
  fi
else
  echo "⚠️  Note: Docker not available - skipping CSP check" | tee -a "$LOGFILE"
fi

echo "" | tee -a "$LOGFILE"

# 5. Check Rate Limit Abuse
echo "🚦 5. RATE LIMIT CHECK" | tee -a "$LOGFILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOGFILE"

if command -v docker &> /dev/null && docker ps | grep -q synapflows-project; then
  RATELIMIT_HITS=$(docker logs synapflows-project 2>&1 | grep -c "Too many requests" || echo "0")
  
  echo "Rate limit hits (recent logs): $RATELIMIT_HITS" | tee -a "$LOGFILE"

  if [ "$RATELIMIT_HITS" -gt $RATELIMIT_ABUSE_THRESHOLD ]; then
    echo "⚠️  WARNING: Rate limiting being triggered - possible abuse detected" | tee -a "$LOGFILE"
    add_alert "WARNING" "Rate limiting activated: $RATELIMIT_HITS hits detected"
  else
    echo "✅ Rate limiting normal" | tee -a "$LOGFILE"
  fi
else
  echo "⚠️  Note: Docker not available - skipping rate limit check" | tee -a "$LOGFILE"
fi

echo "" | tee -a "$LOGFILE"

# 6. Check Container Health
echo "🏥 6. CONTAINER HEALTH CHECK" | tee -a "$LOGFILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOGFILE"

if command -v docker &> /dev/null; then
  HEALTH=$(docker inspect synapflows-project --format='{{.State.Health.Status}}' 2>/dev/null || echo "N/A")
  if [ "$HEALTH" = "healthy" ]; then
    echo "✅ Container status: HEALTHY" | tee -a "$LOGFILE"
  else
    echo "❌ Container status: $HEALTH" | tee -a "$LOGFILE"
    add_alert "WARNING" "Container health status: $HEALTH"
  fi
else
  echo "⚠️  Note: Docker not available - skipping health check" | tee -a "$LOGFILE"
fi

echo "" | tee -a "$LOGFILE"

# 7. Check Response Time
echo "⏱️  7. RESPONSE TIME CHECK" | tee -a "$LOGFILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOGFILE"

RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "https://$DOMAIN" 2>/dev/null)
echo "Response time: ${RESPONSE_TIME}s" | tee -a "$LOGFILE"

RESPONSE_THRESHOLD=2.0
if (( $(echo "$RESPONSE_TIME > $RESPONSE_THRESHOLD" | bc -l 2>/dev/null || echo 0) )); then
  echo "⚠️  WARNING: Slow response time" | tee -a "$LOGFILE"
  add_alert "WARNING" "Slow response time: ${RESPONSE_TIME}s (threshold: ${RESPONSE_THRESHOLD}s)"
else
  echo "✅ Response time acceptable" | tee -a "$LOGFILE"
fi

echo "" | tee -a "$LOGFILE"

# 8. Summary
echo "📊 SUMMARY" | tee -a "$LOGFILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOGFILE"

if [ $MISSING_HEADERS -eq 0 ] && [ $ALERT_COUNT -eq 0 ]; then
  echo "✅ All security checks PASSED - No alerts" | tee -a "$LOGFILE"
  STATUS="PASS"
  EXIT_CODE=0
else
  echo "⚠️  Some checks require attention ($ALERT_COUNT alerts)" | tee -a "$LOGFILE"
  STATUS="ALERT"
  EXIT_CODE=1
fi

echo "" | tee -a "$LOGFILE"
echo "Total Alerts: $ALERT_COUNT" | tee -a "$LOGFILE"
echo "Log files: $LOGFILE, $ALERTFILE" | tee -a "$LOGFILE"

# Send email if there are alerts
if [ $ALERT_COUNT -gt 0 ]; then
  EMAIL_BODY="SynapFlows Security Monitoring Report - STATUS: $STATUS

Date: $(date)
Domain: $DOMAIN

ALERTS DETECTED ($ALERT_COUNT):
"
  for alert in "${ALERTS[@]}"; do
    EMAIL_BODY="$EMAIL_BODY
$alert"
  done

  EMAIL_BODY="$EMAIL_BODY

Please review the full logs at: $LOGFILE
Alert logs at: $ALERTFILE

For details, run: tail -50 $ALERTFILE
"

  if [ -n "$ALERT_EMAIL" ]; then
    echo "📧 Sending email alert to: $ALERT_EMAIL" | tee -a "$LOGFILE"
    send_email_alert "🚨 SynapFlows Security Alert - $STATUS" "$EMAIL_BODY"
  fi
fi

exit $EXIT_CODE
