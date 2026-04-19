---
mode: ask
description: Créer une feature complète en respectant l'architecture du repo
---

Je veux créer une nouvelle fonctionnalité dans ce repository.

Avant de générer le code :
1. Résume brièvement l'objectif fonctionnel.
2. Propose l'arborescence ou la liste des fichiers à créer ou modifier.
3. Explique le rôle de chaque fichier.
4. Signale les impacts éventuels sur frontend, backend, Airtable, sécurité, tests, Docker ou documentation.

Ensuite seulement :
5. Génère une implémentation cohérente avec les conventions du repo.
6. Garde les routes Express minces, la logique métier dans des services et les intégrations externes dans des couches dédiées.
7. Utilise TypeScript strict et des noms explicites.
8. Si la feature touche un formulaire public, applique les règles de validation et de sécurité du projet.
9. Si la feature touche Airtable, passe par une couche d'abstraction dédiée.
10. Si la feature modifie un comportement important, propose aussi les tests et la documentation à adapter.

Contraintes :
- Ne pas hardcoder de secrets, tokens ou IDs sensibles.
- Préférer de petits modules cohérents.
- Préserver les conventions déjà présentes dans le repo.
- En cas d'ambiguïté, privilégier la solution la plus maintenable.