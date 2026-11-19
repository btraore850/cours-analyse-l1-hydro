/* Prefer different problem families; never repeat an identical prompt or ID.
 * When a student asks for 10 or 15 QCM, progressively use additional variants
 * only after sampling the available families.
 */
(function(root){
  'use strict';
  function shuffled(input,random=Math.random){
    const items=input.slice();
    for(let i=items.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}
    return items;
  }
  function family(item){
    const normalized=String(item.q||'').toLowerCase().normalize('NFC')
      .replace(/[0-9]+(?:[.,][0-9]+)?/g,'#')
      .replace(/\s+/g,' ').trim();
    return String(item.chapter)+'|'+String(item.level)+'|'+normalized;
  }
  function select(pool,count,random=Math.random){
    const groups=new Map();
    const seenIds=new Set(),seenTexts=new Set();
    for(const q of shuffled(pool,random)){
      const id=String(q.id),text=String(q.q||'').trim().toLowerCase();
      if(seenIds.has(id)||seenTexts.has(text))continue;
      seenIds.add(id);seenTexts.add(text);
      const key=family(q);
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(q);
    }
    if(seenTexts.size<count)throw new Error('Banque insuffisante : '+seenTexts.size+' énoncés distincts disponibles.');
    const ordered=shuffled([...groups.values()].map(g=>shuffled(g,random)),random),selected=[];
    for(let round=0;selected.length<count;round++){
      let added=0;
      for(const group of ordered){
        if(group.length>round){selected.push(group[round]);added++;}
        if(selected.length===count)break;
      }
      if(!added)throw new Error('Tirage incomplet.');
    }
    return shuffled(selected,random);
  }
  root.L1_DIVERSE=Object.freeze({select,family});
})(typeof window==='undefined'?globalThis:window);
