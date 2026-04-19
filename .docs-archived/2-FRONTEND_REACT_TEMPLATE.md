# 💻 Frontend Template – React + Vite

Template complet pour le frontend. Utilisez ce fichier **si vous développez en React**.

---

## 🎯 Remplaçables

- `PROJECT_NAME` → Nom de votre projet
- `PROJECT_DESCRIPTION` → Courte description

---

## 📦 Configuration

### Dépendances npm

```json
{
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vite": "^8.0.6"
  }
}
```

### Fichier `vite.config.js`

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

---

## 🗂️ Structure des dossiers

```bash
mkdir -p src/frontend/components/steps
mkdir -p src/frontend/pages
mkdir -p src/frontend/styles
mkdir -p src/frontend/public/assets/images
```

---

## 📄 Fichiers HTML et entrée

### `src/frontend/index.html`

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

### `src/frontend/index.jsx`

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

---

## 🎯 Composant racine

### `src/frontend/App.jsx`

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

---

## 🧩 Composants réutilisables

Créer le dossier: `src/frontend/components/`

### Header: `Header.jsx`

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

### Hero: `Hero.jsx`

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

### Barre de progression: `Progress.jsx`

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

### Gestionnaire de formulaire: `Form.jsx`

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

### Écran de succès: `SuccessScreen.jsx`

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

### Footer: `Footer.jsx`

```jsx
export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2026 PROJECT_NAME. Tous droits réservés.</p>
    </footer>
  )
}
```

---

## 📋 Étapes du formulaire

Créer le dossier: `src/frontend/components/steps/`

Personaliser chaque étape selon vos besoins.

### `Step1.jsx` – Étape 1 (Exemple: Contact)

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

### `Step2.jsx` – Template générique

```jsx
export default function Step2() {
  return (
    <div className="step">
      <h3>Étape 2 - [Votre titre]</h3>
      <textarea placeholder="Écrivez votre réponse..." required></textarea>
    </div>
  )
}
```

### `Step3.jsx` – Template générique

```jsx
export default function Step3() {
  return (
    <div className="step">
      <h3>Étape 3 - [Votre titre]</h3>
      <label>
        <input type="checkbox" /> Option 1
      </label>
      <label>
        <input type="checkbox" /> Option 2
      </label>
      <label>
        <input type="checkbox" /> Option 3
      </label>
    </div>
  )
}
```

### `Step4.jsx` – Template générique

```jsx
export default function Step4() {
  return (
    <div className="step">
      <h3>Étape 4 - [Votre titre]</h3>
      <input type="text" placeholder="Réponse" required />
    </div>
  )
}
```

### `Step5.jsx` – Template générique

```jsx
export default function Step5() {
  return (
    <div className="step">
      <h3>Étape 5 - [Votre titre]</h3>
      <textarea placeholder="Détails..."></textarea>
    </div>
  )
}
```

### `Step6.jsx` – Template générique

```jsx
export default function Step6() {
  return (
    <div className="step">
      <h3>Étape 6 - [Votre titre]</h3>
      <input type="number" placeholder="Nombre/Montant" required />
      <input type="date" required />
    </div>
  )
}
```

---

## 📄 Page principale du formulaire

### `src/frontend/pages/FormPage.jsx`

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
      } else {
        alert('Erreur lors de la soumission')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur réseau')
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

---

## 🎨 Fichiers de style

Créer le dossier: `src/frontend/styles/`

### `variables.css`

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

### `base.css`

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
  width: 100%;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
```

### `layout.css`

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

### `forms.css`

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
  flex-wrap: wrap;
}

.btn {
  padding: var(--spacing-md) var(--spacing-lg);
  font-weight: 600;
  border-radius: var(--radius);
  font-size: 1rem;
  flex: 1;
  min-width: 120px;
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
  transform: translateY(-2px);
  box-shadow: var(--shadow);
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
  flex-shrink: 0;
}
```

### `index.css` (Point d'entrée)

```css
@import './variables.css';
@import './base.css';
@import './layout.css';
@import './forms.css';
```

---

## 📝 Personnalisation courante

### Ajouter une 7ème étape

1. Créer `Step7.jsx`
2. Importer dans `FormPage.jsx`
3. Ajouter à l'array `steps`

```jsx
import Step7 from '../components/steps/Step7'

const steps = [Step1, Step2, Step3, Step4, Step5, Step6, Step7]
```

### Changer les couleurs

Éditer `variables.css`:

```css
:root {
  --primary: #votre-couleur;
  --secondary: #votre-couleur;
  /* ... */
}
```

### Ajouter un logo personnalisé

1. Mettre une image dans `src/frontend/public/assets/images/logo.png`
2. Utiliser dans `Header.jsx`:

```jsx
<img src="/assets/images/logo.png" alt="Logo" className="logo-img" />
```

---

## 🚀 Commandes

```bash
# Installation
npm install

# Développement (http://localhost:5174)
npm run dev

# Build production
npm run build

# Preview du build
npm run preview
```

---

**Voir aussi** → [1-DESIGN_SYSTEM.md](1-DESIGN_SYSTEM.md) pour les principes de design réutilisables

