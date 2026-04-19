---
mode: ask
description: Refactorer un module sans casser le comportement attendu
---

Je veux refactorer un module existant dans ce repository.

Avant de proposer du code :
1. Résume le rôle actuel du module.
2. Identifie les problèmes principaux éventuels: lisibilité, duplication, couplage, complexité, taille, noms peu explicites, mélange des responsabilités.
3. Dis clairement ce qui peut être amélioré sans changer le comportement fonctionnel.
4. Propose un plan de refactorisation par étapes.
5. Signale les risques de régression et les tests à sécuriser avant modification.

Ensuite seulement :
6. Refactore le code en préservant le comportement existant.
7. Privilégie des changements progressifs et faciles à relire.
8. Si nécessaire, découpe le module en fonctions, hooks, services ou sous-composants plus petits.
9. Améliore les noms, la structure et la lisibilité sans introduire d'abstraction inutile.
10. Respecte les conventions existantes du repo.
11. Si le refactoring touche un endpoint, un formulaire ou une intégration Airtable, conserve les validations, garde-fous et contraintes de sécurité déjà attendus.

À la fin :
12. Résume ce qui a été amélioré.
13. Liste les fichiers modifiés.
14. Propose les tests à ajouter ou à adapter pour verrouiller le comportement actuel.

Contraintes :
- Ne pas changer le comportement métier sans le signaler explicitement.
- Ne pas mélanger refactoring et nouvelle feature sauf demande explicite.
- Ne pas supprimer un garde-fou de validation, de sécurité ou d'intégration sans justification.
- En cas d'ambiguïté, privilégier le plus petit refactoring utile.