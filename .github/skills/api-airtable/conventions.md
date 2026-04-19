# Airtable conventions

Ce document décrit les conventions à appliquer dans le projet pour toute intégration Airtable.

## 1. Principe général

Le modèle applicatif interne ne doit pas dépendre directement du nom exact des champs Airtable.

Toujours distinguer :
- les types métiers internes
- les payloads envoyés à Airtable
- les records bruts reçus depuis Airtable
- les données normalisées retournées au reste de l'application

## 2. Nommage recommandé

### Types internes
Utiliser des noms explicites côté application :
- `LeadInput`
- `LeadRecord`
- `CreateLeadPayload`
- `AirtableLeadFields`
- `AirtableLeadRecord`

### Fonctions
Préférer des noms qui indiquent clairement le rôle :
- `mapLeadToAirtableFields`
- `mapAirtableRecordToLead`
- `createLeadInAirtable`
- `findLeadByEmailInAirtable`
- `updateLeadStatusInAirtable`

Éviter les noms trop vagues comme :
- `sendToAirtable`
- `saveRecord`
- `processData`

## 3. Mapping des champs

Toujours mapper explicitement les champs applicatifs vers les champs Airtable.

Exemple :

```ts
type LeadInput = {
  name: string;
  email: string;
  company?: string;
  message?: string;
};

type AirtableLeadFields = {
  Name: string;
  Email: string;
  Company?: string;
  Message?: string;
};

function mapLeadToAirtableFields(input: LeadInput): AirtableLeadFields {
  return {
    Name: input.name,
    Email: input.email,
    Company: input.company,
    Message: input.message,
  };
}
```

Règles :
- ne jamais propager un objet brut applicatif directement vers Airtable
- ne jamais supposer que `name` côté app correspond à `name` côté Airtable
- centraliser le mapping dans une fonction dédiée
- si le mapping devient complexe, le déplacer dans un dossier `mappers/`

## 4. Lecture et normalisation

Ne pas exposer des records Airtable bruts au reste de l'application.

Toujours normaliser la donnée en sortie.

Exemple :

```ts
type LeadRecord = {
  id: string;
  name: string;
  email: string;
  company?: string;
  message?: string;
};

function mapAirtableRecordToLead(record: AirtableRecord<AirtableLeadFields>): LeadRecord {
  return {
    id: record.id,
    name: record.fields.Name ?? "",
    email: record.fields.Email ?? "",
    company: record.fields.Company,
    message: record.fields.Message,
  };
}
```

Règles :
- toujours lire les champs de manière défensive
- prévoir les champs manquants ou incomplets
- ne pas faire fuiter les noms de colonnes Airtable dans toute l'application

## 5. Gestion des erreurs

Les erreurs Airtable doivent être :
- capturées dans la couche d'intégration ou de service
- reformulées côté métier si nécessaire
- sobres côté client
- utiles côté logs serveur sans exposer de secrets

Éviter :
- de renvoyer directement une erreur brute Airtable au frontend
- de masquer silencieusement une erreur d'écriture
- de mélanger erreur de validation et erreur d'intégration

## 6. Structure recommandée

Quand l'intégration grossit, viser une structure de ce type :

```text
backend/src/
  config/
    airtable.ts
  clients/
    airtableClient.ts
  mappers/
    leadAirtableMapper.ts
  services/
    leadService.ts
  schemas/
    leadSchema.ts
```

## 7. Cas formulaires publics

Pour toute écriture issue d'un formulaire public :
- valider les données en backend
- vérifier les garde-fous de sécurité du projet
- exécuter reCAPTCHA côté serveur si le flux l'exige
- ne créer le record Airtable qu'après validation complète

## 8. Robustesse

Éviter :
- les appels Airtable dans des boucles non contrôlées
- les mappings copiés-collés dans plusieurs fichiers
- les noms de tables ou de champs dispersés partout dans le code

Préférer :
- une configuration centralisée
- des fonctions de mapping dédiées
- des services métier lisibles
- une documentation minimale dès qu'un flux Airtable devient important

## 9. Documentation minimale attendue

Dès qu'un flux Airtable important est ajouté, documenter au minimum :
- la table concernée
- les champs utilisés
- le sens du mapping
- les validations critiques
- les variables d'environnement requises