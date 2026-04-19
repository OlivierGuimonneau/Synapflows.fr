---
applyTo: "backend/src/**/*.ts,server/**/*.ts,api/**/*.ts"
---

# Backend security instructions

- Toute intégration Airtable passe par un client ou service dédié côté serveur.
- Valider les entrées avec un schéma explicite avant toute logique métier.
- Utiliser une whitelist CORS adaptée aux domaines locaux et de production.
- Prévoir rate limiting sur les formulaires et endpoints sensibles.
- Ne jamais exposer de secrets dans les réponses, logs ou fichiers versionnés.

## reCAPTCHA v3 (classique et Enterprise)

### Choix entre classique et Enterprise
- **Classique (gratuit):** Pour la plupart des projets, API simple via `www.google.com/recaptcha/api/siteverify`
- **Enterprise (Google Cloud, payant):** Pour les apps critiques via `recaptchaenterprise.googleapis.com/...`

### Règles communes
- Tout endpoint POST de formulaire public doit attendre un champ `recaptchaToken` dans le body.
- Le backend doit vérifier ce token auprès de l'API Google reCAPTCHA avant tout traitement métier.
- La vérification doit contrôler au minimum:
  - `success === true` (classique) ou `tokenProperties.valid === true` (Enterprise)
  - `score >= RECAPTCHA_MIN_SCORE`
  - `action === RECAPTCHA_EXPECTED_ACTION`
  - `hostname` cohérent avec le domaine attendu
- Si la vérification échoue, retourner `400` ou `403` et ne jamais écrire dans Airtable.
- Ne jamais logger la clé secrète, la clé API ou le token complet.
- La logique de vérification reCAPTCHA doit vivre dans un service dédié, pas directement dans le contrôleur.

### Configuration reCAPTCHA Enterprise

Variables d'environnement requises (backend/.env):
```env
RECAPTCHA_SITE_KEY=votre_clé_publique
RECAPTCHA_ENTERPRISE_API_KEY=votre_clé_api_google_cloud
RECAPTCHA_ENTERPRISE_PROJECT_ID=votre_projet_google_cloud
RECAPTCHA_EXPECTED_ACTION=submit_lead
RECAPTCHA_MIN_SCORE=0.5
```

### Service de vérification Enterprise

Le service doit:
- Construire l'URL: `https://recaptchaenterprise.googleapis.com/v1/projects/{PROJECT_ID}/assessments?key={API_KEY}`
- Envoyer le token **et** le siteKey dans le body JSON
- Parser la réponse et accéder à `riskAnalysis.score` (pas `score` directement)
- Accéder à `tokenProperties.valid` pour vérifier la validité
- Gérer l'erreur `MALFORMED` (token rejeté) et les erreurs réseau

### Mode développement

En développement local, autoriser les tokens factices:
```typescript
if (env.nodeEnv === 'development' && token.startsWith('dev-token-')) {
  console.log('✓ Development mode: accepting dev token for local testing');
  return { valid: true, score: 0.9 };
}
```

Cela évite de bloquer les tests locaux si reCAPTCHA ne charge pas correctement au démarrage.

### Variables en monorepo

Si le projet est organisé en monorepo (frontend/ et backend/ séparés):
- Chaque workspace charge son propre `.env` depuis son répertoire (pas depuis la racine)
- Créer `frontend/.env` avec les variables publiques (`VITE_*`)
- Créer `backend/.env` avec les variables secrètes et configuration

### Logging et sécurité

Pour les logs (traitement sensible):
```typescript
console.log('Token (first 20 chars):', token?.substring(0, 20) + '...');
console.log('Google API response status:', response.status);
```

Ne jamais logger:
- La clé API complète
- Le token complètement
- Les secrets

### Gestion des erreurs

Prévoir les cas:
- Token invalide/rejeté (`tokenProperties.valid === false`)
- Hostname non autorisé
- Score insuffisant
- Erreur réseau (Google API down)
- Erreur d'authentification (API key invalide)

Dans tous les cas, retourner une erreur générique au frontend, conserver les détails technique dans les logs serveur.