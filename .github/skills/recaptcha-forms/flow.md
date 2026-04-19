# reCAPTCHA form flow

Ce document décrit le flux recommandé pour un formulaire public protégé par reCAPTCHA v3 (classique ou Enterprise).

## 1. Flux global

Le flux attendu est :

1. l'utilisateur remplit le formulaire
2. au clic sur le bouton de soumission, le frontend déclenche `grecaptcha.execute(...)`
3. le frontend récupère un token reCAPTCHA avec une `action` explicite
4. le frontend envoie au backend :
   - les données du formulaire
   - le `recaptchaToken`
5. le backend vérifie le token auprès de Google :
   - reCAPTCHA **v3 classique**: appel à `www.google.com/recaptcha/api/siteverify`
   - reCAPTCHA **Enterprise**: appel à `https://recaptchaenterprise.googleapis.com/v1/projects/{PROJECT_ID}/assessments`
6. le backend contrôle :
   - `success` (classique) ou `tokenProperties.valid` (Enterprise)
   - `score` ou `riskAnalysis.score` (Enterprise)
   - `action`
   - `hostname` si la politique du projet l'exige
7. le backend décide :
   - accepter la soumission
   - rejeter la soumission
   - traiter différemment la soumission si le score est douteux
8. le backend retourne une réponse sobre au frontend
9. le frontend affiche un succès ou une erreur compréhensible

## 2. Configuration Environment

### Avant d'implémenter
Créer un `.env.example` qui documente les variables attendues:

```env
# .env.example ou backend/.env.example
RECAPTCHA_SITE_KEY=your_public_key
RECAPTCHA_ENTERPRISE_API_KEY=your_google_cloud_api_key
RECAPTCHA_ENTERPRISE_PROJECT_ID=your_project_id
RECAPTCHA_EXPECTED_ACTION=submit_lead
RECAPTCHA_MIN_SCORE=0.5
```

### En monorepo (frontend/ et backend/ séparés)
- Créer **frontend/.env** avec `VITE_RECAPTCHA_SITE_KEY` et `VITE_RECAPTCHA_ACTION`
- Créer **backend/.env** avec `RECAPTCHA_SITE_KEY`, `RECAPTCHA_ENTERPRISE_API_KEY`, `RECAPTCHA_ENTERPRISE_PROJECT_ID`, etc.
- Ne **PAS** se fier au `.env` à la racine - chaque workspace le charge depuis son répertoire

## 3. Règles frontend

- Ne pas générer le token au chargement initial de la page.
- Générer le token juste avant l'envoi.
- Utiliser une `action` explicite et stable, par exemple :
  - `submit_lead`
  - `contact_form_submit`
- Gérer le cas où reCAPTCHA n'est pas prêt.
- Gérer le cas où `execute` échoue.
- Ne pas soumettre le formulaire protégé sans token (générateur un `dev-token-*` en développement si nécessaire).
- Préserver les données saisies si la soumission échoue.

## 4. Pourquoi il faut déclencher tard

Le token reCAPTCHA v3 expire rapidement.

Règles :
- le token doit être demandé juste avant l'envoi
- ne pas générer le token au montage du composant
- si l'utilisateur attend trop longtemps ou si une tentative échoue, régénérer un nouveau token
- en développement, si reCAPTCHA échoue à charger, générer un token factice pour ne pas bloquer les tests

## 5. Payload attendu

Exemple logique de payload frontend vers backend :

```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "company": "ACME Corp",
  "phone": "+33612345678",
  "recaptchaToken": "<token_valide_ou_dev_token_en_dev>"
}
```

Le nom du champ `recaptchaToken` doit rester explicite et stable dans le projet.

## 6. Vérification backend - reCAPTCHA Enterprise

Pour Google Cloud reCAPTCHA Enterprise:

```typescript
const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;

const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: {
      token,
      siteKey,
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
    },
  }),
});

const data = await response.json();

// Vérifier tokenProperties.valid
if (!data.tokenProperties?.valid) {
  return { valid: false, reason: `Invalid token: ${data.tokenProperties?.invalidReason}` };
}

// Vérifier le score
const score = data.riskAnalysis?.score ?? 0;
if (score < minScore) {
  return { valid: false, reason: 'Verification score too low', score };
}
```

**Important:** En développement, accepter les tokens `dev-token-*`:

```typescript
if (env.nodeEnv === 'development' && token.startsWith('dev-token-')) {
  console.log('✓ Development mode: accepting dev token for local testing');
  return { valid: true, score: 0.9 };
}
```

## 7. Politique de score

Le score ne doit pas être interprété au hasard.

Règles :
- démarrer avec un seuil simple et documenté (ex: 0.5)
- ajuster le seuil selon les observations réelles
- ne pas bloquer brutalement sans comprendre le comportement du trafic
- si nécessaire, distinguer plusieurs niveaux :
  - score acceptable (>= 0.7)
  - score douteux (0.5 - 0.7)
  - score rejeté (< 0.5)

## 8. Cas d'échec à gérer

Prévoir au minimum :
- script reCAPTCHA non chargé → générer token dev en dev
- `execute` frontend échoue → fallback token dev en dev
- token absent
- token expiré
- token déjà utilisé (Enterprise)
- vérification Google en échec (network, invalid API key)
- action inattendue
- hostname non autorisé (Enterprise)
- score insuffisant
- erreur serveur pendant la vérification

Le backend doit rester la source de vérité finale.

## 9. Messages utilisateur

Préférer des messages sobres et utiles.

Exemples de logique :
- succès : confirmation claire que la demande a été transmise
- erreur générique : inviter l'utilisateur à réessayer
- erreur technique répétée : proposer un autre canal de contact si nécessaire

Éviter :
- d'exposer les détails techniques de la vérification
- de mentionner la clé, le score exact ou les codes internes au frontend
- de vider le formulaire après un échec

## 10. Garde-fous complémentaires

reCAPTCHA ne remplace pas :
- la validation backend
- le rate limiting
- la sanitation des entrées
- la gestion des logs
- les protections métier spécifiques

Le flux complet doit cumuler plusieurs garde-fous.

## 11. Vérifications minimales après implémentation

Après mise en place, vérifier :
- que le token est bien généré au submit
- qu'il est bien envoyé au backend
- que le backend vérifie réellement Google (ou accepte dev-token en dev)
- que l'action attendue est contrôlée
- que le formulaire ne passe pas si la vérification échoue
- que l'expérience utilisateur reste claire en cas d'erreur
- que les logs backend montrent le flux complet sans révéler de secrets

## 12. Debugging

Si les tokens sont rejetés :
1. Vérifier que la clé publique (frontend) correspond à la clé dans Google Console
2. Vérifier que l'API Key Google Cloud a les bonnes permissions
3. Vérifier que le Project ID est correct
4. Consulter les logs Google Cloud pour les erreurs exactes
5. S'assurer que `localhost` ou le domaine est dans la whitelist
6. Vérifier que le type de reCAPTCHA est bien **v3** (pas v2 Checkbox)