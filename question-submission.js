/* =========================================================
   ST. AUGUSTINE ACADEMIC FOUNDATION
   QUESTION SUBMISSION WORKFLOW — ADD-ON V1.3
   Safe overlay: does not replace existing Marks/Leave/Portfolio logic.
   ========================================================= */
(function(){
  "use strict";

  const QS_BUCKET="question-papers";
  const QS_CLASSES=["Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"];
  const WORD_EXT=/\.(doc|docx)$/i;
  const MAX_FILE_SIZE=10*1024*1024;
  const state={source:"staff",isAdmin:false,isReviewer:false,periods:[],windows:[],own:[],review:[],reviewers:[],selectedWindow:null};

  function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");}
  function norm(v){return String(v??"").trim().replace(/\s+/g," ");}
  function id(v){return document.getElementById(v);}
  function staffReady(){return typeof loggedInStaff!=="undefined"&&!!loggedInStaff&&typeof staffAuthSession!=="undefined"&&!!staffAuthSession?.user?.id;}
  function adminReady(){return typeof studentAdminSession!=="undefined"&&!!studentAdminSession&&typeof isWebsiteAdminSession==="function"&&isWebsiteAdminSession(studentAdminSession);}
  function actorStaffId(){return staffReady()?String(loggedInStaff.username||"").trim().toLowerCase():"";}
  function actorName(){return state.isAdmin?"Website Admin":(staffReady()?loggedInStaff.name||loggedInStaff.username:"Staff");}
  function actorDesignation(){return state.isAdmin?"Website Admin":(staffReady()?loggedInStaff.designation||"Staff":"Staff");}
  function client(){
    if(state.isAdmin) return typeof initStudentSupabase==="function"?initStudentSupabase():null;
    return typeof initStaffSupabase==="function"?initStaffSupabase():null;
  }
  async function rpc(name,args={}){const db=client();if(!db)throw new Error("Supabase connection is unavailable.");const {data,error}=await db.rpc(name,args);if(error)throw error;return data;}
  function msg(text,type="info"){
    const box=id("qsMessage");if(!box)return;box.className=`qs-message ${type}`;box.textContent=text||"";
    if(text&&type==="success")setTimeout(()=>{if(box.textContent===text)box.textContent="";},3500);
  }
  function fmtDate(v){if(!v)return "—";try{return new Date(v).toLocaleString("en-GB",{timeZone:"Asia/Kathmandu",year:"numeric",month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"});}catch(_){return String(v)}}
  function localInputValue(v){if(!v)return "";const d=new Date(v);if(Number.isNaN(d.getTime()))return "";const pad=n=>String(n).padStart(2,"0");return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;}
  function toIso(v){if(!v)return null;const d=new Date(v);return Number.isNaN(d.getTime())?null:d.toISOString();}
  function statusLabel(s){return s==="approved"?"APPROVED":s==="returned"?"RETURNED FOR CORRECTION":s==="pending"?"PENDING REVIEW":"SUBMITTED";}
  function statusClass(s){return ["approved","returned","pending"].includes(s)?s:"pending";}
  function safeFileName(name){return String(name||"question.docx").replace(/[^a-zA-Z0-9._-]+/g,"_").slice(-120);}
  function getPeriod(pid){return state.periods.find(p=>String(p.id)===String(pid))||null;}
  function getWindow(pid){return state.windows.find(w=>String(w.period_id)===String(pid))||null;}
  function isWindowOpen(w){if(!w||!w.enabled)return false;const now=Date.now(),open=w.opens_at?new Date(w.opens_at).getTime():0,deadline=w.deadline_at?new Date(w.deadline_at).getTime():Infinity;return now>=open&&now<=deadline;}

  function injectStyles(){if(id("qsAddonStyles"))return;const st=document.createElement("style");st.id="qsAddonStyles";st.textContent=`
    #questionSubmissionPopup{z-index:100500}.qs-box{width:min(1180px,95vw);max-height:92vh;overflow:auto;background:#f8fbff;border-radius:22px;padding:0;box-shadow:0 24px 80px rgba(15,35,65,.28)}
    .qs-hero{padding:22px 24px;background:linear-gradient(135deg,#0c3f73,#1165a9);color:#fff;border-radius:22px 22px 0 0;display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.qs-hero h2{margin:0 0 5px;font-size:26px}.qs-hero p{margin:0;opacity:.9}.qs-role{background:rgba(255,255,255,.16);padding:8px 12px;border:1px solid rgba(255,255,255,.3);border-radius:999px;font-size:12px;font-weight:800;white-space:nowrap}
    .qs-body{padding:20px}.qs-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}.qs-tab{border:0;border-radius:12px;padding:11px 14px;font-weight:800;cursor:pointer;background:#eaf1f8;color:#25415d}.qs-tab.active{background:#0d5f9f;color:#fff}.qs-tab[hidden]{display:none!important}
    .qs-pane{display:none}.qs-pane.active{display:block}.qs-card{background:#fff;border:1px solid #dbe7f2;border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:0 5px 18px rgba(28,64,99,.05)}.qs-card h3,.qs-card h4{margin:0 0 10px;color:#173954}.qs-note{font-size:12px;color:#61778a;line-height:1.5}
    .qs-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.qs-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.qs-field{display:grid;gap:6px;font-size:12px;font-weight:800;color:#385269}.qs-field input,.qs-field select,.qs-field textarea{width:100%;box-sizing:border-box;border:1px solid #cbd9e6;border-radius:10px;padding:10px 11px;background:#fff;font:inherit;color:#1c3449}.qs-field textarea{min-height:90px;resize:vertical}
    .qs-btn{border:0;border-radius:10px;padding:10px 13px;font-weight:800;cursor:pointer;background:#0e65a7;color:#fff}.qs-btn.secondary{background:#eaf1f8;color:#264863}.qs-btn.green{background:#177b4b}.qs-btn.red{background:#b42318}.qs-btn.orange{background:#a45b06}.qs-btn:disabled{opacity:.5;cursor:not-allowed}.qs-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
    .qs-message{min-height:20px;margin:0 0 12px;padding:0;font-size:13px;font-weight:800}.qs-message.error{color:#b42318}.qs-message.success{color:#177b4b}.qs-message.info{color:#36566f}
    .qs-status{display:inline-flex;align-items:center;border-radius:999px;padding:5px 9px;font-size:11px;font-weight:900;letter-spacing:.03em;background:#e9eef4;color:#536676}.qs-status.pending{background:#fff3cd;color:#825d00}.qs-status.returned{background:#ffe3e0;color:#a52b20}.qs-status.approved{background:#dff4e8;color:#146c43}.qs-deadline{font-size:12px;font-weight:800;color:#8a4b00}.qs-open{color:#147a49}.qs-closed{color:#ad2d23}
    .qs-list{display:grid;gap:10px}.qs-row{border:1px solid #dde8f1;border-radius:13px;padding:13px;background:#fbfdff}.qs-row-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.qs-row-title{font-weight:900;color:#193d59}.qs-row-meta{font-size:12px;color:#60778b;line-height:1.55;margin-top:5px}.qs-reason{margin-top:9px;background:#fff2ef;border-left:4px solid #d94a3a;padding:9px 10px;border-radius:8px;font-size:12px;color:#7a2a21}.qs-version{font-size:11px;font-weight:800;color:#5d7387}
    .qs-table-wrap{overflow:auto}.qs-table{width:100%;border-collapse:collapse;font-size:12px}.qs-table th,.qs-table td{border-bottom:1px solid #e1eaf2;padding:9px;text-align:left;vertical-align:top}.qs-table th{background:#f3f7fb;color:#31516a;position:sticky;top:0}.qs-table select{max-width:220px}
    .qs-review-filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.qs-review-filters select{border:1px solid #cbd9e6;border-radius:9px;padding:9px;background:#fff}
    .qs-permission-row{display:flex;justify-content:space-between;gap:12px;align-items:center;border-bottom:1px solid #e5edf4;padding:10px 2px}.qs-permission-row:last-child{border-bottom:0}.qs-switch{display:flex;align-items:center;gap:8px;font-weight:800;font-size:12px}.qs-switch input{width:19px;height:19px}
    .qs-modal{position:fixed;inset:0;background:rgba(9,23,38,.58);display:none;align-items:center;justify-content:center;z-index:100800;padding:18px}.qs-modal.show{display:flex}.qs-modal-card{width:min(520px,96vw);background:#fff;border-radius:16px;padding:18px;box-shadow:0 20px 70px rgba(0,0,0,.28)}
    #staffDashboardQuestionSubmissionAction{display:flex!important;border:2px solid #0d5f9f!important;box-shadow:0 8px 22px rgba(13,95,159,.16)!important;position:relative!important}
    #staffDashboardQuestionSubmissionAction::after{content:"NEW";position:absolute;right:10px;top:8px;font-size:9px;font-weight:900;padding:3px 6px;border-radius:999px;background:#0d5f9f;color:#fff;letter-spacing:.05em}
    #staffDashboardQuestionSubmissionAction .staff-dashboard-action-copy strong{font-size:15px!important}
    .qs-marks-line{margin-top:5px;font-size:11px;font-weight:900;color:#264863}.qs-marks-line.done{color:#146c43}
    @media(max-width:850px){.qs-grid,.qs-grid.two{grid-template-columns:1fr}.qs-hero{display:block}.qs-role{display:inline-flex;margin-top:10px}.qs-box{width:97vw;max-height:96vh}.qs-body{padding:12px}.qs-row-head{display:block}.qs-row-head .qs-status{margin-top:7px}#staffDashboardQuestionSubmissionAction{width:100%!important;min-height:72px!important}}
  `;document.head.appendChild(st);}

  function ensurePopup(){
    if(id("questionSubmissionPopup"))return;
    const wrap=document.createElement("div");wrap.id="questionSubmissionPopup";wrap.className="popup";wrap.setAttribute("role","dialog");wrap.setAttribute("aria-modal","true");wrap.innerHTML=`
      <div class="qs-box">
        <div class="qs-hero"><div><h2>📝 Question Submission</h2><p>Secure Word-file submission, review, correction and Exam Routine tracking.</p></div><div id="qsRoleBadge" class="qs-role">STAFF</div></div>
        <div class="qs-body">
          <div class="qs-tabs">
            <button id="qsTabSubmit" class="qs-tab" type="button" onclick="qsShowTab('submit')">📤 Submit Question</button>
            <button id="qsTabReview" class="qs-tab" type="button" onclick="qsShowTab('review')" hidden>✅ Question Review</button>
            <button id="qsTabWindows" class="qs-tab" type="button" onclick="qsShowTab('windows')" hidden>⏰ Submission Window</button>
            <button id="qsTabPermissions" class="qs-tab" type="button" onclick="qsShowTab('permissions')" hidden>👥 Reviewer Permission</button>
            <button class="qs-tab" type="button" onclick="closeQuestionSubmission()">✕ Close</button>
          </div>
          <div id="qsMessage" class="qs-message"></div>
          <section id="qsPaneSubmit" class="qs-pane"></section>
          <section id="qsPaneReview" class="qs-pane"></section>
          <section id="qsPaneWindows" class="qs-pane"></section>
          <section id="qsPanePermissions" class="qs-pane"></section>
        </div>
      </div>
      <div id="qsReturnModal" class="qs-modal"><div class="qs-modal-card"><h3 style="margin-top:0">Return Question for Correction</h3><p class="qs-note">Write the correction reason. The teacher will see this note and only then can upload a corrected Word file.</p><label class="qs-field">Correction / Return Reason<textarea id="qsReturnReason" maxlength="800" placeholder="Explain what needs to be corrected..."></textarea></label><div class="qs-actions" style="margin-top:12px"><button class="qs-btn orange" type="button" onclick="qsConfirmReturn()">RETURN QUESTION</button><button class="qs-btn secondary" type="button" onclick="qsCloseReturnModal()">Cancel</button></div></div></div>
    `;document.body.appendChild(wrap);
  }

  function ensureEntryButtons(){
    const quick=document.querySelector("#staffDashboardPopup .staff-dashboard-quick-actions");
    if(quick){
      let b=id("staffDashboardQuestionSubmissionAction");
      if(!b){
        b=document.createElement("button");b.id="staffDashboardQuestionSubmissionAction";b.type="button";b.className="staff-dashboard-action question-submission";b.innerHTML='<span class="staff-dashboard-action-icon">📝</span><span class="staff-dashboard-action-copy"><strong>Question Submission</strong><small>Submit Word questions • View submission status</small></span><span class="staff-dashboard-action-arrow">→</span>';
        b.addEventListener("click",()=>openQuestionSubmission("staff"));
      }
      b.style.setProperty("display","flex","important");
      b.setAttribute("aria-label","Question Submission");
      const marks=id("staffDashboardMarksAction"),exam=id("staffDashboardExamAction");
      if(marks&&marks.parentElement===quick&&b.previousElementSibling!==marks)marks.insertAdjacentElement("afterend",b);
      else if(!b.isConnected&&exam)exam.insertAdjacentElement("beforebegin",b);
      else if(!b.isConnected)quick.appendChild(b);
    }
    const tabs=document.querySelector("#websiteAdminPanel .website-admin-tabs");
    if(tabs){
      let b=id("websiteAdminQuestionSubmissionButton");
      if(!b){b=document.createElement("button");b.id="websiteAdminQuestionSubmissionButton";b.type="button";b.innerHTML="📝 Question Submission";b.addEventListener("click",()=>openQuestionSubmission("admin"));const exam=id("websiteAdminExamButton");exam?exam.insertAdjacentElement("afterend",b):tabs.appendChild(b);}
    }
  }

  async function loadBase(){
    const db=client();if(!db)throw new Error("Supabase connection is unavailable.");
    const [p,w]=await Promise.all([
      db.from("exam_periods").select("id,academic_year,term_name,exam_title,is_published,created_at").order("academic_year",{ascending:false}).order("created_at",{ascending:false}),
      db.from("question_submission_windows").select("period_id,opens_at,deadline_at,enabled,created_at,updated_at").order("created_at",{ascending:false})
    ]);
    if(p.error)throw p.error;if(w.error)throw w.error;
    state.periods=(p.data||[]);state.windows=(w.data||[]);
  }

  async function resolveReviewer(){
    if(state.isAdmin){state.isReviewer=true;return true;}
    if(!staffReady()){state.isReviewer=false;return false;}
    if(actorStaffId()===(typeof PRINCIPAL_STAFF_ID!=="undefined"?PRINCIPAL_STAFF_ID:"joseph")){state.isReviewer=true;return true;}
    const db=client();const {data,error}=await db.from("question_reviewers").select("enabled").eq("staff_id",actorStaffId()).maybeSingle();
    if(error&&error.code!=="PGRST116")throw error;state.isReviewer=!!data?.enabled;return state.isReviewer;
  }

  window.openQuestionSubmission=async function(source="staff"){
    state.source=String(source||"staff").toLowerCase();state.isAdmin=state.source==="admin";
    if(state.isAdmin&&!adminReady()){if(typeof openStudentAdminLogin==="function")openStudentAdminLogin();return;}
    if(!state.isAdmin&&!staffReady()){if(typeof openStaffLogin==="function")openStaffLogin();return;}
    injectStyles();ensurePopup();ensureEntryButtons();
    id("questionSubmissionPopup").style.display="block";document.body.style.overflow="hidden";msg("Loading Question Submission...","info");
    try{
      await Promise.all([loadBase(),resolveReviewer()]);
      id("qsRoleBadge").textContent=state.isAdmin?"ADMIN — CONTROL & REVIEW":state.isReviewer?"STAFF — SUBMIT + REVIEW":"STAFF — SUBMIT";
      id("qsTabSubmit").hidden=state.isAdmin;
      id("qsTabReview").hidden=!state.isReviewer;
      id("qsTabWindows").hidden=!state.isAdmin;
      id("qsTabPermissions").hidden=!state.isAdmin;
      await renderAll();
      qsShowTab(state.isAdmin?"windows":"submit");msg("","info");
    }catch(e){console.error("Question Submission open error",e);msg(qsFriendlyError(e),"error");}
  };
  window.closeQuestionSubmission=function(){const p=id("questionSubmissionPopup");if(p)p.style.display="none";document.body.style.overflow="auto";msg("","info");};
  window.qsShowTab=function(tab){["submit","review","windows","permissions"].forEach(n=>{id(`qsPane${n[0].toUpperCase()+n.slice(1)}`)?.classList.toggle("active",n===tab);id(`qsTab${n[0].toUpperCase()+n.slice(1)}`)?.classList.toggle("active",n===tab);});if(tab==="review"&&state.isReviewer)loadReviewRows();if(tab==="permissions"&&state.isAdmin)loadReviewerPermissions();};

  async function renderAll(){if(!state.isAdmin)await loadOwnSubmissions();renderSubmitPane();if(state.isReviewer)renderReviewPane();if(state.isAdmin){renderWindowPane();renderPermissionsPane();}}

  function activePublishedWindows(){return state.windows.map(w=>({w,p:getPeriod(w.period_id)})).filter(x=>x.p&&x.p.is_published&&x.w.enabled);}
  function renderSubmitPane(){
    const host=id("qsPaneSubmit");if(!host)return;
    const choices=activePublishedWindows();
    host.innerHTML=`
      <div class="qs-card"><h3>📤 Submit Question Paper</h3><p class="qs-note">Microsoft Word files only (.doc / .docx). After one successful submission, that Class + Subject is locked. A corrected upload opens only when a reviewer returns it.</p>
        <div class="qs-grid">
          <label class="qs-field">Term / Examination<select id="qsSubmitPeriod" onchange="qsSubmissionPeriodChanged()"><option value="">— Select Term —</option>${choices.map(({w,p})=>`<option value="${Number(p.id)}">${esc(p.academic_year)} • ${esc(p.term_name)}</option>`).join("")}</select></label>
          <label class="qs-field">Class<select id="qsSubmitClass" onchange="qsSubmissionClassChanged()" disabled><option value="">— Select Class —</option>${QS_CLASSES.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("")}</select></label>
          <label class="qs-field">Subject<select id="qsSubmitEntry" onchange="qsSubmissionEntryChanged()" disabled><option value="">— Select Subject —</option></select></label>
          <label class="qs-field">Word File<input id="qsSubmitFile" type="file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" disabled></label>
        </div>
        <div id="qsSubmitWindowInfo" class="qs-note" style="margin-top:10px">Select a Term / Examination.</div>
        <div id="qsCurrentSelectionStatus" style="margin-top:10px"></div>
        <div class="qs-actions" style="margin-top:12px"><button id="qsSubmitBtn" class="qs-btn" type="button" onclick="qsSubmitCurrent()" disabled>SUBMIT QUESTION</button><button class="qs-btn secondary" type="button" onclick="qsRefreshOwn()">↻ Refresh Status</button></div>
      </div>
      <div class="qs-card"><h3>📋 My Question Submission Status</h3><div id="qsOwnSubmissionList" class="qs-list">${renderOwnRows()}</div></div>`;
  }
  function renderOwnRows(){
    if(!state.own.length)return '<div class="qs-note">No questions submitted yet.</div>';
    return state.own.map(r=>{const p=getPeriod(r.period_id);return `<div class="qs-row"><div class="qs-row-head"><div><div class="qs-row-title">${esc(r.class_name)} — ${esc(r.subject_name)}</div><div class="qs-row-meta">${esc(p?.academic_year||"")} • ${esc(p?.term_name||"")}<br>Submitted: ${esc(fmtDate(r.submitted_at))} • <span class="qs-version">Version ${Number(r.current_version||1)}</span></div></div><span class="qs-status ${statusClass(r.status)}">${esc(statusLabel(r.status))}</span></div>${r.status==="returned"&&r.return_reason?`<div class="qs-reason"><strong>Reviewer Note:</strong> ${esc(r.return_reason)}</div>`:""}<div class="qs-actions" style="margin-top:9px"><button class="qs-btn secondary" type="button" onclick="qsOpenOwnFile(${Number(r.id)})">OPEN MY FILE</button></div></div>`;}).join("");
  }
  async function loadOwnSubmissions(){if(state.isAdmin||!staffReady())return;const db=client();const {data,error}=await db.from("question_submissions").select("id,period_id,entry_id,class_name,subject_name,staff_id,staff_name,status,return_reason,current_version,current_file_path,current_file_name,submitted_at,reviewed_at,reviewed_by_name").eq("staff_id",actorStaffId()).order("submitted_at",{ascending:false});if(error)throw error;state.own=data||[];const host=id("qsOwnSubmissionList");if(host)host.innerHTML=renderOwnRows();}
  window.qsRefreshOwn=async function(){try{await loadOwnSubmissions();msg("Status refreshed.","success");}catch(e){msg(qsFriendlyError(e),"error")}};

  window.qsSubmissionPeriodChanged=async function(){
    const pid=id("qsSubmitPeriod")?.value||"",cls=id("qsSubmitClass"),entry=id("qsSubmitEntry"),file=id("qsSubmitFile"),btn=id("qsSubmitBtn"),info=id("qsSubmitWindowInfo");
    if(cls){cls.value="";cls.disabled=!pid}if(entry){entry.innerHTML='<option value="">— Select Subject —</option>';entry.disabled=true}if(file){file.value="";file.disabled=true}if(btn)btn.disabled=true;id("qsCurrentSelectionStatus").innerHTML="";
    const w=getWindow(pid),p=getPeriod(pid);if(!pid||!w||!p){if(info)info.textContent="Select a Term / Examination.";return;}
    if(info)info.innerHTML=`<strong>${esc(p.academic_year)} • ${esc(p.term_name)}</strong><br>Open: ${esc(fmtDate(w.opens_at))} • Deadline: ${esc(fmtDate(w.deadline_at))}<br><span class="${isWindowOpen(w)?"qs-open":"qs-closed"}">${isWindowOpen(w)?"● Submission is OPEN":"● Submission is CLOSED / outside deadline"}</span>`;
  };
  window.qsSubmissionClassChanged=async function(){
    const pid=id("qsSubmitPeriod")?.value||"",cls=id("qsSubmitClass")?.value||"",entry=id("qsSubmitEntry"),file=id("qsSubmitFile"),btn=id("qsSubmitBtn");if(file){file.value="";file.disabled=true}if(btn)btn.disabled=true;id("qsCurrentSelectionStatus").innerHTML="";
    if(!pid||!cls){entry.innerHTML='<option value="">— Select Subject —</option>';entry.disabled=true;return;}
    try{const db=client();const {data,error}=await db.from("exam_routine_entries").select("id,period_id,class_name,activity_title,question_required").eq("period_id",Number(pid)).eq("class_name",cls).eq("question_required",true).order("id");if(error)throw error;const rows=(data||[]).filter(r=>norm(r.activity_title));entry.innerHTML='<option value="">— Select Subject —</option>'+rows.map(r=>`<option value="${Number(r.id)}">${esc(r.activity_title)}</option>`).join("");entry.disabled=!rows.length;if(!rows.length)id("qsCurrentSelectionStatus").innerHTML='<div class="qs-reason">No question-required subject is found for this Class in the published Exam Routine.</div>';}
    catch(e){msg(qsFriendlyError(e),"error");}
  };
  window.qsSubmissionEntryChanged=function(){
    const entryId=Number(id("qsSubmitEntry")?.value||0),file=id("qsSubmitFile"),btn=id("qsSubmitBtn"),status=id("qsCurrentSelectionStatus"),pid=Number(id("qsSubmitPeriod")?.value||0),w=getWindow(pid);if(file){file.value="";file.disabled=true}if(btn){btn.disabled=true;btn.textContent="SUBMIT QUESTION"}if(!entryId){status.innerHTML="";return;}
    const existing=state.own.find(r=>Number(r.entry_id)===entryId);
    if(existing){
      if(existing.status==="returned"){
        status.innerHTML=`<div class="qs-reason"><strong>Returned for Correction.</strong><br>${esc(existing.return_reason||"Please correct and resubmit.")}<br><span class="qs-version">Original file is preserved. Upload Version ${Number(existing.current_version||1)+1} only.</span></div>`;
        file.disabled=false;btn.disabled=false;btn.textContent="RESUBMIT CORRECTED QUESTION";
      }else{
        status.innerHTML=`<div class="qs-note"><span class="qs-status ${statusClass(existing.status)}">${esc(statusLabel(existing.status))}</span> This subject is already submitted and locked. You cannot delete or upload another file.</div>`;
      }
      return;
    }
    if(!isWindowOpen(w)){status.innerHTML='<div class="qs-reason"><strong>Submission is closed.</strong> The opening/deadline window does not currently allow a new submission.</div>';return;}
    file.disabled=false;btn.disabled=false;status.innerHTML='<div class="qs-note">Ready for first submission. After successful upload, this Class + Subject will be locked.</div>';
  };

  function validateWord(file){if(!file)throw new Error("Select a Microsoft Word file first.");if(!WORD_EXT.test(file.name||""))throw new Error("Only Microsoft Word files (.doc or .docx) are allowed.");if(file.size>MAX_FILE_SIZE)throw new Error("Word file is too large. Maximum allowed size is 10 MB.");}
  async function uploadWord(file,pid,entryId,version){validateWord(file);const db=client(),uid=staffAuthSession.user.id,name=safeFileName(file.name),path=`${uid}/${Number(pid)}/${Number(entryId)}/v${Number(version)}_${Date.now()}_${name}`;const {error}=await db.storage.from(QS_BUCKET).upload(path,file,{cacheControl:"3600",upsert:false,contentType:file.type||undefined});if(error)throw error;return {path,name};}

  window.qsSubmitCurrent=async function(){
    if(!staffReady()){if(typeof openStaffLogin==="function")openStaffLogin();return;}
    const pid=Number(id("qsSubmitPeriod")?.value||0),entryId=Number(id("qsSubmitEntry")?.value||0),file=id("qsSubmitFile")?.files?.[0],btn=id("qsSubmitBtn");if(!pid||!entryId){msg("Select Term, Class and Subject.","error");return}
    try{
      validateWord(file);const existing=state.own.find(r=>Number(r.entry_id)===entryId),version=existing&&existing.status==="returned"?Number(existing.current_version||1)+1:1;
      if(!existing&&!isWindowOpen(getWindow(pid)))throw new Error("The submission deadline is closed for new questions.");
      if(existing&&existing.status!=="returned")throw new Error("This subject is already submitted and locked.");
      const old=btn.textContent;btn.disabled=true;btn.textContent=existing?"UPLOADING CORRECTION...":"UPLOADING...";msg("Uploading Word file securely...","info");
      const up=await uploadWord(file,pid,entryId,version);
      try{
        if(existing){await rpc("qs_resubmit_question",{p_submission_id:Number(existing.id),p_file_path:up.path,p_file_name:up.name,p_file_size:Number(file.size||0),p_mime_type:file.type||null});}
        else{await rpc("qs_submit_question",{p_entry_id:entryId,p_staff_name:actorName(),p_file_path:up.path,p_file_name:up.name,p_file_size:Number(file.size||0),p_mime_type:file.type||null});}
      }catch(e){
        /* RPC did not accept the submission: remove the just-uploaded object so no orphan file is left behind. */
        try{await client().storage.from(QS_BUCKET).remove([up.path]);}catch(_){}
        throw e;
      }
      await loadOwnSubmissions();renderSubmitPane();const per=id("qsSubmitPeriod");if(per){per.value=String(pid);await qsSubmissionPeriodChanged();}msg(existing?"Corrected Question resubmitted successfully.":"Question submitted successfully. This subject is now locked.","success");
      if(btn){btn.disabled=false;btn.textContent=old}
    }catch(e){console.error("Question submit error",e);if(btn)btn.disabled=false;msg(qsFriendlyError(e),"error");}
  };

  async function signedUrl(path){const db=client();const {data,error}=await db.storage.from(QS_BUCKET).createSignedUrl(path,600);if(error)throw error;return data?.signedUrl||"";}
  window.qsOpenOwnFile=async function(submissionId){try{const r=state.own.find(x=>Number(x.id)===Number(submissionId));if(!r)throw new Error("Submission not found.");const url=await signedUrl(r.current_file_path);if(!url)throw new Error("Could not create secure file link.");window.open(url,"_blank","noopener");}catch(e){msg(qsFriendlyError(e),"error")}};

  function renderReviewPane(){const host=id("qsPaneReview");if(!host)return;host.innerHTML=`<div class="qs-card"><h3>✅ Question Review</h3><p class="qs-note">Only Principal, Website Admin and staff granted Reviewer Permission can see this section. Approving a question automatically marks the matching Exam Routine tracker item as <strong>Submitted</strong>. Printed remains a separate Exam Management step.</p><div class="qs-review-filters"><select id="qsReviewPeriod" onchange="loadReviewRows()"><option value="">All Terms</option>${state.periods.map(p=>`<option value="${Number(p.id)}">${esc(p.academic_year)} • ${esc(p.term_name)}</option>`).join("")}</select><select id="qsReviewClass" onchange="loadReviewRows()"><option value="">All Classes</option>${QS_CLASSES.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("")}</select><select id="qsReviewStatus" onchange="loadReviewRows()"><option value="">All Status</option><option value="pending">Pending</option><option value="returned">Returned</option><option value="approved">Approved</option></select><button class="qs-btn secondary" type="button" onclick="loadReviewRows()">↻ Refresh</button></div><div id="qsReviewList" class="qs-list"><div class="qs-note">Loading submitted questions...</div></div></div>`;}
  window.loadReviewRows=async function(){
    if(!state.isReviewer)return;const host=id("qsReviewList");if(!host)return;host.innerHTML='<div class="qs-note">Loading submitted questions...</div>';
    try{const db=client();let q=db.from("question_submissions").select("id,period_id,entry_id,class_name,subject_name,staff_id,staff_name,status,return_reason,current_version,current_file_path,current_file_name,submitted_at,reviewed_at,reviewed_by_name").order("submitted_at",{ascending:false});const pid=id("qsReviewPeriod")?.value||"",cls=id("qsReviewClass")?.value||"",st=id("qsReviewStatus")?.value||"";if(pid)q=q.eq("period_id",Number(pid));if(cls)q=q.eq("class_name",cls);if(st)q=q.eq("status",st);const {data,error}=await q;if(error)throw error;state.review=data||[];host.innerHTML=state.review.length?state.review.map(renderReviewRow).join(""):'<div class="qs-note">No matching Question submissions.</div>';}
    catch(e){host.innerHTML=`<div class="qs-reason">${esc(qsFriendlyError(e))}</div>`;}
  };
  function renderReviewRow(r){const p=getPeriod(r.period_id),own=!state.isAdmin&&r.staff_id===actorStaffId(),canAct=r.status==="pending"&&!own;return `<div class="qs-row"><div class="qs-row-head"><div><div class="qs-row-title">${esc(r.class_name)} — ${esc(r.subject_name)}</div><div class="qs-row-meta">${esc(p?.academic_year||"")} • ${esc(p?.term_name||"")}<br>Submitted by: <strong>${esc(r.staff_name||r.staff_id)}</strong> • ${esc(fmtDate(r.submitted_at))} • Version ${Number(r.current_version||1)}</div></div><span class="qs-status ${statusClass(r.status)}">${esc(statusLabel(r.status))}</span></div>${r.status==="returned"&&r.return_reason?`<div class="qs-reason"><strong>Return Note:</strong> ${esc(r.return_reason)}</div>`:""}<div class="qs-actions" style="margin-top:10px"><button class="qs-btn secondary" type="button" onclick="qsOpenReviewFile(${Number(r.id)})">OPEN WORD FILE</button>${canAct?`<button class="qs-btn green" type="button" onclick="qsApprove(${Number(r.id)})">✓ APPROVE</button><button class="qs-btn orange" type="button" onclick="qsOpenReturnModal(${Number(r.id)})">↩ RETURN</button>`:""}${state.isAdmin?`<button class="qs-btn red" type="button" onclick="qsAdminDeleteSubmission(${Number(r.id)})">DELETE WRONG QUESTION</button>`:""}${own&&r.status==="pending"?'<span class="qs-note">You cannot approve/return your own Question.</span>':""}${r.status==="approved"?'<span class="qs-note">Exam Routine tracker is marked Submitted automatically.</span>':""}</div></div>`;}
  window.qsOpenReviewFile=async function(submissionId){try{const r=state.review.find(x=>Number(x.id)===Number(submissionId));if(!r)throw new Error("Submission not found.");const url=await signedUrl(r.current_file_path);if(!url)throw new Error("Could not create secure file link.");window.open(url,"_blank","noopener");}catch(e){msg(qsFriendlyError(e),"error")}};
  window.qsApprove=async function(submissionId){if(!confirm("Approve this Question?\n\nThe matching Exam Routine tracker will automatically become Submitted."))return;try{msg("Approving Question...","info");await rpc("qs_review_question",{p_submission_id:Number(submissionId),p_action:"approve",p_reason:null,p_reviewer_name:actorName()});await loadReviewRows();await refreshExamTrackerIfOpen();msg("Question approved. Exam Routine tracker updated to Submitted.","success");}catch(e){msg(qsFriendlyError(e),"error")}};

  window.qsAdminDeleteSubmission=async function(submissionId){
    if(!state.isAdmin||!adminReady())return;
    const row=state.review.find(x=>Number(x.id)===Number(submissionId));
    if(!row)return;
    const period=getPeriod(row.period_id);
    if(!confirm(`DELETE WRONG QUESTION PERMANENTLY?\n\n${row.class_name} — ${row.subject_name}\n${period?.academic_year||""} • ${period?.term_name||""}\nSubmitted by: ${row.staff_name||row.staff_id}\n\nThis will also reset Question Submitted and Printed in the Exam tracker. The teacher can submit this subject again.`))return;
    try{
      msg("Deleting wrong Question and resetting Exam tracker...","info");
      const db=client();
      const {data:versions,error:versionError}=await db.from("question_submission_versions").select("file_path").eq("submission_id",Number(submissionId));
      if(versionError)throw versionError;
      const paths=[...new Set((versions||[]).map(v=>v.file_path).filter(Boolean))];
      await deleteStoragePaths(paths);
      await rpc("qs_admin_delete_submission",{p_submission_id:Number(submissionId)});
      await loadReviewRows();
      await refreshExamTrackerIfOpen();
      msg("Wrong Question deleted. Submitted/Printed tracker reset; teacher can submit again.","success");
    }catch(e){msg(qsFriendlyError(e),"error")}
  };
  let returnTargetId=null;
  window.qsOpenReturnModal=function(submissionId){returnTargetId=Number(submissionId);id("qsReturnReason").value="";id("qsReturnModal").classList.add("show");setTimeout(()=>id("qsReturnReason")?.focus(),50)};
  window.qsCloseReturnModal=function(){returnTargetId=null;id("qsReturnModal")?.classList.remove("show")};
  window.qsConfirmReturn=async function(){const reason=norm(id("qsReturnReason")?.value);if(!returnTargetId)return;if(reason.length<3){alert("Write the correction reason first.");return}try{msg("Returning Question for correction...","info");await rpc("qs_review_question",{p_submission_id:Number(returnTargetId),p_action:"return",p_reason:reason,p_reviewer_name:actorName()});qsCloseReturnModal();await loadReviewRows();msg("Question returned. The teacher can now upload a corrected Word file.","success");}catch(e){msg(qsFriendlyError(e),"error")}};

  async function refreshExamTrackerIfOpen(){try{if(typeof examCurrentPeriod!=="undefined"&&examCurrentPeriod&&typeof examLoadCurrentPeriodData==="function")await examLoadCurrentPeriodData();}catch(_){}}

  function renderWindowPane(){
    const host=id("qsPaneWindows");if(!host)return;
    host.innerHTML=`<div class="qs-card"><h3>⏰ Submission Window</h3><p class="qs-note">Create one Question Submission window for a published Exam Term. All logged-in staff can submit within this opening/deadline. Review continues separately.</p><div class="qs-grid"><label class="qs-field">Exam Term<select id="qsWindowPeriod"><option value="">— Select Exam Term —</option>${state.periods.map(p=>`<option value="${Number(p.id)}">${esc(p.academic_year)} • ${esc(p.term_name)}${p.is_published?" ✓ Published":" • Draft"}</option>`).join("")}</select></label><label class="qs-field">Open Date & Time<input id="qsWindowOpen" type="datetime-local"></label><label class="qs-field">Deadline Date & Time<input id="qsWindowDeadline" type="datetime-local"></label><label class="qs-field">Status<select id="qsWindowEnabled"><option value="true">OPEN / ENABLED</option><option value="false">CLOSED / DISABLED</option></select></label></div><div class="qs-actions" style="margin-top:12px"><button class="qs-btn" type="button" onclick="qsSaveWindow()">SAVE SUBMISSION WINDOW</button><button class="qs-btn secondary" type="button" onclick="qsLoadWindowIntoForm()">LOAD SELECTED</button></div></div><div class="qs-card"><h3>Existing Question Terms</h3><div id="qsWindowList" class="qs-list">${renderWindowRows()}</div></div>`;}
  function renderWindowRows(){if(!state.windows.length)return '<div class="qs-note">No Question Submission window created yet.</div>';return state.windows.map(w=>{const p=getPeriod(w.period_id);if(!p)return"";const open=isWindowOpen(w);return `<div class="qs-row"><div class="qs-row-head"><div><div class="qs-row-title">${esc(p.academic_year)} — ${esc(p.term_name)}</div><div class="qs-row-meta">Open: ${esc(fmtDate(w.opens_at))}<br>Deadline: ${esc(fmtDate(w.deadline_at))}</div></div><span class="qs-status ${open?"approved":"returned"}">${open?"OPEN":"CLOSED"}</span></div><div class="qs-actions" style="margin-top:9px"><button class="qs-btn secondary" type="button" onclick="qsEditWindow(${Number(w.period_id)})">EDIT</button><button class="qs-btn red" type="button" onclick="qsDeleteWindow(${Number(w.period_id)})">DELETE QUESTION TERM + ALL FILES</button></div></div>`;}).join("");}
  window.qsLoadWindowIntoForm=function(){const pid=Number(id("qsWindowPeriod")?.value||0);if(pid)qsEditWindow(pid)};
  window.qsEditWindow=function(periodId){const w=getWindow(periodId);if(!w)return;id("qsWindowPeriod").value=String(periodId);id("qsWindowOpen").value=localInputValue(w.opens_at);id("qsWindowDeadline").value=localInputValue(w.deadline_at);id("qsWindowEnabled").value=String(!!w.enabled);};
  window.qsSaveWindow=async function(){const pid=Number(id("qsWindowPeriod")?.value||0),open=toIso(id("qsWindowOpen")?.value),deadline=toIso(id("qsWindowDeadline")?.value),enabled=id("qsWindowEnabled")?.value==="true",p=getPeriod(pid);if(!pid||!open||!deadline){msg("Select Exam Term, Open Date/Time and Deadline Date/Time.","error");return}if(new Date(deadline)<=new Date(open)){msg("Deadline must be later than the opening date/time.","error");return}if(!p?.is_published){msg("Publish the Exam Routine first, then open Question Submission for that term.","error");return}try{await rpc("qs_admin_save_window",{p_period_id:pid,p_opens_at:open,p_deadline_at:deadline,p_enabled:enabled});await loadBase();renderWindowPane();msg("Submission Window saved.","success");}catch(e){msg(qsFriendlyError(e),"error")}};

  async function collectFilePaths(periodId){const db=client();const {data,error}=await db.from("question_submission_versions").select("file_path,submission_id,question_submissions!inner(period_id)").eq("question_submissions.period_id",Number(periodId));if(error)throw error;return [...new Set((data||[]).map(r=>r.file_path).filter(Boolean))];}
  async function deleteStoragePaths(paths){if(!paths.length)return;const db=client();for(let i=0;i<paths.length;i+=100){const {error}=await db.storage.from(QS_BUCKET).remove(paths.slice(i,i+100));if(error)throw error;}}
  window.qsDeleteWindow=async function(periodId){const p=getPeriod(periodId);if(!p)return;const phrase=`DELETE ${p.academic_year}`;const typed=prompt(`Permanent delete: ${p.academic_year} • ${p.term_name}\n\nThis removes ALL submitted Word files, versions, statuses and review history for this Question Term.\nThe Exam Routine itself is NOT deleted here.\n\nType exactly: ${phrase}`);if(typed!==phrase)return;try{msg("Deleting all Question files and records...","info");const paths=await collectFilePaths(periodId);await deleteStoragePaths(paths);await rpc("qs_admin_delete_window",{p_period_id:Number(periodId)});await loadBase();renderWindowPane();msg("Question Term and all its submitted files/data deleted permanently.","success");}catch(e){msg(qsFriendlyError(e),"error")}};

  function renderPermissionsPane(){const host=id("qsPanePermissions");if(!host)return;host.innerHTML=`<div class="qs-card"><h3>👥 Reviewer Permission</h3><p class="qs-note">Principal and Website Admin always have review access. Turn ON only the additional staff who may see all submitted questions and Approve / Return them. Staff without this permission never see the Question Review button.</p><div class="qs-actions"><button class="qs-btn secondary" type="button" onclick="loadReviewerPermissions()">↻ Refresh Staff List</button></div><div id="qsReviewerList" style="margin-top:10px"><div class="qs-note">Loading staff permissions...</div></div></div>`;}
  window.loadReviewerPermissions=async function(){if(!state.isAdmin)return;const host=id("qsReviewerList");if(!host)return;try{const db=client();const {data,error}=await db.from("question_reviewers").select("staff_id,staff_name,enabled,granted_by_name,granted_at").order("staff_name");if(error)throw error;state.reviewers=data||[];const directory=typeof STAFF_LOGIN_DIRECTORY!=="undefined"?STAFF_LOGIN_DIRECTORY:{};host.innerHTML=Object.entries(directory).map(([sid,s])=>{const principal=sid===(typeof PRINCIPAL_STAFF_ID!=="undefined"?PRINCIPAL_STAFF_ID:"joseph"),row=state.reviewers.find(r=>r.staff_id===sid),on=principal||!!row?.enabled;return `<div class="qs-permission-row"><div><strong>${esc(s.name||sid)}</strong><div class="qs-note">${esc(s.designation||"Staff")} • ID: ${esc(sid)}${principal?" • Principal (Always Reviewer)":""}</div></div><label class="qs-switch"><input type="checkbox" ${on?"checked":""} ${principal?"disabled":""} onchange="qsSetReviewer('${esc(sid)}',this.checked,this)"><span>${on?"Review Access ON":"Review Access OFF"}</span></label></div>`;}).join("");}catch(e){host.innerHTML=`<div class="qs-reason">${esc(qsFriendlyError(e))}</div>`;}};
  window.qsSetReviewer=async function(staffId,enabled,box){const directory=typeof STAFF_LOGIN_DIRECTORY!=="undefined"?STAFF_LOGIN_DIRECTORY:{},s=directory[staffId];if(!s)return;box.disabled=true;try{await rpc("qs_admin_set_reviewer",{p_staff_id:staffId,p_staff_name:s.name||staffId,p_enabled:!!enabled});await loadReviewerPermissions();msg(`${s.name} reviewer access ${enabled?"enabled":"removed"}.`,"success");}catch(e){box.checked=!enabled;box.disabled=false;msg(qsFriendlyError(e),"error")}};


  /* =========================================================
     V1.3 — EXAM TRACKER + UNIFIED MARKS FINAL-ACCEPT LINK
     Principal stays read-only. Only Website Admin can accept Marks.
     ========================================================= */
  const qsMarksContext=new Map();
  let qsMarksSchemaWarningShown=false;

  function qsKeyText(v){return String(v??"").trim().toLowerCase().replace(/[._()\-–—/]+/g," ").replace(/\s+/g," ").trim();}
  function qsSubjectKey(v){
    let n=qsKeyText(v).replace(/\s+/g,"");
    const aliases={
      "math":"mathematics","maths":"mathematics","गणित":"mathematics",
      "science":"science","विज्ञान":"science",
      "social":"socialstudies","socialstudy":"socialstudies","socialstudies":"socialstudies","सामाजिक":"socialstudies",
      "english":"english","अंग्रेजी":"english",
      "nepali":"nepali","नेपाली":"nepali",
      "computer":"computer","computerscience":"computer",
      "gk":"gk","generalknowledge":"gk","g.k":"gk"
    };
    return aliases[n]||n;
  }

  async function qsAdminDbRpc(name,args={}){
    const db=typeof umeAdminDb==="function"?umeAdminDb():(typeof initStudentSupabase==="function"?initStudentSupabase():null);
    if(!db)throw new Error("Admin Supabase connection is unavailable.");
    const {data,error}=await db.rpc(name,args);if(error)throw error;return data;
  }

  async function qsFindExamEntryForMarks(ctx){
    const db=typeof initStudentSupabase==="function"?initStudentSupabase():null;
    if(!db)throw new Error("Admin Supabase connection is unavailable.");
    const {data:periods,error:periodError}=await db.from("exam_periods").select("id,academic_year,term_name,is_published").eq("is_published",true);
    if(periodError)throw periodError;
    const period=(periods||[]).find(p=>qsKeyText(p.academic_year)===qsKeyText(ctx.session)&&qsKeyText(p.term_name)===qsKeyText(ctx.term));
    if(!period)throw new Error(`No matching PUBLISHED Exam Routine was found for ${ctx.session} • ${ctx.term}. Use the same Academic Session and Term name in Marks and Exam Management.`);
    const {data:entries,error:entryError}=await db.from("exam_routine_entries").select("id,period_id,class_name,activity_title,question_required").eq("period_id",Number(period.id)).eq("class_name",ctx.className);
    if(entryError)throw entryError;
    const target=(entries||[]).find(e=>qsSubjectKey(e.activity_title)===qsSubjectKey(ctx.subject));
    if(!target)throw new Error(`No matching Exam Routine subject was found for ${ctx.className} — ${ctx.subject}. Check the subject name in Overall Routine.`);
    return target;
  }

  window.qsAdminAcceptMarks=async function(projectId){
    if(!adminReady())return;
    const ctx=qsMarksContext.get(Number(projectId));if(!ctx)return;
    if(!confirm(`ACCEPT MARKS?\n\n${ctx.className} — ${ctx.subject}\n${ctx.session} • ${ctx.term}\n\nAfter acceptance, Marks Submitted will automatically show ✅ in the Exam tracker.`))return;
    try{
      const entry=await qsFindExamEntryForMarks(ctx);
      await qsAdminDbRpc("qs_admin_accept_marks",{p_entry_id:Number(entry.id),p_marks_project_id:Number(projectId),p_admin_name:"Website Admin"});
      await refreshExamTrackerIfOpen();
      if(typeof renderAdminMarks==="function")await renderAdminMarks();
      alert("Marks accepted. Exam tracker updated to Marks Submitted ✅.");
    }catch(error){alert("Marks could not be accepted: "+qsFriendlyError(error));}
  };

  async function qsAcceptedMarksIds(){
    const db=typeof initStudentSupabase==="function"?initStudentSupabase():null;
    if(!db)return new Set();
    const {data,error}=await db.from("exam_question_status").select("marks_source_project_id,marks_submitted").eq("marks_submitted",true);
    if(error)throw error;
    return new Set((data||[]).map(r=>Number(r.marks_source_project_id)).filter(Number.isFinite));
  }

  async function qsDecorateAdminMarksGroups(groups,host){
    if(!host||!Array.isArray(groups))return;
    try{
      const accepted=await qsAcceptedMarksIds();
      const cards=[...host.querySelectorAll(":scope > .ume-group")];
      groups.forEach((group,groupIndex)=>{
        const rows=typeof umeSortSubjectRows==="function"?umeSortSubjectRows(group.rows||[]):[...(group.rows||[])];
        const subjectEls=[...(cards[groupIndex]?.querySelectorAll(".ume-subjects > .ume-subject-row")||[])];
        rows.forEach((row,rowIndex)=>{
          const actions=subjectEls[rowIndex]?.querySelector(".ume-row-actions");if(!actions)return;
          const pid=Number(row.id);if(!Number.isFinite(pid))return;
          qsMarksContext.set(pid,{projectId:pid,className:group.className,session:group.session,term:group.term,subject:row.subject_name});
          const old=actions.querySelector(`[data-qs-marks-project="${pid}"]`);if(old)old.remove();
          const acceptedNow=accepted.has(pid);
          const node=document.createElement(acceptedNow?"span":"button");
          node.dataset.qsMarksProject=String(pid);
          if(acceptedNow){
            node.className="ume-status accepted_by_class_teacher";
            node.textContent="✅ MARKS ACCEPTED";
            node.title="Accepted by Website Admin; Exam tracker shows Marks Submitted.";
          }else if(row.status==="submitted_to_admin"){
            node.type="button";
            node.className="ume-btn ume-success";
            node.textContent="✓ ACCEPT MARKS";
            node.onclick=()=>qsAdminAcceptMarks(pid);
          }else{
            return;
          }
          actions.prepend(node);
        });
      });
    }catch(error){
      console.error("Marks tracker integration error",error);
      if(!qsMarksSchemaWarningShown){
        qsMarksSchemaWarningShown=true;
        const note=document.createElement("div");
        note.className="ume-empty";
        note.style.marginBottom="10px";
        note.textContent="Marks Submitted tracker update is not ready yet. Run QUESTION_SUBMISSION_UPDATE_V1_3.sql once in Supabase.";
        host.prepend(note);
      }
    }
  }

  async function qsResetMarksGroup(group){
    if(!group)return;
    await qsAdminDbRpc("qs_admin_reset_marks_group",{p_academic_session:String(group.session||""),p_term_name:String(group.term||""),p_class_name:String(group.className||"")});
    await refreshExamTrackerIfOpen();
  }

  function installMarksAdminIntegration(){
    if(typeof umeRenderGroupCards==="function"&&!umeRenderGroupCards.__qsMarksWrapped){
      const original=umeRenderGroupCards;
      const wrapped=function(role,groups,host){
        const out=original.apply(this,arguments);
        if(role==="admin")Promise.resolve().then(()=>qsDecorateAdminMarksGroups(groups,host));
        return out;
      };
      wrapped.__qsMarksWrapped=true;
      umeRenderGroupCards=wrapped;
    }
    if(typeof umeAdminReturnPackage==="function"&&!umeAdminReturnPackage.__qsMarksWrapped){
      const wrapped=async function(index){
        const group=typeof umeRoleGroups==="function"?umeRoleGroups("admin")[index]:null;if(!group)return;
        const note=prompt("Write the problem/correction note for the Class Teacher:","Please check this Class package and return the affected Subject to the Subject Teacher.");if(note===null)return;
        try{
          const count=await umeRpc(umeAdminDb(),"ume_admin_return_package",{p_class_name:group.className,p_term_name:group.term,p_academic_session:group.session,p_note:note});
          await qsResetMarksGroup(group);
          await renderAdminMarks();
          alert(`${count} Subject(s) returned to the Class Teacher. Marks Submitted ticks were reset.`);
        }catch(error){alert("Package could not be returned: "+(error.message||"Unknown error"));}
      };
      wrapped.__qsMarksWrapped=true;umeAdminReturnPackage=wrapped;
    }
    if(typeof umeAdminDeletePackage==="function"&&!umeAdminDeletePackage.__qsMarksWrapped){
      const wrapped=async function(index){
        const group=typeof umeRoleGroups==="function"?umeRoleGroups("admin")[index]:null;if(!group)return;
        if(!confirm(`PERMANENTLY DELETE ${group.className} — ${group.term} — ${group.session}?\n\nAll submitted Subjects, Components and student Marks in this package will be deleted. Marks Submitted tracker ticks will also reset. This cannot be undone.`))return;
        if(!confirm("Final confirmation: Delete this complete Class package now?"))return;
        try{
          const count=await umeRpc(umeAdminDb(),"ume_admin_delete_package",{p_class_name:group.className,p_term_name:group.term,p_academic_session:group.session});
          await qsResetMarksGroup(group);
          await renderAdminMarks();
          alert(`${count} Subject file(s) deleted permanently. Marks Submitted ticks were reset.`);
        }catch(error){alert("Package could not be deleted: "+(error.message||"Unknown error"));}
      };
      wrapped.__qsMarksWrapped=true;umeAdminDeletePackage=wrapped;
    }
  }

  async function qsMergeMarksTrackerStatus(){
    try{
      if(typeof examCurrentPeriod==="undefined"||!examCurrentPeriod||typeof examDb!=="function")return;
      const db=examDb();
      const {data,error}=await db.from("exam_question_status").select("entry_id,marks_submitted,marks_submitted_at,marks_submitted_by_name,marks_source_project_id").eq("period_id",Number(examCurrentPeriod.id));
      if(error)throw error;
      const byId=new Map((data||[]).map(r=>[Number(r.entry_id),r]));
      if(typeof examStatuses!=="undefined"&&Array.isArray(examStatuses)){
        examStatuses=examStatuses.map(row=>({...row,...(byId.get(Number(row.entry_id))||{})}));
        for(const [entryId,row] of byId){if(!examStatuses.some(x=>Number(x.entry_id)===entryId))examStatuses.push(row);}
      }
    }catch(error){console.error("Marks tracker status load error",error);}
  }

  function installExamMarksTrackerIntegration(){
    if(typeof examLoadCurrentPeriodData==="function"&&!examLoadCurrentPeriodData.__qsMarksWrapped){
      const original=examLoadCurrentPeriodData;
      const wrapped=async function(){
        const out=await original.apply(this,arguments);
        await qsMergeMarksTrackerStatus();
        if(typeof examRenderAll==="function")examRenderAll();
        return out;
      };
      wrapped.__qsMarksWrapped=true;examLoadCurrentPeriodData=wrapped;
    }
    if(typeof examTrackerCellHtml==="function"&&!examTrackerCellHtml.__qsMarksWrapped){
      const wrapped=function(day,cls){
        const e=examEntryFor(day.id,cls);
        if(!e||!examNormalize(e.activity_title))return '<td class="exam-tracker-cell"><span class="exam-special">—</span></td>';
        if(!e.question_required)return `<td class="exam-tracker-cell"><span class="exam-special">${examEscape(e.activity_title)}</span>${e.teacher_name?`<span class="exam-teacher">${examEscape(e.teacher_name)}</span>`:""}</td>`;
        const s=examStatusFor(e.id)||{},submitted=!!s.submitted,printed=!!s.printed,marks=!!s.marks_submitted,m=examIsManager();
        return `<td class="exam-tracker-cell"><span class="exam-subject">${examEscape(e.activity_title)}</span>${e.teacher_name?`<span class="exam-teacher">${examEscape(e.teacher_name)}</span>`:""}<div class="exam-status-stack"><label class="exam-status-line ${submitted?"active":""}"><span class="exam-bulb ${submitted?"on":""}">💡</span>${m?`<input type="checkbox" ${submitted?"checked":""} onchange="examSetStatus(${Number(e.id)},'submitted',this.checked)">`:submitted?"✅":"☐"}<span>${submitted?"Question Submitted":"Question Submit"}</span></label><label class="exam-status-line ${printed?"printed":""}">${m?`<input type="checkbox" ${printed?"checked":""} ${submitted?"":"disabled"} onchange="examSetStatus(${Number(e.id)},'printed',this.checked)">`:printed?"✅":"☐"}<span>🖨 ${printed?"Printed":"Print"}</span></label><div class="qs-marks-line ${marks?"done":""}">${marks?"✅":"☐"} 📊 ${marks?"Marks Submitted":"Marks Pending"}</div></div></td>`;
      };
      wrapped.__qsMarksWrapped=true;examTrackerCellHtml=wrapped;
    }
    if(typeof examPrintableTracker==="function"&&!examPrintableTracker.__qsMarksWrapped){
      const wrapped=function(){
        const head=examDays.map(d=>`<th>${examEscape(d.day_label)}<br>${examEscape(d.exam_date||"")}</th>`).join("");
        const rows=EXAM_CLASSES.map(cls=>`<tr><td><strong>${examEscape(cls)}</strong></td>${examDays.map(d=>{const e=examEntryFor(d.id,cls);if(!e?.activity_title)return"<td>—</td>";if(!e.question_required)return`<td><strong>${examEscape(e.activity_title)}</strong>${e.teacher_name?`<br>${examEscape(e.teacher_name)}`:""}</td>`;const s=examStatusFor(e.id)||{};return`<td><strong>${examEscape(e.activity_title)}</strong>${e.teacher_name?`<br>${examEscape(e.teacher_name)}`:""}<br>${s.submitted?"✅ Question Submitted":"☐ Question Submit"}<br>${s.printed?"✅ Printed":"☐ Print"}<br>${s.marks_submitted?"✅ Marks Submitted":"☐ Marks Pending"}</td>`}).join("")}</tr>`).join("");
        return `<div class="exam-table-wrap"><table class="exam-table"><thead><tr><th>CLASS</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
      };
      wrapped.__qsMarksWrapped=true;examPrintableTracker=wrapped;
    }
    if(typeof examExportCSV==="function"&&!examExportCSV.__qsMarksWrapped){
      const original=examExportCSV;
      const wrapped=function(kind){
        if(kind!=="tracker")return original.apply(this,arguments);
        if(!examCurrentSelectionReady()){examMessage("Select Academic Year and Term first.");return}
        const p=examCurrentPeriod,rows=[];
        rows.push(["Academic Year",p.academic_year],["Term",p.term_name],[]);
        rows.push(["Class",...examDays.flatMap(d=>[`${d.day_label} - Routine`,`${d.day_label} - Teacher`,`${d.day_label} - Question Submission`,`${d.day_label} - Print`,`${d.day_label} - Marks Submission`])]);
        EXAM_CLASSES.forEach(cls=>rows.push([cls,...examDays.flatMap(d=>{const e=examEntryFor(d.id,cls);if(!e)return["—","","","",""];if(!e.question_required)return[e.activity_title||"—",e.teacher_name||"","N/A","N/A","N/A"];const s=examStatusFor(e.id)||{};return[e.activity_title||"",e.teacher_name||"",s.submitted?"Submitted":"Not Submitted",s.printed?"Printed":"Not Printed",s.marks_submitted?"Marks Submitted":"Marks Pending"]})]));
        const csv="\ufeff"+rows.map(r=>r.map(examCsv).join(",")).join("\r\n"),blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`exam_tracker_${String(p.academic_year).replace(/\W+/g,"_")}_${String(p.term_name).replace(/\W+/g,"_")}.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      };
      wrapped.__qsMarksWrapped=true;examExportCSV=wrapped;
    }
    const heading=document.querySelector("#examTrackerHost")?.closest(".exam-panel,section,div")?.querySelector("h3,h4");
    if(heading&&/Question Submission/i.test(heading.textContent||""))heading.textContent="✅ Question, Printing & Marks Tracker";
  }

  function installV13Integrations(){
    ensureEntryButtons();
    installMarksAdminIntegration();
    installExamMarksTrackerIntegration();
    if(typeof openStaffDashboard==="function"&&!openStaffDashboard.__qsButtonWrapped){
      const original=openStaffDashboard;
      const wrapped=async function(){const out=await original.apply(this,arguments);ensureEntryButtons();return out;};
      wrapped.__qsButtonWrapped=true;openStaffDashboard=wrapped;
    }
  }

  function qsFriendlyError(e){const m=String(e?.message||e||"Unknown error");if(/question_submission_|question_reviewers|qs_/i.test(m)&&/does not exist|42P01|function/i.test(m))return "Question Submission database is not ready. Run QUESTION_SUBMISSION_UPDATE_V1_3.sql once in Supabase, then refresh.";if(/row-level security|permission denied|not allowed/i.test(m))return "This account does not have permission for that Question Submission action.";if(/duplicate key|question_submissions_entry_id_key/i.test(m))return "This Class + Subject has already been submitted and is locked.";if(/deadline|closed/i.test(m))return m;return m;}

  /* If Admin deletes an entire Exam Term from existing Exam Management, clean Question files first. */
  function hookExamDelete(){
    if(typeof window.examDeleteCurrentPeriod!=="function"||window.examDeleteCurrentPeriod.__qsWrapped)return;
    const original=window.examDeleteCurrentPeriod;
    const wrapped=async function(){
      try{
        if(typeof examCurrentPeriod!=="undefined"&&examCurrentPeriod){
          const probeDb=adminReady()?initStudentSupabase():(typeof initStaffSupabase==="function"?initStaffSupabase():null);
          if(probeDb){
            const {data,error}=await probeDb.from("question_submission_windows").select("period_id").eq("period_id",Number(examCurrentPeriod.id)).maybeSingle();
            if(!error&&data&&!adminReady()){
              alert("This Exam Term has Question Submission data. For safety, delete it from Website Admin so all private Word files can also be removed.");
              return;
            }
            if(!error&&data&&adminReady()){
              const db=initStudentSupabase();
              const paths=await (async()=>{const {data:rows,error:er}=await db.from("question_submission_versions").select("file_path,submission_id,question_submissions!inner(period_id)").eq("question_submissions.period_id",Number(examCurrentPeriod.id));if(er)throw er;return [...new Set((rows||[]).map(r=>r.file_path).filter(Boolean))];})();
              if(paths.length){const {error:se}=await db.storage.from(QS_BUCKET).remove(paths);if(se)throw se;}
            }
          }
        }
      }catch(e){alert("Exam delete stopped because Question files could not be cleaned safely: "+qsFriendlyError(e));return;}
      return original.apply(this,arguments);
    };wrapped.__qsWrapped=true;window.examDeleteCurrentPeriod=wrapped;
  }

  document.addEventListener("DOMContentLoaded",()=>{injectStyles();ensurePopup();installV13Integrations();hookExamDelete();setTimeout(()=>{installV13Integrations();hookExamDelete();},1200);setTimeout(()=>{ensureEntryButtons();},3000);});
})();
