/* Chapitre 1 : rappels fondamentaux d'analyse — questions publiques d'entraînement. */
(()=>{
  const chapter=1;
  const data={
    facile:[
      ['Quel est le domaine de définition de \\(f(x)=\\ln x\\) ?',['\\(\\mathbb R\\)','\\(]0,+\\infty[\\)','\\([0,+\\infty[\\)','\\(]-\\infty,0[\\)'],1,'Le logarithme népérien est défini pour \\(x>0\\).'],
      ['Quelle est la dérivée de \\(f(x)=x^3\\) ?',['\\(3x^2\\)','\\(x^2\\)','\\(3x\\)','\\(x^4/4\\)'],0,'La règle \\((x^n)\\prime=nx^{n-1}\\) donne \\(3x^2\\).'],
      ['Combien vaut \\(\\displaystyle\\lim_{x\\to0}\\frac{\\sin x}{x}\\) ?',['\\(0\\)','\\(+\\infty\\)','\\(1\\)','\\(-1\\)'],2,'Cette limite remarquable vaut \\(1\\) (avec \\(x\\) en radians).'],
      ['Sur quel intervalle réel la fonction \\(f(x)=\\sqrt x\\) est-elle définie ?',['\\(]-\\infty,0]\\)','\\(\\mathbb R\\)','\\(]0,+\\infty[\\) seulement','\\([0,+\\infty[\\)'],3,'Une racine carrée réelle existe si et seulement si \\(x\\ge0\\).'],
      ['Quelle est une primitive de \\(f(x)=2x\\) ?',['\\(2x^2\\)','\\(x^2\\)','\\(\\ln x\\)','\\(2\\)'],1,'La dérivée de \\(x^2\\) est \\(2x\\) ; toute primitive vaut \\(x^2+C\\).'],
      ['Quelle est la valeur de \\(\\displaystyle\\int_0^1 x\\,dx\\) ?',['\\(1\\)','\\(2\\)','\\(\\frac12\\)','\\(0\\)'],2,'Une primitive est \\(x^2/2\\) : \\([x^2/2]_0^1=1/2\\).'],
      ['Quelle est la dérivée de \\(f(x)=e^x\\) ?',['\\(e^x\\)','\\(xe^{x-1}\\)','\\(1/x\\)','\\(\\ln x\\)'],0,'La fonction exponentielle est sa propre dérivée.'],
      ['La fonction \\(f(x)=\\cos x\\) est :',['Impaire','Paire','Ni paire ni impaire','Toujours croissante'],1,'On a \\(\\cos(-x)=\\cos x\\), donc la fonction est paire.'],
      ['Quelle est la pente de la tangente à \\(f(x)=x^2\\) en \\(x=1\\) ?',['\\(1\\)','\\(0\\)','\\(3\\)','\\(2\\)'],3,'La pente est \\(f\\prime(1)=2\\times1=2\\).'],
      ['Si un débit est \\(Q(t)=3t+2\\), quelle est sa dérivée par rapport au temps ?',['\\(3\\)','\\(2\\)','\\(3t\\)','\\(3t+2\\)'],0,'La dérivée de la fonction affine \\(3t+2\\) est constante et vaut \\(3\\).']
    ],
    moyen:[
      ['Quel est le domaine de \\(f(x)=\\ln(2-x)\\) ?',['\\(x>2\\)','\\(x\\le2\\)','\\(x<2\\)','Tout \\(x\\in\\mathbb R\\)'],2,'Il faut \\(2-x>0\\), soit \\(x<2\\).'],
      ['Quelle est la dérivée de \\(f(x)=xe^x\\) ?',['\\(e^x\\)','\\((x+1)e^x\\)','\\(xe^x\\)','\\((x-1)e^x\\)'],1,'Par la règle du produit, \\((xe^x)\\prime=e^x+xe^x\\).'],
      ['Quelle est la limite \\(\\displaystyle\\lim_{x\\to0}\\frac{e^x-1}{x}\\) ?',['\\(1\\)','\\(0\\)','\\(2\\)','\\(+\\infty\\)'],0,'C’est le taux d’accroissement de \\(e^x\\) au point \\(0\\), donc \\(e^0=1\\).'],
      ['La dérivée de \\(f(x)=\\ln(x^2+1)\\) est :',['\\(1/(x^2+1)\\)','\\(2x\\)','\\(\\ln(2x)\\)','\\(\\frac{2x}{x^2+1}\\)'],3,'La dérivée de \\(\\ln u\\) est \\(u\\prime/u\\) pour \\(u>0\\).'],
      ['Le minimum de \\(f(x)=x^2-4x+5\\) sur \\(\\mathbb R\\) vaut :',['\\(0\\)','\\(1\\)','\\(2\\)','\\(5\\)'],1,'On écrit \\(f(x)=(x-2)^2+1\\) ; le minimum vaut \\(1\\).'],
      ['Combien vaut \\(\\displaystyle\\int_0^2 3t^2\\,dt\\) ?',['\\(6\\)','\\(4\\)','\\(8\\)','\\(12\\)'],2,'Une primitive est \\(t^3\\) : \\([t^3]_0^2=8\\).'],
      ['Pour rendre continue en \\(x=1\\) la fonction \\(f(x)=\\frac{x^2-1}{x-1}\\) définie pour \\(x\\ne1\\), quelle valeur lui donner en \\(1\\) ?',['\\(2\\)','\\(0\\)','\\(1\\)','\\(-2\\)'],0,'Pour \\(x\\ne1\\), \\(f(x)=x+1\\), donc la limite en \\(1\\) vaut \\(2\\).'],
      ['Quelle est la dérivée en \\(0\\) de \\(f(x)=\\sqrt{1+x}\\) ?',['\\(1\\)','\\(2\\)','\\(0\\)','\\(\\frac12\\)'],3,'\\(f\\prime(x)=1/(2\\sqrt{1+x})\\), d’où \\(f\\prime(0)=1/2\\).'],
      ['Quel est le développement limité de \\(e^x\\) à l’ordre \\(2\\) en \\(0\\) ?',['\\(1+x^2\\)','\\(1+x+\\frac{x^2}{2}+o(x^2)\\)','\\(x+\\frac{x^2}{2}\\)','\\(1+x-x^2\\)'],1,'La formule de Maclaurin donne \\(e^x=1+x+x^2/2+o(x^2)\\).'],
      ['Si l’intensité de pluie est \\(i(t)=2t\\), quelle est la hauteur cumulée \\(P(t)=\\int_0^t i(s)\\,ds\\) ?',['\\(2t\\)','\\(t\\)','\\(t^2\\)','\\(2t^2\\)'],2,'\\(P(t)=\\int_0^t 2s\\,ds=[s^2]_0^t=t^2\\).']
    ],
    difficile:[
      ['Quelle est la limite \\(\\displaystyle\\lim_{x\\to0}\\frac{\\ln(1+x)-x}{x^2}\\) ?',['\\(0\\)','\\(-\\frac12\\)','\\(\\frac12\\)','\\(-1\\)'],1,'\\(\\ln(1+x)=x-x^2/2+o(x^2)\\) près de \\(0\\).'],
      ['Pour \\(x>0\\), la dérivée de \\(f(x)=x^x\\) est :',['\\(x^x\\)','\\(x^{x-1}\\)','\\(x^x(1+\\ln x)\\)','\\(x\\ln x\\)'],2,'Écrire \\(x^x=e^{x\\ln x}\\) puis dériver par composition.'],
      ['Combien vaut \\(\\displaystyle\\int_0^1 x\\ln x\\,dx\\) (intégrale impropre) ?',['\\(-\\frac14\\)','\\(0\\)','\\(\\frac14\\)','\\(-1\\)'],0,'Par parties, \\(\\int x\\ln x\\,dx=\\frac{x^2}{2}\\ln x-\\frac{x^2}{4}\\).'],
      ['Le maximum de \\(f(x)=xe^{-x}\\) sur \\([0,+\\infty[\\) vaut :',['\\(1\\)','\\(0\\)','\\(e\\)','\\(1/e\\)'],3,'\\(f\\prime(x)=e^{-x}(1-x)\\) : le maximum est atteint en \\(x=1\\).'],
      ['Quelle est la limite \\(\\displaystyle\\lim_{x\\to0}\\frac{1-\\cos x}{x^2}\\) ?',['\\(0\\)','\\(\\frac12\\)','\\(1\\)','\\(+\\infty\\)'],1,'Le développement \\(\\cos x=1-x^2/2+o(x^2)\\) donne \\(1/2\\).'],
      ['Quelle est la dérivée de \\(f(x)=\\ln\\sqrt{1+x^2}\\) ?',['\\(\\frac1{1+x^2}\\)','\\(\\frac{2x}{1+x^2}\\)','\\(\\frac{x}{1+x^2}\\)','\\(\\frac{x}{\\sqrt{1+x^2}}\\)'],2,'\\(\\ln\\sqrt{1+x^2}=\\frac12\\ln(1+x^2)\\).'],
      ['Combien vaut \\(\\displaystyle\\int_1^e\\frac{\\ln x}{x}\\,dx\\) ?',['\\(\\frac12\\)','\\(1\\)','\\(e-1\\)','\\(0\\)'],0,'Une primitive est \\(\\frac12(\\ln x)^2\\) ; évaluer entre \\(1\\) et \\(e\\).'],
      ['Quelle est l’équation de la tangente en \\(x=0\\) à \\(f(x)=\\ln(1+x)\\) ?',['\\(y=1+x\\)','\\(y=0\\)','\\(y=-x\\)','\\(y=x\\)'],3,'On a \\(f(0)=0\\) et \\(f\\prime(0)=1\\), donc la tangente est \\(y=x\\).'],
      ['Quelle est la limite \\(\\displaystyle\\lim_{x\\to+\\infty}x^2e^{-x}\\) ?',['\\(+\\infty\\)','\\(0\\)','\\(1\\)','\\(2\\)'],1,'La croissance exponentielle domine toute puissance de \\(x\\) à l’infini.'],
      ['Si \\(Q(t)=2+\\sin t\\), quel volume total s’écoule entre \\(t=0\\) et \\(t=\\pi\\) ?',['\\(2\\pi\\)','\\(\\pi+2\\)','\\(2\\pi+2\\)','\\(2\\pi-2\\)'],2,'\\(\\int_0^\\pi(2+\\sin t)dt=2\\pi+[-\\cos t]_0^\\pi=2\\pi+2\\).']
    ]
  };
  for(const [level,rows] of Object.entries(data))rows.forEach(([q,a,correct,why],i)=>{
    window.HYDRO_DEMO_QUESTIONS.push({id:'C1'+level[0].toUpperCase()+String(i+1).padStart(2,'0'),chapter,level,q,a,correct,why});
  });
})();
