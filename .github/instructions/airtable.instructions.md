---
applyTo: "backend/src/**/*.ts,server/**/*.ts,api/**/*.ts"
---

# Airtable integration instructions

## Objectif
- Intégrer Airtable de manière fiable, sécurisée et maintenable.
- Centraliser tous les accès Airtable côté serveur.
- Réduire les duplications, les appels fragiles et les erreurs de mapping de champs.

## Architecture
- Tous les appels Airtable doivent passer par une couche dédiée, par exemple `clients/`, `services/` ou `integrations/airtable/`.
- Ne jamais appeler Airtable directement depuis les routes Express ou depuis les composants frontend.
- Séparer clairement:
  - la configuration Airtable
  - le client Airtable
  - le mapping des champs
  - la logique métier qui décide quoi lire ou écrire

## Sécurité
- Ne jamais exposer le token Airtable au frontend.
- Les clés, base IDs, table names et autres paramètres sensibles doivent venir des variables d'environnement ou d'une configuration serveur centralisée.
- Toute écriture Airtable issue d'un formulaire public doit être précédée d'une validation backend complète.

## Validation et mapping
- Valider les données applicatives avant tout appel Airtable.
- Convertir explicitement les données applicatives vers les noms et formats de champs Airtable.
- Ne pas supposer qu'un champ Airtable existe ou garde toujours le même format sans mapping explicite.
- Si le schéma Airtable est important pour la logique métier, le documenter clairement dans le code.

## Gestion des erreurs
- Gérer explicitement les erreurs Airtable et les réponses inattendues.
- Prévoir des erreurs métier sobres côté client et conserver les détails techniques côté serveur si nécessaire.
- Si Airtable échoue, éviter les messages flous ou trompeurs.
- Ne pas masquer silencieusement les erreurs d'écriture ou de lecture.

## Rate limiting et robustesse
- Concevoir les appels Airtable en tenant compte des limites d'API.
- Éviter les rafales de requêtes inutiles ou les appels répétés dans des boucles non contrôlées.
- Si plusieurs enregistrements doivent être traités, préférer une stratégie explicite et prudente.
- Si un risque de dépassement de quota ou de `429` existe, prévoir une stratégie de limitation, temporisation ou retry contrôlé.

## Lisibilité
- Utiliser des noms explicites pour distinguer:
  - les types applicatifs
  - les payloads envoyés à Airtable
  - les records retournés par Airtable
- Préférer des fonctions spécialisées comme `createLeadInAirtable`, `mapLeadToAirtableFields`, `parseAirtableRecord`.
- Éviter les objets inline complexes directement dans les contrôleurs.

## Maintenabilité
- Si plusieurs formulaires ou workflows écrivent dans Airtable, mutualiser les patterns communs.
- Si un mapping ou une convention de nommage est déjà présente dans le repo, la réutiliser.
- En cas d'ambiguïté, privilégier une implémentation explicite et facile à faire évoluer.