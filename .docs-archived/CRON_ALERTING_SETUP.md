# ⏰ CRON JOB & ALERTING SETUP GUIDE

**Date:** 11 avril 2026  
**Purpose:** Automate daily security monitoring with email alerts  
**Target Server:** Ubuntu/Debian Linux server (project.synapflows.fr)

---

## 🚀 Quick Start (5 minutes)

### Step 1: Upload Files to Server

```bash
# On your local machine
scp monitor-with-alerts.sh user@your-server:/home/user/
scp monitor-config.conf user@your-server:/home/user/
scp setup-cron.sh user@your-server:/home/user/
```

### Step 2: Run Setup Script

```bash
# SSH into server
ssh user@your-server

# Navigate to directory
cd /home/user

# Run setup (requires sudo)
sudo bash setup-cron.sh
```

### Step 3: Configure Email

```bash
# Edit configuration
sudo nano /etc/synapflows/monitor-config.conf

# Find and update:
ALERT_EMAIL="your-email@synapflows.fr"

# Save (Ctrl+X, Y, Enter)
```

### Step 4: Test

```bash
# Run monitoring script manually
/opt/synapflows/monitor-with-alerts.sh

# Check logs
tail /var/log/synapflows/security-monitor.log

# If all looks good, you're done! ✅
```

---

## 📋 Detailed Setup Instructions

### Prerequisite: SSH Access to Server

You need SSH access to the Linux server running SynapFlows.

```bash
# Test connection
ssh user@project.synapflows.fr
# Should not ask for password if using SSH keys
```

---

## 🔧 Manual Setup (If Not Using setup-cron.sh)

### Step 1: Create Directories

```bash
sudo mkdir -p /var/log/synapflows
sudo mkdir -p /etc/synapflows
sudo mkdir -p /opt/synapflows
```

### Step 2: Copy Monitoring Scripts

```bash
# Copy scripts to /opt/synapflows/
sudo cp monitor-with-alerts.sh /opt/synapflows/
sudo cp monitor-security.sh /opt/synapflows/

# Make executable
sudo chmod 755 /opt/synapflows/*.sh
```

### Step 3: Install Email Support

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y mailutils
```

**CentOS/RHEL:**
```bash
sudo yum install -y mailx
```

**Alpine:**
```bash
sudo apk add --no-cache postfix
```

### Step 4: Copy Configuration

```bash
sudo cp monitor-config.conf /etc/synapflows/
sudo chmod 640 /etc/synapflows/monitor-config.conf
```

### Step 5: Edit Configuration

```bash
sudo nano /etc/synapflows/monitor-config.conf
```

**Key settings to update:**

```bash
# Your email for alerts
ALERT_EMAIL="admin@synapflows.fr"

# Alert thresholds
CERT_WARNING_DAYS=14          # Warn if cert expires in 14 days
CSP_VIOLATION_THRESHOLD=20    # Alert if > 20 CSP violations
RATELIMIT_ABUSE_THRESHOLD=5   # Alert if > 5 rate limit hits

# Monitoring frequency
MONITORING_FREQUENCY="daily"  # Options: hourly, four-times, daily
CUSTOM_CRON="0 9 * * *"       # Daily at 9 AM
```

### Step 6: Create Cron Job

**Option A: Automatic (recommended)**
```bash
sudo setup-cron.sh
```

**Option B: Manual**
```bash
# Create cron job file
sudo tee /etc/cron.d/synapflows-monitor > /dev/null << 'EOF'
# SynapFlows Security Monitoring - Daily at 9 AM
0 9 * * * root /opt/synapflows/monitor-with-alerts.sh >> /var/log/synapflows/cron.log 2>&1
EOF

# Make it executable
sudo chmod 644 /etc/cron.d/synapflows-monitor
```

### Step 7: Setup Log Rotation

```bash
sudo tee /etc/logrotate.d/synapflows > /dev/null << 'EOF'
/var/log/synapflows/*.log {
  daily
  rotate 90
  missingok
  notifempty
  compress
}
EOF
```

---

## 📧 Email Alert Configuration

### Test Email First

```bash
# Send test email
echo "Test alert from SynapFlows" | mail -s "Test Alert" admin@synapflows.fr

# Check if received (may take a few seconds)
```

### Common Email Issues

**Issue: "mail command not found"**
```bash
# Solution: Install mailutils
sudo apt-get install -y mailutils
# Then test again
```

**Issue: "Email not sending from cron"**
```bash
# Cron uses limited environment - verify:
# 1. Mail command works: mail -s "Test" admin@email.com
# 2. Cron job in /etc/cron.d/ (not user crontab)
# 3. Check cron log: grep CRON /var/log/syslog
```

**Issue: "Emails going to spam"**
```bash
# Add DKIM/SPF records to your domain
# Or use service like SendGrid/MailGun instead

# With SendGrid:
# 1. Create SendGrid API key
# 2. Modify monitoring script to use curl instead of mail:
#    curl -X POST https://api.sendgrid.com/v3/mail/send ...
```

---

## ⏰ Cron Schedule Options

### Predefined Schedules

```bash
# Daily (9 AM)
MONITORING_FREQUENCY="daily"
CUSTOM_CRON="0 9 * * *"

# Four times daily (6 AM, 12 PM, 6 PM, Midnight)
MONITORING_FREQUENCY="four-times"
CUSTOM_CRON="0 6,12,18,0 * * *"

# Hourly
MONITORING_FREQUENCY="hourly"
CUSTOM_CRON="0 * * * *"

# Custom (edit CUSTOM_CRON directly)
MONITORING_FREQUENCY="custom"
CUSTOM_CRON="*/30 * * * *"  # Every 30 minutes
```

### Cron Syntax Reference

```
┌─────── minute (0-59)
│ ┌───── hour (0-23)
│ │ ┌─── day of month (1-31)
│ │ │ ┌─ month (1-12)
│ │ │ │ ┌ day of week (0-7, Sunday=0 or 7)
│ │ │ │ │
│ │ │ │ │
* * * * *  command

Examples:
0 9 * * *     = Daily at 9:00 AM
0 */4 * * *   = Every 4 hours
0 9 * * 1-5   = Weekdays at 9 AM (Mon-Fri)
0 0 1 * *     = First day of month at midnight
0 */6 * * *   = Every 6 hours
```

---

## 🔔 Alert Types & Thresholds

### Automatic Alert Triggers

| Alert | Threshold | Example |
|-------|-----------|---------|
| **Certificate Expiry** | < 14 days | "SSL Certificate expires in 10 days" |
| **Missing Header** | Any missing | "Security header missing: X-Frame-Options" |
| **CSP Violations** | > 20 violations | "CSP violations: 35 (threshold: 20)" |
| **Rate Limit Abuse** | > 5 hits | "Rate limiting: 8 abuse attempts" |
| **Container Down** | Not healthy | "Container health: unhealthy" |
| **Slow Response** | > 2 seconds | "Response time: 2.5s (threshold: 2.0s)" |
| **HTTP Redirect Broken** | Non 301/308 | "HTTP redirect status: 200 (expected 301)" |

### Adjusting Thresholds

**In `/etc/synapflows/monitor-config.conf`:**

```bash
# More sensitive (more alerts)
CERT_WARNING_DAYS=30              # Alert 30 days before expiry
CSP_VIOLATION_THRESHOLD=5         # Alert if > 5 violations
RATELIMIT_ABUSE_THRESHOLD=3       # Alert if > 3 rate limit hits
RESPONSE_TIME_THRESHOLD=1.0       # Alert if > 1 second

# Less sensitive (fewer alerts)
CERT_WARNING_DAYS=7               # Alert only 7 days before
CSP_VIOLATION_THRESHOLD=50        # Alert if > 50 violations
RATELIMIT_ABUSE_THRESHOLD=10      # Alert if > 10 rate limit hits
RESPONSE_TIME_THRESHOLD=5.0       # Alert if > 5 seconds
```

---

## 📊 Viewing Logs

### Real-time Monitoring

```bash
# Watch monitoring log as it updates
tail -f /var/log/synapflows/security-monitor.log

# Watch alerts only
tail -f /var/log/synapflows/security-alerts.log

# Watch cron execution
tail -f /var/log/synapflows/cron.log
```

### Check Cron Execution

```bash
# View cron job schedule
cat /etc/cron.d/synapflows-monitor

# Check if cron daemon is running
sudo systemctl status cron

# View system cron logs
grep CRON /var/log/syslog | tail -20

# On CentOS/RHEL
grep CRON /var/log/cron | tail -20
```

---

## 🧪 Testing & Troubleshooting

### Test 1: Run Script Manually

```bash
# Execute monitoring script directly
/opt/synapflows/monitor-with-alerts.sh

# Check exit code (0 = success, 1 = alerts)
echo $?

# Expected output:
# ✅ SECURITY HEADERS CHECK - All headers present
# ✅ TLS CERTIFICATE CHECK - Valid
# ✅ HTTP REDIRECT CHECK - Working
# etc.
```

### Test 2: Check Email Sending

```bash
# Send test email
echo "Test alert" | mail -s "Test Subject" admin@synapflows.fr

# Check mail queue
mailq

# If stuck, flush queue
postfix flush
```

### Test 3: Verify Cron Execution

```bash
# Temporarily set cron to run in 1 minute
crontab -e
# Add: * * * * * /opt/synapflows/monitor-with-alerts.sh

# Wait 1 minute, then check:
tail -f /var/log/synapflows/cron.log

# After testing, remove that line and restore normal schedule
```

### Test 4: Verify Alert Thresholds

```bash
# Edit config to trigger test alert
sudo nano /etc/synapflows/monitor-config.conf

# Change to very low threshold temporarily:
CERT_WARNING_DAYS=365  # Always trigger warning

# Run script
/opt/synapflows/monitor-with-alerts.sh

# Should see alert in output and receive email

# Change back to normal threshold
```

---

## 🔐 Security Best Practices

### 1. Protect Configuration File

```bash
# Restrict access to config with email/API keys
sudo chmod 640 /etc/synapflows/monitor-config.conf
sudo chown root:root /etc/synapflows/monitor-config.conf

# Only root and owner can read
ls -la /etc/synapflows/monitor-config.conf
# -rw-r----- 1 root root
```

### 2. Log File Permissions

```bash
# Ensure logs not world-readable
sudo chmod 750 /var/log/synapflows
sudo chmod 640 /var/log/synapflows/*.log
```

### 3. Use Service Account (Optional)

```bash
# Create dedicated monitoring user
sudo useradd -r -s /bin/false -d /var/lib/synapflows synapflows

# Change script owner
sudo chown synapflows:synapflows /opt/synapflows/monitor-with-alerts.sh

# Run as this user in cron (instead of root)
sudo -u synapflows /opt/synapflows/monitor-with-alerts.sh
```

---

## 📞 Troubleshooting Checklist

- [ ] SSH access to server working
- [ ] Directories /var/log/synapflows, /etc/synapflows, /opt/synapflows created
- [ ] Scripts copied and executable (755 permissions)
- [ ] mailutils/sendmail installed and working
- [ ] Configuration file updated with correct email
- [ ] Cron job in /etc/cron.d/ (not user crontab)
- [ ] Test email sends successfully
- [ ] Monitoring script runs without errors manually
- [ ] Cron log shows successful execution
- [ ] Alerts received when thresholds crossed

---

## 🎓 Advanced Configuration

### Slack Integration

```bash
# Get Slack Webhook URL
# 1. Go to: https://slack.com/apps/A0F81R7U7
# 2. Click "Add to Slack"
# 3. Select channel for alerts
# 4. Copy webhook URL

# Add to config
echo 'SLACK_WEBHOOK_URL="https://hooks.slack.com/..."' >> /etc/synapflows/monitor-config.conf

# Modify monitoring script to include:
# curl -X POST $SLACK_WEBHOOK_URL --data "payload={\"text\":\"$message\"}"
```

### PagerDuty Integration

```bash
# Get PagerDuty integration key
# 1. Create PagerDuty service
# 2. Add integration
# 3. Copy integration key

# Add to config
echo 'PAGERDUTY_KEY="YOUR_KEY"' >> /etc/synapflows/monitor-config.conf

# Use PagerDuty API for critical alerts
```

### Custom Alerting

```bash
# Trigger custom scripts on alert
# Edit monitoring-with-alerts.sh and add:

if [ $ALERT_COUNT -gt 0 ]; then
  # Call custom alert handler
  /opt/synapflows/custom-alert-handler.sh "$ALERT_COUNT"
fi
```

---

## 📝 Configuration Template

Save this as `/etc/synapflows/monitor-config.conf`:

```bash
# SynapFlows Monitoring Configuration

# Email Alerts
ALERT_EMAIL="admin@synapflows.fr"
SEND_EMAIL_ALERTS=true

# Thresholds
CERT_WARNING_DAYS=14
CSP_VIOLATION_THRESHOLD=20
RATELIMIT_ABUSE_THRESHOLD=5
RESPONSE_TIME_THRESHOLD=2.0

# Schedule (Daily at 9 AM)
MONITORING_FREQUENCY="daily"
CUSTOM_CRON="0 9 * * *"

# Logging
LOG_DIR="/var/log/synapflows"
KEEP_LOGS_DAYS=90

# Alert hours (suppress outside these)
MAINTENANCE_WINDOW=""  # Empty = always alert
ALERT_WEEKENDS=true    # false = no alerts weekends
```

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Cron job exists in `/etc/cron.d/synapflows-monitor`
2. ✅ Log file grows daily: `/var/log/synapflows/security-monitor.log`
3. ✅ Email received daily with status
4. ✅ Manual script run shows all checks passing
5. ✅ When threshold crossed, alert email sent
6. ✅ Logs rotated daily (old logs compressed)

---

## 📞 Support Commands

```bash
# Verify setup complete
echo "=== Setup Verification ===" ; \
ls -la /etc/synapflows/monitor-config.conf && \
ls -la /etc/cron.d/synapflows-monitor && \
ls -la /opt/synapflows/monitor-with-alerts.sh && \
echo "✅ All files present"

# Test email
echo "Test" | mail -s "Test Alert" admin@synapflows.fr && echo "✅ Email sent"

# Run monitoring
/opt/synapflows/monitor-with-alerts.sh && echo "✅ Monitoring works"

# Check cron
sudo grep "synapflows-monitor" /var/log/syslog | tail -5
```

---

*Setup Guide Created: 11 avril 2026*  
*Next Review: After first 24-hour cron cycle*
