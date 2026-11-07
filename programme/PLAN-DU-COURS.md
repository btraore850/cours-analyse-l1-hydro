# Programme du cours d’Analyse 3 — MTH 1101

**Université :** Université de N'Zérékoré (UNZ)  
**Formation :** Licence en Météorologie — Niveau L1  
**Module :** Analyse 3 (MTH 1101)  
**Crédits :** 3  
**Année universitaire :** 2026–2027  
**Enseignant :** M. Bakary TRAORE, MSc.  
**Ressources :** [Site pédagogique du cours](https://btraore850.github.io/cours-analyse-l1-meteo/)

> **Statut :** ce plan reprend la présentation Beamer « Présentation du programme.tex », déposée dans le même dossier. Les volumes, le calendrier et les pondérations sont **proposés ou indicatifs**, sous réserve de validation par les instances pédagogiques compétentes.

## 1. Présentation et intérêt du cours

L'analyse mathématique fournit des outils pour **observer, analyser et modéliser** des phénomènes météorologiques : variations de température et de pression, cumuls de précipitations, cycles journaliers ou saisonniers et bilans physiques.

Les concepts de dérivée, d'intégrale, de convergence, de séries de fonctions et d'équations différentielles permettent de passer des observations à des modèles quantitatifs.

Quelques exemples :

- **Variation instantanée de température :** $\dfrac{dT}{dt}$.
- **Cumul des précipitations :** $P = \int_{t_0}^{t_1} I(t)\,dt$, si $I(t)$ représente l'intensité de pluie.
- **Bilan d'une quantité physique :** $\dfrac{dQ}{dt} = F_{\mathrm{in}} - F_{\mathrm{out}} + S$.

## 2. Fiche d'organisation du module

| Élément | Organisation prévue |
|---|---|
| Code | MTH 1101 |
| Intitulé | Analyse 3 |
| Niveau | Licence en Météorologie (L1) |
| Crédits | 3 |
| Volume horaire global proposé | **45 heures** |
| Cours magistraux (CM) | 25 heures |
| Travaux dirigés (TD) | 15 heures |
| Travaux pratiques (TP) | 5 heures |
| Durée indicative | **15 semaines** |
| Outils | Calculatrice scientifique, tableur, ordinateur |

## 3. Objectif général

Acquérir les connaissances fondamentales d’**analyse mathématique** nécessaires à la compréhension et à la modélisation de phénomènes météorologiques, notamment par l’étude des **suites, séries, modes de convergence, approximations et équations différentielles**.

## 4. Compétences attendues

À l'issue du module, l'étudiant devrait pouvoir :

1. Réaliser des calculs de limites, dérivées et intégrales, et en interpréter le sens.
2. Étudier la convergence des suites et des séries numériques.
3. Distinguer la convergence absolue et conditionnelle des séries.
4. Comparer la **convergence simple, uniforme et normale** de suites ou séries de fonctions.
5. Utiliser des séries entières et des développements de Taylor pour approcher des fonctions et contrôler les erreurs.
6. Comprendre les principes d'une décomposition en **série de Fourier** pour des phénomènes périodiques.
7. Résoudre des équations différentielles élémentaires avec conditions initiales.
8. Formuler et interpréter des bilans simples de masse ou d'énergie en météorologie.

## 5. Programme détaillé : sept chapitres

### Chapitre 1 — Rappels fondamentaux d'analyse (6 h ; semaines 1–2)

- Fonctions usuelles : domaine, propriétés et représentations.
- Limites, continuité et principaux théorèmes.
- Dérivées, variations, extrema et rappels de Taylor.
- Primitives, intégrales et méthodes élémentaires de calcul.
- **Application :** vitesse de variation de la température ; accumulation d'une intensité de pluie.

**Acquis visé :** réactiver les outils de calcul nécessaires aux autres chapitres.

### Chapitre 2 — Suites et séries numériques à termes positifs (6 h ; semaines 3–4)

- Suites : limites, monotonie, bornes et critère de Cauchy.
- Sommes partielles et définition de la convergence d'une série.
- Séries à termes positifs : comparaison et équivalences.
- Critères de d'Alembert, de Cauchy et critère intégral.
- Séries de référence, notamment la série de Riemann $\sum_{n=1}^{\infty} 1/n^p$.

**Acquis visé :** choisir et justifier un critère de convergence pour une série positive.

### Chapitre 3 — Séries numériques à termes quelconques (3 h ; semaine 5)

- Séries à signes variables.
- Convergence absolue et convergence conditionnelle.
- Séries alternées et critère de Leibniz.
- Estimation du reste d'une série alternée.
- Effets des réarrangements (complément).

**Exemple :** la série $1 - \frac12 + \frac13 - \frac14 + \cdots$ converge conditionnellement.

### Chapitre 4 — Suites et séries de fonctions (6 h ; semaines 6–7)

- Convergence simple et convergence uniforme.
- Norme uniforme et critère de Cauchy uniforme.
- Convergence normale des séries de fonctions.
- Critère de Weierstrass.
- Continuité, intégration, dérivation et passage à la limite, sous les hypothèses requises.

**Exemple :** étudier $f_n(x)=x^n$ sur $[0,1]$ pour distinguer convergence simple et uniforme.

### Chapitre 5 — Séries entières et développements de Taylor (6 h ; semaines 8–9)

- Définition d'une série entière et rayon de convergence.
- Lemme d'Abel et formule de Cauchy–Hadamard.
- Dérivation et intégration terme à terme dans le disque ou l'intervalle de convergence approprié.
- Formules de Taylor et de Maclaurin.
- Estimation de l'erreur de troncature et approximations locales.

**Application :** linéarisation de relations physiques utilisées dans des modèles météorologiques.

### Chapitre 6 — Séries de Fourier (6 h ; semaines 10–11)

- Fonctions périodiques et harmoniques.
- Coefficients et séries de Fourier.
- Conditions de convergence.
- Introduction à l'identité de Parseval.
- **Application :** représentation de cycles journaliers ou saisonniers de température.

### Chapitre 7 — Équations différentielles et lois de conservation (9 h ; semaines 12–14)

- Problèmes de Cauchy et conditions initiales.
- Équations différentielles du premier ordre.
- Équations linéaires du second ordre.
- Modèles élémentaires de refroidissement et réchauffement.
- Lois de conservation de la masse et de l'énergie.
- **Application :** bilan $\frac{dQ}{dt} = F_{\mathrm{in}} - F_{\mathrm{out}} + S$.

**Acquis visé :** traduire une évolution ou un bilan physique en équation différentielle et interpréter sa solution.

**Bilan horaire :** les sept chapitres totalisent **42 h** ; **3 h** supplémentaires sont prévues pour la révision et l'évaluation, soit **45 h** au total.

## 6. Calendrier pédagogique indicatif

| Semaines | Contenu | Durée |
|---|---|---:|
| 1–2 | Chapitre 1 : rappels d'analyse | 6 h |
| 3–4 | Chapitre 2 : suites et séries positives | 6 h |
| 5 | Chapitre 3 : séries à termes quelconques | 3 h |
| 6–7 | Chapitre 4 : suites et séries de fonctions | 6 h |
| 8–9 | Chapitre 5 : séries entières et Taylor | 6 h |
| 10–11 | Chapitre 6 : séries de Fourier | 6 h |
| 12–14 | Chapitre 7 : équations différentielles et bilans | 9 h |
| 15 | Révision et évaluation | 3 h |
| **Total** | **15 semaines** | **45 h** |

Les semaines correspondent à une **progression indicative**, et non à des dates fixées.

## 7. Méthodes pédagogiques et travaux pratiques

### Cours magistraux — 25 h

Définitions, théorèmes, démonstrations essentielles, méthodes de résolution et exemples commentés.

### Travaux dirigés — 15 h

Exercices individuels ou en binôme portant notamment sur :

- les limites, dérivées et intégrales ;
- les critères de convergence des séries numériques ;
- les modes de convergence des suites et séries de fonctions ;
- les séries entières et développements de Taylor ;
- les équations différentielles avec conditions initiales.

### Travaux pratiques — 5 h

- **Fourier :** représenter et analyser un cycle journalier de température avec un tableur.
- **Modèle thermique :** comparer une simulation numérique et une solution analytique.
- Une partie des TP peut être mobilisée dans la séance de révision ou d'évaluation, conformément à l'organisation présentée.

**Matériel conseillé :** calculatrice scientifique, tableur et, lorsque possible, ordinateur.

## 8. Modalités d'évaluation proposées

La présentation du programme prévoit les pondérations suivantes :

| Évaluation | Contenu principal | Pondération |
|---|---|---:|
| Devoir surveillé 1 (DS1) | Séries numériques | 10 % |
| Devoir surveillé 2 (DS2) | Convergence des fonctions | 15 % |
| Travaux dirigés et pratiques | Exercices, travaux et applications | 35 % |
| Examen final | Ensemble des acquis | 40 % |
| **Total** | | **100 %** |

**Regroupement annoncé dans la présentation :**
- **N1 :** devoirs surveillés 1 et 2 ;
- **N2 :** travaux dirigés et pratiques ;
- **N3 :** examen final.

Les modalités de calcul des notes N1, N2 et N3, ainsi que leur validation officielle, doivent être confirmées par l'établissement.

## 9. Prérequis et conseils de travail

### Prérequis

- Baccalauréat scientifique ou technique.
- Calcul algébrique et fonctions usuelles.
- Notions élémentaires de limites, dérivées et intégrales.

### Conseils aux étudiants

- Relire les définitions et théorèmes après chaque CM.
- Préparer les exercices avant les TD.
- Vérifier les calculs et représentations à l'aide des outils disponibles.
- Relier les résultats mathématiques à des grandeurs observables en météorologie.
- Consulter régulièrement les ressources publiées sur ce dépôt.

## 10. Bibliographie de référence

1. Jean-Marie **Monier**, *Analyse MPSI*, Dunod.
2. Jean-Marie **Monier**, *Analyse MP/MP\**, Dunod.
3. Walter **Rudin**, *Principes d'analyse mathématique*.
4. Tom M. **Apostol**, *Calculus*, volumes 1 et 2.
5. Erwin **Kreyszig**, *Advanced Engineering Mathematics*.
6. James R. **Holton** et Gregory J. **Hakim**, *An Introduction to Dynamic Meteorology* (applications météorologiques).

Cette liste constitue une bibliographie indicative ; il n'est pas nécessaire de posséder tous les ouvrages. Pour les ressources numériques, privilégier les éditions librement accessibles ou les liens légaux des éditeurs et bibliothèques.

## 11. Accès aux ressources pédagogiques

- [Page d'accueil du cours](../index.html)
- [Polycopiés et notes de cours](../cours/)
- [Présentations Beamer](../presentations/)
- [Travaux dirigés](../td/)
- [Corrigés](../corriges/)
- [Applications météorologiques et données](../applications-meteo/)
- [Bibliographie du dépôt](../bibliographie/)
- [Présentation du programme (fichier LaTeX source)](Pr%C3%A9sentation%20du%20programme.tex)

Les supports de cours, TD et TP seront mis en ligne progressivement. Pour consulter une version accessible depuis un navigateur sans télécharger de code source, utiliser le [site pédagogique](https://btraore850.github.io/cours-analyse-l1-meteo/) une fois GitHub Pages activé.

---

*Plan actualisé à partir du fichier « Présentation du programme.tex » du dépôt. Les éventuelles modifications du document source n'actualiseront pas automatiquement cette page Markdown.*
