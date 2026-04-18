# ⚡ Quick Start – Démarrage en 5 étapes

Lancez votre application en 5 minutes.

---

## 🎯 Remplaçables

- `project-name` → Nom de votre projet
- `YOUR_BASE_ID` → ID Airtable
- `YOUR_API_TOKEN` → Token API Airtable

---

## 1️⃣ Prérequis

Avoir installé:
- **Node.js 16+** → https://nodejs.org
- **npm** (inclus avec Node.js)
- Un compte **Airtable** → https://airtable.com

Vérifier:
```bash
node --version
npm --version
```

---

## 2️⃣ Créer la structure du projet

```bash
mkdir project-name
cd project-name
```

Copier/télécharger tous les fichiers depuis le repo de templates:
- `package.json`
- `vite.config.js`
- `.env.example`
- `.gitignore`
- Dossiers: `src/`, `backend/`, etc.

---

## 3️⃣ Installer les dépendances

```bash
npm install
```

⏱️ Attendre 2-5 minutes (première fois).

---

## 4️⃣ Configurer Airtable

### 4.1 Obtenir vos identifiants

**a) BASE_ID:**
1. Ouvrir votre base Airtable
2. URL: `airtable.com/appXXXXXXXXXXXXXX/...`
3. Copier `appXXXXXXXXXXXXXX`

**b) TOKEN:**
1. Aller sur https://airtable.com/account/tokens
2. Cliquer "Create token"
3. Donner les permissions:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
4. Copier le token (commence par `pat...`)

### 4.2 Créer le fichier `.env`

À la racine du projet, créer le fichier `.env`:

```
AIRTABLE_BASE_ID=appVOTRE_BASE_ID
AIRTABLE_TABLE=Projets Soumis
AIRTABLE_TOKEN=patVOTRE_TOKEN
PORT=5001
NODE_ENV=development
```

**Remplacer les valeurs!**

### 4.3 Créer la table Airtable

1. Ouvrir votre base Airtable
2. Créer une nouvelle table: **"Projets Soumis"**
3. Ajouter les colonnes:
   - `Nom` (Short text)
   - `Email` (Email)
   - `Date de soumission` (Date)

---

## 5️⃣ Lancer l'application

```bash
npm run dev
```

Vous devriez voir:
```
✅ Serveur lancé sur http://localhost:5001
VITE ready in 234 ms
```

**Ouvrir le navigateur** → http://localhost:5174

---

## ✅ Vérifier que tout fonctionne

- [ ] Page s'affiche
- [ ] Toggle thème (🌙/☀️) fonctionne
- [ ] Navigation entre étapes fonctionne
- [ ] Bouton "Soumettre" envoie les données
- [ ] Airtable reçoit les données (vérifier la table)

---

## 🎨 Personnaliser rapidement

### Changer le titre

Éditer `src/frontend/App.jsx`:
```jsx
<Header theme={theme} toggleTheme={toggleTheme} />
```

Et `src/frontend/components/Header.jsx`:
```jsx
<h1 className="logo">MonApp</h1>
```

### Changer le texte d'accueil

Éditer `src/frontend/components/Hero.jsx`:
```jsx
<h2>Bienvenue sur MonApp</h2>
<p>Ma description</p>
```

### Changer les étapes du formulaire

Éditer les fichiers `src/frontend/components/steps/StepX.jsx`

### Changer les couleurs

Éditer `src/frontend/styles/variables.css`:
```css
:root {
  --primary: #VOTRE_COULEUR;
}
```

---

## 📂 Structure créée

```
project-name/
├── src/frontend/          # React
│   ├── components/        # Boutons, formulaire
│   ├── pages/             # Pages
│   ├── styles/            # CSS
│   └── index.html         # HTML principal
├── backend/               # Express
│   ├── index.js           # Serveur
│   ├── routes/            # Routes API
│   └── services/          # Airtable
├── package.json           # Dépendances
├── vite.config.js         # Vite config
└── .env                   # Variables (à créer)
```

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| `npm: not found` | Installer Node.js: https://nodejs.org |
| `Cannot find module 'react'` | Relancer `npm install` |
| `Port 5001 already in use` | Changer PORT dans `.env` |
| `Airtable error` | Vérifier `.env` (token, BASE_ID) |
| Frontend ne s'affiche pas | Vérifier que Vite sur port 5174 |
| Les données ne vont pas dans Airtable | Vérifier que la table existe et s'appelle "Projets Soumis" |

---

## 🚀 Prochaines étapes

### Développement avancé

1. Ajouter plus d'étapes → [2-FRONTEND_REACT_TEMPLATE.md](2-FRONTEND_REACT_TEMPLATE.md)
2. Personnaliser le backend → [3-BACKEND_NODE_EXPRESS_TEMPLATE.md](3-BACKEND_NODE_EXPRESS_TEMPLATE.md)
3. Appliquer le design → [1-DESIGN_SYSTEM.md](1-DESIGN_SYSTEM.md)

### Déploiement

1. Préparer pour production → [5-DEPLOYMENT_DOCKER.md](5-DEPLOYMENT_DOCKER.md)
2. Déployer sur Heroku, Railway ou Docker
3. Configurer un domaine personnalisé

---

## 📚 Documents complets

- **[1-DESIGN_SYSTEM.md](1-DESIGN_SYSTEM.md)** – Design réutilisable (colors, spacing, composants)
- **[2-FRONTEND_REACT_TEMPLATE.md](2-FRONTEND_REACT_TEMPLATE.md)** – Template React complet
- **[3-BACKEND_NODE_EXPRESS_TEMPLATE.md](3-BACKEND_NODE_EXPRESS_TEMPLATE.md)** – Template Express complet
- **[5-DEPLOYMENT_DOCKER.md](5-DEPLOYMENT_DOCKER.md)** – Docker et déploiement

---

**Bonne création! 🚀**

