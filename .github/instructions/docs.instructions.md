---
applyTo: "**/*.{md,mdx}"
---

# Documentation instructions

## Objectif
- Produire une documentation claire, utile, concise et maintenable.
- Aider un développeur ou un exploitant à comprendre rapidement le projet, le lancer localement, le configurer et le déployer.
- Documenter les décisions importantes sans noyer le lecteur dans du texte inutile.

## README
- Le README doit rester synthétique et orienté action.
- Il doit expliquer clairement:
  - ce que fait le projet
  - la stack principale
  - comment lancer le projet localement
  - quelles variables d'environnement sont requises
  - comment builder ou déployer
- Si une explication devient longue, créer un document dédié dans `docs/` plutôt que surcharger le README.

## Documentation technique
- Préférer plusieurs petits documents ciblés plutôt qu'un seul fichier trop dense.
- Documenter explicitement les points non évidents:
  - architecture
  - intégration Airtable
  - sécurité formulaires
  - reCAPTCHA
  - déploiement Docker / Traefik
  - exploitation VPS
- Utiliser des titres explicites et une structure facile à scanner.

## Style rédactionnel
- Écrire en français simple et direct, sauf contrainte spécifique du repo.
- Préférer des phrases courtes et des listes lisibles.
- Éviter le jargon inutile et les formulations vagues.
- Expliquer les prérequis, hypothèses et limites quand ils ont un impact réel.

## Commandes et exemples
- Toute commande doit être réaliste, testable et cohérente avec la structure du repo.
- Quand une commande dépend d'un contexte, le préciser.
- Ne pas inventer de scripts npm, chemins ou variables si rien ne les justifie dans le projet.
- Préférer des exemples minimaux mais exploitables.

## Cohérence
- Les noms des fichiers, dossiers, variables d'environnement et services doivent être cohérents avec le code réel.
- Si une documentation décrit une architecture ou un flux, elle doit correspondre aux conventions réellement utilisées dans le repo.
- Si une modification de code change le setup, le déploiement ou une intégration importante, proposer aussi la mise à jour de la documentation concernée.

## Exploitation
- Pour les sujets de production, documenter au minimum:
  - prérequis
  - variables d'environnement
  - commandes de build / run
  - points de vigilance
  - procédures de vérification simples
- Si une configuration peut casser un autre service du VPS, le signaler explicitement.

## Maintenabilité
- Préférer une documentation sobre, exacte et facile à mettre à jour.
- Si une section devient obsolète ou dupliquée, proposer de la simplifier ou de la déplacer.
- En cas d'arbitrage entre exhaustivité théorique et utilité pratique, privilégier l'utilité pratique.