/* ST AUGUSTINE | Exam multi-subject safe additive overlay | 2026-11-22
 * Loaded AFTER question-submission and exam-marks-progress.
 * Preserves existing exam entry IDs, question statuses and uploaded papers.
 */
(function(){
'use strict';
if(typeof examEntryFor!=='function'||typeof examRenderRoutine!=='function'){
  console.warn('Multi-subject exam overlay: Exam Management not available.');return;
}
const byCell=(dayId,cls)=>(examEntries||[]).filter(r=>String(r.day_id)===String(dayId)&&r.class_name===cls).sort((a,b)=>Number(a.id)-Number(b.id));
window.examEntriesFor=byCell;
function isThirdTerm(){
  const s=String(examCurrentPeriod?.term_name||'').trim().toLowerCase();
  return /\b(third|3rd)\b/.test(s);
}
function protectedHistory(e){
  const st=(examStatuses||[]).find(s=>Number(s.entry_id)===Number(e.id));
  return !!(st&&(st.submitted||st.printed||st.marks_submitted||st.marks_source_project_id));
}

function slotHtml(e={},key='',editable=false){
 if(!editable){return `<div class="exam-multi-slot"><strong>${examEscape(e.activity_title||'—')}</strong>${e.teacher_name?`<span class="exam-teacher">${examEscape(e.teacher_name)}</span>`:''}</div>`;}
 return `<div class="exam-multi-entry" data-entry-id="${Number(e.id)||''}"><div class="exam-cell-editor"><input class="exam-multi-subject" type="text" list="examSubjectSuggestions" maxlength="80" placeholder="Subject / Activity" value="${examEscape(e.activity_title||'')}"><input class="exam-multi-teacher" type="text" list="examTeacherSuggestions" maxlength="120" placeholder="Teacher Name" value="${examEscape(e.teacher_name||'')}"></div>${!e.id?'<button type="button" class="exam-multi-remove" onclick="examMultiRemove(this)">Remove new</button>':isThirdTerm()?'<button type="button" class="exam-multi-remove" onclick="examMultiRemove(this)">Remove test entry</button>':''}</div>`;
}
window.examMultiAdd=function(button){
 const cell=button.closest('.exam-multi-cell');if(!cell)return;
 cell.querySelector('.exam-multi-list').insertAdjacentHTML('beforeend',slotHtml({},'',true));
};
window.examMultiRemove=function(button){
 const row=button.closest('.exam-multi-entry');if(!row)return;
 const entryId=Number(row.dataset.entryId)||null;
 if(entryId){
   if(!isThirdTerm()){examMessage('Saved entries may only be removed in Third Term.');return;}
   const old=(examEntries||[]).find(x=>Number(x.id)===entryId);
   if(!old){examMessage('Saved entry not found. Reload and try again.');return;}
   if(protectedHistory(old)){examMessage('This entry has tracked Question/Marks history and cannot be removed.');return;}
   if(!confirm('Remove this Third Term entry? Save Routine is required to apply this change. If it has stored Question/Marks history, the database will block removal.'))return;
 }
 row.remove();
};
examEntryFor=function(dayId,cls){return byCell(dayId,cls)[0]||null;};
examRoutineCellHtml=function(day,cls,rowIndex){
 const entries=byCell(day.id,cls);
 if(!examEditMode)return `<td><div class="exam-view-cell">${entries.length?entries.map(e=>slotHtml(e)).join(''):'<span class="exam-special">—</span>'}</div></td>`;
 return `<td><div class="exam-multi-cell"><div class="exam-multi-list">${entries.length?entries.map(e=>slotHtml(e,'',true)).join(''):slotHtml({},'',true)}</div><button type="button" class="exam-multi-add" onclick="examMultiAdd(this)">+ Add Subject / Teacher</button></div></td>`;
};
// Prevent deleting a day/term with historical entries and cascading Question Submissions.
examDeleteDay=async function(dayId){
 if(!examIsManager()||!examEditMode)return;
 if((examEntries||[]).some(e=>String(e.day_id)===String(dayId))){examMessage('This day has saved subjects. Deletion is blocked to protect old Question/Marks records.');return;}
 const d=examDays.find(x=>String(x.id)===String(dayId));if(!d||!confirm(`Delete empty ${d.day_label}?`))return;
 try{const r=await examDb().from('exam_days').delete().eq('id',dayId);if(r.error)throw r.error;await examMarkDraft();await examLoadCurrentPeriodData();examEditMode=true;examRenderRoutine();examUpdateRoutineButtons();}catch(e){examMessage(examDbError(e));}
};
examDeleteCurrentPeriod=async function(){
 if(!examCurrentPeriod||!examIsManager())return;
 examMessage('Deleting an entire Exam Term is disabled in the safe upgrade to protect historical Reports, Questions and Marks.');
};
// Stop the old Question Submission delete wrapper from deleting Word files.
examDeleteCurrentPeriod.__qsWrapped=true;
examSaveRoutine=async function(publishAfter=false){
 if(!examIsManager()||!examCurrentPeriod||!examEditMode)return;
 const pid=examCurrentPeriod.id,now=new Date().toISOString(),updates=[],inserts=[],removeIds=[];
 try{
  const db=examDb();
  for(let ri=0;ri<EXAM_CLASSES.length;ri++)for(const d of examDays){
   const cls=EXAM_CLASSES[ri];
   const cell=document.querySelectorAll('#examRoutineHost .exam-table tbody tr')[ri]?.cells[examDays.indexOf(d)+1];
   if(!cell)throw new Error('Missing routine cell. Reload and try again.');
   const seen=new Set();
   for(const row of cell.querySelectorAll('.exam-multi-entry')){
    const id=Number(row.dataset.entryId)||null;
    const title=examNormalize(row.querySelector('.exam-multi-subject')?.value),teacher=examNormalize(row.querySelector('.exam-multi-teacher')?.value);
    if(!title&&!teacher){
      if(id){
       if(!isThirdTerm())throw new Error(`${cls} / ${d.day_label}: Existing subjects cannot be cleared outside Third Term.`);
       const old=(examEntries||[]).find(x=>Number(x.id)===id);
       if(!old||protectedHistory(old))throw new Error(`${cls} / ${d.day_label}: This entry has tracked history and cannot be cleared.`);
       removeIds.push(id);
      }
      continue;
    }
    const dedupe=(title+'|'+teacher).toLowerCase();if(seen.has(dedupe))throw new Error(`${cls} / ${d.day_label}: Duplicate subject/teacher assignment.`);seen.add(dedupe);
    const values={period_id:pid,day_id:d.id,class_name:cls,activity_title:title||null,teacher_name:teacher||null,teacher_staff_id:null,question_required:!!title&&!examIsNoQuestionTitle(title),updated_at:now};
    if(id){
     const old=examEntries.find(x=>Number(x.id)===id);if(!old)throw new Error('Old entry not found; reload the routine.');
     const linkedStatus=(examStatuses||[]).some(x=>Number(x.entry_id)===id && (x.submitted||x.printed||x.marks_submitted));
     // Preserving the SAME subject identity is essential for uploaded questions.
     if(linkedStatus&&examNormalize(old.activity_title)!==title)throw new Error(`${cls} / ${d.day_label}: ${old.activity_title} has submitted/tracked records. Subject rename is blocked.`);
     updates.push({id,old,...values});
    }else inserts.push(values);
   }
   const existing=byCell(d.id,cls);
   const listed=new Set([...cell.querySelectorAll('.exam-multi-entry')].map(x=>Number(x.dataset.entryId)).filter(Boolean));
   for(const e of existing)if(!listed.has(Number(e.id))){
     if(!isThirdTerm()||protectedHistory(e))throw new Error(`${cls} / ${d.day_label}: Existing subject removal is blocked to protect reports.`);
     removeIds.push(Number(e.id));
   }
  }
  // Linked Questions/Marks are validated again inside the atomic server RPC,
  // even when the client's role cannot read private submission records.
  const dayUpdates=examDays.map((d,i)=>({id:d.id,period_id:pid,day_label:examNormalize(document.getElementById(`examDayLabel_${d.id}`)?.value)||`Day ${i+1}`,exam_date:examNormalize(document.getElementById(`examDayDate_${d.id}`)?.value)||null,sort_order:i+1,updated_at:now}));
  // Single PostgreSQL transaction: all updates + inserts + publish together.
  // On any error PostgreSQL rolls back the entire save.
  const payload=updates.map(x=>({id:x.id,day_id:x.day_id,class_name:x.class_name,activity_title:x.activity_title,teacher_name:x.teacher_name,question_required:x.question_required}))
    .concat(inserts.map(x=>({id:null,day_id:x.day_id,class_name:x.class_name,activity_title:x.activity_title,teacher_name:x.teacher_name,question_required:x.question_required})));
  const third=isThirdTerm();
  const res=await db.rpc(third?'exam_save_routine_third_safe_v2':'exam_save_routine_multi_safe',{
    p_period_id:Number(pid),
    p_days:dayUpdates.map(x=>({id:x.id,day_label:x.day_label,exam_date:x.exam_date,sort_order:x.sort_order})),
    p_entries:payload,
    p_publish:!!publishAfter,
    p_actor_name:examActorName(),
    ...(third?{p_delete_entry_ids:[...new Set(removeIds)]}: {})
  });
  if(res.error)throw res.error;
  examEditMode=false;await examLoadPeriods(pid);
  examMessage(publishAfter?'Multi-subject Routine published. Existing Question/Marks records are preserved.':'Multi-subject Routine saved as Draft. Existing records are preserved.','success');
 }catch(e){examMessage('Save stopped: '+examDbError(e)+' This save uses a database transaction, so a failed RPC rolls back its changes.');}
};
function trackerItem(e){
 const s=examStatusFor(e.id)||{},submitted=!!s.submitted,printed=!!s.printed,marks=!!s.marks_submitted,m=examIsManager(),marksAdmin=typeof window.qsSetMarksTracker==='function' && examPortalRole==='admin';
 if(!e.question_required)return `<div class="exam-multi-slot"><span class="exam-special">${examEscape(e.activity_title||'—')}</span>${e.teacher_name?`<span class="exam-teacher">${examEscape(e.teacher_name)}</span>`:''}</div>`;
 return `<div class="exam-multi-slot"><span class="exam-subject">${examEscape(e.activity_title||'—')}</span>${e.teacher_name?`<span class="exam-teacher">${examEscape(e.teacher_name)}</span>`:''}<div class="exam-status-stack"><label class="exam-status-line ${submitted?'active':''}">${m?`<input type="checkbox" ${submitted?'checked':''} onchange="examSetStatus(${Number(e.id)},'submitted',this.checked)">`:submitted?'✅':'☐'}<span>${submitted?'Question Submitted':'Question Submit'}</span></label><label class="exam-status-line ${printed?'printed':''}">${m?`<input type="checkbox" ${printed?'checked':''} ${submitted?'':'disabled'} onchange="examSetStatus(${Number(e.id)},'printed',this.checked)">`:printed?'✅':'☐'}<span>🖨 ${printed?'Printed':'Print'}</span></label><label class="exam-status-line qs-marks-line ${marks?'done':''}">${marksAdmin?`<input type="checkbox" ${marks?'checked':''} onchange="qsSetMarksTracker(${Number(e.id)},this.checked,this)">`:marks?'✅':'☐'}<span>📊 ${marks?'Marks Submitted':'Marks Pending'}</span></label></div></div>`;
}
examTrackerCellHtml=function(day,cls){const rows=byCell(day.id,cls);return `<td class="exam-tracker-cell">${rows.length?rows.map(trackerItem).join(''):'<span class="exam-special">—</span>'}</td>`;};
function printableContent(cls,d,tracker){const rows=byCell(d.id,cls);return rows.length?rows.map(e=>`<div class="exam-multi-slot"><strong>${examEscape(e.activity_title||'—')}</strong>${e.teacher_name?`<div>${examEscape(e.teacher_name)}</div>`:''}${tracker&&e.question_required?(()=>{const s=examStatusFor(e.id)||{};return `<div>${s.submitted?'✓':'☐'} Submitted | ${s.printed?'✓':'☐'} Printed | ${s.marks_submitted?'✓':'☐'} Marks</div>`;})():''}</div>`).join(''):'—';}
examPrintableRoutine=function(){const head=examDays.map(d=>`<th>${examEscape(d.day_label)}<br>${examEscape(d.exam_date||'')}</th>`).join('');return `<div class="exam-table-wrap"><table class="exam-table"><thead><tr><th>CLASS</th>${head}</tr></thead><tbody>${EXAM_CLASSES.map(cls=>`<tr><td><strong>${examEscape(cls)}</strong></td>${examDays.map(d=>`<td>${printableContent(cls,d,false)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;};
examPrintableTracker=function(){const head=examDays.map(d=>`<th>${examEscape(d.day_label)}<br>${examEscape(d.exam_date||'')}</th>`).join('');return `<div class="exam-table-wrap"><table class="exam-table"><thead><tr><th>CLASS</th>${head}</tr></thead><tbody>${EXAM_CLASSES.map(cls=>`<tr><td><strong>${examEscape(cls)}</strong></td>${examDays.map(d=>`<td>${printableContent(cls,d,true)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;};
examRenderClasswise=function(){const host=document.getElementById('examClasswiseHost'),sel=document.getElementById('examClasswiseSelect');if(!host)return;if(!examCurrentPeriod){host.innerHTML='<div class="exam-empty">Select Academic Year, Term and Class.</div>';return;}const cls=sel.value;if(!cls){host.innerHTML='<div class="exam-empty">Select a Class.</div>';return;}const rows=examDays.map(d=>`<tr><td>${examEscape(d.day_label)}</td><td>${examEscape(d.exam_date||'—')}</td><td>${printableContent(cls,d,false)}</td></tr>`).join('');host.innerHTML=`<div class="exam-info-line"><span class="exam-info-chip">${examEscape(examCurrentPeriod.academic_year)}</span><span class="exam-info-chip">${examEscape(examCurrentPeriod.term_name)}</span><span class="exam-info-chip">${examEscape(cls)}</span></div><div class="exam-table-wrap"><table class="exam-class-routine"><thead><tr><th>Day</th><th>Date</th><th>Routine</th></tr></thead><tbody>${rows}</tbody></table></div>`;};
examExportCSV=function(kind){if(!examCurrentPeriod){examMessage('Select Academic Year and Term first.');return;}const p=examCurrentPeriod,rows=[['Academic Year',p.academic_year],['Term',p.term_name],[]];if(kind==='classwise'||kind==='class'){const cls=document.getElementById('examClasswiseSelect')?.value;if(!cls){examMessage('Select a Class first.');return;}rows.push(['Class',cls],['Day','Date','Subject','Teacher']);examDays.forEach(d=>{const slots=byCell(d.id,cls);slots.forEach(e=>rows.push([d.day_label,d.exam_date||'',e.activity_title||'',e.teacher_name||'']));if(!slots.length)rows.push([d.day_label,d.exam_date||'','—','']);});}else{rows.push(['Class','Day','Date','Subject','Teacher',...(kind==='tracker'?['Question Submission','Printed','Marks Submitted']:[])]);EXAM_CLASSES.forEach(cls=>examDays.forEach(d=>{const slots=byCell(d.id,cls);slots.forEach(e=>{const s=examStatusFor(e.id)||{};rows.push([cls,d.day_label,d.exam_date||'',e.activity_title||'',e.teacher_name||'',...(kind==='tracker'?[e.question_required?(s.submitted?'Submitted':'Pending'):'N/A',e.question_required?(s.printed?'Printed':'Pending'):'N/A',e.question_required?(s.marks_submitted?'Submitted':'Pending'):'N/A']:[])]);});if(!slots.length)rows.push([cls,d.day_label,d.exam_date||'','—','']);}));}const csv='\ufeff'+rows.map(r=>r.map(examCsv).join(',')).join('\r\n'),blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`exam_${kind}_${String(p.academic_year).replace(/\W+/g,'_')}_${String(p.term_name).replace(/\W+/g,'_')}.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
// Question Submission installs its older single-cell overrides at DOMContentLoaded.
// Prevent those wrappers from silently replacing the multi-entry renderers.
examTrackerCellHtml.__qsMarksWrapped=true;
examPrintableTracker.__qsMarksWrapped=true;
examExportCSV.__qsMarksWrapped=true;
console.info('[ST AUGUSTINE] Safe Multi-Subject Exam overlay loaded.');
})();
