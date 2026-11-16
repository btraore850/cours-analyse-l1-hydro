# Système gratuit d'évaluation — Analyse L1 Hydrologie

Ce dossier comprend deux éléments distincts :

1. `index.html` + `quiz-data.js` + `questions/chapter-{1,3,4,5,6,7}.js` : **démonstration publique** de **210 QCM**, soit 30 questions par chapitre (10 faciles, 10 moyennes et 10 difficiles). Les réponses et les corrigés sont visibles dans le code ; cette page n'est **pas** destinée aux examens notés. Aucun score n'est transmis au serveur et aucun courriel n'est envoyé.
2. `apps-script/Code.gs` + `apps-script/Index.html` : application de production à installer dans le **compte Google de l'enseignant**. Elle conserve les notes dans un Google Sheet privé, vérifie les droits et corrige les réponses côté serveur.

## 1. Préparer Google Sheets

Utiliser le classeur `EVALUATIONS_ANALYSE_L1_HYDROLOGIE` fourni séparément :

- `ETUDIANTS` : renseigner le matricule, l'adresse Gmail officielle, le nom, le prénom et le groupe ; mettre `actif` à `TRUE`. Laisser `google_sub` vide (il sera renseigné lors de la première connexion).
- `QUESTIONS` : les 30 exemples du chapitre 2 sont marqués `usage=ENTRAINEMENT`. **Attention : les 180 QCM supplémentaires sont intégrés à la démonstration GitHub, pas automatiquement au Google Sheet privé.** Il faudra importer les questions d'entraînement souhaitées dans le classeur avant d'activer les entraînements via Apps Script. Les examens notés doivent utiliser des **questions privées différentes**, marquées `usage=EXAMEN` et `actif=TRUE`. `bonne` contient une lettre A, B, C ou D.
- `EVALUATIONS`, `TENTATIVES`, `EMAILS` : ne pas supprimer ou déplacer les colonnes ; le programme écrit automatiquement les lignes.

**Ne pas partager le classeur avec les étudiants.** Il contient les corrigés et les notes individuelles.

## 2. Créer l'application Apps Script

1. Ouvrir https://script.google.com/ avec le compte Gmail de l'enseignant et créer un projet autonome intitulé `Evaluations Analyse L1 Hydrologie`.
2. Coller le contenu de `apps-script/Code.gs` dans le fichier `Code.gs`.
3. Ajouter un fichier HTML appelé **Index** et y coller `apps-script/Index.html`.
4. Ouvrir **Paramètres du projet → Propriétés du script** et ajouter :
   - `SPREADSHEET_ID` : l'identifiant du Google Sheet privé (entre `/d/` et `/edit` dans son URL) ;
   - `TEACHER_EMAIL` : votre adresse Gmail ;
   - `GOOGLE_CLIENT_ID` : l'identifiant OAuth 2.0 Web obtenu à l'étape 3.
5. Exécuter une première fois `initializeMissingSheets` dans l'éditeur si vous n'avez pas utilisé le classeur modèle. Autoriser les accès **Sheets**, **Mail**, **URL Fetch** nécessaires.
6. Exécuter `installMailTrigger` une seule fois pour programmer les e-mails en attente.

## 3. Configurer l'identité Google

1. Dans https://console.cloud.google.com/, créer ou sélectionner un projet Google Cloud et configurer **Google Auth Platform / Écran de consentement OAuth**.
2. Créer un **ID client OAuth 2.0 de type application Web** et configurer les origines JavaScript utilisées par le déploiement Apps Script. Les domaines d'origine réels du cadre HTML doivent être confirmés avec le navigateur, notamment à cause du mode iframe d'Apps Script.
3. Inscrire cet ID client dans `GOOGLE_CLIENT_ID`.
4. Déployer Apps Script comme **Application Web**, exécution **en tant que vous**, accès aux visiteurs autorisés par le déploiement. **Ne jamais** déployer le Google Sheet ni partager son accès en écriture.
5. Tester la connexion d'un compte étudiant présent dans `ETUDIANTS`, puis d'un Gmail absent de la liste (qui doit être refusé).

Le bouton « Se connecter avec Google » peut rencontrer des limitations d'origine et de cookies dans les iframes Apps Script. **La connexion doit être validée dans un vrai navigateur avant publication aux étudiants.** Ne pas demander aux étudiants de saisir leurs identifiants Google dans un formulaire personnalisé. Si ce mécanisme ne fonctionne pas pour le déploiement choisi, reprendre la configuration d'identité avant d'autoriser une évaluation officielle.

Le moteur valide le jeton Google par l'endpoint `tokeninfo` pour une première installation pédagogique. Google recommande, pour la production à grande échelle, de vérifier localement la signature des jetons avec ses clés publiques. **Ce prototype doit passer une revue de sécurité avant des examens à fort enjeu.**

## 4. Activer les évaluations

L'enseignant se connecte à l'application et crée une évaluation : chapitres, difficulté, nombre de questions, durée, dates et groupe. Toute nouvelle évaluation est désactivée par défaut.

L'activation n'est possible qu'une fois la banque privée `EXAMEN` suffisamment fournie. Les questions sont tirées sans répétition dans chaque tentative, avec un ordre de réponses mélangé. Le serveur conserve un horaire d'expiration indépendant du chronomètre du navigateur.

Pour tester : créer une épreuve de 5 QCM sur le chapitre 2 et la laisser désactivée, puis inscrire **au moins cinq questions privées** de même niveau avant son activation.

## 5. Scores à l'écran, courriels d'examen et export Excel

**Auto-évaluations (`practice`) :** le score et le corrigé sont affichés immédiatement à l'étudiant. AUCUN e-mail n'est créé ou envoyé, même après plusieurs tentatives. Lorsque le service privé est activé, les notes peuvent néanmoins être conservées dans `TENTATIVES` pour le suivi pédagogique.

**Examens officiels (`exam`) uniquement :** le résultat est enregistré, puis un message est placé dans la feuille `EMAILS`. `processMailQueue` peut envoyer jusqu'à 20 messages par passage si le quota restant le permet. Pour 200–500 étudiants, les courriels peuvent être différés par les quotas Gmail ; la note reste consultable dans l'application.

Pour exporter les résultats, ouvrir le lien privé « Ouvrir les notes » puis sélectionner **Fichier → Télécharger → Microsoft Excel (.xlsx)** dans Google Sheets. La feuille `TENTATIVES` conserve une ligne par essai.

## 6. Tests indispensables avant ouverture à 200–500 étudiants

- Connexion autorisée/refusée et vérification du rôle enseignant.
- Conservation des réponses après une interruption réseau ; note juste, unique et non modifiable par l'étudiant.
- Expiration côté serveur et traitement des brouillons.
- Deux soumissions simultanées du même essai : une seule note, aucun e-mail pour l'entraînement, au plus un e-mail pour l'examen officiel.
- Créneau de fermeture et nombre maximal de tentatives.
- Essais progressifs à 5, 20 puis 50 étudiants ; surveiller erreurs Apps Script, verrous Google Sheets et quotas.
- Pour les examens à fort enjeu avec 200–500 étudiants en même temps : réaliser des essais de charge réalistes et prévoir plusieurs groupes. La capacité de 500 simultanés **n'est pas garantie** par l'offre gratuite.

## 7. Intégration dans GitHub Pages

La page publique est accessible à `/evaluation/` avec les **sept chapitres du programme** et le choix entre 5 ou 10 questions, renouvelées à chaque tentative. Le lien vers l'application Google privée pourra être ajouté **après** validation du déploiement et de l'authentification.

Ne pas publier de listes d'étudiants, d'identifiants Google privés, de mots de passe ou de banques d'examen noté dans le dépôt GitHub public.
