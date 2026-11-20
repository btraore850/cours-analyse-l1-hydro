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
  let bridgeWindow=null;
  let bridgeOrigin='';
  let timer=null;
  let authenticated=false;
  let examDeadline=0;
  let expirySignalSent=false;

  function updateExamTimer(){
    if(!examDeadline)return;
    const remaining=Math.max(0,Math.ceil((examDeadline-Date.now())/1000));
    const widget=$('examTimer');
    $('examTimerValue').textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');
    widget.classList.toggle('warning',remaining<=60&&remaining>10);
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
    if(!credential||!bridgeWindow||!bridgeOrigin)return;
    bridgeWindow.postMessage({kind:'hydro-auth-token',nonce,token:credential},bridgeOrigin);
    status('Vérification de votre compte par le serveur…');
  }
  function onGoogleLogin(result){
    if(authenticated)return;
    if(!result||typeof result.credential!=='string'){
      status('Google n’a pas retourné de preuve de connexion. Réessayez.','error');
      return;
    }
    credential=result.credential;
    if(!$('app').src){
      const url=new URL(config.appsScriptUrl);
      url.searchParams.set('bridge',nonce);
      $('appPanel').hidden=false;
      $('app').src=url.href;
      status('Connexion Google reçue. Ouverture du service privé…');
      timer=window.setTimeout(()=>{
        if(!bridgeWindow)status('Le service Apps Script ne répond pas dans le cadre. Vérifiez le nouveau déploiement et les autorisations du navigateur.','error');
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
    if(data.kind==='hydro-auth-result'){
      if(data.ok===true){
        authenticated=true;
        credential=null;
        $('loginPanel').hidden=true;
        window.scrollTo(0,0);
      }else{
        status('Connexion refusée : '+String(data.message||'compte non autorisé').slice(0,200),'error');
      }
    }else if(data.kind==='hydro-frame-height'){
      const height=Number(data.height);
      if(Number.isFinite(height)&&height>0)$('app').style.height=Math.max(550,Math.min(18000,Math.ceil(height)+24))+'px';
    }else if(data.kind==='hydro-exam-timer'){
      if(data.visible!==true){examDeadline=0;$('examTimer').hidden=true;return;}
      const value=Date.parse(String(data.deadline||''));
      if(!Number.isFinite(value)||Math.abs(value-Date.now())>86400000)return;
      // Le cadre renvoie un signal chaque seconde : ne réarmer la remise
      // automatique que lorsqu'une nouvelle tentative a un autre délai.
      if(examDeadline!==value)expirySignalSent=false;
      examDeadline=value;
      $('examTimer').hidden=false;
      updateExamTimer();
    }
  });

  $('logout').addEventListener('click',()=>window.location.reload());
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
      status('Impossible de charger la connexion Google. Vérifiez votre connexion Internet et réessayez.','error');
      return;
    }
    google.accounts.id.initialize({client_id:config.googleClientId,callback:onGoogleLogin,auto_select:false,ux_mode:'popup'});
    google.accounts.id.renderButton($('googleButton'),{type:'standard',shape:'pill',theme:'outline',size:'large',text:'signin_with'});
    status('Connectez-vous pour ouvrir votre espace.');
  });
})();
