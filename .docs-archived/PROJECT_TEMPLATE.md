    # 📋 Template Réutilisable – Application React + Node.js

Ce template vous permet de créer rapidement une application avec la même architecture, design et structure que SynapFlows.

---

## 🎯 Avant de commencer

**Remplacez les valeurs suivantes partout dans ce guide:**
- `PROJECT_NAME` → Nom de votre projet (ex: `MyCoolApp`)
- `project-name` → Nom en minuscules/tirets (ex: `my-cool-app`)
- `PROJECT_DESCRIPTION` → Courte description
- `YOUR_BASE_ID` → ID de votre base Airtable
- `YOUR_API_TOKEN` → Token API Airtable

---

## 📁 Étape 1: Créer la structure de base

### 1.1 Créer le dossier du projet

```bash
mkdir project-name
cd project-name
```

### 1.2 Initialiser Git (optionnel)

```bash
git init
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
echo "public/assets/" >> .gitignore
```

---

## 📦 Étape 2: Configuration des fichiers racine

### 2.1 Créer `package.json`

À la racine du projet, créer `package.json`:

```json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "PROJECT_DESCRIPTION",
  "type": "module",
  "main": "backend/index.js",
  "scripts": {
    "dev": "concurrently \"vite --host\" \"npm run server:dev\"",
    "server:dev": "node backend/index.js",
    "build": "vite build",
    "preview": "vite preview",
    "start": "npm run build && npm run server:dev"
  },
  "keywords": ["app", "form", "airtable"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "concurrently": "^9.2.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vite": "^8.0.6"
  }
}
```

### 2.2 Créer `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'src/frontend',
  build: {
    outDir: '../../public',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
```

### 2.3 Créer `.env.example`

```
AIRTABLE_BASE_ID=YOUR_BASE_ID
AIRTABLE_TABLE=Projets Soumis
AIRTABLE_TOKEN=YOUR_API_TOKEN
PORT=5001
NODE_ENV=development
```

### 2.4 Créer `.gitignore`

```
node_modules/
.env
dist/
public/assets/
.DS_Store
*.log
build/
```

---

## 🗂️ Étape 3: Structure des dossiers

Créer la hiérarchie suivante:

```bash
# Frontend
mkdir -p src/frontend/components/steps
mkdir -p src/frontend/pages
mkdir -p src/frontend/styles
mkdir -p src/frontend/public/assets/images

# Backend
mkdir -p backend/routes
mkdir -p backend/services

# Output
mkdir -p public
```

---

## 💻 Étape 4: Frontend (React + Vite)

### 4.1 Fichier principal: `src/frontend/index.html`

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PROJECT_NAME</title>
    <link rel="icon" href="/assets/images/favicon.png">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/index.jsx"></script>
</body>
</html>
```

### 4.2 Point d'entrée React: `src/frontend/index.jsx`

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 4.3 Composant principal: `src/frontend/App.jsx`

```jsx
import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import FormPage from './pages/FormPage'
import Footer from './components/Footer'

function App() {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`app ${theme}`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <FormPage />
      <Footer />
    </div>
  )
}

export default App
```

### 4.4 Composants de base

#### `src/frontend/components/Header.jsx`
```jsx
export default function Header({ theme, toggleTheme }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">PROJECT_NAME</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}
```

#### `src/frontend/components/Hero.jsx`
```jsx
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h2>Bienvenue sur PROJECT_NAME</h2>
        <p>PROJECT_DESCRIPTION</p>
      </div>
    </section>
  )
}
```

#### `src/frontend/components/Progress.jsx`
```jsx
export default function Progress({ current, total }) {
  const percentage = (current / total) * 100
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      </div>
      <p className="progress-text">Étape {current} sur {total}</p>
    </div>
  )
}
```

#### `src/frontend/components/Form.jsx`
```jsx
import Progress from './Progress'

export default function Form({ steps, currentStep, onNext, onPrev, onSubmit }) {
  const CurrentStep = steps[currentStep]
  
  return (
    <div className="form-container">
      <Progress current={currentStep + 1} total={steps.length} />
      
      <form className="form">
        <CurrentStep />
        
        <div className="form-buttons">
          {currentStep > 0 && (
            <button type="button" onClick={onPrev} className="btn btn-secondary">
              ← Précédent
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={onNext} className="btn btn-primary">
              Suivant →
            </button>
          ) : (
            <button type="submit" onClick={onSubmit} className="btn btn-success">
              ✓ Soumettre
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
```

#### `src/frontend/components/SuccessScreen.jsx`
```jsx
export default function SuccessScreen() {
  return (
    <div className="success-screen">
      <h2>✓ Soumission réussie!</h2>
      <p>Merci pour votre participation.</p>
      <button onClick={() => window.location.reload()} className="btn btn-primary">
        Commencer une nouvelle soumission
      </button>
    </div>
  )
}
```

#### `src/frontend/components/Footer.jsx`
```jsx
export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2026 PROJECT_NAME. Tous droits réservés.</p>
    </footer>
  )
}
```

### 4.5 Étapes du formulaire

Créer 6 fichiers dans `src/frontend/components/steps/`:

#### `Step1.jsx` - Contact
```jsx
export default function Step1() {
  return (
    <div className="step">
      <h3>Étape 1 - Vos coordonnées</h3>
      <input type="text" placeholder="Nom complet" required />
      <input type="email" placeholder="Email" required />
      <input type="tel" placeholder="Téléphone" required />
    </div>
  )
}
```

#### `Step2.jsx` - Description
```jsx
export default function Step2() {
  return (
    <div className="step">
      <h3>Étape 2 - Description du projet</h3>
      <textarea placeholder="Décrivez votre projet..." required></textarea>
      <input type="text" placeholder="Durée estimée" required />
    </div>
  )
}
```

#### `Step3.jsx` - Fonctionnalités
```jsx
export default function Step3() {
  return (
    <div className="step">
      <h3>Étape 3 - Fonctionnalités</h3>
      <label>
        <input type="checkbox" /> Fonctionnalité 1
      </label>
      <label>
        <input type="checkbox" /> Fonctionnalité 2
      </label>
      <label>
        <input type="checkbox" /> Fonctionnalité 3
      </label>
    </div>
  )
}
```

#### `Step4.jsx` - Utilisateurs & données
```jsx
export default function Step4() {
  return (
    <div className="step">
      <h3>Étape 4 - Utilisateurs et données</h3>
      <input type="number" placeholder="Nombre d'utilisateurs estimé" required />
      <input type="number" placeholder="Volume de données (GB)" required />
    </div>
  )
}
```

#### `Step5.jsx` - Design & intégrations
```jsx
export default function Step5() {
  return (
    <div className="step">
      <h3>Étape 5 - Design et intégrations</h3>
      <input type="text" placeholder="Outils à intégrer" required />
      <textarea placeholder="Détails du design souhaité..."></textarea>
    </div>
  )
}
```

#### `Step6.jsx` - Budget & délai
```jsx
export default function Step6() {
  return (
    <div className="step">
      <h3>Étape 6 - Budget et délai</h3>
      <input type="number" placeholder="Budget (€)" required />
      <input type="date" required />
    </div>
  )
}
```

### 4.6 Page principale: `src/frontend/pages/FormPage.jsx`

```jsx
import React, { useState } from 'react'
import Form from '../components/Form'
import SuccessScreen from '../components/SuccessScreen'
import Step1 from '../components/steps/Step1'
import Step2 from '../components/steps/Step2'
import Step3 from '../components/steps/Step3'
import Step4 from '../components/steps/Step4'
import Step5 from '../components/steps/Step5'
import Step6 from '../components/steps/Step6'

const steps = [Step1, Step2, Step3, Step4, Step5, Step6]

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({})

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  if (submitted) {
    return <SuccessScreen />
  }

  return (
    <Form
      steps={steps}
      currentStep={currentStep}
      onNext={handleNext}
      onPrev={handlePrev}
      onSubmit={handleSubmit}
    />
  )
}
```

### 4.7 Styles CSS

#### `src/frontend/styles/variables.css`
```css
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  
  --text-dark: #1f2937;
  --text-light: #f9fafb;
  --bg-dark: #111827;
  --bg-light: #ffffff;
  
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  --radius: 8px;
  --shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.app.dark {
  --text-primary: var(--text-light);
  --bg-primary: var(--bg-dark);
}

.app.light {
  --text-primary: var(--text-dark);
  --bg-primary: var(--bg-light);
}
```

#### `src/frontend/styles/base.css`
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  transition: background-color 0.3s, color 0.3s;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  border-radius: var(--radius);
  transition: all 0.2s;
}

input, textarea, select {
  font-family: inherit;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius);
  padding: var(--spacing-md);
  font-size: 1rem;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
```

#### `src/frontend/styles/layout.css`
```css
.header {
  background-color: var(--primary);
  color: white;
  padding: var(--spacing-lg);
  box-shadow: var(--shadow);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.theme-toggle {
  background: rgba(255,255,255,0.2);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 1.2rem;
}

.theme-toggle:hover {
  background: rgba(255,255,255,0.3);
}

.hero {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: var(--spacing-xl);
  text-align: center;
}

.hero-content h2 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.hero-content p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.footer {
  background-color: #f3f4f6;
  text-align: center;
  padding: var(--spacing-xl);
  margin-top: var(--spacing-xl);
  border-top: 1px solid #e5e7eb;
}

.app.dark .footer {
  background-color: #1f2937;
  border-top-color: #374151;
}
```

#### `src/frontend/styles/forms.css`
```css
.form-container {
  max-width: 600px;
  margin: var(--spacing-xl) auto;
  padding: var(--spacing-xl);
  background: var(--bg-primary);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.progress-container {
  margin-bottom: var(--spacing-lg);
}

.progress-bar {
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary);
  transition: width 0.3s;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: var(--spacing-sm);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.step {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.step h3 {
  color: var(--primary);
  margin-bottom: var(--spacing-md);
}

.form-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: space-between;
  margin-top: var(--spacing-lg);
}

.btn {
  padding: var(--spacing-md) var(--spacing-lg);
  font-weight: 600;
  border-radius: var(--radius);
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.btn-secondary {
  background-color: #e5e7eb;
  color: var(--text-primary);
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-success {
  background-color: var(--success);
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}

.success-screen {
  max-width: 600px;
  margin: var(--spacing-xl) auto;
  padding: var(--spacing-xl);
  text-align: center;
  background: var(--bg-primary);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.success-screen h2 {
  color: var(--success);
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
}

label {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  cursor: pointer;
}

label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
```

#### `src/frontend/styles/index.css`
```css
@import './variables.css';
@import './base.css';
@import './layout.css';
@import './forms.css';
```

---

## ⚙️ Étape 5: Backend (Express + Airtable)

### 5.1 Fichier serveur: `backend/index.js`

```javascript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import submitRoute from './routes/submit.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

// Routes API
app.use('/api', submitRoute)

// Servir les fichiers statiques (frontend builté)
app.use(express.static('public'))

// Page d'accueil
app.get('/', (req, res) => {
  res.sendFile('public/index.html')
})

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`)
})
```

### 5.2 Service Airtable: `backend/services/airtable.js`

```javascript
export async function submitToAirtable(data) {
  const { AIRTABLE_BASE_ID, AIRTABLE_TABLE, AIRTABLE_TOKEN } = process.env

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            'Nom': data.name || '',
            'Email': data.email || '',
            'Description': data.description || '',
            'Date de soumission': new Date().toISOString().split('T')[0],
            ...data
          }
        }
      ]
    })
  })

  if (!response.ok) {
    throw new Error(`Airtable error: ${response.statusText}`)
  }

  return response.json()
}
```

### 5.3 Route API: `backend/routes/submit.js`

```javascript
import express from 'express'
import { submitToAirtable } from '../services/airtable.js'

const router = express.Router()

router.post('/submit', async (req, res) => {
  try {
    const result = await submitToAirtable(req.body)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Erreur submission:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
```

---

## 🚀 Étape 6: Installation et lancement

### 6.1 Installer les dépendances

```bash
npm install
```

### 6.2 Créer `.env`

À la racine, créer `.env` (basé sur `.env.example`):

```
AIRTABLE_BASE_ID=YOUR_BASE_ID
AIRTABLE_TABLE=Projets Soumis
AIRTABLE_TOKEN=YOUR_API_TOKEN
PORT=5001
NODE_ENV=development
```

**Comment trouver ces valeurs:**

1. **AIRTABLE_BASE_ID**: 
   - Ouvrir votre base Airtable
   - L'URL contient: `airtable.com/{BASE_ID}/...`
   - Copier la partie `appXXXXXXXXXXXXX`

2. **AIRTABLE_TOKEN**:
   - Aller sur https://airtable.com/account/tokens
   - Cliquer "Create token"
   - Donner permissions: `data.records:read` et `data.records:write`
   - Copier le token (commence par `pat...`)

### 6.3 Créer la table Airtable

1. Aller sur votre base Airtable
2. Créer une nouvelle table appelée: **"Projets Soumis"**
3. Ajouter les colonnes:
   - `Nom` (Short text)
   - `Email` (Email)
   - `Description` (Long text)
   - `Date de soumission` (Date)

### 6.4 Lancer en développement

```bash
npm run dev
```

Vous devriez voir:
```
VITE ready in ... ms
✅ Serveur lancé sur http://localhost:5001
```

Ouvrir: **http://localhost:5174** (port Vite)

---

## 🐳 Étape 7 (Optionnel): Docker

### 7.1 Créer `Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "server:dev"]
```

### 7.2 Créer `docker-compose.yml`

```yaml
services:
  app:
    build: .
    container_name: project-name
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - NODE_ENV=production
      - PORT=5000
    ports:
      - "5000:5000"
```

### 7.3 Lancer avec Docker

```bash
docker-compose up -d
```

---

## 📝 Checklist de personnalisation

Avant de lancer votre projet, vérifier que vous avez:

- [ ] Remplacé `PROJECT_NAME` par votre nom de projet
- [ ] Remplacé `project-name` par le nom en minuscules
- [ ] Créé les 6 étapes du formulaire personnalisées
- [ ] Configuré `.env` avec vos identifiants Airtable
- [ ] Créé la table Airtable correspondante
- [ ] Personnalisé les couleurs dans `variables.css`
- [ ] Ajouté votre logo/favicon dans `src/frontend/public/assets/images/`
- [ ] Modifié le texte du Hero et Footer
- [ ] Testé localement avec `npm run dev`

---

## 🎨 Personnalisation avancée

### Modifier les couleurs (Design token)

Éditer `src/frontend/styles/variables.css`:

```css
:root {
  --primary: #6366f1;        /* Couleur principale */
  --secondary: #8b5cf6;      /* Couleur secondaire */
  --success: #10b981;        /* Couleur succès */
}
```

### Ajouter des champs Airtable

1. Dans `backend/services/airtable.js`, ajouter les champs:
```javascript
fields: {
  'Nom': data.name,
  'VotreChamp': data.votreChamp,  // ← Ajouter ici
}
```

2. Dans Airtable, créer la colonne correspondante

### Modifier les étapes du formulaire

Éditer les fichiers `src/frontend/components/steps/StepX.jsx` pour ajouter/modifier les champs.

---

## 🐛 Dépannage

| Problème | Solution |
|----------|----------|
| `Cannot find module 'react'` | Lancer `npm install` |
| Erreur Airtable lors du submit | Vérifier `.env` (token, BASE_ID) |
| Port 5001 déjà utilisé | Changer `PORT` dans `.env` |
| Frontend n'apparaît pas | Vérifier que Vite tourne sur `http://localhost:5174` |
| Styles ne s'appliquent pas | Vérifier `src/frontend/styles/index.css` imports tout |

---

## 📚 Ressources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Express Docs](https://expressjs.com)
- [Airtable API](https://airtable.com/api)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## 🎉 Prochaines étapes

Une fois votre projet en production:

1. Déployer sur **Vercel**, **Heroku**, **Railway**, ou **Docker**
2. Configurer un **domaine** personnalisé
3. Ajouter l'**authentification** utilisateur (optionnel)
4. Mettre en place le **monitoring** et **logs**
5. Configurer les **webhooks Airtable** (optionnel)

---

**Bonne création! 🚀**
