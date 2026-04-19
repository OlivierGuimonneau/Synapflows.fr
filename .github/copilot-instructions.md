# Copilot repository instructions

Tu travailles sur **www.synapflows.fr**, le site corporate et landing page de SynapFlows - une entreprise spécialisée dans l'**automatisation des processus métier et la création d'applications spécifiques**.

## Contexte projet
- **Domaine** : www.synapflows.fr
- **Vocation** : Site corporate multi-page avec landing page de capture pour qualification de projets
- **Approche** : Accueil présentant les services + page secondaire dédiée au formulaire de qualification
- **Valeur ajoutée** : Développement rapide, hébergement France, 30 ans d'expérience, gain de temps mesurable
- **Développement** : VS Code + GitHub Copilot en local
- **Frontend** : React 18.2 + Vite 7 + React Router (pages multiples)
- **Backend** : Node.js + Express (API de soumission formulaire)
- **Base de données** : Airtable (qualification de projets)
- **Sécurité** : Google reCAPTCHA v3 sur formulaires
- **Déploiement** : Docker sur VPS IONOS 82.165.251.91 (port 5000 interne, Traefik reverse proxy)
- **Coexistence** : Partage VPS avec project.synapflows.fr (autre repo, autre container)
- **CI/CD** : GitHub Actions → SSH → Docker compose up

## Objectifs globaux
- Code lisible, modulaire, testable, facile à maintenir
- Séparation claire : frontend présentation | backend API | services métier | Airtable
- Minimiser les régressions et breaking changes
- Respecter les normes RGPD et privacy-by-design
- Conversion optimale : UX claire, mobile-first, accessibilité
- Coexistence VPS sans conflits : labels Traefik `synapflows-www-*`, port 5000, réseau `n8n-https_default`

## Architecture
- **Frontend React** : Composants fonctionnels, routes (home `/`, formulaire `/formulaire-qualification`)
- **Header/Navigation** : Logo SynapFlows, menu (Accueil, Qualifier mon projet), theme toggle
- **HomePage** : Hero + Services (5 cartes) + Valeur ajoutée + CTA démo/qualification
- **QualificationPage** : Hero spécifique + Formulaire multi-étapes + reCAPTCHA
- **Backend Express** : Route `/api/submit` → validation reCAPTCHA → Airtable
- **Airtable** : Table `Projets Soumis` avec champs projet qualification
- **Environnement** : `.env` (local + GitHub Actions), pas en git

## Frontend React
- Composants fonctionnels avec hooks
- Pages via React Router (v6)
- Design system cohérent : couleurs, spacing, typo dans CSS variables
- États : loading, success, error (formulaire, reCAPTCHA)
- Mobile-first responsive
- Accessibilité : labels, ARIA, sémantique HTML
- Conversion : CTA clair, formule courte, feedback utilisateur
- Dark mode supporté (CSS variables + context)

## Backend Express
- Routes minces (logique dans services/)
- Validation stricte des inputs
- reCAPTCHA v3 : vérifier score, action, hostname
- Réponses JSON normalisées `{success, data, error}`
- Airtable : via couche dédiée (services/airtable.js)
- Erreurs user-friendly (pas d'exposition interne)
- Rate-limiting activé

## Airtable
- Base : appvGEsLWrImfUU9i
- Table : `Projets Soumis`
- Champs : voir mapping dans backend/services/airtable.js
- Token en secret GitHub + .env (jamais exposé)
- Gestion erreurs : timeout, quota, champs manquants

## Sécurité
- reCAPTCHA v3 sur `/api/submit` (validation côté serveur)
- CORS restrictif : localhost:5173 (dev), www.synapflows.fr (prod)
- Pas de données perso en logs
- RGPD : minimisation, transparence, droit d'oubli
- Headers sécurité : CSP, X-Frame-Options, etc.
- Secrets en GitHub + .env.example sans valeurs

## Docker & Production
- Image : Node Alpine 20
- Port interne : 5000 (configurable via PORT)
- docker-compose.yml : service `synapflows-www`, labels Traefik, réseau externe
- Traefik labels : namespace `synapflows-www-*`, routing Host: www.synapflows.fr
- .env généré par GitHub Actions à chaque déploiement
- Healthcheck activé

## Règles de code
- Préférer TypeScript strict (si possible)
- Commentaires pour décisions non évidentes
- Noms clairs et spécifiques (ex: `submitProjectQualification` vs `submit`)
- Pas de secrets hardcodés
- Vérifier les conventions existantes avant d'innover
- Tests pour logique métier/API critiques
- Ajouter `.env.example` si nouvelles variables

## Dépendances critiques
- react-router-dom (pages multiples)
- axios (requêtes API)
- react-google-recaptcha-v3 (formulaire)
- express (serveur)
- dotenv (config)
- cors (sécurité)

## Variables d'environnement (à mettre en .env)
```
PORT=5000
NODE_ENV=production/development
AIRTABLE_BASE_ID=appvGEsLWrImfUU9i
AIRTABLE_PROJETS_SOUMIS=Projets Soumis
AIRTABLE_TOKEN=patt***
VITE_RECAPTCHA_SITE_KEY=6Lc***
RECAPTCHA_SITE_KEY=6Lc***
RECAPTCHA_ENTERPRISE_API_KEY=AIza***
```

## Développement local
- `npm run dev` : Vite 5173 + backend 5001
- `npm run build` : production build
- Vite proxy `/api` → http://localhost:5001
- .env.local pour secrets locaux (pas en git)
- Encapsuler Airtable dans une couche dédiée pour éviter la duplication.

## Airtable
- Passer par une couche d'abstraction dédiée pour les opérations Airtable.
- Gérer explicitement les erreurs Airtable, limites d'API, schémas de champs et cas de données manquantes.
- Ne jamais exposer le token Airtable au frontend.

## Sécurité formulaires
- Tout formulaire public de `www.synap-ratings.com` doit être protégé par Google reCAPTCHA v3.
- Le frontend ne doit utiliser que la clé publique `RECAPTCHA_SITE_KEY`.
- La clé secrète `RECAPTCHA_SECRET_KEY` ne doit exister que côté serveur.
- Toute soumission de formulaire doit être refusée si le token reCAPTCHA n'a pas été vérifié côté backend.
- Pour reCAPTCHA v3, le backend doit vérifier `success`, `score`, `action` et `hostname` avant tout traitement métier ou écriture Airtable.
- Si la vérification reCAPTCHA échoue, ne pas appeler Airtable et retourner une erreur métier sobre.

## Docker et production
- Produire une image Docker reproductible et aussi légère que possible.
- Prévoir un port interne configurable, sans supposer l'exposition directe publique.
- Être compatible avec un reverse proxy existant et des réseaux Docker externes.
- Éviter toute configuration qui casserait n8n ou une autre app déjà présente sur le VPS.
- Documenter les variables d'environnement requises et les prérequis réseau.
- Utiliser des noms de services, conteneurs, labels et middlewares Traefik spécifiques à `synap-ratings` pour éviter toute collision.

## Développement local
- Favoriser une expérience simple sous VS Code.
- Les commandes npm doivent être explicites et prévisibles.
- Si une commande de build, lint ou test est nécessaire avant validation, le préciser.

## Quand une information manque
- Choisir l'option la plus conservatrice et la plus maintenable.
- Si plusieurs implémentations sont possibles, privilégier celle qui isole le plus clairement les responsabilités.