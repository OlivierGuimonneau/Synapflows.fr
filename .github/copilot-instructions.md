# Copilot repository instructions

Tu travailles sur un projet web d'entreprise décliné en deux sites:
- `www.synapflows.fr`: site vitrine principal avec formulaires liés à Airtable
- `www.synap-ratings.com`: landing page de capture utilisant la même structure visuelle et la même base technique

## Priorités produit
1. Reprendre la continuité visuelle du précédent projet SynapFlows
2. Maintenir une sécurité de production élevée
3. Préserver la compatibilité avec un déploiement Docker sur VPS IONOS déjà utilisé par n8n et `project.synapflows.fr`

## Architecture cible
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Intégration Airtable: côté serveur uniquement
- Déploiement: Docker + Traefik via réseau externe existant

## Sécurité formulaires
- Tout formulaire public exposé sur `www.synapflows.fr` doit être protégé par Google reCAPTCHA v3.
- Le frontend ne doit utiliser que la clé publique `RECAPTCHA_SITE_KEY`.
- La clé secrète `RECAPTCHA_SECRET_KEY` ne doit exister que côté serveur.
- Toute soumission de formulaire doit être refusée si le token reCAPTCHA n'a pas été vérifié côté backend.
- Pour reCAPTCHA v3, le backend doit vérifier `success`, `score`, `action` et `hostname` avant tout traitement métier ou écriture Airtable.
- Si la vérification reCAPTCHA échoue, ne pas appeler Airtable et retourner une erreur métier sobre.