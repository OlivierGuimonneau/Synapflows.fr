# SynapFlows – Application React + Node

Formulaire de qualification de projet moderne basé sur une architecture **React (frontend) + Express (backend)** avec intégration Airtable.

## 🚀 Vue d'ensemble

**SynapFlows** est une application web permettant de collecter et qualifier les demandes de projets via un formulaire multi-étapes. Les données sont stockées directement dans Airtable pour un suivi simplifié.

### Technologies utilisées

| Technologie | Version | Rôle |
|---|---|---|
| **React** | 18.2 | Framework UI frontend |
| **Vite** | 8.0.6 | Build tool et dev server (hot reload) |
| **Express** | 4.18 | Serveur backend Node.js |
| **Airtable API** | v0 | Base de données cloud |
| **CSS3** | — | Styling avec variables et thème light/dark |

---

## 📁 Structure du projet

```
SynapFlows-ProjectSubmission/
│
├── 📂 src/
│   └── 📂 frontend/
│       ├── App.jsx                    • Composant principal (layout + routing)
│       ├── index.jsx                  • Point d'entrée React
│       ├── index.html                 • Template HTML
│       │
│       ├── 📂 public/                 • Assets statiques source
│       │   └── 📂 assets/
│       │       └── 📂 images/
       │           ├── favicon.png             (icône browser tab)
       │           └── logo-synapflows.png     (logo en-tête)
│       │
│       ├── 📂 components/             • Composants réutilisables
│       │   ├── Header.jsx             • En-tête + toggle thème
│       │   ├── Hero.jsx               • Section d'accueil
│       │   ├── Progress.jsx           • Barre de progression
│       │   ├── Form.jsx               • Gestionnaire des étapes
│       │   ├── Footer.jsx             • Pied de page
│       │   ├── SuccessScreen.jsx      • Écran de confirmation
│       │   │
│       │   └── 📂 steps/              • Composants des 6 étapes
│       │       ├── Step1.jsx          • Étape 1: Contact
│       │       ├── Step2.jsx          • Étape 2: Description projet
│       │       ├── Step3.jsx          • Étape 3: Fonctionnalités
│       │       ├── Step4.jsx          • Étape 4: Utilisateurs & données
│       │       ├── Step5.jsx          • Étape 5: Design & intégrations
│       │       └── Step6.jsx          • Étape 6: Budget & délai
│       │
│       ├── 📂 pages/
│       │   └── FormPage.jsx           • Page principale (state du formulaire)
│       │
│       └── 📂 styles/                 • Feuilles de style modulaires
│           ├── index.css              • Point d'entrée (imports)
│           ├── variables.css          • Design tokens (couleurs, spacing, etc.)
│           ├── base.css               • Reset et styles de base
│           ├── layout.css             • Header, hero, footer, layout général
│           └── forms.css              • Inputs, boutons, validation visuelle
│
├── 📂 backend/
│   ├── index.js                       • Serveur Express (middleware, routes)
│   │
│   ├── 📂 routes/
│   │   └── submit.js                  • Endpoint POST /api/submit
│   │
│   └── 📂 services/
│       └── airtable.js                • Intégration API Airtable
│
├── 📂 public/                         • Fichiers statiques générés (build)
│   └── 📂 assets/                     • Copie des assets via Vite
│       └── 📂 images/                 • Images optimisées (build output)
│
├── 🗄️ Configuration & fichiers racine
│   ├── package.json                   • Dépendances et scripts
│   ├── vite.config.js                 • Configuration Vite
│   ├── .env.example                   • Modèle de configuration
│   ├── .gitignore                     • Fichiers à ignorer (node_modules/, .env, etc.)
│   │
│   ├── 📄 README.md                   • Ce fichier
│   ├── SETUP.md                       • Guide d'installation détaillé
│   ├── QUICKSTART.md                  • Démarrage rapide
│   └── MIGRATION_NOTES.md             • Historique de la migration
```

---

## 🏗️ Architecture

### Frontend (React + Vite)

**Flux de données:**
```
App.jsx (layout global)
  ├── Header (logo, theme toggle)
  ├── Hero (accueil)
  ├── FormPage (state du formulaire)
  │   ├── Progress (barre de progression)
  │   ├── Form (sélecteur d'étape)
  │   │   └── Step1-6 (champs du formulaire)
  │   └── SuccessScreen (confirmation post-submit)
  └── Footer (copyright)
```

**Gestion d'état:**
- Centralisée dans `FormPage.jsx`
- État: `currentStep`, `formData`, `submitted`, `loading`
- Communication parent → enfant via props (`data`, `onChange`, `onNext`)

**Styles:**
- Architecture modulaire par **responsabilité**:
  - `variables.css` → design system (tokens, couleurs, espacement)
  - `base.css` → reset, typographie
  - `layout.css` → structure (header, hero, footer, cards)
  - `forms.css` → inputs, boutons, listes de choix
- Système de **thèmes** via CSS custom properties (`--color-primary`, etc.)
- Support **light/dark** mode avec `data-theme` attribute

### Backend (Express)

**Routes:**
- `GET /api/config-test` → Debug (affiche config chargée)
- `POST /api/submit` → Reçoit les données du formulaire
  - ↓ valide le payload
  - ↓ transforme les champs via `mapToAirtableFields()`
  - ↓ envoie à l'API Airtable via HTTPS
  - ↓ retourne succès ou erreur

**Middleware:**
- `dotenv` → charge `.env` en `process.env`
- `cors()` → autorise requêtes cross-origin
- `express.json()` → parse body JSON
- `express.static()` → sert les fichiers de build (production)

**Airtable Integration:**
- Service: `backend/services/airtable.js`
- Fonction clé: `mapToAirtableFields(payload)`
  - Transforme les noms de champs du formulaire en colonnes Airtable
  - Ex: `prenom` → `Prénom` (avec accent)
  - Format date: `YYYY-MM-DD HH:mm` (24h)
- Authentification: Bearer token dans header `Authorization`

---

## ⚙️ Configuration

### 1. Installer les dépendances

```bash
npm install
```

Cela installe:
- React, React-DOM
- Vite et plugin React
- Express, CORS
- dotenv pour gestion environnement
- concurrently pour lancer dev et serveur en parallèle

### 2. Créer `.env` (sécurité)

À la racine du projet, créer `.env`:

```bash
AIRTABLE_BASE_ID=appvGEsLWrImfUU9i
AIRTABLE_TABLE=Projets Soumis
AIRTABLE_TOKEN=pat...extraLongToken...
PORT=5001
NODE_ENV=development
```

**Obtenir ces valeurs:**
1. **BASE_ID**: Ouvrir votre base Airtable → URL: `airtable.com/{BASE_ID}/...`
2. **Token**: https://airtable.com/account/tokens → Create → Copier token
3. **TABLE**: Nom exact de votre table dans Airtable

⚠️ **NE JAMAIS** commiter `.env` (déjà dans `.gitignore`)

### 3. Configurer Airtable

Votre base Airtable doit avoir une table `Projets Soumis` avec ces colonnes:

```
Prénom (Text)
Nom (Text)
Email (Email)
Téléphone (Phone)
Fonction (Text)
Entreprise (Text)
Type de projet (Text)
Description du projet (Long text)
Objectif principal (Text)
Fonctionnalités (Text) [reçoit: "Fonctionnalité 1, Fonctionnalité 2"]
Priorités V1 (Text)
Utilisateurs lancement (Number)
Utilisateurs à 1 an (Number)
Profils utilisateurs (Text) [reçoit: "PMO, Dev, Designer"]
Conformité et sécurité (Text)
Intégrations existantes (Text)
Ambiance visuelle (Text) [reçoit: "Moderne, Minimaliste"]
Références design (Text)
Contraintes de charte (Text)
Budget (Text)
Délai (Text)
Informations complémentaires (Long text)
Date de soumission (DateTime) [format: YYYY-MM-DD HH:mm]
Source (Text) [valeur: "Formulaire site SynapFlows"]
```

---

## 🛠️ Scripts disponibles

### Développement

```bash
npm run dev
```
Lance **deux serveurs en parallèle**:
1. **Vite dev server** (port 5174, hot reload)
2. **Express backend** (port 5001, API)
- Les requêtes `/api/*` sont automatiquement routées vers Express (via proxy Vite)

### Production

```bash
npm run build
```
Exécute Vite pour générer les fichiers optimisés dans `public/`

```bash
npm start
```
Build + Lance le serveur Express en production (sert les fichiers statiques de `public/`)

### Autres

```bash
npm run server:dev        # Lance juste Express (sans Vite)
npm run preview          # Preview build Vite (sans serveur)
```

---

## 📊 Le formulaire (6 étapes)

| Étape | Titre | Champs | Notes |
|---|---|---|---|
| **1** | Contact | Prénom*, Nom*, Email*, Téléphone, Fonction, Entreprise* | Identification du demandeur |
| **2** | Description | Type*, Description*, Objectif, Priorités | Contexte du projet |
| **3** | Fonctionnalités | Cocher les fonctionnalités souhaitées | Multi-select |
| **4** | Utilisateurs | Utilisateurs V1*, Utilisateurs 1 an*, Profils*, Conformité*, Intégrations | Scope technique |
| **5** | Design | Ambiance visuelle*, Références, Contraintes charte | Branding & UX |
| **6** | Budget | Budget, Délai, Commentaires | Clôture + message rassurant |

\* = champs obligatoires

---

## 🖼️ Gestion des images

**Source (développement):**
```
src/frontend/public/assets/images/
├── favicon.png           • Icône browser tab (32×32px)
└── logo-synapflows.png   • Logo en-tête (48px hauteur)
```

**Build (production):**
```
public/assets/images/    • Généré par Vite depuis src/frontend/public/
├── favicon.png
└── logo-synapflows.png
```

### Utilisation dans le code

**En développement:**
```jsx
// Chemin public dans React
<img src="/assets/images/logo-synapflows.png" alt="Logo" />
```

**Chemins statiques:**
- Frontend: Vite sert depuis `src/frontend/public/`
- Backend: Express sert depuis `public/` (après build)
- Build output dans `vite.config.js`: `outDir: '../../public'`

---

## 🔧 Dépannage

### Erreur "PORT 5001 already in use"
```bash
# Trouver le process utilisant le port
netstat -ano | findstr :5001

# Tuer le process (remplacer PID)
taskkill /PID 12345 /F
```

### Erreur Airtable "NOT_FOUND" (404)
→ Vérifier `.env`: `AIRTABLE_BASE_ID` et `AIRTABLE_TABLE` corrects

### Erreur "UNKNOWN_FIELD_NAME" (422)
→ Les colonnes Airtable ne correspondent pas aux champs envoyés
→ Vérifier noms des colonnes (accents, capitales) dans `mapToAirtableFields()`

### Vite ne hot-reload pas
```bash
# S'assurer que Vite écoute sur toutes les interfaces
npm run dev   # Devrait afficher "http://<ip>:5174"
```

---

## 📝 Environment Variables

| Variable | Exemple | Description |
|---|---|---|
| `AIRTABLE_BASE_ID` | `appvGEsLWrImfUU9i` | Identifiant de votre base Airtable |
| `AIRTABLE_TABLE` | `Projets Soumis` | Nom de la table (exact, avec espaces) |
| `AIRTABLE_TOKEN` | `pat...` | Token API Airtable (sécurisé) |
| `PORT` | `5001` | Port du serveur Express |
| `NODE_ENV` | `development` | `development` ou `production` |

---

## 🚀 Démarrer rapidement

```bash
# 1. Cloner/ouvrir le projet
cd SynapFlows-ProjectSubmission

# 2. Installer les dépendances
npm install

# 3. Créer .env avec vos identifiants Airtable
# (Copier .env.example et remplir)

# 4. Lancer le dev
npm run dev

# 5. Ouvrir dans le navigateur
# http://localhost:5174

# 6. Remplir le formulaire et tester la soumission
```

---

## 📚 Fichiers importants

| Fichier | Rôle |
|---|---|
| [SETUP.md](SETUP.md) | Guide d'installation détaillé étape par étape |
| [QUICKSTART.md](QUICKSTART.md) | Démarrage express (5 min) |
| [MIGRATION_NOTES.md](MIGRATION_NOTES.md) | Historique de la migration |
| `.env.example` | Modèle de configuration |
| `vite.config.js` | Configuration build (chemin output, proxy API) |
| `backend/services/airtable.js` | Logique de transformation des champs |

---

## 📞 Support

Pour des questions ou problèmes:
1. Lire [SETUP.md](SETUP.md) et [MIGRATION_NOTES.md](MIGRATION_NOTES.md)
2. Vérifier les logs dans la console (backend et frontend)
3. Vérifier la configuration `.env`
4. Consulter la table d'erreurs Airtable API

---

**Version:** 1.0.0 | **Mise à jour:** Avril 2026
