---
applyTo: "frontend/src/**/*Form*.tsx,frontend/src/components/**/*.tsx,src/**/*Form*.tsx"
---

# Frontend forms instructions

- Tout formulaire public doit intégrer Google reCAPTCHA v3 avant envoi.
- Le frontend utilise uniquement la variable publique `RECAPTCHA_SITE_KEY`.
- Ne jamais exposer `RECAPTCHA_SECRET_KEY` dans le frontend.
- Le token reCAPTCHA doit être demandé juste avant l'envoi du formulaire, pas au chargement initial de la page.
- Le token reCAPTCHA doit être envoyé au backend dans le payload sous le champ `recaptchaToken`.
- Ne jamais considérer la validation frontend comme suffisante sans confirmation serveur.
- Prévoir un état utilisateur clair si reCAPTCHA n'est pas disponible, échoue, ou renvoie un token invalide.
- Les composants de formulaire doivent rester orientés conversion: UX fluide, erreurs sobres, pas de friction inutile.
- Pour `www.synap-ratings.com`, privilégier une intégration invisible et rapide compatible landing page.