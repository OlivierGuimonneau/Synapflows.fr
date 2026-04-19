# 🚀 Guide d'installation – SynapFlows

Guide complet pour configurer et lancer l'application SynapFlows en local.

---

## ✅ Prérequis

- **Node.js 16+** et **npm** installés
- **Compte Airtable** avec accès aux tokens API
- Un terminal/shell (PowerShell, Bash, cmd, etc.)
- Un éditeur de code (VS Code recommandé)

### Vérifier l'installation

```bash
node --version    # Devrait afficher v16.0.0 ou plus
npm --version     # Devrait afficher 8.0.0 ou plus
```

Si ce n'est pas le cas, installer Node.js depuis https://nodejs.org/

---

## 📥 Étape 1: Préparer le projet

### 1.1 Ouvrir le dossier du projet

```bash
cd d:\SynapFlows-ProjectSubmission
```

### 1.2 Vérifier que c'est bien un projet Node

```bash
ls package.json    # Devrait afficher le fichier
```

---

## 📦 Étape 2: Installer les dépendances

### 2.1 Installer les packages npm

```bash
npm install
```

Cela va:
- Télécharger 500+ packages (React, Vite, Express, etc.)
- Créer le dossier `node_modules/` (peut être volumineux ~500MB)
- Générer `package-lock.json`

**Temps estimé:** 2-5 minutes

### 2.2 Vérifier l'installation (optionnel)

```bash
npm list react      # Affiche React 18.2.0
npm list vite       # Affiche Vite 8.0.6
npm list express    # Affiche Express 4.18.2
```

---

## 🔑 Étape 3: Configuration Airtable

### 3.1 Créer un token API Airtable

1. Aller sur https://airtable.com/account/tokens (connecté à votre compte)
2. Cliquer sur **"Create token"**
3. Donner un nom: `SynapFlows API` (ou autre)
4. Sélectionner les permissions:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
   - ✅ `schema.bases:read`
5. Cliquer **"Create token"**
6. **Copier** le token affiché (commence par `pat...` suivi d'une longue chaîne)

⚠️ **Important**: Le token n'apparaît qu'une seule fois. À copier immédiatement.

### 3.2 Trouver votre BASE_ID

1. Ouvrir votre base Airtable (celle où vous avez créé/créerez la table)
2. L'URL ressemble à:
   ```
   https://airtable.com/appvGEsLWrImfUU9i/tblXXXXXXXXXXXX/...
                      ^^^^^^^^^^^^^^^^
                      Votre BASE_ID
   ```
3. Copier le `BASE_ID` (commence par `app...`)

### 3.3 Identifier le nom de la table

1. Dans votre base Airtable, créer une table nommée exactement: **`Projets Soumis`**
   (ou utiliser un autre nom et l'indiquer dans `.env`)

### 3.4 Créer le fichier `.env`

À la racine du projet (`d:\SynapFlows-ProjectSubmission\.env`), créer un fichier avec:

```bash
AIRTABLE_BASE_ID=appvGEsLWrImfUU9i
AIRTABLE_TABLE=Projets Soumis
AIRTABLE_TOKEN=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
PORT=5001
NODE_ENV=development
```

**Remplacer:**
- `appvGEsLWrImfUU9i` par votre BASE_ID
- `patXXX...` par votre token complet
- `Projets Soumis` si vous avez un autre nom de table

⚠️ **Sécurité**: Ne **JAMAIS** commiter `.env` (il est déjà dans `.gitignore`)

### 3.5 Créer la table Airtable

Dans votre base Airtable, créer une table `Projets Soumis` avec ces colonnes:

#### Colonnes requises

```
Prénom                    (Text)
Nom                       (Text)
Email                     (Email)
Téléphone                 (Phone Number) - reçoit la valeur brute
Fonction                  (Text)
Entreprise                (Text)
Type de projet            (Text)
Description du projet     (Long text)
Objectif principal        (Text)
Fonctionnalités           (Text) - reçoit: "Fonctionnalité 1, Fonctionnalité 2"
Priorités V1              (Text)
Utilisateurs lancement    (Number)
Utilisateurs à 1 an       (Number)
Profils utilisateurs      (Text) - reçoit: "PMO, Dev, Designer"
Conformité et sécurité    (Text)
Intégrations existantes   (Text)
Ambiance visuelle         (Text) - reçoit: "Moderne, Minimaliste"
Références design         (Text)
Contraintes de charte     (Text)
Budget                    (Text)
Délai                     (Text)
Informations complémentaires (Long text)
Date de soumission        (DateTime) - format: YYYY-MM-DD HH:mm
Source                    (Text)
```

**Note:** Les colonnes `Text` acceptent les valeurs jointes par virgules (multi-select du formulaire).

---

## ✨ Étape 4: Lancer l'application

### 4.1 Démarrer le mode développement

```bash
npm run dev
```

Cela va lancer **deux serveurs en parallèle**:

**Sortie attendue:**
```
VITE v5.0.0  ready in XXX ms

➜ Local:   http://localhost:5174/
➜ press h to show help

✅ Serveur lancé sur http://localhost:5001
```

### 4.2 Ouvrir dans le navigateur

1. Aller à `http://localhost:5174`
2. Voir le formulaire s'afficher

### 4.3 Tester la soumission

1. Remplir le formulaire (tous les champs obligatoires avec \*)
2. Cliquer "Envoyer la demande"
3. Si ✅ succès: écran "Demande envoyée"
4. Vérifier que les données apparaissent dans Airtable

---

## 🧪 Dépannage

### ❌ Erreur: "EADDRINUSE: address already in use :::5001"

**Cause:** Un autre processus utilise le port 5001

**Solution:**
```bash
# Windows - trouver le process
netstat -ano | findstr :5001

# Puis tuer le process (remplacer PID par le numéro trouvé)
taskkill /PID 12345 /F

# Relancer
npm run dev
```

Ou modifier le `.env`:
```bash
PORT=5002   # Essayer un autre port
```

---

### ❌ Erreur: "Airtable error: 404 - NOT_FOUND"

**Cause:** Base ID ou token invalide

**Vérifications:**
1. `.env` contient `AIRTABLE_BASE_ID` ?
2. BASE_ID commence par `app...` ?
3. Token commence par `pat...` ?
4. Token n'est pas expiré ?

**Solution:**
- Générer un nouveau token (cf. Étape 3.1)
- Mettre à jour `.env`
- Relancer: `npm run dev`

---

### ❌ Erreur: "Airtable error: 422 - UNKNOWN_FIELD_NAME"

**Cause:** Le nom d'une colonne ne correspond pas

**Solution:**
1. Vérifier les noms des colonnes dans Airtable (accents, majuscules, espaces)
2. Vérifier dans `backend/services/airtable.js` la fonction `mapToAirtableFields()`
   - Les clés de gauche = noms Airtable (doivent être exacts)
3. Corriger et relancer

**Exemple:**
```javascript
'Prénom': payload.prenom,  // "Prénom" doit correspondre exactement
'Nom': payload.nom,        // à la colonne Airtable
```

---

### ❌ "npm: commande introuvable"

**Cause:** Node.js/npm pas installé

**Solution:** Installer Node.js depuis https://nodejs.org/

---

### ❌ Vite hot-reload ne fonctionne pas

**Cause:** Vite n'écoute pas sur toutes les interfaces

**Solution:** Vérifier que le terminal affiche:
```
➜ Local:   http://localhost:5174
```

Si absent, redémarrer avec:
```bash
npm run dev
```

---

### ❌ Les changements CSS n'apparaissent pas

**Solution:** Nettoyer le cache navigateur
- Appuyer sur `Ctrl+Shift+Delete` (ou Cmd+Shift+Delete sur Mac)
- Cocher "Cookies et données de site"
- Cliquer "Effacer"
- Actualiser la page

---

## 🛠️ Commands disponibles

```bash
npm run dev           # Lancer dev (Vite + Express)
npm run build         # Build pour production
npm run preview       # Preview du build (sans serveur)
npm start            # Build + lancer serveur (production)
npm run server:dev   # Lancer juste Express (sans Vite)
```

---

## 📱 Accès distant (même réseau)

Pour accéder à l'appli depuis un autre ordinateur (même réseau):

```bash
# Au lieu de localhost:5174, utiliser l'IP locale
# Vite affiche l'IP après `npm run dev`
http://192.168.x.x:5174
```

---

## 📂 Structure fichiers importants

```
SynapFlows-ProjectSubmission/
├── .env                    ← À créer avec vos identifiants Airtable
├── src/frontend/
│   ├── public/assets/images/
│   │   ├── logo-synapflows.png
│   │   └── Icone_Synapflows.png
│   ├── components/         ← Composants React
│   ├── pages/FormPage.jsx  ← État du formulaire
│   └── styles/             ← Styles modulaires
├── backend/
│   ├── index.js           ← Serveur Express
│   ├── routes/submit.js   ← Endpoint POST
│   └── services/airtable.js ← Intégration Airtable
├── public/                ← Build output (généré)
├── package.json           ← Scripts et dépendances
└── vite.config.js         ← Configuration build
```

---

## ✅ Checklist final

Avant de démarrer:

- [ ] Node.js 16+ installé
- [ ] `npm install` exécuté
- [ ] Token Airtable généré
- [ ] `.env` créé avec identifiants
- [ ] Table `Projets Soumis` créée dans Airtable
- [ ] Colonnes Airtable correspondent au `mapToAirtableFields()`
- [ ] `npm run dev` lance sans erreur
- [ ] Navigateur affiche le formulaire
- [ ] Soumission crée un enregistrement Airtable

---

## 📞 Besoin d'aide?

1. **Relire cette page** (surtout section Dépannage)
2. Consulter [README.md](README.md) pour architecture
3. Consulter [MIGRATION_NOTES.md](MIGRATION_NOTES.md) pour historique
4. Vérifier les logs du terminal (dev et backend)

---

**Version:** 1.0.0 | **Mise à jour:** Avril 2026

```powershell
# Installer les dépendances
npm install

# Développement avec hot reload
npm run dev

# Build pour production
npm run build

# Serveur production
npm start

# Vérifier une dépendance
npm list react
npm view express version

# Mettre à jour une dépendance
npm update express
```

## Troubleshooting

### ❌ "Cannot find module 'react'"
```powershell
# Supprimez node_modules et réinstallez
rm -r node_modules package-lock.json
npm install
```

### ❌ "Port 5000 already in use"
Le port est occupé. Soit:
- Fermez l'autre application utilisant le port
- Changez le PORT dans `.env` à `5001` ou autre
- Sur Windows: `Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess`

### ❌ "AIRTABLE_TOKEN is undefined"
- Vérifiez que `.env` existe et contient `AIRTABLE_TOKEN=pat...`
- Vérifiez qu'il n'y a pas d'espace avant/après la valeur
- Le token doit être complet (commence par `pat`, ~100 caractères)

### ❌ "Connection refused" sur Airtable
- Vérifiez votre AIRTABLE_BASE_ID (commence par `app`)
- Vérifiez que le token n'a pas expiré
- Vérifiez la table `AIRTABLE_TABLE` existe (ex: "Projets Soumis")

### ❌ Le formulaire n'envoie pas
- Ouvrez F12 → Onglet "Network"
- Remplissez le formulaire
- Voyez si la requête POST vers `/api/submit` a un code 200 (succès) ou 500 (erreur)
- Consultez la console du serveur pour les logs détaillés

### ✅ Tout fonctionne mais style cassé
- Vérifiez que `/public` existe et contient les fichiers compilés
- Relancez `npm run build`
- Rafraîchissez le navigateur (Ctrl+Shift+R pour vider le cache)

## Prochaines étapes

1. **Customiser les styles**: Modifiez `src/frontend/App.css`
2. **Ajouter des validations**: Améliorez `src/frontend/components/steps/*.jsx`
3. **Ajouter des emails**: Intégrez `nodemailer` dans `backend/routes/submit.js`
4. **Déployer**: Utilisez Render, Railway, Vercel, ou votre plateforme préférée
5. **Améliorer l'ergonomie**: Ajoutez des animations, des confirmations, etc.

Bon développement! 🚀
