---
applyTo: "**/{Dockerfile,docker-compose.yml,docker-compose.yaml,compose.yml,compose.yaml,deploy/*.yml,deploy/*.yaml}"
---

# Docker and DevOps instructions

## Objectif
- Produire une configuration Docker fiable, lisible et compatible avec un déploiement sur VPS mutualisé.
- Préserver la compatibilité avec un reverse proxy Traefik et un réseau Docker externe déjà existant.
- Réduire les risques de collision avec n8n et les autres applications déjà présentes sur le serveur.

## Dockerfile
- Préférer des builds multi-stage pour séparer installation, build et runtime.
- Réduire au maximum la taille de l'image finale.
- Copier uniquement les artefacts nécessaires dans l'image de production.
- Éviter d'embarquer les dépendances de développement dans l'image runtime si elles ne sont pas nécessaires.
- Prévoir un conteneur runtime simple, prévisible et orienté production.
- Utiliser `.dockerignore` pour limiter le contexte de build.

## Runtime
- Prévoir un port interne configurable via variable d'environnement.
- Ne pas supposer que le service sera exposé directement sur Internet.
- Préférer `expose` quand le service passe par Traefik, plutôt que des mappings de ports publics inutiles.
- Ajouter un healthcheck si cela améliore la robustesse opérationnelle.

## Docker Compose
- Utiliser des noms de services, conteneurs, réseaux, routers, middlewares et labels spécifiques au projet pour éviter toute collision.
- Prévoir une structure compatible avec un réseau Docker externe existant.
- Ne pas créer de configuration qui entre en conflit avec une autre stack déjà déployée sur le VPS.
- Garder les fichiers compose lisibles, explicites et faciles à maintenir.
- Préférer une configuration sobre plutôt qu'une multiplication d'options non utilisées.

## Traefik
- Être compatible avec un reverse proxy Traefik déjà en place.
- Utiliser des labels explicites et stables.
- Associer clairement chaque routeur au bon domaine.
- Utiliser des noms de routeurs et de services Traefik uniques au projet.
- Prévoir une configuration TLS cohérente avec le resolver déjà utilisé sur le serveur.
- Éviter les règles ambiguës, génériques ou réutilisées entre plusieurs projets.

## Variables d'environnement
- Toute valeur variable selon l'environnement doit être externalisée.
- Documenter les variables nécessaires au build et au runtime.
- Ne jamais hardcoder de secrets, credentials, domaines privés ou chemins sensibles.
- Prévoir des exemples cohérents dans `.env.example`.

## Production et sécurité
- Ne pas exposer de ports, dashboards ou interfaces internes sans nécessité explicite.
- Éviter les configurations permissives par défaut.
- Garder une configuration simple à auditer.
- Si une décision infra n'est pas évidente, l'expliquer brièvement dans la documentation ou les commentaires.

## Maintenabilité
- Si plusieurs fichiers de déploiement existent, conserver une convention de nommage cohérente.
- Si une stack est dédiée à un domaine précis, refléter ce domaine dans les noms de services et labels.
- En cas d'arbitrage entre rapidité et robustesse de déploiement, privilégier la robustesse.