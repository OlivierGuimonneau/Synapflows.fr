---
name: privacy-gdpr
description: Conçoit et revoit les fonctionnalités applicatives selon les principes du RGPD, notamment privacy by design, minimisation des données, protection par défaut et prise en compte des droits des personnes.
---

# Privacy GDPR skill

Utiliser cette skill dès qu'une fonctionnalité implique :
- collecte de données personnelles
- formulaire public ou formulaire de compte
- stockage de données utilisateur
- analytics, tracking ou mesure d'audience
- export, suppression ou modification de données utilisateur
- envoi de données à Airtable, CRM, emailing, analytics ou autre service tiers
- journalisation ou administration contenant des données personnelles

## Objectif
- Réduire la collecte et l'exposition inutiles de données personnelles.
- Intégrer les principes du RGPD dès la conception.
- Produire des choix techniques et fonctionnels plus sobres, plus sûrs et plus faciles à justifier.

## Principes directeurs
- appliquer une logique de privacy by design et privacy by default
- collecter uniquement les données nécessaires à la finalité du traitement
- limiter la conservation et la duplication des données
- privilégier les réglages protecteurs par défaut
- faciliter l'exercice des droits des personnes quand le traitement le requiert
- éviter d'envoyer des données personnelles à un service tiers sans nécessité claire

## Ce qu'il faut examiner
- quelles données personnelles sont collectées
- pourquoi elles sont collectées
- si chaque donnée est réellement nécessaire
- où elles sont stockées
- qui y a accès
- combien de temps elles sont conservées
- si elles sont transmises à des tiers
- si l'utilisateur peut comprendre, contrôler, corriger, exporter ou supprimer ses données quand cela s'applique

## Attendus de conception
- ne pas ajouter un champ, une table ou un événement analytics sans vérifier la finalité réelle
- distinguer les données obligatoires, optionnelles et analytiques
- éviter les collectes "au cas où"
- limiter les logs contenant des données personnelles
- documenter les flux sensibles et les intégrations recevant des données personnelles
- signaler les cas où une revue privacy plus approfondie ou une analyse d'impact peut être pertinente

## Garde-fous
- ne pas supposer qu'une donnée banale n'est pas personnelle
- ne pas considérer la conformité comme un simple sujet d'affichage ou de bannière
- ne pas précocher les consentements quand ils sont requis
- ne pas multiplier les copies de données entre backend, Airtable, CRM, emails et logs sans justification
- ne pas choisir par défaut l'option la plus intrusive pour l'utilisateur

## Sortie attendue
Quand cette skill est utilisée, fournir si pertinent :
- les points de collecte de données personnelles
- les risques de minimisation ou de conservation excessive
- les impacts éventuels sur consentement, information utilisateur et droits
- les recommandations de réduction de surface de données
- les points à documenter dans les politiques, docs internes ou revues produit

Consulter `checklist.md` pour la revue détaillée.