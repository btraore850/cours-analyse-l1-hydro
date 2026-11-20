/**
 * Analyse L1 Hydrologie — moteur d'évaluation privé (Google Apps Script V8).
 * Le dépôt GitHub peut être public : ne jamais placer d'identifiants, de clés
 * privées, de listes d'étudiants ni de questions d'examen dans ce fichier.
 *
 * Propriétés du script à configurer :
 *   SPREADSHEET_ID, TEACHER_EMAIL, GOOGLE_CLIENT_ID.
 */
const TABLES = Object.freeze({
  ETUDIANTS: ['matricule','email','nom','prenom','groupe','actif','google_sub'],
  QUESTIONS: ['id','chapitre','niveau','usage','enonce','a','b','c','d','bonne','explication','actif'],
  EVALUATIONS: ['id','titre','chapitres','niveau','nb_questions','duree_minutes','ouverture_iso','fermeture_iso','actif','tentatives_max','groupe'],
  TENTATIVES: ['id','email','evaluation_id','mode','debut_iso','expiration_iso','fin_iso','statut','note_sur_10','nb_bonnes','nb_questions','questions_json','reponses_json','dernier_enregistrement_iso'],
  AUTO_TENTATIVES: ['id','email','debut_iso','fin_iso','chapitre','niveau','nb_questions','nb_bonnes','note_sur_10','statut','questions_json']
});
const TIME_PER_QUESTION = {facile:30,moyen:90,difficile:150};

/**
 * Le formulaire OAuth vit sur GitHub Pages (origine autorisée dans Google Cloud).
 * Cette page est uniquement le relais privé des appels google.script.run.
 * Le nonce lie le cadre Apps Script à l'onglet GitHub qui l'a ouvert.
 */
function doGet(e) {
  const nonce=String(e&&e.parameter&&e.parameter.bridge||'');
  if(!/^[a-f0-9]{64}$/.test(nonce)) {
    return HtmlService.createHtmlOutput(
      '<p>Ouvrez les évaluations officielles depuis la plateforme pédagogique GitHub Pages.</p>'
    ).setTitle('Évaluations — accès via la plateforme');
  }
  if(String(e&&e.parameter&&e.parameter.mode||'')==='practice'){
    const bridge=HtmlService.createTemplateFromFile('PracticeBridge');
    bridge.bridgeNonce=nonce;
    return bridge.evaluate().setTitle('Suivi privé des révisions')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  const page=HtmlService.createTemplateFromFile('Index');
  page.bridgeNonce=nonce;
  // Le cadre ne rend aucun résultat avant validation d'un ID Token Google côté serveur.
  // Son JavaScript n'accepte les messages que de l'origine GitHub autorisée.
  return page.evaluate()
    .setTitle('Évaluations — Analyse L1 Hydrologie')
    .addMetaTag('viewport','width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function include_(name) {return HtmlService.createHtmlOutputFromFile(name).getContent();}
function prop_(name) {const value=PropertiesService.getScriptProperties().getProperty(name);if(!value)throw new Error('Configuration manquante : '+name);return value;}
function db_() {return SpreadsheetApp.openById(prop_('SPREADSHEET_ID'));}
function tab_(name) {const tab=db_().getSheetByName(name);if(!tab)throw new Error('Feuille manquante : '+name);return tab;}
function records_(name) {const values=tab_(name).getDataRange().getValues();if(values.length<2)return [];const header=values[0].map(String);return values.slice(1).map((row,i)=>{const item={_row:i+2};header.forEach((h,j)=>item[h]=row[j]);return item;}).filter(x=>String(x[header[0]]||'').trim());}
function find_(name,id,key) {return records_(name).find(x=>String(x[key])===String(id));}
function patch_(name,row,fields) {const header=TABLES[name];const tab=tab_(name);Object.keys(fields).forEach(key=>{const idx=header.indexOf(key);if(idx<0)throw new Error('Colonne inconnue : '+key);tab.getRange(row,idx+1).setValue(fields[key]);});}
function append_(name,values) {
  const tab=tab_(name),headers=name==='EVALUATIONS'
    ?tab.getRange(1,1,1,tab.getLastColumn()).getValues()[0].map(String).filter(Boolean):TABLES[name];
  tab.appendRow(headers.map(key=>values[key]===undefined?'':values[key]));
}
function lock_(task) {const lock=LockService.getScriptLock();lock.waitLock(20000);try{return task();}finally{lock.releaseLock();}}
function text_(value,max) {return String(value||'').trim().slice(0,max||500);}
function yes_(value) {return value===true||value===1||String(value).trim().toLowerCase()==='oui'||String(value).trim().toLowerCase()==='true';}
function iso_() {return new Date().toISOString();}
function shuffle_(data) {const items=data.slice();for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=items[i];items[i]=items[j];items[j]=t;}return items;}
function googleSubShort_(sub) {
  const digest=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(sub),Utilities.Charset.UTF_8);
  return 'G-'+Utilities.base64EncodeWebSafe(digest).replace(/=+$/,'').slice(0,12);
}
function newAttemptId_() {
  for(let i=0;i<8;i++){
    const id='T-'+Utilities.getUuid().replace(/-/g,'').slice(0,16).toUpperCase();
    if(!find_('TENTATIVES',id,'id'))return id;
  }
  throw new Error('Création de la référence de tentative impossible.');
}

/** Valide un ID Token Google ; tokeninfo sert ici à l'amorçage gratuit.
 * Pour un déploiement à forte charge, utiliser un validateur JWT avec clés Google.
 */
function googleIdentity_(idToken) {
  if(typeof idToken!=='string'||idToken.length<100||idToken.length>6000)throw new Error('Jeton de connexion invalide.');
  const url='https://oauth2.googleapis.com/tokeninfo?id_token='+encodeURIComponent(idToken);
  const response=UrlFetchApp.fetch(url,{muteHttpExceptions:true});
  if(response.getResponseCode()!==200)throw new Error('Connexion Google non vérifiée.');
  const payload=JSON.parse(response.getContentText());
  if(payload.aud!==prop_('GOOGLE_CLIENT_ID')||!['accounts.google.com','https://accounts.google.com'].includes(payload.iss)||Number(payload.exp)*1000<Date.now()||String(payload.email_verified)!=='true')throw new Error('Identité Google non valide.');
  const email=String(payload.email||'').trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Adresse e-mail Google invalide.');
  return {email,sub:String(payload.sub||'')};
}
function signIn(idToken) {
  const identity=googleIdentity_(idToken),email=identity.email,admin=email===prop_('TEACHER_EMAIL').toLowerCase();
  const student=records_('ETUDIANTS').find(s=>String(s.email).toLowerCase()===email&&yes_(s.actif));
  if(!admin&&!student)throw new Error('Votre adresse Gmail ne figure pas dans la liste des étudiants inscrits.');
  if(student){
    const shortSub=googleSubShort_(identity.sub),stored=String(student.google_sub||'');
    if(stored&&stored!==identity.sub&&stored!==shortSub)throw new Error('Ce compte Gmail ne correspond pas au compte initialement inscrit.');
    if(stored!==shortSub)lock_(()=>{const row=records_('ETUDIANTS').find(x=>String(x.email).toLowerCase()===email);if(row&&String(row.google_sub||'')===stored){tab_('ETUDIANTS').getRange(row._row,7).setNumberFormat('@');patch_('ETUDIANTS',row._row,{google_sub:shortSub});}});
  }
  const session=Utilities.getUuid();const profile={email,role:admin?'teacher':'student',name:admin?'M. Bakary TRAORE':(student.prenom+' '+student.nom).trim(),groupe:admin?'':String(student.groupe||'')};
  CacheService.getScriptCache().put('session:'+session,JSON.stringify(profile),21600);
  return {session,profile};
}
function user_(session,teacher) {const raw=CacheService.getScriptCache().get('session:'+text_(session,80));if(!raw)throw new Error('Session expirée. Connectez-vous à nouveau.');const user=JSON.parse(raw);if(teacher&&user.role!=='teacher')throw new Error('Accès réservé à l’enseignant.');return user;}
function examGroupAllowed_(exam,user) {return !String(exam.groupe||'').trim()||String(exam.groupe).trim().toLowerCase()===String(user.groupe||'').trim().toLowerCase();}
function examState_(exam,now) {
  if(!yes_(exam.actif))return 'brouillon';
  const start=String(exam.ouverture_iso||'').trim(),end=String(exam.fermeture_iso||'').trim();
  const from=start?Date.parse(start):-Infinity,to=end?Date.parse(end):Infinity;
  if(Number.isNaN(from)||Number.isNaN(to)||to<=from)return 'indisponible';
  const time=now===undefined?Date.now():now;
  return time<from?'a_venir':time>=to?'terminee':'ouverte';
}
function visible_(exam,user) {return examGroupAllowed_(exam,user)&&examState_(exam)==='ouverte';}
/** Une remise réseau manquée ne doit pas laisser une épreuve expirée sans note. */
function finalizeExpiredExams_() {
  return lock_(()=>{
    const now=Date.now();
    const pending=records_('TENTATIVES').filter(a=>String(a.mode)==='exam'&&String(a.statut)==='EN_COURS'&&Number.isFinite(Date.parse(a.expiration_iso))&&Date.parse(a.expiration_iso)<=now);
    if(!pending.length)return 0;
    const bank=new Map(records_('QUESTIONS').map(q=>[String(q.id),q]));
    let finished=0;
    pending.forEach(a=>{
      try{
        const questions=JSON.parse(String(a.questions_json||'[]'));
        const answers=JSON.parse(String(a.reponses_json||'{}'));
        if(!Array.isArray(questions)||!questions.length||!answers||typeof answers!=='object'||Array.isArray(answers))return;
        if(questions.some(q=>!q||!bank.has(String(q.id))))return;
        const correct=questions.filter(item=>String(answers[item.id]||'').toUpperCase()===String(bank.get(String(item.id)).bonne).toUpperCase()).length;
        const note=Math.round(100*(10*correct/questions.length))/100;
        // Colonnes G:J : fin, statut, note /10 et nombre de réponses correctes.
        tab_('TENTATIVES').getRange(a._row,7,1,4).setValues([[String(a.expiration_iso),'TERMINE_TEMPS',note,correct]]);
        finished++;
      }catch(e){console.warn('Tentative expirée non régularisée, ligne '+a._row+': '+e.message);}
    });
    return finished;
  });
}
function revisionDashboard_() {
  const enrolled=records_('ETUDIANTS').filter(s=>yes_(s.actif)&&String(s.email||'').trim());
  const attempts=records_('AUTO_TENTATIVES');
  const people=new Map(),now=Date.now(),week=now-7*86400000,month=now-30*86400000;
  enrolled.forEach(s=>{
    const email=String(s.email).trim().toLowerCase();
    people.set(email,{email,nom:[s.prenom,s.nom].filter(Boolean).join(' '),matricule:String(s.matricule||''),inscrit:true,commencees:0,terminees:0,septJours:0,trenteJours:0,derniere:'',totalNotes:0});
  });
  attempts.forEach(a=>{
    const email=String(a.email||'').trim().toLowerCase();if(!email)return;
    if(!people.has(email))people.set(email,{email,nom:'',matricule:'',inscrit:false,commencees:0,terminees:0,septJours:0,trenteJours:0,derniere:'',totalNotes:0});
    const p=people.get(email),debut=String(a.debut_iso||'');p.commencees++;
    if(debut>p.derniere)p.derniere=debut;
    const time=Date.parse(debut);if(Number.isFinite(time)&&time>=week)p.septJours++;
    if(Number.isFinite(time)&&time>=month)p.trenteJours++;
    if(String(a.statut)==='TERMINE'){p.terminees++;p.totalNotes+=Number(a.note_sur_10)||0;}
  });
  const rows=[...people.values()].map(({totalNotes,...p})=>({...p,moyenne:p.terminees?Math.round(10*totalNotes/p.terminees)/10:null}))
    .sort((a,b)=>Number(b.inscrit)-Number(a.inscrit)||a.commencees-b.commencees||a.email.localeCompare(b.email));
  return {rows,summary:{inscrits:enrolled.length,sansTentative:rows.filter(p=>p.inscrit&&!p.commencees).length,actifs7j:rows.filter(p=>p.inscrit&&p.septJours>0).length,visiteurs:rows.filter(p=>!p.inscrit).length}};
}
function getDashboard(session) {
  const user=user_(session);finalizeExpiredExams_();const exams=records_('EVALUATIONS');const attempts=records_('TENTATIVES');
  if(user.role==='teacher')return {role:'teacher',name:user.name,exams:exams.map(({_row,...r})=>r),attempts:attempts.map(({questions_json,reponses_json,_row,...r})=>r),revisions:revisionDashboard_(),sheetUrl:'https://docs.google.com/spreadsheets/d/'+prop_('SPREADSHEET_ID')+'/edit'};
  // La programmation publiée est consultable avant l'ouverture, sans jamais
  // exposer les questions, réponses, étudiants, notes ou brouillons.
  const planned=exams.filter(ex=>yes_(ex.actif)&&examGroupAllowed_(ex,user))
    .map(ex=>({id:String(ex.id),titre:String(ex.titre),chapitres:String(ex.chapitres),niveau:String(ex.niveau),nb_questions:Number(ex.nb_questions),duree_minutes:Number(ex.duree_minutes),tentatives_max:Number(ex.tentatives_max),ouverture_iso:String(ex.ouverture_iso||''),fermeture_iso:String(ex.fermeture_iso||''),etat:examState_(ex)}))
    .filter(ex=>ex.etat!=='indisponible')
    .sort((a,b)=>(a.etat==='ouverte'?0:a.etat==='a_venir'?1:2)-(b.etat==='ouverte'?0:b.etat==='a_venir'?1:2)||(Date.parse(a.ouverture_iso)||0)-(Date.parse(b.ouverture_iso)||0));
  return {role:'student',name:user.name,exams:planned,attempts:attempts.filter(x=>String(x.email).toLowerCase()===user.email).map(({questions_json,reponses_json,_row,...r})=>r).reverse().slice(0,40)};
}
function chapters_(value) {
  // Le séparateur « , » est parfois transformé en séparateur décimal par
  // Google Sheets (fr_FR) : une ancienne valeur « 2,3 » devient 2.3.
  return String(value).split(/[,.;|]/).map(x=>x.trim()).filter(x=>/^[1-7]$/.test(x));
}
function bank_(chapters,level,mode) {
  const choices=chapters_(chapters);
  // L'enseignant a choisi de réutiliser la banque publique d'entraînement
  // pour les examens officiels ; les questions ne sont pas confidentielles.
  const usages=mode==='exam'?['EXAMEN','ENTRAINEMENT']:['ENTRAINEMENT'];
  return records_('QUESTIONS').filter(q=>yes_(q.actif)&&choices.includes(String(q.chapitre).trim())&&(level==='tous'||String(q.niveau).toLowerCase()===level)&&usages.includes(String(q.usage).toUpperCase())&&['A','B','C','D'].includes(String(q.bonne).toUpperCase()));
}
/** Deux identifiants QCM peuvent désigner le même énoncé avec des réponses permutées. */
function questionKey_(q) {
  return String(q&&q.enonce||'').normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/\s+/g,' ').trim().toLocaleLowerCase('fr');
}
function uniqueQuestions_(pool) {
  const ids=new Set(),texts=new Set();
  return shuffle_(pool).filter(q=>{
    const id=String(q.id),text=questionKey_(q);
    if(!text||ids.has(id)||texts.has(text))return false;
    ids.add(id);texts.add(text);return true;
  });
}
/** Révisions libres : aucun contrôle de présence dans ETUDIANTS.
 * Le compte Google est toutefois vérifié par le serveur pour suivre chaque adresse.
 */
function verifyPublicPracticeIdentity(idToken) {return {email:googleIdentity_(idToken).email};}
function startPublicPractice(idToken,data) {
  const user=googleIdentity_(idToken),d=data||{},chapter=Number(d.chapter),level=String(d.level||'').toLowerCase(),count=Number(d.count);
  const id=String(d.id||'');
  if(!Number.isInteger(chapter)||chapter<1||chapter>7||!TIME_PER_QUESTION[level]||![5,10,15].includes(count)||!(/^(?:AUTO_[a-f0-9-]{36}|A-[a-f0-9]{16})$/i).test(id))throw new Error('Paramètres de révision invalides.');
  if(!Array.isArray(d.questionIds)||d.questionIds.length!==count)throw new Error('Liste de questions invalide.');
  const pool=bank_(String(chapter),level,'practice'),available=new Set(pool.map(q=>String(q.id)));
  const ids=d.questionIds.map(value=>{
    const original=String(value||'');
    const normalized=chapter===2&&available.has('C2'+original)?'C2'+original:original;
    if(!available.has(normalized))throw new Error('Question absente de la banque du chapitre '+chapter+'.');
    return normalized;
  });
  if(new Set(ids).size!==count)throw new Error('Questions répétées dans la tentative.');
  const byId=new Map(pool.map(q=>[String(q.id),q]));
  if(new Set(ids.map(qid=>questionKey_(byId.get(qid)))).size!==count)throw new Error('Énoncés répétés : recommencez le tirage des QCM.');
  return lock_(()=>{
    const existing=find_('AUTO_TENTATIVES',id,'id');
    if(existing){if(String(existing.email)!==user.email)throw new Error('Identifiant de tentative déjà utilisé.');return {id,email:user.email,alreadyStarted:true};}
    append_('AUTO_TENTATIVES',{id,email:user.email,debut_iso:iso_(),chapitre:chapter,niveau:level,nb_questions:count,statut:'EN_COURS',questions_json:JSON.stringify(ids)});
    return {id,email:user.email};
  });
}
function finishPublicPractice(idToken,id,answers) {
  const user=googleIdentity_(idToken),key=String(id||''),responses=answers&&typeof answers==='object'&&!Array.isArray(answers)?answers:{};
  return lock_(()=>{
    const attempt=find_('AUTO_TENTATIVES',key,'id');
    if(!attempt||String(attempt.email)!==user.email)throw new Error('Tentative de révision non autorisée.');
    if(String(attempt.statut)==='TERMINE')return {id:key,note:Number(attempt.note_sur_10),correct:Number(attempt.nb_bonnes),count:Number(attempt.nb_questions),alreadyFinished:true};
    const ids=JSON.parse(String(attempt.questions_json||'[]')),bank=new Map(records_('QUESTIONS').map(q=>[String(q.id),q]));
    let correct=0;
    ids.forEach(qid=>{
      const q=bank.get(qid);if(!q)throw new Error('Question introuvable : '+qid);
      const choice=String(responses[qid]||(qid.startsWith('C2')?responses[qid.slice(2)]:'')||'').toUpperCase();
      if(choice===String(q.bonne).toUpperCase())correct++;
    });
    const note=Math.round(1000*correct/ids.length)/100;
    patch_('AUTO_TENTATIVES',attempt._row,{fin_iso:iso_(),nb_bonnes:correct,note_sur_10:note,statut:'TERMINE'});
    return {id:key,note,correct,count:ids.length};
  });
}
function selectQuestions_(pool,level,count,mode) {
  if(mode!=='exam'||level!=='tous')return shuffle_(pool).slice(0,count);
  // Pour 10 QCM : 3 faciles, 4 moyens et 3 difficiles, mélangés.
  const third=Math.floor(count/3);
  const target={facile:third+(count%3===2?1:0),moyen:third+(count%3>=1?1:0),difficile:third};
  const chosen=[];
  for(const difficulty of ['facile','moyen','difficile']) {
    const candidates=shuffle_(pool.filter(q=>String(q.niveau).toLowerCase()===difficulty));
    chosen.push(...candidates.slice(0,target[difficulty]));
  }
  // En présence de catégories moins fournies, compléter sans doublon.
  const used=new Set(chosen.map(q=>String(q.id)));
  chosen.push(...shuffle_(pool.filter(q=>!used.has(String(q.id)))).slice(0,count-chosen.length));
  return shuffle_(chosen);
}
function selectDistinctExamQuestions_(pool,level,count,evalId) {
  const previous=new Set(records_('TENTATIVES')
    .filter(t=>String(t.mode)==='exam'&&String(t.evaluation_id)===String(evalId))
    .map(t=>{try{return JSON.parse(String(t.questions_json||'[]')).map(q=>String(q.id)).sort().join('|');}catch(e){return '';}})
    .filter(Boolean));
  let chosen=selectQuestions_(pool,level,count,'exam');
  if(pool.length<=count||!previous.size)return chosen;
  for(let i=0;i<20;i++){
    if(!previous.has(chosen.map(q=>String(q.id)).sort().join('|')))break;
    chosen=selectQuestions_(pool,level,count,'exam');
  }
  return chosen;
}
function publicQuestion_(q,order) {return {id:String(q.id),text:String(q.enonce),choices:order.map(k=>({id:k,text:String(q[k.toLowerCase()])}))};}
function buildAttempt_(user,mode,evalId,chapters,level,count,minutes,maxAttempts,closeAt) {
  if(!Number.isInteger(count)||count<1||count>40||!Number.isFinite(minutes)||minutes<1||minutes>180)throw new Error('Paramètres d’évaluation invalides.');
  return lock_(()=>{
    if(mode==='exam'&&records_('TENTATIVES').filter(t=>t.email===user.email&&t.evaluation_id===evalId).length>=maxAttempts)throw new Error('Nombre de tentatives autorisées atteint.');
    const pool=uniqueQuestions_(bank_(chapters,level,mode));if(pool.length<count)throw new Error('Banque insuffisante : '+pool.length+' question(s) disponibles pour '+count+' demandées.');
    const questions=mode==='exam'?selectDistinctExamQuestions_(pool,level,count,evalId):selectQuestions_(pool,level,count,mode);
    const selected=questions.map(q=>({id:String(q.id),order:shuffle_(['A','B','C','D'])}));
    const now=new Date();const close=closeAt?Date.parse(closeAt):Infinity;
    if(!Number.isFinite(close)&&closeAt)throw new Error('Date de fermeture invalide.');
    const end=new Date(Math.min(now.getTime()+minutes*60000,close));const id=newAttemptId_();
    if(end.getTime()<=now.getTime())throw new Error('Cette évaluation est fermée.');
    append_('TENTATIVES',{id,email:user.email,evaluation_id:evalId,mode,debut_iso:now.toISOString(),expiration_iso:end.toISOString(),statut:'EN_COURS',nb_questions:count,questions_json:JSON.stringify(selected),reponses_json:'{}',dernier_enregistrement_iso:now.toISOString()});
    const byId=new Map(pool.map(q=>[String(q.id),q]));
    return {id,deadline:end.toISOString(),questions:selected.map(entry=>publicQuestion_(byId.get(entry.id),entry.order)),mode};
  });
}
function startPractice(session,chapter,level,count) {
  const user=user_(session);if(user.role==='teacher')throw new Error('Utilisez un compte étudiant pour tester une tentative.');
  const lv=text_(level,20);if(!TIME_PER_QUESTION[lv])throw new Error('Niveau inconnu.');
  const chap=text_(chapter,10);if(!/^[1-7]$/.test(chap))throw new Error('Chapitre inconnu.');
  return buildAttempt_(user,'practice','AUTO_CH'+chap+'_'+lv,chap,lv,Number(count),Math.ceil(Number(count)*TIME_PER_QUESTION[lv]/60),999999);
}
function startExam(session,evalId) {
  const user=user_(session);if(user.role==='teacher')throw new Error('Utilisez un compte étudiant.');
  const exam=find_('EVALUATIONS',text_(evalId,80),'id');if(!exam||!visible_(exam,user))throw new Error('Évaluation fermée ou inaccessible.');
  return buildAttempt_(user,'exam',String(exam.id),String(exam.chapitres),String(exam.niveau),Number(exam.nb_questions),Number(exam.duree_minutes),Number(exam.tentatives_max),exam.fermeture_iso);
}
function cleanAnswers_(attempt,answers) {if(!answers||typeof answers!=='object'||Array.isArray(answers))return {};const selected=JSON.parse(attempt.questions_json);const safe={};selected.forEach(item=>{const x=String(answers[item.id]||'').toUpperCase();if(item.order.includes(x))safe[item.id]=x;});return safe;}
function saveDraft(session,id,answers) {
  const user=user_(session);return lock_(()=>{const attempt=find_('TENTATIVES',text_(id,80),'id');if(!attempt||String(attempt.email)!==user.email)throw new Error('Tentative inaccessible.');if(attempt.statut!=='EN_COURS')return {saved:false,closed:true};if(Date.now()>Date.parse(attempt.expiration_iso))return {saved:false,expired:true};const safe=cleanAnswers_(attempt,answers);patch_('TENTATIVES',attempt._row,{reponses_json:JSON.stringify(safe),dernier_enregistrement_iso:iso_()});return {saved:true};});
}
function submitAttempt(session,id,answers) {
  const user=user_(session);return lock_(()=>{
    const attempt=find_('TENTATIVES',text_(id,80),'id');if(!attempt||String(attempt.email)!==user.email)throw new Error('Tentative inaccessible.');
    if(attempt.statut!=='EN_COURS')return {note:Number(attempt.note_sur_10),correct:Number(attempt.nb_bonnes),count:Number(attempt.nb_questions),answered:Object.keys(JSON.parse(attempt.reponses_json||'{}')).length,alreadySubmitted:true};
    const deadline=Date.parse(attempt.expiration_iso),receivedAt=Date.now(),expired=receivedAt>=deadline;
    const saved=JSON.parse(attempt.reponses_json||'{}'),live=cleanAnswers_(attempt,answers),selected=JSON.parse(attempt.questions_json);
    // 5 secondes maximum pour recevoir la remise lancée à 00:00.
    const provided=expired?(receivedAt-deadline<=5000?{...saved,...live}:saved):live;
    const bank=new Map(records_('QUESTIONS').map(q=>[String(q.id),q]));
    let correct=0;selected.forEach(item=>{const q=bank.get(item.id);if(!q)throw new Error('Question introuvable : '+item.id);if(String(provided[item.id]||'')===String(q.bonne).toUpperCase())correct++;});
    const count=selected.length;const note=Math.round(100*(10*correct/count))/100;const now=iso_();
    patch_('TENTATIVES',attempt._row,{reponses_json:JSON.stringify(provided),statut:expired?'TERMINE_TEMPS':'TERMINE',fin_iso:now,note_sur_10:note,nb_bonnes:correct,dernier_enregistrement_iso:now});
    // Résultat uniquement dans l'espace privé de l'étudiant : aucun e-mail.
    const output={note,correct,count,answered:Object.keys(provided).length,expired,attemptId:id};
    if(attempt.mode==='practice'){output.explanations=selected.map(item=>{const q=bank.get(item.id);return {id:item.id,answer:String(q.bonne),explanation:String(q.explication),good:provided[item.id]===String(q.bonne).toUpperCase()};});}
    return output;
  });
}
function adminCreateExam(session,data) {
  user_(session,true);const d=data||{};const chapters=Array.isArray(d.chapters)?d.chapters.map(String).filter(x=>/^[1-7]$/.test(x)):[];if(!chapters.length)throw new Error('Choisissez au moins un chapitre.');
  const level=text_(d.level,20);if(!['facile','moyen','difficile','tous'].includes(level))throw new Error('Difficulté invalide.');
  const count=Number(d.count),minutes=Number(d.minutes),limit=Number(d.maxAttempts);if(!Number.isInteger(count)||count<1||count>40||!Number.isInteger(minutes)||minutes<1||minutes>180||!Number.isInteger(limit)||limit<1||limit>10)throw new Error('Nombre, durée ou tentatives invalides.');
  const start=text_(d.openAt,60),end=text_(d.closeAt,60);if(start&&!Number.isFinite(Date.parse(start)))throw new Error('Date d’ouverture invalide.');if(end&&!Number.isFinite(Date.parse(end)))throw new Error('Date de fermeture invalide.');if(start&&end&&Date.parse(end)<=Date.parse(start))throw new Error('Fermeture antérieure à l’ouverture.');
  const chapterValue=[...new Set(chapters)].join(';');
  const id='EXAM_'+Utilities.getUuid().slice(0,8).toUpperCase();return lock_(()=>{append_('EVALUATIONS',{id,titre:text_(d.title,100)||'Évaluation Analyse',chapitres:chapterValue,niveau:level,nb_questions:count,duree_minutes:minutes,ouverture_iso:start?new Date(start).toISOString():'',fermeture_iso:end?new Date(end).toISOString():'',actif:false,tentatives_max:limit,groupe:text_(d.group,50)});return {id,enabled:false,availableQuestions:uniqueQuestions_(bank_(chapterValue,level,'exam')).length};});
}
function adminToggleExam(session,id,enabled) {user_(session,true);return lock_(()=>{const ex=find_('EVALUATIONS',text_(id,80),'id');if(!ex)throw new Error('Évaluation introuvable.');if(enabled&&uniqueQuestions_(bank_(ex.chapitres,ex.niveau,'exam')).length<Number(ex.nb_questions))throw new Error('Banque de QCM insuffisante : vérifiez les chapitres, le niveau et le nombre de questions.');if(enabled&&examState_({...ex,actif:true})==='indisponible')throw new Error('Dates de programmation invalides : corrigez le calendrier avant publication.');patch_('EVALUATIONS',ex._row,{actif:Boolean(enabled)});return {id,enabled:Boolean(enabled)};});}
/** Les éventuels anciens déclencheurs doivent rester inoffensifs. */
function processMailQueue_() {return {sent:0,disabled:true};}
function removeMailTriggers_() {
  const names=['processMailQueue_','processAllCourseMail_'];
  ScriptApp.getProjectTriggers().filter(t=>names.includes(t.getHandlerFunction())).forEach(ScriptApp.deleteTrigger);
}
/** À exécuter une fois seulement si le classeur a été créé sans onglets. */
function initializeMissingSheets_() {const db=db_();Object.keys(TABLES).forEach(name=>{let sheet=db.getSheetByName(name);if(!sheet){sheet=db.insertSheet(name);sheet.appendRow(TABLES[name]);sheet.setFrozenRows(1);}});}
