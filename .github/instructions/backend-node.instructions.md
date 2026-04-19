---
applyTo: "backend/src/**/*.ts,server/**/*.ts,api/**/*.ts"
---

# Backend Node instructions

## Objectif
- Produire un backend Node.js + Express clair, modulaire, testable et sécurisé.
- Centraliser la logique métier, la validation, les appels aux services externes et la gestion des erreurs.

## Architecture backend
- Garder les routes Express minces.
- Mettre la logique métier dans des services dédiés.
- Encapsuler les intégrations externes dans des clients ou adaptateurs dédiés.
- Séparer clairement routes, controllers, services, schemas, config, middleware et clients externes.
- Éviter les dépendances croisées confuses entre modules backend.

## Validation et contrats
- Valider explicitement `body`, `params` et `query` avant tout traitement.
- Préférer des schémas explicites et réutilisables pour la validation.
- Les contrats de requête et de réponse doivent être lisibles et cohérents.
- Ne pas laisser passer des données partielles ou ambiguës sans validation.

## Gestion des erreurs
- Normaliser les réponses JSON en cas de succès et d'erreur.
- Retourner des messages d'erreur sobres côté client et conserver les détails techniques côté serveur si nécessaire.
- Gérer explicitement les erreurs provenant d'Airtable ou d'autres services externes.
- Éviter les `try/catch` géants si une fonction ou un service dédié améliore la lisibilité.

## Style de code
- Préférer TypeScript strict avec types explicites.
- Éviter `any` sauf justification exceptionnelle.
- Utiliser des noms de fonctions, variables et services explicites.
- Préférer de petites fonctions spécialisées plutôt que de gros blocs impératifs.
- Garder les fichiers suffisamment courts pour rester faciles à relire et à tester.

## Configuration
- Toute configuration sensible ou variable doit provenir des variables d'environnement.
- Centraliser l'accès à la configuration dans un module dédié.
- Ne jamais hardcoder de secrets, tokens, base IDs, domaines privés ou credentials.

## Sécurité
- Ne jamais faire confiance aux données entrantes sans validation.
- Prévoir rate limiting, contrôle d'origine et vérifications de sécurité sur les endpoints publics.
- Ne jamais exposer les secrets backend dans les réponses ou les logs.
- Toute écriture vers un service externe issue d'un formulaire public doit être précédée de vérifications de sécurité côté serveur.

## Maintenabilité
- Si une logique est susceptible d'être réutilisée, l'extraire dans un service ou utilitaire dédié.
- Si une fonctionnalité backend touche plusieurs couches, proposer d'abord l'arborescence ou la liste des fichiers à modifier.
- Préserver les conventions déjà visibles dans le repo avant d'introduire un nouveau pattern.