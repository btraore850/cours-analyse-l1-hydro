import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const base=new URL('../evaluation/',import.meta.url);
const read=path=>readFileSync(new URL(path,base),'utf8');

test('les sources Apps Script et GitHub sont syntaxiquement valides',()=>{
  new Function(read('apps-script/Code.gs'));
  new Function(read('officielle/portal.js'));
  new Function(read('officielle/config.js'));
  const html=read('apps-script/Index.html');
  const script=html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(script,'Script client Apps Script introuvable');
  new Function(script[1].replace('<?!= JSON.stringify(bridgeNonce) ?>','"a".repeat(64)'));
});

test('Google Identity Services ne se charge que depuis GitHub Pages',()=>{
  assert.ok(read('officielle/index.html').includes('accounts.google.com/gsi/client'));
  assert.ok(!read('apps-script/Index.html').includes('accounts.google.com/gsi/client'));
  assert.ok(read('apps-script/Code.gs').includes('XFrameOptionsMode.ALLOWALL'));
  assert.ok(read('apps-script/Code.gs').includes("/^[a-f0-9]{64}$/"));
});

test('la passerelle authentifie uniquement le cadre attendu et refuse les origines tierces',async()=>{
  const {runInNewContext}=await import('node:vm');
  const handlers=new Map();
  const elements={};
  for(const name of ['loginPanel','googleButton','status','appPanel','app','logout']){
    elements[name]={hidden:name==='appPanel',style:{},dataset:{},src:'',addEventListener(){}};
  }
  const document={getElementById:id=>elements[id]};
  let oauthCallback=null;
  const google={accounts:{id:{initialize(options){oauthCallback=options.callback;},renderButton(){}}}};
  const window={
    location:{origin:'https://btraore850.github.io',reload(){}},
    crypto:{getRandomValues(bytes){bytes.forEach((_,i)=>{bytes[i]=i;});return bytes;}},
    HYDRO_OFFICIAL_CONFIG:{
      googleClientId:'123456-test.apps.googleusercontent.com',
      appsScriptUrl:'https://script.google.com/macros/s/AKfycbx-abc123/exec'
    },
    google,
    addEventListener(name,callback){handlers.set(name,callback);},
    setTimeout(){return 1;},
    scrollTo(){}
  };
  runInNewContext(read('officielle/portal.js'),{
    window,document,google,URL,Uint8Array,Array,Number,String,Math,clearTimeout(){}
  });
  handlers.get('load')();
  assert.equal(typeof oauthCallback,'function');
  oauthCallback({credential:'g'.repeat(500)});
  assert.equal(elements.appPanel.hidden,false);
  const bridgeNonce=new URL(elements.app.src).searchParams.get('bridge');
  assert.match(bridgeNonce,/^[a-f0-9]{64}$/);

  const posted=[];
  const source={postMessage:(value,origin)=>posted.push({value,origin})};
  handlers.get('message')({origin:'https://malicious.example',source,data:{kind:'hydro-frame-ready',nonce:bridgeNonce}});
  handlers.get('message')({origin:'https://script.googleusercontent.com',source,data:{kind:'hydro-frame-ready',nonce:'wrong'}});
  assert.equal(posted.length,0);

  handlers.get('message')({origin:'https://a.script.googleusercontent.com',source,data:{kind:'hydro-frame-ready',nonce:bridgeNonce}});
  assert.equal(posted.length,1);
  assert.equal(posted[0].origin,'https://a.script.googleusercontent.com');
  assert.equal(posted[0].value.kind,'hydro-auth-token');
  assert.equal(posted[0].value.token,'g'.repeat(500));

  handlers.get('message')({origin:'https://a.script.googleusercontent.com',source,data:{kind:'hydro-auth-result',nonce:bridgeNonce,ok:true}});
  assert.equal(elements.loginPanel.hidden,true);
});

test('le calendrier étudiant passe automatiquement de À venir à Ouverte puis Terminée',async()=>{
  const vm=await import('node:vm');
  const html=read('apps-script/Index.html');
  const embedded=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
  const first=embedded.indexOf('function stateOfExam(ex){');
  const last=embedded.indexOf('function renderStudent(){');
  assert(first>=0&&last>first,'Fonctions du calendrier introuvables');
  const source=embedded.slice(first,last);
  const current=Date.now();
  const exam={id:'EXAM_TEST',ouverture_iso:new Date(current+60_000).toISOString(),fermeture_iso:new Date(current+180_000).toISOString()};
  const badge={className:'',textContent:''},button={disabled:false,textContent:''};
  const examControls=new Map([['EXAM_TEST',{exam,badge,button,limitReached:false}]]);
  let time=current;
  const context=vm.createContext({Date:{now:()=>time,parse:Date.parse},Number,examControls});
  vm.runInContext(source,context);
  vm.runInContext('updateExamAvailability()',context);
  assert.equal(badge.textContent,'À venir');
  assert.equal(button.disabled,true);
  time=current+120_000;
  vm.runInContext('updateExamAvailability()',context);
  assert.equal(badge.textContent,'Ouverte');
  assert.equal(button.disabled,false);
  assert.equal(button.textContent,'Commencer');
  time=current+240_000;
  vm.runInContext('updateExamAvailability()',context);
  assert.equal(badge.textContent,'Terminée');
  assert.equal(button.disabled,true);
  time=current+120_000;
  examControls.get('EXAM_TEST').limitReached=true;
  vm.runInContext('updateExamAvailability()',context);
  assert.equal(button.textContent,'Tentatives épuisées');
  assert.equal(button.disabled,true);
});

test('les 210 QCM actifs peuvent alimenter les examens sans rompre l’entraînement',async()=>{
  const vm=await import('node:vm');
  const code=read('apps-script/Code.gs');
  const start=code.indexOf('function chapters_(value) {');
  const end=code.indexOf('function publicQuestion_(q,order)');
  assert.ok(start>=0&&end>start);
  const questions=[];
  for(let chapter=1;chapter<=7;chapter++){
    for(const level of ['facile','moyen','difficile']){
      for(let i=0;i<10;i++)questions.push({id:`${chapter}-${level}-${i}`,chapitre:chapter,niveau:level,usage:'ENTRAINEMENT',actif:true,bonne:'B'});
    }
  }
  const ctx=vm.createContext({String,Math,Set,records_:name=>{assert.equal(name,'QUESTIONS');return questions;},yes_:Boolean,shuffle_:array=>array.slice()});
  vm.runInContext(code.slice(start,end),ctx);
  assert.deepEqual(Array.from(vm.runInContext('chapters_(2.3)',ctx)),['2','3']);
  assert.deepEqual(Array.from(vm.runInContext('chapters_("2;3")',ctx)),['2','3']);
  assert.equal(vm.runInContext('bank_("1;2;3;4;5;6;7","tous","exam").length',ctx),210);
  assert.equal(vm.runInContext('bank_("2.3","moyen","exam").length',ctx),20);
  assert.equal(vm.runInContext('bank_("2","facile","practice").length',ctx),10);
  const chosen=vm.runInContext('selectQuestions_(bank_("2;3","tous","exam"),"tous",10,"exam")',ctx);
  assert.equal(chosen.length,10);
  assert.equal(new Set(chosen.map(q=>q.id)).size,10);
  assert.equal(chosen.filter(q=>q.niveau==='facile').length,3);
  assert.equal(chosen.filter(q=>q.niveau==='moyen').length,4);
  assert.equal(chosen.filter(q=>q.niveau==='difficile').length,3);
  assert.ok(read('apps-script/Index.html').includes('examControls.set(ex.id,{exam:ex,badge,button,limitReached})'));
});

test('l’espace officiel ne présente plus le formulaire d’auto-évaluation libre',()=>{
  const html=read('apps-script/Index.html');
  assert.ok(!html.includes('id="practiceSetup"'));
  assert.ok(!html.includes('id="startPractice"'));
  assert.ok(!html.includes("show('practiceSetup'"));
  assert.ok(!html.includes("request('startPractice'"));
  assert.ok(html.includes('Évaluations officielles programmées'));
  assert.ok(html.includes("request('startExam',session,id)"));
  // Le site conserve son espace public distinct pour les entraînements.
  const home=read('../index.html');
  assert.ok(home.includes('href="evaluation/">Faire un QCM'));
});
