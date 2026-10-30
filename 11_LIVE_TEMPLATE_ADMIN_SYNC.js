/* Isolated Admin-only template sync; NO result/marks writes. */
(()=>{'use strict';
 const KEY='sa-result-template-draft-v3';
 const $=s=>document.querySelector(s);
 const group=()=>{
   const value=String($('#sardDashClass')?.value || $('#sardPreviewClass')?.value || '').trim().toLowerCase();
   if(/^(nursery|lkg|ukg|class\s*[1-5]|[1-5])$/.test(value))return 'lower';
   if(/^(class\s*(?:[6-9]|10)|(?:[6-9]|10))$/.test(value))return 'upper';
   return null;
 };
 const getDb=()=>{
   if(typeof studentAdminSession==='undefined'||!studentAdminSession?.access_token||typeof umeAdminDb!=='function')throw Error('Login as Student Admin first.');
   return umeAdminDb();
 };
 let busy=false;
 async function sync(){
   if(busy)return;
   const slot=group();
   if(!slot){alert('Select a class (Nursery to Class 10) in Result Management or Designer Preview before syncing.');return;}
   let tpl;
   try{tpl=JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){alert('Cannot read saved layout: '+e.message);return;}
   if(!tpl||!Array.isArray(tpl.objects)||!tpl.objects.length){alert('Save Grade Sheet Designer first.');return;}
   busy=true;
   try{
     const {data,error}=await getDb().rpc('sa_result_live_template_save_v1',{p_template_group:slot,p_template:tpl});
     if(error)throw error;
     console.info('Live grade-sheet template synced:',slot,'version',data);
     const el=$('#saLiveTemplateStatus');if(el)el.textContent='✓ Latest '+(slot==='lower'?'Nursery–5':'6–10')+' design synced (v'+data+'). Staff/Principal see it next time they open Results.';
   }catch(e){
     console.error('Live design sync unsuccessful:',e);
     alert('Design saved locally, but online sync failed: '+e.message+'\nPlease use Sync Current Design after connection is fixed.');
   }finally{busy=false;}
 }
 // Designer save commits to localStorage in its own click listener; document bubble runs afterwards.
 document.addEventListener('click',event=>{
   if(event.target.closest('#sardSave'))queueMicrotask(sync);
   if(event.target.closest('#saLiveTemplateSync'))sync();
 });
 function attach(){
   const actions=$('#saResultOverlay .sard-buttons');
   if(actions&&!$('#saLiveTemplateSync')){
     const b=document.createElement('button');b.id='saLiveTemplateSync';b.type='button';b.textContent='Sync Current Design';b.title='Sync the last saved designer layout for the chosen class group';
     actions.appendChild(b);
     const status=document.createElement('small');status.id='saLiveTemplateStatus';status.style.cssText='display:block;color:#176b48;max-width:420px';actions.appendChild(status);
   }
 }
 new MutationObserver(attach).observe(document.documentElement,{subtree:true,childList:true});attach();
})();
