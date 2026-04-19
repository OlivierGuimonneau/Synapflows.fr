---
name: api-airtable
description: Implémente les intégrations Airtable côté serveur avec validation, mapping explicite, gestion d'erreurs et contraintes de maintenabilité.
---

# Airtable API skill

Utiliser cette skill dès qu'une fonctionnalité implique :
- lecture depuis Airtable
- création ou mise à jour d'enregistrements Airtable
- mapping entre données applicatives et champs Airtable
- évolution d'un flux backend qui dépend d'Airtable

## Objectif
- Intégrer Airtable de manière fiable, explicite et maintenable.
- Isoler les détails Airtable de la logique métier applicative.
- Réduire les erreurs de mapping, les duplications et les écritures fragiles.

## Principes
- Airtable est toujours appelé côté serveur.
- Le frontend ne doit jamais appeler Airtable directement.
- Les routes Express restent minces.
- Les contrôleurs orchestrent la validation et la réponse HTTP.
- Les services métier pilotent la logique applicative.
- Les clients ou adaptateurs Airtable encapsulent les appels à l'API Airtable.

## Architecture recommandée
Organiser le code de manière explicite, par exemple avec :
- `config/` pour les variables d'environnement et la configuration Airtable
- `clients/` ou `integrations/airtable/` pour le client Airtable
- `schemas/` pour les validations
- `services/` pour la logique métier
- `controllers/` pour les handlers HTTP
- `mappers/` si le mapping Airtable devient important ou partagé

## Règles de conception
- Ne jamais appeler Airtable directement depuis une route ou un composant frontend.
- Valider les données avant l'appel Airtable.
- Mapper explicitement les données applicatives vers les champs Airtable.
- Ne pas supposer que les noms des champs Airtable correspondent exactement aux noms internes du code.
- Préférer des fonctions nommées comme `createLeadInAirtable`, `mapLeadToAirtableFields`, `parseAirtableRecord`.

## Sécurité
- Ne jamais exposer le token Airtable au frontend.
- Lire les credentials et identifiants nécessaires depuis les variables d'environnement.
- Ne jamais logger en clair un secret ou un payload sensible complet.
- Toute écriture issue d'un formulaire public doit être précédée des validations de sécurité du projet.

## Gestion des erreurs
- Gérer explicitement les erreurs Airtable.
- Retourner une erreur métier sobre au client.
- Conserver le détail technique côté serveur si nécessaire pour le diagnostic.
- Ne pas masquer silencieusement un échec de lecture ou d'écriture.

## Robustesse
- Concevoir les appels Airtable avec prudence vis-à-vis des limites d'API.
- Éviter les appels répétés inutiles et les boucles non contrôlées.
- Si plusieurs opérations similaires existent, mutualiser les patterns.

## Maintenabilité
- Si une convention de mapping existe, la réutiliser.
- Si un schéma Airtable devient central, documenter les conventions dans `conventions.md`.
- Si une nouvelle intégration Airtable est ajoutée, proposer aussi les impacts sur tests et documentation.

Consulter `conventions.md` pour les conventions détaillées du projet.