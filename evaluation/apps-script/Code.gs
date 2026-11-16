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
  EVALUATIONS: ['id','titre','chapitres','niveau','nb_questions','duree_minutes','ouverture_iso','fermeture_iso','actif','tentatives_max','correction_immediate','groupe'],
  TENTATIVES: ['id','email','evaluation_id','mode','debut_iso','expiration_iso','fin_iso','statut','note_sur_20','nb_bonnes','nb_questions','questions_json','reponses_json','dernier_enregistrement_iso'],
  EMAILS: ['tentative_id','email','objet','corps','statut','date_envoi']
});
const TIME_PER_QUESTION = {facile:90,moyen:150,difficile:210};

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
  const page=HtmlService.createTemplateFromFile('Index');
  page.bridgeNonce=nonce;
  // Le cadre ne rend aucun résultat avant validation d'un ID Token Google côté serveur.
  // Son JavaScript n'accepte les messages que de l'origine GitHub autorisée.
  return page.evaluate()
    .setTitle('Évaluations — Analyse L1 Hydrologie')
    .addMetaTag('viewport','width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function include(name) {return HtmlService.createHtmlOutputFromFile(name).getContent();}
function prop_(name) {const value=PropertiesService.getScriptProperties().getProperty(name);if(!value)throw new Error('Configuration manquante : '+name);return value;}
function db_() {return SpreadsheetApp.openById(prop_('SPREADSHEET_ID'));}
function tab_(name) {const tab=db_().getSheetByName(name);if(!tab)throw new Error('Feuille manquante : '+name);return tab;}
function records_(name) {const values=tab_(name).getDataRange().getValues();if(values.length<2)return [];const header=values[0].map(String);return values.slice(1).map((row,i)=>{const item={_row:i+2};header.forEach((h,j)=>item[h]=row[j]);return item;}).filter(x=>String(x[header[0]]||'').trim());}
function find_(name,id,key) {return records_(name).find(x=>String(x[key])===String(id));}
function patch_(name,row,fields) {const header=TABLES[name];const tab=tab_(name);Object.keys(fields).forEach(key=>{const idx=header.indexOf(key);if(idx<0)throw new Error('Colonne inconnue : '+key);tab.getRange(row,idx+1).setValue(fields[key]);});}
function append_(name,values) {tab_(name).appendRow(TABLES[name].map(key=>values[key]===undefined?'':values[key]));}
function lock_(task) {const lock=LockService.getScriptLock();lock.waitLock(20000);try{return task();}finally{lock.releaseLock();}}
function text_(value,max) {return String(value||'').trim().slice(0,max||500);}
function yes_(value) {return value===true||value===1||String(value).trim().toLowerCase()==='oui'||String(value).trim().toLowerCase()==='true';}
function iso_() {return new Date().toISOString();}
function shuffle_(data) {const items=data.slice();for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=items[i];items[i]=items[j];items[j]=t;}return items;}

/** Valide un ID Token Google ; tokeninfo sert ici à l'amorçage gratuit.
 * Pour un déploiement à forte charge, utiliser un validateur JWT avec clés Google.
 */
function signIn(idToken) {
  if(typeof idToken!=='string'||idToken.length<100||idToken.length>6000)throw new Error('Jeton de connexion invalide.');
  const url='https://oauth2.googleapis.com/tokeninfo?id_token='+encodeURIComponent(idToken);
  const response=UrlFetchApp.fetch(url,{muteHttpExceptions:true});
  if(response.getResponseCode()!==200)throw new Error('Connexion Google non vérifiée.');
  const payload=JSON.parse(response.getContentText());
  if(payload.aud!==prop_('GOOGLE_CLIENT_ID')||!['accounts.google.com','https://accounts.google.com'].includes(payload.iss)||Number(payload.exp)*1000<Date.now()||String(payload.email_verified)!=='true')throw new Error('Identité Google non valide.');
  const email=String(payload.email||'').toLowerCase();const admin=email===prop_('TEACHER_EMAIL').toLowerCase();
  const student=records_('ETUDIANTS').find(s=>String(s.email).toLowerCase()===email&&yes_(s.actif));
  if(!admin&&!student)throw new Error('Votre adresse Gmail ne figure pas dans la liste des étudiants inscrits.');
  if(student&&student.google_sub&&String(student.google_sub)!==String(payload.sub))throw new Error('Ce compte Gmail ne correspond pas au compte initialement inscrit.');
  if(student&&!student.google_sub)lock_(()=>{const row=records_('ETUDIANTS').find(x=>String(x.email).toLowerCase()===email);if(row&&!row.google_sub){tab_('ETUDIANTS').getRange(row._row,7).setNumberFormat('@');patch_('ETUDIANTS',row._row,{google_sub:String(payload.sub)});}});
  const session=Utilities.getUuid();const profile={email,role:admin?'teacher':'student',name:admin?'M. Bakary TRAORE':(student.prenom+' '+student.nom).trim(),groupe:admin?'':String(student.groupe||'')};
  CacheService.getScriptCache().put('session:'+session,JSON.stringify(profile),21600);
  return {session,profile};
}
function user_(session,teacher) {const raw=CacheService.getScriptCache().get('session:'+text_(session,80));if(!raw)throw new Error('Session expirée. Connectez-vous à nouveau.');const user=JSON.parse(raw);if(teacher&&user.role!=='teacher')throw new Error('Accès réservé à l’enseignant.');return user;}
function visible_(exam,user) {if(!yes_(exam.actif))return false;const now=Date.now();if(exam.ouverture_iso&&Date.parse(exam.ouverture_iso)>now)return false;if(exam.fermeture_iso&&Date.parse(exam.fermeture_iso)<now)return false;return !exam.groupe||String(exam.groupe).toLowerCase()===String(user.groupe).toLowerCase();}
function getDashboard(session) {
  const user=user_(session);const exams=records_('EVALUATIONS');const attempts=records_('TENTATIVES');
  if(user.role==='teacher')return {role:'teacher',name:user.name,exams:exams.map(({_row,...r})=>r),attempts:attempts.map(({questions_json,reponses_json,_row,...r})=>r),sheetUrl:'https://docs.google.com/spreadsheets/d/'+prop_('SPREADSHEET_ID')+'/edit'};
  return {role:'student',name:user.name,exams:exams.filter(ex=>visible_(ex,user)).map(({_row,...r})=>r),attempts:attempts.filter(x=>String(x.email).toLowerCase()===user.email).map(({questions_json,reponses_json,_row,...r})=>r).reverse().slice(0,40)};
}
function bank_(chapters,level,mode) {
  const choices=String(chapters).split(',').map(x=>x.trim());
  return records_('QUESTIONS').filter(q=>yes_(q.actif)&&choices.includes(String(q.chapitre).trim())&&(level==='tous'||String(q.niveau).toLowerCase()===level)&&String(q.usage).toUpperCase()===(mode==='exam'?'EXAMEN':'ENTRAINEMENT')&&['A','B','C','D'].includes(String(q.bonne).toUpperCase()));
}
function publicQuestion_(q,order) {return {id:String(q.id),text:String(q.enonce),choices:order.map(k=>({id:k,text:String(q[k.toLowerCase()])}))};}
function buildAttempt_(user,mode,evalId,chapters,level,count,minutes,maxAttempts) {
  if(!Number.isInteger(count)||count<1||count>40||!Number.isFinite(minutes)||minutes<1||minutes>180)throw new Error('Paramètres d’évaluation invalides.');
  return lock_(()=>{
    if(mode==='exam'&&records_('TENTATIVES').filter(t=>t.email===user.email&&t.evaluation_id===evalId).length>=maxAttempts)throw new Error('Nombre de tentatives autorisées atteint.');
    const pool=bank_(chapters,level,mode);if(pool.length<count)throw new Error('Banque insuffisante : '+pool.length+' question(s) disponibles pour '+count+' demandées.');
    const selected=shuffle_(pool).slice(0,count).map(q=>({id:String(q.id),order:shuffle_(['A','B','C','D'])}));
    const now=new Date();const end=new Date(now.getTime()+minutes*60000);const id=Utilities.getUuid();
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
  return buildAttempt_(user,'exam',String(exam.id),String(exam.chapitres),String(exam.niveau),Number(exam.nb_questions),Number(exam.duree_minutes),Number(exam.tentatives_max));
}
function cleanAnswers_(attempt,answers) {if(!answers||typeof answers!=='object'||Array.isArray(answers))return {};const selected=JSON.parse(attempt.questions_json);const safe={};selected.forEach(item=>{const x=String(answers[item.id]||'').toUpperCase();if(item.order.includes(x))safe[item.id]=x;});return safe;}
function saveDraft(session,id,answers) {
  const user=user_(session);return lock_(()=>{const attempt=find_('TENTATIVES',text_(id,80),'id');if(!attempt||String(attempt.email)!==user.email)throw new Error('Tentative inaccessible.');if(attempt.statut!=='EN_COURS')return {saved:false,closed:true};if(Date.now()>Date.parse(attempt.expiration_iso))return {saved:false,expired:true};const safe=cleanAnswers_(attempt,answers);patch_('TENTATIVES',attempt._row,{reponses_json:JSON.stringify(safe),dernier_enregistrement_iso:iso_()});return {saved:true};});
}
function submitAttempt(session,id,answers) {
  const user=user_(session);return lock_(()=>{
    const attempt=find_('TENTATIVES',text_(id,80),'id');if(!attempt||String(attempt.email)!==user.email)throw new Error('Tentative inaccessible.');
    if(attempt.statut!=='EN_COURS')return {note:Number(attempt.note_sur_20),correct:Number(attempt.nb_bonnes),count:Number(attempt.nb_questions),alreadySubmitted:true};
    const expired=Date.now()>Date.parse(attempt.expiration_iso);const saved=JSON.parse(attempt.reponses_json||'{}');const selected=JSON.parse(attempt.questions_json);
    const provided=expired?saved:cleanAnswers_(attempt,answers);const bank=new Map(records_('QUESTIONS').map(q=>[String(q.id),q]));
    let correct=0;selected.forEach(item=>{const q=bank.get(item.id);if(!q)throw new Error('Question introuvable : '+item.id);if(String(provided[item.id]||'')===String(q.bonne).toUpperCase())correct++;});
    const count=selected.length;const note=Math.round(100*(20*correct/count))/100;const now=iso_();
    patch_('TENTATIVES',attempt._row,{reponses_json:JSON.stringify(provided),statut:expired?'TERMINE_TEMPS':'TERMINE',fin_iso:now,note_sur_20:note,nb_bonnes:correct,dernier_enregistrement_iso:now});
    // Aucune notification par e-mail pour l'auto-évaluation : score visible à l'écran.
    // Les examens officiels conservent, pour l'instant, leur notification prévue.
    if(attempt.mode==='exam'){
      const email=user.email;append_('EMAILS',{tentative_id:id,email,objet:'Résultat Analyse L1 Hydrologie — '+attempt.evaluation_id,corps:'Bonjour,\n\nVotre tentative '+id+' est terminée.\nNote : '+note+'/20 ('+correct+'/'+count+' réponses correctes).\nDate : '+now+'\n\nM. Bakary TRAORE',statut:'EN_ATTENTE'});
    }
    const output={note,correct,count,expired,attemptId:id};
    if(attempt.mode==='practice'){output.explanations=selected.map(item=>{const q=bank.get(item.id);return {id:item.id,answer:String(q.bonne),explanation:String(q.explication),good:provided[item.id]===String(q.bonne).toUpperCase()};});}
    return output;
  });
}
function adminCreateExam(session,data) {
  user_(session,true);const d=data||{};const chapters=Array.isArray(d.chapters)?d.chapters.map(String).filter(x=>/^[1-7]$/.test(x)):[];if(!chapters.length)throw new Error('Choisissez au moins un chapitre.');
  const level=text_(d.level,20);if(!['facile','moyen','difficile','tous'].includes(level))throw new Error('Difficulté invalide.');
  const count=Number(d.count),minutes=Number(d.minutes),limit=Number(d.maxAttempts);if(!Number.isInteger(count)||count<1||count>40||!Number.isInteger(minutes)||minutes<1||minutes>180||!Number.isInteger(limit)||limit<1||limit>10)throw new Error('Nombre, durée ou tentatives invalides.');
  const start=text_(d.openAt,60),end=text_(d.closeAt,60);if(start&&!Number.isFinite(Date.parse(start)))throw new Error('Date d’ouverture invalide.');if(end&&!Number.isFinite(Date.parse(end)))throw new Error('Date de fermeture invalide.');if(start&&end&&Date.parse(end)<=Date.parse(start))throw new Error('Fermeture antérieure à l’ouverture.');
  const id='EXAM_'+Utilities.getUuid().slice(0,8).toUpperCase();return lock_(()=>{append_('EVALUATIONS',{id,titre:text_(d.title,100)||'Évaluation Analyse',chapitres:chapters.join(','),niveau:level,nb_questions:count,duree_minutes:minutes,ouverture_iso:start?new Date(start).toISOString():'',fermeture_iso:end?new Date(end).toISOString():'',actif:false,tentatives_max:limit,correction_immediate:false,groupe:text_(d.group,50)});return {id,enabled:false,availableQuestions:bank_(chapters.join(','),level,'exam').length};});
}
function adminToggleExam(session,id,enabled) {user_(session,true);return lock_(()=>{const ex=find_('EVALUATIONS',text_(id,80),'id');if(!ex)throw new Error('Évaluation introuvable.');if(enabled&&bank_(ex.chapitres,ex.niveau,'exam').length<Number(ex.nb_questions))throw new Error('Banque EXAMEN insuffisante : ajoutez des questions privées avant activation.');patch_('EVALUATIONS',ex._row,{actif:Boolean(enabled)});return {id,enabled:Boolean(enabled)};});}
/** À exécuter une fois manuellement dans l'éditeur Apps Script par le propriétaire. */
function installMailTrigger() {ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='processMailQueue').forEach(ScriptApp.deleteTrigger);ScriptApp.newTrigger('processMailQueue').timeBased().everyHours(1).create();}
/** Un envoi par étudiant et par tentative, dans la limite du quota Gmail réel.
 * Le verrou n'est pas conservé pendant le transfert réseau des e-mails.
 */
function processMailQueue() {
  let sent=0,quota=MailApp.getRemainingDailyQuota();
  for(let i=0;i<20&&quota>0;i++){
    const next=lock_(()=>{const row=records_('EMAILS').find(x=>x.statut==='EN_ATTENTE');if(!row)return null;patch_('EMAILS',row._row,{statut:'EN_COURS',date_envoi:iso_()});return row;});
    if(!next)break;
    // Même une ancienne notification d'entraînement en attente ne doit jamais partir.
    const attempt=find_('TENTATIVES',String(next.tentative_id),'id');
    if(!attempt||attempt.mode!=='exam'||String(attempt.email).toLowerCase()!==String(next.email).toLowerCase()){
      lock_(()=>patch_('EMAILS',next._row,{statut:'IGNORE',date_envoi:iso_()}));
      continue;
    }
    try{MailApp.sendEmail(String(next.email),String(next.objet),String(next.corps));lock_(()=>patch_('EMAILS',next._row,{statut:'ENVOYE',date_envoi:iso_()}));sent++;quota--;}
    catch(error){lock_(()=>patch_('EMAILS',next._row,{statut:'ERREUR',date_envoi:text_(error.message,200)}));}
  }
  return {sent,remainingQuota:quota};
}
/** À exécuter une fois seulement si le classeur a été créé sans onglets. */
function initializeMissingSheets() {const db=db_();Object.keys(TABLES).forEach(name=>{let sheet=db.getSheetByName(name);if(!sheet){sheet=db.insertSheet(name);sheet.appendRow(TABLES[name]);sheet.setFrozenRows(1);}});}
