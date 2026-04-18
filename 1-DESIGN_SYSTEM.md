# 🎨 Design System – Réutilisable pour tous les frameworks

Ce fichier contient le système de design et les principes visuels **indépendants de tout framework**. 
Utilisez-le avec React, Angular, Vue, PHP/Blade, Python/Django, ou n'importe quel autre technologie.

---

## 📌 Architecture générale

```
APPLICATION
│
├── Header (logo + theme toggle)
├── Hero (section accueil)
├── Main Content (formulaire ou autre)
└── Footer
```

---

## 🎯 Design Tokens (Variables de design)

Ces variables s'appliquent à **tous les projets**. Adaptez-les selon vos besoins.

### Couleurs

```
Primaire:      #6366f1  (Indigo)
Secondaire:    #8b5cf6  (Violet)
Succès:        #10b981  (Vert)
Danger:        #ef4444  (Rouge)
Warning:       #f59e0b  (Orange)

Texte clair:   #1f2937  (Gris très foncé)
Texte clair:   #f9fafb  (Blanc cassé)
Bg clair:      #ffffff  (Blanc)
Bg foncé:      #111827  (Noir profond)

Neutres:
  Border:      #e5e7eb  (Gris clair)
  Bg neutro:   #f3f4f6  (Gris très clair)
  Text neutro: #6b7280  (Gris moyen)
```

### Espacement (Système de 8px)

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
```

### Typographie

```
Font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif

Tailles:
  Petit:    0.875rem (14px)
  Normal:   1rem (16px)
  Grand:    1.2rem (19px)
  XL:       1.5rem (24px)
  XXL:      2.5rem (40px)

Poids:
  Régulier: 400
  Semi-bold: 600
  Bold:     700
```

### Effets visuels

```
Border-radius: 8px
Shadow:        0 4px 6px rgba(0,0,0,0.1)
Transitions:   0.2s à 0.3s (ease-in-out)
```

---

## 🌓 Thème Light/Dark

### Mode Clair (défaut)
- Texte: `--text-dark` (#1f2937)
- Fond: `--bg-light` (#ffffff)

### Mode Sombre
- Texte: `--text-light` (#f9fafb)
- Fond: `--bg-dark` (#111827)

**Implémentation:**
```
Ajouter une classe `.dark` ou `.light` au body ou app
Tous les éléments utilisent les variables CSS (ex: color: var(--text-primary))
Un toggle permet de changer facilement de thème
```

---

## 📐 Composants UI Standards

### Boutons

#### Type: Primaire
```
- Arrière-plan: Couleur primaire (#6366f1)
- Texte: Blanc
- Padding: 16px 24px
- Border-radius: 8px
- Hover: Couleur plus foncée (#4f46e5) + petite ombre + translate Y-2px
- Transition: 0.2s
```

#### Type: Secondaire
```
- Arrière-plan: Gris clair (#e5e7eb)
- Texte: Couleur texte primaire
- Padding: 16px 24px
- Hover: Gris plus foncé (#d1d5db)
```

#### Type: Succès
```
- Arrière-plan: Vert (#10b981)
- Texte: Blanc
- Padding: 16px 24px
- Hover: Vert plus foncé (#059669)
```

### Inputs (Text, Email, Textarea, Select)

```
- Border: 1px solid #e5e7eb
- Padding: 16px
- Border-radius: 8px
- Font-family: inherit
- Font-size: 1rem

Focus:
  - Border color: Couleur primaire
  - Box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1)
  - Outline: none
```

### Barre de progression

```
Conteneur:
  - Hauteur: 6px
  - Fond: Gris clair (#e5e7eb)
  - Border-radius: 999px (entièrement arrondi)

Remplissage:
  - Fond: Couleur primaire
  - Transition: width 0.3s
  - Pourcentage: (étape actuelle / total étapes) * 100

Texte:
  - "Étape X sur Y"
  - Font-size: 0.875rem
  - Couleur: Gris moyen
```

### Conteneur de formulaire

```
- Largeur max: 600px
- Margin: 32px auto
- Padding: 32px
- Fond: Couleur de fond primaire
- Border-radius: 8px
- Box-shadow: 0 4px 6px rgba(0,0,0,0.1)
```

### Étape du formulaire

```
Structure:
  <div class="step">
    <h3>Titre étape</h3>
    <input ... />
    <input ... />
    <textarea ... />
  </div>

Titre:
  - Color: Couleur primaire
  - Margin-bottom: 16px

Spacing entre inputs: 16px (gap)
```

### Écran de succès

```
- Centré au milieu du conteneur de formulaire
- Icône: ✓ (peut être 🎉 ou autre)
- Titre: Grande police, couleur succès (#10b981)
- Descriptif: Texte normal
- Bouton: Bouton primaire pour recommencer
```

---

## 🏗️ Sections principales

### Header

```
Arrière-plan: Couleur primaire
Couleur texte: Blanc
Padding: 24px
Box-shadow: 0 4px 6px rgba(0,0,0,0.1)

Layout:
  - Flexbox: space-between
  - Contenu max-width: 1200px
  - Centré horizontalement

Logo:
  - Font-size: 1.5rem
  - Font-weight: bold

Toggle thème:
  - Arrière-plan: rgba(255,255,255,0.2)
  - Couleur: Blanc
  - Padding: 8px 16px
  - Font-size: 1.2rem
  - Hover: rgba(255,255,255,0.3)
```

### Hero

```
Arrière-plan: Gradient linéaire 135deg (primaire → secondaire)
Couleur texte: Blanc
Padding: 32px
Text-align: center

Titre (h2):
  - Font-size: 2.5rem
  - Margin-bottom: 16px

Paragraphe:
  - Font-size: 1.2rem
  - Opacity: 0.9
```

### Footer

```
Mode clair:
  - Arrière-plan: Gris très clair (#f3f4f6)
  - Texte: Gris moyen
  - Border-top: 1px solid #e5e7eb

Mode sombre:
  - Arrière-plan: Gris très foncé (#1f2937)
  - Texte: Blanc cassé
  - Border-top: 1px solid #374151

Padding: 32px
Text-align: center
Margin-top: 32px
```

---

## 📱 Responsive Design

### Breakpoints

```
Mobile (< 640px):
  - Padding des conteneurs: 16px au lieu de 32px
  - Font-size réduit: -10%
  - Buttons: Full-width ou 50% si deux boutons côte-à-côte

Tablet (640px - 1024px):
  - Padding: 24px
  - Layout normal

Desktop (> 1024px):
  - Padding: 32px
  - Max-width des conteneurs: 1200px
```

### Principes

```
- Mobile-first: Commencer par mobile, puis ajouter pour desktop
- Flexbox/Grid: Préférer pour layouts flexibles
- Media queries: @media (min-width: 640px) { ... }
```

---

## ✨ Animations et transitions

```
Transitions standard:
  - Couleur: 0.2s
  - Transforms: 0.2s
  - Opacity: 0.3s

Hover (boutons):
  - Transform: translateY(-2px)
  - Box-shadow: augmenter
  - Opacity: +10%

Focus (inputs):
  - Border-color: changer vers primaire
  - Box-shadow: ajouter une ombre colorée
```

---

## 🎯 Usage dans différents frameworks

### Avec React (CSS-in-JS ou CSS modules)
```jsx
// Utiliser des classes CSS + import '.styles/index.css'
// Ou thème global + CSS variables
```

### Avec Angular
```
// Utiliser des StyleSheets global ou Scoped
// Appliquer le système de variables aux niveaux appropriés
```

### Avec Vue
```vue
<!-- Utiliser scoped styles ou global CSS -->
<style scoped>
  :root { --primary: #6366f1; /* ... */ }
</style>
```

### Avec PHP/Blade
```html
<!-- Inclure une feuille CSS globale -->
<link rel="stylesheet" href="{{ asset('css/design-system.css') }}">
```

### Avec Python/Django
```html
<!-- Inclure une feuille CSS statique -->
<link rel="stylesheet" href="{% static 'css/design-system.css' %}">
```

---

## 📋 Checklist de conformité Design

Avant de livrer, vérifier:

- [ ] Toutes les couleurs utilisent le système de variables
- [ ] L'espacement suit le système d'8px
- [ ] Les transitions sont cohérentes (0.2-0.3s)
- [ ] Le thème light/dark fonctionne
- [ ] Les inputs ont la bonne couleur de focus
- [ ] Les boutons utilisent les bonnes classes (primary, secondary, success)
- [ ] Le Hero et Footer respectent le gradiant/arrière-plan
- [ ] Les breakpoints mobiles sont testés
- [ ] L'accessibilité est respectée (contraste, focus visible, etc.)

---

**Ce design system s'applique à vos prochains projets, peu importe le framework ou le langage backend utilisé.**

