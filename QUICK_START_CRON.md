# ⚡ QUICK START – Cron & Alerts Configuration

**Time needed:** ~10 minutes  
**Requirements:** SSH access to server, sudo privileges

---

## 🚀 QUICK SETUP (Copy-Paste Ready)

### 1. Upload Files

```bash
scp monitor-with-alerts.sh user@your-server:~/
scp monitor-config.conf user@your-server:~/
scp setup-cron.sh user@your-server:~/
```

### 2. SSH to Server & Setup

```bash
ssh user@your-server

cd ~
sudo bash setup-cron.sh
```

### 3. Configure Email (Important!)

```bash
sudo nano /etc/synapflows/monitor-config.conf
# Find: ALERT_EMAIL="admin@synapflows.fr"
# Change to your email
# Save: Ctrl+X, Y, Enter
```

### 4. Test

```bash
/opt/synapflows/monitor-with-alerts.sh
tail /var/log/synapflows/security-monitor.log
```

✅ **Done!** Monitoring runs daily at 9 AM with email alerts.

---

## 📋 Key Files & Locations

| File | Location | Purpose |
|------|----------|---------|
| **Configuration** | `/etc/synapflows/monitor-config.conf` | Email, thresholds, frequency |
| **Cron Schedule** | `/etc/cron.d/synapflows-monitor` | When to run monitoring |
| **Script** | `/opt/synapflows/monitor-with-alerts.sh` | Main monitoring executable |
| **Logs** | `/var/log/synapflows/security-monitor.log` | Execution results |
| **Alerts** | `/var/log/synapflows/security-alerts.log` | Issues detected |

---

## 📧 Configuration Essentials

### Most Important: Set Email

```bash
sudo nano /etc/synapflows/monitor-config.conf
```

Change this:
```bash
ALERT_EMAIL="admin@synapflows.fr"
```

### Alert Thresholds (Optional)

```bash
CERT_WARNING_DAYS=14          # Warn X days before cert expiry
CSP_VIOLATION_THRESHOLD=20    # Alert if > X CSP violations
RATELIMIT_ABUSE_THRESHOLD=5   # Alert if > X rate limit hits
```

### Schedule (Optional)

```bash
# Run daily at 9 AM (DEFAULT)
MONITORING_FREQUENCY="daily"
CUSTOM_CRON="0 9 * * *"

# Or every 4 hours (24/7 monitoring)
MONITORING_FREQUENCY="four-times"
CUSTOM_CRON="0 6,12,18,0 * * *"

# Or every hour
MONITORING_FREQUENCY="hourly"
CUSTOM_CRON="0 * * * *"
```

---

## ✅ Verification Commands

```bash
# All setup files present?
ls -la /etc/synapflows/monitor-config.conf
ls -la /etc/cron.d/synapflows-monitor
ls -la /opt/synapflows/monitor-with-alerts.sh

# Email configured?
grep ALERT_EMAIL /etc/synapflows/monitor-config.conf

# Will cron job run?
cat /etc/cron.d/synapflows-monitor

# Test email works?
echo "Test" | mail -s "Alert Test" admin@synapflows.fr

# Run monitoring manually
/opt/synapflows/monitor-with-alerts.sh

# Check recent logs
tail -20 /var/log/synapflows/security-monitor.log
tail -20 /var/log/synapflows/security-alerts.log
```

---

## 🧠 What It Monitors

Daily check runs at **9 AM**, sends alert email if:

- ❌ Any security header is missing
- ⚠️ Certificate expires in < 14 days
- ⚠️ HTTP redirect not working
- ⚠️ CSP violations > 20
- ⚠️ Rate limit hits > 5
- ⚠️ Container not healthy
- ⚠️ Response time > 2 seconds

---

## 🚨 Common Issues & Fixes

### "mail command not found"
```bash
sudo apt-get install -y mailutils
```

### "Email not sending"
```bash
# Test manually
echo "Test" | mail -s "Test" admin@synapflows.fr

# Check mail queue
mailq

# Verify cron runs in /etc/cron.d/ (not crontab -e)
cat /etc/cron.d/synapflows-monitor
```

### "Cron job not running"
```bash
# Check cron is enabled
sudo systemctl status cron

# Verify file in /etc/cron.d/ (not home dir)
ls -la /etc/cron.d/synapflows-monitor

# Check cron logs
grep synapflows /var/log/syslog | tail -10
```

### "Want to change schedule"
```bash
sudo nano /etc/synapflows/monitor-config.conf
# Edit: MONITORING_FREQUENCY and CUSTOM_CRON
# Then: sudo setup-cron.sh
```

---

## 📞 Daily Check

```bash
# Every morning, verify monitoring ran:
tail -5 /var/log/synapflows/security-monitor.log

# If email alert received = all good ✅
# If no email = check logs above
```

---

## 🎯 What's Next

- ✅ Setup complete
- 📧 Email alerts active
- ⏰ Daily monitoring running
- 📊 Logs growing in `/var/log/synapflows/`

**In 72 hours:**
- Review CSP violation data from Phase 2
- Decide on CSP whitelist refinement
- Consider adjusting alert thresholds based on patterns

---

*Quick Reference: 11 avril 2026*
