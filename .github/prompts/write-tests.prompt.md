---
mode: ask
description: Générer des tests utiles et maintenables pour un module existant
---

Je veux écrire ou compléter les tests pour un module de ce repository.

Avant de générer les tests :
1. Résume le comportement attendu du module ou de la fonction ciblée.
2. Identifie les scénarios principaux à couvrir.
3. Liste les cas limites, validations, erreurs attendues et effets de bord éventuels.
4. Repère les dépendances externes à mocker proprement.
5. Indique le type de tests le plus adapté: unitaires, intégration ou les deux.

Ensuite seulement :
6. Génère des tests ciblés, lisibles et maintenables avec le framework déjà utilisé dans le repo.
7. Respecte les patterns de test déjà présents dans le projet.
8. Utilise des noms de tests explicites, orientés comportement.
9. Teste le comportement attendu plutôt que les détails d'implémentation.
10. Pour les services ou intégrations externes, mocker proprement les dépendances.
11. Pour le frontend, privilégier des tests centrés sur le rendu utile, l'accessibilité, les interactions et les états visibles.
12. Pour le backend, couvrir les validations, erreurs, réponses attendues et effets de bord utiles.

À la fin :
13. Résume les scénarios couverts.
14. Signale les angles morts éventuels ou les cas qui mériteraient d'autres tests.
15. Si les tests révèlent une faiblesse de structure du module, le signaler séparément sans mélanger immédiatement avec un refactoring.

Contraintes :
- Ne pas inventer un framework de test différent si un framework existe déjà dans le repo.
- Ne pas écrire des tests couplés à l'implémentation interne si un test de comportement est possible.
- Ne pas ajouter de complexité inutile dans les mocks ou le setup.
- En cas d'ambiguïté, privilégier quelques tests robustes plutôt qu'une grande quantité de tests faibles.