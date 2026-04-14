---
applyTo: "backend/src/**/*.ts,server/**/*.ts,api/**/*.ts"
---

# Backend security instructions

- Toute intégration Airtable passe par un client ou service dédié côté serveur.
- Valider les entrées avec un schéma explicite avant toute logique métier.
- Utiliser une whitelist CORS adaptée aux domaines locaux et de production.
- Prévoir rate limiting sur les formulaires et endpoints sensibles.
- Ne jamais exposer de secrets dans les réponses, logs ou fichiers versionnés.

## reCAPTCHA v3
- Tout endpoint POST de formulaire public doit attendre un champ `recaptchaToken` dans le body.
- Le backend doit vérifier ce token auprès de l'API Google reCAPTCHA avant tout traitement métier.
- La vérification doit contrôler au minimum:
  - `success === true`
  - `score >= RECAPTCHA_MIN_SCORE`
  - `action === RECAPTCHA_EXPECTED_ACTION`
  - `hostname` cohérent avec le domaine attendu
- Si la vérification échoue, retourner `400` ou `403` et ne jamais écrire dans Airtable.
- La clé `RECAPTCHA_SECRET_KEY` doit provenir uniquement des variables d'environnement.
- Ne jamais logger la secret key ni le token reCAPTCHA complet.
- La logique de vérification reCAPTCHA doit vivre dans un service dédié, pas directement dans le contrôleur.