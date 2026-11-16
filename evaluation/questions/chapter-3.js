/* Chapitre 3 : séries numériques à termes quelconques. */
(()=>{
  const chapter=3;
  const data={
    facile:[
      ['Une série \\(\\sum u_n\\) est absolument convergente lorsque :',['\\(\\sum|u_n|\\) converge','\\(u_n\\ge0\\) pour tout \\(n\\)','\\(\\sum u_n\\) diverge','\\(u_n\\) ne tend pas vers \\(0\\)'],0,'La convergence absolue signifie précisément la convergence de \\(\\sum|u_n|\\).'],
      ['Pour appliquer le critère de Leibniz à \\(\\sum(-1)^na_n\\), on demande notamment :',['\\(a_n\\to1\\)','\\(a_n\\) croissante','\\(a_n\\ge0\\), décroissante et \\(a_n\\to0\\)','\\(a_n\\) constante non nulle'],2,'Leibniz s’applique lorsque les amplitudes sont positives, décroissantes et tendent vers zéro.'],
      ['La série harmonique alternée \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}n\\) est :',['Divergente','Absolument convergente','Géométrique','Conditionnellement convergente'],3,'Leibniz donne la convergence, mais \\(\\sum1/n\\) diverge.'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{n^2}\\) est :',['Divergente','Absolument convergente','Conditionnellement convergente seulement','À termes tous positifs'],1,'Sa série de valeurs absolues est \\(\\sum1/n^2\\), convergente.'],
      ['Une condition nécessaire pour que \\(\\sum u_n\\) converge est :',['\\(u_n\\to0\\)','\\(u_n\\to1\\)','\\(u_n\\ge0\\)','\\(u_n\\) croissante'],0,'Toute série convergente possède un terme général tendant vers \\(0\\).'],
      ['La série \\(\\sum_{n=1}^{\\infty}(-1)^n\\) est :',['Absolument convergente','Conditionnellement convergente','Divergente','De somme \\(0\\)'],2,'Le terme général \\((-1)^n\\) ne tend pas vers zéro.'],
      ['Pour une série alternée satisfaisant Leibniz, le reste après \\(N\\) termes est majoré en valeur absolue par :',['La somme totale','Le premier terme','\\(N\\)','\\(a_{N+1}\\)'],3,'La majoration de Leibniz est \\(|R_N|\\le a_{N+1}\\).'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{2^n}\\) est :',['Divergente','Absolument convergente','Seulement conditionnelle','Non définie'],1,'Les valeurs absolues forment une série géométrique de raison \\(1/2\\).'],
      ['Modifier un nombre fini de termes d’une série :',['Ne change pas sa nature convergente ou divergente','Transforme toute série en série convergente','Rend toute série alternée','Change toujours sa nature'],0,'Un nombre fini de termes modifie éventuellement la somme, mais pas la convergence.'],
      ['La convergence absolue implique :',['Toujours la divergence','L’absence de limite des sommes partielles','La convergence ordinaire','Que tous les termes sont positifs'],2,'Si \\(\\sum|u_n|\\) converge, alors \\(\\sum u_n\\) converge aussi.']
    ],
    moyen:[
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}n\\) est :',['Absolument convergente','Conditionnellement convergente','Divergente','À termes positifs'],1,'Elle converge par Leibniz, mais la série harmonique des valeurs absolues diverge.'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{\\sqrt n}\\) est :',['Conditionnellement convergente','Absolument convergente','Divergente','Géométrique'],0,'\\(1/\\sqrt n\\) décroît vers zéro, mais \\(\\sum1/\\sqrt n\\) diverge.'],
      ['La série \\(\\sum_{n=1}^{\\infty}(-1)^n\\frac{n}{n+1}\\) est :',['Conditionnellement convergente','Absolument convergente','De somme \\(1\\)','Divergente'],3,'La valeur absolue de son terme général tend vers \\(1\\), pas vers \\(0\\).'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{n+2}\\) est :',['Divergente','Absolument convergente','Conditionnellement convergente','À termes constants'],2,'Leibniz assure la convergence ; \\(\\sum1/(n+2)\\) diverge.'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{2(-1)^n}{n}\\) est :',['Absolument convergente','Conditionnellement convergente','Divergente','À termes positifs'],1,'Multiplier l’harmonique alternée par \\(2\\) ne change pas sa convergence conditionnelle.'],
      ['Pour l’harmonique alternée, après \\(4\\) termes, quelle borne de Leibniz s’applique au reste ?',['\\(|R_4|\\le1/5\\)','\\(|R_4|\\le1/2\\)','\\(|R_4|\\le1\\)','\\(|R_4|\\le1/20\\)'],0,'Le premier terme négligé est \\(1/5\\), qui majore \\(|R_4|\\).'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{\\sin n}{n^2}\\) est :',['Divergente','Seulement conditionnelle','À termes positifs','Absolument convergente'],3,'\\(|\\sin n|/n^2\\le1/n^2\\), donc la série converge absolument.'],
      ['Pour \\(n\\ge2\\), \\(\\sum\\frac{(-1)^n}{n\\ln n}\\) est :',['Absolument convergente','Divergente','Conditionnellement convergente','Géométrique'],2,'\\(1/(n\\ln n)\\) décroît vers zéro, mais sa série positive diverge.'],
      ['La série \\(\\sum_{n=1}^{\\infty}(-1)^n(1+1/n)\\) est :',['Conditionnellement convergente','Divergente','Absolument convergente','De somme \\(0\\)'],1,'Le terme général ne tend pas vers \\(0\\) à cause du facteur \\((-1)^n\\).'],
      ['Réarranger une série absolument convergente :',['Ne change pas sa somme','Change toujours sa somme','La rend divergente','La rend alternée'],0,'Le théorème de réarrangement assure l’invariance de la somme en convergence absolue.']
    ],
    difficile:[
      ['La série \\(\\sum_{n=2}^{\\infty}(-1)^n\\frac{\\ln n}{n}\\) est :',['Absolument convergente','Divergente','Géométrique','Conditionnellement convergente'],3,'\\((\\ln n)/n\\) décroît à partir d’un certain rang vers \\(0\\), mais \\(\\sum(\\ln n)/n\\) diverge.'],
      ['La série \\(\\sum_{n=1}^{\\infty}(-1)^n\\sin(1/n)\\) est :',['Conditionnellement convergente','Absolument convergente','Divergente','À termes positifs'],0,'\\(\\sin(1/n)\\downarrow0\\) et \\(\\sin(1/n)\\sim1/n\\) ; l’absolue diverge.'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{\\sqrt{n+1}+\\sqrt n}\\) est :',['Absolument convergente','Divergente','Conditionnellement convergente','Télescopique positive'],2,'Les amplitudes décroissent vers \\(0\\) et sont équivalentes à \\(1/(2\\sqrt n)\\).'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{n^{3/4}}\\) est :',['Divergente','Conditionnellement convergente','Absolument convergente','Géométrique'],1,'Leibniz s’applique, mais \\(\\sum n^{-3/4}\\) diverge car \\(3/4\\le1\\).'],
      ['La série \\(\\sum_{n=1}^{\\infty}(-1)^n(\\sqrt{n+1}-\\sqrt n)\\) est :',['Absolument convergente','Divergente','Géométrique','Conditionnellement convergente'],3,'\\(\\sqrt{n+1}-\\sqrt n=1/(\\sqrt{n+1}+\\sqrt n)\\downarrow0\\), mais sa série positive diverge.'],
      ['Pour \\(n\\ge2\\), \\(\\sum\\frac{(-1)^n}{\\ln(n+1)}\\) est :',['Conditionnellement convergente','Absolument convergente','Divergente','De somme nulle'],0,'\\(1/\\ln(n+1)\\downarrow0\\) ; la série positive diverge par comparaison à \\(1/n\\).'],
      ['La série \\(\\sum_{n=2}^{\\infty}(-1)^n\\frac{\\ln n}{n^2}\\) est :',['Seulement conditionnelle','Divergente','Absolument convergente','Non définie'],2,'\\(\\sum(\\ln n)/n^2\\) converge par comparaison à \\(\\sum n^{-3/2}\\) à partir d’un rang.'],
      ['Un réarrangement d’une série réelle conditionnellement convergente peut :',['Toujours conserver la somme','Changer sa somme ou provoquer la divergence','Toujours la rendre absolument convergente','Supprimer les termes négatifs'],1,'Le théorème de Riemann montre qu’un réarrangement peut modifier la somme, voire entraîner la divergence.'],
      ['Pour l’harmonique alternée, combien de termes suffisent pour garantir par Leibniz une erreur au plus \\(10^{-3}\\) ?',['\\(100\\)','\\(500\\)','\\(1000\\) au minimum','\\(999\\)'],3,'Il faut \\(1/(N+1)\\le10^{-3}\\), donc \\(N\\ge999\\).'],
      ['La série \\(\\sum_{n=1}^{\\infty}(-1)^n\\frac{n+1}{n^2}\\) est :',['Divergente','Absolument convergente','Conditionnellement convergente','De somme \\(0\\)'],2,'\\((n+1)/n^2=1/n+1/n^2\\) décroît vers \\(0\\), mais ses valeurs absolues ont une somme divergente.']
    ]
  };
  for(const [level,rows] of Object.entries(data))rows.forEach(([q,a,correct,why],i)=>{
    window.HYDRO_DEMO_QUESTIONS.push({id:'C3'+level[0].toUpperCase()+String(i+1).padStart(2,'0'),chapter,level,q,a,correct,why});
  });
})();
