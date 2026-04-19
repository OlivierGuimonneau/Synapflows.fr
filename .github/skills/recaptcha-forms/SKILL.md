---
name: recaptcha-forms
description: Implémente des formulaires publics avec reCAPTCHA v3 (classique) ou reCAPTCHA Enterprise (Google Cloud), validation serveur, contrôle du score, action explicite et UX de soumission robuste.
---

# reCAPTCHA forms skill

Utiliser cette skill quand une feature implique :
- un formulaire public
- une prise de contact
- une capture de lead
- un endpoint exposé à des soumissions externes
- une intégration reCAPTCHA v3 (classique ou Enterprise)

## Objectif
- Réduire le spam et les soumissions abusives.
- Préserver une expérience utilisateur fluide.
- Garantir que la validation finale se fait toujours côté serveur.

## Choix: reCAPTCHA v3 classique vs Enterprise

### reCAPTCHA v3 classique (gratuit)
- API simplifié: `www.google.com/recaptcha/api/siteverify`
- Utilise une `SECRET_KEY` unique
- Convient à la plupart des applications web
- Pas de frais

### reCAPTCHA Enterprise (Google Cloud, payant)
- API complexe: `https://recaptchaenterprise.googleapis.com/v1/projects/{PROJECT_ID}/assessments`
- Utilise une **Clé API Google Cloud** et un **Project ID**
- Le token doit inclure le field `siteKey` dans la requête
- Politiques d'authentification plus robustes
- Convient aux applications critiques avec forts volumes

**Pour ce projet (synapflows)**, nous utilisons **reCAPTCHA Enterprise via Google Cloud**.

## Principes
- reCAPTCHA v3 se déclenche côté frontend juste avant la soumission.
- Le token obtenu est transmis au backend avec les autres données du formulaire.
- Le backend vérifie obligatoirement le token auprès de Google.
- Le backend contrôle au minimum :
  - `success` (classique) ou `tokenProperties.valid` (Enterprise)
  - `score` ou `riskAnalysis.score` (Enterprise)
  - `action`
  - `hostname`
- Le backend décide ensuite d'accepter, rejeter ou traiter différemment la soumission.

## Règles frontend
- Utiliser uniquement la clé publique côté client (toujours préfixée par `VITE_` avec Vite).
- Ne jamais exposer les clés secrètes ou les clés API côté frontend.
- Générer le token juste avant l'action utilisateur concernée, pas au chargement initial de la page.
- Utiliser une `action` explicite, par exemple `submit_lead` ou `contact_form_submit`.
- Gérer proprement le cas où reCAPTCHA n'est pas encore prêt ou échoue.
- Ne pas soumettre silencieusement un formulaire protégé sans token valide.
- **Important en développement:** Si le script reCAPTCHA échoue à charger (ex: pour test local), générer un token factice (`dev-token-*`). Le backend peut accepter ces tokens en mode développement.

## Règles backend
- Vérifier le token sur le serveur avant tout traitement sensible.
- Comparer l'action reçue avec l'action attendue.
- Interpréter le score selon la politique du projet (seuil par défaut: 0.5).
- Rejeter proprement les soumissions invalides ou suspectes.
- Ne jamais considérer la seule présence d'un token comme suffisante.
- Compléter reCAPTCHA par les autres garde-fous du projet : validation, rate limiting, logs sobres, filtrage anti-abus.
- **Mode développement:** Accepter les tokens `dev-token-*` localement pour permettre les tests sans dépendre de Google.

## Configuration des variables d'environnement

### Frontend (.env ou frontend/.env)
```env
VITE_RECAPTCHA_SITE_KEY=votre_clé_publique
VITE_RECAPTCHA_ACTION=submit_lead
```

### Backend (.env ou backend/.env) - reCAPTCHA Enterprise
```env
RECAPTCHA_SITE_KEY=votre_clé_publique        # Identique au frontend
RECAPTCHA_ENTERPRISE_API_KEY=votre_clé_api  # Clé API Google Cloud
RECAPTCHA_ENTERPRISE_PROJECT_ID=votre_projet # Nom du projet Google Cloud
RECAPTCHA_EXPECTED_ACTION=submit_lead        # Action attendue
RECAPTCHA_MIN_SCORE=0.5                      # Seuil de confiance
```

### Important en monorepo
- Si le projet utilise une structure monorepo (frontend/ et backend/ séparés), créer un `.env` dans chaque workspace
- Le `.env` à la racine ne sera pas chargé automatiquement par Webpack/Vite/tsx
- Chaque workspace charge son propre `.env` depuis son répertoire

## UX de formulaire
- Préserver une expérience simple et claire.
- Afficher un état de soumission compréhensible.
- Afficher un message d'erreur sobre si la vérification échoue.
- Ne pas perdre la saisie utilisateur en cas d'échec.
- Garder la friction minimale tant que le backend considère la soumission acceptable.

## Sécurité
- Tous les secrets restent côté serveur.
- Ne pas logger les secrets ou les tokens complets.
- En logs, utiliser seulement les premiers caractères du token (`token.substring(0, 20) + '...'`).
- Ne pas exposer de détails techniques sensibles au frontend.
- Utiliser HTTPS.
- Toute validation frontend reste purement complémentaire.

## Maintenabilité
- Mutualiser la logique reCAPTCHA si plusieurs formulaires utilisent le même pattern.
- Centraliser la vérification serveur dans un service dédié (`recaptchaEnterpriseService.ts` pour Enterprise).
- Documenter les variables d'environnement et les seuils utilisés dans `.env.example`.
- Si le projet migre vers une autre version de reCAPTCHA, centraliser le changement dans le service.

## Pièges courants

### 1. Tokens MALFORMED en développement
- **Cause:** Le frontend génère un token factice parce que reCAPTCHA n'a pas pu charger
- **Solution:** Accepter les tokens `dev-token-*` côté backend en développement

### 2. Domaines non autorisés
- **Cause:** Google rejette `localhost` qui n'est pas listé dans la console reCAPTCHA
- **Solution:** Dans la console Google Cloud reCAPTCHA, ajouter `localhost` et `127.0.0.1` aux domaines autorisés

### 3. Erreur "Invalid site key or not loaded in api.js"
- **Cause:** Le frontend utilise une mauvaise clé publique ou une clé de la mauvaise version (v2 au lieu de v3)
- **Solution:** Vérifier que tu utilises reCAPTCHA **v3** et que la clé correspond

### 4. Pas de logs en terminal
- **Cause:** En mode async, les logs du terminal ne s'affichent pas si le serveur a été lancé par Copilot
- **Solution:** Arrêter et relancer le serveur manuellement via `npm run dev`

### 5. Une colonne ne se remplit pas
- **Cause:** La colonne attendue n'existe pas dans Airtable ou le nom exact n'est pas respecté (minuscules, accents, etc.)
- **Solution:** Vérifier le SQL/structure Airtable et adapter les noms de colonnes dans `leadService.ts`

Consulter `flow.md` pour le déroulé détaillé du flux de soumission.