/* Chapitre 7 — Équations différentielles et lois de conservation. */
(()=>{
  const chapter=7;
  const data={
    facile:[
      ['La dérivée de \\(y(t)=e^{2t}\\) est :',['\\(e^{2t}\\)','\\(2e^{2t}\\)','\\(2t e^{2t}\\)','\\(e^t\\)'],1,'La dérivation de \\(e^{at}\\) donne \\(ae^{at}\\).'],
      ['La solution de \\(y^{\prime}=ky\\), avec \\(y(0)=y_0\\), est :',['\\(y=y_0+kt\\)','\\(y=y_0t^k\\)','\\(y=y_0e^{kt}\\)','\\(y=ke^{y_0t}\\)'],2,'La séparation des variables conduit à une solution exponentielle.'],
      ['Quel est l’ordre de \\(y^{\prime\prime}+y=0\\) ?',['\\(1\\)','\\(2\\)','\\(3\\)','\\(0\\)'],1,'L’ordre est celui de la dérivée la plus élevée, ici \\(y^{\prime\prime}\\).'],
      ['Les solutions de \\(y^{\prime}=3\\) sont :',['\\(3t+C\\)','\\(3e^t\\)','\\(t^3+C\\)','\\(C e^{3t}\\)'],0,'Une primitive de la constante \\(3\\) est \\(3t+C\\).'],
      ['Les solutions de \\(y^{\prime}+2y=0\\) sont :',['\\(Ce^{2t}\\)','\\(2t+C\\)','\\(Ce^{-2t}\\)','\\(C\\cos(2t)\\)'],2,'On écrit \\(y^{\prime}=-2y\\) et on résout par séparation.'],
      ['Pour un réservoir sans autre apport, la condition \\(dV/dt=0\\) traduit :',['Un volume nul','Un débit sortant nul','Un débit entrant nul','Une égalité des débits entrant et sortant'],3,'Un volume constant impose un bilan des flux nul.'],
      ['Si \\(Q_{in}=5\\), \\(Q_{out}=3\\), et l’apport supplémentaire \\(R=1\\), alors \\(dV/dt=Q_{in}-Q_{out}+R\\) vaut :',['\\(1\\)','\\(3\\)','\\(7\\)','\\(9\\)'],1,'Le bilan donne \\(5-3+1=3\\), en unité de volume par temps.'],
      ['Pour \\(y^{\prime}=2y\\), la condition initiale \\(y(0)=4\\) donne :',['\\(y=4e^{2t}\\)','\\(y=2e^{4t}\\)','\\(y=4+2t\\)','\\(y=e^{8t}\\)'],0,'La forme générale est \\(Ce^{2t}\\) et \\(C=y(0)=4\\).'],
      ['La solution générale réelle de \\(y^{\prime\prime}+\\omega^2 y=0\\), avec \\(\\omega>0\\), est :',['\\(Ce^{-\\omega t}\\)','\\(C_1e^{\\omega t}+C_2e^{-\\omega t}\\)','\\(C_1\\cos(\\omega t)+C_2\\sin(\\omega t)\\)','\\(C_1+C_2t\\)'],2,'L’équation caractéristique possède les racines imaginaires \\(\\pm i\\omega\\).'],
      ['Si \\(Q_{out}=kV\\), avec \\(k>0\\) et sans apport, alors le volume suit :',['Une croissance linéaire','Une décroissance exponentielle','Une oscillation périodique','Une valeur constante'],1,'Le bilan est \\(V^{\prime}=-kV\\), d’où \\(V(t)=V(0)e^{-kt}\\).']
    ],
    moyen:[
      ['Résoudre \\(y^{\prime}=2t\\), avec \\(y(0)=1\\).',['\\(y=2t+1\\)','\\(y=t^2+1\\)','\\(y=e^{t^2}\\)','\\(y=t^2\\)'],1,'Une primitive de \\(2t\\) est \\(t^2+C\\) ; \\(C=1\\).'],
      ['L’état d’équilibre de \\(y^{\prime}+y=2\\) est :',['\\(0\\)','\\(1\\)','\\(2\\)','\\(-2\\)'],2,'À l’équilibre, \\(y^{\prime}=0\\), donc \\(y=2\\).'],
      ['Résoudre \\(y^{\prime}+2y=4\\), avec \\(y(0)=0\\).',['\\(2(1-e^{-2t})\\)','\\(4e^{-2t}\\)','\\(2e^{2t}\\)','\\(4t\\)'],0,'La solution générale est \\(2+Ce^{-2t}\\) ; la condition initiale donne \\(C=-2\\).'],
      ['La solution générale de \\(y^{\prime\prime}-3y^{\prime}+2y=0\\) est :',['\\(C_1\\cos t+C_2\\sin t\\)','\\(C_1e^{-t}+C_2e^{-2t}\\)','\\((C_1+C_2t)e^t\\)','\\(C_1e^t+C_2e^{2t}\\)'],3,'L’équation caractéristique \\(r^2-3r+2=0\\) a les racines \\(1\\) et \\(2\\).'],
      ['Les solutions de \\(y^{\prime\prime}+4y=0\\) s’écrivent :',['\\(C_1e^{2t}+C_2e^{-2t}\\)','\\(C_1\\cos(2t)+C_2\\sin(2t)\\)','\\(C_1+C_2t\\)','\\(C_1\\cos(4t)+C_2\\sin(4t)\\)'],1,'Les racines caractéristiques sont \\(\\pm2i\\).'],
      ['Un réservoir vérifie \\(V^{\prime}=10-kV\\), où \\(k>0\\). Son volume d’équilibre est :',['\\(10/k\\)','\\(10k\\)','\\(k/10\\)','\\(0\\)'],0,'À l’équilibre, \\(10-kV=0\\), donc \\(V=10/k\\).'],
      ['Un débit entrant de \\(5\\,\\mathrm{m^3/s}\\) et un débit sortant de \\(3\\,\\mathrm{m^3/s}\\) donnent \\(dV/dt\\) égal à :',['\\(8\\,\\mathrm{m^3/s}\\)','\\(15\\,\\mathrm{m^3/s}\\)','\\(2\\,\\mathrm{m^3/s}\\)','\\(2\\,\\mathrm{m^3}\\)'],2,'Le taux de variation du stockage est \\(5-3=2\\,\\mathrm{m^3/s}\\).'],
      ['Pour \\(y^{\prime}+p(t)y=q(t)\\), un facteur intégrant est :',['\\(p(t)\\)','\\(e^{\\int p(t)\\,dt}\\)','\\(\\int q(t)\\,dt\\)','\\(e^{\\int q(t)\\,dt}\\)'],1,'Multiplier par \\(\\mu(t)=e^{\\int p(t)dt}\\) fait apparaître \\((\\mu y)^{\prime}\\).'],
      ['Pour \\(y^{\prime}=-ky\\), \\(k>0\\), le temps nécessaire pour diviser \\(y\\) par deux est :',['\\(k/2\\)','\\(2/k\\)','\\(\\ln k\\)','\\(\\ln 2/k\\)'],3,'L’égalité \\(e^{-kt}=1/2\\) donne \\(t=\\ln 2/k\\).'],
      ['Si \\(V^{\prime}=-2\\,\\mathrm{m^3/s}\\) pendant \\(5\\) secondes, la variation totale de volume est :',['\\(-10\\,\\mathrm{m^3}\\)','\\(-2\\,\\mathrm{m^3}\\)','\\(10\\,\\mathrm{m^3/s}\\)','\\(-0,4\\,\\mathrm{m^3}\\)'],0,'On intègre le taux constant : \\(\\Delta V=-2\\times5=-10\\,\\mathrm{m^3}\\).']
    ],
    difficile:[
      ['Résoudre \\(y^{\prime}+2y=e^{-t}\\), avec \\(y(0)=0\\).',['\\(e^{-2t}-e^{-t}\\)','\\(e^{-t}-e^{-2t}\\)','\\(te^{-2t}\\)','\\(e^{-t}\\)'],1,'En multipliant par \\(e^{2t}\\), on obtient \\((e^{2t}y)^{\prime}=e^t\\) puis \\(y=e^{-t}+Ce^{-2t}\\), avec \\(C=-1\\).'],
      ['Résoudre \\(y^{\prime\prime}+3y^{\prime}+2y=0\\), avec \\(y(0)=0\\) et \\(y^{\prime}(0)=1\\).',['\\(e^{-t}-e^{-2t}\\)','\\(e^{-t}+e^{-2t}\\)','\\(e^t-e^{2t}\\)','\\(2e^{-t}-e^{-2t}\\)'],0,'Les racines sont \\(-1,-2\\). Les conditions initiales donnent \\(C_1=1\\) et \\(C_2=-1\\).'],
      ['La solution générale de \\(y^{\prime\prime}-2y^{\prime}+y=0\\) est :',['\\(C_1e^t+C_2e^{-t}\\)','\\(C_1\\cos t+C_2\\sin t\\)','\\((C_1+C_2t)e^t\\)','\\(C_1+C_2e^t\\)'],2,'Le polynôme caractéristique est \\((r-1)^2\\) ; la racine double impose le facteur \\(t\\).'],
      ['Les solutions de \\(y^{\prime\prime}+2y^{\prime}+5y=0\\) sont :',['\\(C_1e^{-t}+C_2e^{-5t}\\)','\\(e^t(C_1\\cos2t+C_2\\sin2t)\\)','\\(C_1\\cos5t+C_2\\sin5t\\)','\\(e^{-t}(C_1\\cos2t+C_2\\sin2t)\\)'],3,'Les racines caractéristiques sont \\(-1\\pm2i\\).'],
      ['Le réservoir vérifie \\(V^{\prime}=q-kV\\), \\(q,k>0\\), et \\(V(0)=V_0\\). Quelle solution convient ?',['\\(V=V_0+qt\\)','\\(V=q/k+(V_0-q/k)e^{-kt}\\)','\\(V=(q-kV_0)e^{-kt}\\)','\\(V=V_0e^{kt}\\)'],1,'La solution est la somme de l’équilibre \\(q/k\\) et du transitoire exponentiel.'],
      ['Pour \\(V^{\prime}(t)=A\\sin(\\omega t)\\), \\(\\omega>0\\), et \\(V(0)=V_0\\), on obtient :',['\\(V=V_0+\\frac{A}{\\omega}(1-\\cos\\omega t)\\)','\\(V=V_0+A\\cos\\omega t\\)','\\(V=V_0+\\omega A\\sin\\omega t\\)','\\(V=V_0+At\\)'],0,'On intègre l’apport périodique de \\(0\\) à \\(t\\) : \\(\\int_0^t A\\sin(\\omega s)ds=A(1-\\cos\\omega t)/\\omega\\).'],
      ['Sans apport, un réservoir vérifie \\(V^{\prime}=-k\\sqrt{V}\\), \\(V(0)=V_0>0\\). Quel est le temps théorique de vidange ?',['\\(V_0/k\\)','\\(k\\sqrt{V_0}\\)','\\(2\\sqrt{V_0}/k\\)','\\(\\ln2/k\\)'],2,'Pour \\(V>0\\), \\(2\\sqrt V=2\\sqrt{V_0}-kt\\) ; le réservoir atteint zéro à \\(2\\sqrt{V_0}/k\\).'],
      ['Une solution particulière de \\(y^{\prime\prime}+y=\\sin t\\) est :',['\\(\\sin t\\)','\\(\\frac12t\\sin t\\)','\\(e^{-t}\\)','\\(-\\frac12t\\cos t\\)'],3,'En situation de résonance, \\(y_p=-(t/2)\\cos t\\) donne \\(y_p^{\prime\prime}+y_p=\\sin t\\).'],
      ['Quel résultat garantit une solution locale unique pour \\(y^{\prime}=f(t,y)\\), \\(y(t_0)=y_0\\), sous ses hypothèses usuelles ?',['Le théorème de Pythagore','Le théorème de Cauchy–Lipschitz','Le théorème de Parseval','Le critère de Leibniz'],1,'La continuité et une condition de Lipschitz locale en \\(y\\) garantissent l’existence et l’unicité locales.'],
      ['Un bassin vérifie \\(V^{\prime}(t)=Q_{in}-Q_{out}+R(t)\\), avec \\(Q_{in}=3\\), \\(Q_{out}=1\\), \\(R(t)=2t\\) et \\(V(0)=5\\). Alors :',['\\(V=5+2t+t^2\\)','\\(V=5+4t\\)','\\(V=5+2t^2\\)','\\(V=5+2e^t\\)'],0,'Le bilan donne \\(V^{\prime}=2+2t\\). Après intégration et application de \\(V(0)=5\\), \\(V=5+2t+t^2\\).']
    ]
  };
  for(const [level,rows] of Object.entries(data))rows.forEach(([q,a,correct,why],i)=>{
    window.HYDRO_DEMO_QUESTIONS.push({id:'C7'+level[0].toUpperCase()+String(i+1).padStart(2,'0'),chapter,level,q,a,correct,why});
  });
})();
