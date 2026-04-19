# Component guidelines

Ce document décrit les conventions de conception et de composition des composants UI du projet.

## 1. Principe général

Un composant doit être :
- lisible
- typé
- réutilisable
- accessible
- centré sur une responsabilité claire

Préférer des composants simples et composables plutôt qu'un composant unique trop paramétré.

## 2. Props

Règles :
- typer explicitement les props
- éviter `any`
- limiter les props à ce qui est réellement utile
- préférer des noms explicites
- éviter les props floues comme `data`, `config`, `options` si leur structure n'est pas claire

Préférer :
- `title`
- `description`
- `onSubmit`
- `isLoading`
- `variant`

Éviter :
- `payload`
- `misc`
- `obj`
- `stateData`

## 3. Variants

Les variants sont utiles, mais doivent rester compréhensibles.

Règles :
- garder peu de variants
- utiliser des noms cohérents
- éviter des combinaisons illisibles ou trop nombreuses
- ne pas transformer un composant simple en moteur de configuration

Préférer :
- `variant="primary"`
- `variant="secondary"`
- `size="sm" | "md" | "lg"`

Éviter :
- une explosion de variantes peu utilisées
- des props redondantes qui se contredisent

## 4. Composition

Préférer :
- la composition de plusieurs composants simples
- l'extraction d'un hook pour la logique dense
- l'extraction d'un composant enfant pour une sous-partie répétée

Exemples de structure saine :
- `Button`
- `FormField`
- `SectionHeader`
- `StatusMessage`
- `LeadCaptureForm`

Éviter :
- un composant de page contenant toute la logique, tous les champs et tous les messages
- des composants "utilitaires visuels" mal nommés et réutilisés n'importe où

## 5. Présentation vs logique

Quand c'est pertinent :
- les composants de présentation rendent l'UI
- les hooks gèrent la logique d'état ou de chargement
- les services ou clients gèrent les appels externes

Éviter :
- les appels réseau directement dans du JSX complexe
- la logique métier dispersée dans des composants purement visuels
- les transformations de données répétées dans plusieurs composants

## 6. Accessibilité

Toujours vérifier :
- usage d'éléments HTML sémantiques
- labels explicites
- états `disabled`, `loading`, `error`
- navigation clavier minimale
- focus visible
- messages d'erreur compréhensibles

Préférer :
- `<button>` pour une action
- `<a>` pour une navigation
- `<label>` associé à chaque champ
- `aria-*` seulement quand le HTML natif ne suffit pas

## 7. Formulaires

Pour les composants formulaire :
- garder une hiérarchie visuelle claire
- afficher les erreurs près du champ concerné
- afficher un état de soumission compréhensible
- ne pas perdre la saisie utilisateur en cas d'erreur
- mutualiser la structure `label + champ + aide + erreur` quand elle revient souvent

Composants souvent utiles :
- `TextField`
- `TextareaField`
- `SelectField`
- `CheckboxField`
- `FormActions`
- `InlineError`
- `FormStatusMessage`

## 8. Sections marketing ou landing

Pour les sections de page :
- garder un message principal clair
- une action principale visible
- une structure simple à scanner
- une hiérarchie nette entre titre, preuve, détails et CTA

Composants fréquents :
- `HeroSection`
- `FeatureGrid`
- `ProofSection`
- `PricingBlock`
- `FaqSection`
- `ContactSection`

Éviter :
- des blocs trop décoratifs sans utilité claire
- plusieurs CTA principaux concurrents dans la même zone
- un excès de variations visuelles entre sections voisines

## 9. Cartes, messages et feedbacks

Pour les cartes :
- garder un titre clair
- un contenu court
- une action identifiable
- une structure cohérente entre cartes d'une même famille

Pour les messages :
- distinguer clairement succès, erreur, info et warning
- réutiliser les mêmes patterns visuels et textuels dans tout le projet

## 10. Documentation minimale d'un composant partagé

Quand un composant devient partagé, documenter au minimum :
- son rôle
- ses props
- ses variants
- un exemple d'utilisation
- ses contraintes d'accessibilité éventuelles

## 11. Garde-fous

- ne pas créer un composant partagé trop tôt si le besoin n'est pas stabilisé
- ne pas introduire des abstractions visuelles difficiles à comprendre
- ne pas mélanger logique métier forte et présentation simple
- en cas d'ambiguïté, privilégier le composant le plus simple qui reste réutilisable