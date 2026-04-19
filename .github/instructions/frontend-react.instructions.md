---
applyTo: "frontend/src/**/*.{ts,tsx},src/**/*.{ts,tsx}"
---

# Frontend React instructions

## Objectif
- Produire une interface React claire, modulaire, maintenable et cohérente avec le positionnement premium et professionnel de SynapFlows.
- Favoriser une expérience utilisateur fluide, rassurante et orientée conversion.

## Structure des composants
- Utiliser des composants fonctionnels React avec TypeScript.
- Garder chaque composant centré sur une seule responsabilité.
- Préférer des composants petits et composables plutôt que des composants massifs.
- Extraire la logique réutilisable dans des hooks ou services dédiés.
- Éviter de mélanger structure visuelle, logique métier et appels réseau dans un même fichier.

## Organisation frontend
- Séparer clairement les composants de présentation, les hooks, les services API, les types et les utilitaires.
- Si un composant devient trop dense, proposer une découpe en sous-composants ou hooks.
- Les appels réseau ne doivent pas être dispersés dans de multiples composants UI si un service dédié est plus propre.

## Qualité UI
- Les interfaces doivent être sobres, lisibles et crédibles.
- Privilégier une hiérarchie visuelle claire: promesse, bénéfices, preuve, appel à l'action.
- Éviter les effets décoratifs inutiles, les interfaces surchargées et les patterns difficiles à maintenir.
- Prévoir une UX cohérente sur desktop et mobile.

## États d'interface
- Prévoir explicitement les états loading, success, error et empty quand ils sont pertinents.
- Les messages d'erreur doivent être compréhensibles, sobres et orientés utilisateur.
- Les états de soumission de formulaire doivent être visibles et non ambigus.

## Formulaires
- Les formulaires doivent être rapides à comprendre et à compléter.
- Limiter le nombre de champs au strict nécessaire.
- Utiliser des labels explicites, des placeholders sobres et des messages d'aide utiles.
- Favoriser la conversion sans compromettre la clarté ni la confiance.
- Prévoir des composants facilement réutilisables entre sections ou pages.

## Accessibilité
- Utiliser une structure HTML sémantique.
- Associer chaque champ de formulaire à un label.
- Prévoir des textes alternatifs, des titres cohérents et une navigation clavier correcte.
- Ne pas dépendre uniquement de la couleur pour transmettre une information importante.

## Style de code
- Préférer des props explicitement typées.
- Éviter les types implicites fragiles ou les `any`.
- Utiliser des noms de composants, props et fonctions explicites.
- Préférer des retours JSX simples et lisibles.
- Si une logique conditionnelle devient complexe, l'extraire dans des variables intermédiaires ou des sous-composants.

## Cohérence projet
- Préserver les conventions visuelles et techniques déjà présentes dans le repo.
- Si un nouveau composant partage une logique ou un style avec un composant existant, partir de l'existant plutôt que recréer un pattern différent.
- En cas d'hésitation entre rapidité et cohérence long terme, privilégier la cohérence long terme.