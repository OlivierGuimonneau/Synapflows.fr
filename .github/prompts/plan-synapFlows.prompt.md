# Plan d'action correctif – Audit de sécurité SynapFlows

**Cible:** https://project.synapflows.fr  
**Date d'audit:** Avril 2026  
**Basé sur:** Deux rapports d'analyse passive (audit_securite_synapflows.md + dossier_securite_synapflows.md)

---

## TL;DR

**Problématique:** Application avec configuration sécurité insuffisante (absence d'en-têtes HTTP critiques, CORS trop permissif, technologie exposée).  
**Risque:** Attaques XSS, clickjacking, SSL stripping, CORS abuse, ciblage via CVE.  
**Approche:** Phase 1 immédiate (J+0-7) pour bloquer les vecteurs critiques + Phase 2 court terme (J+7-30) pour hardening complet.

---

## Phase 1 – Actions immédiates (J+0 à J+7) 🔴

**Objectif:** Réduire les vecteurs d'attaque critiques  
**Ressources:** Backend (Express) + infrastructure (Nginx/Traefik)

### 1.1 Ajouter les en-têtes HTTP essentiels

**Fichier:** `backend/index.js` (Express middleware)

```javascript
app.use((req, res, next) => {
  // Content-Security-Policy (CSP) restrictive
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https://api.airtable.com");
  
  // Strict-Transport-Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Anti-clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Masquer Express version
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Powered-By', 'Secret Sauce');  // OU simplement l'omettre
  
  // MIME sniffing protection
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions-Policy (APIs navigateur)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  
  next()
})
```

**Alternative:** Utiliser le middleware `helmet` pour automatiser:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

**Temps estimé:** 5-15 min  
**Vérification:** https://securityheaders.com

### 1.2 Restreindre CORS

**Fichier:** `backend/index.js`

**Avant:**
```javascript
app.use(cors())  // ← Accepte toutes origines
```

**Après:**
```javascript
app.use(cors({
  origin: 'https://project.synapflows.fr',  // Votre domaine uniquement
  methods: ['GET', 'POST'],
  credentials: true  // Si cookies/auth utilisés
}))
```

**Temps estimé:** 5 min  
**Vérification:** Tester les requêtes cross-origin (doivent être bloquées)

### 1.3 Ajouter security.txt

**Fichier:** `public/.well-known/security.txt` (créer le dossier `.well-known`)

```
Contact: security@synapflows.fr
Expires: 2026-12-31T23:59:59Z
Preferred-Languages: fr, en
```

**Temps estimé:** 3 min

### 1.4 Redéployer

```bash
npm run build
docker-compose up -d --build
# Ou sur votre infra (Railway, Heroku, VPS)
```

**Temps estimé:** 5-10 min

**Vérification post-déploiement:**
- SecurityHeaders.com → cible: Grade B minimum
- Mozilla Observatory → cible: 70+ points
- Vérifier absence `x-powered-by: Express` dans les réponses

---

## Phase 2 – Actions court terme (J+7 à J+30) 🟠

### 2.1 Affiner la CSP (mode report-only d'abord)

**Étape 1:** Passer en mode rapport avant de bloquer
```javascript
res.setHeader('Content-Security-Policy-Report-Only', 'default-src \'self\'; ...');
```

**Étape 2:** Analyser les rapports CSP pendant 48-72h pour identifier les sources légitimes manquantes

**Étape 3:** Affiner la liste blanche et passer en mode bloquant
```javascript
res.setHeader('Content-Security-Policy', '... (version finale)');
```

**Temps estimé:** 5-10 min (config) + 3 jours (monitoring)

### 2.2 Sécuriser les cookies

**Fichier:** `backend/index.js`

```javascript
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,  // À générer (clé forte de 32+ caractères)
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,      // ← Inaccessible via JS (protège des XSS)
    secure: true,        // ← HTTPS uniquement
    sameSite: 'strict',  // ← Protection CSRF
    maxAge: 3600000      // ← 1h
  }
}))
```

**Temps estimé:** 10-15 min

### 2.3 Auditer l'endpoint `/api/submit`

**Checklist:**
- [ ] Validation stricte de TOUS les champs côté serveur (longueur, type, format email)
- [ ] Rate limiting (ex: 10 req/minute par IP)
- [ ] Protection CSRF (token dans formulaire)
- [ ] Jeu de données cohérentes avec Airtable (types, longueurs)
- [ ] Gestion d'erreurs non verbeuse (pas de stack traces)
- [ ] Journalisation des soumissions pour audit
- [ ] Test pour injections: XSS, SQL/NoSQL injection
- [ ] Anti-spam: CAPTCHA ou honeypot form field

**Exemple avec helmet + rate limiting:**
```javascript
const rateLimit = require('express-rate-limit');

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 10,                    // 10 req max
  message: 'Trop de soumissions, réessayez plus tard'
});

router.post('/submit', submitLimiter, async (req, res) => {
  // Validation stricte
  if (!req.body.email || !/^[^@]+@[^@]+\.[^@]+$/.test(req.body.email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }
  // ... reste de la logique
});
```

**Temps estimé:** 30-60 min

### 2.4 Scanner secrets dans le bundle JS

**Outil:** TruffleHog
```bash
npm install -g trufflehog

# Scanner le repo
trufflehog filesystem . --json

# Chercher dans le bundle builté
trufflehog filesystem public/ --json
```

**À chercher:**
- Clés API Airtable
- Tokens d'authentification
- Secrets d'environment
- URLs sensibles

**Temps estimé:** 10-15 min

### 2.5 Créer robots.txt et sitemap.xml appropriés

**Fichier:** `public/robots.txt`
```
User-agent: *
Disallow: /api/
Disallow: /.well-known/
Disallow: /admin/

Sitemap: https://project.synapflows.fr/sitemap.xml
```

**Temps estimé:** 5 min

### 2.6 Tester les modifications

**Sur chaque environnement:**
```bash
# Lancer app localement
npm run dev

# Test en ligne de commande
curl -i https://project.synapflows.fr
  # Vérifier présence: Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options
  # Vérifier absence: x-powered-by: Express

# Cross-origin test (doit être rejeté)
curl -i -H "Origin: https://malicious.com" https://project.synapflows.fr/api/submit
  # Doit retourner CORS error
```

**Outils web:**
- SecurityHeaders.com
- Mozilla Observatory
- OWASP ZAP (local scan)

**Temps estimé:** 15-20 min

---

## Phase 3 – Actions moyen terme (J+30 à J+90) 🟢

### 3.1 Configurer TLS strictement

**Sur Nginx (reverse proxy):**
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA;
ssl_prefer_server_ciphers on;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_stapling on;  # OCSP stapling
```

**Vérification:**
- SSL Labs (Qualys): https://www.ssllabs.com/ssltest/ → cible: A+

**Temps estimé:** 20-30 min

### 3.2 Inscrire domaine sur HSTS Preload

Après vérification que tous les sous-domaines supportent HTTPS:
https://hstspreload.org → Submit

**Temps estimé:** 5 min

### 3.3 Mettre en place surveillance continue

Configuration hébergeur (Railway, Heroku, Docker):
- Alertes monitoring des en-têtes
- Scans de dépendances npm mensuels
- Login monitoring & audit trail

**Outils recommandés:**
- Dependabot (GitHub)
- Snyk (scan des CVE npm)
- Hardenize (rapport mensuel)

**Temps estimé:** 30-45 min (setup initial)

### 3.4 Envisager audit PASSI complet

Si données sensibles (RGPD, données métier):
- Contacter cabinet d'audit certifié PASSI
- Test d'intrusion complet
- Revue de code source

**Temps estimé:** 2-5 jours (prestataire externe)

---

## Calendrier résumé

```
J+0 (Jour 1)
├── Phase 1.1-1.3: En-têtes + CORS + security.txt (1h30)
└── Phase 1.4: Redéployer (30 min)
    ✅ Site passe de Grade F → C/D sur SecurityHeaders

J+3 (Milieu de semaine 1)
├── Vérifier aucune casse
├── Affiner CSP (mode report-only)
└── Commencer audit /api/submit

J+7 (Fin semaine 1)
├── Phase 2.1-2.5: Cookies, rate limiting, secrets scan (3-4h)
├── Tester modifications
└── ✅ Site passe de Grade C → B

J+30 (Fin mois 1)
├── Phase 3.1-3.2: TLS + HSTS preload
└── Monitoring continu en place
    ✅ Site atteint Grade A (SecurityHeaders + Observatory 70+)

J+90 (Fin trimestre)
- Revue complète + optionnel audit PASSI
```

---

## Fichiers à modifier

| Fichier | Modification | Type |
|---------|---|---|
| `backend/index.js` | Ajouter middleware en-têtes + CORS restrictif | Code |
| `public/.well-known/security.txt` | Créer fichier | Nouveau |
| `public/robots.txt` | Créer/affiner | Nouveau |
| `.env.example` | Ajouter `SESSION_SECRET` | Exemple |
| `.env` (production) | Définir `SESSION_SECRET` | Config |
| `package.json` | Optionnel: `npm install helmet express-rate-limit` | Dépendances |

---

## Vérification & Acceptance criteria

**Phase 1 complète ✅ si:**
- SecurityHeaders.com: Grade C minimum
- Aucun en-tête `x-powered-by` exposé
- CORS restreint à domaine (test curl)
- CSP défini (même minimal)

**Phase 2 complète ✅ si:**
- SecurityHeaders.com: Grade B minimum
- Mozilla Observatory: 70+ points
- Rate limiting sur `/api/submit` fonctionnel
- Cookies avec `HttpOnly`, `Secure`, `SameSite`
- Aucun secret détecté dans bundle

**Phase 3 complète ✅ si:**
- SecurityHeaders.com: Grade A
- SSL Labs: A+ rating
- Domaine inscrit HSTS preload
- Monitoring alertes en place

---

## Ressources & Outils

| Outil | URL | Usage |
|---|---|---|
| SecurityHeaders | https://securityheaders.com | Notation A-F des en-têtes |
| Mozilla Observatory | https://observatory.mozilla.org | Audit complet |
| SSL Labs | https://www.ssllabs.com/ssltest | TLS configuration |
| CSP Evaluator | https://csp-evaluator.withgoogle.com | Validation CSP |
| HSTS Preload | https://hstspreload.org | Inscription preload |
| TruffleHog | https://github.com/trufflesecurity/trufflehog | Recherche secrets |
| OWASP ZAP | https://www.zaproxy.org | Scanner sécurité |

---

## Risques si non traité

| Risque | Probabilité | Impact | Délai |
|---|---|---|---|
| Attaque XSS via `/api/submit` | 🟠 Moyenne | 🔴 Critique | Immédiat |
| Clickjacking (iframe malveillante) | 🟡 Faible-moy | 🟠 Élevé | Immédiat |
| SSL stripping (MITM) | 🟡 Faible | 🔴 Critique | Court terme |
| Ciblage CVE Express (version exposée) | 🟡 Faible-moy | 🟠 Élevé | Court terme |
| Abuse CORS (data exfiltration) | 🟡 Faible-moy | 🟠 Élevé | Court terme |

---

## Notes RGPD

Si données personnelles traitées (emails, informations projet):
- Article 32 RGPD: mesures de sécurité appropriées requises
- Non-conformité identifiée = base de sanction CNIL
- Ces correctifs aident à démontrer la diligence raisonnable
- Documenter les actions dans le registre de traitement
