# 🔐 Configuration GitHub Actions Secrets

**Objectif** : Configurer les secrets GitHub pour le déploiement automatique sur VPS via CI/CD  
**Date** : 18 avril 2026

---

## 📋 Secrets à configurer

### **Accès GitHub**

1. Ouvrir votre repo : https://github.com/OlivierGuimonneau/Synapflows.fr
2. Aller à **Settings** (⚙️) → **Secrets and variables** → **Actions** → **New repository secret**

### **Ajouter les 8 secrets suivants**

#### **1. VPS_HOST** (Déploiement)
```
Clé: VPS_HOST
Valeur: <votre-ip-vps>
```
Exemple : `123.456.789.012`

#### **2. VPS_USER** (Déploiement)
```
Clé: VPS_USER
Valeur: root
```

#### **3. VPS_PATH** (Déploiement)
```
Clé: VPS_PATH
Valeur: /root/www.synapflows.fr
```

#### **4. SSH_PRIVATE_KEY** (Déploiement) ⚠️ CRITIQUE
```
Clé: SSH_PRIVATE_KEY
Valeur: <contenu-entier-de-votre-clé-privée>
```

**Comment obtenir votre clé privée SSH** :

Sur le VPS (via SSH) :
```bash
# Lister vos clés SSH
ls ~/.ssh/

# Afficher la clé PRIVÉE (celle sans .pub)
# Si vous avez github_deploy :
cat ~/.ssh/github_deploy

# Si vous avez id_rsa :
cat ~/.ssh/id_rsa

# Si vous avez une autre clé :
cat ~/.ssh/votre_cle_privee
```

La clé **PRIVÉE** commence par `-----BEGIN` et finit par `-----END` (exemple : `-----BEGIN OPENSSH PRIVATE KEY-----`)

⚠️ **IMPORTANT** :
- Ne JAMAIS utiliser la clé avec `.pub` (celle-ci est publique)
- Copier **l'intégralité** du contenu (y compris les lignes BEGIN et END)
- GitHub Actions aura besoin de la clé complète

#### **5. AIRTABLE_TOKEN** (Variables d'environnement)
```
Clé: AIRTABLE_TOKEN
Valeur: pattGx0JN5bMKqsHi.24d65c136220f9892f71a0d109a3602a7c8d41c69208483c60831d961c0e2bbb
```

#### **6. AIRTABLE_BASE_ID** (Variables d'environnement)
```
Clé: AIRTABLE_BASE_ID
Valeur: appvGEsLWrImfUU9i
```

#### **7. AIRTABLE_PROJETS_SOUMIS** (Variables d'environnement)
```
Clé: AIRTABLE_PROJETS_SOUMIS
Valeur: Projets Soumis
```

#### **8. RECAPTCHA_SITE_KEY** (Variables d'environnement)
```
Clé: RECAPTCHA_SITE_KEY
Valeur: 6LcLH7IsAAAAAAj4Ylz9KNcMLC_VJ8AjdenA0QGx
```

#### **9. RECAPTCHA_ENTERPRISE_API_KEY** (Variables d'environnement)
```
Clé: RECAPTCHA_ENTERPRISE_API_KEY
Valeur: AIzaSyBGO3O5GK1h3vSU3WNLICi_EmhdBLkg-S0
```

---

## 🧪 Tester le déploiement

### **Test 1 : Via GitHub UI**
1. Aller à **Actions** (onglet du repo)
2. Chercher le workflow `Deploy SynapFlows`
3. Cliquer sur **Run workflow** (bouton `▶️`)
4. Sélectionner **main** branch
5. Cliquer **Run workflow**

### **Test 2 : Déclencher automatiquement**
Faire un `git push` sur la branche `main` :
```bash
cd d:\Synapflows.fr
git add .
git commit -m "test: trigger github actions"
git push origin main
```

### **Vérifier le statut**
- Aller à **Actions** 
- Voir le statut du workflow (⏳ running, ✅ success, ❌ failed)
- Cliquer sur le job pour voir les logs détaillés

---

## 🔍 Troubleshooting

### **Erreur : "SSH key format invalid"**
**Cause** : Clé privée mal copiée  
**Solution** : Copier **l'intégralité** de la clé, y compris les lignes `-----BEGIN` et `-----END`

### **Erreur : "host key verification failed"**
**Cause** : Première connexion SSH au VPS via GitHub Actions  
**Solution** : Sur le VPS, lancer manuellement une première connexion ou ajouter le host à `known_hosts`

### **Erreur : ".env: No such file or directory"**
**Cause** : Les secrets GitHub ne sont pas configurés  
**Solution** : Ajouter tous les 9 secrets dans GitHub (voir section précédente)

### **Erreur : "docker compose: command not found"**
**Cause** : Ancienne version du script  
**Solution** : Le VPS doit avoir Docker Compose v2+ (ne pas installer `docker-compose` séparé)

### **Déploiement réussit mais le service ne démarre pas**
```bash
# Sur le VPS, vérifier les logs
docker logs synapflows-www -f

# Chercher les erreurs :
# - AIRTABLE_TOKEN missing
# - RECAPTCHA clés manquantes
```

---

## 📝 Checklist Configuration

- [ ] Secret `VPS_HOST` ajouté
- [ ] Secret `VPS_USER` ajouté (root)
- [ ] Secret `VPS_PATH` ajouté (/root/www.synapflows.fr)
- [ ] Secret `SSH_PRIVATE_KEY` ajouté (clé complète)
- [ ] Secret `AIRTABLE_TOKEN` ajouté
- [ ] Secret `AIRTABLE_BASE_ID` ajouté
- [ ] Secret `AIRTABLE_PROJETS_SOUMIS` ajouté
- [ ] Secret `RECAPTCHA_SITE_KEY` ajouté
- [ ] Secret `RECAPTCHA_ENTERPRISE_API_KEY` ajouté
- [ ] Workflow `.github/workflows/deploy.yml` mis à jour
- [ ] Test local : `git push` → workflow déclenché
- [ ] Vérifier dans **Actions** : workflow réussit (✅)
- [ ] Vérifier sur le VPS : `docker ps` montre `synapflows-www` running

---

## 🎯 Après la configuration

Une fois les secrets configurés, **chaque push sur main** déclenchera automatiquement :
1. Build Docker
2. Déploiement sur VPS
3. Restart du service
4. Affichage des logs

**Pour voir le statut** :
- GitHub repo → **Actions** tab
- Cliquer sur le dernier workflow run
- Voir les logs détaillés

---

## 🔒 Sécurité

✅ **Bonnes pratiques** :
- Secrets stockés chiffrés dans GitHub
- Jamais exposés dans les logs
- Chaque commit peut déclencher un déploiement
- SSH key pour accès au VPS

⚠️ **À éviter** :
- Ne JAMAIS commiter le `.env` (déjà en .gitignore ✅)
- Ne JAMAIS mettre les secrets dans le code
- Ne JAMAIS faire un screenshot avec les secrets visibles

---

## 📞 Support

Si le workflow échoue :
1. Cliquer sur le workflow dans **Actions**
2. Lire les logs (section rouge en bas)
3. Chercher le mot-clé d'erreur dans la section "Troubleshooting" ci-dessus
4. Vérifier sur le VPS : `docker logs synapflows-www`

