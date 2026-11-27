/* global google, HYDRO_OFFICIAL_CONFIG */
(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const config=window.HYDRO_OFFICIAL_CONFIG||{};
  const bytes=new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  const nonce=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  const waiting=new Map(),bridgeWaiters=[];
  let credential='',email='',bridgeWindow=null,bridgeOrigin='',nextRequest=0;


  // V33: blocage visuel des opérations déclenchées par l'utilisateur.
  const loadingTasks=new Map();
  let loadingDialog=null,loadingTitle=null,loadingHint=null,loadingTimer=null;
  function ensureLoading(){
    if(loadingDialog)return;
    const style=document.createElement('style');
    style.textContent='#l1-loading-modal{box-sizing:border-box;width:min(90vw,420px);max-width:420px;padding:28px 24px;border:0;border-radius:18px;background:#fff;color:#17324d;text-align:center;box-shadow:0 16px 60px #102a4340;z-index:2147483647}#l1-loading-modal::backdrop{background:rgba(13,30,50,.60)}#l1-loading-modal .l1-spinner{width:42px;height:42px;margin:0 auto 18px;border:4px solid #dce8ef;border-top-color:#176b9a;border-radius:50%;animation:l1spin .85s linear infinite}#l1-loading-modal strong{display:block;font-size:1.1rem;line-height:1.45}#l1-loading-modal p{font-size:.92rem;line-height:1.5;margin:12px 0 0;color:#42586c}@keyframes l1spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){#l1-loading-modal .l1-spinner{animation:none;border-color:#176b9a}}';
    document.head.append(style);
    loadingDialog=document.createElement('dialog');loadingDialog.id='l1-loading-modal';
    loadingDialog.setAttribute('aria-label','Opération en cours');loadingDialog.setAttribute('aria-modal','true');
    loadingDialog.addEventListener('cancel',event=>event.preventDefault());
    const spinner=document.createElement('div');spinner.className='l1-spinner';spinner.setAttribute('aria-hidden','true');
    loadingTitle=document.createElement('strong');loadingTitle.setAttribute('role','status');loadingTitle.setAttribute('aria-live','polite');
    loadingHint=document.createElement('p');loadingDialog.append(spinner,loadingTitle,loadingHint);document.body.append(loadingDialog);
  }
  function loadingStart(key,message){
    ensureLoading();const first=loadingTasks.size===0;
    loadingTasks.set(key,message);loadingTitle.textContent=message;
    if(first){
      loadingHint.textContent='Veuillez patienter. Ne cliquez pas de nouveau et ne fermez pas la page.';
      try{if(!loadingDialog.open)loadingDialog.showModal();}catch{loadingDialog.setAttribute('open','');loadingDialog.style.position='fixed';loadingDialog.style.inset='0';loadingDialog.style.margin='auto';loadingDialog.style.boxShadow='0 0 0 100vmax rgba(13,30,50,.60)';}
      loadingTimer=setTimeout(()=>{if(loadingTasks.size)loadingHint.textContent='La connexion est lente. L’opération est toujours en cours : ne la relancez pas.';},25000);
    }
  }
  function loadingStop(key){
    if(!loadingTasks.delete(key))return;
    if(loadingTasks.size){loadingTitle.textContent=Array.from(loadingTasks.values()).at(-1);return;}
    clearTimeout(loadingTimer);loadingTimer=null;
    if(loadingDialog?.open){try{loadingDialog.close();}catch{loadingDialog.removeAttribute('open');}}
  }

  let verifying=false;const activeActions=new Map();
  function status(message,bad=false){
    $('identityStatus').textContent=message;
    $('identityStatus').style.color=bad?'#a5332d':'#345d6e';
  }
  function scriptOrigin(origin){
    try{
      const url=new URL(origin);
      return url.protocol==='https:'&&(url.hostname==='script.google.com'||url.hostname==='googleusercontent.com'||url.hostname.endsWith('.googleusercontent.com'));
    }catch{return false;}
  }
  function configured(){
    if(window.location.origin!=='https://btraore850.github.io')return false;
    if(!/^\d+-[a-z0-9-]+\.apps\.googleusercontent\.com$/i.test(String(config.googleClientId||'')))return false;
    try{
      const url=new URL(config.appsScriptUrl);
      return url.protocol==='https:'&&url.hostname==='script.google.com'&&/^\/macros\/s\/[\w-]+\/exec$/.test(url.pathname)&&!url.search&&!url.hash;
    }catch{return false;}
  }
  function awaitBridge(){
    if(bridgeWindow)return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('Le service de suivi ne répond pas. Réessayez dans quelques instants.')),20000);
      bridgeWaiters.push(()=>{clearTimeout(timer);resolve();});
    });
  }
  function rpcRaw(action,payload={}){
    if(!credential)return Promise.reject(new Error('Connectez-vous avec Google avant de commencer.'));
    return awaitBridge().then(()=>new Promise((resolve,reject)=>{
      const requestId='practice-'+(++nextRequest).toString(36);
      const timer=setTimeout(()=>{waiting.delete(requestId);reject(new Error('Délai dépassé : enregistrement non confirmé.'));},25000);
      waiting.set(requestId,{resolve,reject,timer});
      bridgeWindow.postMessage({kind:'hydro-practice-request',nonce,requestId,action,token:credential,payload},bridgeOrigin);
    }));
  }
  function rpc(action,payload={}){
    if(activeActions.has(action))return activeActions.get(action);
    const messages={verify:'Vérification de votre adresse e-mail…',start:'Préparation du questionnaire…',finish:'Enregistrement de votre résultat…'};
    loadingStart(action,messages[action]||'Traitement en cours…');
    const pending=Promise.resolve().then(()=>rpcRaw(action,payload)).finally(()=>{activeActions.delete(action);loadingStop(action);});activeActions.set(action,pending);return pending;
  }
  window.addEventListener('message',event=>{
    if(!scriptOrigin(event.origin))return;
    const data=event.data;
    if(!data||data.nonce!==nonce)return;
    if(bridgeWindow&&event.source!==bridgeWindow)return;
    if(data.kind==='hydro-practice-ready'){
      bridgeWindow=event.source;bridgeOrigin=event.origin;
      while(bridgeWaiters.length)bridgeWaiters.shift()();
      return;
    }
    if(data.kind!=='hydro-practice-result'||event.source!==bridgeWindow)return;
    const pending=waiting.get(data.requestId);if(!pending)return;
    clearTimeout(pending.timer);waiting.delete(data.requestId);
    if(data.ok)pending.resolve(data.result);
    else pending.reject(new Error(String(data.message||'Enregistrement refusé.').slice(0,200)));
  });
  async function googleLogin(result){
    if(verifying||activeActions.size)return;
    if(!result||typeof result.credential!=='string'){status('La connexion Google a échoué. Réessayez.',true);return;}
    verifying=true;$('start').disabled=true;credential=result.credential;
    status('Vérification de votre adresse e-mail…');
    try{
      const identity=await rpc('verify');
      email=String(identity.email||'');
      if(!email)throw new Error('Adresse Google non disponible.');
      $('identityEmail').textContent='Compte vérifié : '+email;
      $('start').disabled=false;
      status('Vous pouvez commencer. Aucune inscription préalable n’est nécessaire.');
    }catch(error){
      credential='';email='';$('start').disabled=true;
      status(error.message||String(error),true);
    }finally{verifying=false;}
  }
  window.HYDRO_PRACTICE_TRACKER=Object.freeze({
    ready:()=>Boolean(credential&&email&&bridgeWindow),
    start:payload=>rpc('start',payload),
    finish:(id,answers)=>rpc('finish',{id,answers}),
    email:()=>email
  });
  window.addEventListener('load',()=>{
    $('start').disabled=true;
    if(!configured()){
      status('Configuration du suivi indisponible. Contactez l’enseignant.',true);
      return;
    }
    if(!window.google||!google.accounts||!google.accounts.id){
      status('La connexion Google est indisponible. Vérifiez votre connexion Internet.',true);
      return;
    }
    const url=new URL(config.appsScriptUrl);
    url.searchParams.set('bridge',nonce);
    url.searchParams.set('mode','practice');
    $('practiceBridge').src=url.href;
    google.accounts.id.initialize({client_id:config.googleClientId,callback:googleLogin,auto_select:false,ux_mode:'popup'});
    google.accounts.id.renderButton($('googleButton'),{type:'standard',shape:'pill',theme:'outline',size:'large',text:'signin_with'});
    status('Connectez-vous avec votre compte Google pour enregistrer vos révisions.');
  });
})();
