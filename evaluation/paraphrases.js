/* Formulations alternatives vérifiées pour les QCM d'entraînement.
 * Même contenu mathématique et même grille de réponses que l'énoncé original.
 * Chaque question peut conserver sa formulation initiale selon le tirage.
 */
window.HYDRO_QUESTION_PARAPHRASES = {
  // Chapitre 1 — Fondements de l'analyse.
  C1F01: ['Sur quel ensemble de réels la fonction \\(f(x)=\\ln x\\) est-elle définie ?'],
  C1F02: ['Calculez la dérivée de \\(f(x)=x^3\\).'],
  C1F03: ['Déterminez la valeur de \\(\\displaystyle\\lim_{x\\to0}\\frac{\\sin x}{x}\\).'],
  C1F04: ['Déterminez le domaine réel de définition de \\(f(x)=\\sqrt x\\).'],
  C1M01: ['Pour quelles valeurs la fonction \\(f(x)=\\ln(2-x)\\) est-elle définie ?'],
  C1M02: ['Calculez la dérivée de \\(f(x)=xe^x\\).'],
  C1M03: ['Évaluez \\(\\displaystyle\\lim_{x\\to0}\\frac{e^x-1}{x}\\).'],
  C1M04: ['Déterminez l’expression de la dérivée de \\(f(x)=\\ln(x^2+1)\\) :'],
  C1D01: ['Évaluez \\(\\displaystyle\\lim_{x\\to0}\\frac{\\ln(1+x)-x}{x^2}\\).'],
  C1D02: ['Déterminez la dérivée de \\(f(x)=x^x\\) lorsque \\(x>0\\) :'],
  C1D03: ['Calculez \\(\\displaystyle\\int_0^1 x\\ln x\\,dx\\) en tenant compte du caractère impropre de cette intégrale.'],
  C1D04: ['Sur \\([0,+\\infty[\\), quelle est la plus grande valeur de \\(f(x)=xe^{-x}\\) ?'],

  // Chapitre 2 — Suites et séries positives.
  F01: ['Vers quel nombre tend \\(u_n=\\frac{1}{n}\\) lorsque \\(n\\to+\\infty\\) ?'],
  F02: ['Indiquez le caractère convergent ou divergent de \\(\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n^2}\\).'],
  F03: ['Lorsque tous les termes d’une série sont positifs, que peut-on affirmer des sommes partielles ?'],
  F04: ['Calculez la somme de \\(\\displaystyle\\sum_{n=0}^{\\infty}\\left(\\frac12\\right)^n\\).'],
  M01: ['Comment classer la série \\(\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n}{n^3+1}\\) ?'],
  M02: ['Précisez la nature de la série \\(\\displaystyle\\sum_{n=1}^{\\infty}\\frac{2n+1}{n^2+1}\\) :'],
  M03: ['Quelle raison explique la divergence de la série \\(\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n+1}{2n+3}\\) ?'],
  M04: ['Pour la série \\(\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n}{3^n}\\), calculez la limite du rapport \\(u_{n+1}/u_n\\) :'],
  D01: ['Étudiez la convergence de \\(\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n!}{n^n}\\) :'],
  D02: ['Comment se comporte la série \\(\\displaystyle\\sum_{n=1}^{\\infty}\\left(1+\\frac1n\\right)^{-n^2}\\) ?'],
  D03: ['Déterminez la nature de \\(\\displaystyle\\sum_{n=2}^{\\infty}\\frac{\\ln n}{n}\\) :'],
  D04: ['La série \\(\\displaystyle\\sum_{n=2}^{\\infty}\\frac{\\ln n}{n^2}\\) converge-t-elle ou diverge-t-elle ?'],

  // Chapitre 3 — Séries à termes quelconques.
  C3F01: ['Dans quel cas dit-on que la série \\(\\sum u_n\\) est absolument convergente ?'],
  C3F02: ['Quelles conditions permettent d’utiliser le critère de Leibniz pour \\(\\sum(-1)^na_n\\) ?'],
  C3F03: ['Quel est le comportement de la série harmonique alternée \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}n\\) ?'],
  C3F04: ['Classez la série \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{n^2}\\) selon sa convergence :'],
  C3M01: ['Précisez le type de convergence de \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}n\\) :'],
  C3M02: ['Étudiez la convergence de \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{\\sqrt n}\\) :'],
  C3M03: ['Comment se comporte \\(\\sum_{n=1}^{\\infty}(-1)^n\\frac{n}{n+1}\\) ?'],
  C3M04: ['Indiquez la nature de \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{n+2}\\) :'],
  C3D01: ['Déterminez le type de convergence de \\(\\sum_{n=2}^{\\infty}(-1)^n\\frac{\\ln n}{n}\\) :'],
  C3D02: ['La série \\(\\sum_{n=1}^{\\infty}(-1)^n\\sin(1/n)\\) possède quel caractère de convergence ?'],
  C3D03: ['Analysez la convergence de \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{\\sqrt{n+1}+\\sqrt n}\\) :'],
  C3D04: ['Quelle est la nature de la série \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{n^{3/4}}\\) ?'],

  // Chapitre 4 — Suites et séries de fonctions.
  C4F01: ['Comment caractériser la convergence uniforme de \\(f_n\\) vers \\(f\\) sur \\(E\\) ?'],
  C4F02: ['Quelle propriété découle nécessairement de la convergence uniforme ?'],
  C4F03: ['Si \\(f_n\\) est continue sur \\([a,b]\\) et converge uniformément vers \\(f\\), quelle propriété possède \\(f\\) ?'],
  C4F04: ['Déterminez la limite simple de \\(f_n(x)=x^n\\) sur \\([0,1]\\) :'],
  C4M01: ['Quel type de convergence vers \\(0\\) obtient-on pour \\(f_n(x)=x^n\\) sur \\([0,a]\\), avec \\(0<a<1\\) ?'],
  C4M02: ['Pourquoi la convergence de \\(f_n(x)=x^n\\) sur \\([0,1]\\) n’est-elle pas uniforme ?'],
  C4M03: ['Étudiez le comportement de \\(f_n(x)=\\frac{x}{1+nx}\\) sur \\([0,1]\\) :'],
  C4M04: ['Quel type de convergence présente \\(f_n(x)=\\frac1{1+nx}\\) sur \\([0,1]\\) ?'],
  C4D01: ['Sur \\([0,1]\\), quelle est la nature de la convergence de \\(f_n(x)=x^n(1-x)\\) vers \\(0\\) ?'],
  C4D02: ['Sur \\([0,1]\\), quelle observation démontre la non-uniformité de \\(f_n(x)=\\frac{nx}{1+n^2x^2}\\) malgré sa convergence simple vers \\(0\\) ?'],
  C4D03: ['La convergence simple de \\(x^n\\to0\\) sur \\([0,1[\\) est-elle aussi uniforme ?'],
  C4D04: ['Déterminez le mode de convergence de \\(\\sum_{n=1}^{\\infty}x^n/n\\) sur \\([0,1[\\) :'],

  // Chapitre 5 — Séries entières et Taylor.
  C5F01: ['Calculez le rayon de convergence de la série \\(\\sum_{n=0}^{\\infty}x^n\\).'],
  C5F02: ['Déterminez le rayon de convergence de \\(\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}\\) :'],
  C5F03: ['Quel rayon de convergence possède \\(\\sum_{n=1}^{\\infty}nx^n\\) ?'],
  C5F04: ['Par quel terme commence le développement de \\(\\sin x\\) près de \\(0\\) ?'],
  C5M01: ['Trouvez le rayon de convergence de \\(\\sum_{n=0}^{\\infty}(2x)^n\\).'],
  C5M02: ['Que constate-t-on aux points \\(x=1\\) et \\(x=-1\\) pour la série \\(\\sum_{n=1}^{\\infty}\\frac{x^n}{n}\\) ?'],
  C5M03: ['Déterminez le rayon de convergence de \\(\\sum_{n=0}^{\\infty}n!\\,x^n\\).'],
  C5M04: ['Quel rayon de convergence admet la série \\(\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}\\) ?'],
  C5D01: ['Calculez le rayon de convergence de \\(\\sum_{n=1}^{\\infty}n^2x^n\\).'],
  C5D02: ['Déterminez le rayon de convergence de \\(\\sum_{n=1}^{\\infty}\\frac{n!}{n^n}x^n\\) :'],
  C5D03: ['Comment se comporte \\(\\sum_{n=0}^{\\infty}\\frac{x^n}{n+1}\\) aux deux bornes de son intervalle de convergence ?'],
  C5D04: ['Identifiez la fonction représentée par \\(\\sum_{n=0}^{\\infty}\\frac{(-1)^nx^{2n+1}}{(2n+1)!}\\) :'],

  // Chapitre 6 — Séries de Fourier.
  C6F01: ['Donnez la plus petite période positive de \\(\\sin x\\).'],
  C6F02: ['Quelle est, pour \\(n\\in\\mathbb N^*\\), la période fondamentale de \\(\\cos(nx)\\) ?'],
  C6F03: ['Si une fonction est paire et \\(2\\pi\\)-périodique, que peut-on dire de ses coefficients \\(b_n\\) ?'],
  C6F04: ['Que peut-on dire des coefficients \\(a_n\\) d’une fonction impaire ?'],
  C6M01: ['Déterminez le coefficient \\(b_2\\) pour \\(f(x)=2+3\\cos x-\\sin(2x)\\) :'],
  C6M02: ['Calculez le coefficient \\(b_1\\) pour l’extension \\(2\\pi\\)-périodique de \\(f(x)=x\\) sur \\(]-\\pi,\\pi[\\) :'],
  C6M03: ['Calculez le terme constant \\(a_0/2\\) pour \\(f(x)=x^2\\) sur \\([-\\pi,\\pi]\\) :'],
  C6M04: ['Selon les hypothèses de Dirichlet, vers quoi converge la série de Fourier au point de saut d’une fonction qui les satisfait ?'],
  C6D01: ['Quelle est la valeur de \\(b_2\\) pour l’extension périodique de \\(f(x)=x\\) sur \\(]-\\pi,\\pi[\\) ?'],
  C6D02: ['Calculez le coefficient \\(b_1\\) pour \\(f(x)=\\operatorname{sgn}(x)\\) sur \\(]-\\pi,\\pi[\\) :'],
  C6D03: ['Quelle limite prend la série de Fourier en \\(x=0\\) pour l’extension périodique de \\(\\operatorname{sgn}(x)\\) ?'],
  C6D04: ['Évaluez \\(\\sum_{n\\ge1}(a_n^2+b_n^2)\\) pour \\(f(x)=\\sin x\\) :'],

  // Chapitre 7 — Équations différentielles et bilans.
  C7F01: ['Calculez la dérivée de \\(y(t)=e^{2t}\\) :'],
  C7F02: ['Quelle expression résout \\(y^{\\prime}=ky\\) sous la condition \\(y(0)=y_0\\) ?'],
  C7F03: ['Quel est l’ordre de l’équation \\(y^{\\prime\\prime}+y=0\\) ?'],
  C7F04: ['Donnez la solution générale de \\(y^{\\prime}=3\\) :'],
  C7M01: ['Quelle fonction vérifie \\(y^{\\prime}=2t\\) et \\(y(0)=1\\) ?'],
  C7M02: ['Quelle valeur stationnaire admet \\(y^{\\prime}+y=2\\) ?'],
  C7M03: ['Déterminez la solution de \\(y^{\\prime}+2y=4\\) qui satisfait \\(y(0)=0\\).'],
  C7M04: ['Résolvez \\(y^{\\prime\\prime}-3y^{\\prime}+2y=0\\) dans le cas général :'],
  C7D01: ['Trouvez la solution du problème \\(y^{\\prime}+2y=e^{-t}\\), \\(y(0)=0\\).'],
  C7D02: ['Quelle solution satisfait \\(y^{\\prime\\prime}+3y^{\\prime}+2y=0\\), \\(y(0)=0\\) et \\(y^{\\prime}(0)=1\\) ?'],
  C7D03: ['Résolvez l’équation homogène \\(y^{\\prime\\prime}-2y^{\\prime}+y=0\\) :'],
  C7D04: ['Indiquez la forme générale des solutions de \\(y^{\\prime\\prime}+2y^{\\prime}+5y=0\\) :']
};
