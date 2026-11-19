/* Mathematical typography for the Analyse L1 Chimie question bank.
 * This module is intentionally display-only: source questions, options and
 * answer keys stay unchanged, and no untrusted text is injected as HTML.
 */
(function (root) {
  'use strict';
  const sub = { '₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','ₙ':'n','ₓ':'x','₊':'+','₋':'-' };
  const sup = { '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','ⁿ':'n','⁻':'-','⁺':'+' };
  function isMath(word) {
    const w = word.replace(/^[«“]+|[,.?:!;»”]+$/g,'');
    if (!w) return false;
    if (/^[+\-−×*/=<>≤≥≠±⇒≈]+$/.test(w)) return true;
    if (/^[0-9]+(?:[,.][0-9]+)?$/.test(w)) return 'number';
    return /[₀-₉₊ₙₓ⁰-⁹¹²³ⁿ⁻⁺′″∫∂√Σ∞ℝℂℤπ∩∪∈∉⊂⊆∀∃≥≤≠⇒↦≈±×|{}]|[a-zA-Z]\^|(?:[fghQyP]\([^)]*\))|(?:diag|det)\(|\b(?:x|n|dx|dv|sin|cos|ln|exp)\b|\b(?:lim|DL)[₀-₉ₓ]|[0-9]+\/[0-9]+|[0-9]+[xyti]|[\[\]][^\s]*;|^[A-Za-z]{1,3}=[A-Za-z]{1,3}$|^\(-?[0-9]+,-?[0-9]+\)$/.test(w) || /^[([]?[0-9]*[xynt][0-9+−=()/xynt\-]*[)\]]?$/.test(w);
  }
  function tex(source) {
    let s=String(source).trim();
    // Protect large structural expressions before converting individual glyphs.
    s=s.replace(/\{([^{}]*)\}/g,'\\lbrace $1\\rbrace')
      .replace(/√\(([^()]+)\)\/\(([^()]+)\)/g,'\\frac{\\sqrt{$1}}{$2}')
      .replace(/(?:ln|sin|cos)\([^()]+\)\/[xnt]/g,m=>{const match=m.match(/^(ln|sin|cos)\(([^()]+)\)\/([xnt])$/);return '\\frac{\\'+match[1]+'('+match[2]+')}{'+match[3]+'}';})
      .replace(/∂²f\/∂x∂y/g,'\\frac{\\partial^{2}f}{\\partial x\\,\\partial y}')
      .replace(/∂f\/∂([xy])/g,'\\frac{\\partial f}{\\partial $1}')
      .replace(/dQ\/dt/g,'\\frac{dQ}{dt}')
      .replace(/limₓ→([∞0-9]+)/g,'\\lim_{x\\to $1}')
      .replace(/Σₙ≥([0-9]+)/g,'\\sum_{n\\ge $1}').replace(/Σ/g,'\\sum ')
      .replace(/∫([₀-₉]+)\^([0-9∞]+)/g,(_,a,b)=>'\\int_{'+Array.from(a).map(x=>sub[x]||x).join('')+'}^{'+b+'}')
      .replace(/∫([₀-₉]+)([⁰-⁹¹²³]+)/g,(_,a,b)=>'\\int_{'+Array.from(a).map(x=>sub[x]||x).join('')+'}^{'+Array.from(b).map(x=>sup[x]||x).join('')+'}')
      .replace(/∫([₀-₉]+)(?=\s|$)/g,(_,a)=>'\\int_{'+Array.from(a).map(x=>sub[x]||x).join('')+'}')
      .replace(/∫/g,'\\int ');
    s=s.replace(/([a-zA-Z])([₀-₉₊ₙₓ]+)/g,(_,letter,index)=>letter+'_{'+Array.from(index).map(x=>sub[x]||x).join('')+'}')
      .replace(/([⁰-⁹¹²³ⁿ⁻⁺]+)/g,(_,power)=>'^{'+Array.from(power).map(x=>sup[x]||x).join('')+'}')
      .replace(/\^\(([^()]+)\)/g,'^{$1}')
      .replace(/DL_\{([0-9]+)\}/g,'\\mathrm{DL}_{$1}');
    // Parenthesized ratios, simple numerical fractions and algebraic quotients.
    s=s.replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g,'\\frac{$1}{$2}')
      .replace(/\(([^()]+)\)\s*\/\s*([a-zA-Z])/g,'\\frac{$1}{$2}')
      .replace(/\b([0-9]+)\s*\/\s*([0-9]+|x(?:\^\{[0-9]+\})?|n!)/g,'\\frac{$1}{$2}')
      .replace(/\b([0-9]*[a-zA-Z](?:\^\{[0-9]+\})?)\s*\/\s*([0-9]+|x)/g,'\\frac{$1}{$2}');
    s=s.replace(/√\(([^()]+)\)/g,'\\sqrt{$1}').replace(/√([a-zA-Z0-9]+)/g,'\\sqrt{$1}');
    s=s.replace(/([\]\[])([−+0-9∞]+)\s*;\s*([−+0-9∞]+)([\]\[])/g,(_,open,a,b,close)=>'\\mathopen{'+open+'}'+a+';'+b+'\\mathclose{'+close+'}')
      .replace(/(?<!\\)\b(ln|sin|cos|exp)\b/g,'\\$1')
      .replace(/ℝ/g,'\\mathbb{R}').replace(/ℂ/g,'\\mathbb{C}').replace(/ℤ/g,'\\mathbb{Z}').replace(/π/g,'\\pi').replace(/ω/g,'\\omega')
      .replace(/∩/g,'\\cap ').replace(/∪/g,'\\cup ').replace(/∈/g,'\\in ').replace(/∉/g,'\\notin ')
      .replace(/⊂/g,'\\subset ').replace(/⊆/g,'\\subseteq ').replace(/∀/g,'\\forall ').replace(/∃/g,'\\exists ')
      .replace(/\b(diag|det)\b/g,'\\operatorname{$1}').replace(/∞/g,'\\infty').replace(/→/g,'\\to')
      .replace(/↦/g,'\\mapsto').replace(/⇒/g,'\\Rightarrow')
      .replace(/≥/g,'\\ge ').replace(/≤/g,'\\le ').replace(/≠/g,'\\ne ')
      .replace(/≈/g,'\\approx ').replace(/±/g,'\\pm ').replace(/×/g,'\\times ')
      .replace(/…/g,'\\ldots ').replace(/−/g,'-').replace(/′/g,"'").replace(/″/g,"''")
      .replace(/\bdx\b/g,'\\,\\mathrm{d}x').replace(/\bdv\b/g,'\\,\\mathrm{d}v');
    return s;
  }
  function format(source) {
    const original=String(source==null?'':source)
      .replace(/\{([^{}]*)\}/g,(_,inside)=>'{'+inside.replace(/\s*:\s*/g,':')+'}')
      .replace(/([\[\]])([−+0-9∞]+)\s*;\s*([−+0-9∞]+)([\[\]])/g,'$1$2;$3$4');
    if (/\\\(|\\\[/.test(original)) return original; // Already delimited for MathJax.
    const words=original.match(/\s+|[^\s]+/g)||[];
    let result='', math='';
    function flush(){if(math){const whitespace=(math.match(/\s+$/)||[''])[0];const expression=math.trim();if(expression)result+='\\('+tex(expression)+'\\)';result+=whitespace;math='';}}
    for(let i=0;i<words.length;i++){
      const raw=words[i];
      if(/^\s+$/.test(raw)){
        if(math)math+=raw;else result+=raw;
        continue;
      }
      const end=(raw.match(/[.,:?!]+$/)||[''])[0];
      const body=end?raw.slice(0,-end.length):raw;
      const classification=isMath(body);
      const hasNearby=classification==='number' && (Boolean(math.trim()) || words.slice(i+1).find(w=>!/^\s+$/.test(w)) && isMath(words.slice(i+1).find(w=>!/^\s+$/.test(w)))===true);
      if(classification===true||hasNearby){math+=body;}else{flush();result+=body;}
      if(end){flush();result+=end;}
    }
    flush();
    // Strip whitespace between plain text and the following math delimiters.
    return result.replace(/ +\\\(/g,' \\(');
  }
  root.CHEM_MATH=Object.freeze({format,tex});
})(typeof window==='undefined'?globalThis:window);
