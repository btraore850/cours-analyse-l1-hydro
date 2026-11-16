# Système gratuit d'évaluation — Analyse L1 Hydrologie

Ce dossier comprend deux éléments distincts :

1. `index.html` + `quiz-data.js` + `questions/chapter-{1,3,4,5,6,7}.js` + `paraphrases.js` : **démonstration publique** de **210 QCM**, soit 30 questions par chapitre (10 faciles, 10 moyennes et 10 difficiles). **Les 210 QCM possèdent chacun une reformulation pédagogique validée** : certains énoncés changent aléatoirement à chaque tentative sans modifier les données mathématiques, la notation ou la bonne réponse. Le score d'auto-évaluation est affiché **sur 10**, avec les appréciations indicatives : moins de 5 « Insuffisant », de 5 à moins de 6 « Passable », de 6 à moins de 7 « Assez bien », de 7 à moins de 8 « Bien », de 8 à moins de 9 « Très bien », de 9 à 10 « Excellent ». Les réponses et les corrigés sont visibles dans le code ; cette page n'est **pas** destinée aux examens notés. Aucun score n'est transmis au serveur et aucun courriel n'est envoyé.
2. `officielle/index.html` + `officielle/portal.js` + `officielle/config.js` : **interface de connexion Google sur GitHub Pages**, à l'origine OAuth `https://btraore850.github.io`.
3. `apps-script/Code.gs` + `apps-script/Index.html` : **service privé Apps Script**. Il vérifie les jetons Google, applique les droits d'accès, conserve les notes dans un Google Sheet privé et corrige les réponses côté serveur. Sa page HTML reçoit le jeton depuis GitHub Pages dans un cadre sécurisé, puis utilise `google.script.run` : aucune connexion OAuth n'est lancée dans le cadre Apps Script.

## 1. Préparer Google Sheets

Utiliser le classeur `EVALUATIONS_ANALYSE_L1_HYDROLOGIE` fourni séparément :

- `ETUDIANTS` : renseigner le matricule, l'adresse Gmail officielle, le nom, le prénom et le groupe ; mettre `actif` à `TRUE`. Laisser `google_sub` vide (il sera renseigné lors de la première connexion).
- `QUESTIONS` : le classeur privé contient désormais **210 QCM d'entraînement**, soit 30 par chapitre pour les sept chapitres, avec `usage=ENTRAINEMENT` et `actif=TRUE`. Les examens notés doivent utiliser des **questions privées différentes**, marquées `usage=EXAMEN` et `actif=TRUE`. `bonne` contient une lettre A, B, C ou D.
- `EVALUATIONS`, `TENTATIVES`, `EMAILS` : ne pas supprimer ou déplacer les colonnes ; le programme écrit automatiquement les lignes.

**Ne pas partager le classeur avec les étudiants.** Il contient les corrigés et les notes individuelles.

## 2. Créer l'application Apps Script

1. Ouvrir https://script.google.com/ avec le compte Gmail de l'enseignant et créer un projet autonome intitulé `Evaluations Analyse L1 Hydrologie`.
2. Coller le contenu de `apps-script/Code.gs` dans le fichier `Code.gs`.
3. Ajouter un fichier HTML appelé **Index** et y coller `apps-script/Index.html`. Si un projet Apps Script est déjà déployé, **remplacer le contenu des deux fichiers par les versions corrigées**, puis créer une nouvelle version du déploiement.
4. Ouvrir **Paramètres du projet → Propriétés du script** et ajouter :
   - `SPREADSHEET_ID` : l'identifiant du Google Sheet privé (entre `/d/` et `/edit` dans son URL) ;
   - `TEACHER_EMAIL` : votre adresse Gmail ;
   - `GOOGLE_CLIENT_ID` : l'identifiant OAuth 2.0 Web obtenu à l'étape 3.
5. Exécuter une première fois `initializeMissingSheets` dans l'éditeur si vous n'avez pas utilisé le classeur modèle. Autoriser les accès **Sheets**, **Mail**, **URL Fetch** nécessaires.
6. Exécuter `installMailTrigger` une seule fois pour programmer les e-mails en attente.

## 3. Configurer l'identité Google

1. Dans https://console.cloud.google.com/, créer ou sélectionner un projet Google Cloud et configurer **Google Auth Platform / Écran de consentement OAuth**.
2. Créer un **ID client OAuth 2.0 de type application Web** et inscrire **exactement** `https://btraore850.github.io` dans **Origines JavaScript autorisées**. Il n'est pas nécessaire d'autoriser `script.google.com` ou `googleusercontent.com`, puisque le bouton Google ne s'y trouve plus.
3. Inscrire cet ID client dans `GOOGLE_CLIENT_ID`.
4. Déployer Apps Script comme **Application Web**, exécution **en tant que vous**. Pour le **premier essai avec l'enseignant**, conserver **Only myself**. Lors des tests ultérieurs avec un étudiant, l'accès au service devra être adapté de façon contrôlée ; la restriction effective des étudiants autorisés reste assurée par `signIn()` côté serveur. **Ne jamais** partager le Google Sheet en écriture.
5. Copier l'URL du déploiement Apps Script qui se termine par `/exec`.
6. Dans `officielle/config.js`, remplacer les deux textes `REMPLACER_PAR_...` par :
   - `googleClientId` : l'**ID client OAuth Web**, se terminant par `.apps.googleusercontent.com` ;
   - `appsScriptUrl` : l'**URL du déploiement Web Apps Script**, se terminant par `/exec`.
7. Héberger les trois fichiers de `officielle/` sous le site GitHub Pages existant, **après accord explicite de publication**, et ouvrir `https://btraore850.github.io/cours-analyse-l1-hydro/evaluation/officielle/`.
8. Tester la connexion enseignant puis un compte étudiant autorisé, enfin un compte absent de `ETUDIANTS` qui doit être refusé. Vérifier le rôle, les notes et le filtrage des évaluations. La page d'accueil propose désormais la rubrique « Évaluations », qui mène à la connexion officielle et à l'auto-évaluation libre.

**Correction de l'erreur `400: origin_mismatch` :** l'ancienne version tentait d'ouvrir Google Identity Services depuis l'iframe Apps Script. Le domaine réellement utilisé par cet iframe ne correspondait pas à l'origine autorisée, et les domaines `googleusercontent.com` ne sont pas acceptés comme origines JavaScript OAuth. Dans la version corrigée, le bouton vit sur GitHub Pages et l'Apps Script reçoit le jeton par `postMessage` avec un nonce imprévisible et un contrôle strict de l'origine `https://btraore850.github.io`. Apps Script valide ensuite le jeton avant toute lecture des données privées.

**À valider dans un navigateur réel :** l'intégration Apps Script par iframe utilise `XFrameOptionsMode.ALLOWALL`, requis pour l'intégration, et une communication restreinte par origine et nonce. Certains navigateurs bloquent cependant les cookies tiers : tester l'affichage du cadre et la connexion pour chaque profil avant de diffuser le lien. Aucun mot de passe, « Client secret », question privée ou liste d'étudiants ne doit être ajouté aux fichiers GitHub publics.

Le moteur valide le jeton Google par l'endpoint `tokeninfo` pour une première installation pédagogique. Google recommande, pour la production à grande échelle, de vérifier localement la signature des jetons avec ses clés publiques. **Ce prototype doit passer une revue de sécurité avant des examens à fort enjeu.**

## 4. Activer les évaluations

L'enseignant se connecte à l'application et crée une évaluation : chapitres, difficulté, nombre de questions, durée, dates et groupe. Toute nouvelle évaluation est désactivée par défaut.

L'activation n'est possible qu'une fois la banque privée `EXAMEN` suffisamment fournie. Les questions sont tirées sans répétition dans chaque tentative, avec un ordre de réponses mélangé. Le serveur conserve un horaire d'expiration indépendant du chronomètre du navigateur.

**Publication automatique du calendrier étudiant :**

1. L'enseignant renseigne de préférence une date d'ouverture et une date de fermeture, puis crée le brouillon.
2. Après vérification de la banque `EXAMEN`, il clique sur **« Publier »** dans les évaluations programmées. La publication n'ouvre **pas** immédiatement les questions si l'heure de début est future.
3. Les étudiants autorisés se connectent à « Évaluations officielles » sur la plateforme pédagogique. Ils voient l'épreuve et le statut **À venir**, avec dates, chapitres, nombre de QCM et durée, mais **sans les questions ni corrigés**.
4. À l'heure prévue, le statut devient **Ouverte** et le bouton **Commencer** est disponible. Après l'heure de fermeture, il devient **Terminée** et une nouvelle tentative est refusée par le serveur. La durée effective d'une tentative ne dépasse jamais l'heure de fermeture.
5. Cliquer sur **« Retirer »** cache à nouveau l'épreuve aux étudiants. Une épreuve d'un autre groupe n'apparaît jamais dans leur calendrier.

**Actualisation :** la liste des évaluations publiées est récupérée automatiquement chaque minute lorsque l'étudiant n'est pas en train de répondre ; les changements de statut des épreuves déjà affichées sont mis à jour toutes les cinq secondes. Aucun sujet d'examen n'est embarqué dans les fichiers publics de GitHub Pages.

**Mise en service de cette amélioration :** mettre en ligne les pages du dépôt et mettre à jour **les deux fichiers** du projet Apps Script (`Code.gs` et `Index.html`), puis redéployer une nouvelle version de l'application Web. La modification de GitHub Pages seule ne suffit pas pour afficher les évaluations futures, car c'est Apps Script qui filtre le calendrier. Conserver les mêmes propriétés du script, le déploiement et le classeur privé. Tester les rôles enseignant/étudiant avant d'inviter une promotion complète.

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
