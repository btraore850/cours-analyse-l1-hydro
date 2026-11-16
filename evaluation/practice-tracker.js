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
  function rpc(action,payload={}){
    if(!credential)return Promise.reject(new Error('Connectez-vous avec Google avant de commencer.'));
    return awaitBridge().then(()=>new Promise((resolve,reject)=>{
      const requestId='practice-'+(++nextRequest).toString(36);
      const timer=setTimeout(()=>{waiting.delete(requestId);reject(new Error('Délai dépassé : enregistrement non confirmé.'));},25000);
      waiting.set(requestId,{resolve,reject,timer});
      bridgeWindow.postMessage({kind:'hydro-practice-request',nonce,requestId,action,token:credential,payload},bridgeOrigin);
    }));
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
    if(!result||typeof result.credential!=='string'){status('La connexion Google a échoué. Réessayez.',true);return;}
    credential=result.credential;
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
    }
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
