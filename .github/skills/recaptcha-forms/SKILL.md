---
name: recaptcha-forms
description: Protège les formulaires publics avec Google reCAPTCHA v3 pour React/Vite + Express + Airtable.
---

# reCAPTCHA forms skill

Cette skill s'applique à tous les formulaires publics de `www.synapflows.fr` .

## Objectif
Réduire le spam et les abus sur les formulaires publics sans exposer les secrets ni casser la conversion.

## Règles globales
- Utiliser Google reCAPTCHA v3 sur tous les formulaires publics.
- Le frontend utilise uniquement `RECAPTCHA_SITE_KEY`.
- Le backend vérifie toujours le token auprès de Google avant tout traitement.
- Si la vérification échoue, ne pas écrire dans Airtable.
- Les clés reCAPTCHA proviennent uniquement des variables d'environnement.

## Variables attendues

### Frontend
- `VITE_RECAPTCHA_SITE_KEY`

### Backend
- `RECAPTCHA_SECRET_KEY`
- `RECAPTCHA_EXPECTED_ACTION`
- `RECAPTCHA_MIN_SCORE`
- `APP_DOMAIN`

## Pattern frontend attendu
- Charger reCAPTCHA côté client.
- Exécuter reCAPTCHA juste avant le submit avec une action explicite, par exemple `submit_lead`.
- Ajouter `recaptchaToken` au payload envoyé au backend.
- Gérer proprement les cas:
  - script non chargé
  - token absent
  - erreur de soumission
  - succès

## Pattern backend attendu
- Lire `recaptchaToken` depuis le body.
- Appeler `https://www.google.com/recaptcha/api/siteverify` côté serveur avec:
  - `secret`
  - `response`
- Vérifier au minimum:
  - `success`
  - `score`
  - `action`
  - `hostname`
- Rejeter la requête si un des contrôles échoue.
- N'appeler Airtable qu'après validation reCAPTCHA réussie.

## Contrat de validation recommandé
- `action` attendue: `submit_lead`
- `score` minimum par défaut: `0.5`
- `hostname` doit correspondre à `www.synapflows.fr` selon l'environnement

## Structure backend recommandée
- `middleware/` ou `services/recaptcha/verifyRecaptcha.ts`
- `controllers/leadController.ts` reste mince
- `services/leadService.ts` ne doit être appelé qu'après validation reCAPTCHA

## Sécurité
- Ne jamais exposer `RECAPTCHA_SECRET_KEY`
- Ne jamais faire confiance à la validation frontend seule
- Ne jamais logger les secrets
- Ne jamais accepter une soumission sans `recaptchaToken`
- Ne jamais bypasser reCAPTCHA sur un endpoint public en production

## Réponse d'erreur recommandée
- `400` si token absent ou payload invalide
- `403` si reCAPTCHA échoue
- message utilisateur sobre, sans détail interne

## Notes d'implémentation
- Si le score est trop bas, bloquer ou demander un fallback manuel selon la stratégie produit.
- Pour une landing page très exposée, surveiller les scores en production et ajuster `RECAPTCHA_MIN_SCORE`.
- Vérifier que l'action reCAPTCHA envoyée par le frontend correspond exactement à celle attendue côté backend.