# 🚀 SynapFlows.fr – Site Corporate & Landing Page

Bienvenue sur **www.synapflows.fr**, le site corporate et landing page de SynapFlows.

Nous spécialisamos dans **l'automatisation des processus métier** et la **création d'applications spécifiques**.

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

## � Résumé

| Aspect | Détail |
|--------|--------|
| **Domaine** | www.synapflows.fr |
| **Type** | Site corporate multi-page + landing page de qualification |
| **Frontend** | React 18.2 + Vite 7 + React Router |
| **Backend** | Node.js + Express |
| **Base de données** | Airtable (table `Projets Soumis`) |
| **Sécurité** | reCAPTCHA v3 + RGPD by design |
| **Déploiement** | Docker sur VPS IONOS 82.165.251.91 |
| **CI/CD** | GitHub Actions → SSH → Docker Compose |

---

## 🛠️ Pages & Features

### Accueil (`/`)
- Hero section + promesse de valeur
- 5 services : Automatisation, Applications Web, Intégration, Audit, Maintenance
- Section valeur : 30 ans exp + dev rapide + hébergement France
- CTA : Démo + Qualifier mon projet

### Formulaire (`/formulaire-qualification`)
- Multi-étape pour qualification
- reCAPTCHA v3 (vérification serveur)
- Enregistrement dans Airtable

---

## 🚀 Démarrage local

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```
- Frontend : http://localhost:5173
- Backend : http://localhost:5001
- Proxy : `/api` → http://localhost:5001

### Build
```bash
npm run build
```

---

## 📁 Structure

```
src/
├── frontend/
│   ├── pages/
│   │   ├── HomePage.jsx       ← Accueil
│   │   └── FormPage.jsx       ← Formulaire
│   ├── components/
│   │   ├── Header.jsx         ← Navigation
│   │   ├── Footer.jsx
│   │   ├── Form.jsx
│   │   ├── Hero.jsx
│   │   └── steps/             ← Étapes formulaire
│   └── styles/
│       ├── variables.css      ← Design tokens
│       ├── homepage.css
│       ├── forms.css
│       └── ...

backend/
├── index.js                   ← Serveur Express
├── routes/
│   └── submit.js              ← POST /api/submit
└── services/
    └── airtable.js            ← Intégration Airtable

docker-compose.yml            ← Production
Dockerfile
```

---

## 🔐 Sécurité & RGPD

✅ reCAPTCHA v3 (validation serveur)  
✅ CORS restrictif  
✅ Headers HTTP sécurisés (CSP, HSTS, X-Frame-Options)  
✅ RGPD by design (minimisation données)  
✅ Secrets en GitHub Actions  
✅ Rate limiting

---

## 📝 Variables d'environnement

```env
PORT=5000
NODE_ENV=production

# Airtable
AIRTABLE_BASE_ID=appvGEsLWrImfUU9i
AIRTABLE_PROJETS_SOUMIS=Projets Soumis
AIRTABLE_TOKEN=patt***

# reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=6Lc***
RECAPTCHA_SITE_KEY=6Lc***
RECAPTCHA_ENTERPRISE_API_KEY=AIza***
```

---

## 📦 Déploiement

**VPS**
- IP: 82.165.251.91
- Port: 5000 (interne) → 80/443 via Traefik
- Réseau: `n8n-https_default`
- Labels: `synapflows-www-*`

**CI/CD**
```
git push main
  ↓
GitHub Actions (.github/workflows/deploy.yml)
  ↓
SSH déploiement
  ↓
docker compose build/up
```

---

## 📚 Documentation

| Lien | Contenu |
|------|---------|
| `.github/copilot-instructions.md` | Architecture & conventions |
| `.github/instructions/` | Règles sécurité, frontend, backend |
| `.github/skills/` | Bonnes pratiques |
| `.docs-archived/README.md` | Fichiers obsolètes |

---

**Version:** 2.0.0 (SynapFlows Corporate Site)  
**Maintainers:** SynapFlows Team  
**License:** Propriétaire
