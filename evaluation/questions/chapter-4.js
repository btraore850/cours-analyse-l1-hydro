/* Chapitre 4 : suites et séries de fonctions. */
(()=>{
  const chapter=4;
  const data={
    facile:[
      ['La convergence uniforme de \\(f_n\\) vers \\(f\\) sur \\(E\\) signifie :',['\\(\\sup_{x\\in E}|f_n(x)-f(x)|\\to0\\)','\\(f_n(x)\\to f(x)\\) pour un seul \\(x\\)','\\(f_n\\) est constante','\\(f_n(x)\\to+\\infty\\)'],0,'La norme uniforme de l’erreur doit tendre vers zéro sur tout \\(E\\).'],
      ['La convergence uniforme entraîne toujours :',['La dérivabilité de la limite','La convergence simple','L’égalité de toutes les fonctions','Une limite nulle'],1,'Si l’erreur est petite uniformément, elle est petite en chaque point.'],
      ['Si \\(f_n\\) est continue sur \\([a,b]\\) et converge uniformément vers \\(f\\), alors \\(f\\) est :',['Toujours dérivable','Toujours constante','Continue','Toujours polynomiale'],2,'La limite uniforme de fonctions continues est continue.'],
      ['Sur \\([0,1]\\), la limite simple de \\(f_n(x)=x^n\\) vaut :',['\\(0\\) partout','\\(1\\) partout','\\(x\\)','\\(0\\) si \\(x<1\\), et \\(1\\) en \\(x=1\\)'],3,'Pour \\(0\\le x<1\\), \\(x^n\\to0\\), mais \\(1^n=1\\).'],
      ['Une série \\(\\sum f_n\\) est normalement convergente sur \\(E\\) si :',['\\(\\sum\\sup_{x\\in E}|f_n(x)|<\\infty\\)','Chaque \\(f_n\\) est positive','Chaque \\(f_n\\) est dérivable','Sa somme est un polynôme'],0,'La convergence normale signifie que la série des normes uniformes converge.'],
      ['Pour \\(f_n(x)=1/n\\), la convergence vers \\(0\\) est uniforme :',['Uniquement en \\(x=0\\)','Sur tout ensemble non vide','Jamais','Seulement sur les entiers'],1,'L’erreur \\(|f_n(x)|=1/n\\) ne dépend pas de \\(x\\).'],
      ['Le critère de Weierstrass majore \\(|f_n(x)|\\) par :',['Une quantité dépendant librement de \\(x\\)','\\(n\\)','Un nombre \\(M_n\\ge0\\) dont la série converge','Une dérivée'],2,'Une série positive convergente de majorants \\(M_n\\) assure la convergence uniforme.'],
      ['Pour \\(f_n(x)=x/n\\) sur \\([0,1]\\), \\(\\sup|f_n(x)|\\) vaut :',['\\(1\\)','\\(n\\)','\\(0\\)','\\(1/n\\)'],3,'Le maximum de \\(x/n\\) sur \\([0,1]\\) est atteint en \\(x=1\\).'],
      ['Si \\(f_n\\to f\\) uniformément sur \\([a,b]\\), avec \\(f_n\\) continues, alors :',['\\(\\int_a^b f_n\\to\\int_a^b f\\)','Les intégrales divergent','Les \\(f_n\\) sont toutes identiques','\\(f\\) est nécessairement nulle'],0,'On peut passer à la limite sous l’intégrale sur un segment par convergence uniforme.'],
      ['Une convergence simple sans convergence uniforme est :',['Impossible','Possible','Toujours normale','Toujours absolue'],1,'La suite \\(f_n(x)=x^n\\) sur \\([0,1]\\) en est un exemple.']
    ],
    moyen:[
      ['Sur \\([0,a]\\), avec \\(0<a<1\\), \\(f_n(x)=x^n\\) converge vers \\(0\\) :',['Seulement simplement','Jamais','Uniformément','Uniquement en \\(x=a\\)'],2,'\\(\\sup_{[0,a]}x^n=a^n\\to0\\).'],
      ['Sur \\([0,1]\\), \\(f_n(x)=x^n\\) ne converge pas uniformément car :',['La limite simple est discontinue','Les fonctions sont négatives','La suite diverge en chaque point','Les fonctions ne sont pas bornées'],0,'Une limite uniforme de fonctions continues serait continue, or la limite simple saute en \\(1\\).'],
      ['Pour \\(f_n(x)=\\frac{x}{1+nx}\\) sur \\([0,1]\\), on a :',['Une divergence en \\(x=1\\)','Une convergence uniforme vers \\(0\\)','Une limite égale à \\(1\\)','Une somme infinie'],1,'\\(0\\le f_n(x)\\le1/(n+1)\\) sur \\([0,1]\\).'],
      ['Pour \\(f_n(x)=\\frac1{1+nx}\\) sur \\([0,1]\\), la convergence est :',['Uniforme vers \\(0\\)','Uniforme vers \\(1\\)','Normale','Simple, mais non uniforme'],3,'La limite vaut \\(1\\) en \\(0\\), mais \\(0\\) pour \\(x>0\\) ; elle est discontinue.'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{x^n}{n^2}\\) converge normalement sur \\([0,1]\\) car :',['\\(|x^n/n^2|\\le1/n^2\\)','\\(x^n\\to1\\) uniformément','\\(\\sum1/n^2\\) diverge','\\(x\\) est négatif'],0,'La série majorante \\(\\sum1/n^2\\) converge.'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{\\sin(nx)}{n^2}\\) converge uniformément sur \\(\\mathbb R\\) par :',['Le critère intégral appliqué à \\(x\\)','La dérivation terme à terme','Le critère de Weierstrass','La périodicité seule'],2,'\\(|\\sin(nx)/n^2|\\le1/n^2\\) pour tout réel \\(x\\).'],
      ['Pour \\(0<a<1\\), la série géométrique \\(\\sum_{n=0}^{\\infty}x^n\\) converge uniformément sur \\([0,a]\\) :',['Non, jamais','Oui, par \\(|x^n|\\le a^n\\)','Seulement si \\(x=0\\)','Seulement pour \\(a=1\\)'],1,'La série majorante \\(\\sum a^n\\) converge puisque \\(a<1\\).'],
      ['Sur \\([0,1]\\), \\(f_n(x)=nx e^{-nx}\\) converge simplement vers \\(0\\), mais :',['Converge uniformément','Est constante','N’est pas continue','Ne converge pas uniformément'],3,'En \\(x=1/n\\), \\(f_n(x)=e^{-1}\\) : l’erreur maximale ne tend pas vers zéro.'],
      ['Si \\(f_n\\to f\\) uniformément sur \\([a,b]\\), alors \\(\\int_a^b f_n\\to\\int_a^b f\\) à condition notamment que :',['Les fonctions soient intégrables','Les fonctions soient toutes croissantes','\\(f=0\\)','\\(a=b\\)'],0,'L’intégration commute avec la limite uniforme pour des fonctions intégrables sur un segment.'],
      ['Si \\(f_n(x)=\\sin(nx)/n\\) sur \\(\\mathbb R\\), alors \\(f_n\\to0\\) uniformément, mais :',['\\(f_n\\) n’est jamais dérivable','On ne peut pas conclure que \\(f_n\\prime\\to0\\)','\\(f_n\\) diverge','La limite est discontinue'],1,'Les dérivées \\(f_n\\prime(x)=\\cos(nx)\\) ne tendent pas vers \\(0\\) en \\(x=0\\).']
    ],
    difficile:[
      ['Sur \\([0,1]\\), \\(f_n(x)=x^n(1-x)\\) converge vers \\(0\\) :',['Seulement simplement','Pas même simplement','Uniformément','Vers une limite discontinue'],2,'Son maximum est \\(\\frac{n^n}{(n+1)^{n+1}}\\sim\\frac1{en}\\to0\\).'],
      ['Sur \\([0,1]\\), \\(f_n(x)=\\frac{nx}{1+n^2x^2}\\) converge simplement vers \\(0\\) mais non uniformément car :',['\\(f_n(1/n)=1/2\\)','\\(f_n(0)=1\\)','\\(f_n\\) est discontinue','\\(f_n\\) est négative'],0,'La valeur en \\(x=1/n\\) est \\(1/2\\), donc \\(\\|f_n\\|_\\infty\\ge1/2\\).'],
      ['Sur \\([0,1[\\), \\(x^n\\to0\\) simplement. La convergence est :',['Uniforme','Non uniforme','Normale','Divergente partout'],1,'Bien que \\(x<1\\), on a \\(\\sup_{x\\in[0,1[}x^n=1\\) pour tout \\(n\\).'],
      ['La série \\(\\sum_{n=1}^{\\infty}x^n/n\\) sur \\([0,1[\\) est :',['Normalement convergente','Uniformément convergente','Divergente en tout point','Simplement convergente mais non uniformément'],3,'Sa somme \\(-\\ln(1-x)\\) est non bornée près de \\(1\\) tandis que les sommes partielles sont bornées.'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^nx^n}{n}\\) converge sur \\([0,1]\\) :',['Uniformément par un reste de Leibniz \\(\\le1/(N+1)\\)','Jamais uniformément','Seulement au point \\(0\\)','Seulement si \\(x=1\\)'],0,'Pour \\(0\\le x\\le1\\), \\(x^n/n\\) décroît vers zéro et le reste est majoré uniformément.'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{x^n}{n^2}\\) converge normalement sur \\([-1,1]\\) :',['Non, à cause de \\(x=-1\\)','Seulement sur \\([0,1]\\)','Oui, par le majorant \\(1/n^2\\)','Non, car \\(x^n\\) change de signe'],2,'\\(\\sup_{[-1,1]}|x^n/n^2|=1/n^2\\), dont la somme est finie.'],
      ['La série \\(\\sum_{n=1}^{\\infty}\\frac{\\sin(nx)}n\\) n’est pas uniformément convergente sur \\([0,2\\pi]\\), notamment car :',['Elle est absolument convergente partout','Sa somme limite a des discontinuités aux bords','Ses termes sont constants','Tous ses termes sont positifs'],1,'Sa somme vaut \\((\\pi-x)/2\\) pour \\(0<x<2\\pi\\), mais \\(0\\) aux bords : limite discontinue.'],
      ['Sur \\([a,1]\\), avec \\(0<a<1\\), la suite \\(f_n(x)=x^n\\) :',['Converge uniformément vers \\(0\\)','Converge uniformément vers \\(1\\)','Ne converge pas simplement','Ne converge pas uniformément'],3,'La limite simple vaut \\(0\\) pour \\(x<1\\) et \\(1\\) en \\(x=1\\), donc elle est discontinue.'],
      ['Sur \\([0,+\\infty[\\), \\(f_n(x)=\\frac{x}{1+nx}\\) :',['Converge uniformément vers \\(0\\)','Converge vers \\(1\\)','Ne converge qu’en \\(x=0\\)','A une norme uniforme infinie'],0,'Pour tout \\(x\\ge0\\), \\(0\\le x/(1+nx)\\le1/n\\), donc convergence uniforme.'],
      ['Pour déduire la dérivabilité de la limite de \\(f_n\\), une hypothèse classique suffisante est :',['La convergence simple seule','La convergence uniforme de \\(f_n\\) seule','La convergence uniforme des dérivées sur un segment et la convergence de \\(f_n(x_0)\\)','La seule continuité de \\(f_n\\)'],2,'Avec \\(f_n\\prime\\) uniformément convergente et \\(f_n(x_0)\\) convergente, la limite est dérivable et on peut passer à la dérivée.']
    ]
  };
  for(const [level,rows] of Object.entries(data))rows.forEach(([q,a,correct,why],i)=>{
    window.HYDRO_DEMO_QUESTIONS.push({id:'C4'+level[0].toUpperCase()+String(i+1).padStart(2,'0'),chapter,level,q,a,correct,why});
  });
})();
