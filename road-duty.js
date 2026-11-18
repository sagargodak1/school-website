/* ST. AUGUSTINE ROAD DUTY v10 — persistent event-driven rotation, English-only UI.
   All writes are validated by the rd_action Supabase RPC and RLS.
   Staff directory is merged with current Supabase staff records. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let context=null, busy=false, currentStaff=[],state={members:[],duties:[],delegates:[],rotation:[]};
function validStaffId(){
  if(typeof loggedInStaff==='undefined'||typeof staffAuthSession==='undefined'||!loggedInStaff?.username||!staffAuthSession?.access_token)return null;
  const user=String(loggedInStaff.username).trim().toLowerCase();
  return String(staffAuthSession.user?.email||'').toLowerCase()===`${user}@staff.staugustine.edu.np`?user:null;
}
function validAdmin(){
  return !!(typeof studentAdminSession!=='undefined'&&studentAdminSession?.access_token&&
    String(studentAdminSession.user?.email||'').toLowerCase()==='sagar.godak1@gmail.com');
}
function allowed(){return context==='admin'?validAdmin():context==='staff'&&!!validStaffId();}
function isAdminView(){return context==='admin'&&validAdmin();}
function manager(){return allowed()&&(isAdminView()||(context==='staff'&&state.delegates.some(d=>d.staff_id===validStaffId())));}
function dbClient(){return context==='admin'?(typeof studentSupabase!=='undefined'?studentSupabase:null):(typeof initStaffSupabase==='function'?initStaffSupabase():null);}
function notify(text,error=false){if($('rdMessage')){$('rdMessage').textContent=error?text:'';$('rdMessage').style.color=error?'#b91c1c':'#166534';}}
function label(status){return ({scheduled:'Scheduled',submitted:'Awaiting Verification',verified:'Verified',rejected:'Rejected — Resubmit Required',skipped:'Not Done — Closed'})[status]||status;}
function actionButton(text,action,data,cls=''){return `<button type="button" class="rd-btn ${cls}" data-rd-action="${escapeHTML(action)}" data-rd-data="${escapeHTML(JSON.stringify(data))}">${escapeHTML(text)}</button>`;}
// Unified school staff directory. Each person is offered once, using their
// current staff-login ID where known; never select a photo row ID as a login ID.
// Preserve IDs of already-selected members so an existing rotation is stable.
function staffRoster(){
 const normalizeName=value=>String(value||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleUpperCase('en');
 const byId=new Map();
 const add=(id,record,priority)=>{
   id=String(id||'').trim().toLowerCase();
   const name=String(record?.name||'').trim().replace(/\s+/g,' ');
   if(!id||!name)return;
   const next={id,name,designation:String(record?.designation||'Staff'),priority};
   const previous=byId.get(id);
   if(!previous||priority>previous.priority)byId.set(id,next);
 };
 // 1: New server-side staff entries; 2: administrative staff records;
 // 3: recognized staff-login usernames; 4: active/archived duty IDs.
 currentStaff.forEach(r=>add(r.staff_key||r.staffKey,r,1));
 if(typeof adminManagedStaff!=='undefined')Object.entries(adminManagedStaff||{}).forEach(([key,r])=>add(r.staffKey||key,r,2));
 if(typeof STAFF_LOGIN_DIRECTORY!=='undefined')Object.entries(STAFF_LOGIN_DIRECTORY).forEach(([id,r])=>add(id,r,3));
 state.members.forEach(r=>add(r.staff_id,{name:r.staff_name,designation:'Staff'},4));
 // Some older staff rows have a different database staff_key for the same login.
 // Prefer selected duty IDs, then recognized login usernames, then staff-table IDs.
 const uniqueNames=new Map();
 for(const entry of byId.values()){
   const key=normalizeName(entry.name);
   const prior=uniqueNames.get(key);
   if(!prior||entry.priority>prior.priority||(entry.priority===prior.priority&&entry.id<prior.id))uniqueNames.set(key,entry);
 }
 return [...uniqueNames.values()].sort((a,b)=>a.name.localeCompare(b.name));
}
async function getCurrentStaff(client){
 currentStaff=[];
 try{
   const {data,error}=await client.from('staff').select('staff_key,name,designation').order('name',{ascending:true}).limit(1000);
   if(error)throw error;
   if(Array.isArray(data))currentStaff=data;
 }catch(error){
   // Never claim the list is complete if row-level security hides staff records.
   const msg=$('rdMessage');
   if(msg){msg.textContent='Staff directory could not fully load. Check staff table permissions before assigning new staff.';msg.style.color='#b91c1c';}
 }
}
function mount(){
 if($('roadDutyPopup'))return $('roadDutyPopup');
 const tpl=$('rdSecureTemplate');if(!tpl)return null;
 const node=tpl.content.firstElementChild.cloneNode(true);document.body.appendChild(node);
 $('rdManage').hidden=true; $('rdAdminOnly').hidden=true;
 $('rdRefresh').addEventListener('click',()=>load(true));
 $('rdStartNow').addEventListener('click',()=>{if(manager()&&confirm('Start continuous Road Duty rotation now?'))perform('start',{});});
 return node;
}
async function read(table,client){const {data,error}=await client.from(table).select('*');if(error)throw error;return data||[];}
async function rpc(operation,data){const client=dbClient();if(!client)throw Error('Secure login is unavailable.');const {error}=await client.rpc('rd_action',{p_action:operation,p_data:data||{}});if(error)throw error;}
function render(){
 if(!allowed()){window.closeRoadDuty();return;}
 const ownId=context==='staff'?validStaffId():null;
 $('rdManage').hidden=true;$('rdAdminOnly').hidden=true;
 const openDuty=state.duties.filter(x=>['scheduled','submitted','rejected'].includes(x.status)).sort((a,b)=>Number(a.id)-Number(b.id))[0]||null;
 const participants=state.members.filter(m=>m.active).sort((a,b)=>a.sequence_no-b.sequence_no||a.staff_id.localeCompare(b.staff_id));
 const rotation=state.rotation[0]||{},round=Number(rotation.current_round||1);
 const selfAssigned=!!(openDuty&&ownId===openDuty.staff_id);
 const alert=$('rdDutyAlert');alert.hidden=!selfAssigned||!['scheduled','rejected'].includes(openDuty.status);
 if(!alert.hidden)$('rdDutyAlertDetail').textContent=openDuty.staff_name;
 $('rdOwnAction').innerHTML=selfAssigned&&['scheduled','rejected'].includes(openDuty.status)
  ?actionButton('Mark My Duty Completed','submit',{id:openDuty.id},'rd-self-submit')
  :selfAssigned&&openDuty.status==='submitted'?'<p class="rd-muted">Awaiting manager verification.</p>':'';
 const myIndex=participants.findIndex(x=>x.staff_id===ownId);
 const activeIndex=participants.findIndex(x=>x.staff_id===openDuty?.staff_id);
 const nextInfo=$('rdNextTurn');nextInfo.hidden=!(myIndex>=0&&activeIndex>=0);
 if(!nextInfo.hidden){const turns=(myIndex-activeIndex+participants.length)%participants.length;
  nextInfo.textContent=turns===0?'Your Road Duty is active.':`My next turn: ${turns} teacher turn${turns===1?'':'s'} away (not calendar days).`;
 }
 updateDashboardReminder(ownId,openDuty);
 $('rdRoster').innerHTML=participants.length?participants.map((m,i)=>{
  const records=state.duties.filter(d=>d.staff_id===m.staff_id);
  const verified=records.filter(d=>d.status==='verified').length;
  const latest=records.filter(d=>Number(d.round_no)===round).sort((a,b)=>Number(b.id)-Number(a.id))[0];
  const status=openDuty?.staff_id===m.staff_id?label(openDuty.status):latest?label(latest.status):'Upcoming';
  const cls=openDuty?.staff_id===m.staff_id?'rd-active-line':'';
  const nameClass=openDuty?.staff_id===m.staff_id?' class="rd-current-teacher-name"':'';
  return `<div class="rd-line ${cls}"><span><strong${nameClass}>${i+1}. ${escapeHTML(m.staff_name)}</strong>${ownId===m.staff_id?' <small>(You)</small>':''}</span><span>${escapeHTML(status)}${manager()?` · ${verified} Verified`:``}</span></div>`;
 }).join(''):'No participating teachers selected yet.';
 if(!manager())return;
 $('rdManage').hidden=false;$('rdAdminOnly').hidden=!isAdminView();
 $('rdStartBlock').hidden=!!rotation.started;
 const selected=new Set(participants.map(m=>m.staff_id));
 $('rdCandidates').innerHTML=staffRoster().map(s=>`<label class="rd-line"><span>${escapeHTML(s.name)} <small>(${escapeHTML(s.id)})</small></span><input type="checkbox" data-rd-member="${escapeHTML(s.id)}" ${selected.has(s.id)?'checked':''}></label>`).join('')||'No teacher records available.';
 $('rdOrder').innerHTML=participants.map((m,i)=>`<label class="rd-line"><span>${escapeHTML(m.staff_name)}</span><input class="rd-sequence-number" type="number" min="1" max="${participants.length}" step="1" value="${i+1}" aria-label="Sequence number for ${escapeHTML(m.staff_name)}" data-rd-position="${escapeHTML(m.staff_id)}"></label>`).join('')||'Select teachers to set their order.';
 $('rdActiveManage').innerHTML=openDuty&&['scheduled','rejected'].includes(openDuty.status)?`<div class="rd-line"><span>${escapeHTML(openDuty.staff_name)} · ${escapeHTML(label(openDuty.status))}</span>${actionButton('Mark Not Done / Skip','skip',{id:openDuty.id},'rd-red')}</div>`:'No duty awaiting resolution.';
 $('rdReviews').innerHTML=state.duties.filter(x=>x.status==='submitted').sort((a,b)=>Number(b.id)-Number(a.id)).map(x=>`<div class="rd-line"><span>${escapeHTML(x.staff_name)} · Awaiting Verification</span><span>${actionButton('Verify','review',{id:x.id,status:'verified'},'rd-green')}${actionButton('Reject','review',{id:x.id,status:'rejected'},'rd-red')}</span></div>`).join('')||'No pending submissions.';
 if(isAdminView())$('rdDelegates').innerHTML=staffRoster().map(s=>`<label class="rd-line"><span>${escapeHTML(s.name)}</span><input type="checkbox" data-rd-delegate="${escapeHTML(s.id)}" ${state.delegates.some(d=>d.staff_id===s.id)?'checked':''}></label>`).join('');
}
async function load(generate=false){
 if(!allowed())return;
 try{
  const client=dbClient();if(!client)throw Error('Please sign in again.');
  if(generate)await rpc('generate',{});
  const [members,duties,delegates,rotation]=await Promise.all(['rd_members','rd_duties','rd_delegates','rd_rotation'].map(t=>read(t,client)));
  if(!allowed())return;
  state={members,duties,delegates,rotation};
  if(manager())await getCurrentStaff(client);
  if(!allowed())return;
  render();notify('');
 }catch(error){if($('rdManage'))$('rdManage').hidden=true;if($('rdAdminOnly'))$('rdAdminOnly').hidden=true;notify(error?.message||String(error),true);}
}
async function perform(operation,data){
 if(busy||!allowed())return;busy=true;
 try{
  if(operation!=='submit'&&!manager())throw Error('Manager permission required.');
  if(operation==='review'&&data.status==='rejected'){
    const reason=prompt('Reason for rejection:');if(reason===null)return;
    data={...data,reason};
  }
  if(operation==='skip'){
    const reason=prompt('Reason for Not Done / Skip:');if(reason===null)return;
    if(reason.trim().length<3)throw Error('Please enter a reason (at least 3 characters).');
    data={...data,reason:reason.trim()};
  }
  await rpc(operation,data);await load(false);
 }catch(error){notify(error?.message||String(error),true);}
 finally{busy=false;}
}
window.openRoadDuty=async function(requested='staff'){
 const next=requested==='admin'?'admin':'staff';
 if(next==='admin'&&!validAdmin()){alert('Website Admin login is required.');return;}
 if(next==='staff'&&!validStaffId()){alert('Staff login is required.');return;}
 context=next;
 const modal=mount();if(!modal){alert('Road Duty interface is unavailable.');return;}
 modal.hidden=false;modal.classList.add('rd-open');document.body.style.overflow='hidden';
 await load(false);
 if(state.members.some(x=>x.active))await load(true);
};
window.closeRoadDuty=function(){const modal=$('roadDutyPopup');if(modal)modal.remove();context=null;document.body.style.overflow='auto';};
function updateDashboardReminder(id,openDuty){
 const button=$('staffDashboardRoadDutyAction');if(!button)return;
 const active=!!id&&!!openDuty&&openDuty.staff_id===id&&
   ['scheduled','rejected'].includes(openDuty.status);
 button.classList.toggle('rd-your-turn',active);
 const note=button.querySelector('.rd-duty-reminder');if(note)note.remove();
 if(active){
   const badge=document.createElement('span');badge.className='rd-duty-reminder';
   badge.textContent="YOUR TURN! DON'T FORGET.";
   button.querySelector('.staff-dashboard-action-copy')?.appendChild(badge);
 }
}
async function refreshPrivateReminder(){
 const id=validStaffId();if(!id){updateDashboardReminder(null,null);return;}
 try{
   const client=typeof initStaffSupabase==='function'?initStaffSupabase():null;if(!client)return;
   const {data,error}=await client.from('rd_duties').select('id,staff_id,status').in('status',['scheduled','submitted','rejected']).order('id',{ascending:true}).limit(1);
   if(!validStaffId()||error)return;
   updateDashboardReminder(id,data?.[0]||null);
 }catch(_){}
}
window.rdSyncLoginUI=function(){
 const button=$('staffDashboardRoadDutyAction');if(button)button.hidden=!validStaffId();
 if(context&&!allowed())window.closeRoadDuty();
 if(validStaffId())refreshPrivateReminder();else updateDashboardReminder(null,null);
};
document.addEventListener('click',event=>{
 const b=event.target.closest('[data-rd-action]');if(!b||!$('roadDutyPopup')?.contains(b))return;
 try{perform(b.dataset.rdAction,JSON.parse(b.dataset.rdData||'{}'));}catch(_){notify('Invalid action.',true);}
});
document.addEventListener('change',event=>{
 const e=event.target;if(!$('roadDutyPopup')?.contains(e))return;
 if(e.matches('[data-rd-member]')&&manager()){
  const staff=staffRoster().find(s=>s.id===e.dataset.rdMember);
  if(staff)perform('member',{staff_id:staff.id,staff_name:staff.name,active:e.checked});
 }else if(e.matches('[data-rd-position]')&&manager())perform('position',{staff_id:e.dataset.rdPosition,position:Number(e.value)});
 else if(e.matches('[data-rd-delegate]')&&isAdminView())perform('delegate',{staff_id:e.dataset.rdDelegate,enabled:e.checked});
});
document.addEventListener('DOMContentLoaded',()=>{const button=$('staffDashboardRoadDutyAction');if(button)button.hidden=true;});
(function(){
 const old=window.updateStaffLoginUI;
 if(typeof old==='function')window.updateStaffLoginUI=function(...args){const value=old.apply(this,args);window.rdSyncLoginUI();return value;};
 const oldDashboard=window.openStaffDashboard;
 if(typeof oldDashboard==='function')window.openStaffDashboard=async function(...args){
   const result=await oldDashboard.apply(this,args);await refreshPrivateReminder();return result;
 };
 const oldAdmin=window.setStudentAdminUI;
 if(typeof oldAdmin==='function')window.setStudentAdminUI=function(...args){const value=oldAdmin.apply(this,args);window.rdSyncLoginUI();return value;};
})();
})();
