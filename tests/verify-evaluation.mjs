import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const bankContext={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'evaluation/quiz-data.js'),'utf8'),bankContext);
for(const chapter of [1,3,4,5,6,7]){
  const filename=path.join(root,`evaluation/questions/chapter-${chapter}.js`);
  const source=fs.readFileSync(filename,'utf8');
  assert(!/(?<!\\)\\[A-Za-z]/.test(source),`Échappement JavaScript incorrect d'une commande LaTeX : chapitre ${chapter}`);
  vm.runInNewContext(source,bankContext,{filename});
}
const questionBank=bankContext.window.HYDRO_DEMO_QUESTIONS;
assert.equal(questionBank.length,210,'210 QCM couvrant les sept chapitres');
const paraphraseFilename=path.join(root,'evaluation/paraphrases.js');
const paraphraseSource=fs.readFileSync(paraphraseFilename,'utf8');
assert(!/(?<!\\)\\[A-Za-z]/.test(paraphraseSource),'Échappement LaTeX incorrect dans les reformulations');
vm.runInNewContext(paraphraseSource,bankContext,{filename:paraphraseFilename});
const paraphrases=bankContext.window.HYDRO_QUESTION_PARAPHRASES;
assert.equal(Object.keys(paraphrases).length,210,'210 questions ont une formulation alternative vérifiée');
const byId=Object.fromEntries(questionBank.map(q=>[q.id,q]));
for(const q of questionBank)assert(paraphrases[q.id],'Variante manquante : '+q.id);
const formulas=text=>[...text.matchAll(/\\\((.*?)\\\)/g)].map(m=>m[1]).sort();
for(const [id,variants] of Object.entries(paraphrases)){
  const q=byId[id];
  assert(q,'Reformulation sans QCM original : '+id);
  assert(variants.length>=1&&variants.length<=3);
  for(const phrase of variants){
    assert(phrase!==q.q&&phrase.length>25,'Reformulation vide ou identique : '+id);
    assert.deepEqual(formulas(phrase),formulas(q.q),'Expression mathématique changée dans : '+id);
    assert.equal((phrase.match(/\\\(/g)||[]).length,(phrase.match(/\\\)/g)||[]).length);
  }
}
for(let chapter=1;chapter<=7;chapter++){
  const questions=questionBank.filter(q=>Number(q.chapter||2)===chapter);
  assert.equal(questions.length,30,`Chapitre ${chapter} : 30 QCM`);
  for(const level of ['facile','moyen','difficile'])assert.equal(questions.filter(x=>x.level===level).length,10,`Chapitre ${chapter} : dix questions de niveau ${level}`);
}
assert.equal(new Set(questionBank.map(x=>x.id)).size,questionBank.length);
for(const q of questionBank){
  assert.equal(q.a.length,4);
  assert(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4);
  assert(q.why.length>15);
  for(const phrase of [q.q,...q.a,q.why]){
    assert.equal((phrase.match(/\\\(/g)||[]).length,(phrase.match(/\\\)/g)||[]).length,'Délimiteurs LaTeX : '+q.id);
    assert(!/[₀-₉⁰-⁹]/u.test(phrase),'Notation mathématique Unicode à corriger : '+q.id);
  }
}

// Vérifier la validité du JavaScript des deux interfaces sans navigateur.
const htmlPaths=['evaluation/index.html','evaluation/apps-script/Index.html','evaluation/apps-script/PracticeBridge.html'];
for(const relative of htmlPaths){const html=fs.readFileSync(path.join(root,relative),'utf8');const blocks=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];for(const match of blocks){const source=match[1].replace('<?!= JSON.stringify(bridgeNonce) ?>','"test-nonce"');if(source.trim())new vm.Script(source,{filename:relative});}}
const quizHtml=fs.readFileSync(path.join(root,'evaluation/index.html'),'utf8');
new vm.Script(fs.readFileSync(path.join(root,'evaluation/practice-tracker.js'),'utf8'),{filename:'evaluation/practice-tracker.js'});
assert(quizHtml.includes('practice-tracker.js')&&quizHtml.includes('id="googleButton"')&&quizHtml.includes('id="practiceBridge"'),'Connexion Google nécessaire pour suivre les révisions libres.');
assert(quizHtml.includes('mathjax@4/tex-chtml.js'),'La bibliothèque de rendu des formules doit être chargée.');
assert(quizHtml.includes("typesetMath($('questions'))")&&quizHtml.includes('typesetMath(list)'),'Les questions et les corrigés doivent être composés en mathématiques.');
assert(quizHtml.includes('paraphrases.js')&&quizHtml.includes('withParaphrases(')&&quizHtml.includes('item.displayQuestion'),'Les reformulations doivent être appliquées au tirage de chaque tentative.');
assert(quizHtml.includes('id="appreciation"')&&quizHtml.includes('const score=10*correct/current.items.length'),'La note d’auto-évaluation doit être calculée sur 10 avec appréciation.');
assert(quizHtml.includes("score.toFixed(1).replace('.',',')}/10"),'Le score présenté aux étudiants doit être affiché sur 10.');
const appreciationSource=quizHtml.match(/function appreciationFor\(score\)\{[^}]+\}/)?.[0];
assert(appreciationSource,'La fonction d’appréciation doit être présente.');
const appreciation=vm.runInNewContext('('+appreciationSource.replace('function appreciationFor','function')+')');
for(const [value,label] of [[0,'Insuffisant'],[4.9,'Insuffisant'],[5,'Passable'],[5.9,'Passable'],[6,'Assez bien'],[6.9,'Assez bien'],[7,'Bien'],[7.9,'Bien'],[8,'Très bien'],[8.9,'Très bien'],[9,'Excellent'],[10,'Excellent']])assert.equal(appreciation(value),label,'Appréciation attendue pour '+value+'/10');
for(const chapter of [1,3,4,5,6,7])assert(quizHtml.includes(`questions/chapter-${chapter}.js`),`Chargement du chapitre ${chapter}`);
assert(quizHtml.includes('Number(q.chapter||2)===chapter'),'Le chapitre choisi doit filtrer les QCM.');

const headers={
 ETUDIANTS:['matricule','email','nom','prenom','groupe','actif','google_sub'],
 QUESTIONS:['id','chapitre','niveau','usage','enonce','a','b','c','d','bonne','explication','actif'],
 EVALUATIONS:['id','titre','chapitres','niveau','nb_questions','duree_minutes','ouverture_iso','fermeture_iso','actif','tentatives_max','correction_immediate','groupe'],
 TENTATIVES:['id','email','evaluation_id','mode','debut_iso','expiration_iso','fin_iso','statut','note_sur_10','nb_bonnes','nb_questions','questions_json','reponses_json','dernier_enregistrement_iso'],
 AUTO_TENTATIVES:['id','email','debut_iso','fin_iso','chapitre','niveau','nb_questions','nb_bonnes','note_sur_10','statut','questions_json'],
 EMAILS:['tentative_id','email','objet','corps','statut','date_envoi']
};
const tables=Object.fromEntries(Object.entries(headers).map(([k,h])=>[k,[h]]));
tables.ETUDIANTS.push(['H001','etudiant@gmail.com','Diallo','Aïssatou','H1',true,'']);
for(const q of questionBank)tables.QUESTIONS.push([q.id,q.chapter||2,q.level,'ENTRAINEMENT',q.q,...q.a,'ABCD'[q.correct],q.why,true]);
class Sheet {constructor(name){this.name=name;}getDataRange(){return {getValues:()=>tables[this.name].map(row=>row.slice())};}appendRow(row){tables[this.name].push([...row]);}getRange(row,col){return {setValue:(value)=>{tables[this.name][row-1][col-1]=value;},setNumberFormat:()=>{}};}}
const sheets=Object.fromEntries(Object.keys(headers).map(name=>[name,new Sheet(name)]));
const sessions=new Map(),sent=[];let uuid=0;
const sandbox={
 PropertiesService:{getScriptProperties:()=>({getProperty:key=>({SPREADSHEET_ID:'TEST_SHEET',TEACHER_EMAIL:'prof@gmail.com',GOOGLE_CLIENT_ID:'TEST_CLIENT'}[key])})},
 SpreadsheetApp:{openById:()=>({getSheetByName:name=>sheets[name]})},
 CacheService:{getScriptCache:()=>({put:(k,v)=>sessions.set(k,v),get:k=>sessions.get(k)||null})},
 LockService:{getScriptLock:()=>({waitLock:()=>{},releaseLock:()=>{}})},
 Utilities:{getUuid:()=>`u${String(++uuid).padStart(7,'0')}-mock-id`},
 UrlFetchApp:{fetch:(url)=>({getResponseCode:()=>200,getContentText:()=>JSON.stringify({aud:'TEST_CLIENT',iss:'accounts.google.com',exp:Math.floor(Date.now()/1000)+3600,email_verified:'true',email:url.includes('teacher')?'prof@gmail.com':url.includes('guest')?'visiteur@gmail.com':'etudiant@gmail.com',sub:'google-account-123'})})},
 MailApp:{getRemainingDailyQuota:()=>100,sendEmail:(...args)=>sent.push(args)},
 Date,Math,JSON,String,Number,Array,Object,Boolean,Map,Cache:Map
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'evaluation/apps-script/Code.gs'),'utf8'),sandbox,{filename:'Code.gs'});
const student=sandbox.signIn('x'.repeat(101));const teacher=sandbox.signIn('teacher'+'x'.repeat(110));
assert.equal(student.profile.role,'student');assert.equal(teacher.profile.role,'teacher');
assert.equal(sandbox.getDashboard(student.session).attempts.length,0);
const guestToken='guest'+'x'.repeat(110);
assert.equal(sandbox.verifyPublicPracticeIdentity(guestToken).email,'visiteur@gmail.com');
assert.throws(()=>sandbox.signIn(guestToken),/ne figure pas dans la liste/,'L’inscription demeure obligatoire pour les examens officiels.');
const publicQuestions=questionBank.filter(q=>Number(q.chapter||2)===2&&q.level==='facile').slice(0,5);
const publicId='AUTO_00000000-0000-4000-8000-000000000001';
const publicStart=sandbox.startPublicPractice(guestToken,{id:publicId,chapter:2,level:'facile',count:5,questionIds:publicQuestions.map(q=>q.id)});
assert.equal(publicStart.id,publicId);
assert.equal(tables.AUTO_TENTATIVES.length,2,'La tentative libre est enregistrée sans inscription.');
assert.equal(sandbox.startPublicPractice(guestToken,{id:publicId,chapter:2,level:'facile',count:5,questionIds:publicQuestions.map(q=>q.id)}).alreadyStarted,true);
const publicAnswers=Object.fromEntries(publicQuestions.map(q=>[q.id,'ABCD'[q.correct]]));
assert.equal(sandbox.finishPublicPractice(guestToken,publicId,publicAnswers).note,10);
assert.equal(sandbox.finishPublicPractice(guestToken,publicId,{}).note,10,'Soumission libre idempotente.');
for(const q of publicQuestions)tables.QUESTIONS.find(row=>row[0]===q.id)[0]='C2'+q.id;
const secondId='AUTO_00000000-0000-4000-8000-000000000002';
sandbox.startPublicPractice(guestToken,{id:secondId,chapter:2,level:'facile',count:5,questionIds:publicQuestions.map(q=>q.id)});
assert.equal(sandbox.finishPublicPractice(guestToken,secondId,publicAnswers).note,10,'Compatibilité avec les identifiants C2F01–C2F10 du tableur.');
assert.throws(()=>sandbox.finishPublicPractice('x'.repeat(101),secondId,{}),/non autorisée/,'Un autre compte ne peut pas modifier les tentatives.');
assert.equal(sandbox.getDashboard(teacher.session).revisions.summary.visiteurs,1);
assert.equal(sandbox.getDashboard(teacher.session).revisions.summary.sansTentative,1);
assert(!('revisions' in sandbox.getDashboard(student.session)),'La liste des adresses reste privée.');
const practice=sandbox.startPractice(student.session,'2','moyen',5);
assert.equal(practice.questions.length,5);assert(!('correct' in practice.questions[0]));
const ids=Object.fromEntries(questionBank.map(q=>[q.id,q]));
const correctAnswers=Object.fromEntries(practice.questions.map(q=>[q.id,'ABCD'[ids[q.id].correct]]));
assert.equal(sandbox.saveDraft(student.session,practice.id,correctAnswers).saved,true);
const grade=sandbox.submitAttempt(student.session,practice.id,correctAnswers);
assert.equal(grade.note,10);assert.equal(grade.correct,5);
assert.equal(sandbox.submitAttempt(student.session,practice.id,{}).note,10,'soumission répétée idempotente');
assert.equal(tables.EMAILS.length,1,'aucun e-mail pour une auto-évaluation');
assert.equal(sandbox.processMailQueue_().sent,0);assert.equal(sent.length,0);
// Une éventuelle notification d'entraînement mise en attente par une version antérieure doit être ignorée.
tables.EMAILS.push([practice.id,'etudiant@gmail.com','Ancien résultat','Ne pas envoyer','EN_ATTENTE','']);
assert.equal(sandbox.processMailQueue_().sent,0);
assert.equal(tables.EMAILS[1][4],'IGNORE');assert.equal(sent.length,0);

const exam=sandbox.adminCreateExam(teacher.session,{title:'Examen test',chapters:['2'],level:'moyen',count:5,minutes:25,maxAttempts:1});
assert.equal(exam.enabled,false);
assert(!sandbox.getDashboard(student.session).exams.some(x=>x.id===exam.id));
for(let i=0;i<6;i++){const q=questionBank.find(x=>x.level==='moyen');tables.QUESTIONS.push(['E'+i,2,'moyen','EXAMEN',`Question privée ${i}`,...q.a,'A','Explication',true]);}
assert.equal(sandbox.adminToggleExam(teacher.session,exam.id,true).enabled,true);
assert.equal(sandbox.getDashboard(student.session).exams.find(x=>x.id===exam.id).etat,'ouverte');
const examTry=sandbox.startExam(student.session,exam.id);assert.equal(examTry.questions.length,5);
assert.throws(()=>sandbox.startExam(student.session,exam.id),/Nombre de tentatives/);
assert.equal(sandbox.submitAttempt(student.session,examTry.id,{}).note,0);
assert.equal(tables.EMAILS.length,3,'un seul e-mail pour l’examen officiel');
assert.equal(sandbox.processMailQueue_().sent,1);assert.equal(sent.length,1);
// Un examen publié apparaît avant l'ouverture, sans donner accès au QCM.
const opening=new Date(Date.now()+120_000).toISOString();
const closing=new Date(Date.now()+600_000).toISOString();
const future=sandbox.adminCreateExam(teacher.session,{title:'Programmation test',chapters:['2'],level:'moyen',count:5,minutes:25,maxAttempts:1,openAt:opening,closeAt:closing,group:'H1'});
assert(!sandbox.getDashboard(student.session).exams.some(x=>x.id===future.id),'brouillon invisible');
sandbox.adminToggleExam(teacher.session,future.id,true);
let upcoming=sandbox.getDashboard(student.session).exams.find(x=>x.id===future.id);
assert.equal(upcoming.etat,'a_venir');
assert.equal(upcoming.ouverture_iso,opening);
assert.equal(upcoming.nb_questions,5);
assert(!('bonne' in upcoming)&&!('questions_json' in upcoming)&&!('groupe' in upcoming),'aucune donnée d’examen sensible publiée');
assert.throws(()=>sandbox.startExam(student.session,future.id),/fermée|inaccessible/,'pas de démarrage anticipé');
const futureRow=tables.EVALUATIONS.find(row=>row[0]===future.id);
futureRow[6]=new Date(Date.now()-30_000).toISOString();
futureRow[7]=new Date(Date.now()+60_000).toISOString();
assert.equal(sandbox.getDashboard(student.session).exams.find(x=>x.id===future.id).etat,'ouverte');
const limited=sandbox.startExam(student.session,future.id);
assert(Date.parse(limited.deadline)<=Date.parse(futureRow[7]),'fin de tentative limitée par la fermeture');
futureRow[7]=new Date(Date.now()-1_000).toISOString();
assert.equal(sandbox.getDashboard(student.session).exams.find(x=>x.id===future.id).etat,'terminee');
assert.throws(()=>sandbox.startExam(student.session,future.id),/fermée|inaccessible/,'pas de démarrage après fermeture');
futureRow[8]=false;
assert(!sandbox.getDashboard(student.session).exams.some(x=>x.id===future.id),'évaluation retirée invisible');
const otherGroup=sandbox.adminCreateExam(teacher.session,{title:'Autre groupe',chapters:['2'],level:'moyen',count:5,minutes:25,maxAttempts:1,group:'H2'});
sandbox.adminToggleExam(teacher.session,otherGroup.id,true);
assert(!sandbox.getDashboard(student.session).exams.some(x=>x.id===otherGroup.id),'groupe différent invisible');
assert.throws(()=>sandbox.startExam(student.session,otherGroup.id),/fermée|inaccessible/,'groupe différent interdit côté serveur');
assert.equal(sandbox.getDashboard(teacher.session).attempts.length,3);
assert(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('href="evaluation/officielle/"'),'rubrique accessible depuis la plateforme');
assert(fs.readFileSync(path.join(root,'evaluation/index.html'),'utf8').includes('href="officielle/"'),'lien depuis l’entraînement');
assert(fs.readFileSync(path.join(root,'evaluation/apps-script/Index.html'),'utf8').includes('Évaluations officielles programmées'),'liste du calendrier étudiant');
console.log('✓ 210 QCM et 210 reformulations sur sept chapitres validés, interfaces analysées, sessions, tirages, barème, confidentialité, e-mails et examen testés.');
