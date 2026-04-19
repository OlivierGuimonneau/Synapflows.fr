# 🎉 CRON & ALERTING – Complete Solution

**Created:** 11 avril 2026  
**Status:** ✅ Ready to deploy to production server

---

## 📦 What You've Received

### Scripts (Ready to Deploy)

1. **`monitor-with-alerts.sh`** ⭐
   - Main monitoring script with email alerting
   - Checks: Headers, certificate, redirect, CSP, rate limit, container health, response time
   - Sends email if issues detected
   - Reads configuration from `/etc/synapflows/monitor-config.conf`
   - **Action:** Upload to server and copy to `/opt/synapflows/`

2. **`setup-cron.sh`** ⭐
   - Automated setup script (one-command deployment)
   - Creates directories, installs dependencies, sets up cron job
   - Configures log rotation
   - **Action:** Run with `sudo bash setup-cron.sh`

3. **`monitor-security.sh`** (Optional)
   - Backup monitoring script (simpler version without alerts)
   - Can be used as alternative
   - **Action:** Optional backup

### Configuration

4. **`monitor-config.conf`** ⭐⭐
   - ALL settings in one file
   - Email address, alert thresholds, schedule
   - **Must customize:** `ALERT_EMAIL` at minimum
   - **Action:** Edit, upload, critical for alerts to work

### Documentation

5. **`CRON_ALERTING_SETUP.md`** (Complete Guide)
   - 500+ lines of detailed instructions
   - Step-by-step setup
   - Troubleshooting guide
   - Advanced configurations (Slack, PagerDuty)

6. **`QUICK_START_CRON.md`** (TL;DR)
   - 5-minute quick setup
   - Copy-paste commands
   - Common issues & fixes

---

## 🚀 Deployment Steps (Production Server)

### Step 1: Download Files Locally

All files are in: `d:\SynapFlows-ProjectSubmission\`

```
✅ monitor-with-alerts.sh
✅ setup-cron.sh  
✅ monitor-security.sh
✅ monitor-config.conf
✅ CRON_ALERTING_SETUP.md
✅ QUICK_START_CRON.md
```

### Step 2: Upload to Server

```bash
# From your local machine
cd d:\SynapFlows-ProjectSubmission\

scp monitor-with-alerts.sh user@your-server:~/
scp setup-cron.sh user@your-server:~/
scp monitor-config.conf user@your-server:~/
```

### Step 3: SSH to Server & Run Setup

```bash
ssh user@your-server

cd ~
sudo bash setup-cron.sh
```

### Step 4: Configure Email (IMPORTANT!)

```bash
sudo nano /etc/synapflows/monitor-config.conf

# Find this line:
ALERT_EMAIL="admin@synapflows.fr"

# Change "admin@synapflows.fr" to YOUR EMAIL
# Save: Ctrl+X, Y, Enter
```

### Step 5: Test

```bash
/opt/synapflows/monitor-with-alerts.sh
```

**Expected output:**
```
✅ 1. SECURITY HEADERS CHECK - All present
✅ 2. TLS CERTIFICATE CHECK - Valid
✅ 3. HTTP REDIRECT CHECK - Working
✅ 4. CONTAINER HEALTH CHECK - Healthy
✅ 5. RESPONSE TIME CHECK - Acceptable
📊 SUMMARY: All security checks PASSED
```

### Step 6: Verify Cron Job

```bash
# Check if cron job created
cat /etc/cron.d/synapflows-monitor

# Should show:
# 0 9 * * * root /opt/synapflows/monitor-with-alerts.sh ...
```

✅ **DONE!** Monitoring now runs daily at 9 AM with email alerts.

---

## 📧 Email Alert System

### How It Works

1. **Daily at 9 AM:** Cron job runs monitoring script
2. **Checks performed:** 7 different security checks
3. **If issues found:** Alert email sent immediately
4. **Alert includes:** What's wrong, how to fix it, log file locations

### Types of Alerts

```
🚨 CRITICAL ALERTS (Always sent):
   - Certificate expired
   - Security header missing
   - Container unhealthy

⚠️ WARNING ALERTS (If threshold exceeded):
   - Certificate expires soon (< 14 days)
   - HTTP redirect broken
   - CSP violations high (> 20)
   - Rate limiting triggered (> 5 hits)
   - Slow response time (> 2 seconds)

✅ SUCCESS (No email):
   - All checks pass
```

### Adjusting Thresholds

Edit `/etc/synapflows/monitor-config.conf`:

```bash
# More sensitive alerts (more emails)
CERT_WARNING_DAYS=30              # Alert 30 days early
CSP_VIOLATION_THRESHOLD=5         # Alert at 5 violations

# Less sensitive (fewer emails)
CERT_WARNING_DAYS=7               # Alert only 1 week early
CSP_VIOLATION_THRESHOLD=50        # Alert at 50 violations
```

---

## ⏰ Cron Schedule Options

### Default: Daily

```bash
MONITORING_FREQUENCY="daily"
CUSTOM_CRON="0 9 * * *"  # 9 AM every day
```

### Every 4 Hours (24/7 Monitoring)

```bash
MONITORING_FREQUENCY="four-times"
CUSTOM_CRON="0 6,12,18,0 * * *"  # 6AM, 12PM, 6PM, Midnight
```

### Every Hour (Intensive)

```bash
MONITORING_FREQUENCY="hourly"
CUSTOM_CRON="0 * * * *"  # Every hour on the hour
```

To apply changes:
```bash
sudo nano /etc/synapflows/monitor-config.conf
# Edit CUSTOM_CRON
# Save

# Restart cron (optional, auto-detects)
sudo systemctl restart cron
```

---

## 📊 Monitoring Checks (What Gets Checked)

```
✅ Security Headers - All 7 headers present?
   ├─ Content-Security-Policy-Report-Only
   ├─ Strict-Transport-Security
   ├─ X-Frame-Options
   ├─ X-Content-Type-Options
   ├─ Referrer-Policy
   ├─ Permissions-Policy
   └─ Expect-CT

🔐 TLS Certificate - Valid and not expiring soon?
   ├─ Expiration date
   ├─ Days remaining
   └─ Alert if < 14 days

🔄 HTTP Redirect - Is HTTP→HTTPS working?
   └─ Returns 301 or 308 status

📋 CSP Violations - Too many blocked resources?
   └─ Alert if > 20 violations

🚦 Rate Limiting - Being abused?
   └─ Alert if > 5 limit hits

🏥 Container Health - App running OK?
   └─ Docker health status

⏱️ Response Time - Fast enough?
   └─ Alert if > 2 seconds
```

---

## 📁 After Setup: Log Files

```
/var/log/synapflows/
├── security-monitor.log      ← Main execution log (grows daily)
├── security-alerts.log       ← Alerts only (when issues found)
├── cron.log                  ← Cron job execution log
└── *-old.gz                  ← Compressed old logs (90-day rotation)
```

### Viewing Logs

```bash
# Today's monitoring
tail -50 /var/log/synapflows/security-monitor.log

# Recent alerts
tail -20 /var/log/synapflows/security-alerts.log

# Cron execution
tail -10 /var/log/synapflows/cron.log

# Search for specific alerts
grep "CRITICAL\|WARNING" /var/log/synapflows/security-alerts.log
```

---

## 🧪 Testing the Setup

### Test 1: Manual Run

```bash
/opt/synapflows/monitor-with-alerts.sh

# Should complete in ~10 seconds
# Shows all checks and status
```

### Test 2: Verify Email

```bash
# Send test email
echo "Test" | mail -s "Test Alert" admin@synapflows.fr

# Check if delivered (may take seconds)
```

### Test 3: Trigger Alert

```bash
# Edit config with very low threshold
sudo nano /etc/synapflows/monitor-config.conf

# Change to:
CERT_WARNING_DAYS=365  # Force warning

# Run script
/opt/synapflows/monitor-with-alerts.sh

# Should see alert in output and receive email
# Change back to: CERT_WARNING_DAYS=14
```

### Test 4: Check Cron Execution

```bash
# View next scheduled runs
grep synapflows /etc/cron.d/synapflows-monitor

# See recent cron activity
grep CRON /var/log/syslog | grep synapflows | tail -5
```

---

## ✅ Success Checklist

After setup, verify:

- [ ] `/etc/synapflows/monitor-config.conf` exists and edited with your email
- [ ] `/etc/cron.d/synapflows-monitor` cron job exists
- [ ] `/opt/synapflows/monitor-with-alerts.sh` is executable
- [ ] Test email sends successfully
- [ ] Manual script run completes without errors
- [ ] Logs created in `/var/log/synapflows/`
- [ ] Cron job in syslog after scheduled time

---

## 🎓 Advanced Configurations

### Slack Notifications

```bash
# Get Slack webhook URL at:
# https://slack.com/apps/A0F81R7U7-incoming-webhooks

# Add to monitor-config.conf:
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/T.../B.../..."

# Modify monitor-with-alerts.sh to include:
# curl -X POST $SLACK_WEBHOOK_URL -d "payload={...}"
```

### Multiple Email Recipients

```bash
# In monitor-config.conf:
ALERT_EMAIL="admin@synapflows.fr,ops@synapflows.fr,cto@synapflows.fr"
```

### Run as Dedicated User

```bash
# More secure than root
sudo useradd -r -s /bin/false synapflows-monitor

# Give permissions
sudo chown synapflows-monitor:synapflows-monitor /opt/synapflows/monitor-with-alerts.sh
sudo chmod 750 /var/log/synapflows

# Update cron (in /etc/cron.d/synapflows-monitor):
# 0 9 * * * synapflows-monitor /opt/synapflows/monitor-with-alerts.sh
```

---

## 📞 Troubleshooting

### Cron job not running?
```bash
# Check cron is enabled
sudo systemctl status cron

# Check file is in /etc/cron.d/ (not crontab -e)
ls -la /etc/cron.d/synapflows-monitor

# Check cron logs
grep synapflows /var/log/syslog
```

### No email alerts?
```bash
# Verify mail installed
command -v mail

# Test manually
echo "Test" | mail -s "Alert" admin@synapflows.fr

# Check mail queue
mailq

# View mail logs
tail -50 /var/log/mail.log
```

### Script errors?
```bash
# Run manually with verbose output
bash -x /opt/synapflows/monitor-with-alerts.sh

# Check for missing dependencies
which curl openssl docker

# Read setup log
cat /var/log/synapflows/cron.log
```

---

## 📚 Documentation Files

| File | Use | Audience |
|------|-----|----------|
| **QUICK_START_CRON.md** | 5-min setup | Everyone |
| **CRON_ALERTING_SETUP.md** | Complete guide | Technical teams |
| **IMMEDIATE_PRIORITIES.md** | Next 72h actions | Project managers |
| **POST_REMEDIATION_ACTION_PLAN.md** | Long-term strategy | Leadership |

---

## 🎊 You're All Set!

Your SynapFlows monitoring system is now:

✅ **Automated** - Runs daily without intervention  
✅ **Proactive** - Sends alerts before problems occur  
✅ **Comprehensive** - Checks 7 critical security areas  
✅ **Documented** - Full guides for any situation  
✅ **Scalable** - Add more checks/alerts as needed  

---

## 🚀 Next: Deploy & Monitor

1. **Upload files** to production server
2. **Run `sudo bash setup-cron.sh`** 
3. **Edit email** in config
4. **Test both** (manual run + verify cron)
5. **Wait for 9 AM** - First automated check will run

**That's it!** 🎉

---

*Complete Cron & Alerting Solution  
Created: 11 avril 2026 - 14h30 UTC*
