---
name: architecture-review
description: Analyse la structure du code, les frontières entre couches, la modularité et les risques de couplage pour proposer des améliorations maintenables.
---

# Architecture review skill

Utiliser cette skill quand il faut :
- analyser la structure d'une fonctionnalité existante
- revoir l'architecture d'un module avant extension
- identifier les responsabilités mal séparées
- préparer une refactorisation sans casser le comportement métier
- vérifier qu'une nouvelle feature respecte l'architecture du projet

## Objectif
- Évaluer la qualité structurelle du code avant ou pendant une évolution.
- Préserver une architecture claire, modulaire et maintenable.
- Réduire le couplage, la duplication et les dépendances implicites.

## Ce qu'il faut examiner
- répartition des responsabilités entre frontend, backend, services, intégrations et infra
- taille et cohérence des modules
- clarté des frontières entre routes, contrôleurs, services, schémas, clients externes et composants UI
- présence de logique métier au mauvais endroit
- duplication de logique ou de mapping
- dépendances croisées inutiles
- cohérence des conventions avec le reste du repo

## Principes
- Une route Express ne doit pas porter la logique métier principale.
- Un composant React de présentation ne doit pas concentrer appels réseau, logique métier et structure visuelle.
- Les intégrations externes doivent être encapsulées.
- Les validations doivent être explicites.
- Les modules doivent avoir des interfaces claires et des responsabilités limitées.
- Un refactoring doit chercher le plus petit changement utile avant une réorganisation plus large.

## Méthode d'analyse
1. Résumer le rôle fonctionnel de la zone étudiée.
2. Identifier les couches concernées.
3. Repérer les zones de mélange de responsabilités.
4. Repérer les duplications, dépendances implicites et couplages forts.
5. Évaluer si le découpage actuel facilite ou freine les évolutions futures.
6. Proposer des améliorations progressives, en priorisant les changements à fort gain de lisibilité ou de sécurité.

## Attendus d'une bonne revue
- Expliquer ce qui est sain avant de signaler ce qui pose problème.
- Distinguer clairement:
  - problème architectural
  - dette technique acceptable
  - amélioration optionnelle
- Proposer des changements progressifs et réalistes.
- Signaler les impacts potentiels sur tests, documentation, sécurité et déploiement.

## Garde-fous
- Ne pas proposer une réécriture complète si un refactoring local suffit.
- Ne pas introduire d'abstraction supplémentaire sans bénéfice clair.
- Ne pas casser les conventions existantes du repo sans raison solide.
- En cas de doute, privilégier la solution la plus simple qui améliore vraiment la structure.

Consulter `checklist.md` pour la grille de revue détaillée.