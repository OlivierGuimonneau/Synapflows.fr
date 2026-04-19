---
applyTo: "backend/src/**/*.ts,frontend/src/**/*.{ts,tsx},server/**/*.ts,api/**/*.ts"
---

# Security instructions

## Objectif
- Produire un code défensif, sobre et adapté à une application web exposée publiquement.
- Réduire les risques liés aux formulaires publics, aux entrées non fiables, aux erreurs de configuration et aux intégrations externes.

## Principes généraux
- Toute donnée entrante doit être considérée comme non fiable tant qu'elle n'a pas été validée côté serveur.
- Ne jamais supposer qu'une validation frontend est suffisante.
- Ne jamais hardcoder de secrets, tokens, mots de passe, credentials, base IDs ou clés d'API.
- Toute configuration sensible doit provenir des variables d'environnement ou d'un module de configuration serveur dédié.

## Validation
- Valider explicitement les `body`, `params`, `query` et toute donnée issue d'une source externe.
- Préférer une validation centralisée, explicite et réutilisable.
- Rejeter les entrées incomplètes, ambiguës ou non conformes avant toute logique métier.
- En cas d'échec de validation, retourner une réponse claire mais sobre, sans détail technique inutile.

## Secrets et configuration
- Ne jamais exposer un secret backend au frontend.
- Ne jamais logguer en clair les tokens, secrets, credentials ou payloads sensibles.
- Ne jamais committer de valeurs sensibles dans le code source, les fixtures ou la documentation.
- Préférer des noms de variables d'environnement explicites et cohérents.

## API et backend
- Utiliser un contrôle d'origine explicite et restrictif pour CORS.
- Prévoir du rate limiting sur les endpoints publics sensibles, notamment les formulaires.
- Ajouter ou préserver des headers de sécurité HTTP adaptés.
- Ne jamais retourner de stack trace brute ou d'erreur interne détaillée au client.
- Éviter les comportements silencieux qui masquent un échec de sécurité ou de validation.

## Logs
- Les logs doivent être utiles au diagnostic sans exposer d'informations sensibles.
- Éviter de logger des données personnelles non nécessaires.
- En cas d'erreur, préférer un identifiant d'événement, un contexte réduit et un message exploitable.
- Sanitiser les contenus loggés si une donnée externe peut contenir des caractères inattendus.

## Frontend
- Ne jamais stocker ou manipuler côté client des secrets réservés au backend.
- Limiter les informations techniques affichées à l'utilisateur final.
- En cas d'erreur de soumission, afficher un message utilisateur clair sans révéler d'information interne.

## Intégrations externes
- Toute écriture vers Airtable ou un autre service externe doit être précédée de validations backend complètes.
- Gérer explicitement les erreurs réseau, erreurs d'API, refus de sécurité et cas de timeout.
- En cas de doute, privilégier une approche conservatrice qui bloque la soumission plutôt qu'une écriture incertaine ou non vérifiée.

## Maintenabilité sécurité
- Si une règle de sécurité est répétée à plusieurs endroits, l'extraire dans un middleware, un service ou un utilitaire dédié.
- Préserver les conventions de sécurité déjà visibles dans le repo.
- Si une fonctionnalité est sensible, proposer d'abord l'arborescence des fichiers et le flux de validation avant de générer le code.