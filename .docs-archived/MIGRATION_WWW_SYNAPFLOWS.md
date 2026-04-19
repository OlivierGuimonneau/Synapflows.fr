# 🚀 Migration : project.synapflows.fr → www.synapflows.fr

**État** : ✅ CONFIGURATION COMPLÉTÉE  
**Date** : 18 avril 2026  
**Domaine cible** : `www.synapflows.fr`  
**Container Docker** : `synapflows-www`

---

## ✅ Changements appliqués

### Phase 1 : Corrections critiques du code

#### 1. **Bug Vite proxy - CORRIGÉ** ✅
- **Fichier** : [vite.config.js](vite.config.js#L15)
- **Avant** : `target: 'http://localhost:5001'`
- **Après** : `target: 'http://localhost:5000'`
- **Raison** : Le backend démarre sur le port 5000, pas 5001
- **Impact** : Développement local fonctionne correctement

#### 2. **CORS backend - CORRIGÉ** ✅
- **Fichier** : [backend/index.js](backend/index.js#L62)
- **Avant** : `['https://project.synapflows.fr']`
- **Après** : `['https://www.synapflows.fr']`
- **Raison** : Whitelist des origines autorisées en production
- **Impact** : CORS accepte uniquement www.synapflows.fr en prod

#### 3. **Validation CSRF backend - CORRIGÉE** ✅
- **Fichier** : [backend/routes/submit.js](backend/routes/submit.js#L156)
- **Avant** : `['project.synapflows.fr']`
- **Après** : `['www.synapflows.fr']`
- **Raison** : Protection CSRF - valide le host de la requête
- **Impact** : Anti-CSRF fonctionne sur le bon domaine

---

### Phase 2 : Configuration Docker & Infrastructure

#### 4. **Container Docker - RENOMMÉ** ✅
- **Fichier** : [docker-compose.yml](docker-compose.yml#L5)
- **Avant** : `container_name: synapflows-project`
- **Après** : `container_name: synapflows-www`
- **Impact** : Container Docker appelé `synapflows-www`

#### 5. **Traefik HTTPS routing - CORRIGÉ** ✅
- **Fichier** : [docker-compose.yml](docker-compose.yml#L16)
- **Avant** : `Host(\`project.synapflows.fr\`)`
- **Après** : `Host(\`www.synapflows.fr\`)`
- **Impact** : Traefik route HTTPS vers le bon domaine

#### 6. **Traefik HTTP redirect - CORRIGÉ** ✅
- **Fichier** : [docker-compose.yml](docker-compose.yml#L34)
- **Avant** : `Host(\`project.synapflows.fr\`)`
- **Après** : `Host(\`www.synapflows.fr\`)`
- **Impact** : HTTP→HTTPS redirect sur le bon domaine

#### 7. **Variables d'environnement .env - CRÉÉES** ✅
- **Fichier** : [.env](.env)
- **Statut** : Fichier créé avec template production
- **Variables clés** :
  ```
  PORT=5000
  NODE_ENV=production
  AIRTABLE_BASE_ID=appvGEsLWrImfUU9i
  AIRTABLE_TABLE=Projets Soumis
  AIRTABLE_TOKEN=<À REMPLIR>
  RECAPTCHA_PUBLIC_KEY=<À REMPLIR>
  RECAPTCHA_SECRET_KEY=<À REMPLIR>
  ```
- **Note** : Fichier en `.gitignore` (sécurité des secrets)

---

### Phase 3 : Configuration SEO & Monitoring

#### 8. **robots.txt SEO - CORRIGÉ** ✅
- **Fichier** : [src/frontend/public/robots.txt](src/frontend/public/robots.txt#L6)
- **Avant** : `Sitemap: https://project.synapflows.fr/sitemap.xml`
- **Après** : `Sitemap: https://www.synapflows.fr/sitemap.xml`
- **Impact** : SEO - robots.txt pointe vers le bon domaine
- **Note** : Sera régénéré lors du build dans [public/robots.txt](public/robots.txt)

#### 9. **Monitoring scripts - CORRIGÉS** ✅
- **Fichier** : [monitor-with-alerts.sh](monitor-with-alerts.sh#L8)
  - `DOMAIN="project.synapflows.fr"` → `DOMAIN="www.synapflows.fr"`
- **Fichier** : [monitor-security.sh](monitor-security.sh#L6)
  - `DOMAIN="project.synapflows.fr"` → `DOMAIN="www.synapflows.fr"`
- **Impact** : Scripts de monitoring utilisent le bon domaine

---

## ✅ Validation

### Build local réussi ✅
```
✓ 40 modules transformed.
../../public/index.html                   0.80 kB │ gzip:  0.44 kB
../../public/assets/index-BsR73moV.css   10.78 kB │ gzip:  2.94 kB
../../public/assets/index-DVTkodu_.js   163.29 kB │ gzip: 51.76 kB
✓ built in 657ms
```

**Conclusion** : Vite build réussit → configuration React/Vite valide

---

## 📋 Prochaines étapes pour le déploiement

### **Étape 1 : Remplir les secrets .env** (BLOQUANT)

Sur le VPS, remplir ces variables dans `/path/to/synapflows.fr/.env` :

```bash
# 1. Airtable (depuis votre compte Airtable)
AIRTABLE_TOKEN=pat_xxxxxxxxxxxxx

# 2. Google reCAPTCHA v3 (depuis Google Console)
RECAPTCHA_PUBLIC_KEY=6Lc_XXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6Lc_XXXXXXXXXXXXXXXXXXXXXXX
```

**Comment obtenir les clés** :
- **Airtable** : https://airtable.com/account/tokens (Personal Access Token)
- **reCAPTCHA** : https://www.google.com/recaptcha/admin/create

### **Étape 2 : Lancer Docker Desktop**

```bash
# Sur Windows : Démarrer Docker Desktop
# Vérifier que Docker fonctionne
docker ps
```

### **Étape 3 : Build Docker image**

```bash
cd d:\Synapflows.fr
docker-compose build
```

**Attendre** : ~2-3 minutes pour construire l'image

**Vérifier** : Pas d'erreur npm, Vite build, syntaxe correcte

### **Étape 4 : Test local (optionnel)**

```bash
# Lancer localement pour vérifier
docker-compose up -d

# Attendre healthcheck
sleep 10

# Vérifier les logs
docker logs synapflows-www

# Accéder à http://localhost:5000 (via Traefik en local)
```

### **Étape 5 : Déployer sur VPS**

Sur le VPS (avec accès SSH) :

```bash
cd /path/to/synapflows.fr

# Récupérer les changements du git
git pull

# Arrêter ancien container
docker-compose down

# Build la nouvelle image
docker-compose build

# Lancer le container
docker-compose up -d

# Vérifier
docker ps
docker logs synapflows-www
```

### **Étape 6 : Vérifier le déploiement**

```bash
# 1. Vérifier que le container est "healthy"
docker ps | grep synapflows-www

# 2. Vérifier les logs
docker logs synapflows-www

# 3. Tester le domaine
curl https://www.synapflows.fr

# 4. Tester CORS/formulaire depuis le navigateur
# Ouvrir https://www.synapflows.fr et soumettre le formulaire
```

---

## 🔐 Sécurité

### ✅ Protégé
- `.env` : Exclu de git via `.gitignore`
- SSL/TLS : Traefik + Let's Encrypt configuré
- CORS : Whitelist stricte (www.synapflows.fr seulement)
- CSRF : Validation hostname en production
- Headers : CSP, HSTS, X-Frame-Options, etc. configurés

### ⚠️ À faire
- [ ] Remplir `AIRTABLE_TOKEN` dans `.env`
- [ ] Remplir `RECAPTCHA_SECRET_KEY` dans `.env`
- [ ] Remplir `RECAPTCHA_PUBLIC_KEY` dans `.env`
- [ ] Vérifier DNS pointe vers VPS
- [ ] Lancer Docker Desktop pour test local

---

## 📊 Résumé des fichiers modifiés

| Fichier | Type | Ligne(s) | Changement |
|---------|------|----------|-----------|
| vite.config.js | Code | 15 | Port proxy 5001→5000 |
| backend/index.js | Code | 62 | CORS project→www |
| backend/routes/submit.js | Code | 156 | CSRF project→www |
| docker-compose.yml | Config | 5, 16, 34 | Container + Traefik |
| .env | Config | - | CRÉÉ (secrets) |
| src/frontend/public/robots.txt | Config | 6 | Sitemap URL |
| monitor-with-alerts.sh | Script | 8 | DOMAIN variable |
| monitor-security.sh | Script | 6 | DOMAIN variable |

---

## 🚨 Troubleshooting

### Erreur : "Docker daemon not running"
**Solution** : Lancer Docker Desktop

### Erreur : "CORS error" après déploiement
**Vérifier** :
- DNS résout www.synapflows.fr vers le VPS
- `.env` est chargé (docker logs synapflows-www)
- `AIRTABLE_TOKEN` est rempli

### Erreur : "reCAPTCHA failed"
**Vérifier** :
- `RECAPTCHA_SECRET_KEY` est remplie dans `.env`
- Clés proviennent de la bonne console Google

---

## 📝 Notes

- **Ancienne configuration** : project.synapflows.fr
- **Nouvelle configuration** : www.synapflows.fr (avec www)
- **Port backend** : 5000 (interne), 80/443 via Traefik (externe)
- **Base Airtable** : identique (appvGEsLWrImfUU9i inchangée)
- **Architecture** : React + Express inchangée

**Durée estimation du déploiement** : 20-30 minutes (Docker build + test + déploiement VPS)

---

*Migration complétée le 18 avril 2026*
