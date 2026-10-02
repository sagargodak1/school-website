/* ============================================================
   ST. AUGUSTINE ACADEMIC FOUNDATION
   CLASS ROUTINE + DAILY SUBSTITUTE ROUTINE V1.7 ONE-YEAR ROUTINE
   2026-09-29
   V1.6 FEATURES + SINGLE PERMANENT ROUTINE FOR THE WHOLE ACADEMIC YEAR

   Additive module: does not replace app.js, Exam Management,
   Smart Attendance, Marks, Leave, Notifications or Parent Portal.
   ============================================================ */
(function(){
  'use strict';

  const MOD_ID='crtOverlayV1';
  window.CLASS_ROUTINE_SUBSTITUTE_VERSION='1.7-one-year-permanent-routine';
  const STYLE_ID='crtStyleV1';
  const CLASSES=['Nursery','LKG','UKG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10'];
  const SUBJECTS=['NEPALI','ENGLISH','MATH','SCIENCE','SEROPHERO','SURYODAYA','SOCIAL','HEALTH','COMPUTER','MORAL','G.K.','ACCOUNT','ECONOMICS','OPT. MATH','REVISION'];

  let launchMode='staff';
  let ctx=null;
  let activeView='daily';
  let todayData=null;
  let manageData=null;
  let classState={year:'2083',data:null,editable:false,entries:[],periodCount:8};

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function byId(id){return document.getElementById(id);}
  function key(cls,period){return `${cls}|${period}`;}
  function normal(v){return String(v??'').trim();}
  function lower(v){return normal(v).toLowerCase();}
  function staffDirectory(){try{return typeof STAFF_LOGIN_DIRECTORY!=='undefined'&&STAFF_LOGIN_DIRECTORY?STAFF_LOGIN_DIRECTORY:{};}catch(_){return {};}}
  function actorStaff(){try{return typeof loggedInStaff!=='undefined'?loggedInStaff:null;}catch(_){return null;}}
  function isStaffLoggedIn(){try{return !!actorStaff()&&typeof staffAuthSession!=='undefined'&&!!staffAuthSession;}catch(_){return false;}}
  function isAdminLoggedIn(){try{return typeof studentAdminSession!=='undefined'&&!!studentAdminSession;}catch(_){return false;}}

  function staffDb(){
    try{if(typeof initStaffSupabase==='function'){const c=initStaffSupabase();if(c)return c;}}catch(_){}
    try{if(window.staffSupabase)return window.staffSupabase;}catch(_){}
    return null;
  }
  function adminDb(){
    try{if(typeof initStudentSupabase==='function'){const c=initStudentSupabase();if(c)return c;}}catch(_){}
    try{if(window.studentSupabase)return window.studentSupabase;}catch(_){}
    return null;
  }
  function db(){return launchMode==='admin'?(adminDb()||staffDb()):(staffDb()||adminDb());}
  async function rpc(name,args={}){
    const c=db();
    if(!c)throw new Error('Supabase session is not ready. Please login again.');
    const {data,error}=await c.rpc(name,args);
    if(error)throw error;
    return data;
  }
  function errText(e){
    const m=String(e?.message||e||'Unknown error');
    if(/routine_unpublish_class_routine/i.test(m))return 'Permanent Unpublish database update is missing. Run CLASS_ROUTINE_SUBSTITUTE_V1_1_UPGRADE.sql in Supabase SQL Editor, then refresh.';
    if(/routine_|class_routine|does not exist|schema cache/i.test(m))return 'Class Routine database is not ready. If V1 SQL was already run, run CLASS_ROUTINE_SUBSTITUTE_V1_1_UPGRADE.sql; otherwise run the FULL SQL once, then refresh.';
    return m;
  }
  function toast(message,kind='info'){
    const el=byId('crtToast');if(!el)return;
    el.className=`crt-toast ${kind}`;el.textContent=message;el.style.display='block';
    clearTimeout(el._t);el._t=setTimeout(()=>{if(el)el.style.display='none';},4200);
  }

  function injectStyle(){
    if(byId(STYLE_ID))return;
    const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
      .crt-overlay{position:fixed;inset:0;z-index:2147482600;background:rgba(3,18,34,.86);display:none;align-items:center;justify-content:center;padding:12px;font-family:Inter,system-ui,-apple-system,Segoe UI,Arial,sans-serif;box-sizing:border-box}
      .crt-overlay *{box-sizing:border-box}.crt-shell{width:min(1450px,calc(100vw - 24px));height:min(930px,calc(100dvh - 24px));min-height:0;background:#f5f9fd;border-radius:24px;overflow:hidden;display:grid;grid-template-columns:235px minmax(0,1fr);box-shadow:0 30px 95px rgba(0,0,0,.4);color:#17324a}.crt-shell{isolation:isolate}.crt-side{height:100%;overflow-y:auto!important;overflow-x:hidden!important}.crt-main{height:100%;overflow:hidden}.crt-content{overscroll-behavior:contain}
      .crt-side{background:linear-gradient(180deg,#103c6e,#0c6c86 58%,#0b7c69);color:#fff;padding:18px 12px;overflow:auto}.crt-brand{padding:4px 8px 16px;border-bottom:1px solid rgba(255,255,255,.18);margin-bottom:10px}.crt-brand strong{display:block;font-size:16px}.crt-brand small{font-size:11px;opacity:.8;line-height:1.4}.crt-nav{display:grid!important;gap:6px!important;position:static!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:auto!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0!important;padding:0!important;background:transparent!important;box-shadow:none!important;transform:none!important;z-index:auto!important;overflow:visible!important}.crt-nav button{width:100%!important;position:static!important;border:0!important;background:transparent!important;color:#f2fbff!important;text-align:left!important;border-radius:11px!important;padding:11px!important;font-weight:850!important;cursor:pointer!important;box-shadow:none!important;transform:none!important}.crt-nav button.active,.crt-nav button:hover{background:rgba(255,255,255,.17)!important;color:#fff!important}
      .crt-side{min-width:0;min-height:0;position:relative!important;z-index:2}.crt-side #crtNav{float:none!important;clear:both!important;list-style:none!important}.crt-side #crtNav::before,.crt-side #crtNav::after{display:none!important;content:none!important}.crt-main{min-width:0;min-height:0;display:flex;flex-direction:column}.crt-top{background:#fff;border-bottom:1px solid #d9e6ef;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}.crt-top h2{margin:0;color:#0d5288;font-size:21px}.crt-meta{font-size:11px;color:#60798b;margin-top:3px;font-weight:700}.crt-close{border:0;background:#eaf1f7;color:#183c55;width:40px;height:40px;border-radius:50%;font-size:25px;cursor:pointer}.crt-content{flex:1;min-height:0;overflow:auto;padding:15px}.crt-toast{display:none;position:sticky;top:0;z-index:40;padding:11px 13px;margin-bottom:12px;border-radius:12px;font-weight:850}.crt-toast.info{background:#e7f3ff;color:#07558d}.crt-toast.ok{background:#e6f7eb;color:#176b35}.crt-toast.warn{background:#fff2d6;color:#8a5500}.crt-toast.err{background:#ffe7e7;color:#a42121}
      .crt-card{background:#fff;border:1px solid #dbe7f0;border-radius:17px;padding:15px;margin-bottom:13px;box-shadow:0 7px 22px rgba(19,66,101,.05)}.crt-card h3{margin:0 0 5px;color:#174c72}.crt-note{font-size:12px;color:#657c8e;line-height:1.45}.crt-section-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px}.crt-actions{display:flex;gap:8px;flex-wrap:wrap}.crt-btn{border:0;border-radius:10px;padding:9px 12px;font-weight:850;cursor:pointer;background:#e9f1f7;color:#214761}.crt-btn.primary{background:#0b72b8;color:#fff}.crt-btn.good{background:#16854a;color:#fff}.crt-btn.warn{background:#d98a08;color:#fff}.crt-btn.danger{background:#bd3535;color:#fff}.crt-btn.ghost{background:#eef3f7;color:#40596a}.crt-btn:disabled{opacity:.48;cursor:not-allowed}.crt-badge{display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;font-size:10px;font-weight:900}.crt-badge.published{background:#def6e7;color:#15733b}.crt-badge.draft{background:#fff0d2;color:#8c5700}.crt-badge.none{background:#eef2f5;color:#667784}.crt-badge.ack{background:#e2f6ea;color:#15733b}.crt-badge.pending{background:#fff0d5;color:#8a5600}
      .crt-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.crt-mini{background:#f8fbfd;border:1px solid #deebf3;border-radius:13px;padding:11px}.crt-mini strong{display:block;color:#174e75;margin-bottom:3px}.crt-field{display:grid;gap:5px;min-width:150px}.crt-field label{font-size:10px;text-transform:uppercase;font-weight:900;color:#637a8c}.crt-field input,.crt-field select{width:100%;border:1px solid #c9d9e4;border-radius:10px;padding:9px;background:#fff;color:#17384f;font:inherit}.crt-row{display:flex;gap:9px;align-items:end;flex-wrap:wrap}.crt-row .crt-field{flex:1}
      .crt-table-wrap{overflow:auto;border:1px solid #dce8f0;border-radius:14px;background:#fff}.crt-table{width:100%;border-collapse:collapse;min-width:820px}.crt-table th,.crt-table td{border-bottom:1px solid #e6eef4;border-right:1px solid #eef3f6;padding:8px;text-align:left;font-size:11px;vertical-align:top}.crt-table th{background:#edf5fa;color:#36586f;position:sticky;top:0;z-index:2}.crt-table th:first-child,.crt-table td:first-child{position:sticky;left:0;background:#f8fbfd;z-index:1}.crt-table th:first-child{z-index:3}.crt-cell-subject{font-weight:900;color:#143f61}.crt-cell-teacher{font-size:10px;color:#687d8c;margin-top:4px}.crt-empty{padding:18px;text-align:center;color:#6d7f8d;background:#f8fbfd;border:1px dashed #cfdee8;border-radius:13px}
      .crt-absent-list{display:flex;gap:8px;flex-wrap:wrap}.crt-absent-chip{display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border-radius:999px;background:#ffe7e7;color:#9f2727;font-weight:900;font-size:11px}.crt-sub-table tr.crt-sub-highlight td{background:#fff2a9!important;border-top:2px solid #e1b700;border-bottom:2px solid #e1b700}.crt-sub-table tr.crt-my-sub td{background:#dff6e8!important;border-color:#35a867}.crt-my-alert{background:linear-gradient(135deg,#e7fff0,#dff3ff);border:2px solid #50ad78;border-radius:15px;padding:13px 15px;margin-bottom:12px;font-weight:850;color:#155a35}
      .crt-check-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.crt-check{display:flex;align-items:center;gap:9px;padding:10px;border:1px solid #dce7ef;border-radius:12px;background:#fff;font-size:11px;font-weight:850}.crt-check.absent{background:#ffe9e9;border-color:#efb1b1;color:#922}.crt-check input{width:18px;height:18px}.crt-vacant td{background:#fffaf0}.crt-vacant select{min-width:190px;border:1px solid #c9d9e4;border-radius:8px;padding:7px;background:#fff}.crt-conflict{font-size:10px;color:#a42b2b;font-weight:800}
      .crt-day-tabs{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.crt-day-tabs button{border:1px solid #cbdbe6;background:#fff;color:#34576e;border-radius:999px;padding:8px 12px;font-weight:850;cursor:pointer}.crt-day-tabs button.active{background:#0c70b2;color:#fff;border-color:#0c70b2}.crt-edit-table td{min-width:190px}.crt-edit-cell{display:grid;gap:5px}.crt-edit-cell input,.crt-edit-cell select{width:100%;border:1px solid #cbdbe5;border-radius:8px;padding:7px;font-size:10px;background:#fff}.crt-edit-cell input{font-weight:850}.crt-read-cell{min-height:42px}.crt-manager-list{display:grid;gap:8px}.crt-manager{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid #dbe7ef;border-radius:12px;padding:10px}.crt-status-line{display:flex;gap:7px;align-items:center;flex-wrap:wrap}.crt-small{font-size:10px;color:#6b7f8f}
      .crt-control-center{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:13px}.crt-control-tile{border:0;border-radius:16px;padding:14px 15px;text-align:left;color:#fff;cursor:pointer;min-height:92px;display:flex;align-items:center;gap:12px;box-shadow:0 10px 22px rgba(18,66,100,.13)}.crt-control-tile .ico{font-size:26px;line-height:1}.crt-control-tile strong{display:block;font-size:14px;margin-bottom:4px}.crt-control-tile small{display:block;font-size:10px;opacity:.9;line-height:1.4}.crt-control-tile.sub{background:linear-gradient(135deg,#7a4cc5,#4f6edb)}.crt-control-tile.perm{background:linear-gradient(135deg,#0b72b8,#1397b8)}.crt-control-tile.access{background:linear-gradient(135deg,#0f7b69,#14947d)}
      .crt-flow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:0 0 12px}.crt-flow-step{background:#f7fbfe;border:1px solid #dce8f0;border-radius:13px;padding:10px 11px;min-height:70px}.crt-flow-step .n{display:inline-flex;width:23px;height:23px;border-radius:50%;align-items:center;justify-content:center;background:#0b72b8;color:#fff;font-size:11px;font-weight:900;margin-bottom:6px}.crt-flow-step strong{display:block;color:#174e75;font-size:11px}.crt-flow-step small{display:block;color:#6a7e8e;font-size:9px;margin-top:3px;line-height:1.35}
      .crt-routine-controls{display:grid;grid-template-columns:minmax(180px,1fr) minmax(260px,1.3fr) auto;gap:10px;align-items:end}.crt-period-box{display:flex;align-items:center;gap:8px;border:1px solid #cfe0eb;background:#f8fbfd;border-radius:13px;padding:7px}.crt-period-box .crt-period-count{min-width:84px;text-align:center}.crt-period-box .crt-period-count strong{display:block;font-size:20px;color:#0c5e98;line-height:1}.crt-period-box .crt-period-count small{font-size:9px;color:#6c8090;text-transform:uppercase;font-weight:900}.crt-period-box button{flex:1;min-height:38px}.crt-mobile-scroll-note{display:none;font-size:10px;color:#6c7f8d;margin:7px 0 0;text-align:center}.crt-danger-note{background:#fff3f3;border:1px solid #f0c3c3;color:#922f2f;padding:10px 12px;border-radius:12px;font-size:11px;font-weight:750;line-height:1.45}
      .crt-table-wrap{scrollbar-gutter:stable;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch}

      /* Staff dashboard: keep Class Routine as visible/premium as the other quick actions. */
      #staffDashboardClassRoutineAction.staff-dashboard-action{background:linear-gradient(135deg,#0f766e 0%,#0e7490 52%,#2563a8 100%)!important;color:#fff!important;opacity:1!important;filter:none!important;visibility:visible!important;pointer-events:auto!important;border-color:transparent!important;box-shadow:0 14px 28px rgba(14,116,144,.22)!important}
      #staffDashboardClassRoutineAction .staff-dashboard-action-icon{background:rgba(255,255,255,.14)!important;border-color:rgba(255,255,255,.24)!important;color:#fff!important}
      #staffDashboardClassRoutineAction .staff-dashboard-action-copy strong,#staffDashboardClassRoutineAction .staff-dashboard-action-copy small,#staffDashboardClassRoutineAction .staff-dashboard-action-arrow{color:#fff!important;opacity:1!important}
      #staffDashboardClassRoutineAction:hover{transform:translateY(-2px);box-shadow:0 18px 34px rgba(14,116,144,.30)!important}
      /* Staff Class Routine page: three clear premium sections. */
      .crt-card.crt-today-section{padding:0;overflow:hidden;border:0;box-shadow:0 10px 28px rgba(22,65,96,.10)}
      .crt-section-banner{padding:15px 17px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;color:#fff}
      .crt-section-banner h3{margin:0 0 4px;color:#fff!important;font-size:18px}.crt-section-banner .crt-note{color:rgba(255,255,255,.88)!important}.crt-section-body{padding:14px 15px 16px;background:#fff}
      .crt-section-daily .crt-section-banner{background:linear-gradient(135deg,#0b72b8,#169fc5)}
      .crt-section-absent .crt-section-banner{background:linear-gradient(135deg,#b8324a,#dc5964)}
      .crt-section-substitute .crt-section-banner{background:linear-gradient(135deg,#7a4cc5,#4f6edb)}
      .crt-section-banner .crt-badge{background:rgba(255,255,255,.18)!important;color:#fff!important;border:1px solid rgba(255,255,255,.28);font-size:10px;padding:6px 10px}
      .crt-section-banner .crt-badge.published{background:rgba(31,196,103,.28)!important}.crt-section-banner .crt-badge.draft{background:rgba(255,192,64,.26)!important}.crt-section-banner .crt-badge.none{background:rgba(255,255,255,.15)!important}
      /* Today View: same clear 3-panel layout for Staff, Admin and Principal. */
      .crt-today-grid{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(210px,.65fr) minmax(300px,1fr);gap:12px;align-items:start}
      .crt-today-grid>.crt-today-section{min-width:0;margin-bottom:0}
      .crt-today-grid .crt-section-body{min-width:0}
      .crt-today-grid .crt-section-daily .crt-table-wrap{max-width:100%;overflow:auto}
      .crt-today-grid .crt-section-daily .crt-table{min-width:820px}
      .crt-today-grid .crt-section-absent .crt-absent-list{display:grid;gap:8px}
      .crt-today-grid .crt-section-absent .crt-absent-chip{width:100%;border-radius:12px;justify-content:flex-start;padding:10px 11px}
      .crt-sub-cards{display:grid;gap:9px}.crt-sub-card{border:1px solid #d8e4ed;background:#f8fbfd;border-radius:13px;padding:10px;box-shadow:0 4px 12px rgba(20,68,100,.05)}
      .crt-sub-card.crt-mine{background:#e7f8ee;border-color:#76c892;box-shadow:0 5px 14px rgba(36,145,78,.10)}
      .crt-sub-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}.crt-sub-period{font-size:11px;font-weight:950;color:#5b3ea7;background:#eee8ff;border-radius:999px;padding:5px 8px}.crt-sub-class{font-size:12px;font-weight:950;color:#173f5d}
      .crt-sub-subject{font-size:11px;font-weight:900;color:#284f69;margin-bottom:8px}.crt-sub-arrow{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:6px;align-items:center;font-size:10px}.crt-sub-person{min-width:0}.crt-sub-person small{display:block;color:#758896;font-size:8px;text-transform:uppercase;font-weight:900;margin-bottom:2px}.crt-sub-person strong{display:block;white-space:normal;overflow-wrap:anywhere;color:#284b63}.crt-sub-arrow-mark{font-size:16px;color:#7656cf;font-weight:950}.crt-sub-info{margin-top:8px;display:flex;justify-content:flex-end}.crt-sub-info .crt-btn{padding:6px 8px;font-size:9px}
      @media(max-width:1250px){.crt-today-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.crt-today-grid .crt-section-daily{grid-column:1/-1}}
      @media(max-width:1100px){.crt-shell{grid-template-columns:200px minmax(0,1fr)}.crt-flow{grid-template-columns:1fr 1fr}.crt-routine-controls{grid-template-columns:1fr 1fr}.crt-routine-controls>.crt-actions{grid-column:1/-1}}
      @media(max-width:820px){.crt-overlay{padding:0}.crt-shell{width:100vw;height:100dvh;border-radius:0;grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr)}.crt-side{padding:8px!important;overflow-x:auto!important;overflow-y:hidden!important;position:relative!important;inset:auto!important;z-index:60!important;box-shadow:0 4px 14px rgba(0,0,0,.08)!important;width:100%!important;height:auto!important;min-height:auto!important}.crt-brand{display:none}.crt-nav{display:flex!important;position:static!important;inset:auto!important;width:max-content!important;min-width:max-content!important;height:auto!important;gap:7px!important;overflow:visible!important}.crt-nav button{width:auto!important;flex:0 0 auto!important;padding:10px 12px!important;font-size:11px!important;background:rgba(255,255,255,.08)!important}.crt-content{padding:10px}.crt-grid{grid-template-columns:1fr 1fr}.crt-check-grid{grid-template-columns:1fr 1fr}.crt-control-center{grid-template-columns:1fr}.crt-control-tile{min-height:76px}.crt-routine-controls{grid-template-columns:1fr 1fr}.crt-mobile-scroll-note{display:block}.crt-edit-table,.crt-table{min-width:900px}}
      @media(max-width:640px){.crt-today-grid{grid-template-columns:1fr}.crt-today-grid .crt-section-daily{grid-column:auto}}
      .crt-nav button{white-space:nowrap}.crt-nav button.active{background:rgba(255,255,255,.24)!important;box-shadow:inset 4px 0 0 #fff}.crt-section-body{min-height:120px}
      @media(max-width:820px){.crt-nav button.active{box-shadow:inset 0 -3px 0 #fff}}
      @media(max-width:560px){.crt-top{padding:10px 11px}.crt-top h2{font-size:16px}.crt-close{width:36px;height:36px}.crt-grid,.crt-check-grid,.crt-flow{grid-template-columns:1fr}.crt-row .crt-field{min-width:100%;flex:1 1 100%}.crt-content{padding:8px}.crt-card{padding:11px;border-radius:14px}.crt-nav button{font-size:10px;padding:9px 10px}.crt-actions{width:100%}.crt-actions .crt-btn{flex:1 1 140px}.crt-routine-controls{grid-template-columns:1fr}.crt-routine-controls>.crt-actions{grid-column:auto}.crt-period-box{width:100%}.crt-manager{align-items:flex-start;flex-direction:column}.crt-manager .crt-btn{width:100%}.crt-section-banner{padding:13px}.crt-section-banner h3{font-size:15px}.crt-table th,.crt-table td{padding:7px}.crt-control-tile{min-height:72px;padding:12px}.crt-flow-step{min-height:62px}}
    `;document.head.appendChild(st);
  }

  function injectButtons(){
    const staffHost=document.querySelector('#staffDashboardPopup .staff-dashboard-quick-actions');
    if(staffHost&&!byId('staffDashboardClassRoutineAction')){
      const b=document.createElement('button');b.id='staffDashboardClassRoutineAction';b.type='button';b.className='staff-dashboard-action class-routine';
      b.innerHTML='<span class="staff-dashboard-action-icon">📅</span><span class="staff-dashboard-action-copy"><strong>Class Routine</strong><small>Daily routine • Absent • Substitute</small></span><span class="staff-dashboard-action-arrow">→</span>';
      b.addEventListener('click',()=>openClassRoutineV1('staff'));staffHost.appendChild(b);
    }
    const adminTabs=document.querySelector('#websiteAdminPanel .website-admin-tabs');
    if(adminTabs&&!byId('websiteAdminClassRoutineButton')){
      const b=document.createElement('button');b.id='websiteAdminClassRoutineButton';b.type='button';b.textContent='📅 Class Routine';
      b.addEventListener('click',()=>openClassRoutineV1('admin'));adminTabs.appendChild(b);
    }
  }

  function shell(){
    let ov=byId(MOD_ID);if(ov)return ov;
    ov=document.createElement('div');ov.id=MOD_ID;ov.className='crt-overlay';
    ov.innerHTML=`<div class="crt-shell" role="dialog" aria-modal="true" aria-label="Class Routine">
      <aside class="crt-side"><div class="crt-brand"><strong>CLASS ROUTINE</strong><small>St. Augustine Academic Foundation<br>Permanent + Daily Substitute</small></div><div id="crtNav" class="crt-nav" role="navigation" aria-label="Class Routine navigation"></div></aside>
      <main class="crt-main"><header class="crt-top"><div><h2 id="crtTitle">Class Routine</h2><div id="crtMeta" class="crt-meta"></div></div><button class="crt-close" type="button" onclick="closeClassRoutineV1()">×</button></header><div class="crt-content"><div id="crtToast" class="crt-toast"></div><div id="crtPage"></div></div></main>
    </div>`;
    document.body.appendChild(ov);return ov;
  }

  function navItems(){
    const a=[
      ['daily','📅 Daily Class Routine'],
      ['absent','🚫 Absent Teachers'],
      ['subview','🔁 Substitute Routine']
    ];
    if(ctx?.can_manage)a.push(['substitute','⚙️ Manage Substitute']);
    if(ctx?.can_edit_class_routine)a.push(['permanent','🗓 Permanent Routine']);
    if(ctx?.can_delegate)a.push(['access','🔐 Manager Access']);
    return a;
  }
  function renderNav(){
    const h=byId('crtNav');if(!h)return;
    h.innerHTML=navItems().map(([id,label])=>`<button type="button" class="${id===activeView?'active':''}" onclick="crtShowView('${id}')">${label}</button>`).join('');
  }
  function setMeta(){
    if(!ctx)return;
    const m=byId('crtMeta');if(m)m.textContent=`${ctx.today_bs||''} • ${ctx.day_key||''} • ${String(ctx.role||'staff').replace(/_/g,' ').toUpperCase()}`;
  }

  window.openClassRoutineV1=async function(mode='staff'){
    launchMode=mode==='admin'?'admin':'staff';
    if(launchMode==='admin'&&!isAdminLoggedIn()){
      if(typeof openStudentAdminLogin==='function')openStudentAdminLogin();
      return;
    }
    if(launchMode==='staff'&&!isStaffLoggedIn()){
      if(typeof openStaffLogin==='function')openStaffLogin();
      return;
    }
    injectStyle();injectButtons();
    const ov=shell();ov.style.display='flex';document.body.style.overflow='hidden';
    byId('crtPage').innerHTML='<div class="crt-card">Loading secure Class Routine…</div>';
    try{
      ctx=await rpc('routine_context');
      classState.year=ctx.academic_year||'2083';
      activeView='daily';renderNav();setMeta();await renderDailyTab();
    }catch(e){byId('crtPage').innerHTML=`<div class="crt-card"><div class="crt-empty">${esc(errText(e))}</div></div>`;}
  };
  window.closeClassRoutineV1=function(){const ov=byId(MOD_ID);if(ov)ov.style.display='none';document.body.style.overflow='auto';};
  window.crtShowView=async function(view){
    if(view==='substitute'&&!ctx?.can_manage)return;
    if(view==='permanent'&&!ctx?.can_edit_class_routine)return;
    if(view==='access'&&!ctx?.can_delegate)return;
    activeView=view;renderNav();
    try{
      if(view==='daily')await renderDailyTab();
      else if(view==='absent')await renderAbsentTab();
      else if(view==='subview')await renderSubstituteTab();
      else if(view==='substitute')await renderSubstituteManagement();
      else if(view==='permanent')await loadPermanentRoutine(classState.year);
      else if(view==='access')await renderManagerAccess();
    }catch(e){toast(errText(e),'err');}
  };

  function routineMap(entries=[]){const m=new Map();entries.forEach(r=>m.set(key(r.class_name,Number(r.period_no)),r));return m;}
  function classOrder(name){const i=CLASSES.indexOf(name);return i<0?999:i;}
  function publishedStatus(data){return data?.run_status==='published'?'<span class="crt-badge published">PUBLISHED ✓</span>':data?.run_status==='draft'?'<span class="crt-badge draft">DRAFT</span>':'<span class="crt-badge none">NO DAILY SUBSTITUTE PUBLISHED</span>';}

  function dailyRoutineHtml(data){
    const entries=data?.routine_entries||[],count=Number(data?.period_count||8),map=routineMap(entries);
    if(!entries.length)return '<div class="crt-empty">No published permanent Class Routine is available for this day yet.</div>';
    const head=Array.from({length:count},(_,i)=>`<th>Period ${i+1}</th>`).join('');
    const body=CLASSES.map(cls=>`<tr><td><strong>${esc(cls)}</strong></td>${Array.from({length:count},(_,i)=>{const r=map.get(key(cls,i+1));return `<td><div class="crt-read-cell">${r?.subject_name?`<div class="crt-cell-subject">${esc(r.subject_name)}</div>`:'<span class="crt-small">—</span>'}${r?.teacher_name?`<div class="crt-cell-teacher">${esc(r.teacher_name)}</div>`:''}</div></td>`;}).join('')}</tr>`).join('');
    return `<div class="crt-table-wrap"><table class="crt-table"><thead><tr><th>Class</th>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }
  function absencesHtml(rows=[]){
    if(!rows.length)return '<div class="crt-empty">No absent teacher has been published for today.</div>';
    return `<div class="crt-absent-list">${rows.map(r=>`<span class="crt-absent-chip">● ${esc(r.staff_name)}</span>`).join('')}</div>`;
  }
  function todaySubstitutionsHtml(rows=[]){
    if(!rows.length)return '<div class="crt-empty">No substitute period has been published for today.</div>';
    return `<div class="crt-sub-cards">${rows.map(r=>`<div class="crt-sub-card ${r.is_mine?'crt-mine':''}"><div class="crt-sub-card-top"><span class="crt-sub-period">Period ${Number(r.period_no)}</span><span class="crt-sub-class">${esc(r.class_name)}</span></div><div class="crt-sub-subject">${esc(r.subject_name||'—')}</div><div class="crt-sub-arrow"><div class="crt-sub-person"><small>Absent</small><strong>${esc(r.absent_teacher_name||'—')}</strong></div><span class="crt-sub-arrow-mark">→</span><div class="crt-sub-person"><small>Substitute</small><strong>${esc(r.substitute_teacher_name||'Not assigned')}</strong></div></div><div class="crt-sub-info">${r.acknowledged_at?'<span class="crt-badge ack">ACKNOWLEDGED ✓</span>':r.is_mine?`<button class="crt-btn good" type="button" onclick="crtAcknowledge(${Number(r.id)})">I GOT IT ✓</button>`:'<span class="crt-badge pending">Waiting</span>'}</div></div>`).join('')}</div>`;
  }
  function substitutionsHtml(rows=[]){
    if(!rows.length)return '<div class="crt-empty">No substitute period has been published for today.</div>';
    return `<div class="crt-table-wrap"><table class="crt-table crt-sub-table"><thead><tr><th>Period</th><th>Class</th><th>Subject</th><th>Absent Teacher</th><th>Substitute Teacher</th><th>Information</th></tr></thead><tbody>${rows.map(r=>`<tr class="crt-sub-highlight ${r.is_mine?'crt-my-sub':''}"><td><strong>Period ${Number(r.period_no)}</strong></td><td><strong>${esc(r.class_name)}</strong></td><td>${esc(r.subject_name||'—')}</td><td>${esc(r.absent_teacher_name)}</td><td><strong>${esc(r.substitute_teacher_name||'Not assigned')}</strong></td><td>${r.acknowledged_at?'<span class="crt-badge ack">ACKNOWLEDGED ✓</span>':r.is_mine?`<button class="crt-btn good" type="button" onclick="crtAcknowledge(${Number(r.id)})">I GOT IT ✓</button>`:'<span class="crt-badge pending">Waiting acknowledgement</span>'}</td></tr>`).join('')}</tbody></table></div>`;
  }

  async function loadTodayPublic(){
    todayData=await rpc('routine_get_today',{p_manage:false});
    return todayData;
  }

  function managerQuickActions(){
    if(!(ctx?.can_manage||ctx?.can_edit_class_routine||ctx?.can_delegate))return '';
    return `<div class="crt-control-center">
      ${ctx?.can_manage?`<button class="crt-control-tile sub" type="button" onclick="crtShowView('substitute')"><span class="ico">⚙️</span><span><strong>Manage Today’s Substitute</strong><small>Absent teacher tick → substitute assign → Publish / Unpublish.</small></span></button>`:''}
      ${ctx?.can_edit_class_routine?`<button class="crt-control-tile perm" type="button" onclick="crtShowView('permanent')"><span class="ico">🗓</span><span><strong>Permanent Class Routine</strong><small>Add/remove periods, edit routine, publish or unpublish permanent routine.</small></span></button>`:''}
      ${ctx?.can_delegate?`<button class="crt-control-tile access" type="button" onclick="crtShowView('access')"><span class="ico">🔐</span><span><strong>Manager Access</strong><small>Give or remove Substitute Routine Manager access when needed.</small></span></button>`:''}
    </div>`;
  }

  async function renderDailyTab(){
    byId('crtTitle').textContent='Daily Class Routine';
    byId('crtPage').innerHTML='<div class="crt-card">Loading daily class routine…</div>';
    const data=await loadTodayPublic();
    byId('crtPage').innerHTML=`${managerQuickActions()}
      <section class="crt-card crt-today-section crt-section-daily">
        <div class="crt-section-banner"><div><h3>📅 Daily Class Routine</h3><div class="crt-note">${esc(data.today_bs)} • ${esc(data.day_key)} • Same permanent routine for the whole academic year</div></div><span class="crt-badge published">PERMANENT ROUTINE</span></div>
        <div class="crt-section-body">${dailyRoutineHtml(data)}</div>
      </section>`;
  }

  async function renderAbsentTab(){
    byId('crtTitle').textContent='Absent Teachers Today';
    byId('crtPage').innerHTML='<div class="crt-card">Loading absent teachers…</div>';
    const data=await loadTodayPublic();
    byId('crtPage').innerHTML=`
      <section class="crt-card crt-today-section crt-section-absent">
        <div class="crt-section-banner"><div><h3>🚫 Absent Teachers Today</h3><div class="crt-note">आजका published absent teachers मात्र</div></div>${publishedStatus(data)}</div>
        <div class="crt-section-body">${absencesHtml(data.absences||[])}</div>
      </section>`;
  }

  async function renderSubstituteTab(){
    byId('crtTitle').textContent='Today’s Substitute Routine';
    byId('crtPage').innerHTML='<div class="crt-card">Loading substitute routine…</div>';
    const data=await loadTodayPublic();
    const mine=(data.substitutions||[]).filter(r=>r.is_mine);
    const myAlert=mine.length?`<div class="crt-my-alert">🔔 You have ${mine.length} substitute class${mine.length>1?'es':''} today: ${mine.map(r=>`Period ${Number(r.period_no)} — ${esc(r.class_name)}`).join(' • ')}</div>`:'';
    byId('crtPage').innerHTML=`${myAlert}
      <section class="crt-card crt-today-section crt-section-substitute">
        <div class="crt-section-banner"><div><h3>🔁 Today’s Substitute Routine</h3><div class="crt-note">आजका replacement periods मात्र</div></div>${publishedStatus(data)}</div>
        <div class="crt-section-body">${todaySubstitutionsHtml(data.substitutions||[])}</div>
      </section>`;
  }

  window.crtAcknowledge=async function(id){
    try{await rpc('routine_acknowledge_substitution',{p_substitution_id:Number(id)});toast('Substitute class acknowledged.','ok');await renderSubstituteTab();}catch(e){toast(errText(e),'err');}
  };

  function eligibleDirectory(){
    const dir=staffDirectory();
    return Object.entries(dir).filter(([id,s])=>{
      const d=lower(s?.designation);
      // Use the website's existing Staff/Teacher directory as the single source.
      // Management staff may also teach, so CEO/MD/Principal/Vice Principal and
      // other staff remain selectable. Only clearly non-teaching support roles
      // are excluded from Class Routine teacher assignment.
      return !(d.includes('driver')||d.includes('support staff'));
    }).map(([id,s])=>({id,name:s.name||id,designation:s.designation||'Staff'})).sort((a,b)=>a.name.localeCompare(b.name));
  }
  function teachersInTodayRoutine(data){
    const m=new Map();(data?.routine_entries||[]).forEach(r=>{if(r.teacher_staff_id)m.set(lower(r.teacher_staff_id),r.teacher_name||r.teacher_staff_id);});
    return [...m].map(([id,name])=>({id,name})).sort((a,b)=>a.name.localeCompare(b.name));
  }
  function busyNormal(period,data){
    const s=new Set();(data?.routine_entries||[]).forEach(r=>{if(Number(r.period_no)===Number(period)&&r.teacher_staff_id)s.add(lower(r.teacher_staff_id));});return s;
  }
  function busySub(period,data,exceptClass){
    const s=new Set();(data?.substitutions||[]).forEach(r=>{if(Number(r.period_no)===Number(period)&&r.class_name!==exceptClass&&r.substitute_teacher_staff_id)s.add(lower(r.substitute_teacher_staff_id));});return s;
  }
  function substituteOptions(row,data,current=''){
    const absent=new Set((data.absences||[]).map(a=>lower(a.staff_id)));
    const busyN=busyNormal(row.period_no,data),busyS=busySub(row.period_no,data,row.class_name),cur=lower(current);
    return eligibleDirectory().filter(s=>{
      const id=lower(s.id);if(id===cur)return true;if(absent.has(id))return false;if(busyN.has(id))return false;if(busyS.has(id))return false;return true;
    }).map(s=>`<option value="${esc(s.id)}" ${lower(s.id)===cur?'selected':''}>${esc(s.name)} — ${esc(s.designation)}</option>`).join('');
  }

  function managementControls(data){
    const status=data?.run_status||'none';
    if(status==='none')return `<button class="crt-btn primary" type="button" onclick="crtStartTodayDraft()">+ START TODAY’S SUBSTITUTE ROUTINE</button>`;
    if(status==='published')return `<button class="crt-btn primary" type="button" onclick="crtStartTodayDraft()">✏️ EDIT TODAY</button><button class="crt-btn danger" type="button" onclick="crtUnpublishToday()">🙈 UNPUBLISH</button>`;
    return `<button class="crt-btn good" type="button" onclick="crtPublishToday()">📢 PUBLISH TODAY</button>${data.has_published?'<span class="crt-note">Published version remains visible to Staff until you Publish this draft.</span>':''}`;
  }
  function absentCheckboxes(data){
    const listed=teachersInTodayRoutine(data),abs=new Set((data.absences||[]).map(a=>lower(a.staff_id))),editable=data.run_status==='draft';
    if(!listed.length)return '<div class="crt-empty">Publish the permanent Class Routine first. Today’s teaching list will then appear here automatically.</div>';
    return `<div class="crt-check-grid">${listed.map(t=>`<label class="crt-check ${abs.has(t.id)?'absent':''}"><input type="checkbox" ${abs.has(t.id)?'checked':''} ${editable?'':'disabled'} onchange="crtToggleAbsent('${esc(t.id)}','${esc(t.name)}',this.checked)"><span>${esc(t.name)}</span></label>`).join('')}</div>`;
  }
  function vacantRows(data){
    const absentMap=new Map((data.absences||[]).map(a=>[lower(a.staff_id),a]));
    const vacancies=(data.routine_entries||[]).filter(r=>r.teacher_staff_id&&absentMap.has(lower(r.teacher_staff_id))).sort((a,b)=>Number(a.period_no)-Number(b.period_no)||classOrder(a.class_name)-classOrder(b.class_name));
    const subs=new Map((data.substitutions||[]).map(s=>[key(s.class_name,Number(s.period_no)),s]));
    if(!vacancies.length)return '<div class="crt-empty">Tick an absent teacher above. That teacher’s scheduled Period / Class / Subject will appear here automatically.</div>';
    return `<div class="crt-table-wrap"><table class="crt-table"><thead><tr><th>Period</th><th>Class</th><th>Subject</th><th>Absent Teacher</th><th>Substitute Teacher</th><th>Status</th></tr></thead><tbody>${vacancies.map(r=>{const s=subs.get(key(r.class_name,Number(r.period_no)))||{};const cur=s.substitute_teacher_staff_id||'';return `<tr class="crt-vacant"><td><strong>Period ${Number(r.period_no)}</strong></td><td><strong>${esc(r.class_name)}</strong></td><td>${esc(r.subject_name||'—')}</td><td>${esc(r.teacher_name||'—')}</td><td><select ${data.run_status==='draft'?'':'disabled'} onchange="crtAssignSubstitute(this,${Number(r.id)},'${esc(r.class_name)}',${Number(r.period_no)},'${esc(r.subject_name||'')}','${esc(r.teacher_staff_id||'')}','${esc(r.teacher_name||'')}')"><option value="">— Select Substitute —</option>${substituteOptions(r,data,cur)}</select></td><td>${cur?'<span class="crt-badge draft">READY</span>':'<span class="crt-badge pending">UNASSIGNED</span>'}</td></tr>`;}).join('')}</tbody></table></div>`;
  }

  async function renderSubstituteManagement(){
    byId('crtTitle').textContent='Substitute Routine Management';
    byId('crtPage').innerHTML='<div class="crt-card">Loading today’s management view…</div>';
    manageData=await rpc('routine_get_today',{p_manage:true});
    byId('crtPage').innerHTML=`
      <div class="crt-card"><div class="crt-section-head"><div><h3>🔁 Today — ${esc(manageData.today_bs)} • ${esc(manageData.day_key)}</h3><div class="crt-note">Daily substitute is temporary. Permanent Class Routine stays unchanged.</div></div><div class="crt-actions">${managementControls(manageData)}</div></div><div class="crt-status-line">${publishedStatus(manageData)}${manageData.has_published&&manageData.run_status==='draft'?'<span class="crt-badge published">OLD PUBLISHED VERSION STILL LIVE</span>':''}</div></div>
      <div class="crt-card"><div class="crt-section-head"><div><h3>1. Mark Absent Teacher</h3><div class="crt-note">Only teachers who have a Class in today’s published routine are listed.</div></div></div>${absentCheckboxes(manageData)}</div>
      <div class="crt-card"><div class="crt-section-head"><div><h3>2. Assign Substitute Teacher</h3><div class="crt-note">Busy teachers and teachers already assigned another substitute in the same Period are automatically removed from the list.</div></div></div>${vacantRows(manageData)}</div>
      <div class="crt-card"><div class="crt-section-head"><div><h3>3. Current Draft / Published Changes</h3><div class="crt-note">Admin/Principal can see who was assigned and whether the assigned teacher acknowledged the published class.</div></div></div>${substitutionsHtml(manageData.substitutions||[])}</div>`;
  }
  window.crtStartTodayDraft=async function(){try{await rpc('routine_open_today_draft');toast('Today’s substitute draft is ready.','ok');await renderSubstituteManagement();}catch(e){toast(errText(e),'err');}};
  window.crtToggleAbsent=async function(id,name,checked){try{await rpc('routine_set_absent',{p_staff_id:id,p_staff_name:name,p_absent:!!checked});toast(checked?`${name} marked absent.`:`${name} removed from absent list.`,'ok');await renderSubstituteManagement();}catch(e){toast(errText(e),'err');await renderSubstituteManagement();}};
  window.crtAssignSubstitute=async function(select,entryId,cls,period,subject,absId,absName){
    const sid=select.value||'';const s=staffDirectory()[sid]||{};
    try{await rpc('routine_save_substitution',{p_routine_entry_id:Number(entryId),p_class_name:cls,p_period_no:Number(period),p_subject_name:subject||null,p_absent_teacher_staff_id:absId,p_absent_teacher_name:absName,p_substitute_teacher_staff_id:sid||null,p_substitute_teacher_name:sid?(s.name||sid):null,p_note:null});toast(sid?`Substitute assigned: ${s.name||sid}.`:'Substitute assignment cleared.','ok');await renderSubstituteManagement();}catch(e){toast(errText(e),'err');await renderSubstituteManagement();}
  };
  window.crtPublishToday=async function(){
    try{
      const absent=new Set((manageData?.absences||[]).map(a=>lower(a.staff_id)));
      const vacancies=(manageData?.routine_entries||[]).filter(r=>r.teacher_staff_id&&absent.has(lower(r.teacher_staff_id)));
      const assigned=new Set((manageData?.substitutions||[]).filter(s=>s.substitute_teacher_staff_id).map(s=>key(s.class_name,Number(s.period_no))));
      const missing=vacancies.filter(v=>!assigned.has(key(v.class_name,Number(v.period_no))));
      if(missing.length&&!confirm(`${missing.length} absent-teacher period(s) still have no substitute teacher. Publish the assigned periods anyway?`))return;
      if(!confirm('Publish today’s Substitute Routine? Staff will see the absent list and changed periods, and assigned substitute teachers will receive notifications.'))return;
      await rpc('routine_publish_today');toast('Today’s Substitute Routine published.','ok');await renderSubstituteManagement();
    }catch(e){toast(errText(e),'err');}
  };
  window.crtUnpublishToday=async function(){
    if(!confirm('Unpublish today’s Substitute Routine? Staff will stop seeing today’s absent/substitute list until it is published again.'))return;
    try{await rpc('routine_unpublish_today');toast('Today’s Substitute Routine is now unpublished and editable.','ok');await renderSubstituteManagement();}catch(e){toast(errText(e),'err');}
  };

  function directoryOptions(selected='',extraName=''){
    const cur=lower(selected);let rows=eligibleDirectory();
    if(cur&&!rows.some(s=>lower(s.id)===cur))rows=[{id:selected,name:extraName||selected,designation:'Staff'},...rows];
    return `<option value="">— Teacher —</option>${rows.map(s=>`<option value="${esc(s.id)}" ${lower(s.id)===cur?'selected':''}>${esc(s.name)} — ${esc(s.designation)}</option>`).join('')}`;
  }
  function normalizePermanentEntries(entries=[]){
    const rows=Array.isArray(entries)?entries:[];
    if(!rows.length)return [];
    const counts=new Map();
    rows.forEach(e=>{const d=normal(e.day_key)||'Sunday';counts.set(d,(counts.get(d)||0)+1);});
    const priority=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const master=[...counts.keys()].sort((a,b)=>(counts.get(b)-counts.get(a))+(priority.indexOf(a)-priority.indexOf(b))/1000)[0]||'Sunday';
    return rows.filter(e=>(normal(e.day_key)||'Sunday')===master).map(e=>({...e,day_key:'Sunday'}));
  }
  function capturePermanentGrid(){
    if(!classState.editable)return;
    const page=byId('crtPage');if(!page)return;
    const existing=new Map(classState.entries.map(e=>[key(e.class_name,Number(e.period_no)),{...e,day_key:'Sunday'}]));
    page.querySelectorAll('.crt-edit-cell[data-class-name]').forEach(cell=>{
      const cls=cell.dataset.className,period=Number(cell.dataset.period);
      const subject=normal(cell.querySelector('.crt-subject-input')?.value),teacherId=normal(cell.querySelector('.crt-teacher-select')?.value),teacher=staffDirectory()[teacherId];
      const k=key(cls,period);
      if(subject||teacherId)existing.set(k,{day_key:'Sunday',class_name:cls,period_no:period,subject_name:subject||null,teacher_staff_id:teacherId||null,teacher_name:teacherId?(teacher?.name||teacherId):null});
      else existing.delete(k);
    });
    classState.entries=[...existing.values()];
  }
  function classEntry(cls,period){return classState.entries.find(e=>e.class_name===cls&&Number(e.period_no)===Number(period));}
  function permanentGridHtml(){
    const count=Number(classState.periodCount||8),editable=classState.editable;
    const head=Array.from({length:count},(_,i)=>`<th>Period ${i+1}</th>`).join('');
    const body=CLASSES.map(cls=>`<tr><td><strong>${esc(cls)}</strong></td>${Array.from({length:count},(_,i)=>{const p=i+1,e=classEntry(cls,p)||{};if(!editable)return `<td><div class="crt-read-cell">${e.subject_name?`<div class="crt-cell-subject">${esc(e.subject_name)}</div>`:'<span class="crt-small">—</span>'}${e.teacher_name?`<div class="crt-cell-teacher">${esc(e.teacher_name)}</div>`:''}</div></td>`;return `<td><div class="crt-edit-cell" data-class-name="${esc(cls)}" data-period="${p}"><input class="crt-subject-input" list="crtSubjectList" value="${esc(e.subject_name||'')}" placeholder="Subject"><select class="crt-teacher-select">${directoryOptions(e.teacher_staff_id||'',e.teacher_name||'')}</select></div></td>`;}).join('')}</tr>`).join('');
    return `<div class="crt-table-wrap"><table class="crt-table crt-edit-table"><thead><tr><th>Class</th>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }
  function detectClassConflicts(entries){
    const seen=new Map(),conf=[];
    entries.forEach(e=>{if(!e.teacher_staff_id)return;const k=`${e.period_no}|${lower(e.teacher_staff_id)}`;if(seen.has(k))conf.push(`Period ${e.period_no}: ${e.teacher_name||e.teacher_staff_id} — ${seen.get(k)} & ${e.class_name}`);else seen.set(k,e.class_name);});
    return conf;
  }
  function permanentHeader(current,draft){
    const active=draft?.exists?draft:current,editable=!!draft?.exists;
    const status=editable?'<span class="crt-badge draft">DRAFT — NOT VISIBLE TO STAFF</span>':current?.exists?'<span class="crt-badge published">PUBLISHED ✓</span>':'<span class="crt-badge none">NO ROUTINE PUBLISHED</span>';
    let actions='';
    if(editable)actions='<button class="crt-btn warn" type="button" onclick="crtSaveClassDraft()">💾 SAVE DRAFT</button><button class="crt-btn good" type="button" onclick="crtPublishClassRoutine()">📢 SAVE & PUBLISH</button>';
    else if(current?.exists)actions='<button class="crt-btn primary" type="button" onclick="crtOpenClassDraft()">✏️ EDIT CLASS ROUTINE</button><button class="crt-btn danger" type="button" onclick="crtUnpublishClassRoutine()">🙈 UNPUBLISH PERMANENT</button>';
    else actions='<button class="crt-btn primary" type="button" onclick="crtOpenClassDraft()">+ CREATE CLASS ROUTINE</button>';
    return {active,editable,status,actions};
  }

  async function loadPermanentRoutine(year){
    byId('crtTitle').textContent='Permanent Class Routine';
    const clean=normal(year)||'2083';classState.year=clean;
    byId('crtPage').innerHTML='<div class="crt-card">Loading permanent routine…</div>';
    const current=await rpc('routine_get_current',{p_academic_year:clean});
    const draft=await rpc('routine_get_draft',{p_academic_year:clean});
    const h=permanentHeader(current,draft),active=h.active||{};
    classState.data={current,draft};classState.editable=h.editable;classState.entries=normalizePermanentEntries(active.entries||[]);classState.periodCount=Number(active.period_count||8);
    renderPermanentRoutine(h);
  }
  function renderPermanentRoutine(headerInfo){
    const h=headerInfo||permanentHeader(classState.data?.current,classState.data?.draft);
    const edit=!!classState.editable;
    byId('crtPage').innerHTML=`<datalist id="crtSubjectList">${SUBJECTS.map(s=>`<option value="${esc(s)}"></option>`).join('')}</datalist>
      <div class="crt-flow">
        <div class="crt-flow-step"><span class="n">1</span><strong>Select Academic Year</strong><small>Load the year you want to manage.</small></div>
        <div class="crt-flow-step"><span class="n">2</span><strong>Set Periods</strong><small>Edit mode allows + Add Period or − Remove Last Period.</small></div>
        <div class="crt-flow-step"><span class="n">3</span><strong>Fill Routine Once</strong><small>Enter subject and teacher once. The same routine runs every school day.</small></div>
        <div class="crt-flow-step"><span class="n">4</span><strong>Save & Publish</strong><small>Staff view changes only after Publish. Permanent routine can also be Unpublished.</small></div>
      </div>
      <div class="crt-card"><div class="crt-section-head"><div><h3>🗓 Permanent Class Routine</h3><div class="crt-note">One routine applies to the whole academic year. Daily substitutes do not change the permanent routine.</div></div><div class="crt-actions">${h.actions}</div></div>
        <div class="crt-routine-controls">
          <div class="crt-field"><label>Academic Year</label><input id="crtAcademicYear" value="${esc(classState.year)}" ${edit?'disabled':''}></div>
          <div class="crt-field"><label>Periods Per Day</label>${edit?`<div class="crt-period-box"><button class="crt-btn danger" type="button" onclick="crtRemovePeriod()">− REMOVE</button><span class="crt-period-count"><strong>${Number(classState.periodCount)}</strong><small>Periods</small></span><button class="crt-btn good" type="button" onclick="crtAddPeriod()">+ ADD</button></div>`:`<div class="crt-period-box"><span class="crt-period-count"><strong>${Number(classState.periodCount)}</strong><small>Published Periods</small></span></div>`}</div>
          <div class="crt-actions"><button class="crt-btn ghost" type="button" onclick="crtLoadAcademicYear()" ${edit?'disabled':''}>↻ LOAD YEAR</button></div>
        </div>
        <div style="margin-top:10px" class="crt-status-line">${h.status}${classState.data?.current?.exists?`<span class="crt-small">Published version ${Number(classState.data.current.version_no||0)}</span>`:''}</div>
        ${!classState.data?.current?.exists&&edit?'<div class="crt-danger-note" style="margin-top:10px">No permanent routine is currently published. Staff will not see a Daily Class Routine until you publish this draft.</div>':''}
      </div>
      <div class="crt-card"><div class="crt-section-head"><div><h3>Whole-Year Routine</h3><div class="crt-note">Enter one Class Routine only. This same published routine is used every school day for the selected academic year.</div></div><span class="crt-badge published">ONE ROUTINE • WHOLE YEAR</span></div><div class="crt-mobile-scroll-note">↔ On mobile/tablet, swipe the routine table left/right to see all periods.</div>${permanentGridHtml()}</div>`;
  }
  window.crtLoadAcademicYear=async function(){const y=byId('crtAcademicYear')?.value||classState.year;try{await loadPermanentRoutine(y);}catch(e){toast(errText(e),'err');}};
  window.crtOpenClassDraft=async function(){
    const y=normal(byId('crtAcademicYear')?.value)||classState.year||'2083';
    try{await rpc('routine_open_class_draft',{p_academic_year:y});toast('Editable Class Routine draft created. Staff still sees the old published routine.','ok');await loadPermanentRoutine(y);}catch(e){toast(errText(e),'err');}
  };
  window.crtPeriodCountChanged=function(value){capturePermanentGrid();classState.periodCount=Math.max(1,Math.min(10,Number(value)||8));classState.entries=classState.entries.filter(e=>Number(e.period_no)<=classState.periodCount);renderPermanentRoutine();};
  window.crtAddPeriod=function(){
    if(!classState.editable){toast('Click Edit Class Routine first.','warn');return;}
    capturePermanentGrid();
    if(Number(classState.periodCount)>=10){toast('Maximum 10 periods are supported.','warn');return;}
    classState.periodCount=Number(classState.periodCount)+1;renderPermanentRoutine();toast(`Period ${classState.periodCount} added to the draft. Save/Publish when ready.`,'ok');
  };
  window.crtRemovePeriod=function(){
    if(!classState.editable){toast('Click Edit Class Routine first.','warn');return;}
    capturePermanentGrid();
    const last=Number(classState.periodCount||1);if(last<=1){toast('At least 1 period is required.','warn');return;}
    const used=classState.entries.some(e=>Number(e.period_no)===last&&(e.subject_name||e.teacher_staff_id));
    if(used&&!confirm(`Period ${last} already contains routine entries. Remove this period and all of its entries from the draft?`))return;
    classState.entries=classState.entries.filter(e=>Number(e.period_no)<last);classState.periodCount=last-1;renderPermanentRoutine();toast(`Last period removed. Draft now has ${classState.periodCount} periods.`,'ok');
  };
  async function saveClassDraftCore(showToast=true){
    capturePermanentGrid();
    const entries=classState.entries.filter(e=>Number(e.period_no)<=classState.periodCount&&(e.subject_name||e.teacher_staff_id)).map(e=>({...e,day_key:'Sunday'}));
    const conflicts=detectClassConflicts(entries);if(conflicts.length)throw new Error('Teacher conflict: '+conflicts[0]);
    await rpc('routine_save_class_draft',{p_academic_year:classState.year,p_period_count:Number(classState.periodCount),p_entries:entries});
    if(showToast)toast('Class Routine draft saved. Staff view is unchanged until Publish.','ok');
  }
  window.crtSaveClassDraft=async function(){try{await saveClassDraftCore(true);await loadPermanentRoutine(classState.year);}catch(e){toast(errText(e),'err');}};
  window.crtPublishClassRoutine=async function(){
    if(!confirm('Publish this permanent Class Routine? Staff Daily Class Routine will change to this version immediately after Publish.'))return;
    try{await saveClassDraftCore(false);await rpc('routine_publish_class_draft',{p_academic_year:classState.year});toast('Permanent Class Routine published successfully.','ok');await loadPermanentRoutine(classState.year);}catch(e){toast(errText(e),'err');}
  };
  window.crtUnpublishClassRoutine=async function(){
    if(!confirm('Unpublish this permanent Class Routine? Staff will stop seeing the Daily Class Routine until you publish it again. Today’s published Substitute Routine will also be unpublished for consistency.'))return;
    try{await rpc('routine_unpublish_class_routine',{p_academic_year:classState.year});toast('Permanent Class Routine unpublished. It is now kept as an editable draft.','ok');await loadPermanentRoutine(classState.year);}catch(e){toast(errText(e),'err');}
  };

  async function renderManagerAccess(){
    byId('crtTitle').textContent='Substitute Routine Manager Access';
    byId('crtPage').innerHTML='<div class="crt-card">Loading delegated access…</div>';
    const rows=await rpc('routine_list_managers');
    const choices=eligibleDirectory().filter(s=>s.id!=='joseph');
    byId('crtPage').innerHTML=`
      <div class="crt-card"><div class="crt-section-head"><div><h3>🔐 Substitute Routine Manager</h3><div class="crt-note">Give this access when Admin/Principal may be absent. Access stays active every day until Admin/Principal manually removes it. It does not grant full Admin access or Permanent Class Routine editing.</div></div></div>
        <div class="crt-row"><div class="crt-field"><label>Select Staff</label><select id="crtManagerSelect"><option value="">— Select Staff —</option>${choices.map(s=>`<option value="${esc(s.id)}">${esc(s.name)} — ${esc(s.designation)}</option>`).join('')}</select></div><button class="crt-btn good" type="button" onclick="crtGrantManager()">✓ GRANT ACCESS</button></div>
      </div>
      <div class="crt-card"><h3>Active Manager Access</h3><div class="crt-manager-list" style="margin-top:10px">${rows?.length?rows.map(r=>`<div class="crt-manager"><div><strong>${esc(r.staff_name)}</strong><div class="crt-small">Access remains active until removed${r.granted_by_name?` • Granted by ${esc(r.granted_by_name)}`:''}</div></div><button class="crt-btn danger" type="button" onclick="crtRevokeManager('${esc(r.staff_id)}','${esc(r.staff_name)}')">REMOVE ACCESS</button></div>`).join(''):'<div class="crt-empty">No delegated Substitute Routine Manager access is active.</div>'}</div></div>`;
  }
  window.crtGrantManager=async function(){
    const id=byId('crtManagerSelect')?.value||'',s=staffDirectory()[id];if(!id||!s){toast('Select a Staff member first.','warn');return;}
    try{await rpc('routine_grant_manager',{p_staff_id:id,p_staff_name:s.name||id});toast(`${s.name||id} now has Substitute Routine Manager access until you remove it.`,'ok');await renderManagerAccess();}catch(e){toast(errText(e),'err');}
  };
  window.crtRevokeManager=async function(id,name){
    if(!confirm(`Remove Substitute Routine Manager access from ${name}?`))return;
    try{await rpc('routine_revoke_manager',{p_staff_id:id});toast(`Access removed from ${name}.`,'ok');await renderManagerAccess();}catch(e){toast(errText(e),'err');}
  };

  document.addEventListener('DOMContentLoaded',()=>{injectStyle();injectButtons();setTimeout(injectButtons,700);setTimeout(injectButtons,2200);});
  if(document.readyState!=='loading'){injectStyle();injectButtons();setTimeout(injectButtons,700);}
})();
