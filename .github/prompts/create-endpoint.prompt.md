---
mode: ask
description: Créer un endpoint backend cohérent avec l'architecture du projet
---

Je veux créer ou modifier un endpoint backend dans ce repository.

Avant de générer le code :
1. Résume l'objectif fonctionnel de l'endpoint.
2. Indique la méthode HTTP, le chemin, les entrées attendues, les validations nécessaires et la réponse attendue.
3. Propose la liste des fichiers à créer ou modifier.
4. Explique la séparation entre route, controller, service, schéma de validation, client externe et tests.

Ensuite seulement :
5. Génère une implémentation Node.js + Express + TypeScript cohérente avec les conventions du repo.
6. Garde les routes minces et place la logique métier dans des services.
7. Valide explicitement `body`, `params` et `query` avant traitement.
8. Normalise les réponses JSON de succès et d'erreur.
9. Si l'endpoint touche Airtable, passe par une couche dédiée.
10. Si l'endpoint est public, applique les contrôles de sécurité attendus: validation stricte, rate limiting, vérifications serveur et absence de secrets exposés.
11. Si l'endpoint reçoit un formulaire public, vérifier aussi les contraintes reCAPTCHA prévues par le projet.

À la fin :
12. Propose les tests backend utiles.
13. Signale les variables d'environnement, impacts documentation et risques de régression éventuels.

Contraintes :
- Ne pas hardcoder de secrets, tokens ou IDs sensibles.
- Ne pas appeler Airtable directement depuis la route.
- Préférer des noms explicites et des modules courts.
- En cas d'ambiguïté, privilégier une implémentation maintenable, défensive et facile à relire.