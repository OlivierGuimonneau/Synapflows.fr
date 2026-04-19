# 🔐 SECURITY HARDENING GUIDE – Complete Reference
## Production-Ready Web Application Security (2024+)

**Version:** 1.0  
**Last Updated:** 11 avril 2026  
**Scope:** Node.js/Express + React SPA + Docker + Traefik  
**Target Maturity:** A+ Security Grade (SecurityHeaders.com + Mozilla Observatory)

---

## 📋 Table of Contents

1. [Overview & Threat Model](#1-overview--threat-model)
2. [Phase 1: HTTP Security Headers](#2-phase-1-http-security-headers)
3. [Phase 2: API Security & CSP Monitoring](#3-phase-2-api-security--csp-monitoring)
4. [Phase 3: TLS Hardening & HTTPS](#4-phase-3-tls-hardening--https)
5. [Docker & Traefik Configuration](#5-docker--traefik-configuration)
6. [Monitoring & Alerting](#6-monitoring--alerting)
7. [Troubleshooting & Best Practices](#7-troubleshooting--best-practices)
8. [Reusable Templates](#8-reusable-templates)

---

# 1. Overview & Threat Model

## 1.1 Security Vulnerabilities Addressed

This guide addresses **15 critical vulnerabilities** across 3 phases:

| ID | Vulnerability | Severity | Phase | Fix |
|----|---|---|---|---|
| 1 | Missing CSP | CRITICAL | 2 | Content-Security-Policy-Report-Only |
| 2 | No HSTS | CRITICAL | 1 | Strict-Transport-Security header |
| 3 | Clickjacking | HIGH | 1 | X-Frame-Options: DENY |
| 4 | MIME sniffing | HIGH | 1 | X-Content-Type-Options: nosniff |
| 5 | Open Referrer | MEDIUM | 1 | Referrer-Policy: strict-origin |
| 6 | Browser APIs | MEDIUM | 1 | Permissions-Policy restriction |
| 7 | Version leak | LOW | 1 | removeHeader X-Powered-By |
| 8 | CORS too open | HIGH | 1 | Whitelist-based CORS |
| 9 | No input validation | HIGH | 2 | Schema validation |
| 10 | No rate limiting | MEDIUM | 2 | express-rate-limit |
| 11 | No CSRF protection | MEDIUM | 2 | Origin/Referer validation |
| 12 | Secret exposure | MEDIUM | 2 | .env protection |
| 13 | Weak TLS | MEDIUM | 3 | TLS 1.2+ only |
| 14 | HTTP not secure | MEDIUM | 3 | 301 redirect to HTTPS |
| 15 | No CT enforcement | LOW | 3 | Expect-CT header |

## 1.2 Attack Vectors Prevented

```
┌─────────────────────────────────────────────┐
│ ATTACK VECTOR PREVENTION MATRIX             │
├─────────────────────────────────────────────┤
│ Man-in-the-Middle                           │
│  ├─ HSTS + TLS 1.2+ ✅                      │
│  ├─ Certificate Transparency ✅              │
│  └─ HTTP→HTTPS 301 redirect ✅              │
│                                             │
│ Injection Attacks                           │
│  ├─ CSP Report-Only monitoring ✅           │
│  ├─ Input validation schema ✅              │
│  └─ Output encoding (implicit) ✅           │
│                                             │
│ Clickjacking                                │
│  ├─ X-Frame-Options: DENY ✅                │
│  └─ CSP frame-ancestors ✅                  │
│                                             │
│ API Abuse                                   │
│  ├─ Rate limiting (10/15min) ✅             │
│  ├─ CSRF protection ✅                      │
│  └─ CORS whitelist ✅                       │
│                                             │
│ Information Disclosure                      │
│  ├─ No version headers ✅                   │
│  ├─ Generic error messages ✅               │
│  ├─ Secret scanning (0 found) ✅            │
│  └─ .env protection ✅                      │
└─────────────────────────────────────────────┘
```

---

# 2. Phase 1: HTTP Security Headers

## 2.1 What Are Security Headers?

Security headers are HTTP response headers that tell browsers how to behave and protect users from common attacks.

**Location:** Sent with every HTTP response  
**Coverage:** Block entire classes of attacks at browser level  
**Browser Support:** 95%+ modern browsers

## 2.2 The 7 Critical Headers

### Header 1: Strict-Transport-Security (HSTS)

**Purpose:** Force HTTPS-only connections  
**Attack Prevented:** SSL downgrade, man-in-the-middle

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Breakdown:**
- `max-age=31536000` = 1 year (browser caches HTTPS requirement)
- `includeSubDomains` = Apply to all subdomains
- `preload` = Allow inclusion in HSTS preload list

**Implementation (Express):**
```javascript
res.setHeader(
  'Strict-Transport-Security',
  'max-age=31536000; includeSubDomains; preload'
);
```

**Implementation (Traefik):**
```yaml
- "traefik.http.middlewares.security.headers.customResponseHeaders.Strict-Transport-Security=max-age=31536000; includeSubDomains; preload"
```

---

### Header 2: Content-Security-Policy (CSP)

**Purpose:** Control which resources can load (scripts, styles, iframes, etc.)  
**Attack Prevented:** XSS (Cross-Site Scripting), injection attacks

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-ancestors 'none';
```

**Directives:**
- `default-src 'self'` = Only same-origin resources by default
- `script-src 'self'` = Only same-origin scripts
- `style-src 'self' 'unsafe-inline'` = Styles from self + inline (required for many modern apps)
- `img-src 'self' data: https:` = Images from self, data URIs, HTTPS
- `connect-src 'self' https://api.airtable.com` = XHR/fetch only to approved APIs
- `frame-ancestors 'none'` = Cannot be framed (prevent clickjacking)
- `report-uri /api/csp-report` = Report violations to endpoint

**Implementation - Report-Only Mode (Recommended First):**
```javascript
// Monitor violations without blocking
res.setHeader(
  'Content-Security-Policy-Report-Only',
  "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https://api.airtable.com; frame-ancestors 'none'; report-uri /api/csp-report;"
);
```

**After Data Collection, Switch to Blocking:**
```javascript
// Enforce CSP (after 72h monitoring)
res.setHeader(
  'Content-Security-Policy',
  "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https://api.airtable.com; frame-ancestors 'none';"
);
```

**Traefik Implementation:**
```yaml
- "traefik.http.middlewares.security.headers.customResponseHeaders.Content-Security-Policy-Report-Only=default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https://api.airtable.com; frame-ancestors 'none'; report-uri /api/csp-report;"
```

---

### Header 3: X-Frame-Options

**Purpose:** Prevent clickjacking attacks  
**Attack Prevented:** Clickjacking (embedding your site in malicious iframe)

```
X-Frame-Options: DENY
```

**Options:**
- `DENY` = Cannot be framed at all (most secure)
- `SAMEORIGIN` = Can be framed only by same origin
- `ALLOW-FROM uri` = Can be framed only by specific URI (deprecated)

**Implementation (Express):**
```javascript
res.setHeader('X-Frame-Options', 'DENY');
```

**Traefik:**
```yaml
- "traefik.http.middlewares.security.headers.customResponseHeaders.X-Frame-Options=DENY"
```

---

### Header 4: X-Content-Type-Options

**Purpose:** Prevent MIME sniffing attacks  
**Attack Prevented:** Browser misinterpreting file types (e.g., treating script as text)

```
X-Content-Type-Options: nosniff
```

**Implementation (Express):**
```javascript
res.setHeader('X-Content-Type-Options', 'nosniff');
```

**Traefik:**
```yaml
- "traefik.http.middlewares.security.headers.customResponseHeaders.X-Content-Type-Options=nosniff"
```

---

### Header 5: Referrer-Policy

**Purpose:** Control how much referrer information is sent  
**Attack Prevented:** Information leakage via referrer header

```
Referrer-Policy: strict-origin-when-cross-origin
```

**Options:**
- `strict-origin-when-cross-origin` = Send origin only for cross-site (recommended)
- `no-referrer` = Never send referrer (privacy maximized)
- `same-origin` = Only for same-site requests

**Implementation (Express):**
```javascript
res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
```

**Traefik:**
```yaml
- "traefik.http.middlewares.security.headers.customResponseHeaders.Referrer-Policy=strict-origin-when-cross-origin"
```

---

### Header 6: Permissions-Policy

**Purpose:** Restrict access to browser APIs (camera, mic, location, payment, etc.)  
**Attack Prevented:** Malicious scripts accessing sensitive APIs

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

**Common Restrictions:**
- `camera=()` = No camera access
- `microphone=()` = No microphone access
- `geolocation=()` = No GPS location
- `payment=()` = No payment API
- `usb=()` = No USB access

**Implementation (Express):**
```javascript
res.setHeader(
  'Permissions-Policy',
  'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
);
```

**Traefik:**
```yaml
- "traefik.http.middlewares.security.headers.customResponseHeaders.Permissions-Policy=camera=(), microphone=(), geolocation=(), payment=(), usb=()"
```

---

### Header 7: Expect-CT

**Purpose:** Enforce Certificate Transparency compliance  
**Attack Prevented:** Misissued/fake SSL certificates

```
Expect-CT: max-age=86400, enforce
```

**Parameters:**
- `max-age=86400` = 1 day (can increase to 2592000 = 30 days)
- `enforce` = Block if no CT log entries
- `report-uri` = Optional reporting endpoint

**Implementation (Express):**
```javascript
res.setHeader('Expect-CT', 'max-age=86400, enforce');
```

**Traefik:**
```yaml
- "traefik.http.middlewares.security.headers.customResponseHeaders.Expect-CT=max-age=86400, enforce"
```

---

### BONUS: Remove X-Powered-By

**Purpose:** Hide server technology information  
**Attack Prevented:** Information disclosure (minor)

```javascript
// Express automatically adds this; remove it
res.removeHeader('X-Powered-By');

// In middleware
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
});
```

---

## 2.3 Complete Phase 1 Express Implementation

```javascript
import express from 'express';
import cors from 'cors';

const app = express();

// 🔒 Security Headers Middleware
app.use((req, res, next) => {
  // 1. HSTS - Force HTTPS
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // 2. CSP - Control resources
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https://api.airtable.com; frame-ancestors 'none'; report-uri /api/csp-report;"
  );

  // 3. Clickjacking protection
  res.setHeader('X-Frame-Options', 'DENY');

  // 4. MIME sniffing protection
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 5. Referrer control
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 6. Browser API restrictions
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );

  // 7. Certificate Transparency
  res.setHeader('Expect-CT', 'max-age=86400, enforce');

  // Hide server info
  res.removeHeader('X-Powered-By');

  next();
});

// 🌐 CORS - Restrict to whitelist
const isDev = process.env.NODE_ENV === 'development';
const allowedOrigins = isDev
  ? ['http://localhost:5000', 'http://localhost:5174']
  : ['https://project.synapflows.fr'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ... rest of application
```

---

## 2.4 Complete Phase 1 Traefik/Docker Implementation

```yaml
version: '3.8'

services:
  myapp:
    build: .
    container_name: myapp-prod
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=5000
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      
      # 🔒 HTTPS Configuration
      - "traefik.http.routers.myapp.rule=Host(`myapp.com`)"
      - "traefik.http.routers.myapp.entrypoints=websecure"
      - "traefik.http.routers.myapp.tls.certresolver=letsencrypt"
      
      # Backend Service
      - "traefik.http.services.myapp.loadbalancer.server.port=5000"
      
      # 🔒 Security Headers Middleware
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Strict-Transport-Security=max-age=31536000; includeSubDomains; preload"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Content-Security-Policy-Report-Only=default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self'; frame-ancestors 'none'; report-uri /api/csp-report;"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.X-Frame-Options=DENY"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.X-Content-Type-Options=nosniff"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Referrer-Policy=strict-origin-when-cross-origin"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Permissions-Policy=camera=(), microphone=(), geolocation=(), payment=(), usb=()"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Expect-CT=max-age=86400, enforce"
      
      # Apply middleware to router
      - "traefik.http.routers.myapp.middlewares=security"
    
    healthcheck:
      test: ["CMD-SHELL", "wget -q -O- http://localhost:5000 || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  proxy:
    external: true
```

---

# 3. Phase 2: API Security & CSP Monitoring

## 3.1 Input Validation with Schema

**Purpose:** Ensure only valid data reaches API handlers  
**Attack Prevented:** Injection attacks, malformed requests, DoS

**Schema Validation Template:**

```javascript
// Define validation schema
const FORM_SCHEMA = {
  email: { 
    type: 'string', 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255
  },
  name: { 
    type: 'string', 
    required: true, 
    maxLength: 100 
  },
  age: { 
    type: 'number', 
    required: false, 
    min: 0, 
    max: 150 
  },
  tags: { 
    type: 'array', 
    required: false,
    itemType: 'string'
  }
};

// Validation function
function validateData(data, schema) {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    if (value === undefined || value === null) continue; // Optional and absent = OK

    // Type check
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be string`);
      continue;
    }
    if (rules.type === 'number' && typeof value !== 'number') {
      errors.push(`${field} must be number`);
      continue;
    }
    if (rules.type === 'array' && !Array.isArray(value)) {
      errors.push(`${field} must be array`);
      continue;
    }

    // Pattern/regex valdation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${field} format invalid`);
    }

    // Length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${field} exceeds max ${rules.maxLength} chars`);
    }
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${field} below min ${rules.minLength} chars`);
    }

    // Number range
    if (rules.min !== undefined && value < rules.min) {
      errors.push(`${field} must be >= ${rules.min}`);
    }
    if (rules.max !== undefined && value > rules.max) {
      errors.push(`${field} must be <= ${rules.max}`);
    }

    // Array item type
    if (rules.type === 'array' && rules.itemType) {
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] !== rules.itemType) {
          errors.push(`${field}[${i}] must be ${rules.itemType}`);
        }
      }
    }
  }

  return errors;
}

// Usage in Express route
app.post('/api/submit', (req, res) => {
  const errors = validateData(req.body, FORM_SCHEMA);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  // ... process valid data
});
```

---

## 3.2 Rate Limiting

**Purpose:** Prevent API abuse and brute force attacks  
**Attack Prevented:** DoS, brute force, credential stuffing

```javascript
import rateLimit from 'express-rate-limit';

// Create limiter
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // 10 requests max
  message: 'Too many requests, please try again later',
  standardHeaders: true,      // Return RateLimit-* headers
  legacyHeaders: false,       // Disable X-RateLimit-* headers
  skip: (req) => {
    // Optional: Skip rate limiting for specific IPs/users
    return req.user?.isAdmin === true;
  },
  keyGenerator: (req) => {
    // Optional: Use custom key (default is IP)
    return req.user?.id || req.ip;
  }
});

// Apply to specific route
app.post('/api/submit', submitLimiter, (req, res) => {
  // ... handle request
});

// Or apply to all endpoints
app.use('/api/', submitLimiter);
```

**Rate Limit Response Headers:**
```
RateLimit-Limit: 10
RateLimit-Remaining: 9
RateLimit-Reset: 1681234567
```

---

## 3.3 CSRF Protection

**Purpose:** Prevent Cross-Site Request Forgery attacks  
**Attack Prevented:** Unauthorized actions from attacker sites

**Origin/Referer Validation Approach:**

```javascript
// Middleware to validate origin
function validateOrigin(req, res, next) {
  const origin = req.get('origin') || req.get('referer');
  
  // Get allowed hosts
  const isDev = process.env.NODE_ENV === 'development';
  const allowedHosts = isDev
    ? ['localhost', '127.0.0.1']
    : ['myapp.com', 'www.myapp.com'];

  // Validate
  if (origin) {
    try {
      const originHost = new URL(origin).hostname;
      const isAllowed = allowedHosts.some(h => originHost.includes(h));
      
      if (!isAllowed) {
        console.warn(`CSRF BLOCKED: ${origin}`);
        return res.status(403).json({ error: 'Unauthorized origin' });
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid origin header' });
    }
  }

  next();
}

// Apply to sensitive endpoints
app.post('/api/submit', validateOrigin, submitLimiter, (req, res) => {
  // ... handle request
});
```

**Alternative: Double Submit Cookie Pattern**

```javascript
// Generate CSRF token
app.get('/api/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie('csrf-token', token, {
    httpOnly: false,  // Client needs to read it
    secure: true,
    sameSite: 'Strict'
  });
  res.json({ token });
});

// Validate token
function validateCSRF(req, res, next) {
  const tokenFromHeader = req.headers['x-csrf-token'];
  const tokenFromCookie = req.cookies['csrf-token'];

  if (!tokenFromHeader || tokenFromHeader !== tokenFromCookie) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
}

app.post('/api/submit', validateCSRF, (req, res) => {
  // ... handle request
});
```

---

## 3.4 CSP Violation Reporting

**Purpose:** Monitor CSP violations and refine whitelist  
**Process:** Ship in Report-Only mode, collect data, then switch to blocking

```javascript
// Endpoint to receive CSP violations
app.post('/api/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  const report = req.body['csp-report'] || req.body;

  // Log violation
  console.log({
    timestamp: new Date().toISOString(),
    blockedUri: report['blocked-uri'],
    violatedDirective: report['violated-directive'],
    originalPolicy: report['original-policy'],
    sourceFile: report['source-file'],
    lineNumber: report['line-number']
  });

  // Optional: Store in database for analysis
  // await CspViolation.create(report);

  // Return 204 No Content (standard for CSP reports)
  res.status(204).send();
});
```

**Monitoring CSP Violations:**

```bash
# Watch for violations in logs
docker logs -f myapp-prod | grep "CSP VIOLATION"

# Count violations by type
docker logs myapp-prod | grep "violated-directive" | sort | uniq -c

# If needed, refine CSP after 72h of data collection
# Then switch from Report-Only to blocking CSP header
```

---

## 3.5 Secrets Protection

**Purpose:** Never leak secrets in responses or logs  
**Attack Prevented:** API key/token theft

```javascript
// ❌ NEVER do this:
app.get('/api/config', (req, res) => {
  res.json({
    apiKey: process.env.AIRTABLE_TOKEN,  // LEAKS SECRET!
    baseId: process.env.AIRTABLE_BASE_ID
  });
});

// ✅ DO THIS instead:
app.get('/api/config', (req, res) => {
  res.json({
    baseId: process.env.AIRTABLE_BASE_ID  // Public info only
    // apiKey never sent to client
  });
});

// ✅ Use token server-side only:
app.post('/api/submit', validateOrigin, async (req, res) => {
  try {
    // Token used server-side, never sent to client
    const response = await fetch('https://api.airtable.com/...', {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`
      }
    });

    // Return success to client, NOT API response
    res.json({ success: true, message: 'Data saved' });
  } catch (error) {
    // Generic error message
    res.status(500).json({ error: 'Server error' });
  }
});
```

**Secrets Scanning:**

```bash
# Scan for hardcoded secrets before deployment
npm install -g trufflehog

# Scan repository
trufflehog filesystem . --json

# Environment variables
echo "Check .env is in .gitignore"
cat .gitignore | grep "\.env"

# npm audit for vulnerable dependencies
npm audit --audit-level=high
```

---

# 4. Phase 3: TLS Hardening & HTTPS

## 4.1 HTTP to HTTPS Redirection

**Purpose:** Force all traffic over encrypted connection  
**Attack Prevented:** Man-in-the-middle, SSL stripping

**Express Implementation:**

```javascript
// Redirect HTTP to HTTPS middleware
app.use((req, res, next) => {
  if (req.protocol !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
  }
  next();
});
```

**Traefik Implementation:**

```yaml
# HTTP Router with redirect
- "traefik.http.routers.myapp-http.rule=Host(`myapp.com`)"
- "traefik.http.routers.myapp-http.entrypoints=web"  # Port 80
- "traefik.http.routers.myapp-http.middlewares=https-redirect"

# Redirect middleware
- "traefik.http.middlewares.https-redirect.redirectscheme.scheme=https"
- "traefik.http.middlewares.https-redirect.redirectscheme.permanent=true"
```

---

## 4.2 TLS Version & Cipher Suite Configuration

**Purpose:** Enforce modern TLS versions and strong ciphers  
**Attack Prevented:** Downgrade attacks, weak cipher exploitation

**Traefik Configuration (traefik.yml):**

```yaml
entryPoints:
  websecure:
    address: ":443"
    http:
      tls:
        minVersion: VersionTLS12      # TLS 1.2 minimum
        # Optional: require TLS 1.3 only
        # minVersion: VersionTLS13
        
        cipherSuites:
          # TLS 1.2 ciphers (ECDHE for PFS)
          - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
          - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
          - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
          
          # TLS 1.3 ciphers (AEAD only)
          - TLS_AES_256_GCM_SHA384
          - TLS_CHACHA20_POLY1305_SHA256
          - TLS_AES_128_GCM_SHA256

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@myapp.com
      storage: acme.json
      httpChallenge:
        entryPoint: web
```

**Why These Ciphers?**
- ECDHE: Perfect Forward Secrecy (PFS) - past sessions safe if key compromised
- AES-256-GCM: Strong authenticated encryption
- ChaCha20-Poly1305: Modern alternative to AES (faster on some CPUs)
- No RC4, MD5, SHA1, DES (deprecated/broken)

---

## 4.3 Certificate Management

**Purpose:** Maintain valid, non-expired certificates  
**Attack Prevented:** MITM, trust errors

**Let's Encrypt (Free) with Traefik:**

```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@myapp.com
      storage: acme.json          # Where to store cert
      httpChallenge:
        entryPoint: web           # Use port 80 for challenge
      
      # Staging (testing, higher rate limits)
      # caServer: https://acme-staging-v02.api.letsencrypt.org/directory
```

**Certificate Renewal:**
- Traefik auto-renews 30 days before expiry
- No manual intervention needed
- Stored in `acme.json` (persistent volume required)

**Monitor Certificate Expiry:**

```bash
# Check cert expiry
echo | openssl s_client -servername myapp.com -connect myapp.com:443 2>/dev/null | \
  grep "notAfter" | \
  sed 's/.*notAfter=//'

# Alert if < 14 days: See Monitoring & Alerting section
```

---

## 4.4 Complete Phase 3 Docker Configuration

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:latest
    ports:
      - "80:80"      # HTTP
      - "443:443"    # HTTPS
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik.yml:/traefik.yml
      - ./acme.json:/acme.json
    environment:
      - TRAEFIK_API_INSECURE=false

  myapp:
    build: .
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=5000
    labels:
      - "traefik.enable=true"
      
      # ✅ HTTPS with Let's Encrypt
      - "traefik.http.routers.myapp.rule=Host(`myapp.com`)"
      - "traefik.http.routers.myapp.entrypoints=websecure"
      - "traefik.http.routers.myapp.tls.certresolver=letsencrypt"
      
      # ✅ HTTP to HTTPS redirect
      - "traefik.http.routers.myapp-http.rule=Host(`myapp.com`)"
      - "traefik.http.routers.myapp-http.entrypoints=web"
      - "traefik.http.routers.myapp-http.middlewares=http-to-https"
      - "traefik.http.middlewares.http-to-https.redirectscheme.scheme=https"
      - "traefik.http.middlewares.http-to-https.redirectscheme.permanent=true"
      
      # ✅ All security headers from Phase 1
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Strict-Transport-Security=max-age=31536000; includeSubDomains; preload"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Content-Security-Policy-Report-Only=..."
      - "traefik.http.middlewares.security.headers.customResponseHeaders.X-Frame-Options=DENY"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.X-Content-Type-Options=nosniff"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Referrer-Policy=strict-origin-when-cross-origin"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Permissions-Policy=camera=(), microphone=(), geolocation=(), payment=(), usb=()"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Expect-CT=max-age=86400, enforce"
      
      # Apply all middlewares
      - "traefik.http.routers.myapp.middlewares=security,http-to-https"
```

---

# 5. Docker & Traefik Configuration

## 5.1 Complete Production Docker Setup

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application
COPY . .

# Build frontend (if applicable)
RUN npm run build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -q -O- http://localhost:5000 || exit 1

# Start application
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml - COMPLETE SECURE SETUP
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./acme.json:/acme.json
      - ./traefik-config.yml:/traefik-config.yml:ro
    networks:
      - proxy
    labels:
      - "traefik.enable=false"  # Don't expose traefik itself

  myapp:
    build: .
    container_name: myapp-prod
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - NODE_ENV=production
      - PORT=5000
    expose:
      - "5000"  # Internal port only
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      
      # Routing
      - "traefik.http.routers.myapp.rule=Host(`myapp.com`)"
      - "traefik.http.routers.myapp.entrypoints=websecure"
      - "traefik.http.routers.myapp.tls.certresolver=letsencrypt"
      - "traefik.http.services.myapp.loadbalancer.server.port=5000"
      
      # Security headers (Phase 1)
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Strict-Transport-Security=max-age=31536000; includeSubDomains; preload"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Content-Security-Policy-Report-Only=default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self'; frame-ancestors 'none'; report-uri /api/csp-report;"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.X-Frame-Options=DENY"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.X-Content-Type-Options=nosniff"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Referrer-Policy=strict-origin-when-cross-origin"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Permissions-Policy=camera=(), microphone=(), geolocation=(), payment=(), usb=()"
      - "traefik.http.middlewares.security.headers.customResponseHeaders.Expect-CT=max-age=86400, enforce"
      
      # HTTP to HTTPS redirect (Phase 3)
      - "traefik.http.routers.myapp-http.rule=Host(`myapp.com`)"
      - "traefik.http.routers.myapp-http.entrypoints=web"
      - "traefik.http.routers.myapp-http.middlewares=https-redirect"
      - "traefik.http.middlewares.https-redirect.redirectscheme.scheme=https"
      - "traefik.http.middlewares.https-redirect.redirectscheme.permanent=true"
      
      # Apply all middlewares
      - "traefik.http.routers.myapp.middlewares=security"

    healthcheck:
      test: ["CMD-SHELL", "wget -q -O- http://localhost:5000 || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  proxy:
    driver: bridge
```

```yaml
# traefik.yml
global:
  checkNewVersion: false
  sendAnonymousUsage: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entrypoint:
          to: websecure
          scheme: https

  websecure:
    address: ":443"
    http:
      tls:
        minVersion: VersionTLS12
        cipherSuites:
          - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
          - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
          - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
          - TLS_AES_256_GCM_SHA384
          - TLS_CHACHA20_POLY1305_SHA256
          - TLS_AES_128_GCM_SHA256

providers:
  docker:
    endpoint: unix:///var/run/docker.sock
    exposedByDefault: false
    network: proxy

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@myapp.com
      storage: acme.json
      httpChallenge:
        entryPoint: web

api:
  dashboard: false  # Disable in production
  debug: false

log:
  level: INFO
  format: json

accessLog:
  format: json
```

---

# 6. Monitoring & Alerting

## 6.1 Monitoring Script

```bash
#!/bin/bash
# monitor-security.sh - Daily security checks

DOMAIN="myapp.com"
LOGDIR="/var/log/myapp"
ALERT_EMAIL="admin@myapp.com"

mkdir -p "$LOGDIR"

# Check security headers
HEADERS=("Strict-Transport-Security" "Content-Security-Policy-Report-Only" "X-Frame-Options" "X-Content-Type-Options" "Referrer-Policy" "Permissions-Policy" "Expect-CT")

for header in "${HEADERS[@]}"; do
  RESULT=$(curl -s -I "https://$DOMAIN" | grep -i "^$header:" | head -1)
  if [ -z "$RESULT" ]; then
    echo "ALERT: Missing header $header" | mail -s "🚨 $DOMAIN Security Alert" "$ALERT_EMAIL"
  fi
done

# Check certificate expiry
CERT_EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
CERT_DAYS=$(( ($(date -d "$CERT_EXPIRY" +%s) - $(date +%s)) / 86400 ))

if [ $CERT_DAYS -lt 14 ]; then
  echo "ALERT: Certificate expires in $CERT_DAYS days" | mail -s "🚨 $DOMAIN Certificate Alert" "$ALERT_EMAIL"
fi

# Check HTTP redirect
REDIRECT=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN)
if [ "$REDIRECT" != "301" ] && [ "$REDIRECT" != "308" ]; then
  echo "ALERT: HTTP redirect broken - returned $REDIRECT" | mail -s "🚨 $DOMAIN Redirect Alert" "$ALERT_EMAIL"
fi

echo "[$(date)] Security check completed" >> "$LOGDIR/monitor.log"
```

---

## 6.2 Cron Job Setup

```bash
# Install monitoring
sudo cp monitor-security.sh /opt/myapp/
sudo chmod 755 /opt/myapp/monitor-security.sh

# Setup cron job (daily at 9 AM)
echo "0 9 * * * /opt/myapp/monitor-security.sh" | sudo tee /etc/cron.d/myapp-monitor

# Verify
sudo systemctl restart cron
```

---

# 7. Troubleshooting & Best Practices

## 7.1 Common Issues

**Issue: CSP blocking legitimate resources**

```
Solution: Check browser console for blocked resources
- Add to CSP whitelist if legitimate
- Use Report-Only mode initially to collect data
- After 72h, refine whitelist and switch to blocking
```

**Issue: Rate limiting blocks legitimate users**

```
Solution: Adjust thresholds
- Increase windowMs (lower rate limit pressure)
- Increase max requests per window
- Or whitelist specific IPs/users
```

**Issue: Certificate renewal failing**

```
Solution:
- Ensure acme.json file is writable
- Check port 80 is accessible for challenge
- Verify DNS points to correct IP
- Check Let's Encrypt status: https://letsencrypt.status.io/
```

---

## 7.2 Best Practices

### ✅ DO:

- ✅ Use HTTPS everywhere (including APIs)
- ✅ Implement all 7 security headers
- ✅ Validate all user inputs server-side
- ✅ Use parameterized queries (for databases)
- ✅ Keep dependencies updated (`npm audit`, `npm update`)
- ✅ Log security events (attacks, suspicious activity)
- ✅ Use strong CORS whitelist
- ✅ Implement rate limiting
- ✅ Monitor certificates for expiry
- ✅ Use environment variables for secrets
- ✅ Keep .env files out of git

### ❌ DON'T:

- ❌ Disable CSP
- ❌ Allow `*` in CORS
- ❌ Trust client-side validation alone
- ❌ Hardcode secrets
- ❌ Return detailed error messages to clients
- ❌ Use outdated TLS versions
- ❌ Skip input validation
- ❌ Store passwords in plain text
- ❌ Log sensitive data
- ❌ Disable HSTS

---

# 8. Reusable Templates

## 8.1 Copy-Paste Ready: Express App

```javascript
// app.js - Production-ready Express with all security
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV === 'development';

// ======================
// SECURITY MIDDLEWARE
// ======================

// 🔒 Security Headers (Phase 1)
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Content-Security-Policy-Report-Only', "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self'; frame-ancestors 'none'; report-uri /api/csp-report;");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  res.setHeader('Expect-CT', 'max-age=86400, enforce');
  res.removeHeader('X-Powered-By');
  next();
});

// 🌐 CORS (Phase 1)
const allowedOrigins = isDev
  ? ['http://localhost:5000', 'http://localhost:5174']
  : ['https://myapp.com'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

// 🚦 Rate Limiting (Phase 2)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// ENDPOINTS
// ======================

// CSP Report (Phase 2)
app.post('/api/csp-report', (req, res) => {
  console.log('CSP Violation:', req.body);
  res.status(204).send();
});

// Protected endpoint
app.post('/api/submit', limiter, (req, res) => {
  // Validate & process
  if (!req.body.email) {
    return res.status(400).json({ error: 'Email required' });
  }
  res.json({ success: true });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
```

---

## 8.2 Copy-Paste Ready: Docker Compose

[See Section 5.1 above]

---

##  Summary Table

| Phase | Protection | Implementation |
|-------|-----------|---|
| **1** | HTTP Headers | Express middleware + Traefik labels |
| **1** | CORS | `cors()` with whitelist |
| **2** | CSP Monitoring | CSP-Report-Only + /api/csp-report |
| **2** | Input Validation | Schema validation function |
| **2** | Rate Limiting | `express-rate-limit` |
| **2** | CSRF | Origin/Referer validation |
| **3** | HTTP→HTTPS | 301 redirect middleware |
| **3** | TLS 1.2+ | Traefik TLS config |
| **3** | Certs | Let's Encrypt + Traefik auto-renewal |
| **6** | Monitoring | Daily script + cron job |
| **6** | Alerts | Email notifications |

---

## 🎯 Verification Checklist

- [ ] All 7 security headers present (curl -I https://myapp.com)
- [ ] TLS 1.2+ only (openssl s_client -connect)
- [ ] HTTP redirects to HTTPS (curl -I http://myapp.com)
- [ ] CSP-Report-Only active
- [ ] Rate limiting working (10 requests in <15s returns 429)
- [ ] CORS whitelist working (Unauthorized origins rejected)
- [ ] Certificate valid (>14 days remaining)
- [ ] npm audit: 0 vulnerabilities
- [ ] .env in .gitignore
- [ ] Monitoring script running daily
- [ ] Alert emails received

---

*This guide is production-ready and reusable for any Node.js/Express application.*  
*Version 1.0 - 11 april 2026*
