/* global google, HYDRO_OFFICIAL_CONFIG */
(()=>{
  'use strict';

  const $=id=>document.getElementById(id);
  const config=window.HYDRO_OFFICIAL_CONFIG||{};
  const trustedOrigin=window.location.origin;
  const nonceBytes=new Uint8Array(32);
  window.crypto.getRandomValues(nonceBytes);
  const nonce=Array.from(nonceBytes,x=>x.toString(16).padStart(2,'0')).join('');

  let credential=null;
  let pinPending=null;
  let authBusy=false;
  let signingOut=false;
  let bridgeWindow=null;
  let bridgeOrigin='';
  let timer=null;
  let authenticated=false;
  let examDeadline=0;
  let expirySignalSent=false;


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

  let authWatchdog=null;
  // V34: navigation et visibilité de la tentative (aucune donnée de réponse dans le portail).
  const navigationReload=performance.getEntriesByType('navigation')[0]?.type==='reload';
  function examActive(){return authenticated&&examDeadline>0&&!$('examTimer').hidden;}
  document.addEventListener('visibilitychange',()=>{if(examActive()&&bridgeWindow&&bridgeOrigin)bridgeWindow.postMessage({kind:'hydro-visibility',nonce,hidden:document.hidden},bridgeOrigin);});
  window.addEventListener('beforeunload',event=>{if(examActive()){event.preventDefault();event.returnValue='';}});
  document.addEventListener('keydown',event=>{if(examActive()&&(event.key==='F5'||((event.ctrlKey||event.metaKey)&&String(event.key).toLowerCase()==='r')))event.preventDefault();},true);
  function updateExamTimer(){
    if(!examDeadline)return;
    const remaining=Math.max(0,Math.ceil((examDeadline-Date.now())/1000));
    if(remaining===0)window.COURSE_SCREEN_AWAKE?.stop();
    const widget=$('examTimer');
    $('examTimerValue').textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');
    widget.classList.toggle('warning',remaining<=60&&remaining>30);
    widget.classList.toggle('caution',remaining<=30&&remaining>10);
    widget.classList.toggle('urgent',remaining<=10);
    const stage=remaining===0?'termine':remaining<=10?'10':remaining<=30?'30':remaining<=60?'60':'normal';
    if(widget.dataset.stage!==stage){
      widget.dataset.stage=stage;
      $('examTimerNotice').textContent=stage==='termine'?'Remise automatique en cours':stage==='10'?'Dernières 10 secondes':stage==='30'?'Plus que 30 secondes':stage==='60'?'Plus que 60 secondes':'Temps restant';
    }
    if(remaining===0&&!expirySignalSent&&bridgeWindow&&bridgeOrigin){
      expirySignalSent=true;
      bridgeWindow.postMessage({kind:'hydro-force-submit',nonce},bridgeOrigin);
    }
  }

  function status(message,state='info'){
    $('status').textContent=message;
    $('status').dataset.state=state;
  }
  function isGoogleAppsScriptOrigin(origin){
    try{
      const url=new URL(origin);
      return url.protocol==='https:'&&(
        url.hostname==='script.google.com'||
        url.hostname==='googleusercontent.com'||
        url.hostname.endsWith('.googleusercontent.com')
      );
    }catch{return false;}
  }
  function isConfigured(){
    const id=String(config.googleClientId||'');
    const endpoint=String(config.appsScriptUrl||'');
    if(!/^\d+-[a-z0-9-]+\.apps\.googleusercontent\.com$/i.test(id))return false;
    try{
      const url=new URL(endpoint);
      return url.protocol==='https:'&&url.hostname==='script.google.com'&&
        /^\/macros\/s\/[\w-]+\/exec$/.test(url.pathname)&&!url.search&&!url.hash;
    }catch{return false;}
  }
  function sendToken(){
    if(!bridgeWindow||!bridgeOrigin)return;
    if(pinPending){
      const payload=pinPending;pinPending=null;
      bridgeWindow.postMessage({kind:'hydro-auth-pin',nonce,email:payload.email,pin:payload.pin},bridgeOrigin);
    }else if(credential){
      bridgeWindow.postMessage({kind:'hydro-auth-token',nonce,token:credential},bridgeOrigin);
      credential=null;
    }else return;
    status('Vérification de votre accès par le serveur…');
    loadingStart('auth','Vérification de votre compte…');
  }
  function onGoogleLogin(result){
    if(authenticated||authBusy)return;
    if(!result||typeof result.credential!=='string'){
      status('Google n’a pas retourné de preuve de connexion. Réessayez.','error');
      return;
    }
    credential=result.credential;authBusy=true;$('pinSubmit').disabled=true;
    openBridge();
  }
  function openBridge(){
    loadingStart('auth','Vérification de votre compte…');
    clearTimeout(authWatchdog);authWatchdog=setTimeout(()=>{if(authBusy){loadingStop('auth');status('Connexion non confirmée. Actualisez la page avant de réessayer.','error');}},120000);
    $('appPanel').hidden=false;
    if(!$('app').src){
      const url=new URL(config.appsScriptUrl);
      url.searchParams.set('bridge',nonce);
      $('appPanel').hidden=false;
      $('app').src=url.href;
      status('Ouverture du service privé…');
      timer=window.setTimeout(()=>{
        if(!bridgeWindow){loadingStop('auth');clearTimeout(authWatchdog);pinPending=null;credential=null;authBusy=false;$('pinSubmit').disabled=false;status('Le service privé ne répond pas. Rechargez la page et réessayez.','error');}
      },20000);
    }else if(bridgeWindow){
      sendToken();
    }
  }

  window.addEventListener('message',event=>{
    if(!isGoogleAppsScriptOrigin(event.origin))return;
    const data=event.data;
    if(!data||data.nonce!==nonce)return;
    if(bridgeWindow&&event.source!==bridgeWindow)return;
    if(data.kind==='hydro-frame-ready'){
      bridgeWindow=event.source;
      bridgeOrigin=event.origin;
      if(timer){clearTimeout(timer);timer=null;}
      sendToken();
      return;
    }
    if(!bridgeWindow||event.source!==bridgeWindow)return;
    if(data.kind==='hydro-signout-done'&&signingOut){window.location.reload();return;}
    if(data.kind==='hydro-operation'&&authenticated&&/^op-\d{1,9}$/.test(String(data.id||''))){
      const key='frame-'+data.id;if(data.busy===true)loadingStart(key,String(data.message||'Traitement en cours…').slice(0,160));else if(data.busy===false)loadingStop(key);return;
    }
    if(data.kind==='hydro-auth-result'){
      clearTimeout(authWatchdog);loadingStop('auth');
      pinPending=null;credential=null;authBusy=false;$('pinSubmit').disabled=false;$('pinCode').value='';
      if(data.ok===true){
        authenticated=true;
        credential=null;
        $('pinEmail').value='';$('loginPanel').hidden=true;
        window.scrollTo(0,0);
        if(navigationReload&&bridgeWindow&&bridgeOrigin)bridgeWindow.postMessage({kind:'hydro-resume-after-reload',nonce},bridgeOrigin);
      }else{
        $('appPanel').hidden=true;status('Connexion refusée : '+String(data.message||'compte non autorisé').slice(0,200),'error');
      }
    }else if(data.kind==='hydro-frame-height'){
      const height=Number(data.height);
      if(Number.isFinite(height)&&height>0)$('app').style.height=Math.max(550,Math.min(18000,Math.ceil(height)+24))+'px';
    }else if(data.kind==='hydro-exam-timer'){
      if(data.visible!==true){examDeadline=0;window.COURSE_SCREEN_AWAKE?.stop();$('examTimer').hidden=true;return;}
      const value=Date.parse(String(data.deadline||''));
      if(!Number.isFinite(value)||Math.abs(value-Date.now())>86400000)return;
      // Le cadre renvoie un signal chaque seconde : ne réarmer la remise
      // automatique que lorsqu'une nouvelle tentative a un autre délai.
      if(examDeadline!==value)expirySignalSent=false;
      examDeadline=value;
      $('examTimer').hidden=false;
      if(value>Date.now())window.COURSE_SCREEN_AWAKE?.start();
      updateExamTimer();
    }
  });

  $('pinForm').addEventListener('submit',event=>{
    event.preventDefault();
    if(authenticated||authBusy)return;
    if(trustedOrigin!=='https://btraore850.github.io'||!isConfigured()){status('Ouvrez la plateforme officielle pour vous connecter.','error');return;}
    const email=$('pinEmail').value.trim().toLowerCase(),pin=$('pinCode').value;
    $('pinCode').value='';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!/^\d{6}$/.test(pin)){status('Saisissez une adresse valide et un PIN à six chiffres.','error');return;}
    pinPending={email,pin};authBusy=true;$('pinSubmit').disabled=true;openBridge();
  });
  $('logout').addEventListener('click',()=>{
    if(signingOut)return;
    if(!$('examTimer').hidden){alert('Soumettez votre tentative avant de changer de compte.');return;}
    signingOut=true;$('logout').disabled=true;loadingStart('logout','Déconnexion en cours…');
    if(bridgeWindow&&bridgeOrigin){bridgeWindow.postMessage({kind:'hydro-signout',nonce},bridgeOrigin);setTimeout(()=>window.location.reload(),3000);}else window.location.reload();
  });
  window.setInterval(updateExamTimer,1000);
  window.addEventListener('load',()=>{
    if(trustedOrigin!=='https://btraore850.github.io'){
      status('Cette connexion doit être ouverte depuis le site officiel btraore850.github.io.','error');
      return;
    }
    if(!isConfigured()){
      status('Configuration incomplète : renseignez googleClientId et appsScriptUrl dans officielle/config.js avant le premier essai.','error');
      return;
    }
    if(!window.google||!google.accounts||!google.accounts.id){
      status('La connexion Google est indisponible. Vous pouvez utiliser votre adresse et votre PIN.');
      return;
    }
    google.accounts.id.initialize({client_id:config.googleClientId,callback:onGoogleLogin,auto_select:false,ux_mode:'popup'});
    google.accounts.id.renderButton($('googleButton'),{type:'standard',shape:'pill',theme:'outline',size:'large',text:'signin_with'});
    if(!authBusy&&!authenticated)status('Connectez-vous par PIN ou par Google pour ouvrir votre espace.');
  });
})();
