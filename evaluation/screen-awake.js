/* Maintient l'écran éveillé uniquement pendant une tentative visible. */
(()=>{
  'use strict';

  let active=false;
  let sentinel=null;
  let requesting=false;
  let generation=0;
  let blocked=false;

  function release(){
    const previous=sentinel;
    sentinel=null;
    if(previous&&!previous.released){
      Promise.resolve(previous.release()).catch(()=>{});
    }
  }

  async function acquire(){
    if(!active||document.visibilityState==='hidden'||requesting||blocked||(sentinel&&!sentinel.released))return;
    if(!navigator.wakeLock||typeof navigator.wakeLock.request!=='function'){
      blocked=true;
      return;
    }
    requesting=true;
    const version=generation;
    try{
      const acquired=await navigator.wakeLock.request('screen');
      if(!active||version!==generation||document.visibilityState==='hidden'){
        await acquired.release();
        return;
      }
      sentinel=acquired;
      acquired.addEventListener('release',()=>{
        if(sentinel===acquired)sentinel=null;
      });
    }catch(error){
      blocked=true; // Mode économie d'énergie, politique du navigateur, etc.
      console.warn('Maintien de l’écran indisponible sur cet appareil :',error);
    }finally{
      requesting=false;
      // Une autre tentative peut avoir commencé durant une demande précédente.
      if(active&&document.visibilityState!=='hidden'&&!blocked&&!sentinel)void acquire();
    }
  }

  function start(){
    if(!active){
      active=true;
      generation++;
      blocked=false;
    }
    void acquire();
  }

  function stop(){
    if(active){
      active=false;
      generation++;
    }
    release();
  }

  function resume(){
    if(!active)return;
    blocked=false;
    void acquire();
  }

  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='hidden')release();
    else resume();
  });
  window.addEventListener('pageshow',resume);
  window.addEventListener('focus',resume);
  window.addEventListener('pagehide',release);

  window.COURSE_SCREEN_AWAKE=Object.freeze({start,stop});
})();
