# Privacy & GDPR checklist

Utiliser cette checklist pour toute fonctionnalité qui traite des données personnelles.

## 1. Champ d'application
- La fonctionnalité traite-t-elle des données personnelles ?
- S'agit-il de données collectées directement, déduites, importées ou enrichies ?
- La feature implique-t-elle un formulaire, un compte, une recherche, un export, un log, une intégration tierce ou de l'analytics ?

## 2. Finalité
- La finalité du traitement est-elle clairement définie ?
- Chaque donnée collectée a-t-elle une utilité réelle pour cette finalité ?
- Une donnée demandée "au cas où" peut-elle être supprimée ?
- La fonctionnalité peut-elle fonctionner avec moins de données ?

## 3. Minimisation
- Le formulaire ou le flux demande-t-il uniquement les champs nécessaires ?
- Les champs optionnels sont-ils réellement optionnels ?
- Les données inutiles ne sont-elles ni stockées ni transmises ?
- Les logs et messages d'erreur évitent-ils d'exposer des données personnelles ?
- Les copies de données entre systèmes sont-elles limitées ?

## 4. Base de traitement et transparence
- Le traitement repose-t-il sur une base appropriée ?
- Si le consentement est requis, est-il explicite, spécifique et non précoché ?
- L'utilisateur est-il informé de manière claire de la collecte et de sa finalité ?
- Les éléments de transparence nécessaires sont-ils fournis dans l'interface ou la documentation produit ?

## 5. Conservation
- Une durée de conservation existe-t-elle pour cette catégorie de données ?
- Existe-t-il une règle d'effacement, d'archivage ou d'anonymisation ?
- Les données dépassées peuvent-elles être supprimées automatiquement ?
- Les backups, exports et caches ont-ils aussi été considérés si pertinent ?
- La conservation est-elle proportionnée à la finalité ?

## 6. Accès et sécurité
- L'accès aux données est-il limité au strict nécessaire ?
- Les secrets sont-ils séparés des données personnelles ?
- Les données sensibles ne sont-elles pas visibles dans le frontend, les URLs ou les logs ?
- Les intégrations tierces n'ont-elles accès qu'au minimum nécessaire ?
- Les droits d'accès sont-ils cohérents avec les rôles réels dans le système ?

## 7. Sous-traitants et services tiers
- Une donnée personnelle est-elle envoyée à un service tiers ?
- Cette transmission est-elle nécessaire ?
- Les champs transmis sont-ils minimisés ?
- Le service tiers est-il documenté comme recevant ces données ?
- Le traitement reste-t-il cohérent avec la finalité annoncée ?

## 8. Droits des personnes
- Le système permet-il, quand c'est pertinent, l'accès aux données ?
- La rectification est-elle possible ?
- La suppression peut-elle être effectuée sans incohérence majeure ?
- L'export des données est-il envisageable si le produit le nécessite ?
- Les exceptions légales éventuelles sont-elles signalées dans la doc ou la logique métier ?

## 9. UX et paramètres par défaut
- Les réglages par défaut sont-ils les plus protecteurs raisonnables ?
- Les consentements sont-ils présentés de manière claire ?
- L'utilisateur peut-il refuser ce qui n'est pas nécessaire sans bloquer injustement le service ?
- Les formulaires évitent-ils la surcharge de collecte ?
- Les champs sensibles sont-ils demandés uniquement quand c'est utile ?

## 10. Documentation
- Les données collectées et leur finalité sont-elles documentées si nécessaire ?
- Les durées de conservation sont-elles documentées ?
- Les tiers impliqués sont-ils listés ?
- Les variables d'environnement ou paramètres de configuration liés à la privacy sont-ils expliqués ?
- Un changement de flux nécessite-t-il une mise à jour de la politique de confidentialité ou des docs internes ?

## 11. Tests et vérifications
- Les comportements de suppression, d'export ou de retrait de consentement sont-ils testables ?
- Les flux sensibles ont-ils des cas de test appropriés ?
- Les erreurs liées aux données personnelles ne divulguent-elles rien de sensible ?
- Les règles de minimisation sont-elles respectées dans les payloads de test ?

## 12. Décision finale
Classer la feature dans l'une des catégories suivantes :
- `OK` : conforme aux objectifs de privacy by design et de minimisation.
- `Needs adjustment` : des modifications sont nécessaires avant implémentation finale.
- `High risk` : la feature introduit un traitement trop large, trop opaque ou trop sensible.
- `Review required` : une revue privacy plus approfondie est recommandée.

## 13. Sortie attendue
À la fin d'une revue privacy/GDPR, fournir :
- les données personnelles concernées
- la finalité du traitement
- les points de minimisation possibles
- les risques de conservation excessive
- les tiers impliqués
- les impacts éventuels sur consentement, droits des personnes, documentation et sécurité
- les recommandations de réduction de surface de données