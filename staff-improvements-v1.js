/* ============================================================
   ST. AUGUSTINE ACADEMIC FOUNDATION
   Staff Improvements v1 - 2026-09-24

   1) Parent Concern / Suggestion system
      - all staff can choose Nursery-Class 10 and submit
      - staff can filter/read their own history and status
      - Principal/Admin can classify, update, comment and resolve
   2) Staff Self Password Reset
      - no current password field
      - New Password + Confirm Password
      - successful reset signs the current staff session out

   Additive module: does not replace app.js, style.css, attendance,
   question-submission, marks, or any existing feature.
   ============================================================ */

(() => {
  'use strict';

  const PC_CLASSES = [
    'Nursery','LKG','UKG','Class 1','Class 2','Class 3','Class 4','Class 5',
    'Class 6','Class 7','Class 8','Class 9','Class 10'
  ];

  const PC_CONCERNS = [
    'Homework is not completed regularly',
    'Does not study regularly at home',
    'Difficulty concentrating on study',
    'Refuses to eat properly',
    'Does not want to come to school',
    'Excessive mobile / TV use',
    'Sleeps late at night',
    'Difficulty waking up in the morning',
    'Does not follow parents’ instructions',
    'Frequent anger / stubborn behaviour',
    'Does not share school information at home',
    'Difficulty completing schoolwork independently',
    'Needs extra academic support',
    'Concern about attendance / late arrival',
    'Concern about friends / peer relationship',
    'Noticeable change in behaviour at home',
    'Health-related concern affecting school',
    'Fear or anxiety about school / study',
    'Parent wants a meeting with the teacher / school',
    'Parent suggestion for class or school improvement'
  ];

  const STATUS_LABELS = {
    pending: 'Pending', reviewed: 'Reviewed', in_progress: 'In Progress',
    solved: 'Solved', closed: 'Closed'
  };
  const PRIORITY_LABELS = {
    normal: 'Normal', important: 'Important', serious: 'Serious', urgent: 'Urgent'
  };
  const CATEGORY_LABELS = {
    academic: 'Academic', behaviour: 'Behaviour', attendance: 'Attendance',
    health: 'Health', home_support: 'Home Support', parent_suggestion: 'Parent Suggestion', other: 'Other'
  };

  let pcMyRows = [];
  let pcManagerRows = [];
  let pcCurrentView = 'new';
  let pcObserver = null;

  function esc(value){
    return String(value ?? '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  function pcLoggedInStaff(){
    try{ if(typeof loggedInStaff !== 'undefined') return loggedInStaff; }catch(_){}
    return window.loggedInStaff || null;
  }

  function pcAdminSession(){
    try{ if(typeof studentAdminSession !== 'undefined') return studentAdminSession; }catch(_){}
    return window.studentAdminSession || null;
  }

  function pcStaffDirectory(){
    try{ if(typeof STAFF_LOGIN_DIRECTORY !== 'undefined') return STAFF_LOGIN_DIRECTORY || {}; }catch(_){}
    return window.STAFF_LOGIN_DIRECTORY || {};
  }

  function pcStaffId(){
    const staff = pcLoggedInStaff();
    return String(staff?.username || staff?.staff_id || '').trim().toLowerCase();
  }

  function pcStaffName(){
    const staff = pcLoggedInStaff();
    const directory = pcStaffDirectory();
    return String(
      staff?.name ||
      staff?.staff_name ||
      staff?.display_name ||
      directory?.[pcStaffId()]?.name ||
      pcStaffId() ||
      'Website Admin'
    ).trim();
  }

  function pcIsPrincipal(){
    const id = pcStaffId();
    const staff = pcLoggedInStaff();
    const directory = pcStaffDirectory();
    const designation = String(staff?.designation || directory?.[id]?.designation || '').toLowerCase();
    return id === 'joseph' || designation === 'principal' || designation.includes('principal');
  }

  function pcIsWebsiteAdmin(){
    return !!pcAdminSession()?.access_token && !pcLoggedInStaff();
  }

  function pcIsManager(){
    return pcIsPrincipal() || pcIsWebsiteAdmin();
  }

  function pcDb(){
    const staff = pcLoggedInStaff();
    const adminSession = pcAdminSession();
    if(staff){
      try{
        if(typeof initStaffSupabase === 'function'){
          const db = initStaffSupabase();
          if(db) return db;
        }
      }catch(_){}
      if(typeof window.initStaffSupabase === 'function'){
        const db = window.initStaffSupabase();
        if(db) return db;
      }
    }
    if(adminSession?.access_token){
      try{
        if(typeof initStudentSupabase === 'function'){
          const db = initStudentSupabase();
          if(db) return db;
        }
      }catch(_){}
      if(typeof window.initStudentSupabase === 'function'){
        const db = window.initStudentSupabase();
        if(db) return db;
      }
    }
    throw new Error('Please login first.');
  }

  function pcDateTime(value){
    if(!value) return '—';
    try{
      return new Intl.DateTimeFormat('en-GB',{
        timeZone:'Asia/Kathmandu',year:'numeric',month:'short',day:'2-digit',
        hour:'2-digit',minute:'2-digit',hour12:true
      }).format(new Date(value));
    }catch(_){ return String(value); }
  }

  function pcDateOnly(value){
    if(!value) return '—';
    try{
      return new Intl.DateTimeFormat('en-CA',{
        timeZone:'Asia/Kathmandu',year:'numeric',month:'2-digit',day:'2-digit'
      }).format(new Date(value));
    }catch(_){ return String(value).slice(0,10); }
  }

  function pcStatusClass(status){
    return `pc-status-${String(status || 'pending').replace(/_/g,'-')}`;
  }

  function pcPriorityClass(priority){
    return `pc-priority-${String(priority || 'normal')}`;
  }

  function pcInjectStyle(){
    if(document.getElementById('pcStaffImprovementsStyle')) return;
    const style = document.createElement('style');
    style.id = 'pcStaffImprovementsStyle';
    style.textContent = `
      .pc-action-card{position:relative!important;display:flex!important;align-items:center!important;gap:14px!important;width:100%!important;min-height:96px!important;padding:16px 18px!important;border:0!important;border-radius:18px!important;overflow:hidden!important;text-align:left!important;cursor:pointer!important;color:#fff!important;background:linear-gradient(135deg,#0f6db8 0%,#16a0c8 100%)!important;box-shadow:0 9px 20px rgba(15,109,184,.22)!important;transition:.18s ease!important}
      .pc-action-card:hover{transform:translateY(-2px)!important;box-shadow:0 13px 26px rgba(15,109,184,.28)!important}
      .pc-action-card.password{background:linear-gradient(135deg,#5d43b7 0%,#7a5bd4 100%)!important}
      .pc-action-icon{flex:0 0 54px;width:54px;height:54px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.17);border:1px solid rgba(255,255,255,.24);font-size:26px}
      .pc-action-copy{min-width:0;display:flex;flex-direction:column;gap:3px}.pc-action-copy strong{font-size:15px;line-height:1.25}.pc-action-copy span{font-size:12px;opacity:.9;line-height:1.35}
      .pc-admin-tab-btn{background:linear-gradient(135deg,#0f6db8,#16a0c8)!important;color:#fff!important}
      .pc-overlay{position:fixed;inset:0;z-index:100000;background:rgba(5,20,40,.72);backdrop-filter:blur(5px);display:none;align-items:center;justify-content:center;padding:18px}
      .pc-overlay.open{display:flex}.pc-shell{width:min(1180px,100%);max-height:94vh;overflow:auto;background:#f7f9fc;border-radius:24px;box-shadow:0 28px 70px rgba(0,0,0,.35);position:relative;color:#172338}
      .pc-head{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:20px 22px;background:linear-gradient(135deg,#0c4f91,#0f7dbd);color:#fff;border-radius:24px 24px 0 0}
      .pc-head h2{margin:0;font-size:22px}.pc-head p{margin:4px 0 0;font-size:12px;opacity:.88}.pc-close{border:0;background:rgba(255,255,255,.16);color:#fff;width:40px;height:40px;border-radius:12px;font-size:26px;cursor:pointer}
      .pc-body{padding:20px}.pc-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}.pc-tab{border:1px solid #d5deea;background:#fff;color:#31425b;border-radius:12px;padding:10px 14px;font-weight:800;cursor:pointer}.pc-tab.active{background:#0f6db8;color:#fff;border-color:#0f6db8}
      .pc-summary{display:grid;grid-template-columns:repeat(5,minmax(120px,1fr));gap:10px;margin-bottom:16px}.pc-stat{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:14px;box-shadow:0 5px 15px rgba(15,30,55,.05)}.pc-stat strong{display:block;font-size:24px}.pc-stat span{font-size:11px;color:#607086;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
      .pc-panel{background:#fff;border:1px solid #e1e7ef;border-radius:18px;padding:18px;box-shadow:0 7px 22px rgba(16,42,78,.06)}.pc-panel h3{margin:0 0 12px;color:#15385f}.pc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.pc-field{display:flex;flex-direction:column;gap:6px}.pc-field.full{grid-column:1/-1}.pc-field label,.pc-label{font-size:12px;font-weight:900;color:#42556f;text-transform:uppercase;letter-spacing:.035em}.pc-field select,.pc-field input,.pc-field textarea,.pc-filter select,.pc-filter input{width:100%;box-sizing:border-box;border:1px solid #cfd9e6;border-radius:11px;padding:11px 12px;background:#fff;color:#1a2b42;outline:none}.pc-field textarea{min-height:105px;resize:vertical}.pc-field select:focus,.pc-field input:focus,.pc-field textarea:focus{border-color:#1688c1;box-shadow:0 0 0 3px rgba(22,136,193,.12)}
      .pc-check-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.pc-check{display:flex;align-items:flex-start;gap:9px;padding:10px;border:1px solid #dfe6ef;border-radius:12px;background:#fafcff;cursor:pointer;font-size:13px;line-height:1.3}.pc-check input{margin-top:2px;accent-color:#0f6db8}
      .pc-primary,.pc-secondary,.pc-manager-save,.pc-danger{border:0;border-radius:12px;padding:11px 16px;font-weight:900;cursor:pointer}.pc-primary{background:linear-gradient(135deg,#0f6db8,#159bd7);color:#fff}.pc-secondary{background:#edf3f8;color:#254565}.pc-manager-save{background:linear-gradient(135deg,#198754,#2aa66e);color:#fff}.pc-danger{background:linear-gradient(135deg,#b42332,#d83b4c);color:#fff}.pc-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.pc-message{margin-top:10px;font-size:13px;font-weight:700}.pc-message.ok{color:#137c4b}.pc-message.err{color:#b12a34}
      .pc-filters{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-bottom:12px}.pc-filter label{display:block;font-size:10px;color:#617086;font-weight:900;margin-bottom:4px;text-transform:uppercase}.pc-list{display:grid;gap:10px}.pc-card{border:1px solid #dfe6ef;border-radius:15px;padding:14px;background:#fff}.pc-card-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.pc-card-title{font-weight:900;color:#15385f}.pc-card-sub{font-size:12px;color:#65758b;margin-top:3px}.pc-badges{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}.pc-badge{font-size:10px;font-weight:900;border-radius:999px;padding:5px 8px;text-transform:uppercase;letter-spacing:.03em;background:#eef2f6;color:#47596f}.pc-status-pending{background:#fff3cd;color:#7a5b00}.pc-status-reviewed{background:#d9ecff;color:#155a92}.pc-status-in-progress{background:#e9dcff;color:#6339a7}.pc-status-solved{background:#d9f4e5;color:#16633b}.pc-status-closed{background:#e6e8eb;color:#47515d}.pc-priority-normal{background:#eef3f7;color:#526273}.pc-priority-important{background:#fff0c2;color:#7b5700}.pc-priority-serious{background:#ffe0cc;color:#8b3b06}.pc-priority-urgent{background:#ffd8dd;color:#9a1e2e}.pc-card-body{margin-top:10px;font-size:13px;line-height:1.5;color:#33445b}.pc-items{margin:8px 0;padding-left:18px}.pc-row-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:11px}
      .pc-empty{text-align:center;color:#6b7a8d;padding:28px 12px}.pc-detail{margin-top:14px}.pc-timeline{border-left:3px solid #d5e1ec;margin-left:8px;padding-left:16px}.pc-timeline-item{position:relative;padding:0 0 16px 4px}.pc-timeline-item:before{content:'';position:absolute;width:10px;height:10px;border-radius:50%;background:#0f6db8;left:-23px;top:5px}.pc-timeline-item strong{display:block;color:#15385f}.pc-timeline-item small{color:#728096}.pc-timeline-item p{margin:5px 0 0;color:#3f5066}
      .pc-review-box{margin-top:14px;border-top:1px solid #e2e8f0;padding-top:14px}.pc-review-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.pc-review-box textarea{width:100%;box-sizing:border-box;min-height:100px;border:1px solid #cfd9e6;border-radius:11px;padding:11px;margin-top:10px;resize:vertical}
      .pc-password-shell{width:min(520px,100%);background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 28px 70px rgba(0,0,0,.35)}.pc-password-body{padding:20px}.pc-password-note{font-size:12px;color:#617086;background:#f4f7fb;border-radius:12px;padding:11px;margin-bottom:14px}
      @media(max-width:800px){.pc-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.pc-grid,.pc-check-grid{grid-template-columns:1fr}.pc-filters{grid-template-columns:repeat(2,minmax(0,1fr))}.pc-review-grid{grid-template-columns:1fr}.pc-body{padding:13px}.pc-head{padding:16px}.pc-head h2{font-size:18px}}
      @media(max-width:520px){.pc-filters{grid-template-columns:1fr}.pc-summary{grid-template-columns:1fr 1fr}.pc-card-head{flex-direction:column}.pc-badges{justify-content:flex-start}}

      /* 2026-09-25 — MOBILE ONLY FIX
         1) The final dashboard cards use the same compact size as the existing mobile cards.
         2) Parent Concern checkbox labels always start immediately beside the checkbox.
         Desktop/tablet styling remains unchanged. */
      body.staff-app-mode #staffDashboardPopup .staff-dashboard-quick-actions #staffDashboardPortfolioAction,
      body.staff-app-mode #staffDashboardPopup .staff-dashboard-quick-actions .pc-action-card{
        box-sizing:border-box!important;
        width:100%!important;
        height:86px!important;
        min-height:86px!important;
        max-height:86px!important;
        padding:10px!important;
        gap:8px!important;
        border-radius:15px!important;
        align-items:flex-start!important;
      }
      body.staff-app-mode #staffDashboardPopup .staff-dashboard-quick-actions .pc-action-card .pc-action-icon{
        flex:0 0 34px!important;
        width:34px!important;
        height:34px!important;
        border-radius:10px!important;
        font-size:16px!important;
      }
      body.staff-app-mode #staffDashboardPopup .staff-dashboard-quick-actions .pc-action-card .pc-action-copy{
        min-width:0!important;
        flex:1 1 auto!important;
        gap:3px!important;
      }
      body.staff-app-mode #staffDashboardPopup .staff-dashboard-quick-actions .pc-action-card .pc-action-copy strong{
        font-size:10.5px!important;
        line-height:1.18!important;
        overflow-wrap:anywhere!important;
      }
      body.staff-app-mode #staffDashboardPopup .staff-dashboard-quick-actions .pc-action-card .pc-action-copy span{
        display:block!important;
        margin-top:3px!important;
        font-size:7.5px!important;
        line-height:1.3!important;
        overflow-wrap:anywhere!important;
      }

      body.staff-app-mode .pc-check{
        display:grid!important;
        grid-template-columns:22px minmax(0,1fr)!important;
        align-items:start!important;
        column-gap:9px!important;
      }
      body.staff-app-mode .pc-check input[type="checkbox"]{
        box-sizing:border-box!important;
        width:22px!important;
        min-width:22px!important;
        max-width:22px!important;
        height:22px!important;
        min-height:22px!important;
        max-height:22px!important;
        padding:0!important;
        margin:0!important;
        justify-self:start!important;
      }
      body.staff-app-mode .pc-check > span{
        display:block!important;
        width:auto!important;
        min-width:0!important;
        margin:0!important;
        padding:1px 0 0!important;
        text-align:left!important;
      }

      @media(max-width:700px){
        body:not(.staff-app-mode) #staffDashboardPopup .staff-dashboard-quick-actions #staffDashboardPortfolioAction,
        body:not(.staff-app-mode) #staffDashboardPopup .staff-dashboard-quick-actions .pc-action-card{
          box-sizing:border-box!important;
          width:100%!important;
          height:72px!important;
          min-height:72px!important;
          max-height:72px!important;
          padding:10px!important;
          gap:8px!important;
          border-radius:15px!important;
          align-items:flex-start!important;
        }
        body:not(.staff-app-mode) #staffDashboardPopup .staff-dashboard-quick-actions .pc-action-card .pc-action-icon{
          flex:0 0 36px!important;
          width:36px!important;
          height:36px!important;
          border-radius:10px!important;
          font-size:16px!important;
        }
        body:not(.staff-app-mode) #staffDashboardPopup .staff-dashboard-quick-actions .pc-action-card .pc-action-copy strong{
          font-size:11px!important;
          line-height:1.18!important;
        }
        body:not(.staff-app-mode) #staffDashboardPopup .staff-dashboard-quick-actions .pc-action-card .pc-action-copy span{
          display:none!important;
        }

        body:not(.staff-app-mode) .pc-check{
          display:grid!important;
          grid-template-columns:22px minmax(0,1fr)!important;
          align-items:start!important;
          column-gap:9px!important;
        }
        body:not(.staff-app-mode) .pc-check input[type="checkbox"]{
          box-sizing:border-box!important;
          width:22px!important;
          min-width:22px!important;
          max-width:22px!important;
          height:22px!important;
          min-height:22px!important;
          max-height:22px!important;
          padding:0!important;
          margin:0!important;
          justify-self:start!important;
        }
        body:not(.staff-app-mode) .pc-check > span{
          display:block!important;
          width:auto!important;
          min-width:0!important;
          margin:0!important;
          padding:1px 0 0!important;
          text-align:left!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function pcInjectMarkup(){
    if(!document.getElementById('parentConcernOverlay')){
      const wrap = document.createElement('div');
      wrap.innerHTML = `
        <div id="parentConcernOverlay" class="pc-overlay" role="dialog" aria-modal="true" aria-labelledby="pcTitle">
          <div class="pc-shell">
            <div class="pc-head">
              <div><h2 id="pcTitle">👪 Parent Concern / Suggestion</h2><p>Staff submission • Principal/Admin review • Status tracking</p></div>
              <button type="button" class="pc-close" onclick="closeParentConcernCenter()" aria-label="Close">×</button>
            </div>
            <div class="pc-body">
              <div id="pcTabs" class="pc-tabs"></div>
              <div id="pcSummary" class="pc-summary"></div>
              <div id="pcContent"></div>
            </div>
          </div>
        </div>`;
      document.body.appendChild(wrap.firstElementChild);
    }

    if(!document.getElementById('staffPasswordResetOverlay')){
      const wrap = document.createElement('div');
      wrap.innerHTML = `
        <div id="staffPasswordResetOverlay" class="pc-overlay" role="dialog" aria-modal="true" aria-labelledby="pcPasswordTitle">
          <div class="pc-password-shell">
            <div class="pc-head">
              <div><h2 id="pcPasswordTitle">🔐 Reset My Password</h2><p>Signed-in staff self-service</p></div>
              <button type="button" class="pc-close" onclick="closeStaffSelfPasswordReset()" aria-label="Close">×</button>
            </div>
            <div class="pc-password-body">
              <div class="pc-password-note">You are already securely logged in, so the current password is not requested. After a successful reset, this session will log out automatically.</div>
              <div class="pc-grid">
                <div class="pc-field full"><label>New Password</label><input id="pcNewPassword" type="password" autocomplete="new-password" minlength="8" placeholder="Minimum 8 characters"></div>
                <div class="pc-field full"><label>Confirm New Password</label><input id="pcConfirmPassword" type="password" autocomplete="new-password" minlength="8" placeholder="Type the same password again"></div>
              </div>
              <div class="pc-actions"><button id="pcResetPasswordBtn" class="pc-primary" type="button" onclick="submitStaffSelfPasswordReset()">RESET PASSWORD</button></div>
              <div id="pcPasswordMessage" class="pc-message"></div>
            </div>
          </div>
        </div>`;
      document.body.appendChild(wrap.firstElementChild);
    }
  }

  function pcInjectButtons(){
    document.querySelectorAll('.staff-dashboard-quick-actions').forEach(host => {
      if(!host.querySelector('[data-pc-concern-action]')){
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pc-action-card';
        btn.setAttribute('data-pc-concern-action','1');
        btn.onclick = () => window.openParentConcernCenter();
        btn.innerHTML = `<span class="pc-action-icon">👪</span><span class="pc-action-copy"><strong>Parent Concern / Suggestion</strong><span>Submit parent concerns and track status</span></span>`;
        host.appendChild(btn);
      }
      if(!host.querySelector('[data-pc-password-action]')){
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pc-action-card password';
        btn.setAttribute('data-pc-password-action','1');
        btn.onclick = () => window.openStaffSelfPasswordReset();
        btn.innerHTML = `<span class="pc-action-icon">🔐</span><span class="pc-action-copy"><strong>Reset My Password</strong><span>Create a new login password yourself</span></span>`;
        host.appendChild(btn);
      }
    });

    document.querySelectorAll('.website-admin-tabs').forEach(host => {
      if(!host.querySelector('[data-pc-admin-action]')){
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pc-admin-tab-btn';
        btn.setAttribute('data-pc-admin-action','1');
        btn.textContent = '👪 Parent Concerns';
        btn.onclick = () => window.openParentConcernCenter('manager');
        host.appendChild(btn);
      }
    });
  }

  function pcStartObserver(){
    if(pcObserver) return;
    pcObserver = new MutationObserver(() => pcInjectButtons());
    pcObserver.observe(document.documentElement,{childList:true,subtree:true});
  }

  function pcBuildTabs(){
    const host = document.getElementById('pcTabs');
    if(!host) return;
    const adminOnly = pcIsWebsiteAdmin();
    const manager = pcIsManager();
    const tabs = [];
    if(!adminOnly){
      tabs.push(['new','＋ New Concern']);
      tabs.push(['history','🕘 My History']);
    }
    if(manager) tabs.push(['manage','🛡 Manage All']);
    if(!tabs.some(([id]) => id === pcCurrentView)) pcCurrentView = manager && adminOnly ? 'manage' : 'new';
    host.innerHTML = tabs.map(([id,label]) => `<button class="pc-tab ${pcCurrentView===id?'active':''}" type="button" onclick="pcShowView('${id}')">${label}</button>`).join('');
  }

  function pcRenderSummary(rows, manager=false){
    const host = document.getElementById('pcSummary');
    if(!host) return;
    const all = rows || [];
    const count = key => all.filter(r => r.status === key).length;
    const serious = all.filter(r => ['serious','urgent'].includes(r.priority)).length;
    host.innerHTML = `
      <div class="pc-stat"><strong>${all.length}</strong><span>${manager?'Received':'Submitted'}</span></div>
      <div class="pc-stat"><strong>${count('pending')}</strong><span>Pending</span></div>
      <div class="pc-stat"><strong>${count('in_progress')}</strong><span>In Progress</span></div>
      <div class="pc-stat"><strong>${count('solved') + count('closed')}</strong><span>Solved / Closed</span></div>
      <div class="pc-stat"><strong>${serious}</strong><span>Serious / Urgent</span></div>`;
  }

  function pcNewView(){
    const host = document.getElementById('pcContent');
    pcRenderSummary(pcMyRows,false);
    host.innerHTML = `
      <section class="pc-panel">
        <h3>Submit Parent Concern / Suggestion</h3>
        <div class="pc-grid">
          <div class="pc-field"><label>Class</label><select id="pcClassSelect"><option value="">Select Class</option>${PC_CLASSES.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select></div>
          <div class="pc-field"><label>Student</label><select id="pcStudentSelect" disabled><option value="">Select Class first</option></select></div>
          <div class="pc-field full"><span class="pc-label">Common Parent Concerns / Suggestions</span><div class="pc-check-grid">${PC_CONCERNS.map((x,i)=>`<label class="pc-check"><input type="checkbox" name="pcConcernItem" value="${esc(x)}"><span>${i+1}. ${esc(x)}</span></label>`).join('')}</div></div>
          <div class="pc-field full"><label>Other / Custom Information</label><textarea id="pcCustomNote" maxlength="1800" placeholder="Write any other concern, complaint, suggestion or parent message here..."></textarea></div>
        </div>
        <div class="pc-actions"><button id="pcSubmitBtn" class="pc-primary" type="button">SUBMIT TO PRINCIPAL / ADMIN</button></div>
        <div id="pcSubmitMessage" class="pc-message"></div>
      </section>`;
    document.getElementById('pcClassSelect').addEventListener('change', pcLoadStudents);
    document.getElementById('pcSubmitBtn').addEventListener('click', pcSubmitConcern);
  }

  async function pcLoadStudents(){
    const cls = document.getElementById('pcClassSelect')?.value || '';
    const select = document.getElementById('pcStudentSelect');
    if(!select) return;
    if(!cls){
      select.disabled = true;
      select.innerHTML = '<option value="">Select Class first</option>';
      return;
    }
    select.disabled = true;
    select.innerHTML = '<option value="">Loading students...</option>';
    try{
      const db = pcDb();
      const {data,error} = await db.rpc('pc_list_students',{p_class_name:cls});
      if(error) throw error;
      const rows = data || [];
      select.innerHTML = rows.length
        ? `<option value="">Select Student</option>${rows.map(r=>`<option value="${esc(r.student_id)}">${esc(r.name)} (${esc(r.student_id)})</option>`).join('')}`
        : '<option value="">No students found in this Class</option>';
      select.disabled = !rows.length;
    }catch(error){
      console.error('Parent concern roster error:',error);
      select.innerHTML = '<option value="">Could not load students</option>';
      const msg = document.getElementById('pcSubmitMessage');
      if(msg){ msg.className='pc-message err'; msg.textContent='Student list could not load. Run PARENT-CONCERN-SETUP.sql once and try again.'; }
    }
  }

  async function pcSubmitConcern(){
    const button = document.getElementById('pcSubmitBtn');
    const msg = document.getElementById('pcSubmitMessage');
    const className = document.getElementById('pcClassSelect')?.value || '';
    const studentId = document.getElementById('pcStudentSelect')?.value || '';
    const selected = [...document.querySelectorAll('input[name="pcConcernItem"]:checked')].map(el=>el.value);
    const custom = document.getElementById('pcCustomNote')?.value.trim() || '';
    if(!className || !studentId){
      if(msg){ msg.className='pc-message err'; msg.textContent='Please select Class and Student.'; }
      return;
    }
    if(!selected.length && !custom){
      if(msg){ msg.className='pc-message err'; msg.textContent='Select at least one concern or write a custom message.'; }
      return;
    }
    const old = button?.textContent || 'SUBMIT';
    try{
      if(button){ button.disabled=true; button.textContent='SUBMITTING...'; }
      if(msg){ msg.textContent=''; msg.className='pc-message'; }
      const db = pcDb();
      const {data,error} = await db.rpc('pc_submit_concern',{
        p_class_name:className,
        p_student_id:studentId,
        p_selected_items:selected,
        p_custom_note:custom || null,
        p_staff_name:pcStaffName()
      });
      if(error) throw error;
      document.querySelectorAll('input[name="pcConcernItem"]').forEach(el=>el.checked=false);
      const note = document.getElementById('pcCustomNote'); if(note) note.value='';
      if(msg){ msg.className='pc-message ok'; msg.textContent=`✓ Submitted successfully. Reference #${data}`; }
      await pcLoadMyHistory(false);
    }catch(error){
      console.error('Parent concern submit error:',error);
      if(msg){ msg.className='pc-message err'; msg.textContent='Could not submit: '+(error?.message || 'Unknown error'); }
    }finally{
      if(button){ button.disabled=false; button.textContent=old; }
    }
  }

  function pcHistoryView(){
    const host = document.getElementById('pcContent');
    host.innerHTML = `
      <section class="pc-panel">
        <h3>My Submitted Concerns / Suggestions</h3>
        <div class="pc-filters">
          <div class="pc-filter"><label>From Date</label><input id="pcMyFrom" type="date"></div>
          <div class="pc-filter"><label>To Date</label><input id="pcMyTo" type="date"></div>
          <div class="pc-filter"><label>Status</label><select id="pcMyStatus"><option value="">All Status</option>${Object.entries(STATUS_LABELS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div>
          <div class="pc-filter"><label>&nbsp;</label><button class="pc-primary" type="button" onclick="pcLoadMyHistory(true)">FILTER</button></div>
        </div>
        <div id="pcMyList" class="pc-list"><div class="pc-empty">Loading...</div></div>
        <div id="pcMyDetail" class="pc-detail"></div>
      </section>`;
    pcRenderSummary(pcMyRows,false);
    pcLoadMyHistory(true);
  }

  async function pcLoadMyHistory(render=true){
    try{
      const db = pcDb();
      const from = document.getElementById('pcMyFrom')?.value || null;
      const to = document.getElementById('pcMyTo')?.value || null;
      const status = document.getElementById('pcMyStatus')?.value || null;
      const {data,error} = await db.rpc('pc_my_concerns',{
        p_from_date:from,p_to_date:to,p_status:status
      });
      if(error) throw error;
      pcMyRows = data || [];
      pcRenderSummary(pcMyRows,false);
      if(render) pcRenderMyList();
    }catch(error){
      console.error('My parent concerns load error:',error);
      const list = document.getElementById('pcMyList');
      if(list) list.innerHTML=`<div class="pc-empty">Could not load history: ${esc(error?.message || 'Unknown error')}</div>`;
    }
  }

  function pcConcernText(row){
    const items = Array.isArray(row.selected_items) ? row.selected_items : [];
    return `${items.length?`<ul class="pc-items">${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${row.custom_note?`<div><strong>Other:</strong> ${esc(row.custom_note)}</div>`:''}`;
  }

  function pcRenderMyList(){
    const host = document.getElementById('pcMyList');
    if(!host) return;
    if(!pcMyRows.length){ host.innerHTML='<div class="pc-empty">No records found for the selected filter.</div>'; return; }
    host.innerHTML = pcMyRows.map(row=>`
      <article class="pc-card">
        <div class="pc-card-head">
          <div><div class="pc-card-title">#${row.id} • ${esc(row.student_name)} • ${esc(row.class_name)}</div><div class="pc-card-sub">Submitted ${esc(pcDateTime(row.created_at))}</div></div>
          <div class="pc-badges"><span class="pc-badge ${pcStatusClass(row.status)}">${esc(STATUS_LABELS[row.status]||row.status)}</span><span class="pc-badge ${pcPriorityClass(row.priority)}">${esc(PRIORITY_LABELS[row.priority]||row.priority)}</span><span class="pc-badge">${esc(CATEGORY_LABELS[row.category]||row.category)}</span></div>
        </div>
        <div class="pc-card-body">${pcConcernText(row)}${row.manager_note?`<div style="margin-top:8px"><strong>Latest Principal/Admin message:</strong> ${esc(row.manager_note)}</div>`:''}</div>
        <div class="pc-row-actions"><button class="pc-secondary" type="button" onclick="pcShowTimeline(${Number(row.id)},'pcMyDetail')">VIEW STATUS / MESSAGES</button></div>
      </article>`).join('');
  }

  function pcManagerView(){
    const host = document.getElementById('pcContent');
    host.innerHTML = `
      <section class="pc-panel">
        <h3>Principal / Admin — Parent Concern Management</h3>
        <div class="pc-filters">
          <div class="pc-filter"><label>From Date</label><input id="pcMgrFrom" type="date"></div>
          <div class="pc-filter"><label>To Date</label><input id="pcMgrTo" type="date"></div>
          <div class="pc-filter"><label>Class</label><select id="pcMgrClass"><option value="">All Classes</option>${PC_CLASSES.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select></div>
          <div class="pc-filter"><label>Status</label><select id="pcMgrStatus"><option value="">All Status</option>${Object.entries(STATUS_LABELS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div>
          <div class="pc-filter"><label>Priority</label><select id="pcMgrPriority"><option value="">All Priority</option>${Object.entries(PRIORITY_LABELS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div>
          <div class="pc-filter"><label>Category</label><select id="pcMgrCategory"><option value="">All Category</option>${Object.entries(CATEGORY_LABELS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div>
          <div class="pc-filter"><label>Staff Name / ID</label><input id="pcMgrStaff" placeholder="Example: punita"></div>
          <div class="pc-filter"><label>&nbsp;</label><button class="pc-primary" type="button" onclick="pcLoadManagerList()">FILTER / REFRESH</button></div>
        </div>
        <div id="pcManagerList" class="pc-list"><div class="pc-empty">Loading...</div></div>
        <div id="pcManagerDetail" class="pc-detail"></div>
      </section>`;
    pcLoadManagerList();
  }

  async function pcLoadManagerList(){
    const host = document.getElementById('pcManagerList');
    try{
      if(host) host.innerHTML='<div class="pc-empty">Loading concerns...</div>';
      const db = pcDb();
      const {data,error} = await db.rpc('pc_manager_concerns',{
        p_from_date:document.getElementById('pcMgrFrom')?.value || null,
        p_to_date:document.getElementById('pcMgrTo')?.value || null,
        p_class_name:document.getElementById('pcMgrClass')?.value || null,
        p_status:document.getElementById('pcMgrStatus')?.value || null,
        p_priority:document.getElementById('pcMgrPriority')?.value || null,
        p_category:document.getElementById('pcMgrCategory')?.value || null,
        p_staff_search:document.getElementById('pcMgrStaff')?.value.trim() || null
      });
      if(error) throw error;
      pcManagerRows = data || [];
      pcRenderSummary(pcManagerRows,true);
      pcRenderManagerList();
    }catch(error){
      console.error('Manager parent concerns load error:',error);
      if(host) host.innerHTML=`<div class="pc-empty">Could not load Manager view: ${esc(error?.message || 'Unknown error')}</div>`;
    }
  }

  function pcRenderManagerList(){
    const host = document.getElementById('pcManagerList');
    if(!host) return;
    if(!pcManagerRows.length){ host.innerHTML='<div class="pc-empty">No concerns found for the selected filter.</div>'; return; }
    host.innerHTML = pcManagerRows.map(row=>`
      <article class="pc-card">
        <div class="pc-card-head">
          <div><div class="pc-card-title">#${row.id} • ${esc(row.student_name)} • ${esc(row.class_name)}</div><div class="pc-card-sub">From ${esc(row.staff_name)} (${esc(row.staff_id)}) • ${esc(pcDateTime(row.created_at))}</div></div>
          <div class="pc-badges"><span class="pc-badge ${pcStatusClass(row.status)}">${esc(STATUS_LABELS[row.status]||row.status)}</span><span class="pc-badge ${pcPriorityClass(row.priority)}">${esc(PRIORITY_LABELS[row.priority]||row.priority)}</span><span class="pc-badge">${esc(CATEGORY_LABELS[row.category]||row.category)}</span></div>
        </div>
        <div class="pc-card-body">${pcConcernText(row)}${row.manager_note?`<div style="margin-top:8px"><strong>Latest manager note:</strong> ${esc(row.manager_note)}</div>`:''}</div>
        <div class="pc-row-actions"><button class="pc-primary" type="button" onclick="pcReviewConcern(${Number(row.id)})">REVIEW / UPDATE</button><button class="pc-secondary" type="button" onclick="pcShowTimeline(${Number(row.id)},'pcManagerDetail')">VIEW HISTORY</button><button class="pc-danger" type="button" onclick="pcDeleteConcern(${Number(row.id)})">DELETE</button></div>
      </article>`).join('');
  }

  async function pcShowTimeline(id,targetId){
    const target = document.getElementById(targetId);
    if(target) target.innerHTML='<div class="pc-panel"><div class="pc-empty">Loading history...</div></div>';
    try{
      const db = pcDb();
      const {data,error} = await db.rpc('pc_concern_updates',{p_concern_id:Number(id)});
      if(error) throw error;
      const rows = data || [];
      if(target){
        target.innerHTML = `<div class="pc-panel"><h3>Status / Message History — #${Number(id)}</h3><div class="pc-timeline">${rows.length?rows.map(x=>`
          <div class="pc-timeline-item"><strong>${esc(x.author_name || x.author_staff_id)} • ${esc(x.action_type==='submitted'?'Submitted':'Updated')}</strong><small>${esc(pcDateTime(x.created_at))}${x.status?` • ${esc(STATUS_LABELS[x.status]||x.status)}`:''}${x.priority?` • ${esc(PRIORITY_LABELS[x.priority]||x.priority)}`:''}</small>${x.message?`<p>${esc(x.message)}</p>`:''}</div>`).join(''):'<div class="pc-empty">No history found.</div>'}</div></div>`;
      }
    }catch(error){
      if(target) target.innerHTML=`<div class="pc-panel"><div class="pc-empty">Could not load history: ${esc(error?.message || 'Unknown error')}</div></div>`;
    }
  }

  function pcReviewConcern(id){
    const row = pcManagerRows.find(r=>Number(r.id)===Number(id));
    const target = document.getElementById('pcManagerDetail');
    if(!row || !target) return;
    target.innerHTML = `
      <div class="pc-panel">
        <h3>Review Concern #${Number(row.id)}</h3>
        <div class="pc-card-body"><strong>Student:</strong> ${esc(row.student_name)} • ${esc(row.class_name)}<br><strong>Submitted by:</strong> ${esc(row.staff_name)} (${esc(row.staff_id)})<br><strong>Date:</strong> ${esc(pcDateTime(row.created_at))}${pcConcernText(row)}</div>
        <div class="pc-review-box">
          <div class="pc-review-grid">
            <div class="pc-field"><label>Status</label><select id="pcReviewStatus">${Object.entries(STATUS_LABELS).map(([k,v])=>`<option value="${k}" ${row.status===k?'selected':''}>${v}</option>`).join('')}</select></div>
            <div class="pc-field"><label>Priority</label><select id="pcReviewPriority">${Object.entries(PRIORITY_LABELS).map(([k,v])=>`<option value="${k}" ${row.priority===k?'selected':''}>${v}</option>`).join('')}</select></div>
            <div class="pc-field"><label>Category</label><select id="pcReviewCategory">${Object.entries(CATEGORY_LABELS).map(([k,v])=>`<option value="${k}" ${row.category===k?'selected':''}>${v}</option>`).join('')}</select></div>
          </div>
          <textarea id="pcReviewMessage" maxlength="1800" placeholder="Write Principal/Admin follow-up message in English or Nepali. Example: Please monitor the student for one week."></textarea>
          <div class="pc-actions"><button id="pcReviewSave" class="pc-manager-save" type="button" onclick="pcSaveManagerUpdate(${Number(row.id)})">SAVE UPDATE & INFORM STAFF</button><button class="pc-secondary" type="button" onclick="pcShowTimeline(${Number(row.id)},'pcManagerDetail')">VIEW FULL HISTORY</button></div>
          <div id="pcReviewMessageStatus" class="pc-message"></div>
        </div>
      </div>`;
    target.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  async function pcDeleteConcern(id){
    const row = pcManagerRows.find(r=>Number(r.id)===Number(id));
    if(!row){ alert('Concern not found.'); return; }
    const ok = confirm(
      `Permanently delete Parent Concern #${Number(row.id)}?\n\n`+
      `${row.student_name} • ${row.class_name}\n`+
      `Submitted by ${row.staff_name}\n\n`+
      `This will also delete its status/message history. This action cannot be undone.`
    );
    if(!ok) return;
    try{
      const db = pcDb();
      const {error} = await db.rpc('pc_manager_delete_concern',{
        p_concern_id:Number(id),
        p_manager_name:pcStaffName()
      });
      if(error) throw error;
      const detail=document.getElementById('pcManagerDetail');
      if(detail) detail.innerHTML='';
      await pcLoadManagerList();
      alert('✓ Parent Concern deleted successfully.');
    }catch(error){
      console.error('Delete parent concern error:',error);
      alert('Could not delete concern: '+(error?.message || 'Unknown error'));
    }
  }

  async function pcSaveManagerUpdate(id){
    const button = document.getElementById('pcReviewSave');
    const msg = document.getElementById('pcReviewMessageStatus');
    const old = button?.textContent || 'SAVE';
    try{
      if(button){ button.disabled=true; button.textContent='SAVING...'; }
      const db = pcDb();
      const {error} = await db.rpc('pc_manager_update',{
        p_concern_id:Number(id),
        p_status:document.getElementById('pcReviewStatus')?.value || 'pending',
        p_priority:document.getElementById('pcReviewPriority')?.value || 'normal',
        p_category:document.getElementById('pcReviewCategory')?.value || 'other',
        p_message:document.getElementById('pcReviewMessage')?.value.trim() || null,
        p_manager_name:pcStaffName()
      });
      if(error) throw error;
      if(msg){ msg.className='pc-message ok'; msg.textContent='✓ Update saved. The submitting staff can now see this status/message in My History.'; }
      await pcLoadManagerList();
    }catch(error){
      if(msg){ msg.className='pc-message err'; msg.textContent='Could not save update: '+(error?.message || 'Unknown error'); }
    }finally{
      if(button){ button.disabled=false; button.textContent=old; }
    }
  }

  window.pcShowView = async function(view){
    pcCurrentView = view;
    pcBuildTabs();
    if(view==='new'){
      pcNewView();
      await pcLoadMyHistory(false);
      pcRenderSummary(pcMyRows,false);
    }else if(view==='history'){
      pcHistoryView();
    }else if(view==='manage'){
      pcManagerView();
    }
  };

  window.openParentConcernCenter = async function(preferredView){
    try{
      pcDb();
      pcInjectMarkup();
      if(preferredView==='manager' && pcIsManager()) pcCurrentView='manage';
      else if(pcIsWebsiteAdmin()) pcCurrentView='manage';
      else pcCurrentView='new';
      const overlay = document.getElementById('parentConcernOverlay');
      overlay?.classList.add('open');
      document.body.style.overflow='hidden';
      pcBuildTabs();
      await window.pcShowView(pcCurrentView);
    }catch(error){ alert(error?.message || 'Please login first.'); }
  };

  window.closeParentConcernCenter = function(){
    document.getElementById('parentConcernOverlay')?.classList.remove('open');
    document.body.style.overflow='';
  };

  window.pcLoadMyHistory = pcLoadMyHistory;
  window.pcLoadManagerList = pcLoadManagerList;
  window.pcShowTimeline = pcShowTimeline;
  window.pcReviewConcern = pcReviewConcern;
  window.pcSaveManagerUpdate = pcSaveManagerUpdate;
  window.pcDeleteConcern = pcDeleteConcern;

  window.openStaffSelfPasswordReset = function(){
    if(!pcLoggedInStaff()){
      alert('Please login as Staff first.');
      return;
    }
    pcInjectMarkup();
    const a=document.getElementById('pcNewPassword'); if(a) a.value='';
    const b=document.getElementById('pcConfirmPassword'); if(b) b.value='';
    const m=document.getElementById('pcPasswordMessage'); if(m){m.textContent='';m.className='pc-message';}
    document.getElementById('staffPasswordResetOverlay')?.classList.add('open');
    document.body.style.overflow='hidden';
  };

  window.closeStaffSelfPasswordReset = function(){
    document.getElementById('staffPasswordResetOverlay')?.classList.remove('open');
    document.body.style.overflow='';
  };

  window.submitStaffSelfPasswordReset = async function(){
    const p1=document.getElementById('pcNewPassword')?.value || '';
    const p2=document.getElementById('pcConfirmPassword')?.value || '';
    const msg=document.getElementById('pcPasswordMessage');
    const btn=document.getElementById('pcResetPasswordBtn');
    if(p1.length<8){ if(msg){msg.className='pc-message err';msg.textContent='Password must be at least 8 characters.';} return; }
    if(p1!==p2){ if(msg){msg.className='pc-message err';msg.textContent='New Password and Confirm Password do not match.';} return; }
    const old=btn?.textContent || 'RESET PASSWORD';
    try{
      if(btn){btn.disabled=true;btn.textContent='RESETTING...';}
      const db = pcDb();
      const {error} = await db.auth.updateUser({password:p1});
      if(error) throw error;
      if(msg){msg.className='pc-message ok';msg.textContent='✓ Password reset successfully. Logging out...';}
      try{ await db.auth.signOut({scope:'local'}); }catch(_){ try{ await db.auth.signOut(); }catch(__){} }
      setTimeout(()=>{ window.location.reload(); },700);
    }catch(error){
      console.error('Self password reset error:',error);
      if(msg){
        msg.className='pc-message err';
        msg.textContent='Password reset failed: '+(error?.message || 'Unknown error')+'. Admin can still reset the staff password from Staff Accounts.';
      }
      if(btn){btn.disabled=false;btn.textContent=old;}
    }
  };

  function boot(){
    pcInjectStyle();
    pcInjectMarkup();
    pcInjectButtons();
    pcStartObserver();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
