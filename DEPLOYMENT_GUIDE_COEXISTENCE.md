# 🚀 Guide de déploiement : www.synapflows.fr (Coexistence avec project.synapflows.fr)

**Objectif** : Déployer www.synapflows.fr en parallèle avec project.synapflows.fr sans casser l'existant  
**Date** : 18 avril 2026  
**Architecture** : Deux repos indépendants, deux containers Docker, un seul Traefik

---

## 📋 Prérequis

- ✅ Accès SSH au VPS
- ✅ Docker & Docker Compose installé sur le VPS
- ✅ Traefik déjà configuré et tournant sur le réseau `n8n-https_default`
- ✅ Certificat Let's Encrypt configuré dans Traefik
- ✅ Repo `project.synapflows.fr` existant et tournant
- ✅ Ce repo `www.synapflows.fr` prêt à être déployé

---

## 🔧 Configuration des variables d'environnement

### Sur le VPS, créer le fichier `.env` pour www.synapflows.fr

```bash
ssh user@your-vps

# Naviguer vers le répertoire du projet www
cd /path/to/www.synapflows.fr

# Créer le fichier .env avec les secrets production
cat > .env << 'EOF'
# ===================================
# SYNAPFLOWS PRODUCTION CONFIGURATION
# Deployed on: www.synapflows.fr
# ===================================

# 🔧 SERVER CONFIGURATION
PORT=5000
NODE_ENV=production

# 📊 AIRTABLE API INTEGRATION
AIRTABLE_BASE_ID=appvGEsLWrImfUU9i
AIRTABLE_TABLE=Projets Soumis
AIRTABLE_TOKEN=pattGx0JN5bMKqsHi.24d65c136220f9892f71a0d109a3602a7c8d41c69208483c60831d961c0e2bbb

# 🤖 GOOGLE RECAPTCHA V3 PROTECTION
VITE_RECAPTCHA_SITE_KEY=6LcLH7IsAAAAAAj4Ylz9KNcMLC_VJ8AjdenA0QGx
VITE_RECAPTCHA_ACTION=submit_lead
RECAPTCHA_SITE_KEY=6LcLH7IsAAAAAAj4Ylz9KNcMLC_VJ8AjdenA0QGx
RECAPTCHA_ENTERPRISE_API_KEY=AIzaSyBGO3O5GK1h3vSU3WNLICi_EmhdBLkg-S0
RECAPTCHA_ENTERPRISE_PROJECT_ID=synapflows
RECAPTCHA_EXPECTED_ACTION=submit_lead
RECAPTCHA_MIN_SCORE=0.5
EOF

# Vérifier le fichier
cat .env
```

⚠️ **Important** : `.env` est en `.gitignore` - **ne pas commiter les secrets**

---

## 🚀 Étapes de déploiement

### **Étape 1 : Clone et préparation**

```bash
# Sur le VPS, créer un répertoire séparé pour www
mkdir -p /opt/www.synapflows.fr
cd /opt/www.synapflows.fr

# Clone le repo (ou git pull si déjà existant)
git clone https://github.com/your-org/www.synapflows.fr.git .
# OU si déjà cloné :
git pull origin main

# Créer le fichier .env (voir section précédente)
# ... (copier/coller le cat > .env ci-dessus)
```

### **Étape 2 : Vérifier que project.synapflows.fr tourne**

```bash
# Vérifier les containers en cours d'exécution
docker ps | grep synapflows

# Vous devriez voir quelque chose comme :
# container_id   synapflows-project   ...   Up (healthy)
```

**Critères de succès** : Le container `synapflows-project` doit être `Up` et `(healthy)`

### **Étape 3 : Build l'image Docker pour www.synapflows.fr**

```bash
cd /opt/www.synapflows.fr

# Construire l'image (peut prendre 2-3 minutes)
docker-compose build

# Vérifier le build
docker images | grep synapflows
```

**Critères de succès** : Image `synapflowsfr-synapflows:latest` créée

### **Étape 4 : Lancer www.synapflows.fr en parallèle**

```bash
cd /opt/www.synapflows.fr

# Lancer le container
docker-compose up -d

# Vérifier que les deux tournent
docker ps | grep synapflows

# Vous devriez voir :
# 1. synapflows-project (ancien)
# 2. synapflows-www (nouveau)
```

**Critères de succès** : Deux containers visibles, tous deux `Up` et `(healthy)`

### **Étape 5 : Vérifier les logs**

```bash
# Logs du nouveau service www
docker logs synapflows-www

# Vous devriez voir :
# ✓ Express server listening on port 5000
# ✓ Configuration Airtable ...
# ✓ NODE_ENV: production
```

---

## ✅ Tests de validation

### **Test 1 : Vérifier que www.synapflows.fr répond**

```bash
# Depuis n'importe où (machine locale ou VPS)
curl -I https://www.synapflows.fr

# Réponse attendue :
# HTTP/2 200
# content-type: text/html; charset=UTF-8
# strict-transport-security: max-age=31536000; includeSubDomains; preload
```

### **Test 2 : Vérifier que project.synapflows.fr toujours fonctionnel**

```bash
curl -I https://project.synapflows.fr

# Réponse attendue : HTTP/2 200
```

### **Test 3 : Test du formulaire www.synapflows.fr**

1. Ouvrir https://www.synapflows.fr dans le navigateur
2. Remplir et soumettre le formulaire
3. Vérifier dans Airtable que les données arrivent

### **Test 4 : Vérifier que CORS fonctionne**

```bash
curl -X POST https://www.synapflows.fr/api/submit \
  -H "Content-Type: application/json" \
  -H "Origin: https://www.synapflows.fr" \
  -d '{"test":"data"}' \
  -v

# Vérifier qu'il n'y a pas d'erreur CORS
```

---

## 🔍 Troubleshooting

### **Erreur : "Port 5000 already in use"**

**Cause** : project.synapflows.fr utilise aussi le port 5000  
**Solution** : C'est normal ! Traefik les route par domaine, pas par port. Les deux peuvent utiliser 5000 en interne.

### **Erreur : "Traefik router conflict"**

**Cause** : Les labels Traefik conflictent  
**Vérification** : Les labels utilisent `synapflows-www-*` (pas `synapflows-*`)  
**Si conflit** : Consulter [docker-compose.yml](docker-compose.yml) ligne 13+

### **Erreur : "CORS error" en production**

**Cause** : Whitelist CORS ne contient pas www.synapflows.fr  
**Vérification** : [backend/index.js](backend/index.js) ligne 62  
**Fix** : Doit contenir `['https://www.synapflows.fr']` en production

### **Erreur : Container démarre puis s'arrête**

**Debug** :
```bash
docker logs synapflows-www

# Chercher les erreurs :
# - Missing .env variables
# - Airtable token invalide
# - Port déjà utilisé
```

---

## 🛑 Arrêt / Maintenance

### **Arrêter temporairement www.synapflows.fr (garder project)**

```bash
cd /opt/www.synapflows.fr
docker-compose down

# project.synapflows.fr continue à tourner
```

### **Redémarrer www.synapflows.fr**

```bash
cd /opt/www.synapflows.fr
docker-compose up -d
```

### **Mettre à jour www.synapflows.fr (sans arrêter project)**

```bash
cd /opt/www.synapflows.fr

# Récupérer les changements
git pull origin main

# Rebuild
docker-compose build

# Restart
docker-compose up -d
```

---

## 📊 Architecture déployée

```
┌─────────────────────────────────────────────────────┐
│               Traefik Reverse Proxy                 │
│        (Port 80/443, réseau n8n-https_default)      │
└────┬─────────────────────────────────────────────┬──┘
     │                                             │
     │                                             │
     ├─────────────────────┐                       │
     │ Host: project.*     │                       │
     │ Container:          │                       │
     │ synapflows-project  │                       │
     │ Port: 5000          │                       │
     └─────────────────────┘                       │
                                                   │
                                    ┌──────────────┴────────────┐
                                    │ Host: www.*              │
                                    │ Container:               │
                                    │ synapflows-www           │
                                    │ Port: 5000 (même port !)│
                                    └─────────────────────────┘
```

**Note** : Les deux containers peuvent utiliser le port 5000 car Traefik les route en fonction du domaine (Host), pas du port.

---

## 📝 Checklist pré-déploiement

- [ ] SSH accès au VPS OK
- [ ] project.synapflows.fr tourne actuellement
- [ ] Fichier `.env` rempli avec vraies clés Airtable & reCAPTCHA
- [ ] DNS www.synapflows.fr résout vers le VPS
- [ ] Certificat Let's Encrypt configuré dans Traefik
- [ ] docker-compose.yml contient labels `synapflows-www-*` (pas `synapflows-*`)
- [ ] Git repo poussé avec tous les changements

---

## 📝 Checklist post-déploiement

- [ ] Deux containers visibles : `synapflows-project` et `synapflows-www`
- [ ] Tous deux `Up` et `(healthy)`
- [ ] Logs www.synapflows.fr montrent "Express server listening on port 5000"
- [ ] https://www.synapflows.fr répond avec HTTP 200
- [ ] https://project.synapflows.fr toujours fonctionnel
- [ ] Formulaire www.synapflows.fr soumis → données dans Airtable
- [ ] Pas d'erreur CORS
- [ ] Certificats SSL valides pour les deux domaines

---

## 🎯 Prochaines étapes

1. **Immediate** (24h après déploiement) :
   - Monitorer les logs des deux services
   - Tester les formulaires régulièrement
   - Vérifier les alertes de monitoring

2. **Court terme** (1 semaine) :
   - Si www.synapflows.fr stable → rediriger project.synapflows.fr vers www
   - Mettre à jour DNS pour indiquer www comme principal
   - Archiver ancien service project (garder en backup)

3. **Moyen terme** :
   - Centraliser la configuration Airtable/reCAPTCHA
   - Mettre en place CI/CD GitHub Actions pour autodéploiement

---

**Support** : En cas de problème, vérifier les logs :
```bash
docker logs synapflows-www -f  # Logs en continu
docker logs synapflows-project -f  # Logs projet ancien
```

