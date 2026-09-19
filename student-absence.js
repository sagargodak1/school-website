/* =========================================================
   ST. AUGUSTINE ACADEMIC FOUNDATION
   STUDENT ABSENCE / DAILY ABSENTEE MONITORING — V1.1
   Safe overlay: does not replace existing Staff/Question/Marks logic.
   ========================================================= */
(function(){
  "use strict";

  const SA_CLASSES=["Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"];
  const SA_BS_MONTHS=["","Baisakh","Jestha","Ashadh","Shrawan","Bhadra","Asoj","Kartik","Mangsir","Poush","Magh","Falgun","Chaitra"];
  const state={source:"staff",monitor:false,assignment:null,roster:[],history:[],statuses:[],teacherTab:"today",historyDate:"",monitorDate:"",monitorClass:"",todayBs:""};

  function id(v){return document.getElementById(v);}
  function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");}
  function staffReady(){return typeof loggedInStaff!=="undefined"&&!!loggedInStaff&&typeof staffAuthSession!=="undefined"&&!!staffAuthSession?.user?.id;}
  function adminReady(){return typeof studentAdminSession!=="undefined"&&!!studentAdminSession&&typeof isWebsiteAdminSession==="function"&&isWebsiteAdminSession(studentAdminSession);}
  function principalReady(){return staffReady()&&String(loggedInStaff.username||"").trim().toLowerCase()===(typeof PRINCIPAL_STAFF_ID!=="undefined"?String(PRINCIPAL_STAFF_ID).toLowerCase():"joseph");}
  function db(){
    if(state.source==="admin") return typeof initStudentSupabase==="function"?initStudentSupabase():null;
    return typeof initStaffSupabase==="function"?initStaffSupabase():null;
  }
  async function rpc(name,args={}){const c=db();if(!c)throw new Error("Supabase connection is unavailable.");const {data,error}=await c.rpc(name,args);if(error)throw error;return data||[];}
  function todayKtm(){
    const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kathmandu",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
    const map={};parts.forEach(p=>map[p.type]=p.value);return `${map.year}-${map.month}-${map.day}`;
  }
  function normalizeBs(v){
    const m=String(v||"").trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if(!m)return "";
    const mo=Number(m[2]),d=Number(m[3]);
    if(mo<1||mo>12||d<1||d>32)return "";
    return `${m[1]}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  }
  function fmtBs(v){
    const n=normalizeBs(v);if(!n)return String(v||"—");
    const [y,m,d]=n.split("-");return `${y}-${m}-${d} BS${SA_BS_MONTHS[Number(m)]?` • ${SA_BS_MONTHS[Number(m)]} ${Number(d)}`:""}`;
  }
  function fmtDate(v){if(!v)return "—";try{return new Date(`${v}T00:00:00+05:45`).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});}catch(_){return String(v)}}
  async function loadTodayBs(){
    const raw=await rpc("sa_today_bs",{});
    const value=normalizeBs(Array.isArray(raw)?raw[0]:raw);
    if(!value)throw new Error("Nepali date could not be loaded.");
    state.todayBs=value;return value;
  }
  function fmtDateTime(v){if(!v)return "—";try{return new Date(v).toLocaleString("en-GB",{timeZone:"Asia/Kathmandu",day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});}catch(_){return String(v)}}
  function parentLabel(v){return v==="informed"?"Informed":v==="not_informed"?"Not Informed":"—";}
  function msg(text,type="info"){
    const box=id("saMessage");if(!box)return;box.className=`sa-message ${type}`;box.textContent=text||"";
    if(text&&type==="success")setTimeout(()=>{if(box.textContent===text)box.textContent="";},4000);
  }
  function friendlyError(e){
    const m=String(e?.message||e||"Unknown error");
    if(/sa_get_|sa_submit_|student_absence_|does not exist|42P01|function/i.test(m)) return "Student Absence database is not ready. Run STUDENT_ABSENCE_V1_1_FIXED.sql in Supabase, then refresh the website.";
    if(/attendance_date.*ambiguous|ambiguous.*attendance_date/i.test(m)) return "Student Absence database needs the V1.1 SQL fix. Run STUDENT_ABSENCE_V1_1_FIXED.sql in Supabase.";
    if(/Parent Information/i.test(m)) return "Please select Parent Information for all absent students.";
    if(/Nepali calendar mapping|Nepali date/i.test(m)) return m;
    if(/permission|not authorized|Staff login|Admin login/i.test(m)) return m;
    return m;
  }

  function injectStyles(){
    if(id("saAddonStyles"))return;
    const s=document.createElement("style");s.id="saAddonStyles";s.textContent=`
      #studentAbsencePopup{z-index:100650}.sa-box{width:min(1180px,96vw);max-height:94vh;overflow:auto;background:#f7fafc;border-radius:22px;padding:0;box-shadow:0 26px 85px rgba(15,35,65,.30)}
      .sa-hero{padding:22px 24px;background:linear-gradient(135deg,#7b2cbf,#4c1d95);color:#fff;border-radius:22px 22px 0 0;display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.sa-hero h2{margin:0 0 5px;font-size:26px}.sa-hero p{margin:0;opacity:.92}.sa-role{padding:8px 12px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.15);border-radius:999px;font-size:12px;font-weight:900;white-space:nowrap}
      .sa-body{padding:18px}.sa-message{min-height:20px;margin-bottom:10px;font-size:13px;font-weight:800}.sa-message.error{color:#b42318}.sa-message.success{color:#147a49}.sa-message.info{color:#405a70}
      .sa-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.sa-tab,.sa-btn{border:0;border-radius:11px;padding:10px 13px;font-weight:850;cursor:pointer}.sa-tab{background:#ede9fe;color:#4c1d95}.sa-tab.active{background:#5b21b6;color:#fff}.sa-tab.close{margin-left:auto;background:#edf2f7;color:#334155}.sa-btn{background:#5b21b6;color:#fff}.sa-btn.secondary{background:#e9eef5;color:#334155}.sa-btn.green{background:#137a4a}.sa-btn:disabled{opacity:.55;cursor:not-allowed}
      .sa-card{background:#fff;border:1px solid #dbe4ee;border-radius:16px;padding:15px;margin-bottom:13px;box-shadow:0 5px 16px rgba(38,55,75,.05)}.sa-card h3{margin:0 0 8px;color:#263b50}.sa-note{font-size:12px;line-height:1.5;color:#65788a}.sa-toolbar{display:flex;gap:10px;align-items:end;flex-wrap:wrap}.sa-field{display:grid;gap:5px;font-size:12px;font-weight:800;color:#40576b}.sa-field input,.sa-field select{border:1px solid #cbd7e2;border-radius:10px;padding:9px 10px;background:#fff;color:#22384b;min-width:160px}.sa-field select.sa-invalid{border-color:#d92d20!important;box-shadow:0 0 0 2px rgba(217,45,32,.10)}
      .sa-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:12px 0}.sa-stat{background:#fff;border:1px solid #dde7f0;border-radius:13px;padding:12px}.sa-stat strong{display:block;font-size:21px;color:#263b50}.sa-stat span{font-size:11px;color:#6a7d8f;font-weight:800;text-transform:uppercase;letter-spacing:.03em}
      .sa-table-wrap{overflow:auto;border:1px solid #e0e8f0;border-radius:13px}.sa-table{width:100%;border-collapse:collapse;font-size:13px;background:#fff}.sa-table th,.sa-table td{padding:10px;border-bottom:1px solid #e7edf3;text-align:left;vertical-align:middle}.sa-table th{background:#f3f6fa;color:#3c5267;font-size:11px;text-transform:uppercase;letter-spacing:.035em;position:sticky;top:0;z-index:1}.sa-table tr:last-child td{border-bottom:0}.sa-student{font-weight:850;color:#20394e}.sa-sub{font-size:11px;color:#738596;margin-top:3px}.sa-check{width:20px;height:20px;accent-color:#5b21b6}.sa-parent{min-width:145px;border:1px solid #cbd7e2;border-radius:9px;padding:8px;background:#fff}.sa-parent:disabled{background:#f2f5f8;color:#9aa8b4}.sa-day{display:inline-flex;min-width:56px;justify-content:center;padding:5px 9px;border-radius:999px;background:#f3e8ff;color:#6b21a8;font-size:11px;font-weight:900}.sa-parent-chip{display:inline-flex;padding:5px 9px;border-radius:999px;font-size:11px;font-weight:900}.sa-parent-chip.informed{background:#dcfce7;color:#166534}.sa-parent-chip.not_informed{background:#fee2e2;color:#991b1b}
      .sa-status-good{color:#147a49;font-weight:850}.sa-status-warn{color:#a15c00;font-weight:850}.sa-empty{padding:24px;text-align:center;color:#6c7f90;background:#fff;border:1px dashed #cbd7e2;border-radius:13px}.sa-not-submitted{margin-top:10px;padding:10px 12px;border-radius:10px;background:#fff5e8;color:#8b5400;font-size:12px;font-weight:800}.sa-savebar{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;margin-top:13px}.sa-savebar .sa-note{max-width:650px}
      #staffDashboardStudentAbsenceAction{display:flex!important;position:relative!important;overflow:hidden!important;background:linear-gradient(135deg,#7b2cbf,#5b21b6)!important;border:0!important;color:#fff!important;box-shadow:0 9px 24px rgba(91,33,182,.22)!important}.staff-dashboard-quick-actions #staffDashboardStudentAbsenceAction .staff-dashboard-action-icon{background:rgba(255,255,255,.16)!important;color:#fff!important;border:1px solid rgba(255,255,255,.22)!important}.staff-dashboard-quick-actions #staffDashboardStudentAbsenceAction .staff-dashboard-action-copy,.staff-dashboard-quick-actions #staffDashboardStudentAbsenceAction .staff-dashboard-action-copy strong,.staff-dashboard-quick-actions #staffDashboardStudentAbsenceAction .staff-dashboard-action-copy small,.staff-dashboard-quick-actions #staffDashboardStudentAbsenceAction .staff-dashboard-action-arrow{color:#fff!important}
      @media(max-width:760px){.sa-hero{display:block}.sa-role{display:inline-flex;margin-top:10px}.sa-body{padding:11px}.sa-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.sa-box{width:98vw;max-height:97vh}.sa-table{min-width:720px}.sa-tab.close{margin-left:0}}
    `;document.head.appendChild(s);
  }

  function ensurePopup(){
    if(id("studentAbsencePopup"))return;
    const w=document.createElement("div");w.id="studentAbsencePopup";w.className="popup";w.setAttribute("role","dialog");w.setAttribute("aria-modal","true");w.innerHTML=`
      <div class="sa-box">
        <div class="sa-hero"><div><h2>📋 Student Absence</h2><p>Daily absentee submission • Parent information • Consecutive absence monitoring</p></div><div id="saRoleBadge" class="sa-role">STAFF</div></div>
        <div class="sa-body">
          <div id="saTabs" class="sa-tabs"></div>
          <div id="saMessage" class="sa-message"></div>
          <div id="saContent"><div class="sa-empty">Loading Student Absence…</div></div>
        </div>
      </div>`;
    document.body.appendChild(w);
  }

  function ensureEntryButtons(){
    const quick=document.querySelector("#staffDashboardPopup .staff-dashboard-quick-actions");
    if(quick){
      let b=id("staffDashboardStudentAbsenceAction");
      if(!b){
        b=document.createElement("button");b.id="staffDashboardStudentAbsenceAction";b.type="button";b.className="staff-dashboard-action";
        b.innerHTML='<span class="staff-dashboard-action-icon">📋</span><span class="staff-dashboard-action-copy"><strong>Student Absence</strong><small>Daily absent students • Parent informed status</small></span><span class="staff-dashboard-action-arrow">→</span>';
        b.addEventListener("click",()=>openStudentAbsence("staff"));
      }
      if(!b.isConnected){const q=id("staffDashboardQuestionSubmissionAction"),m=id("staffDashboardMarksAction");if(q&&q.parentElement===quick)q.insertAdjacentElement("afterend",b);else if(m&&m.parentElement===quick)m.insertAdjacentElement("afterend",b);else quick.appendChild(b);}
    }
    const tabs=document.querySelector("#websiteAdminPanel .website-admin-tabs");
    if(tabs){
      let b=id("websiteAdminStudentAbsenceButton");
      if(!b){b=document.createElement("button");b.id="websiteAdminStudentAbsenceButton";b.type="button";b.textContent="📋 Student Absence";b.addEventListener("click",()=>openStudentAbsence("admin"));}
      if(!b.isConnected){const q=id("websiteAdminQuestionSubmissionButton"),e=id("websiteAdminExamButton");if(q&&q.parentElement===tabs)q.insertAdjacentElement("afterend",b);else if(e&&e.parentElement===tabs)e.insertAdjacentElement("afterend",b);else tabs.appendChild(b);}
    }
  }

  function renderTabs(){
    const t=id("saTabs");if(!t)return;
    if(state.monitor){
      t.innerHTML='<button class="sa-tab active" type="button">📊 Absence Monitor</button><button class="sa-tab close" type="button" onclick="closeStudentAbsence()">✕ Close</button>';
    }else if(state.assignment){
      t.innerHTML=`<button id="saTabToday" class="sa-tab ${state.teacherTab==="today"?"active":""}" type="button" onclick="saShowTeacherTab('today')">☑ Take Today&apos;s Absence</button><button id="saTabHistory" class="sa-tab ${state.teacherTab==="history"?"active":""}" type="button" onclick="saShowTeacherTab('history')">📅 Absence History</button><button class="sa-tab close" type="button" onclick="closeStudentAbsence()">✕ Close</button>`;
    }else{
      t.innerHTML='<button class="sa-tab close" style="margin-left:auto" type="button" onclick="closeStudentAbsence()">✕ Close</button>';
    }
  }

  async function loadAssignment(){
    if(state.monitor){state.assignment=null;return;}
    const rows=await rpc("sa_get_my_assignment",{});state.assignment=rows[0]||null;
  }

  window.openStudentAbsence=async function(source="staff"){
    state.source=String(source||"staff").toLowerCase()==="admin"?"admin":"staff";
    if(state.source==="admin"&&!adminReady()){if(typeof openStudentAdminLogin==="function")openStudentAdminLogin();return;}
    if(state.source!=="admin"&&!staffReady()){if(typeof openStaffLogin==="function")openStaffLogin();return;}
    state.monitor=state.source==="admin"||principalReady();
    state.historyDate="";state.monitorDate="";state.monitorClass="";state.teacherTab="today";state.todayBs="";
    injectStyles();ensurePopup();ensureEntryButtons();
    if(state.source==="admin"&&typeof closeWebsiteAdminPanel==="function")closeWebsiteAdminPanel();
    if(state.source!=="admin"&&typeof closeStaffDashboard==="function")closeStaffDashboard();
    id("studentAbsencePopup").style.display="block";document.body.style.overflow="hidden";
    id("saRoleBadge").textContent=state.source==="admin"?"ADMIN — ALL CLASSES":state.monitor?"PRINCIPAL — ALL CLASSES":"CLASS TEACHER";
    msg("Loading Student Absence…","info");
    try{
      await loadTodayBs();state.historyDate=state.todayBs;state.monitorDate=state.todayBs;
      await loadAssignment();renderTabs();
      if(state.monitor)await renderMonitor();
      else if(state.assignment)await renderTeacherToday();
      else renderNoAssignment();
      msg("","info");
    }catch(e){console.error("Student Absence open error",e);renderTabs();id("saContent").innerHTML=`<div class="sa-empty">${esc(friendlyError(e))}</div>`;msg(friendlyError(e),"error");}
  };

  window.closeStudentAbsence=function(){const p=id("studentAbsencePopup");if(p)p.style.display="none";document.body.style.overflow="auto";msg("","info");};

  function renderNoAssignment(){
    id("saContent").innerHTML=`<div class="sa-card"><h3>Student Absence</h3><div class="sa-empty"><strong>No Class Teacher attendance assignment is configured for this Staff account.</strong><br><br>Student Absence is visible to all Staff, but daily submission is available to the assigned Class Teacher. Principal and Website Admin can monitor all Classes.</div></div>`;
  }

  window.saShowTeacherTab=async function(tab){state.teacherTab=tab==="history"?"history":"today";renderTabs();msg("","info");if(state.teacherTab==="history")await renderTeacherHistory();else await renderTeacherToday();};

  async function renderTeacherToday(){
    const date=todayKtm(),dateBs=state.todayBs||"";id("saContent").innerHTML='<div class="sa-empty">Loading today&apos;s Class roster…</div>';
    try{
      const [roster,statuses]=await Promise.all([rpc("sa_get_roster",{p_date:date}),rpc("sa_get_submission_status_bs",{p_date_bs:dateBs})]);
      state.roster=(roster||[]).map(r=>({...r,is_absent:!!r.is_absent,parent_information:r.parent_information||""}));state.statuses=statuses||[];
      const submitted=!!state.statuses[0]?.submitted||!!state.roster[0]?.class_submitted;
      const absent=state.roster.filter(r=>r.is_absent).length;
      id("saContent").innerHTML=`
        <div class="sa-card"><h3>☑ Today&apos;s Absence — ${esc(state.assignment.class_name)}</h3><div class="sa-toolbar"><label class="sa-field">Nepali Date (BS)<input type="text" value="${esc(dateBs)}" disabled></label><div class="sa-note"><strong>${esc(state.assignment.staff_name)}</strong><br>${state.roster.length} students • Tick absent students only.</div></div>${submitted?'<div class="sa-not-submitted" style="background:#eefbf4;color:#176b43">Today&apos;s attendance was already submitted. You may update it again today if a correction is needed.</div>':""}</div>
        <div class="sa-card"><div class="sa-table-wrap"><table class="sa-table"><thead><tr><th>Roll / ID</th><th>Student</th><th>Absent</th><th>Absence Day</th><th>Parent Information</th></tr></thead><tbody>${state.roster.map((r,i)=>teacherRow(r,i)).join("")||'<tr><td colspan="5">No students found in this Class.</td></tr>'}</tbody></table></div>
        <div class="sa-savebar"><div class="sa-note"><strong>Rule:</strong> Parent Information starts at None. For every ticked absent student, choose <strong>Informed</strong> or <strong>Not Informed</strong>. Present students are not sent to Admin/Principal.</div><button id="saSubmitBtn" class="sa-btn green" type="button" onclick="saSubmitToday()" ${state.roster.length?"":"disabled"}>${submitted?"UPDATE TODAY'S ABSENCE":"SUBMIT TODAY'S ABSENCE"}</button></div></div>
        <div class="sa-card"><strong>Current selection:</strong> <span id="saSelectionCount">${absent}</span> absent student(s).</div>`;
    }catch(e){id("saContent").innerHTML=`<div class="sa-empty">${esc(friendlyError(e))}</div>`;msg(friendlyError(e),"error");}
  }

  function teacherRow(r,i){
    const checked=r.is_absent?"checked":"",disabled=r.is_absent?"":"disabled";
    return `<tr id="saRow${i}"><td><strong>${esc(r.student_id)}</strong></td><td><div class="sa-student">${esc(r.student_name)}</div><div class="sa-sub">${esc(r.class_name)}</div></td><td><input class="sa-check" type="checkbox" ${checked} onchange="saAbsenceToggle(${i},this.checked)"></td><td><span id="saDay${i}" class="sa-day" style="${r.is_absent?"":"display:none"}">${Number(r.proposed_absence_day||1)} Day${Number(r.proposed_absence_day||1)===1?"":"s"}</span></td><td><select id="saParent${i}" class="sa-parent" ${disabled} onchange="saParentChanged(${i},this.value)"><option value="">— None / Select —</option><option value="informed" ${r.parent_information==="informed"?"selected":""}>Informed</option><option value="not_informed" ${r.parent_information==="not_informed"?"selected":""}>Not Informed</option></select></td></tr>`;
  }

  window.saAbsenceToggle=function(index,checked){const r=state.roster[index];if(!r)return;r.is_absent=!!checked;const sel=id(`saParent${index}`),day=id(`saDay${index}`);if(sel){sel.disabled=!checked;sel.classList.remove("sa-invalid");}if(day)day.style.display=checked?"inline-flex":"none";const c=id("saSelectionCount");if(c)c.textContent=String(state.roster.filter(x=>x.is_absent).length);};
  window.saParentChanged=function(index,value){if(!state.roster[index])return;state.roster[index].parent_information=value||"";id(`saParent${index}`)?.classList.remove("sa-invalid");};

  window.saSubmitToday=async function(){
    const selected=state.roster.filter(r=>r.is_absent);let invalid=false;
    selected.forEach(r=>{const i=state.roster.indexOf(r),sel=id(`saParent${i}`);if(!r.parent_information){invalid=true;sel?.classList.add("sa-invalid");}});
    if(invalid){msg("Please select Parent Information for all absent students.","error");return;}
    const btn=id("saSubmitBtn"),old=btn?.textContent||"SUBMIT TODAY'S ABSENCE";if(btn){btn.disabled=true;btn.textContent="SAVING…";}
    try{
      const payload=selected.map(r=>({student_id:r.student_id,parent_information:r.parent_information}));
      const result=await rpc("sa_submit_today_absence",{p_absent:payload});const count=Number(result?.[0]?.absent_count??payload.length);
      msg(count?`Attendance submitted successfully. ${count} student(s) absent today.`:"Attendance submitted successfully. No students are absent today.","success");
      await renderTeacherToday();
    }catch(e){console.error("Student Absence submit error",e);msg(friendlyError(e),"error");if(btn){btn.disabled=false;btn.textContent=old;}}
  };

  async function renderTeacherHistory(){
    const date=normalizeBs(state.historyDate)||state.todayBs;id("saContent").innerHTML='<div class="sa-empty">Loading absence history…</div>';
    try{
      const [rows,statuses]=await Promise.all([rpc("sa_get_absence_history_bs",{p_date_bs:date,p_class:state.assignment.class_name}),rpc("sa_get_submission_status_bs",{p_date_bs:date})]);
      state.history=rows||[];state.statuses=statuses||[];const st=state.statuses[0],submitted=!!st?.submitted,informed=state.history.filter(r=>r.parent_information==="informed").length,notInformed=state.history.filter(r=>r.parent_information==="not_informed").length;
      id("saContent").innerHTML=`<div class="sa-card"><h3>📅 Absence History — ${esc(state.assignment.class_name)}</h3><div class="sa-toolbar"><label class="sa-field">Nepali Date (BS)<input id="saTeacherHistoryDate" type="text" inputmode="numeric" maxlength="10" placeholder="2083-06-03" value="${esc(date)}" onchange="saTeacherHistoryDateChanged(this.value)"></label><button class="sa-btn secondary" type="button" onclick="saTeacherHistoryDateChanged('${esc(state.todayBs)}')">Today</button><div class="sa-note">Enter Nepali date as <strong>YYYY-MM-DD</strong> to see who was absent that day.</div></div></div>
      <div class="sa-summary"><div class="sa-stat"><strong>${submitted?"Yes":"No"}</strong><span>Submitted</span></div><div class="sa-stat"><strong>${state.history.length}</strong><span>Absent</span></div><div class="sa-stat"><strong>${informed}</strong><span>Informed</span></div><div class="sa-stat"><strong>${notInformed}</strong><span>Not Informed</span></div></div>
      ${submitted?historyTable(state.history):'<div class="sa-not-submitted">Attendance was not submitted for this Class on '+esc(fmtBs(date))+'.</div>'}`;
    }catch(e){id("saContent").innerHTML=`<div class="sa-empty">${esc(friendlyError(e))}</div>`;msg(friendlyError(e),"error");}
  }
  window.saTeacherHistoryDateChanged=async function(v){
    const n=normalizeBs(v);
    if(!n){msg("Enter Nepali date as YYYY-MM-DD. Example: 2083-06-03.","error");return;}
    state.historyDate=n;await renderTeacherHistory();
  };

  async function renderMonitor(){
    const date=normalizeBs(state.monitorDate)||state.todayBs,cls=state.monitorClass||"";id("saContent").innerHTML='<div class="sa-empty">Loading whole-school absence monitor…</div>';
    try{
      const [rows,statuses]=await Promise.all([rpc("sa_get_absence_history_bs",{p_date_bs:date,p_class:cls||null}),rpc("sa_get_submission_status_bs",{p_date_bs:date})]);
      state.history=rows||[];state.statuses=statuses||[];
      const relevant=cls?state.statuses.filter(s=>s.class_name===cls):state.statuses,submitted=relevant.filter(s=>s.submitted).length,total=relevant.length,informed=state.history.filter(r=>r.parent_information==="informed").length,notInformed=state.history.filter(r=>r.parent_information==="not_informed").length,missing=relevant.filter(s=>!s.submitted).map(s=>s.class_name);
      id("saContent").innerHTML=`<div class="sa-card"><h3>📊 Student Absence Monitor</h3><div class="sa-toolbar"><label class="sa-field">Nepali Date (BS)<input id="saMonitorDate" type="text" inputmode="numeric" maxlength="10" placeholder="2083-06-03" value="${esc(date)}" onchange="saMonitorFilterChanged()"></label><label class="sa-field">Class<select id="saMonitorClass" onchange="saMonitorFilterChanged()"><option value="">All Classes</option>${SA_CLASSES.map(c=>`<option value="${esc(c)}" ${c===cls?"selected":""}>${esc(c)}</option>`).join("")}</select></label><button class="sa-btn secondary" type="button" onclick="saMonitorToday()">Today</button><div class="sa-note">Only absent students are shown. Present students are never included in this list.</div></div></div>
      <div class="sa-summary"><div class="sa-stat"><strong>${state.history.length}</strong><span>Total Absent</span></div><div class="sa-stat"><strong>${informed}</strong><span>Informed</span></div><div class="sa-stat"><strong>${notInformed}</strong><span>Not Informed</span></div><div class="sa-stat"><strong>${submitted}/${total}</strong><span>Classes Submitted</span></div></div>
      ${missing.length?`<div class="sa-not-submitted"><strong>Attendance Not Submitted:</strong> ${esc(missing.join(", "))}</div>`:""}
      <div class="sa-card"><div class="sa-note" style="margin-bottom:9px">Selected Nepali date: <strong>${esc(fmtBs(date))}</strong>${cls?` • Class: <strong>${esc(cls)}</strong>`:" • All Classes"}</div>${historyTable(state.history)}</div>`;
      msg("","info");
    }catch(e){id("saContent").innerHTML=`<div class="sa-empty">${esc(friendlyError(e))}</div>`;msg(friendlyError(e),"error");}
  }

  function historyTable(rows){
    if(!rows.length)return '<div class="sa-empty">No absent students found for the selected date/class.</div>';
    return `<div class="sa-table-wrap"><table class="sa-table"><thead><tr><th>Class</th><th>Roll / ID</th><th>Student</th><th>Absence Day</th><th>Parent Information</th><th>Submitted By</th></tr></thead><tbody>${rows.map(r=>`<tr><td><strong>${esc(r.class_name)}</strong></td><td>${esc(r.student_id)}</td><td><div class="sa-student">${esc(r.student_name)}</div><div class="sa-sub">${esc(fmtBs(r.attendance_date_bs||""))}</div></td><td><span class="sa-day">${Number(r.absence_day||1)} Day${Number(r.absence_day||1)===1?"":"s"}</span></td><td><span class="sa-parent-chip ${esc(r.parent_information)}">${esc(parentLabel(r.parent_information))}</span></td><td>${esc(r.submitted_by_name||"—")}<div class="sa-sub">${esc(fmtDateTime(r.submitted_at))}</div></td></tr>`).join("")}</tbody></table></div>`;
  }

  window.saMonitorFilterChanged=async function(){const n=normalizeBs(id("saMonitorDate")?.value||"");if(!n){msg("Enter Nepali date as YYYY-MM-DD. Example: 2083-06-03.","error");return;}state.monitorDate=n;state.monitorClass=id("saMonitorClass")?.value||"";await renderMonitor();};
  window.saMonitorToday=async function(){state.monitorDate=state.todayBs;state.monitorClass=id("saMonitorClass")?.value||"";await renderMonitor();};

  function installIntegration(){
    ensureEntryButtons();
    if(typeof openStaffDashboard==="function"&&!openStaffDashboard.__saWrapped){const original=openStaffDashboard;const wrapped=async function(){const out=await original.apply(this,arguments);ensureEntryButtons();return out;};wrapped.__saWrapped=true;openStaffDashboard=wrapped;}
    if(typeof openWebsiteAdminPanel==="function"&&!openWebsiteAdminPanel.__saWrapped){const original=openWebsiteAdminPanel;const wrapped=function(){const out=original.apply(this,arguments);setTimeout(ensureEntryButtons,0);return out;};wrapped.__saWrapped=true;openWebsiteAdminPanel=wrapped;}
  }

  document.addEventListener("DOMContentLoaded",()=>{injectStyles();ensurePopup();installIntegration();setTimeout(installIntegration,700);setTimeout(ensureEntryButtons,1800);});
  const observer=new MutationObserver(()=>ensureEntryButtons());
  if(document.body)observer.observe(document.body,{childList:true,subtree:true});else document.addEventListener("DOMContentLoaded",()=>observer.observe(document.body,{childList:true,subtree:true}),{once:true});
})();
