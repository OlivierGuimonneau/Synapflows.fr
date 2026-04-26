# Règles de Redirection - www.synapflows.fr

## Vue d'ensemble
Ce document définit les règles de redirection et les gestions d'erreurs pour le site www.synapflows.fr, y compris le reverse proxy Traefik et les redirections Node.js/Express.

## Routes Valides (Pas de redirection)

| Route | Description | Page |
|-------|-------------|------|
| `/` | Accueil | HomePage.jsx |
| `/formulaire-qualification` | Formulaire de qualification de projets | QualificationPage.jsx |
| `/faq` | Foire Aux Questions | FAQPage.jsx |
| `/mentions-legales` | Mentions légales (RGPD, hébergeur, etc.) | LegalPage.jsx |
| `/conditions-generales` | Conditions Générales d'Utilisation | TermsPage.jsx |

## Redirections (301 Permanent - Anciennes URLs)

Pour maintenir la compatibilité avec d'anciennes URLs, ajouter ces redirections au backend Express :

```javascript
// backend/redirects.js
const redirects = [
  { from: '/formulaire', to: '/formulaire-qualification', code: 301 },
  { from: '/contact', to: '/formulaire-qualification', code: 301 },
  { from: '/qualification', to: '/formulaire-qualification', code: 301 },
  { from: '/legal', to: '/mentions-legales', code: 301 },
  { from: '/privacy', to: '/mentions-legales', code: 301 },
  { from: '/terms', to: '/conditions-generales', code: 301 },
  { from: '/cgu', to: '/conditions-generales', code: 301 },
  { from: '/help', to: '/faq', code: 301 },
  { from: '/questions', to: '/faq', code: 301 },
];

module.exports = redirects;
```

### Implémentation dans Express

```javascript
// backend/index.js
const redirects = require('./redirects');

app.get('*', (req, res, next) => {
  const redirect = redirects.find(r => r.from === req.path);
  if (redirect) {
    return res.redirect(redirect.code, redirect.to);
  }
  next();
});
```

## Gestion des Pages Invalides (404)

Toute URL non listée dans les routes valides affiche la page **404 personnalisée** :

**Route catch-all (React Router):**
```javascript
<Route path="*" element={<Page404 />} />
```

La page 404 propose les liens suivants :
- 🏠 Retourner à l'accueil
- ❓ Consulter la FAQ
- 📋 Qualifier mon projet
- 📧 Nous contacter par email

## Redirections HTTP (Traefik/Reverse Proxy)

Si vous utilisez Traefik, ajouter les middlewares de redirection :

```yaml
# docker-compose.yml
labels:
  traefik.http.middlewares.synapflows-www-redirect-contact.redirectregex.regex: "^https?://www.synapflows.fr/contact/?$$"
  traefik.http.middlewares.synapflows-www-redirect-contact.redirectregex.replacement: "https://www.synapflows.fr/formulaire-qualification"
  traefik.http.middlewares.synapflows-www-redirect-contact.redirectregex.permanent: "true"

  traefik.http.middlewares.synapflows-www-redirect-legal.redirectregex.regex: "^https?://www.synapflows.fr/legal/?$$"
  traefik.http.middlewares.synapflows-www-redirect-legal.redirectregex.replacement: "https://www.synapflows.fr/mentions-legales"
  traefik.http.middlewares.synapflows-www-redirect-legal.redirectregex.permanent: "true"

  traefik.http.routers.synapflows-www.middlewares: "synapflows-www-redirect-contact,synapflows-www-redirect-legal"
```

## Flux de Redirection

```
Requête entrante
    ↓
Traefik (HTTP redirects) → Redirection si match
    ↓ Sinon
Express (redirects middleware) → 301 si dans la liste
    ↓ Sinon
React Router
    ├─ Match route valide → Affiche page
    └─ Pas de match → Affiche 404
```

## Cas Particuliers

### Barres obliques finales (Trailing slashes)
Les routes sans barre oblique finale se redirigent automatiquement :
- `/formulaire-qualification` → Acceptée
- `/formulaire-qualification/` → Acceptée (normalisation par Traefik)

Pour forcer la suppression des slashes finales avec Traefik :

```yaml
traefik.http.middlewares.synapflows-www-remove-trailing-slash.redirectregex.regex: "^(https?://[^/]+/.*?)/$"
traefik.http.middlewares.synapflows-www-remove-trailing-slash.redirectregex.replacement: "$${1}"
traefik.http.routers.synapflows-www.middlewares: "synapflows-www-remove-trailing-slash"
```

### URLs avec paramètres de requête invalides
Exemple : `/formulaire-qualification?test=123`
- Query params ignorés → Page s'affiche normalement
- Pas de redirection (Google Analytics, tracking, etc.)

### Accès direct à des assets statiques invalides
Exemple : `/assets/images/non-existent.png`
- Traefik → 404 HTTP
- Pas de redirection React

## Headers de Sécurité

Pour tous les redirects 301, ajouter un header `X-Redirect-Source` :

```javascript
res.set('X-Redirect-Source', `${req.path} → ${redirectTarget}`);
res.redirect(301, redirectTarget);
```

## Tests de Redirection

### Tester en local
```bash
curl -I http://localhost:5001/contact
# Doit retourner 301 et Location: /formulaire-qualification
```

### Tester en production
```bash
curl -I https://www.synapflows.fr/contact
# Doit retourner 301 et Location: https://www.synapflows.fr/formulaire-qualification
```

### Tester la page 404
```bash
curl https://www.synapflows.fr/page-inexistante
# Doit afficher la page 404 personnalisée (code 200)
```

## Maintenance & Mise à jour

Chaque nouvelle route doit être :
1. Ajoutée à la liste des routes valides ci-dessus
2. Importée et configurée dans `App.jsx` (React Router)
3. Testée localement avec `npm run dev`
4. Validée en production après build

## Checklist avant déploiement

- [ ] Nouvelle route testée en local
- [ ] Build sans erreurs (`npm run build`)
- [ ] Toute ancienne URL a une redirection 301 ou affiche 404 approprié
- [ ] Page 404 affiche correctement
- [ ] Redirections testées avec `curl`
- [ ] Pas de broken links dans le contenu
- [ ] Liens internes utilisent des routes valides
