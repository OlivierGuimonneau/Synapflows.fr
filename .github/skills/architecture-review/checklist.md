# Architecture review checklist

Utiliser cette checklist pour revoir une feature, un module, une PR ou une zone du code.

## 1. Périmètre
- Quel est le rôle fonctionnel exact de la zone analysée ?
- Quelles couches sont concernées: frontend, backend, intégration externe, infra, documentation ?
- La revue porte-t-elle sur une feature complète ou sur un module isolé ?

## 2. Répartition des responsabilités
- Le frontend contient-il de la logique métier qui devrait vivre côté backend ou dans un service dédié ?
- Les routes Express restent-elles minces ?
- Les contrôleurs orchestrent-ils sans absorber toute la logique ?
- Les services métier sont-ils clairement identifiables ?
- Les intégrations externes sont-elles encapsulées dans une couche dédiée ?

## 3. Cohésion des modules
- Chaque module a-t-il une responsabilité claire ?
- Un fichier ou composant est-il devenu trop gros ou trop polyvalent ?
- Le découpage actuel facilite-t-il la lecture et l'évolution ?
- Existe-t-il des "god files" ou des modules trop centraux ?

## 4. Couplage
- Y a-t-il des dépendances croisées inutiles entre modules ?
- Une modification locale risque-t-elle d'avoir des effets de bord dans plusieurs couches ?
- Des détails d'implémentation d'un module fuient-ils dans d'autres modules ?
- Les composants UI, services et intégrations externes sont-ils trop fortement liés entre eux ?

## 5. Validation et contrats
- Les entrées sont-elles validées explicitement ?
- Les schémas et types sont-ils clairs et cohérents ?
- Les contrats entre couches sont-ils explicites ?
- Les réponses d'API sont-elles normalisées ?

## 6. Intégrations externes
- Airtable est-il appelé uniquement côté serveur ?
- Les mappings entre modèle applicatif et Airtable sont-ils explicites ?
- Les erreurs d'intégration sont-elles gérées proprement ?
- Les limites ou fragilités de l'intégration sont-elles prises en compte ?

## 7. Sécurité
- Des secrets ou valeurs sensibles sont-ils exposés à tort ?
- Les formulaires publics passent-ils bien par les garde-fous prévus ?
- La validation serveur est-elle réellement présente ?
- Les logs et réponses d'erreur restent-ils sobres ?
- Les endpoints publics ont-ils des protections adaptées ?

## 8. Maintenabilité
- Les noms de modules, fonctions et types sont-ils explicites ?
- Existe-t-il de la duplication évitable ?
- Le code suit-il les conventions déjà visibles dans le repo ?
- Une future évolution demandera-t-elle trop de modifications dispersées ?
- Le changement proposé améliore-t-il vraiment la structure ou ajoute-t-il une abstraction inutile ?

## 9. Testabilité
- La structure actuelle facilite-t-elle l'écriture de tests utiles ?
- Les dépendances externes peuvent-elles être mockées proprement ?
- Les comportements critiques sont-ils isolés de manière testable ?
- Une régression importante serait-elle détectable avec les tests actuels ?

## 10. Documentation et exploitation
- Les choix non évidents sont-ils documentés si nécessaire ?
- Les changements impactent-ils le README, les docs d'architecture, les variables d'environnement ou le déploiement ?
- Le nommage infra et applicatif reste-t-il cohérent avec le domaine du projet ?

## 11. Classification des constats
Classer les retours dans l'une des catégories suivantes :
- `Positive` : bon pattern à conserver
- `Suggestion` : amélioration utile mais non critique
- `Concern` : fragilité ou dette qui risque de coûter plus tard
- `Violation` : non-respect clair des conventions ou de l'architecture attendue

## 12. Sortie attendue
À la fin d'une revue d'architecture, fournir :
- un résumé du rôle de la zone analysée
- les points sains à conserver
- les principaux problèmes identifiés
- les risques de régression ou de complexité future
- les améliorations recommandées, par ordre de priorité
- les impacts éventuels sur tests, sécurité, documentation et déploiement