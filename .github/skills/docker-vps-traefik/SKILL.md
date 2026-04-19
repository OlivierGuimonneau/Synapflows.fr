---
name: docker-vps-traefik
description: Prépare des déploiements Docker sur VPS avec Traefik, réseau externe, labels explicites, TLS et prévention des collisions entre services.
---

# Docker VPS Traefik skill

Utiliser cette skill quand il faut :
- créer ou corriger un Dockerfile de production
- créer ou corriger un fichier docker-compose pour un déploiement VPS
- configurer une application derrière Traefik
- éviter des collisions avec d'autres stacks déjà présentes sur le serveur
- préparer une configuration compatible avec TLS, réseau Docker externe et reverse proxy existant

## Objectif
- Produire une configuration de déploiement sobre, robuste et lisible.
- Préserver la compatibilité avec un VPS mutualisé hébergeant déjà d'autres services.
- Réduire les risques de conflits de ports, de labels Traefik, de noms de conteneurs et de réseaux.

## Principes
- Préférer des images Docker multi-stage quand cela améliore le runtime final.
- Ne pas exposer publiquement un port si Traefik peut router le trafic via un réseau Docker.
- Préférer `expose` à `ports` pour un service applicatif derrière reverse proxy.
- Utiliser un réseau Docker externe explicite si l'infrastructure existante le requiert.
- Utiliser des noms de services, conteneurs, routers, middlewares et labels spécifiques au projet.

## Règles Traefik
- Chaque domaine doit avoir un routeur Traefik explicitement nommé.
- Les labels doivent être lisibles et propres au projet.
- Les noms de routers et services Traefik doivent être uniques.
- Le domaine ciblé doit être clair dans la règle `Host(...)`.
- Le port interne du service doit être renseigné explicitement dans le load balancer.
- Le resolver TLS doit être cohérent avec l'infrastructure déjà en place.
- Ne pas mettre de secrets dans les labels Docker.

## Règles Docker Compose
- Garder les fichiers compose lisibles et explicites.
- Externaliser les valeurs variables dans l'environnement.
- Éviter les options inutiles ou non maîtrisées.
- Utiliser des conventions de nommage cohérentes avec le domaine ou le projet.
- Si plusieurs stacks coexistent, éviter toute collision de noms.

## Règles VPS mutualisé
- Supposer que n8n et d'autres applications existent déjà.
- Ne pas réutiliser des noms de routeurs, middlewares, conteneurs ou réseaux déjà génériques.
- Ne pas exposer de dashboard ou d'interface interne sans besoin explicite.
- Réduire la surface d'exposition au strict nécessaire.
- Préférer une configuration facile à auditer et à diagnostiquer.

## Variables d'environnement
- Externaliser les domaines, ports internes, noms de réseau externe et resolver TLS quand c'est pertinent.
- Documenter les variables nécessaires dans `.env.example` et les docs de déploiement.
- Ne jamais hardcoder un secret ou une valeur d'infrastructure sensible si elle doit varier entre environnements.

## Ce qu'il faut produire
Quand cette skill est utilisée, fournir si pertinent :
- un Dockerfile de production
- un ou plusieurs fichiers compose
- les labels Traefik nécessaires
- la liste des variables d'environnement attendues
- les points de vigilance de déploiement
- une procédure de vérification post-déploiement

## Garde-fous
- Ne pas utiliser de noms trop génériques comme `app`, `web`, `router` ou `service` sans préfixe projet.
- Ne pas supposer que le service est seul sur le serveur.
- Ne pas mélanger secrets et labels.
- Ne pas choisir une configuration plus complexe qu'une solution simple et robuste.

Consulter `deployment-notes.md` pour les conventions pratiques de déploiement.