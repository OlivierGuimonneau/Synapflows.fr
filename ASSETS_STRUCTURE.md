# 🖼️ Structure des Assets – Images & Fichiers Statiques

Document explicatif sur l'organisation des images et fichiers statiques dans SynapFlows.

---

## 📁 Vue d'ensemble

```
SynapFlows-ProjectSubmission/
│
├── src/frontend/
│   └── public/                    ← SOURCE (développement)
│       └── assets/
│           └── images/
│               ├── favicon.png
│               └── logo-synapflows.png
│
└── public/                        ← BUILD OUTPUT (production)
    └── assets/
        └── images/
            ├── favicon.png
            └── logo-synapflows.png
```

---

## 📝 Explication détaillée

### 1. **Source des assets** (`src/frontend/public/`)

C'est où vous **mettez vos images en développement**.

**Localisation:**
```
d:\SynapFlows-ProjectSubmission\src\frontend\public\assets\images\
```

**Fichiers:**
- `favicon.png` - Favicon pour le browser tab (32×32px)
- `logo-synapflows.png` - Logo de l'en-tête (48px hauteur recommandée)

**Format:**
- PNG avec transparence et compression optimale
- Favicon: format carré (32×32px minimum)
- Logo: format PNG pour meilleure qualité

### 2. **Accès en développement**

Quand vous lancez `npm run dev`, Vite sert les fichiers depuis `src/frontend/public/` automatiquement.

**Chemin d'accès dans le code React:**
```jsx
// Dans src/frontend/components/Header.jsx
<img src="/assets/images/logo-synapflows.png" alt="Logo" />
```

**Comment ça marche:**
1. Vous lancez: `npm run dev`
2. Vite demarre sur `http://localhost:5174`
3. Depuis Vite, le chemin `/assets/...` pointe vers `src/frontend/public/assets/...`

### 3. **Build output** (`public/`)

Quand vous exécutez `npm run build`, Vite:
1. Compile le code React
2. **Copie** le contenu de `src/frontend/public/` dans `public/`
3. Génère un dossier `public/assets/images/` avec vos fichiers

**Configuration:** (voir `vite.config.js`)
```javascript
export default {
  root: 'src/frontend',           // ← Source
  build: {
    outDir: '../../public',       // ← Destination du build
  }
}
```

### 4. **Production**

En production (après `npm run build` + `npm start`):

1. L'Express backend sert les fichiers statiques depuis `public/`
2. L'URL reste la même: `/assets/images/logo-synapflows.png`
3. Le navigateur reçoit l'image optimisée depuis le dossier `public/`

```bash
# Après npm run build:
public/
└── assets/
    └── images/
        ├── logo-synapflows.png      ← Servi par Express
        └── Icone_Synapflows.png     ← Servi par Express
```

---

## 🔄 Flux complet d'une image

### Cycle de vie d'une image

```
1. Vous créez/modifiez l'image
2. Vous la mettez dans: src/frontend/public/assets/images/
3. Vous la référencez dans le code: <img src="/assets/images/..." />
4. En dev: Vite sert directement depuis src/frontend/public/
5. En build: Vite copie vers public/assets/
6. En production: Express sert depuis public/
```

### Exemple pratique

**Ajouter un nouveau logo:**

1. Créez votre fichier PNG: `mon-logo.png`
2. Mettez-le ici:
   ```
   src/frontend/public/assets/images/mon-logo.png
   ```
3. Utilisez-le dans React:
   ```jsx
   <img src="/assets/images/mon-logo.png" alt="Mon logo" />
   ```
4. Testez en dev: `npm run dev`
5. Build: `npm run build`
6. Vérifiez que le fichier est dans `public/assets/images/mon-logo.png`

---

## 🛠️ Gestion des assets

### Ajouter une nouvelle image

```bash
# 1. Placer le fichier dans
src/frontend/public/assets/images/

# 2. Utiliser dans le code React
<img src="/assets/images/mon-fichier.png" alt="Description" />

# 3. Relancer le dev si nécessaire
npm run dev
```

### Supprimer une image

```bash
# 1. Supprimer le fichier source
rm src/frontend/public/assets/images/ancien-fichier.png

# 2. Supprimer les références du code React
# Chercher "/assets/images/ancien-fichier.png" et supprimer

# 3. Relancer le dev
npm run dev
```

### Organiser les assets par catégorie (optionnel)

Vous pouvez créer des sous-dossiers:

```
src/frontend/public/assets/
├── images/
│   ├── logos/
│   │   ├── logo-synapflows.png
│   │   └── logo-secondary.png
│   ├── icons/
│   │   └── favicon.png
│   └── backgrounds/
│       └── pattern.png
└── fonts/
    └── inter.woff2
```

Utilisation:
```jsx
<img src="/assets/images/logos/logo-synapflows.png" alt="Logo" />
```

---

## 📦 Intégration Vite

### Configuration du build

**File:** `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'src/frontend',        // Racine du frontend
  build: {
    outDir: '../../public',    // Sortie du build
    emptyOutDir: true,         // Vider avant rebuild
  }
})
```

**Comportement:**
- `root: 'src/frontend'` → Vite cherche `public/` à partir de là
- Donc: `src/frontend/public/assets/` est la source
- `build.outDir` → Les fichiers vont dans `/public` (racine du projet)

---

## 🔐 Ne pas commiter les assets générés

Votre `.gitignore` contient déjà:

```
public/              # ← Jamais commiter le build output
node_modules/        # ← Jamais commiter les packages
```

**Workflow Git recommandé:**
```bash
# Commiter les sources
git add src/frontend/public/assets/images/

# Jamais commiter le build
git add public/  # ❌ NON!  (déjà dans .gitignore)
```

---

## 💡 Bonnes pratiques

✅ **À faire:**
- Optimiser les images avant de les ajouter (compresser avec TinyPNG, ImageOptim)
- Utiliser des formats modernes: PNG, WebP
- Donner des noms explicites: `logo-synapflows.png` (pas `image1.png`)
- Organiser par catégorie dans des sous-dossiers

❌ **Avoid:**
- Images trop lourdes (>1MB)
- Formats obsolètes (BMP, TIF)
- Chemins absolus dans le code (`file://C:/...`)
- Références directes au dossier `public/` en front (utiliser `/assets/...`)

---

## 🚀 Workflow typique

### 1. Développement

```bash
# Lancer le dev
npm run dev

# Modifier/ajouter une image dans:
src/frontend/public/assets/images/

# Vite recharge automatiquement
# Les changements apparaissent immédiatement
```

### 2. Build

```bash
# Compiler le tout
npm run build

# Vérifier que public/ contient les images
ls public/assets/images/
```

### 3. Production

```bash
# Lancer le serveur de production
npm start

# Express sert automatiquement depuis public/
# Les images sont disponibles à http://localhost:5001/assets/images/...
```

---

## 📞 Questions fréquentes

### Q: Où placer une image?
**R:** `src/frontend/public/assets/images/`

### Q: Comment y accéder en React?
**R:** `<img src="/assets/images/mon-image.png" alt="Desc" />`

### Q: Les images sont-elles optimisées en build?
**R:** Vite les copie tel-quel. Optimisez-les vous-même avant upload.

### Q: Puis-je avoir des sous-dossiers?
**R:** Oui! Créez `src/frontend/public/assets/images/dossier/mon-image.png` et accédez via `/assets/images/dossier/mon-image.png`

### Q: Pourquoi deux dossiers publics?
**R:** 
- `src/frontend/public/` = source en dev
- `public/` = sortie du build en production
- C'est le workflow standard Vite pour une meilleure organisation

---

**Version:** 1.0.0 | **Mise à jour:** Avril 2026
