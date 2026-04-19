---
name: ui-patterns
description: Conçoit des composants et patterns UI React réutilisables, lisibles, accessibles et cohérents avec le design system du projet.
---

# UI patterns skill

Utiliser cette skill quand il faut :
- créer un composant UI réutilisable
- structurer une section frontend
- améliorer la cohérence visuelle d'une feature
- revoir la composition d'une interface React
- éviter les composants trop gros ou trop couplés

## Objectif
- Produire une UI claire, cohérente et maintenable.
- Favoriser la réutilisabilité des composants.
- Réduire les duplications et les composants trop spécialisés.
- Préserver l'accessibilité et la lisibilité de l'interface.

## Principes
- Préférer la composition à un composant monolithique.
- Donner à chaque composant une responsabilité claire.
- Distinguer les composants de présentation, les composants de composition et les hooks de logique si nécessaire.
- Réutiliser les patterns existants du repo avant d'introduire une nouvelle variante.
- Garder des props explicites, typées et limitées à l'essentiel.

## Structure recommandée
Quand c'est pertinent, organiser l'UI par niveaux :
- composants de base réutilisables
- composants composés
- sections ou blocs métier
- pages ou écrans

## Conception des composants
- Nommer les composants selon leur rôle réel.
- Éviter les composants fourre-tout.
- Préférer plusieurs composants simples à un composant trop configurable.
- Extraire un hook si la logique d'état devient dense.
- Extraire un composant enfant si une sous-partie devient réutilisable ou trop volumineuse.

## Accessibilité
- Utiliser des éléments HTML sémantiques quand c'est possible.
- Prévoir labels, titres, messages d'erreur et feedbacks compréhensibles.
- Vérifier les états focus, disabled, loading et error.
- Ne pas construire une UI uniquement visuelle sans logique d'accessibilité de base.

## Cohérence visuelle
- Respecter les conventions du design system existant.
- Garder une hiérarchie visuelle claire entre titre, texte, action principale et feedback.
- Réutiliser les variantes existantes de boutons, champs, cartes et messages.
- Éviter l'accumulation de petites variations visuelles non justifiées.

## Garde-fous
- Ne pas créer un nouveau composant partagé si un composant existant couvre déjà le besoin.
- Ne pas abstraire trop tôt.
- Ne pas mélanger logique métier lourde, appels API et rendu visuel dans un composant de présentation.
- En cas d'ambiguïté, privilégier la version la plus simple, lisible et réutilisable.

Consulter `component-guidelines.md` pour les patterns détaillés.