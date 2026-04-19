# Deployment notes

Ce document décrit les conventions pratiques de déploiement Docker + VPS + Traefik utilisées dans le projet.

## 1. Hypothèses d'infrastructure

- Le projet est déployé sur un VPS mutualisé.
- Traefik existe déjà ou fait partie d'une infrastructure déjà en place.
- D'autres applications peuvent coexister sur le serveur, notamment n8n.
- Le projet doit donc éviter toute collision de ports, de noms et de labels.

## 2. Réseau Docker

Préférer un réseau Docker externe partagé avec Traefik.

Exemple :
- `n8n-https_default`
- `traefik_proxy`
- autre nom explicite déjà utilisé en production

Règles :
- connecter le service applicatif au réseau externe attendu
- déclarer le réseau comme `external: true`
- si plusieurs réseaux sont utilisés, préciser explicitement le réseau Traefik avec `traefik.docker.network`

## 3. Nommage

Toujours préfixer les noms avec le projet ou le domaine.

Préférer :
- `synapflows-www`
- `synapratings-www`
- `synapflows-api`
- `synapratings-router`

Éviter :
- `web`
- `app`
- `api`
- `router`
- `frontend`

Le même principe vaut pour :
- `container_name`
- noms de services compose
- routeurs Traefik
- middlewares Traefik
- services Traefik

## 4. Ports

Pour une application derrière Traefik :
- préférer `expose`
- éviter `ports` sauf besoin technique explicite
- garder un port interne clair et documenté

Exemple logique :
- application Node écoute sur `5000`
- compose utilise `expose: "5000"`
- Traefik route vers `traefik.http.services.<name>.loadbalancer.server.port=5000`

## 5. Labels Traefik

Prévoir au minimum :
- `traefik.enable=true`
- `traefik.docker.network=<nom-du-réseau>`
- `traefik.http.routers.<router>.rule=Host(\`domaine\`)`
- `traefik.http.routers.<router>.entrypoints=websecure`
- `traefik.http.routers.<router>.tls=true`
- `traefik.http.routers.<router>.tls.certresolver=<resolver>`
- `traefik.http.services.<service>.loadbalancer.server.port=<port-interne>`

Règles :
- le nom du router doit être unique
- le nom du service Traefik doit être unique
- le domaine doit être exact
- éviter les labels copiés-collés d'un autre projet sans adaptation
- ne jamais mettre de secret dans les labels

## 6. Variables d'environnement utiles

Documenter dans `.env.example` ou dans la doc :
- `APP_DOMAIN`
- `PORT`
- `TRAEFIK_NETWORK`
- `TRAEFIK_CERTRESOLVER`

Selon le projet, ajouter aussi :
- variables Airtable
- variables reCAPTCHA
- variables de runtime applicatif

## 7. Dockerfile

Préférer :
- build multi-stage
- image runtime légère
- copie minimale des artefacts
- `NODE_ENV=production`
- healthcheck si pertinent

Éviter :
- images inutilement lourdes
- dépendances de développement dans le runtime final
- variables sensibles directement hardcodées dans le Dockerfile

## 8. Vérifications post-déploiement

Après déploiement, vérifier au minimum :
- le conteneur démarre sans erreur
- Traefik découvre bien le service
- le domaine répond en HTTPS
- le certificat TLS est correct
- le routage atteint bien l'application
- les formulaires fonctionnent
- les appels backend critiques répondent correctement
- aucune collision avec un autre service du VPS n'est visible

## 9. Erreurs fréquentes à éviter

- routeur Traefik avec un nom déjà utilisé ailleurs
- oubli du réseau externe
- mauvais domaine dans la règle `Host(...)`
- `ports` exposés inutilement alors que Traefik suffit
- oubli du port interne dans `loadbalancer.server.port`
- labels copiés depuis un autre projet sans renommage
- confusion entre nom de service compose et nom de service Traefik
- absence de documentation des variables requises

## 10. Sortie attendue quand on prépare un déploiement

Quand une configuration de déploiement est générée, fournir si possible :
- le Dockerfile
- le fichier compose
- les variables d'environnement attendues
- les labels Traefik
- la liste des vérifications manuelles à effectuer après mise en ligne