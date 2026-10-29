/* ST AUGUSTINE - Term-wise Marks Workspace (frontend only)
   Non-destructive: does not UPDATE, DELETE or migrate any stored project.
   Requires existing app.js functions. */
(function(){
'use strict';
const terms=['First','Second','Third','Final'];
function ensureLayout(){
 if(document.getElementById('umeThirdTermResponsiveStyle'))return;
 const st=document.createElement('style');st.id='umeThirdTermResponsiveStyle';
 st.textContent=`
 #umeCreateForm{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:14px!important;align-items:end!important;width:100%;box-sizing:border-box}
 #umeCreateForm>.ume-field{display:flex!important;flex-direction:column!important;gap:7px!important;min-width:0!important;width:100%!important;margin:0!important;font-weight:800;box-sizing:border-box}
 #umeCreateForm>.ume-field input,#umeCreateForm>.ume-field select{display:block!important;min-width:0!important;width:100%!important;height:47px!important;box-sizing:border-box!important;margin:0!important}
 #umeCreateForm>#umeCreateBtn{width:100%!important;min-width:0!important;min-height:47px!important;grid-column:1 / -1!important;margin:0!important}
 @media(min-width:1250px){#umeCreateForm{grid-template-columns:repeat(4,minmax(0,1fr))!important}#umeCreateForm>#umeCreateBtn{grid-column:4!important}}
 @media(min-width:760px) and (max-width:1249px){#umeCreateForm{grid-template-columns:repeat(2,minmax(0,1fr))!important}#umeCreateForm>#umeCreateBtn{grid-column:1 / -1!important}}
 @media(max-width:759px){#umeCreateForm{grid-template-columns:minmax(0,1fr)!important;gap:12px!important}#umeCreateForm>#umeCreateBtn{grid-column:1!important}#umeCreateForm>.ume-field input,#umeCreateForm>.ume-field select{font-size:16px!important}}
 `;
 document.head.appendChild(st);
}
ensureLayout();

const state={teacher:'Third',classTeacher:'Third',admin:'Third',principal:'Third'};
function termOf(v){const s=String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();if(/\b(first|1st)\b/.test(s))return 'First';if(/\b(second|2nd)\b/.test(s))return 'Second';if(/\b(third|3rd)\b/.test(s))return 'Third';if(/\b(final|fourth|4th)\b/.test(s))return 'Final';return 'Other';}
function el(id){return document.getElementById(id);}
function options(selected){return '<option value="All">All Terms (including old files)</option>'+terms.map(t=>`<option value="${t}" ${selected===t?'selected':''}>${t} Term</option>`).join('')+'<option value="Other">Other / Unrecognized Names</option>';}
function ensure(role){const id='umeTermFilter_'+role;if(el(id))return;const anchor=role==='teacher'?el('umeTeacherYearFilter'):role==='classTeacher'?el('umeClassTeacherFilterBar'):el(role==='admin'?'umeAdminGroups':'umePrincipalGroups');if(!anchor||!anchor.parentElement)return;
 const host=document.createElement('div');host.className='ume-filter-bar';host.style.cssText='margin:9px 0;padding:10px;border:1px solid #d3dfeb;border-radius:12px;background:#f5f9ff;';host.innerHTML=`<label class="ume-field" style="max-width:310px">Exam Term<select id="${id}">${options(state[role])}</select></label>`;
 anchor.insertAdjacentElement(role==='teacher'?'afterend':'beforebegin',host);el(id).addEventListener('change',function(){state[role]=this.value;refresh(role);});}
function filtered(rows,role){return state[role]==='All'?rows:rows.filter(x=>termOf(x.term_name||x.term)===state[role]);}
function refresh(role){try{if(role==='teacher'){if(typeof umeRenderTeacherProjectOptionsFinal==='function')umeRenderTeacherProjectOptionsFinal();return;}
 if(role==='classTeacher'){if(typeof umeClassTeacherFilterChangedFinal==='function')umeClassTeacherFilterChangedFinal();return;}
 if(typeof umeRoleGroups==='function'&&typeof umeRenderGroupCards==='function'){
  const host=el(role==='admin'?'umeAdminGroups':'umePrincipalGroups');if(host)umeRenderGroupCards(role,umeRoleGroups(role),host);
  const detail=el(role==='admin'?'umeAdminDetail':'umePrincipalDetail');if(detail)detail.innerHTML='';
 }
}catch(err){console.warn('[Term Workspace]',err);}}
// Teacher list: preserve existing Academic Year choice and selection. Only filter the options.
function install(){
 if(typeof umeRenderTeacherProjectOptionsFinal!=='function'||typeof umeRoleGroups!=='function'||typeof umeRenderGroupCards!=='function')return false;
 const originalTeacher=umeRenderTeacherProjectOptionsFinal;
 umeRenderTeacherProjectOptionsFinal=function(preferredId){originalTeacher.apply(this,arguments);ensure('teacher');const select=el('umeProjectSelect');if(!select)return;
 const matched=filtered(typeof umeMyProjects!=='undefined'?umeMyProjects:[],'teacher');const allowed=new Set(matched.map(p=>String(p.id)));[...select.options].forEach(o=>{if(o.value&&!allowed.has(o.value))o.remove();});
 if(select.options.length===0||![...select.options].some(o=>allowed.has(o.value))){select.innerHTML='<option value="">No Marks file in selected Term</option>';const ws=el('umeTeacherWorkspace');if(ws)ws.style.display='none';}
 if(preferredId&&allowed.has(String(preferredId))&&[...select.options].some(o=>o.value===String(preferredId))){select.value=String(preferredId);}
 else if(select.value&&!allowed.has(select.value)){select.value='';const ws=el('umeTeacherWorkspace');if(ws)ws.style.display='none';}
 };
 const originalGroups=umeRoleGroups;
 umeRoleGroups=function(role){const rows=originalGroups.apply(this,arguments);return state[role]?rows.filter(g=>state[role]==='All'||termOf(g.term)===state[role]):rows;};
 const originalCards=umeRenderGroupCards;
 umeRenderGroupCards=function(role,groups,host){const result=originalCards.apply(this,arguments);if(['admin','principal','classTeacher'].includes(role))ensure(role);return result;};
 const originalInbox=typeof umePopulateClassTeacherFiltersFinal==='function'?umePopulateClassTeacherFiltersFinal:null;
 if(originalInbox)umePopulateClassTeacherFiltersFinal=function(){const res=originalInbox.apply(this,arguments);ensure('classTeacher');return res;};
 // Canonical term picker is a single native select in index.html.
 const termSelect=el('umeCreateTerm');
 if(termSelect){termSelect.value='Third Term';termSelect.addEventListener('change',()=>{state.teacher=termOf(termSelect.value);refresh('teacher');});}

 return true;
}
if(!install())console.warn('[Term Workspace] Existing Marks Entry functions not found.');
})();
