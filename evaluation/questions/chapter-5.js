/* Chapitre 5 : séries entières et développements de Taylor. */
(()=>{
  const chapter=5;
  const data={
    facile:[
      ['Quel est le rayon de convergence de \\(\\sum_{n=0}^{\\infty}x^n\\) ?',['\\(1\\)','\\(0\\)','\\(2\\)','\\(+\\infty\\)'],0,'La série géométrique converge si \\(|x|<1\\) et diverge si \\(|x|\\ge1\\).'],
      ['Le rayon de convergence de \\(\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}\\) vaut :',['\\(0\\)','\\(1\\)','\\(+\\infty\\)','\\(1/2\\)'],2,'La série exponentielle converge pour tout \\(x\\in\\mathbb R\\).'],
      ['Quel est le rayon de convergence de \\(\\sum_{n=1}^{\\infty}nx^n\\) ?',['\\(0\\)','\\(1\\)','\\(2\\)','\\(+\\infty\\)'],1,'Le critère de d’Alembert donne la limite \\(|x|\\) pour le rapport des termes.'],
      ['Le développement de \\(\\sin x\\) près de \\(0\\) commence par :',['\\(1-x^2/2\\)','\\(1+x\\)','\\(x+x^2\\)','\\(x-x^3/6\\)'],3,'La formule de Maclaurin est \\(\\sin x=x-x^3/6+O(x^5)\\).'],
      ['Pour \\(|x|<1\\), \\(\\frac1{1-x}\\) est la somme de :',['\\(\\sum_{n=0}^{\\infty}x^n\\)','\\(\\sum_{n=1}^{\\infty}nx^n\\)','\\(\\sum_{n=0}^{\\infty}x^n/n!\\)','\\(\\sum_{n=1}^{\\infty}1/n\\)'],0,'C’est la formule de la série géométrique de raison \\(x\\).'],
      ['Le développement de \\(\\cos x\\) à l’ordre \\(2\\) en \\(0\\) est :',['\\(x-x^2/2\\)','\\(1+x\\)','\\(1-x^2/2+o(x^2)\\)','\\(x^2/2\\)'],2,'\\(\\cos0=1\\), \\(\\cos\\prime(0)=0\\) et \\(\\cos\\prime\\prime(0)=-1\\).'],
      ['Le polynôme de Taylor d’ordre \\(1\\) de \\(f\\) en \\(a\\) est :',['\\(f(a)(x-a)\\)','\\(f(a)+f\\prime(a)(x-a)\\)','\\(f\\prime(a)+x\\)','\\(f(a)+f\\prime\\prime(a)\\)'],1,'Il s’agit de l’approximation affine de \\(f\\) au voisinage de \\(a\\).'],
      ['Dans son intervalle de convergence, \\(\\frac{d}{dx}\\sum_{n=0}^{\\infty}x^n\\) vaut :',['\\(\\sum x^n\\)','\\(\\sum x^{n+1}\\)','\\(0\\)','\\(\\sum_{n=1}^{\\infty}nx^{n-1}\\)'],3,'On peut dériver terme à terme une série entière à l’intérieur de son rayon.'],
      ['Si une série entière a un rayon \\(R=2\\), elle converge absolument pour :',['\\(|x|<2\\)','\\(|x|>2\\)','Uniquement \\(x=2\\)','Tout réel'],0,'Le disque de convergence absolue est caractérisé par \\(|x|<R\\).'],
      ['Près de \\(0\\), \\(\\ln(1+x)\\) commence par :',['\\(1+x\\)','\\(x+x^2/2\\)','\\(x-x^2/2\\)','\\(x^2\\)'],2,'\\(\\ln(1+x)=x-x^2/2+O(x^3)\\) lorsque \\(x\\to0\\).']
    ],
    moyen:[
      ['Quel est le rayon de convergence de \\(\\sum_{n=0}^{\\infty}(2x)^n\\) ?',['\\(2\\)','\\(1/2\\)','\\(1\\)','\\(+\\infty\\)'],1,'La convergence exige \\(|2x|<1\\), soit \\(|x|<1/2\\).'],
      ['Pour \\(\\sum_{n=1}^{\\infty}\\frac{x^n}{n}\\), que se passe-t-il en \\(x=1\\) et \\(x=-1\\) ?',['Elle converge aux deux bornes','Elle diverge aux deux bornes','Elle converge en \\(1\\) seulement','Elle diverge en \\(1\\) mais converge en \\(-1\\)'],3,'En \\(1\\), on obtient l’harmonique ; en \\(-1\\), l’harmonique alternée.'],
      ['Le rayon de convergence de \\(\\sum_{n=0}^{\\infty}n!\\,x^n\\) est :',['\\(0\\)','\\(1\\)','\\(e\\)','\\(+\\infty\\)'],0,'Pour \\(x\\ne0\\), le rapport des termes est \\((n+1)|x|\\to+\\infty\\).'],
      ['Le rayon de convergence de la série \\(\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}\\) est :',['\\(0\\)','\\(1\\)','\\(+\\infty\\)','\\(e\\)'],2,'Les coefficients \\(1/n!\\) décroissent assez vite pour tout réel \\(x\\).'],
      ['Le polynôme de Maclaurin d’ordre \\(3\\) de \\(e^x\\) est :',['\\(1+x+x^2\\)','\\(1+x+x^2/2+x^3/6\\)','\\(x+x^3/6\\)','\\(1+x^3/6\\)'],1,'Les dérivées de \\(e^x\\) en \\(0\\) valent toutes \\(1\\).'],
      ['L’approximation quadratique de \\(e^{0,1}\\) vaut environ :',['\\(1,005\\)','\\(1,010\\)','\\(1,200\\)','\\(1,105\\)'],3,'\\(e^{0,1}\\approx1+0,1+0,1^2/2=1,105\\).'],
      ['La formule de Cauchy–Hadamard pour \\(\\sum a_nx^n\\) est :',['\\(1/R=\\limsup_{n\\to\\infty}|a_n|^{1/n}\\)','\\(R=\\sum|a_n|\\)','\\(R=|a_0|\\)','\\(1/R=\\lim a_n\\) toujours'],0,'La racine supérieure des coefficients détermine le rayon, avec les conventions usuelles.'],
      ['La série \\(\\sum_{n=0}^{\\infty}x^{2n}\\) a pour rayon :',['\\(2\\)','\\(0\\)','\\(1\\)','\\(+\\infty\\)'],2,'C’est une série géométrique de raison \\(x^2\\), convergente pour \\(|x|<1\\).'],
      ['Pour \\(|x|<1\\), \\(\\int_0^x\\frac{dt}{1-t}\\) vaut :',['\\(\\ln(1-x)\\)','\\(-\\ln(1-x)\\)','\\(1/(1-x)\\)','\\(x^2/2\\)'],1,'L’intégration de la série géométrique donne \\(\\sum_{n=0}^{\\infty}x^{n+1}/(n+1)=-\\ln(1-x)\\).'],
      ['Si \\(f\\prime\\prime(0)=6\\), le coefficient de \\(x^2\\) dans le polynôme de Taylor de \\(f\\) en \\(0\\) est :',['\\(6\\)','\\(12\\)','\\(1\\)','\\(3\\)'],3,'Le coefficient de \\(x^2\\) est \\(f\\prime\\prime(0)/2!=6/2=3\\).']
    ],
    difficile:[
      ['Le rayon de convergence de \\(\\sum_{n=1}^{\\infty}n^2x^n\\) vaut :',['\\(1\\)','\\(0\\)','\\(2\\)','\\(+\\infty\\)'],0,'On a \\(\\lim_{n\\to\\infty}(n^2)^{1/n}=1\\), donc \\(R=1\\).'],
      ['Le rayon de convergence de \\(\\sum_{n=1}^{\\infty}\\frac{n!}{n^n}x^n\\) vaut :',['\\(1\\)','\\(e\\)','\\(0\\)','\\(+\\infty\\)'],1,'Par la formule de Stirling, \\((n!/n^n)^{1/n}\\to e^{-1}\\), donc \\(R=e\\).'],
      ['La série \\(\\sum_{n=0}^{\\infty}\\frac{x^n}{n+1}\\) a pour comportement aux bornes :',['Convergence en \\(1\\) et divergence en \\(-1\\)','Divergence aux deux bornes','Divergence en \\(1\\) et convergence en \\(-1\\)','Convergence absolue aux deux bornes'],2,'En \\(1\\), l’harmonique décalée diverge ; en \\(-1\\), Leibniz donne la convergence.'],
      ['La série \\(\\sum_{n=0}^{\\infty}\\frac{(-1)^nx^{2n+1}}{(2n+1)!}\\) représente :',['\\(\\cos x\\)','\\(e^{-x}\\)','\\(\\sinh x\\)','\\(\\sin x\\)'],3,'C’est le développement de Maclaurin de la fonction sinus, valable sur \\(\\mathbb R\\).'],
      ['Le développement de \\(\\ln(1+x)\\) à l’ordre \\(3\\) est :',['\\(x-x^2/2+x^3/3+O(x^4)\\)','\\(x+x^2/2+x^3/3\\)','\\(1+x+x^2/2\\)','\\(x-x^3/6\\)'],0,'La série logarithmique alterne : \\(\\ln(1+x)=\\sum_{n\\ge1}(-1)^{n-1}x^n/n\\).'],
      ['Pour \\(|x|\\le0,1\\), une borne de l’erreur après le polynôme \\(1+x+x^2/2\\) pour \\(e^x\\) est :',['\\(|x|^2\\)','\\(e^{0,1}|x|^3/6\\)','\\(e^{0,1}|x|\\)','\\(|x|^4/24\\)'],1,'Le reste de Taylor–Lagrange vaut \\(e^{\\xi}x^3/3!\\), avec \\(|e^{\\xi}|\\le e^{0,1}\\).'],
      ['Pour \\(\\sum_{n=0}^{\\infty}\\frac{x^n}{2^n}\\), la convergence aux bornes \\(x=\\pm2\\) est :',['Absolue aux deux','Conditionnelle aux deux','Divergente aux deux','Absolue seulement en \\(2\\)'],2,'En \\(2\\), les termes valent \\(1\\) ; en \\(-2\\), ils valent \\((-1)^n\\), sans limite nulle.'],
      ['Pour \\(|x|<1\\), \\(\\sum_{n=1}^{\\infty}nx^n\\) vaut :',['\\(1/(1-x)\\)','\\(1/(1-x)^2\\)','\\(x/(1+x)^2\\)','\\(x/(1-x)^2\\)'],3,'Dériver \\(\\sum_{n=0}^{\\infty}x^n=(1-x)^{-1}\\), puis multiplier par \\(x\\).'],
      ['Le polynôme de Maclaurin d’ordre \\(5\\) de \\(\\sin x\\) est :',['\\(x-x^3/6+x^5/120\\)','\\(1-x^2/2+x^4/24\\)','\\(x+x^3/6+x^5/120\\)','\\(x-x^3/3+x^5/5\\)'],0,'La série du sinus contient les puissances impaires alternées divisées par leurs factorielles.'],
      ['Pour \\(H>0\\) et \\(|h|\\ll H\\), la linéarisation de \\(Q(h)=C\\sqrt{H+h}\\) est :',['\\(C\\sqrt H(1+h/H)\\)','\\(C\\sqrt H(1+h/(2H))\\)','\\(C(H+h)\\)','\\(C\\sqrt H(1-h/H)\\)'],1,'\\(\\sqrt{H+h}=\\sqrt H\\sqrt{1+h/H}\\approx\\sqrt H(1+h/(2H))\\).']
    ]
  };
  for(const [level,rows] of Object.entries(data))rows.forEach(([q,a,correct,why],i)=>{
    window.HYDRO_DEMO_QUESTIONS.push({id:'C5'+level[0].toUpperCase()+String(i+1).padStart(2,'0'),chapter,level,q,a,correct,why});
  });
})();
