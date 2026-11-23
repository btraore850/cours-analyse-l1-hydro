/* Catalogue progressif des videos d'application — lecture seule, sans dependance */
(()=>{'use strict';
const root=document.getElementById('chapitres-videos');if(!root)return;
const make=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
const safeLink=(url)=>{try{const u=new URL(url);return u.protocol==='https:'?u.href:null;}catch{return null;}};
fetch('videos.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Catalogue indisponible');return r.json();}).then(data=>{
if(!Array.isArray(data.chapitres)||!Array.isArray(data.videos))throw Error('Catalogue invalide');
root.replaceChildren();
const videos=data.videos.filter(v=>v&&typeof v==='object');
const chapterList=make('div','video-chapters');
for(const chapter of data.chapitres){
const group=videos.filter(v=>Number(v.chapitre)===chapter.numero&&v.chapitre!==null);
const details=make('details','video-chapter');
const summary=make('summary','video-summary');
summary.append(make('strong','', 'Chapitre '+chapter.numero+' — '+chapter.titre),make('span','video-count',group.length?group.length+' vidéo'+(group.length>1?'s':''):'À venir'));
details.append(summary);
const content=make('div','video-content');
if(!group.length)content.append(make('p','video-empty','Les vidéos d’application de ce chapitre seront ajoutées progressivement.'));
for(const v of group){
const article=make('article','video-entry');
const info=[v.section?'Section : '+v.section:null,v.plateforme||null].filter(Boolean).join(' · ');
article.append(make('h3','',v.titre||'Vidéo pédagogique'));
if(info)article.append(make('p','video-small',info));
const url=safeLink(v.url);
if(url){const a=make('a','video-button','▶ Visionner la vidéo');a.href=url;a.target='_blank';a.rel='noopener noreferrer';article.append(a);}
else article.append(make('p','video-empty','Lien de visionnage indisponible.'));
content.append(article);
}
details.append(content);chapterList.append(details);
}
root.append(chapterList);
const pending=videos.filter(v=>v.chapitre===null||v.chapitre===undefined||!data.chapitres.some(c=>c.numero===Number(v.chapitre)));
if(pending.length){
const aside=make('section','video-pending');aside.append(make('h3','','Vidéos à classer'));
aside.append(make('p','video-small','Ces vidéos restent accessibles en attendant la validation de leur chapitre.'));
for(const v of pending){const item=make('div','video-entry');item.append(make('strong','',v.titre||'Vidéo pédagogique'));if(v.section)item.append(make('p','video-small',v.section));const url=safeLink(v.url);if(url){const a=make('a','video-button','▶ Visionner sur '+(v.plateforme||'la plateforme'));a.href=url;a.target='_blank';a.rel='noopener noreferrer';item.append(a);}aside.append(item);}
root.append(aside);
}
const count=make('p','video-small',videos.length+' vidéo'+(videos.length>1?'s':'')+' référencée'+(videos.length>1?'s':'')+' · catalogue actualisé lors de la prochaine ouverture de la page.');
root.append(count);
}).catch(()=>{root.replaceChildren(make('p','video-empty','Le catalogue est momentanément inaccessible. Veuillez réessayer plus tard.'));});
})();
