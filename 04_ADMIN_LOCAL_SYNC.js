/* St Augustine Result Management local publication sync; Admin-only RPC.
 * This module is intentionally opt-in: it does not auto-publish or alter marks.
 * Load after result-grade-designer.js. Uses existing school Admin Supabase login.
 */
(function(){
 'use strict';
 const STORE='sa-result-local-publication-v1';
 const read=()=>{try{return Object.values(JSON.parse(localStorage.getItem(STORE)||'{}')).filter(x=>x&&x.academicYear&&x.className&&Array.isArray(x.students))}catch{return []}};
 const db=()=>{if(typeof studentAdminSession==='undefined'||!studentAdminSession?.access_token)throw Error('Log in as Student Admin first.');if(typeof umeAdminDb!=='function')throw Error('Admin Supabase connection unavailable.');return umeAdminDb()};
 async function run(name,args){const {data,error}=await db().rpc(name,args);if(error)throw Error(error.message);return data}
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function show(){
  document.getElementById('saResultDbSync')?.remove();
  const panel=document.createElement('div');panel.id='saResultDbSync';
  panel.style.cssText='position:fixed;inset:0;background:#001b35a8;z-index:2147483550;padding:3vh 12px;overflow:auto;font:14px Arial';
  panel.innerHTML='<div style="max-width:860px;margin:auto;background:white;border-radius:13px;padding:24px"><h2>Result Publication — Supabase Admin Sync</h2><p>Choose the locally published Class(es) to upload as immutable result snapshots.</p><div id="saResultSyncRows"></div><div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:16px"><button id="saResultSyncPublish">Publish Selected</button><button id="saResultSyncUnpublish">Unpublish Selected</button><button id="saResultSyncCheck">Check Database</button><button id="saResultSyncClose">Close</button></div><pre id="saResultSyncMsg" style="white-space:pre-wrap"></pre></div>';
  document.body.appendChild(panel);
  const $=id=>panel.querySelector('#'+id), rows=read();
  $('saResultSyncRows').innerHTML=rows.length?rows.map((p,i)=>`<label style="display:block;padding:9px;border-bottom:1px solid #ddd"><input type="checkbox" value="${i}"> ${esc(p.academicYear)} · ${esc(p.className)} · ${esc(p.term)} (${p.students.length} students)</label>`).join(''):'No local published snapshots. Publish Class locally first.';
  $('saResultSyncClose').onclick=()=>panel.remove();
  const selected=()=>[...panel.querySelectorAll('#saResultSyncRows input:checked')].map(x=>rows[Number(x.value)]);
  const log=x=>$('saResultSyncMsg').textContent=x;
  async function action(publish){const pick=selected();if(!pick.length){log('Tick at least one Class.');return}if(!confirm(`${publish?'Publish':'Unpublish'} ${pick.length} selected Class(es) in Supabase?`))return;
   const errs=[],done=[];for(const p of pick){try{if(publish){await run('sa_result_admin_upsert_v1',{p_academic_year:p.academicYear,p_term_key:String(p.term).toLowerCase(),p_class_name:p.className,p_payload:p,p_is_published:true})}else{await run('sa_result_admin_unpublish_v1',{p_academic_year:p.academicYear,p_term_key:String(p.term).toLowerCase(),p_class_name:p.className})}done.push(p.className)}catch(e){errs.push(`${p.className}: ${e.message}`)}}log('Completed: '+(done.join(', ')||'none')+'\n'+errs.join('\n'));
  }
  $('saResultSyncPublish').onclick=()=>action(true);
  $('saResultSyncUnpublish').onclick=()=>action(false);
  $('saResultSyncCheck').onclick=async()=>{try{const data=await run('sa_result_admin_list_v1',{});log(JSON.stringify(data,null,2))}catch(e){log(e.message)}};
 }
 window.saOpenResultDbSync=show;
 // Admin can open from Result Management using this standalone control; no existing button is hijacked.
 function attach(){if(document.getElementById('saResultDbSyncAction'))return;const target=document.querySelector('#sardDashStatus');if(!target)return;const b=document.createElement('button');b.type='button';b.id='saResultDbSyncAction';b.textContent='Supabase Publication Sync';b.style.cssText='margin-left:10px;padding:8px 12px;border-radius:8px;cursor:pointer';b.onclick=show;target.after(b)}
 new MutationObserver(attach).observe(document.body,{childList:true,subtree:true});attach();
})();
