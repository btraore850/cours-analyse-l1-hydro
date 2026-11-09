# Guide de publication — Licence 1 Hydrologie

## Adresse du site
https://btraore850.github.io/cours-analyse-l1-hydro/

Le dépôt GitHub est https://github.com/btraore850/cours-analyse-l1-hydro. Dans **Settings → Pages**, choisir la branche `main` et le dossier `/(root)`.

## Ajouter un support

1. Importer le fichier PDF dans `cours/`, `presentations/`, `td/`, `tp/` ou `corriges/`.
2. Mettre à jour le fichier `index.html` du dossier concerné et y ajouter un lien vers le document.
3. Vérifier que le lien pointe vers un fichier réel et que le déploiement GitHub Pages est terminé.

**Éviter de créer des liens étudiants directement vers `README.md` :** GitHub Pages peut l'afficher sous forme de texte Markdown brut.

## Architecture

- Accueil : `index.html`.
- Programme détaillé : `programme.html`, présentation pédagogique : `programme/index.html`.
- Cours : `cours/index.html` ; présentations : `presentations/index.html`.
- TD : `td/index.html` ; TP : `tp/index.html` ; corrigés : `corriges/index.html`.
- Bibliographie : `bibliographie/index.html`.
- Applications hydrologiques : `applications-hydrologie/index.html`.
- Style des pages secondaires : `assets/sections.css`.

Ne pas modifier les PDF déjà publiés sans raison ; ne diffuser que des ressources avec une autorisation de partage appropriée.
