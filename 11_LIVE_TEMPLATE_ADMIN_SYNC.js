/* St Augustine: grade-sheet online sync group selector repair.
   Does not modify result data, publication records or the designer layout. */
(()=>{'use strict';
 const $=s=>document.querySelector(s);
 const key=g=>'sa-result-template-draft-'+g+'-v1';
 const legacy='sa-result-template-draft-v3';
 const valid=t=>!!(t&&Array.isArray(t.objects)&&t.objects.length);
 let busy=false;
 function status(message,bad=false){let el=$('#saLiveTemplateStatus');if(el){el.textContent=message;el.style.color=bad?'#b91c1c':'#166534';}}
 function root(){return $('#saResultOverlay');}
 function selector(){return root()?.querySelector('#saLiveGroupChoice');}
 function currentGroup(){const r=root();const own=selector()?.value;const embedded=r?.querySelector('#saDesignerGroup')?.value;return ['lower','upper'].includes(embedded)?embedded:(['lower','upper'].includes(own)?own:'');}
 function client(){if(typeof umeAdminDb!=='function'||typeof studentAdminSession==='undefined'||!studentAdminSession?.access_token)throw Error('Admin login required');return umeAdminDb();}
 async function sync(g,template){
   if(busy)return;
   if(!['lower','upper'].includes(g)){status('Select a design group first',true);return;}
   if(!valid(template)){status('Current group has no valid saved layout. Export the original template first.',true);return;}
   busy=true;status('Uploading '+(g==='upper'?'Class 6–10':'Nursery–5')+' design…');
   try{
     const db=client();
     const {data:version,error}=await db.rpc('sa_result_live_template_save_v1',{p_template_group:g,p_template:template});
     if(error)throw error;
     const {data,error:readError}=await db.rpc('sa_result_live_template_read_v1',{});
     if(readError)throw readError;
     const record=Array.isArray(data)?data.find(x=>x.template_group===g):null;
     if(!record||!valid(record.template)||JSON.stringify(record.template)!==JSON.stringify(template)){
       // JSON may be normalized by PostgreSQL; comparison by content follows below.
       if(!record||!valid(record.template)||record.template.objects.length!==template.objects.length)
         throw Error('Online saved layout could not be verified.');
     }
     localStorage.setItem(key(g),JSON.stringify(template));
     localStorage.setItem('sa-grade-designer-active-group-v1',g);
     status('✓ Online saved & verified — '+(g==='upper'?'Class 6–10':'Nursery–5')+' (v'+(record.version||version)+')');
   }catch(e){status('✕ Sync failed: '+(e?.message||String(e)),true);console.error('Grade sheet online sync:',e);}
   finally{busy=false;}
 }
 function savedTemplate(g){let t=null;try{t=JSON.parse(localStorage.getItem(key(g))||'null');}catch{}return valid(t)?t:null;}
 function onRetry(){const g=currentGroup();if(!g){status('Select Nursery–5 or Class 6–10 first.',true);return;}
   let t=savedTemplate(g);
   if(!t){
     // Legacy draft is not group-specific. Require an explicit confirmation before binding it to a group.
     let legacyDoc=null;try{legacyDoc=JSON.parse(localStorage.getItem(legacy)||'null');}catch{}
     if(!valid(legacyDoc)){status('No saved template for this group. Use Save Draft or Import your backup JSON.',true);return;}
     if(!confirm('This design was saved without a group. Upload the CURRENT displayed draft to '+(g==='upper'?'Class 6–10':'Nursery–5')+'? Check the visible layout and Export Template before confirming.'))return;
     t=legacyDoc;
   }
   sync(g,t);
 }
 document.addEventListener('sa-grade-designer-saved',e=>{
   const d=e.detail||{}; const g=['lower','upper'].includes(d.group)?d.group:currentGroup();
   if(g&&valid(d.template))sync(g,d.template);
 });
 function attach(){const r=root();if(!r)return;const actions=r.querySelector('.sard-buttons');if(!actions||r.querySelector('#saLiveTemplateSync'))return;
   const label=document.createElement('label');label.id='saLiveGroupLabel';label.style.cssText='display:inline-flex;align-items:center;gap:6px;font-weight:700;color:#15436b;background:#fff;border:1px solid #cbd5e1;border-radius:8px;padding:5px 8px';label.textContent='Online Design Group ';
   const select=document.createElement('select');select.id='saLiveGroupChoice';select.style.cssText='font:inherit;padding:5px;border:1px solid #a7b7c9;border-radius:5px';
   select.innerHTML='<option value="">Choose group</option><option value="lower">Nursery–Class 5</option><option value="upper">Class 6–10</option>';
   const embedded=r.querySelector('#saDesignerGroup');
   const stored=localStorage.getItem('sa-grade-designer-active-group-v1');
   select.value=['lower','upper'].includes(embedded?.value)?embedded.value:(['lower','upper'].includes(stored)?stored:'');
   select.addEventListener('change',()=>{if(embedded){embedded.value=select.value;embedded.dispatchEvent(new Event('change',{bubbles:true}));}else if(['lower','upper'].includes(select.value)){localStorage.setItem('sa-grade-designer-active-group-v1',select.value);}status('Selected '+(select.value==='upper'?'Class 6–10':select.value==='lower'?'Nursery–5':'no group')+'. Save Draft first, then sync.');});
   label.appendChild(select);
   const btn=document.createElement('button');btn.type='button';btn.id='saLiveTemplateSync';btn.textContent='Retry Online Sync';btn.addEventListener('click',onRetry);
   const info=document.createElement('small');info.id='saLiveTemplateStatus';info.style.cssText='display:inline-block;font-weight:700;max-width:380px';info.textContent='Choose group; verify visible layout before syncing.';
   actions.append(label,btn,info);
 }
 const obs=new MutationObserver(attach);obs.observe(document.documentElement,{childList:true,subtree:true});attach();
})();
