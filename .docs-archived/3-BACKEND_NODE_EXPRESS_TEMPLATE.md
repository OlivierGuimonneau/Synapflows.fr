# ⚙️ Backend Template – Node.js + Express + Airtable

Template complet pour le backend. Utilisez ce fichier **si vous développez en Node.js/Express**.

---

## 🎯 Remplaçables

- `project-name` → Nom du projet en minuscules
- `YOUR_BASE_ID` → ID Airtable
- `YOUR_API_TOKEN` → Token API Airtable
- `YOUR_TABLE_NAME` → Nom de la table Airtable

---

## 📦 Configuration

### Dépendances npm

```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2"
  }
}
```

### Fichier `.env`

Créer à la racine du projet:

```
AIRTABLE_BASE_ID=YOUR_BASE_ID
AIRTABLE_TABLE=YOUR_TABLE_NAME
AIRTABLE_TOKEN=YOUR_API_TOKEN
PORT=5001
NODE_ENV=development
```

---

## 🗂️ Structure des dossiers

```bash
mkdir -p backend/routes
mkdir -p backend/services
```

Résultat:
```
backend/
  ├── index.js              # Serveur principal
  ├── routes/
  │   └── submit.js         # Route POST /api/submit
  └── services/
      └── airtable.js       # Intégration Airtable
```

---

## 🚀 Serveur principal

### `backend/index.js`

```javascript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import submitRoute from './routes/submit.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(express.json())

// Routes API
app.use('/api', submitRoute)

// Servir les fichiers statiques (frontend builté)
app.use(express.static('public'))

// Fallback pour SPA (redirige vers index.html)
app.get('*', (req, res) => {
  res.sendFile('public/index.html')
})

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`)
})
```

---

## 🔌 Service Airtable

### `backend/services/airtable.js`

```javascript
export async function submitToAirtable(data) {
  const { AIRTABLE_BASE_ID, AIRTABLE_TABLE, AIRTABLE_TOKEN } = process.env

  if (!AIRTABLE_BASE_ID || !AIRTABLE_TABLE || !AIRTABLE_TOKEN) {
    throw new Error('Configuration Airtable manquante dans .env')
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`

  const fields = {
    ...data,
    'Date de soumission': new Date().toISOString().split('T')[0]
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      records: [{ fields }]
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Airtable error: ${JSON.stringify(error)}`)
  }

  return response.json()
}
```

---

## 📮 Route API

### `backend/routes/submit.js`

```javascript
import express from 'express'
import { submitToAirtable } from '../services/airtable.js'

const router = express.Router()

router.post('/submit', async (req, res) => {
  try {
    const result = await submitToAirtable(req.body)
    res.json({ 
      success: true, 
      message: 'Soumission enregistrée',
      data: result 
    })
  } catch (error) {
    console.error('❌ Erreur submission:', error.message)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

export default router
```

---

## 🗄️ Configuration Airtable

### Créer la table

1. Ouvrir votre base Airtable
2. Créer une nouvelle table avec le nom: `YOUR_TABLE_NAME` (respecter la casse)
3. Ajouter les colonnes de base:

| Nom colonne | Type | Notes |
|---|---|---|
| `Nom` | Short text | Optionnel |
| `Email` | Email | Optionnel |
| `Message` | Long text | Optionnel |
| `Date de soumission` | Date | Auto-générée |

**Autres colonnes:** Ajouter les champs nécessaires selon vos besoins

### Obtenir l'ID de base

1. Ouvrir votre base Airtable
2. L'URL ressemble à: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. `appXXXXXXXXXXXXXX` = `AIRTABLE_BASE_ID`

### Créer un token API

1. Aller sur https://airtable.com/account/tokens
2. Cliquer **"Create token"**
3. Donner un nom: `API project-name`
4. Sélectionner les permissions:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
   - ✅ `schema.bases:read`
5. Cliquer **"Create token"**
6. Copier le token immédiatement (n'apparaît qu'une fois)
7. Coller dans `.env` → `AIRTABLE_TOKEN`

---

## 📝 Personnalisation

### Ajouter un nouveau champ

**Dans le frontend** (`2-FRONTEND_REACT_TEMPLATE.md`):
- Ajouter un input dans une étape

**Dans le backend** (`backend/services/airtable.js`):
```javascript
const fields = {
  'Nom': data.name,
  'Email': data.email,
  'VotreNouveauChamp': data.votreChamp,  // ← Ajouter
  'Date de soumission': new Date().toISOString().split('T')[0]
}
```

**Dans Airtable:**
- Créer une nouvelle colonne avec le même nom

### Valider les données

```javascript
// Dans backend/routes/submit.js, avant submitToAirtable()
if (!req.body.email) {
  return res.status(400).json({ error: 'Email requis' })
}
```

### Ajouter une authentification simple

```javascript
// Dans backend/index.js
app.use((req, res, next) => {
  const token = req.headers['x-api-key']
  if (token !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
})
```

### Logger les soumissions

```javascript
// Dans backend/routes/submit.js
console.log('📨 Nouvelle soumission:', {
  timestamp: new Date().toISOString(),
  data: req.body
})
```

---

## 🧪 Tester l'API

### Avec cURL

```bash
curl -X POST http://localhost:5001/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "message": "Ceci est un test"
  }'
```

### Avec Postman

1. Créer une nouvelle requête POST
2. URL: `http://localhost:5001/api/submit`
3. Headers: `Content-Type: application/json`
4. Body (JSON):
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "message": "Test"
}
```

---

## 🐛 Dépannage

| Problème | Solution |
|----------|----------|
| `Cannot POST /api/submit` | Vérifier que Express tourne et la route existe |
| `Airtable error` | Vérifier `.env` (BASE_ID, TOKEN valides) |
| `401 Unauthorized` | Token API expiré ou permissions insuffisantes |
| Port déjà utilisé | Changer `PORT` dans `.env` |
| CORS error | Vérifier que `cors()` est activé |

---

## 📚 Ressources

- [Express Documentation](https://expressjs.com)
- [Airtable API](https://airtable.com/api)
- [Fetch API (Node 18+)](https://nodejs.org/en/docs/guides/fetch-api/)
- [dotenv](https://github.com/motdotla/dotenv)

---

## 🚀 Commandes

```bash
# Installation
npm install

# Développement
npm run server:dev

# Build + Run production
npm run start
```

---

**Voir aussi:**
- [1-DESIGN_SYSTEM.md](1-DESIGN_SYSTEM.md) – Design réutilisable
- [2-FRONTEND_REACT_TEMPLATE.md](2-FRONTEND_REACT_TEMPLATE.md) – Frontend React
- [4-QUICK_START.md](4-QUICK_START.md) – Guide rapide de démarrage

