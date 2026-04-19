---
mode: ask
description: Créer un composant React typé, réutilisable et cohérent avec le repo
---

Je veux créer un nouveau composant React dans ce repository.

Avant de générer le code :
1. Résume brièvement le rôle du composant.
2. Propose les fichiers à créer ou modifier.
3. Explique les props, les dépendances éventuelles et les états à gérer.
4. Si le composant est lié à un formulaire, précise les impacts sur validation, accessibilité et gestion d'état.

Ensuite seulement :
5. Génère un composant React fonctionnel en TypeScript.
6. Utilise des props explicitement typées.
7. Garde le composant centré sur une seule responsabilité.
8. Préfère des sous-composants ou hooks si la logique devient trop dense.
9. Respecte les conventions visuelles et techniques déjà présentes dans le repo.
10. Si le composant concerne une UI de capture ou de contact, conserve une logique simple, claire et orientée conversion.
11. Si le composant appelle une API, isole l'appel réseau dans un service ou un hook plutôt que dans le JSX du composant.

À la fin :
12. Propose les tests utiles si le composant a une logique non triviale.
13. Signale les besoins éventuels en documentation ou en exemples d'utilisation.

Contraintes :
- Ne pas utiliser `any` sans raison solide.
- Ne pas hardcoder de secrets ni de données métier sensibles.
- Préférer une structure lisible et maintenable plutôt qu'un composant trop abstrait.
- En cas d'ambiguïté, privilégier la solution la plus simple qui reste extensible.