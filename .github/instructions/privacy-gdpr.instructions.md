---
applyTo: "**/*"
---

# Privacy and GDPR instructions

## Objectif
- Concevoir et modifier les applications du repo selon une logique de privacy by design et privacy by default.
- Réduire la collecte, l'exposition et la conservation inutiles de données personnelles.
- Préserver la conformité RGPD dans les choix de code, de flux produit, de stockage et d'intégration.

## Principes généraux
- Ne collecter que les données strictement nécessaires à la finalité métier du flux concerné.
- Si une donnée personnelle n'est pas nécessaire, ne pas la demander, ne pas la stocker et ne pas la transmettre.
- Préférer les paramètres les plus protecteurs par défaut.
- Toujours considérer les données personnelles comme sensibles par conception, même quand elles paraissent banales.

## Conception fonctionnelle
- Avant d'ajouter un champ, une table, un log, un événement analytics ou une intégration, vérifier la finalité réelle de la donnée.
- Éviter les champs superflus dans les formulaires publics et les comptes utilisateurs.
- Si une fonctionnalité traite des données personnelles, expliciter la finalité, la base fonctionnelle et le besoin de conservation.
- Prévoir une séparation claire entre données indispensables, données optionnelles et données purement analytiques.

## Consentement et transparence
- Quand un traitement repose sur le consentement, prévoir un consentement explicite, spécifique et non ambigu.
- Ne jamais précocher une case de consentement.
- Permettre le retrait du consentement quand cela s'applique.
- Ne pas conditionner inutilement une fonctionnalité à une collecte non nécessaire.
- Prévoir les éléments nécessaires à une information claire de l'utilisateur si le flux implique de la collecte de données personnelles.

## Minimisation et conservation
- Éviter de stocker plus de données que nécessaire.
- Éviter de conserver les données plus longtemps que nécessaire.
- Quand c'est pertinent, prévoir des mécanismes d'effacement, d'anonymisation ou d'archivage contrôlé.
- Ne pas multiplier les copies de données personnelles entre services sans justification claire.

## Droits des personnes
- Concevoir les flux pour permettre, quand c'est pertinent, l'accès, la rectification, la suppression et l'export des données personnelles.
- Ne pas verrouiller la donnée dans des formats ou structures qui rendent ces droits difficiles à exercer.
- Si une donnée personnelle est stockée dans plusieurs couches, penser aussi au besoin de suppression ou de mise à jour cohérente.

## Sécurité des données
- Ne jamais exposer inutilement des données personnelles dans le frontend, les logs, les erreurs, les URLs ou les outils d'administration.
- Ne pas logger en clair des payloads contenant des données personnelles si ce n'est pas strictement nécessaire.
- Préférer des identifiants techniques plutôt que des données personnelles dans les logs et corrélations.
- Appliquer le principe du moindre privilège pour les accès aux données.

## Intégrations et sous-traitants
- Avant d'envoyer des données personnelles à un service tiers, vérifier que ce transfert est réellement nécessaire.
- Limiter les données transmises aux intégrations externes au strict minimum.
- Ne pas dupliquer des données personnelles dans Airtable, analytics, CRM ou outils tiers sans justification explicite.
- Si une intégration reçoit des données personnelles, documenter au minimum les champs transmis et leur finalité.

## UX et produit
- Les interfaces doivent rester sobres sur la collecte de données.
- Ne pas inciter l'utilisateur à fournir plus d'informations que nécessaire.
- Si une donnée est optionnelle, l'indiquer clairement.
- Les paramètres par défaut doivent favoriser la confidentialité.

## Documentation et revue
- Si une feature introduit un nouveau traitement de données personnelles, signaler les impacts sur la documentation, la politique de confidentialité, la conservation ou les droits utilisateur.
- En cas de doute sur la nécessité d'une donnée, privilégier la solution la plus sobre.
- Si un flux paraît sensible, proposer une revue spécifique orientée privacy avant implémentation finale.