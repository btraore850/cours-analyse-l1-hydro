# Guide de publication — Analyse L1 Météorologie

## Accès

- Dépôt : https://github.com/btraore850/cours-analyse-l1-meteo
- Site GitHub Pages (après activation) : https://btraore850.github.io/cours-analyse-l1-meteo/

## Activer GitHub Pages

Dans le dépôt GitHub, ouvrir **Settings → Pages**, choisir **Deploy from a branch**, sélectionner la branche **main** et le dossier **/(root)**, puis enregistrer avec **Save**. Vérifier ensuite l'adresse affichée par GitHub dans les paramètres Pages.

## Ajouter un document

1. Ouvrir le dossier pertinent (par exemple `cours/` ou `td/`).
2. Cliquer sur **Add file → Upload files**.
3. Sélectionner le PDF, puis cliquer sur **Commit changes**.
4. Les liens vers les dossiers présents sur le site permettent déjà de retrouver le nouveau document.
5. Pour ajouter un lien direct au document depuis la page d'accueil, éditer `index.html` et ajouter un lien HTML de type `<a href="cours/chapitre-01.pdf">Chapitre 1 (PDF)</a>`.

## Conseils

- N'utiliser que des noms de fichiers simples (minuscules, tirets, sans espaces).
- Garder un fichier par chapitre, TD ou corrigé.
- Ne pas publier d'informations personnelles concernant les étudiants.
- Respecter les droits d'auteur des manuels et articles.
- Privilégier les PDF pour la lecture sur téléphone.

## Modifier le site

Éditer le fichier `index.html` pour mettre à jour la page d'accueil : titres, liens et consignes. Publier en effectuant un commit sur `main`.
