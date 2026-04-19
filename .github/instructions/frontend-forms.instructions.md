---
applyTo: "frontend/src/**/*Form*.tsx,frontend/src/components/**/*.tsx,src/**/*Form*.tsx"
---

# Frontend forms instructions

## Objectif
- Produire des formulaires clairs, rassurants, rapides à compléter et optimisés pour la conversion.
- Préserver la qualité des données envoyées au backend sans créer de friction inutile.

## UX de formulaire
- Limiter le nombre de champs au strict nécessaire.
- Utiliser des labels explicites et un wording simple.
- Garder une hiérarchie claire: contexte, bénéfice, formulaire, confirmation.
- Prévoir un bouton d'action principal clair et non ambigu.
- Éviter les formulaires inutilement longs ou complexes pour une prise de contact initiale.

## Validation côté client
- Valider les champs de manière utile mais non agressive.
- Préférer une validation au bon moment, avec des messages compréhensibles.
- Ne pas effacer la saisie utilisateur après une erreur.
- Les messages d'erreur doivent expliquer quoi corriger sans jargon technique.
- La validation frontend améliore l'expérience utilisateur mais ne remplace jamais la validation backend.

## États d'interface
- Prévoir explicitement:
  - état initial
  - état de soumission
  - succès
  - erreur
- Désactiver proprement le bouton pendant la soumission si nécessaire.
- Afficher un retour clair après envoi, sans ambiguïté sur le résultat.

## reCAPTCHA v3
- Tout formulaire public doit intégrer Google reCAPTCHA v3 avant envoi.
- Le frontend utilise uniquement la variable publique `RECAPTCHA_SITE_KEY`.
- Ne jamais exposer `RECAPTCHA_SECRET_KEY` dans le frontend.
- Le token reCAPTCHA doit être généré juste avant le submit, pas au chargement initial de la page.
- Utiliser une `action` explicite et cohérente avec l'usage métier, par exemple `submit_lead`.
- Le token doit être envoyé au backend dans le payload sous le champ `recaptchaToken`.
- Ne jamais considérer le succès frontend comme une validation suffisante sans confirmation serveur.

## Résilience
- Prévoir un comportement propre si le script reCAPTCHA ne charge pas.
- Prévoir un message utilisateur sobre si la vérification ne peut pas être effectuée.
- Ne pas soumettre silencieusement un formulaire sans token si une protection reCAPTCHA est attendue.
- Préserver une expérience fluide sur mobile et desktop.

## Réutilisabilité
- Favoriser des composants de champ, d'erreur, de bouton et de message de statut réutilisables.
- Si plusieurs formulaires partagent le même comportement, mutualiser la logique dans un hook ou un utilitaire dédié.
- Préserver les patterns existants du repo avant d'introduire une nouvelle variante.