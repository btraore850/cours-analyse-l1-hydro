/* Affichage progressif des ressources de l'accueil simplifie */
(()=>{'use strict';
const doc=document, root=doc.getElementById('chapter-list'), recent=doc.getElementById('recent-list');
if(!root)return;
const cfg=doc.body.dataset;
const api='https://api.github.com/repos/btraore850/'+cfg.repo+'/contents/';
const chapters=JSON.parse(doc.getElementById('course-chapters').textContent);
const mk=(tag,cl,tx)=>{const n=doc.createElement(tag);if(cl)n.className=cl;if(tx!==undefined)n.textContent=tx;return n;};
const sets=[
{folder:cfg.cours, label:'Cours',icon:'📖'},
{folder:cfg.presentations,label:'Diaporama',icon:'🖥️'},
{folder:cfg.td,label:'TD',icon:'✍️'},
{folder:cfg.corriges,label:'Corrigé',icon:'✅'},
{folder:cfg.tp,label:'TP',icon:'💻'},
{folder:cfg.application,label:'Application',icon:'🧪'}
];
const validFile=(x)=>x&&x.type==='file'&&/\.(pdf|docx|pptx|xlsx|zip|r|py|tex|ipynb)$/i.test(x.name)&&x.name!=='index.html';
const fileURL=(x,folder)=>cfg.base+'/'+folder+'/'+encodeURIComponent(x.name);
const chapterPattern=(i)=>(new RegExp('(?:chapitre|chap|ch)[-_ .]*0*'+i+'(?![0-9])|(?:^|[^0-9])0*'+i+'(?=[-_ .])','i'));
const addLink=(parent,url,label)=>{const a=mk('a','',label);a.href=url;parent.append(a);return a;};
const panels=chapters.map((titre,i)=>{
const id=i+1,detail=mk('details','chapter'),summary=mk('summary',''),num=mk('span','chapter-number',String(id)),title=mk('span','chapter-text',titre);
summary.append(num,title);detail.append(summary);
const area=mk('div','chapter-detail'),note=mk('p','', 'Ressources du chapitre '+id),links=mk('div','chapter-links'),list=mk('div','chapter-files');
for(const set of sets)addLink(links,set.folder+'/',set.icon+' '+set.label);
addLink(links,cfg.application+'/#audios-applications','🎧 Audios');
area.append(note,links,list);detail.append(area);root.append(detail);
return {number:id,list};
});
const format=(date)=>{try{const dt=new Date(date);return Number.isNaN(dt.valueOf())?'':dt.toLocaleDateString('fr-FR');}catch{return ''}};
const timeoutFetch=(url)=>fetch(url,{headers:{Accept:'application/vnd.github+json'},cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();});
const jobs=sets.map(s=>timeoutFetch(api+encodeURIComponent(s.folder)+'?ref=main').then(items=>({folder:s.folder,items:Array.isArray(items)?items.filter(validFile):[]})).catch(()=>({folder:s.folder,items:[]})));
jobs.push(timeoutFetch(api+encodeURIComponent(cfg.videosFolder)+'/videos.json?ref=main').then(async entry=>{
if(!entry||typeof entry.content!=='string')return {video:[]};
const raw=entry.content.replace(/\s/g,'');try{return {video:JSON.parse(decodeURIComponent(escape(atob(raw)))).videos||[]};}catch{return {video:[]}};
}).catch(()=>({video:[]})));
jobs.push(fetch(cfg.application+'/audios.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Audio');return r.json();}).then(d=>({audio:Array.isArray(d.audios)?d.audios:[]})).catch(()=>({audio:[]})));
Promise.all(jobs).then(data=>{
const resources=data.filter(x=>x.folder),known=[];
for(const group of resources){
 for(const file of group.items){known.push({file,folder:group.folder});for(const panel of panels){if(chapterPattern(panel.number).test(file.name)){const line=mk('div','');addLink(line,fileURL(file,group.folder),'📄 '+file.name);panel.list.append(line);}}}
}
const videoSet=data.find(x=>x.video)?.video||[];
for(const v of videoSet){
 const n=Number(v.chapitre);if(!Number.isInteger(n)||n<1||n>panels.length||!/^https:\/\//.test(v.url||''))continue;
 const line=mk('div','');const link=addLink(line,v.url,'▶ '+(v.titre||'Vidéo du chapitre '+n));link.target='_blank';link.rel='noopener noreferrer';panels[n-1].list.append(line);
}
for(const v of (data.find(x=>x.audio)?.audio||[])){
 const n=Number(v.chapitre);if(!Number.isInteger(n)||n<1||n>panels.length||!/^https:\/\//.test(v.url||''))continue;
 const line=mk('div','');const link=addLink(line,v.url,'🎧 '+(v.titre||'Audio du chapitre '+n));link.target='_blank';link.rel='noopener noreferrer';panels[n-1].list.append(line);
}
const safeRecent=known.filter(x=>x.file.name.toLowerCase().endsWith('.pdf')).slice(0,3);
recent.replaceChildren();
if(!safeRecent.length){recent.append(mk('p','small-status','Consultez les rubriques Cours et TD pour accéder aux documents disponibles.'));return;}
for(const {file,folder} of safeRecent){
 const line=mk('div','resource-row'),icon=mk('span','icon','📕'),label=mk('span','file-label',file.name),a=mk('a','','Ouvrir');
 a.href=fileURL(file,folder);line.append(icon,label,a);recent.append(line);
}
}).catch(()=>{recent.textContent='Les ressources restent accessibles depuis les boutons principaux.';});
})();
