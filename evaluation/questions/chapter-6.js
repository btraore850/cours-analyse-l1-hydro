/* Chapitre 6 : séries de Fourier, convention des fonctions 2π-périodiques. */
(()=>{
  const chapter=6;
  const data={
    facile:[
      ['Quelle est la période fondamentale de \\(\\sin x\\) ?',['\\(2\\pi\\)','\\(\\pi\\)','\\(1\\)','\\(4\\pi\\)'],0,'On a \\(\\sin(x+2\\pi)=\\sin x\\), avec période fondamentale \\(2\\pi\\).'],
      ['Pour \\(n\\in\\mathbb N^*\\), la période fondamentale de \\(\\cos(nx)\\) est :',['\\(2\\pi n\\)','\\(\\pi/n\\)','\\(2\\pi/n\\)','\\(n\\)'],2,'\\(\\cos(n(x+T))=\\cos(nx)\\) pour \\(nT=2\\pi\\).'],
      ['Pour une fonction \\(2\\pi\\)-périodique et paire, les coefficients de sinus \\(b_n\\) sont :',['Toujours égaux à \\(1\\)','Tous nuls','Tous négatifs','Non définis'],1,'Le produit d’une fonction paire et de \\(\\sin(nx)\\), impair, s’intègre à zéro sur \\([-\\pi,\\pi]\\).'],
      ['Pour une fonction impaire, les coefficients de cosinus \\(a_n\\) sont :',['Tous égaux à \\(1\\)','Tous positifs','Égaux à \\(n\\)','Tous nuls'],3,'Le produit d’une fonction impaire et de \\(\\cos(nx)\\) est impair.'],
      ['Si \\(f(x)=3\\), quel est son coefficient constant \\(a_0\\) avec la convention \\(f\\sim a_0/2+\\cdots\\) ?',['\\(6\\)','\\(3\\)','\\(0\\)','\\(1\\)'],0,'\\(a_0=(1/\\pi)\\int_{-\\pi}^{\\pi}3\\,dx=6\\), donc \\(a_0/2=3\\).'],
      ['Pour \\(f(x)=\\sin(2x)\\), quel coefficient est égal à \\(1\\) ?',['\\(a_2\\)','\\(a_0\\)','\\(b_2\\)','\\(b_1\\)'],2,'La fonction est déjà une harmonique sinus de rang \\(2\\).'],
      ['Pour \\(f(x)=\\cos(3x)\\), on a :',['\\(b_3=1\\)','\\(a_3=1\\)','\\(a_0=3\\)','\\(b_1=1\\)'],1,'La seule harmonique non nulle est le cosinus de rang \\(3\\).'],
      ['L’identité de Parseval relie les coefficients de Fourier à :',['La période seule','La dérivée en \\(0\\)','Une suite géométrique','L’énergie moyenne ou norme quadratique du signal'],3,'Parseval exprime une énergie du signal par la somme des carrés de ses coefficients.'],
      ['Dans une série de Fourier, une harmonique est :',['Une composante sinusoïdale de fréquence multiple de la fondamentale','Une constante de dérivation','Une suite toujours décroissante','Une intégrale impropre'],0,'Les termes \\(\\cos(n\\omega t)\\) et \\(\\sin(n\\omega t)\\) sont des harmoniques.'],
      ['Pour un phénomène annuel de période \\(12\\) mois, la pulsation fondamentale vaut :',['\\(12\\pi\\) rad/mois','\\(\\pi\\) rad/mois','\\(2\\pi/12\\) rad/mois','\\(2\\pi\\) rad/mois'],2,'La pulsation est \\(\\omega=2\\pi/T=2\\pi/12\\).']
    ],
    moyen:[
      ['Pour \\(f(x)=2+3\\cos x-\\sin(2x)\\), le coefficient \\(b_2\\) vaut :',['\\(2\\)','\\(-1\\)','\\(3\\)','\\(0\\)'],1,'Le coefficient associé à \\(\\sin(2x)\\) est \\(-1\\).'],
      ['Pour l’extension \\(2\\pi\\)-périodique de \\(f(x)=x\\) sur \\(]-\\pi,\\pi[\\), le coefficient \\(b_1\\) vaut :',['\\(0\\)','\\(1\\)','\\(-2\\)','\\(2\\)'],3,'\\(b_n=2(-1)^{n+1}/n\\), d’où \\(b_1=2\\).'],
      ['Pour \\(f(x)=x^2\\) sur \\([-\\pi,\\pi]\\), le terme constant \\(a_0/2\\) vaut :',['\\(\\pi^2/3\\)','\\(2\\pi^2/3\\)','\\(\\pi/2\\)','\\(0\\)'],0,'\\(a_0/2=(1/(2\\pi))\\int_{-\\pi}^{\\pi}x^2dx=\\pi^2/3\\).'],
      ['Au point de saut d’une fonction vérifiant les hypothèses de Dirichlet, la série de Fourier converge vers :',['La limite à gauche seulement','La limite à droite seulement','La moyenne des limites latérales','Toujours \\(0\\)'],2,'La valeur de convergence est \\((f(x^-)+f(x^+))/2\\).'],
      ['Pour \\(f(x)=|\\sin x|\\), quel groupe de coefficients s’annule ?',['Tous les \\(a_n\\)','Tous les \\(b_n\\)','Seulement \\(a_0\\)','Aucun'],1,'La fonction \\(|\\sin x|\\) est paire, donc les coefficients de sinus sont nuls.'],
      ['Pour \\(m,n\\ge1\\), \\(\\int_{-\\pi}^{\\pi}\\sin(nx)\\cos(mx)\\,dx\\) vaut :',['\\(\\pi\\)','\\(2\\pi\\)','\\(1\\)','\\(0\\)'],3,'Le produit est impair, donc son intégrale sur l’intervalle symétrique est nulle.'],
      ['Pour \\(n\\ge1\\), \\(\\int_{-\\pi}^{\\pi}\\cos^2(nx)\\,dx\\) vaut :',['\\(\\pi\\)','\\(2\\pi\\)','\\(\\pi/2\\)','\\(0\\)'],0,'Avec \\(\\cos^2(nx)=(1+\\cos(2nx))/2\\), l’intégrale vaut \\(\\pi\\).'],
      ['Pour \\(f(x)=\\cos x+\\cos(2x)\\), on a :',['\\(b_1=b_2=1\\)','\\(a_0=2\\)','\\(a_1=a_2=1\\)','\\(a_3=1\\)'],2,'Les deux harmoniques en cosinus ont chacune un coefficient égal à \\(1\\).'],
      ['Si la moyenne d’une fonction périodique intégrable sur une période est nulle, alors :',['\\(b_1=1\\)','\\(a_0=0\\)','Tous les coefficients sont nuls','La fonction est impaire'],1,'La moyenne sur une période est le terme constant \\(a_0/2\\).'],
      ['Pour \\(Q(t)=Q_0+A\\cos(\\omega t)+B\\sin(\\omega t)\\), l’amplitude de l’harmonique est :',['\\(|A+B|\\)','\\(A-B\\)','\\(AB\\)','\\(\\sqrt{A^2+B^2}\\)'],3,'L’amplitude résulte de la combinaison des coefficients sinus et cosinus.']
    ],
    difficile:[
      ['Pour l’extension périodique de \\(f(x)=x\\) sur \\(]-\\pi,\\pi[\\), \\(b_2\\) vaut :',['\\(-1\\)','\\(1\\)','\\(2\\)','\\(-2\\)'],0,'\\(b_n=2(-1)^{n+1}/n\\) donne \\(b_2=2(-1)^3/2=-1\\).'],
      ['Pour \\(f(x)=\\operatorname{sgn}(x)\\) sur \\(]-\\pi,\\pi[\\), le coefficient \\(b_1\\) est :',['\\(2/\\pi\\)','\\(4/\\pi\\)','\\(0\\)','\\(\\pi/4\\)'],1,'\\(b_n=(2/\\pi)\\int_0^\\pi\\sin(nx)dx\\), donc \\(b_1=4/\\pi\\).'],
      ['Pour l’extension périodique de \\(\\operatorname{sgn}(x)\\), la série de Fourier en \\(x=0\\) converge vers :',['\\(1\\)','\\(-1\\)','\\(0\\)','\\(2\\)'],2,'Les limites latérales en \\(0\\) sont \\(-1\\) et \\(1\\) ; leur moyenne est \\(0\\).'],
      ['Pour \\(f(x)=\\sin x\\), la somme \\(\\sum_{n\\ge1}(a_n^2+b_n^2)\\) vaut :',['\\(0\\)','\\(\\pi\\)','\\(2\\)','\\(1\\)'],3,'Seul \\(b_1=1\\) est non nul ; Parseval donne également \\((1/\\pi)\\int\\sin^2x\\,dx=1\\).'],
      ['Pour \\(f(x)=x^2\\) sur \\([-\\pi,\\pi]\\), le coefficient \\(a_1\\) vaut :',['\\(-4\\)','\\(4\\)','\\(-2\\)','\\(0\\)'],0,'Par intégration par parties, \\(a_n=4(-1)^n/n^2\\), donc \\(a_1=-4\\).'],
      ['La moyenne de \\(f(x)^2\\) sur \\(2\\pi\\) pour \\(f(x)=\\cos(3x)+2\\sin(4x)\\) vaut :',['\\(5\\)','\\(5/2\\)','\\(3/2\\)','\\(1\\)'],1,'L’orthogonalité donne \\((1^2+2^2)/2=5/2\\).'],
      ['Écrire \\(\\cos(\\omega(t-\\tau))=A\\cos(\\omega t)+B\\sin(\\omega t)\\). Que vaut \\(B\\) ?',['\\(-\\sin(\\omega\\tau)\\)','\\(\\cos(\\omega\\tau)\\)','\\(\\sin(\\omega\\tau)\\)','\\(-\\cos(\\omega\\tau)\\)'],2,'La formule \\(\\cos(a-b)=\\cos a\\cos b+\\sin a\\sin b\\) donne \\(B=\\sin(\\omega\\tau)\\).'],
      ['En un point où \\(f\\) est continue et satisfait les hypothèses usuelles de Dirichlet, la somme de Fourier vaut :',['Toujours \\(0\\)','Toujours \\(a_0/2\\)','La dérivée \\(f\\prime(x)\\)','\\(f(x)\\)'],3,'La moyenne des limites latérales coïncide avec \\(f(x)\\) aux points de continuité.'],
      ['Pour \\(f(x)=\\sin^2x\\), quel est son coefficient \\(a_2\\) ?',['\\(-1/2\\)','\\(1/2\\)','\\(1\\)','\\(0\\)'],0,'\\(\\sin^2x=(1-\\cos2x)/2\\), donc le coefficient de \\(\\cos2x\\) est \\(-1/2\\).'],
      ['Pour un débit mensuel \\(Q(t)=10+3\\cos(2\\pi t/12)-4\\sin(2\\pi t/12)\\), quelle est l’amplitude saisonnière ?',['\\(7\\)','\\(5\\)','\\(10\\)','\\(1\\)'],1,'La moyenne est \\(10\\) et l’amplitude de l’harmonique annuelle est \\(\\sqrt{3^2+(-4)^2}=5\\).']
    ]
  };
  for(const [level,rows] of Object.entries(data))rows.forEach(([q,a,correct,why],i)=>{
    window.HYDRO_DEMO_QUESTIONS.push({id:'C6'+level[0].toUpperCase()+String(i+1).padStart(2,'0'),chapter,level,q,a,correct,why});
  });
})();
