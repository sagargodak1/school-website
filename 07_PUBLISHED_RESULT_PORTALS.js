/* St Augustine — Published result access. Only server-validated read RPCs.
 * No publication, marks, attendance or login modifications.
 */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cls=['Nursery','LKG','UKG',...Array.from({length:10},(_,i)=>'Class '+(i+1))];
async function rpc(db,name,args){if(!db)throw Error('Supabase connection is unavailable');const {data,error}=await db.rpc(name,args);if(error)throw Error(error.message);return data||[]}
function overlay(title){$('#saResultPortalView')?.remove();const host=document.createElement('div');host.id='saResultPortalView';host.style.cssText='position:fixed;inset:0;z-index:2147483600;background:#102b44b5;overflow:auto;padding:15px;font:14px Arial,sans-serif;color:#1c3047';host.innerHTML='<section style="max-width:1000px;margin:15px auto;background:#fff;border-radius:12px;padding:20px;box-shadow:0 10px 40px #0003"><header style="display:flex;align-items:center;justify-content:space-between;gap:12px"><h2 style="margin:0">'+esc(title)+'</h2><button id="saRPclose" type="button">Close</button></header><div id="saRPbody" style="padding-top:14px">Loading…</div></section>';document.body.appendChild(host);$('#saRPclose',host).onclick=()=>host.remove();return $('#saRPbody',host)}
function marksTable(subjects){if(!Array.isArray(subjects)||!subjects.length)return '<p>No subject grade in the published snapshot.</p>';return '<table style="border-collapse:collapse;width:100%"><thead><tr><th>Subject</th><th>Final Grade</th></tr></thead><tbody>'+subjects.map(s=>'<tr><td style="border:1px solid #ccc;padding:7px">'+esc(s.subject||s.name||'')+'</td><td style="border:1px solid #ccc;padding:7px">'+esc(s.final||s.grade||'—')+'</td></tr>').join('')+'</tbody></table>'}
function studentCard(st,p){const att=st.attendance||{};return '<article style="padding:14px;border:1px solid #ddd;border-radius:9px;margin:12px 0;background:#fff"><h3 style="margin-top:0">'+esc(st.name||st.id)+'</h3><p>Student ID: '+esc(st.id)+' · '+esc(p.className)+' · '+esc(p.academicYear)+' · '+esc(p.term)+'</p>'+marksTable(st.subjects)+'<p><b>GPA: '+esc(st.gpa??'—')+'</b>　 Attendance: '+esc(att.present??'—')+'/'+esc(att.opening??'—')+' ('+esc(att.percentage??'—')+')</p><p>Prepared By: '+esc(p.teacher||'—')+'　 Date of Issue: '+esc(p.dateOfIssue||'—')+'</p></article>'}
// Uses the same 718 x 1019 canvas and object metrics as Grade Sheet Designer.
// Only transforms the already-published snapshot for display. No writes.
function sheetMarkup(st,p){
 const template=p.template;
 if(!template||!Array.isArray(template.objects)||!Array.isArray(st.gradeRows))return '<div class="sa-rp-unavailable">The published Grade Sheet Design is unavailable.</div>';
 const vals={StudentName:st.name||'',ClassName:p.className||'',RollNo:st.roll??'—',SymbolNo:st.id||'',IEMIS_ID:st.iemis||'—',AcademicYear:p.academicYear||'',TermName:p.term||'',TeacherName:p.teacher||'',PublishedBS:p.dateOfIssue||'',GPA:st.gpa??'—',OpeningDays:st.attendance?.opening??'—',PresentDays:st.attendance?.present??'—',AttendancePercentage:st.attendance?.percentage??'—'};
 const num=(v,def,lo,hi)=>Math.max(lo,Math.min(hi,Number.isFinite(Number(v))?Number(v):def));
 const color=v=>/^#[0-9a-f]{6}$/i.test(v||'')?v:'#203047';
 const style=o=>{
  const f=['Arial','Calibri','Georgia','Verdana','Times New Roman'].includes(o.font)?o.font:'Arial';
  return `left:${num(o.x,0,0,708)}px;top:${num(o.y,0,0,1009)}px;width:${num(o.w,60,10,718)}px;height:${num(o.h,20,12,1019)}px;font-size:${num(o.size,12,8,40)}px;font-family:'${f}';font-weight:${o.bold?'700':'400'};font-style:${o.italic?'italic':'normal'};text-decoration:${o.underline?'underline':'none'};color:${color(o.color)};text-align:${['center','right'].includes(o.align)?o.align:'left'};background:${o.transparent===false?color(o.bg||'#ffffff'):'transparent'};`;
 };
 const gradeTable=o=>{
  const sw=num(o.subjectWidth,38,20,58),h=num(o.rowHeight,22,16,55);
  return `<table class="sa-rp-grade-table" style="--sa-rp-row:${h}px"><colgroup><col style="width:6%"><col style="width:${sw}%"><col style="width:${(94-sw)*.23}%"><col style="width:${(94-sw)*.23}%"><col style="width:${(94-sw)*.24}%"><col style="width:${(94-sw)*.30}%"></colgroup><thead><tr><th>S.N.</th><th>SUBJECT</th><th>CREDIT HOUR</th><th>GRADE POINT</th><th>GRADE</th><th>FINAL GRADE</th></tr></thead><tbody>`+
   st.gradeRows.map((r,i)=>`<tr><td rowspan="2">${i+1}</td><td class="sa-rp-subject">${esc(r.subject)} (IN)</td><td>${esc(r.inCH??'—')}</td><td>${esc(r.inGP??'—')}</td><td>${esc(r.inGrade??'—')}</td><td rowspan="2"><b>${esc(r.final??'—')}</b></td></tr><tr><td class="sa-rp-subject">${esc(r.subject)} (TH)</td><td>${esc(r.thCH??'—')}</td><td>${esc(r.thGP??'—')}</td><td>${esc(r.thGrade??'—')}</td></tr>`).join('')+
   `<tr class="sa-rp-gpa"><td colspan="5"><strong>GRADE POINT AVERAGE (GPA)</strong></td><td><strong>${esc(st.gpa??'—')}</strong></td></tr></tbody></table>`;
 };
 const objMarkup=o=>{
  let inside='';
  if(o.type==='table')inside=gradeTable(o);
  else if(o.type==='attendance'){
   const names=String(o.text||'TOTAL SCHOOL OPENING DAYS|TOTAL PRESENT DAYS|PRESENT PERCENTAGE').split('|');
   inside='<div class="sa-rp-att">'+[vals.OpeningDays,vals.PresentDays,vals.AttendancePercentage].map((v,i)=>`<div><span>${esc(names[i]||'')}</span><strong>${esc(v)}</strong></div>`).join('')+'</div>';
  }else if(o.type==='legend'){
   const names=String(o.text||'').split('|');inside='<div class="sa-rp-legend">'+[0,1].map(i=>`<span>${esc(names[i]||'').replace(/\n/g,'<br>')}</span>`).join('')+'</div>';
  }else if(o.type==='logo'&&/^data:image\/(png|jpeg|webp);base64,/.test(o.src||''))inside='<img style="display:block;width:100%;height:100%;object-fit:contain" src="'+o.src+'">';
  else if(o.type==='field')inside=esc(vals[o.text]??'—');
  else if(o.type==='box')inside='';
  else if(o.type!=='line')inside=esc(o.text||'');
  const border=o.type==='box'?`border:${num(o.borderWidth,2,1,8)}px solid ${color(o.color)};`:o.type==='line'?`border-top:${num(o.borderWidth,2,1,8)}px solid ${color(o.color)};`:'';
  return `<div class="sa-rp-object sa-rp-${esc(o.type)}" style="${style(o)}${border}">${inside}</div>`;
 };
 const watermark=cfg=>{
  if(!cfg?.enabled||!String(cfg.text||'').trim())return '';
  const caption=String(cfg.text).replace(/\s+/g,' ').trim().slice(0,180);
  const sz=num(cfg.size,10,8,60),gap=num(cfg.spacing,8,0,100),angle=num(cfg.angle,0,-90,90),opacity=num(cfg.opacity,.22,.01,.7);
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');let width=caption.length*sz*.56;
  if(ctx){ctx.font=`${sz}px Arial`;width=ctx.measureText(caption).width;}
  const tw=Math.max(1,Math.ceil(width+Math.max(6,sz*.65))),th=Math.max(sz+3,Math.ceil(sz+gap));
  const id='saRpWm'+Math.random().toString(36).slice(2);
  return `<svg class="sa-rp-watermark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 718 1019" preserveAspectRatio="none"><defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="${tw}" height="${th}" ${angle?`patternTransform="rotate(${angle})"`:''}><text x="0" y="${sz+1}" font-family="Arial,sans-serif" font-size="${sz}" fill="${color(cfg.color||'#9a9a9a')}" opacity="${opacity}">${esc(caption)}</text></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`;
 };
 // Some saved templates include two identical TERM ASSESSMENT labels.
 // Suppress only identical duplicates in the published view, never mutate stored design.
 const seenTerm=new Set();
 const objects=template.objects.filter(o=>{
  if(o.type!=='text'||!/^term\s+assessment$/i.test(String(o.text||'').trim().replace(/\s+/g,' ')))return true;
  const key=String(o.text).trim().toLowerCase().replace(/\s+/g,' ');
  if(seenTerm.has(key))return false;
  seenTerm.add(key);return true;
 });
 return `<div class="sa-rp-paper">${watermark(template.watermark)}${objects.map(objMarkup).join('')}</div>`;
}
function sheetsCSS(){return `
.sa-rp-paper,.sa-rp-paper *{box-sizing:border-box}
.sa-rp-paper{position:relative;width:718px;height:1019px;overflow:hidden;background:#fff;flex:none;color:#203047;font-family:Arial,sans-serif}
.sa-rp-object{position:absolute;z-index:1;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.25;overflow:visible;border:1px solid transparent}
.sa-rp-object.sa-rp-table{z-index:2}
.sa-rp-watermark{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
.sa-rp-grade-table{border-collapse:collapse;table-layout:fixed;width:100%;height:auto;font-size:inherit;line-height:1.08;color:inherit;text-align:center}
.sa-rp-grade-table th,.sa-rp-grade-table td{border:1px solid #22344b;padding:2px 3px;background:transparent;overflow-wrap:normal}
.sa-rp-grade-table td:first-child{text-align:left}
.sa-rp-grade-table .sa-rp-subject{text-align:left}
.sa-rp-grade-table th{font-size:.86em}
.sa-rp-grade-table tbody tr:not(.sa-rp-gpa){height:var(--sa-rp-row)}
.sa-rp-grade-table .sa-rp-gpa{height:34px}
.sa-rp-grade-table .sa-rp-gpa td{height:34px;padding:4px 6px}
.sa-rp-att{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));height:100%;align-items:center;text-align:center;gap:5px}
.sa-rp-att>div{display:flex;flex-direction:column;gap:10px}
.sa-rp-att span{font-size:.85em}.sa-rp-att strong{font-size:1.15em}
.sa-rp-legend{display:grid;grid-template-columns:1fr 1fr;gap:15px;height:100%;line-height:1.45;align-items:center;border:1px solid #31435b;padding:8px}
.sa-rp-unavailable{padding:20px;border:1px solid #d9a85e;background:#fff6df;color:#503b18}
@page{size:A4 portrait;margin:0}
@media print{
 html,body{margin:0!important;padding:0!important;width:210mm!important;height:auto!important;overflow:visible!important}
 .sa-rp-paper{width:718px;height:1019px;transform:scale(1.105);transform-origin:top left;margin:0!important;break-after:page;page-break-after:always;-webkit-print-color-adjust:exact;print-color-adjust:exact}
 .sa-rp-paper:last-child{break-after:auto;page-break-after:auto}
 .sa-rp-watermark{display:block!important;visibility:visible!important}
}`}
function viewSheet(st,p){const markup=sheetMarkup(st,p);const host=document.createElement('div');host.style.cssText='position:fixed;inset:0;z-index:2147483610;background:#142a43cc;overflow:auto;padding:12px';host.innerHTML='<div style="max-width:790px;margin:auto;background:#fff;padding:12px;border-radius:12px"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px"><strong>'+esc(st.name)+'</strong><span><button id="saRpOnePrint">Print / Save PDF</button> <button id="saRpOneClose">Close</button></span></div><div class="sa-rp-mobile-wrap">'+markup+'</div></div>';document.body.appendChild(host);const mobile=document.createElement('style');mobile.textContent=sheetsCSS()+`.sa-rp-mobile-wrap{width:100%;overflow:auto;display:flex;justify-content:center}.sa-rp-mobile-wrap>.sa-rp-paper{transform-origin:top center;zoom:var(--sa-rp-zoom,1)}@media(max-width:770px){.sa-rp-mobile-wrap{justify-content:flex-start}}`;host.appendChild(mobile);function resize(){const width=host.querySelector('.sa-rp-mobile-wrap').clientWidth;host.style.setProperty('--sa-rp-zoom',String(Math.min(1,width/718)))}resize();window.addEventListener('resize',resize);const close=()=>{window.removeEventListener('resize',resize);host.remove()};host.querySelector('#saRpOneClose').onclick=close;host.querySelector('#saRpOnePrint').onclick=()=>printPages([{st,p}])}
function printPages(items){
 if(!items.length){alert('Select at least one student.');return}
 if(items.some(({p,st})=>!p.template||!st.gradeRows)){alert('Official grade-sheet design is not synced for this class. Ask Admin to re-publish and sync.');return}
 const html=items.map(({st,p})=>sheetMarkup(st,p)).join('');const win=window.open('','_blank');if(!win){alert('Allow the print popup.');return}
 win.document.open();win.document.write('<!doctype html><html><head><meta charset="utf-8"><title>St Augustine Grade Sheets</title><style>'+sheetsCSS()+'</style></head><body>'+html+'</body></html>');win.document.close();setTimeout(()=>{try{win.focus();win.print()}catch(e){alert(e.message)}},350);
}
async function staff(){
 const body=overlay('Published Results');
 try{
  if(typeof umeStaffDb!=='function')throw Error('Staff login is required');
  const rows=await rpc(umeStaffDb(),'sa_result_staff_read_v1',{});
  if(!Array.isArray(rows)||!rows.length){body.textContent='No published results available for your assigned classes.';return}
  const selections=new Map();
  body.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"><button type="button" id="saRPall">Select All</button><button type="button" id="saRPclear">Clear Selection</button><button type="button" id="saRPprint">Print / Save PDF — Selected</button></div><div id="saRPclasses"></div><div id="saRPpreview"></div>';
  const host=$('#saRPclasses',body);
  rows.forEach((p,pi)=>{
   const section=document.createElement('section');section.style.cssText='margin:14px 0;border:1px solid #cbd5e1;border-radius:10px;padding:12px';
   section.innerHTML=`<h3 style="margin:0 0 8px">${esc(p.className)} · ${esc(p.academicYear)} · ${esc(p.term)}</h3><p>${(p.students||[]).length} students</p><div style="overflow:auto"><table style="border-collapse:collapse;width:100%"><thead><tr><th style="text-align:left;padding:8px">Tick</th><th style="text-align:left;padding:8px">Roll</th><th style="text-align:left;padding:8px">Student</th><th style="text-align:left;padding:8px">Symbol No.</th><th style="text-align:left;padding:8px">GPA</th><th style="text-align:left;padding:8px">View</th></tr></thead><tbody>${(p.students||[]).map((st,si)=>`<tr><td style="border-top:1px solid #ddd;padding:8px"><input type="checkbox" data-student="${pi}:${si}" aria-label="Select ${esc(st.name||st.id)}"></td><td style="border-top:1px solid #ddd;padding:8px">${esc(st.roll??'—')}</td><td style="border-top:1px solid #ddd;padding:8px">${esc(st.name||st.id)}</td><td style="border-top:1px solid #ddd;padding:8px">${esc(st.id)}</td><td style="border-top:1px solid #ddd;padding:8px">${esc(st.gpa??'—')}</td><td style="border-top:1px solid #ddd;padding:8px"><button type="button" data-view="${pi}:${si}">View</button></td></tr>`).join('')}</tbody></table></div>`;
   host.appendChild(section);
  });
  const chosen=()=>[...body.querySelectorAll('input[data-student]:checked')].map(el=>{const [pi,si]=el.dataset.student.split(':').map(Number);return {p:rows[pi],st:rows[pi].students[si]}});
  $('#saRPall',body).onclick=()=>body.querySelectorAll('input[data-student]').forEach(el=>el.checked=true);
  $('#saRPclear',body).onclick=()=>body.querySelectorAll('input[data-student]').forEach(el=>el.checked=false);
  $('#saRPprint',body).onclick=()=>printPages(chosen());
  host.addEventListener('click',e=>{const btn=e.target.closest('[data-view]');if(!btn)return;const [pi,si]=btn.dataset.view.split(':').map(Number);const p=rows[pi],st=p.students[si];const preview=$('#saRPpreview',body);viewSheet(st,p)});
 }catch(e){body.textContent='Could not open published results: '+e.message}
}
async function parent(){const body=overlay('My Published Result');try{const token=sessionStorage.getItem('saaf_parent_portal_token');if(!token)throw Error('Parent login is required');if(typeof initStudentSupabase!=='function')throw Error('Parent portal connection unavailable');const rows=await rpc(initStudentSupabase(),'sa_result_parent_read_v1',{p_token:token});if(!rows.length){body.textContent='Your result has not been published.';return}const content=document.createElement('div');body.innerHTML='<div><button id="saRPprint" type="button">Print / Save PDF</button></div>';body.appendChild(content);rows.forEach(p=>{const b=document.createElement('button');b.type='button';b.textContent='View Grade Sheet — '+String(p.student?.name||'Student');b.onclick=()=>viewSheet(p.student,p);content.appendChild(b)});$('#saRPprint',body).onclick=()=>printPages(rows.map(p=>({p,st:p.student})))}catch(e){body.textContent='Could not open your result: '+e.message}}
function attach(){const quick=$('#staffDashboardPopup .staff-dashboard-quick-actions');if(quick){const existing=$('#saStaffResultAction',quick);const added=$('#saRPstaffBtn',quick);if(existing){if(existing.onclick!==staff)existing.onclick=staff;if(added)added.remove()}else if(added){if(added.onclick!==staff)added.onclick=staff}else{const b=document.createElement('button');b.id='saRPstaffBtn';b.type='button';b.className='staff-dashboard-action';b.innerHTML='<span class="staff-dashboard-action-icon">📄</span><span class="staff-dashboard-action-copy"><strong>RESULT</strong><small>Published grade sheets</small></span>';b.onclick=staff;quick.appendChild(b)}}const parentPanel=$('#parentPortalPopup');if(parentPanel&&!$('#saRPparentBtn',parentPanel)){const b=document.createElement('button');b.id='saRPparentBtn';b.type='button';b.textContent='📄 MY PUBLISHED RESULT';b.style.cssText='margin:10px;padding:10px 16px;border-radius:8px;cursor:pointer';b.onclick=parent;const host=$('#parentPortalHero',parentPanel)||parentPanel;host.after(b)}}
new MutationObserver(attach).observe(document.documentElement,{childList:true,subtree:true});attach();
})();
