/* ============================================================
   ST. AUGUSTINE ACADEMIC FOUNDATION
   SMART ATTENDANCE FINAL V2 — FAST FACE + QR — MOBILE + LAPTOP CAMERA SWITCH
   2026-09-26

   SAFE integration rules:
   - no MutationObserver
   - no permanent setInterval
   - no replacement of existing website modules
   - Staff button + Admin Control Center button are injected once
   - Face scan loop stops when page/module closes
   ============================================================ */
(function(){
  'use strict';

  const SAT_ID='satFinalOverlay';
  const SAT_STYLE='satFinalStyle';
  const CLASSES=['Nursery','LKG','UKG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10'];
  const FACE_MODEL_URL='https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights';
  const FACE_API_URL='https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/dist/face-api.min.js';
  const HTML5QR_URL='https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js';
  const QRCODE_URL='https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';

  let ctx=null, currentView='dashboard', launchMode='staff';
  let qrScanner=null, qrRunning=false, qrBusy=false, qrFacing='environment';
  let faceStream=null, faceScanRunning=false, faceScanTimer=null, faceProfiles=[];
  let faceFacing='user', regFacing='user';
  let faceModelsReady=false, faceModelsLoading=null;
  let registrationSamples=[];
  let reportRows=[];
  let currentQrName='Attendance QR';
  let manualClockTimer=null;

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function cap(v){return String(v||'').replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());}
  function byId(id){return document.getElementById(id);}
  function timeNow(){return new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Kathmandu',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());}
  function classOptions(selected=''){return CLASSES.map(c=>`<option value="${esc(c)}" ${c===selected?'selected':''}>${esc(c)}</option>`).join('');}
  function roleLabel(){if(!ctx)return 'Staff'; if(ctx.is_admin)return 'Admin'; if(ctx.is_full_access)return 'Full Access'; return ctx.class_name?'Class Teacher':'Staff';}

  function staffDb(){
    try{if(typeof initStaffSupabase==='function'){const c=initStaffSupabase(); if(c)return c;}}catch(_){}
    try{if(window.staffSupabase)return window.staffSupabase;}catch(_){}
    return null;
  }
  function adminDb(){
    try{if(typeof initStudentSupabase==='function'){const c=initStudentSupabase(); if(c)return c;}}catch(_){}
    try{if(window.studentSupabase)return window.studentSupabase;}catch(_){}
    return null;
  }
  function db(){
    return launchMode==='admin' ? (adminDb()||staffDb()) : (staffDb()||adminDb());
  }
  async function rpc(name,args={}){
    const c=db();
    if(!c) throw new Error('Supabase session is not ready. Please login again.');
    const {data,error}=await c.rpc(name,args);
    if(error) throw error;
    return data;
  }

  function toast(msg,kind='info'){
    const el=byId('satToast'); if(!el)return;
    el.className='sat-toast '+kind; el.textContent=msg; el.style.display='block';
    clearTimeout(el._t); el._t=setTimeout(()=>{if(el)el.style.display='none';},3800);
  }

  function loadScriptOnce(src,testFn){
    return new Promise((resolve,reject)=>{
      try{if(testFn&&testFn()){resolve();return;}}catch(_){}
      const old=[...document.scripts].find(s=>s.src===src);
      if(old){
        old.addEventListener('load',()=>resolve(),{once:true});
        old.addEventListener('error',()=>reject(new Error('Library failed to load.')),{once:true});
        setTimeout(()=>{try{if(!testFn||testFn())resolve();}catch(_){ }},300);
        return;
      }
      const s=document.createElement('script'); s.src=src; s.async=true;
      s.onload=()=>resolve(); s.onerror=()=>reject(new Error('Library failed to load: '+src));
      document.head.appendChild(s);
    });
  }

  async function ensureQrLibraries(){
    await loadScriptOnce(HTML5QR_URL,()=>typeof window.Html5Qrcode!=='undefined');
    await loadScriptOnce(QRCODE_URL,()=>typeof window.QRCode!=='undefined');
  }

  async function ensureFaceModels(){
    if(faceModelsReady)return;
    if(faceModelsLoading)return faceModelsLoading;
    faceModelsLoading=(async()=>{
      toast('Loading face recognition model…','info');
      await loadScriptOnce(FACE_API_URL,()=>typeof window.faceapi!=='undefined');
      if(typeof faceapi==='undefined')throw new Error('Face recognition library did not load.');
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(FACE_MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(FACE_MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(FACE_MODEL_URL)
      ]);
      faceModelsReady=true;
    })();
    try{await faceModelsLoading;}finally{faceModelsLoading=null;}
  }

  function injectStyle(){
    if(byId(SAT_STYLE))return;
    const st=document.createElement('style'); st.id=SAT_STYLE; st.textContent=`
      .sat-overlay{position:fixed;inset:0;z-index:2147482500;background:rgba(3,18,34,.84);display:none;align-items:center;justify-content:center;padding:12px;font-family:Inter,system-ui,-apple-system,Segoe UI,Arial,sans-serif;box-sizing:border-box}
      .sat-overlay *{box-sizing:border-box}
      .sat-shell{width:min(1320px,calc(100vw - 24px));height:min(900px,calc(100dvh - 24px));min-height:0;background:#f5f9ff;border:1px solid rgba(255,255,255,.45);border-radius:24px;overflow:hidden;box-shadow:0 28px 90px rgba(0,0,0,.38);display:grid;grid-template-columns:230px minmax(0,1fr);color:#123}
      .sat-side{min-width:0;min-height:0;background:linear-gradient(180deg,#07345f 0%,#0a5f9d 62%,#087a75 100%);color:#fff;padding:18px 12px;overflow:auto}
      .sat-brand{padding:3px 8px 16px;border-bottom:1px solid rgba(255,255,255,.16);margin-bottom:10px}.sat-brand strong{display:block;font-size:16px}.sat-brand small{opacity:.78;font-size:11px;line-height:1.35}
      .sat-nav{display:grid;gap:6px}.sat-nav button{width:100%;border:0;background:transparent;color:#edf8ff;text-align:left;padding:10px 11px;border-radius:11px;font-weight:800;font-size:13px;cursor:pointer;white-space:nowrap}.sat-nav button:hover,.sat-nav button.active{background:rgba(255,255,255,.16);color:#fff}
      .sat-main{min-width:0;min-height:0;overflow:hidden;display:flex;flex-direction:column;background:#f5f9ff}.sat-top{flex:0 0 auto;background:#fff;border-bottom:1px solid #d9e6f2;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}.sat-top h2{margin:0;color:#0b4f86;font-size:21px}.sat-meta{font-size:11px;color:#567;margin-top:2px}.sat-close{border:0;background:#eaf1f8;color:#173b55;width:38px;height:38px;border-radius:50%;font-size:24px;cursor:pointer}
      .sat-content{flex:1 1 auto;min-height:0;overflow:auto;padding:16px}.sat-toast{display:none;position:sticky;top:0;z-index:20;margin-bottom:12px;padding:11px 13px;border-radius:12px;font-weight:800}.sat-toast.info{background:#eaf4ff;color:#07558d}.sat-toast.ok{background:#e8f8ed;color:#12652d}.sat-toast.err{background:#ffecec;color:#a01818}.sat-toast.warn{background:#fff4dc;color:#8a5300}
      .sat-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.sat-card{background:#fff;border:1px solid #dbe8f3;border-radius:17px;padding:15px;box-shadow:0 7px 20px rgba(20,70,110,.055)}.sat-stat strong{font-size:27px;color:#0d5e9d;display:block}.sat-stat span{font-size:11px;color:#63798b;font-weight:800}.sat-title{margin:4px 0 13px;color:#123b5c}.sat-actions{display:flex;flex-wrap:wrap;gap:8px}.sat-btn{border:0;border-radius:11px;padding:10px 13px;font-weight:800;cursor:pointer;background:#eaf2f8;color:#17405f}.sat-btn.primary{background:#0c73ba;color:#fff}.sat-btn.good{background:#148647;color:#fff}.sat-btn.danger{background:#c83b3b;color:#fff}.sat-btn.warn{background:#d98a08;color:#fff}.sat-btn:disabled{opacity:.45;cursor:not-allowed}
      .sat-banner{border-radius:15px;padding:12px 14px;margin-bottom:13px;font-weight:800}.sat-banner.holiday{background:#fff0e8;color:#a84300;border:1px solid #ffc69f}.sat-banner.work{background:#eaf8ef;color:#176b35;border:1px solid #bfe7cd}
      .sat-row{display:flex;gap:10px;flex-wrap:wrap;align-items:end;margin-bottom:12px}.sat-field{display:grid;gap:5px;min-width:150px;flex:1}.sat-field label,.sat-label{font-size:10px;font-weight:900;color:#5a7081;text-transform:uppercase}.sat-field input,.sat-field select{width:100%;border:1px solid #c9d9e6;border-radius:10px;padding:10px;background:#fff;font:inherit;color:#18384f}.sat-field.small{flex:0 0 145px}
      .sat-table-wrap{overflow:auto;background:#fff;border:1px solid #dbe8f3;border-radius:15px}.sat-table{width:100%;border-collapse:collapse;min-width:680px}.sat-table th,.sat-table td{padding:9px 10px;border-bottom:1px solid #e7eef5;text-align:left;font-size:12px}.sat-table th{background:#eff6fb;color:#31566f;position:sticky;top:0;z-index:1}
      .sat-chip{display:inline-block;padding:4px 8px;border-radius:999px;font-size:10px;font-weight:900}.sat-chip.present{background:#e6f7ec;color:#16723a}.sat-chip.absent{background:#ffe8e8;color:#a62929}.sat-chip.holiday{background:#fff1d8;color:#925c00}.sat-chip.pending{background:#e9eff5;color:#576b7a}
      .sat-reader{position:relative;background:#061a2b;border-radius:17px;overflow:hidden;min-height:330px;display:flex;align-items:center;justify-content:center;color:#fff}.sat-reader video{width:100%!important;max-height:60dvh;object-fit:cover}.sat-reader-note{padding:20px;text-align:center}.sat-result{margin-top:12px;padding:17px;border-radius:16px;text-align:center;background:#edf4fa}.sat-result.ok{background:#dff7e8;border:2px solid #54b97a}.sat-result.already{background:#fff3d8;border:2px solid #e5ac39}.sat-result.fail{background:#ffe7e7;border:2px solid #dc7676}.sat-result h2{margin:0 0 6px;font-size:25px}.sat-result strong{font-size:20px}
      .sat-manual-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.sat-student{background:#fff;border:1px solid #dbe8f3;border-radius:13px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px}.sat-student label{display:flex;align-items:center;gap:9px;font-weight:800}.sat-student input{width:20px;height:20px}.sat-muted{color:#6b7e8d;font-size:12px}
      .sat-face-stage{position:relative;width:100%;overflow:hidden;border-radius:16px;background:#061a2b}.sat-face-video{display:block;width:100%;max-height:58dvh;background:#061a2b;border-radius:16px;object-fit:cover;transform:scaleX(-1)}.sat-face-guide{pointer-events:none;position:absolute;inset:0;display:grid;place-items:center}.sat-face-guide::before{content:'';display:block;width:min(58%,300px);aspect-ratio:3/4;border:3px solid rgba(255,255,255,.92);border-radius:46% 46% 42% 42%/36% 36% 48% 48%;box-shadow:0 0 0 999px rgba(0,0,0,.14),0 0 24px rgba(31,220,172,.38)}.sat-face-guide::after{content:'Keep face inside the frame';position:absolute;left:50%;bottom:14px;transform:translateX(-50%);background:rgba(4,24,43,.74);color:#fff;padding:7px 11px;border-radius:999px;font-size:11px;font-weight:900;white-space:nowrap}.sat-face-status{padding:10px 12px;border-radius:12px;background:#eef5fb;margin-top:10px;font-weight:800;color:#28516d}.sat-samples{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.sat-sample{padding:7px 10px;border-radius:999px;background:#e9f7ef;color:#18713b;font-size:11px;font-weight:900}.sat-face-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.sat-person{background:#fff;border:1px solid #dbe8f3;border-radius:14px;padding:12px}.sat-person h4{margin:0 0 4px}.sat-registered{color:#13733d;font-weight:900}.sat-not-registered{color:#8a5b00;font-weight:900}
      .sat-qr-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.sat-qr-modal{position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;padding:16px}.sat-qr-box{background:#fff;border-radius:20px;padding:22px;text-align:center;max-width:360px;width:100%}.sat-qr-code{display:flex;justify-content:center;padding:12px}.sat-qr-value{font-size:10px;word-break:break-all;color:#697b89}
      .sat-permission{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px;border:1px solid #e0e9f1;border-radius:12px;margin-bottom:8px;background:#fff}
      .sat-mobile-more{display:none}
      .sat-mobile-nav-btn span{display:block;font-size:17px;line-height:1}.sat-mobile-nav-btn small{display:block;font-size:9px;margin-top:4px;font-weight:900}
      #satFinalOverlay button,#satFinalOverlay input,#satFinalOverlay select{font-family:inherit}
      #satFinalOverlay .sat-shell,#satFinalOverlay .sat-main,#satFinalOverlay .sat-side{max-width:none!important}
      #satFinalOverlay .sat-nav{position:static!important;bottom:auto!important;left:auto!important;right:auto!important;z-index:auto!important}
      #satFinalOverlay .sat-content{padding-bottom:18px}
      /* Tablet: top navigation, no overlap */
      @media(max-width:980px){
        .sat-overlay{padding:0}
        .sat-shell{width:100vw;height:100dvh;border-radius:0;border:0;display:grid;grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr)}
        .sat-side{min-height:auto;max-height:none;padding:8px 10px;overflow-x:auto;overflow-y:hidden;background:linear-gradient(90deg,#07345f 0%,#0a5f9d 62%,#087a75 100%);border-bottom:1px solid rgba(255,255,255,.16)}
        .sat-brand{display:none}
        .sat-nav{display:flex;gap:7px;min-width:max-content;align-items:center;padding:0;margin:0}
        .sat-nav button{width:auto;flex:0 0 auto;padding:10px 12px;font-size:11px;border-radius:10px;white-space:nowrap}
        .sat-main{height:auto;min-height:0;overflow:hidden}
        .sat-top{padding:10px 12px}
        .sat-content{padding:12px;overflow:auto}
        .sat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
        .sat-manual-list,.sat-qr-grid,.sat-face-list{grid-template-columns:1fr}
        .sat-row{align-items:stretch}
        .sat-field,.sat-field.small{min-width:100%;flex:1 1 100%}
        .sat-reader{min-height:46dvh}
        .sat-card{border-radius:15px}
      }

      /* Mobile — bottom navigation for Admin / Teacher / Staff */
      @media(max-width:700px){
        .sat-overlay{padding:0}
        .sat-shell{width:100vw;height:100dvh;border-radius:0;border:0;display:grid;grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) auto}
        .sat-main{grid-column:1;grid-row:1;height:auto;min-height:0;overflow:hidden}
        .sat-side{grid-column:1;grid-row:2;position:relative;overflow:visible;padding:6px 6px max(6px,env(safe-area-inset-bottom));min-height:auto;background:#063861;border-top:1px solid rgba(255,255,255,.18);box-shadow:0 -8px 24px rgba(6,44,77,.18)}
        .sat-brand{display:none}
        .sat-nav{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr));gap:3px;min-width:0!important;width:100%;padding:0;margin:0;align-items:stretch}
        .sat-nav button,.sat-nav .sat-mobile-nav-btn{width:100%;min-width:0;min-height:52px;padding:7px 2px!important;text-align:center;border-radius:10px;white-space:normal;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:0;color:#eaf7ff}
        .sat-nav button.active{background:rgba(255,255,255,.18);color:#fff}
        .sat-mobile-more{position:absolute;left:8px;right:8px;bottom:calc(100% + 7px);z-index:60;background:#07345f;border:1px solid rgba(255,255,255,.18);box-shadow:0 -14px 35px rgba(0,0,0,.24);border-radius:16px;padding:8px;max-height:58dvh;overflow:auto;grid-template-columns:1fr 1fr;gap:6px}
        .sat-mobile-more.open{display:grid}
        .sat-mobile-more button{border:0;background:rgba(255,255,255,.08);color:#fff;text-align:left;padding:12px;border-radius:11px;font-weight:800}
        .sat-mobile-more button.active{background:rgba(255,255,255,.20)}
        .sat-top{padding:10px 12px}.sat-top h2{font-size:16px}.sat-meta{font-size:10px}
        .sat-content{padding:9px;overflow:auto}
        .sat-grid{grid-template-columns:1fr}.sat-stat strong{font-size:24px}.sat-card{padding:12px;border-radius:14px}
        .sat-actions{gap:7px}.sat-btn{width:100%;min-height:43px}.sat-reader{min-height:42dvh}.sat-face-video{max-height:45dvh}.sat-table{min-width:620px}.sat-result h2{font-size:20px}
        .sat-manual-list,.sat-qr-grid,.sat-face-list{grid-template-columns:1fr}.sat-row{align-items:stretch}.sat-field,.sat-field.small{min-width:100%;flex:1 1 100%}
      }
    `;
    document.head.appendChild(st);
  }

  function injectEntryButtons(){
    const staffHost=document.querySelector('#staffDashboardPopup .staff-dashboard-quick-actions');
    if(staffHost){
      const matches=[...staffHost.querySelectorAll('button')].filter(x=>/Smart Attendance/i.test((x.textContent||'').trim()));
      let b=matches.find(x=>x.id==='staffDashboardSmartAttendanceAction')||matches[0]||null;
      matches.forEach(x=>{if(x!==b)x.remove();});
      if(!b){b=document.createElement('button');staffHost.appendChild(b);}
      b.id='staffDashboardSmartAttendanceAction';
      b.type='button';
      b.className='staff-dashboard-action smart-attendance-action-card';
      b.onclick=()=>openSmartAttendanceFinal('staff');
      b.innerHTML='<span class="staff-dashboard-action-icon">📷</span><span class="staff-dashboard-action-copy"><strong>Smart Attendance</strong><small>Face • QR • Manual • Reports</small></span><span class="staff-dashboard-action-arrow">→</span>';
    }
    const adminTabs=document.querySelector('#websiteAdminPanel .website-admin-tabs');
    if(adminTabs&&!byId('websiteAdminSmartAttendanceFinalButton')){
      const b=document.createElement('button'); b.id='websiteAdminSmartAttendanceFinalButton'; b.type='button';
      b.textContent='📷 Smart Attendance'; b.onclick=()=>openSmartAttendanceFinal('admin');
      adminTabs.appendChild(b);
    }
  }

  function shell(){
    let ov=byId(SAT_ID); if(ov)return ov;
    ov=document.createElement('div'); ov.id=SAT_ID; ov.className='sat-overlay';
    ov.innerHTML=`<div class="sat-shell" role="dialog" aria-modal="true" aria-label="Smart Attendance">
      <aside class="sat-side"><div class="sat-brand"><strong>SMART ATTENDANCE</strong><small>St. Augustine Academic Foundation<br>Face + QR + Manual</small></div><nav id="satNav" class="sat-nav"></nav><div id="satMobileMore" class="sat-mobile-more"></div></aside>
      <main class="sat-main"><header class="sat-top"><div><h2 id="satPageTitle">Smart Attendance</h2><div id="satTopMeta" class="sat-meta"></div></div><button class="sat-close" type="button" onclick="closeSmartAttendanceFinal()">×</button></header><div class="sat-content"><div id="satToast" class="sat-toast"></div><div id="satPage"></div></div></main>
    </div>`;
    document.body.appendChild(ov); return ov;
  }

  function navItems(){
    const a=[['dashboard','🏠 Dashboard'],['faceScan','🙂 Face Scanner']];
    if(ctx?.can_face_register)a.push(['faceRegister','📸 Face Registration']);
    a.push(['qrScan','▣ QR Scanner'],['manual','✅ Manual Present'],['reports','📊 Reports']);
    if(ctx?.is_admin)a.push(['qr','▣ QR Manager'],['people','👩‍🏫 Teacher / Staff'],['access','🔐 Full Access'],['faceAccess','🙂 Face Permission']);
    if(ctx?.is_admin||ctx?.is_full_access)a.push(['settings','⚙️ Settings']);
    return a;
  }
  let satMobileMoreOpen=false;
  function satMobileNavLabel(id){
    const m={dashboard:['🏠','Home'],faceScan:['🙂','Face'],faceRegister:['📸','Register'],qrScan:['▣','QR'],manual:['✅','Manual'],reports:['📊','Reports'],qr:['▣','QR Manager'],people:['👩‍🏫','People'],access:['🔐','Access'],faceAccess:['🙂','Face Access'],settings:['⚙️','Settings']};
    return m[id]||['•',id];
  }
  window.satToggleMobileMore=function(){
    satMobileMoreOpen=!satMobileMoreOpen;
    const p=byId('satMobileMore');
    if(p)p.classList.toggle('open',satMobileMoreOpen);
  };
  function renderNav(){
    const h=byId('satNav');if(!h)return;
    const items=navItems();
    const mobile=window.matchMedia&&window.matchMedia('(max-width:700px)').matches;
    const more=byId('satMobileMore');
    if(!mobile){
      satMobileMoreOpen=false;
      if(more){more.classList.remove('open');more.innerHTML='';}
      h.innerHTML=items.map(([id,l])=>`<button class="${id===currentView?'active':''}" type="button" onclick="satFinalShow('${id}')">${l}</button>`).join('');
      return;
    }
    const ids=items.map(x=>x[0]);
    const main=['dashboard','faceScan'];
    if(ids.includes('faceRegister'))main.push('faceRegister');
    main.push('qrScan');
    if(!ids.includes('faceRegister'))main.push('manual');
    const mainSet=new Set(main);
    const extra=items.filter(([id])=>!mainSet.has(id));
    h.innerHTML=main.map(id=>{
      const [ico,label]=satMobileNavLabel(id);
      return `<button class="sat-mobile-nav-btn ${id===currentView?'active':''}" type="button" onclick="satFinalShow('${id}')"><span>${ico}</span><small>${label}</small></button>`;
    }).join('')+`<button class="sat-mobile-nav-btn ${extra.some(([id])=>id===currentView)?'active':''}" type="button" onclick="satToggleMobileMore()"><span>☰</span><small>More</small></button>`;
    if(more){
      more.innerHTML=extra.map(([id,l])=>`<button class="${id===currentView?'active':''}" type="button" onclick="satFinalShow('${id}')">${l}</button>`).join('');
      more.classList.toggle('open',satMobileMoreOpen);
    }
  }
  function setMeta(){const e=byId('satTopMeta');if(!e||!ctx)return;e.textContent=`${ctx.today_bs||''} • ${ctx.day_name||''} • ${roleLabel()}${ctx.class_name?' • '+ctx.class_name:''}${ctx.test_mode?' • TEST MODE':''}`;}
  function attendanceLocked(){return !!ctx?.is_holiday&&!ctx?.test_mode;}
  function holidayBanner(){
    if(!ctx)return '';
    if(ctx.is_holiday&&ctx.test_mode)return `<div class="sat-banner work">🧪 ADMIN TEST MODE ON — ${esc(ctx.holiday_reason||'Holiday')} • ${esc(ctx.today_bs)} ${ctx.is_admin?'<button class="sat-btn warn" style="margin-left:10px;padding:6px 10px" onclick="satToggleTestMode(false)">TURN OFF TEST MODE</button>':''}</div>`;
    if(ctx.is_holiday)return `<div class="sat-banner holiday">🔒 HOLIDAY — ${esc(ctx.holiday_reason||'Attendance Locked')} • ${esc(ctx.today_bs)} ${ctx.is_admin?'<button class="sat-btn primary" style="margin-left:10px;padding:6px 10px" onclick="satToggleTestMode(true)">ENABLE ADMIN TEST MODE</button>':''}</div>`;
    return `<div class="sat-banner work">✓ Working Day • ${esc(ctx.today_bs)} • ${esc(ctx.day_name)} • Cut-off ${esc(ctx.cutoff_time)}</div>`;
  }

  async function refreshCtx(){
    ctx=await rpc('sat_whoami');
    try{ctx.can_face_register=!!(await rpc('sat_face_can_register'));}catch(_){ctx.can_face_register=!!ctx.is_admin;}
    setMeta();
  }

  window.openSmartAttendanceFinal=async function(mode='staff'){
    launchMode=mode==='admin'?'admin':'staff';
    injectStyle(); injectEntryButtons();
    const ov=shell(); ov.style.display='flex'; document.body.style.overflow='hidden';
    byId('satPage').innerHTML='<div class="sat-card">Loading secure attendance module…</div>';
    try{
      await refreshCtx();
      currentView='dashboard'; renderNav(); await satFinalShow('dashboard');
    }catch(e){
      byId('satPage').innerHTML=`<div class="sat-card"><h3>Setup Required</h3><p>${esc(e?.message||e)}</p><p class="sat-muted">Run SMART_ATTENDANCE_FACE_FINAL_PATCH.sql once after the earlier Smart Attendance QR SQL.</p></div>`;
    }
  };

  async function stopManualClock(){if(manualClockTimer){clearTimeout(manualClockTimer);manualClockTimer=null;}}
  async function stopFaceCamera(){
    faceScanRunning=false;
    if(faceScanTimer){clearTimeout(faceScanTimer);faceScanTimer=null;}
    if(faceStream){faceStream.getTracks().forEach(t=>t.stop());faceStream=null;}
    ['satFaceVideo','satRegVideo'].forEach(id=>{const v=byId(id);if(v)v.srcObject=null;});
  }
  async function stopQr(){
    if(qrScanner){
      try{if(qrRunning)await qrScanner.stop();}catch(_){}
      try{await qrScanner.clear();}catch(_){}
    }
    qrRunning=false; qrScanner=null; qrBusy=false;
    await satSleep(280);
  }
  async function stopActive(){
    await stopQr(); await stopFaceCamera(); await stopManualClock();
  }
  window.closeSmartAttendanceFinal=async function(){
    await stopActive();
    const ov=byId(SAT_ID); if(ov)ov.style.display='none';
    document.body.style.overflow='';
  };

  window.satFinalShow=async function(v){
    await stopActive();
    satMobileMoreOpen=false;
    const mobileMore=byId('satMobileMore');if(mobileMore)mobileMore.classList.remove('open');
    currentView=v; renderNav();
    const title={dashboard:'Dashboard',faceScan:'Face Scanner',faceRegister:'Face Registration',qrScan:'QR Scanner',manual:'Manual Student Present',reports:'Attendance Reports',qr:'QR Manager',people:'Teacher / Staff Control',access:'Full Access Management',faceAccess:'Face Registration Permission',settings:'Holiday & Settings'}[v]||'Smart Attendance';
    const t=byId('satPageTitle');if(t)t.textContent=title;
    try{
      if(v==='dashboard')await renderDashboard();
      else if(v==='faceScan')await renderFaceScan();
      else if(v==='faceRegister')await renderFaceRegister();
      else if(v==='qrScan')await renderQrScanner();
      else if(v==='manual')await renderManual();
      else if(v==='reports')await renderReports();
      else if(v==='qr')await renderQrManager();
      else if(v==='people')await renderPeople();
      else if(v==='access')await renderAccess();
      else if(v==='faceAccess')await renderFaceAccess();
      else if(v==='settings')await renderSettings();
    }catch(e){byId('satPage').innerHTML=`<div class="sat-card"><b>Error:</b> ${esc(e?.message||e)}</div>`;}
  };

  async function renderDashboard(){
    await refreshCtx();
    const s=await rpc('sat_dashboard_summary');
    byId('satPage').innerHTML=`${holidayBanner()}<div class="sat-grid">
      <div class="sat-card sat-stat"><strong>${s.students||0}</strong><span>TOTAL STUDENTS</span></div>
      <div class="sat-card sat-stat"><strong>${s.student_present||0}</strong><span>STUDENT PRESENT TODAY</span></div>
      <div class="sat-card sat-stat"><strong>${Math.max(0,(s.students||0)-(s.student_present||0))}</strong><span>NOT PRESENT / PENDING</span></div>
      <div class="sat-card sat-stat"><strong>${s.teachers||0}</strong><span>TEACHERS</span></div>
      <div class="sat-card sat-stat"><strong>${s.teacher_present||0}</strong><span>TEACHER PRESENT TODAY</span></div>
      <div class="sat-card sat-stat"><strong>${s.staff||0}</strong><span>NON-TEACHING STAFF</span></div>
    </div>
    <div class="sat-card" style="margin-top:12px"><h3 class="sat-title">Quick Actions</h3><div class="sat-actions">
      <button class="sat-btn primary" onclick="satFinalShow('faceScan')">🙂 FACE SCANNER</button>
      ${ctx.can_face_register?'<button class="sat-btn good" onclick="satFinalShow(\'faceRegister\')">📸 FACE REGISTRATION</button>':''}
      <button class="sat-btn primary" onclick="satFinalShow('qrScan')">▣ QR SCANNER</button>
      <button class="sat-btn good" onclick="satFinalShow('manual')">✅ MANUAL PRESENT</button>
      <button class="sat-btn" onclick="satFinalShow('reports')">📊 REPORTS</button>
    </div><p class="sat-muted" style="margin-top:10px">Face matching uses registered face descriptors. It does not provide anti-spoof/liveness protection against a high-quality photo.</p></div>`;
  }

  function satIsMobileDevice(){
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||'') || Math.min(window.innerWidth||9999,window.innerHeight||9999)<760;
  }
  function satSleep(ms){return new Promise(r=>setTimeout(r,ms));}
  async function waitForVideoReady(v,timeout=5000){
    const started=Date.now();
    while(Date.now()-started<timeout){
      if(v.readyState>=2 && v.videoWidth>0 && v.videoHeight>0)return true;
      await satSleep(80);
    }
    throw new Error('Camera started but video frame is not ready. Please try START CAMERA again.');
  }
  async function getCameraStream(facing){
    const mobile=satIsMobileDevice();
    // Face recognition does not need the phone camera's full native resolution.
    // 640x480 is substantially faster on Android/iPhone while keeping enough detail for descriptors.
    const base={width:{ideal:mobile?640:960},height:{ideal:mobile?480:720},frameRate:{ideal:mobile?24:30,min:12}};
    const attempts=[
      {video:{...base,facingMode:{ideal:facing}},audio:false},
      {video:{facingMode:facing,width:{ideal:640},height:{ideal:480}},audio:false},
      {video:true,audio:false}
    ];
    let lastErr=null;
    for(const c of attempts){
      try{return await navigator.mediaDevices.getUserMedia(c);}catch(e){lastErr=e;}
    }
    throw lastErr||new Error('Camera could not start.');
  }
  async function startVideo(id,facing='user'){
    const v=byId(id); if(!v)throw new Error('Camera view not ready.');
    if(!navigator.mediaDevices?.getUserMedia)throw new Error('Camera is not supported in this browser.');
    if(faceStream){faceStream.getTracks().forEach(t=>t.stop());faceStream=null;}
    faceStream=await getCameraStream(facing);
    v.setAttribute('playsinline',''); v.muted=true; v.autoplay=true;
    v.srcObject=faceStream;
    await v.play();
    await waitForVideoReady(v,6000);
    // Enough for autofocus/exposure, but still fast for a queue of students.
    await satSleep(satIsMobileDevice()?280:120);
    return v;
  }

  let satMobileMisses=0;
  let satDetectCanvas=null;
  function satSnapshotForDetection(video,maxSide){
    if(!video||video.readyState<2||!video.videoWidth||!video.videoHeight)return null;
    const vw=video.videoWidth,vh=video.videoHeight;
    const scale=Math.min(1,(maxSide||480)/Math.max(vw,vh));
    const w=Math.max(160,Math.round(vw*scale)),h=Math.max(160,Math.round(vh*scale));
    if(!satDetectCanvas)satDetectCanvas=document.createElement('canvas');
    if(satDetectCanvas.width!==w)satDetectCanvas.width=w;
    if(satDetectCanvas.height!==h)satDetectCanvas.height=h;
    const c=satDetectCanvas.getContext('2d',{alpha:false,willReadFrequently:false});
    c.drawImage(video,0,0,w,h);
    return satDetectCanvas;
  }
  async function detectDescriptor(video,opts={}){
    await ensureFaceModels();
    if(!video||video.readyState<2||!video.videoWidth||!video.videoHeight)return null;
    const mobile=satIsMobileDevice();
    // On mobile, detect from a downscaled snapshot instead of the live high-resolution video element.
    // This is much more stable on Android/iPhone browsers and avoids long-running video tensor work.
    const source=mobile?satSnapshotForDetection(video,opts.maxSide||480):video;
    if(!source)return null;
    const inputSize=opts.inputSize || (mobile ? 224 : 320);
    const scoreThreshold=opts.scoreThreshold ?? (mobile ? .16 : .40);
    let result=await faceapi.detectSingleFace(source,new faceapi.TinyFaceDetectorOptions({inputSize,scoreThreshold})).withFaceLandmarks().withFaceDescriptor();
    if(result){satMobileMisses=0;return result;}
    if(mobile && opts.allowFallback!==false){
      satMobileMisses++;
      if(satMobileMisses%3===0){
        const fallback=satSnapshotForDetection(video,640);
        result=await faceapi.detectSingleFace(fallback,new faceapi.TinyFaceDetectorOptions({inputSize:320,scoreThreshold:.12})).withFaceLandmarks().withFaceDescriptor();
        if(result){satMobileMisses=0;return result;}
      }
    }
    return null;
  }
  async function detectBestDescriptor(video,attempts=8){
    let best=null;
    const mobile=satIsMobileDevice();
    for(let i=0;i<attempts;i++){
      const d=await detectDescriptor(video,{inputSize:mobile?224:320,scoreThreshold:mobile?.14:.38,allowFallback:i===attempts-1,maxSide:mobile?520:720});
      if(d && (!best || Number(d.detection?.score||0)>Number(best.detection?.score||0)))best=d;
      if(d && Number(d.detection?.score||0)>=(mobile?.42:.58))break;
      if(i<attempts-1)await satSleep(mobile?110:70);
    }
    return best;
  }
  function dist(a,b){
    let s=0; for(let i=0;i<Math.min(a.length,b.length);i++){const d=Number(a[i])-Number(b[i]);s+=d*d;} return Math.sqrt(s);
  }
  function bestFaceMatch(descriptor){
    const ranked=[];
    for(const p of faceProfiles){
      const samples=Array.isArray(p.descriptors)?p.descriptors:[];
      let bestForPerson=Infinity;
      for(const sample of samples){
        const d=dist(descriptor,sample);
        if(d<bestForPerson)bestForPerson=d;
      }
      if(Number.isFinite(bestForPerson))ranked.push({profile:p,distance:bestForPerson});
    }
    ranked.sort((a,b)=>a.distance-b.distance);
    if(!ranked.length)return null;
    const best=ranked[0],second=ranked[1]||null;
    const margin=second?second.distance-best.distance:1;
    return {...best,margin};
  }

  async function renderFaceScan(){
    await refreshCtx();
    byId('satPage').innerHTML=`${holidayBanner()}<div class="sat-card" style="max-width:760px;margin:auto">
      <h3 class="sat-title">Real Face Attendance Scanner</h3>
      <div class="sat-row"><div class="sat-field"><label>Scope</label><select id="satFaceScope" onchange="satFaceReloadProfiles()"><option value="all">All Registered Students / Staff</option>${ctx.class_name?`<option value="${esc(ctx.class_name)}">${esc(ctx.class_name)} only</option>`:''}</select></div></div>
      <div class="sat-face-stage"><video id="satFaceVideo" class="sat-face-video" playsinline muted autoplay></video><div class="sat-face-guide"></div></div>
      <div class="sat-actions" style="margin-top:10px"><button class="sat-btn primary" onclick="satStartFaceScanner()" ${attendanceLocked()?'disabled':''}>START FACE SCANNER</button><button class="sat-btn" onclick="satSwitchFaceCamera()">🔄 FRONT / BACK</button><button class="sat-btn" onclick="satStopFaceScanner()">STOP</button></div>
      <div id="satFaceScanStatus" class="sat-face-status">Press START FACE SCANNER. Keep one face clearly visible.</div>
      <div id="satFaceScanResult" class="sat-result"><b>No attendance recorded yet.</b></div>
      <p class="sat-muted">Fast mode: the scanner checks the clearest nearby frames and records a confident match automatically.</p>
    </div>`;
    await satFaceReloadProfiles();
  }
  window.satFaceReloadProfiles=async function(){
    const scope=byId('satFaceScope')?.value||'all';
    faceProfiles=await rpc('sat_face_scan_profiles',{p_class:scope==='all'?null:scope});
    if(!Array.isArray(faceProfiles))faceProfiles=[];
    const st=byId('satFaceScanStatus'); if(st)st.textContent=`${faceProfiles.length} registered face profile(s) ready.`;
  };

  let candidateId='',candidateHits=0,lastMarkedId='',lastMarkedAt=0;
  window.satStartFaceScanner=async function(){
    if(attendanceLocked())return toast('Holiday: attendance is locked. Admin can enable Test Mode for today.','warn');
    try{
      await ensureFaceModels(); await satFaceReloadProfiles();
      if(!faceProfiles.length)throw new Error('No registered face profiles found.');
      await stopQr();
      await satSleep(250);
      const v=await startVideo('satFaceVideo',faceFacing);
      faceScanRunning=true; candidateId='';candidateHits=0;
      const status=byId('satFaceScanStatus'); if(status)status.textContent=satIsMobileDevice()?'Mobile scanner ready — keep your face inside the frame.':'Scanner running — keep your face inside the frame.';
      faceScanLoop(v);
    }catch(e){toast(e?.message||e,'err');}
  };
  window.satStopFaceScanner=()=>stopFaceCamera();
  window.satSwitchFaceCamera=async function(){
    faceFacing=faceFacing==='user'?'environment':'user';
    const wasRunning=faceScanRunning;
    try{
      await stopFaceCamera();
      const v=await startVideo('satFaceVideo',faceFacing);
      const st=byId('satFaceScanStatus');if(st)st.textContent=(faceFacing==='user'?'Front':'Back')+' camera ready.';
      if(wasRunning){faceScanRunning=true;candidateId='';candidateHits=0;faceScanLoop(v);}
    }catch(e){toast('Camera switch failed: '+(e?.message||e),'err');}
  };

  async function faceScanLoop(video){
    if(!faceScanRunning)return;
    const mobile=satIsMobileDevice();
    const status=byId('satFaceScanStatus');
    try{
      if(status)status.textContent='Scanning face…';
      const d=mobile?await detectBestDescriptor(video,3):await detectDescriptor(video);
      if(!faceScanRunning)return;
      if(!d){
        candidateId='';candidateHits=0;
        if(status)status.textContent=mobile?'Looking for face — keep your full face steady inside the oval; no need to move closer.':'No clear face detected — center your face in the frame.';
      }else{
        if(status)status.textContent='Face found — matching…';
        const m=bestFaceMatch(Array.from(d.descriptor));
        const maxDistance=mobile?0.58:0.50;
        const minMargin=mobile?0.010:0.025;
        if(!m||m.distance>maxDistance||m.margin<minMargin){
          candidateId='';candidateHits=0;
          if(status)status.textContent='Face found — not confidently matched yet.';
        }else{
          const id=m.profile.person_type+':'+m.profile.person_id;
          const instantStrong=mobile?(m.distance<=0.47 && m.margin>=0.025):(m.distance<=0.44 && m.margin>=0.045);
          if(candidateId===id)candidateHits++;else{candidateId=id;candidateHits=1;}
          const need=instantStrong?1:2;
          if(status)status.textContent=`${instantStrong?'Recognized':'Matching'} ${m.profile.person_name}… ${candidateHits}/${need}`;
          if(candidateHits>=need){
            const now=Date.now();
            if(lastMarkedId!==id||now-lastMarkedAt>3500){
              await recordFaceMatch(m.profile,m.distance);
              lastMarkedId=id;lastMarkedAt=now;
            }
            candidateHits=0;
          }
        }
      }
    }catch(e){
      if(status)status.textContent='Scanner error: '+(e?.message||e);
    }
    if(faceScanRunning)faceScanTimer=setTimeout(()=>faceScanLoop(video),mobile?140:180);
  }

  async function recordFaceMatch(p,distance){
    try{
      const r=await rpc('sat_face_mark',{p_person_type:p.person_type,p_person_id:p.person_id});
      const e=byId('satFaceScanResult'); if(!e)return;
      e.className='sat-result '+(r.already_present?'already':'ok');
      e.innerHTML=`<h2>${r.already_present?'ALREADY PRESENT':'✓ PRESENT RECORDED'}</h2><strong>${esc(r.name)}</strong><div>${esc(cap(r.person_type))}${r.class_name?' • '+esc(r.class_name):''}</div><div>${esc(r.time)} • Face Match ${Number(distance).toFixed(3)}</div>`;
      if(!r.already_present)successSound(); else alreadySound();
    }catch(e){const out=byId('satFaceScanResult');if(out){out.className='sat-result fail';out.innerHTML=`<h2>NOT RECORDED</h2><div>${esc(e?.message||e)}</div>`;}alreadySound();}
  }

  async function renderFaceRegister(){
    await refreshCtx();
    if(!ctx.can_face_register)throw new Error('Face registration permission is required.');
    const cls=ctx.is_full_access?(ctx.class_name||CLASSES[0]):ctx.class_name;
    byId('satPage').innerHTML=`<div class="sat-card">
      <h3 class="sat-title">Fast Face Registration</h3>
      <div class="sat-row">
        <div class="sat-field"><label>Category</label><select id="satRegType" onchange="satRegTypeChange()"><option value="student">Student</option>${ctx.is_full_access?'<option value="teacher">Teacher</option><option value="staff">Staff (Non-Teaching)</option>':''}</select></div>
        <div id="satRegClassWrap" class="sat-field"><label>Class</label><select id="satRegClass" ${ctx.is_full_access?'':'disabled'} onchange="satLoadRegPeople()">${ctx.is_full_access?classOptions(cls):`<option>${esc(cls||'No class assigned')}</option>`}</select></div>
        <div class="sat-field"><label>Person</label><select id="satRegPerson"></select></div>
      </div>
      <div class="sat-face-stage"><video id="satRegVideo" class="sat-face-video" playsinline muted autoplay></video><div class="sat-face-guide"></div></div>
      <div class="sat-actions" style="margin-top:10px"><button class="sat-btn primary" onclick="satStartRegCamera()">START CAMERA</button><button class="sat-btn" onclick="satSwitchRegCamera()">🔄 FRONT / BACK</button><button id="satCaptureSaveFaceBtn" class="sat-btn good" onclick="satCaptureAndSaveFace()">📸 CAPTURE & SAVE FACE</button></div>
      <div id="satRegSamples" class="sat-samples"></div>
      <div id="satRegStatus" class="sat-face-status">One clear front-facing sample is enough. Keep the full face inside the frame and press CAPTURE & SAVE FACE.</div>
      <div id="satRegPeopleList" class="sat-face-list" style="margin-top:12px"></div>
    </div>`;
    registrationSamples=[]; await satLoadRegPeople();
  }
  window.satRegTypeChange=async function(){const t=byId('satRegType')?.value||'student';const w=byId('satRegClassWrap');if(w)w.style.display=t==='student'?'grid':'none';registrationSamples=[];renderSampleChips();await satLoadRegPeople();};
  window.satLoadRegPeople=async function(){
    const t=byId('satRegType')?.value||'student',cls=t==='student'?(byId('satRegClass')?.value||ctx.class_name):null;
    const rows=await rpc('sat_face_people',{p_person_type:t,p_class:cls});
    const sel=byId('satRegPerson');
    if(sel)sel.innerHTML=(rows||[]).map(x=>`<option value="${esc(x.person_id)}">${esc(x.person_name)}${x.registered?' ✓ Registered':''}</option>`).join('')||'<option value="">No person found</option>';
    const h=byId('satRegPeopleList');
    if(h)h.innerHTML=(rows||[]).map(x=>`<div class="sat-person"><h4>${esc(x.person_name)}</h4><div class="sat-muted">${esc(x.person_id)}${x.class_name?' • '+esc(x.class_name):''}</div><div class="${x.registered?'sat-registered':'sat-not-registered'}">${x.registered?'✓ Face Registered':'Not Registered'}</div>${x.registered?`<div class="sat-actions" style="margin-top:8px"><button class="sat-btn danger" onclick="satDeleteFaceProfile('${esc(t)}','${esc(x.person_id)}')">DELETE FACE</button></div>`:''}</div>`).join('');
  };
  window.satStartRegCamera=async function(){
    try{await ensureFaceModels();await stopQr();await satSleep(250);await startVideo('satRegVideo',regFacing);const st=byId('satRegStatus');if(st)st.textContent='Camera ready. Keep one clear front-facing face inside the frame, then press CAPTURE & SAVE FACE.';toast('Camera ready.','ok');}catch(e){toast(e?.message||e,'err');}
  };
  window.satSwitchRegCamera=async function(){
    regFacing=regFacing==='user'?'environment':'user';
    try{await startVideo('satRegVideo',regFacing);const st=byId('satRegStatus');if(st)st.textContent=(regFacing==='user'?'Front':'Back')+' camera ready.';}catch(e){toast('Camera switch failed: '+(e?.message||e),'err');}
  };
  let regCaptureBusy=false;
  function renderSampleChips(){const h=byId('satRegSamples');if(h)h.innerHTML=registrationSamples.length?'<span class="sat-sample">✓ 1 clear sample ready</span>':'';}
  window.satCaptureAndSaveFace=async function(){
    if(regCaptureBusy)return;
    regCaptureBusy=true;
    const st=byId('satRegStatus'),btn=byId('satCaptureSaveFaceBtn');if(btn)btn.disabled=true;
    try{
      const v=byId('satRegVideo');if(!v||!v.srcObject)throw new Error('Start camera first.');
      const t=byId('satRegType')?.value||'student',id=byId('satRegPerson')?.value||'',cls=t==='student'?(byId('satRegClass')?.value||ctx.class_name):null;
      if(!id)throw new Error('Select a person first.');
      await waitForVideoReady(v);
      if(st)st.textContent='Finding the clearest face frame… keep still.';
      const mobile=satIsMobileDevice();
      const d=await detectBestDescriptor(v,mobile?16:5);
      if(!d)throw new Error('Face was not detected. Keep the full face inside the oval and try once more.');
      const minScore=mobile?.20:.52;
      if(Number(d.detection?.score||0)<minScore)throw new Error('Face found, but the frame is too unclear. Improve light and try again.');
      const one=Array.from(d.descriptor);registrationSamples=[one];renderSampleChips();
      if(st)st.textContent='Face captured. Saving securely…';
      const payload=[one.slice(),one.slice(),one.slice()];
      await rpc('sat_face_save_profile',{p_person_type:t,p_person_id:id,p_class:cls,p_descriptors:payload});
      successSound();if(st)st.textContent='✓ Face registered successfully from 1 clear sample.';toast('Face registered successfully.','ok');
      registrationSamples=[];renderSampleChips();await satLoadRegPeople();
    }catch(e){if(st)st.textContent='Registration failed — '+(e?.message||e);toast(e?.message||e,'err');}
    finally{regCaptureBusy=false;if(btn)btn.disabled=false;}
  };
  window.satDeleteFaceProfile=async function(t,id){if(!confirm('Delete this registered face profile?'))return;try{await rpc('sat_face_delete_profile',{p_person_type:t,p_person_id:id});toast('Face profile deleted.','ok');await satLoadRegPeople();}catch(e){toast(e?.message||e,'err');}};

  async function renderQrScanner(){
    await refreshCtx();
    byId('satPage').innerHTML=`${holidayBanner()}<div class="sat-card" style="max-width:760px;margin:auto"><h3 class="sat-title">QR Attendance Scanner</h3><div id="satQrReader" class="sat-reader"><div class="sat-reader-note">Press START CAMERA.<br><span class="sat-muted">Back camera is default on mobile.</span></div></div><div class="sat-actions" style="margin-top:10px"><button class="sat-btn primary" onclick="satStartQr()" ${attendanceLocked()?'disabled':''}>START CAMERA</button><button class="sat-btn" onclick="satSwitchQrCamera()">🔄 FRONT / BACK</button><button class="sat-btn" onclick="satStopQr()">STOP</button></div><div id="satQrResult" class="sat-result"><b>Show a St. Augustine attendance QR to the camera.</b></div></div>`;
  }
  window.satStartQr=async function(){
    if(attendanceLocked())return toast('Holiday: attendance scanning is locked. Admin can enable Test Mode for today.','warn');
    if(qrRunning)return;
    try{
      await ensureQrLibraries();
      await stopFaceCamera();
      await satSleep(350);
      qrScanner=new Html5Qrcode('satQrReader');
      // html5-qrcode accepts a facingMode string (or {exact:...}); {ideal:...} breaks on some mobile browsers.
      await qrScanner.start({facingMode:qrFacing},{fps:satIsMobileDevice()?20:14,qrbox:{width:Math.min(280,Math.max(210,Math.floor((window.innerWidth||360)*0.68))),height:Math.min(280,Math.max(210,Math.floor((window.innerWidth||360)*0.68)))},aspectRatio:1.0},async text=>{
        if(qrBusy)return;qrBusy=true;
        try{const r=await rpc('sat_scan_qr',{p_qr_value:text,p_method:'qr'});showQrScanResult(r);}catch(e){showQrScanError(e?.message||e);}
        finally{setTimeout(()=>qrBusy=false,1500);}
      },()=>{});
      qrRunning=true;
    }catch(e){toast('Camera/QR could not start: '+(e?.message||e),'err');}
  };
  window.satStopQr=()=>stopQr();
  window.satSwitchQrCamera=async function(){
    qrFacing=qrFacing==='environment'?'user':'environment';
    try{
      await stopQr();
      await satSleep(250);
      await satStartQr();
      toast((qrFacing==='environment'?'Back':'Front')+' camera selected.','ok');
    }catch(e){toast('QR camera switch failed: '+(e?.message||e),'err');}
  };
  function showQrScanResult(r){const e=byId('satQrResult');if(!e)return;e.className='sat-result '+(r.already_present?'already':'ok');e.innerHTML=`<h2>${r.already_present?'ALREADY PRESENT':'✓ PRESENT RECORDED'}</h2><strong>${esc(r.name)}</strong><div>${esc(cap(r.person_type))}${r.class_name?' • '+esc(r.class_name):''}</div><div>${esc(r.time)}</div>`;r.already_present?alreadySound():successSound();}
  function showQrScanError(m){const e=byId('satQrResult');if(!e)return;e.className='sat-result fail';e.innerHTML=`<h2>NOT RECORDED</h2><div>${esc(m)}</div>`;alreadySound();}

  async function renderManual(){
    await refreshCtx();const cls=ctx.is_full_access?(ctx.class_name||CLASSES[0]):ctx.class_name;
    byId('satPage').innerHTML=`${holidayBanner()}<div class="sat-card"><div class="sat-row"><div class="sat-field"><label>Class</label><select id="satManualClass" ${ctx.is_full_access?'':'disabled'} onchange="satLoadManual()">${ctx.is_full_access?classOptions(cls):`<option>${esc(cls||'No class assigned')}</option>`}</select></div><div class="sat-field"><label>Nepali Date</label><input value="${esc(ctx.today_bs)}" disabled></div><div class="sat-field"><label>Current Time</label><input id="satManualTime" value="${esc(timeNow())}" disabled></div></div><div id="satManualList">Loading…</div><div class="sat-actions" style="margin-top:12px"><button id="satManualSave" class="sat-btn good" onclick="satSaveManual()" ${attendanceLocked()?'disabled':''}>✓ MARK TICKED STUDENTS PRESENT</button></div></div>`;
    if(cls)await satLoadManual();
    const tick=()=>{const e=byId('satManualTime');if(e)e.value=timeNow();if(currentView==='manual')manualClockTimer=setTimeout(tick,1000);};tick();
  }
  window.satLoadManual=async function(){
    const cls=byId('satManualClass')?.value||ctx.class_name;const rows=await rpc('sat_manual_roster',{p_class:cls});const h=byId('satManualList');if(!h)return;
    h.innerHTML=`<div class="sat-manual-list">${(rows||[]).map(r=>`<div class="sat-student"><label><input class="sat-manual-check" type="checkbox" value="${esc(r.student_id)}" ${r.is_present?'checked disabled':''} ${attendanceLocked()?'disabled':''}><span>${esc(r.student_name)}<br><small class="sat-muted">${esc(r.student_id)}</small></span></label><span class="sat-chip ${r.is_present?'present':'pending'}">${r.is_present?'Present '+esc(r.present_time):'Not Present'}</span></div>`).join('')}</div>`;
  };
  window.satSaveManual=async function(){
    if(attendanceLocked())return toast('Holiday: manual Present is locked. Admin can enable Test Mode for today.','warn');
    const ids=[...document.querySelectorAll('.sat-manual-check:checked:not(:disabled)')].map(x=>x.value);if(!ids.length)return toast('Tick at least one student.','warn');
    let ok=0;for(const id of ids){try{const r=await rpc('sat_mark_student_manual',{p_student_id:id});if(!r.already_present)ok++;}catch(e){toast(e?.message||e,'err');}}
    successSound();toast(`${ok} student(s) marked Present.`,'ok');await satLoadManual();
  };

  async function renderReports(){
    await refreshCtx();const cls=ctx.is_full_access?(ctx.class_name||CLASSES[0]):ctx.class_name;
    byId('satPage').innerHTML=`<div class="sat-card"><div class="sat-row"><div class="sat-field"><label>Report Type</label><select id="satReportType" onchange="satReportTypeChange()"><option value="student">Student</option><option value="teacher">Teacher</option><option value="staff">Staff</option></select></div><div id="satReportClassWrap" class="sat-field"><label>Class</label><select id="satReportClass" ${ctx.is_full_access?'':'disabled'} onchange="satReportTypeChange()">${ctx.is_full_access?classOptions(cls):`<option>${esc(cls||'')}</option>`}</select></div><div class="sat-field"><label>From Nepali Date</label><input id="satReportFrom" value="${esc(ctx.today_bs)}"></div><div class="sat-field"><label>To Nepali Date</label><input id="satReportTo" value="${esc(ctx.today_bs)}"></div><div class="sat-field"><label>Person</label><select id="satReportPerson"><option value="">All</option></select></div></div><div class="sat-actions"><button class="sat-btn primary" onclick="satRunReport()">VIEW REPORT</button><button class="sat-btn good" onclick="satExportReport()">📊 EXPORT EXCEL</button></div><div id="satReportTable" style="margin-top:12px" class="sat-table-wrap"><div style="padding:18px" class="sat-muted">Choose filter and View Report.</div></div></div>`;
    await satReportTypeChange();
  }
  window.satReportTypeChange=async function(){const type=byId('satReportType')?.value||'student';const cw=byId('satReportClassWrap');if(cw)cw.style.display=type==='student'?'grid':'none';const sel=byId('satReportPerson');if(!sel)return;sel.innerHTML='<option value="">All</option>';try{if(type==='student'){const cls=byId('satReportClass')?.value||ctx.class_name;const rows=await rpc('sat_demo_people',{p_person_type:'student',p_class:cls});sel.innerHTML='<option value="">All Students</option>'+rows.map(x=>`<option value="${esc(x.person_id)}">${esc(x.person_name)}</option>`).join('');}else{const rows=await rpc('sat_demo_people',{p_person_type:type,p_class:null});sel.innerHTML='<option value="">All</option>'+rows.map(x=>`<option value="${esc(x.person_id)}">${esc(x.person_name)}</option>`).join('');}}catch(e){toast(e?.message||e,'err');}};
  window.satRunReport=async function(){const type=byId('satReportType').value,from=byId('satReportFrom').value.trim(),to=byId('satReportTo').value.trim(),pid=byId('satReportPerson').value||null;if(!from||!to)return toast('Enter Nepali From and To dates.','warn');try{if(type==='student')reportRows=await rpc('sat_student_report',{p_from_bs:from,p_to_bs:to,p_class:byId('satReportClass').value,p_student_id:pid});else reportRows=await rpc('sat_people_report',{p_person_type:type,p_from_bs:from,p_to_bs:to,p_person_id:pid});renderReportTable(type,reportRows);}catch(e){toast(e?.message||e,'err');}};
  function renderReportTable(type,rows){const h=byId('satReportTable');if(!h)return;if(!rows?.length){h.innerHTML='<div style="padding:18px">No records found.</div>';return;}h.innerHTML=`<table class="sat-table"><thead><tr><th>Nepali Date</th><th>Day</th><th>Name</th><th>${type==='student'?'Class':'Category'}</th><th>Status</th><th>Time</th><th>Source</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.date_bs)}</td><td>${esc(r.day_name)}</td><td>${esc(type==='student'?r.student_name:r.person_name)}</td><td>${esc(type==='student'?r.class_name:r.category)}</td><td><span class="sat-chip ${String(r.status||'').toLowerCase()}">${esc(r.status)}</span></td><td>${esc(r.time_in)}</td><td>${esc(r.method==='face'?'Face Match':cap(r.method||''))}</td></tr>`).join('')}</tbody></table>`;}
  window.satExportReport=function(){if(!reportRows.length)return toast('View a report first.','warn');const type=byId('satReportType')?.value||'attendance';const cols=type==='student'?['date_bs','day_name','student_id','student_name','class_name','status','time_in','method']:['date_bs','day_name','person_id','person_name','category','status','time_in','method'];const head=cols.map(x=>`<th>${esc(cap(x))}</th>`).join('');const body=reportRows.map(r=>`<tr>${cols.map(c=>`<td>${esc(r[c]??'')}</td>`).join('')}</tr>`).join('');const html=`<html><head><meta charset="utf-8"></head><body><table border="1"><tr>${head}</tr>${body}</table></body></html>`;const blob=new Blob([html],{type:'application/vnd.ms-excel'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`StAugustine_${type}_Attendance.xls`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500);};

  async function renderQrManager(){if(!ctx.is_admin)throw new Error('Admin access is required.');await ensureQrLibraries();byId('satPage').innerHTML=`<div class="sat-card"><h3 class="sat-title">Admin QR Manager</h3><div class="sat-row"><div class="sat-field"><label>Category</label><select id="satQrType" onchange="satLoadQrList()"><option value="student">Student</option><option value="teacher">Teacher</option><option value="staff">Staff</option></select></div><div id="satQrClassWrap" class="sat-field"><label>Class</label><select id="satQrClass" onchange="satLoadQrList()">${classOptions(CLASSES[0])}</select></div></div><div id="satQrList">Loading…</div></div>`;await satLoadQrList();}
  window.satLoadQrList=async function(){const t=byId('satQrType')?.value||'student';const w=byId('satQrClassWrap');if(w)w.style.display=t==='student'?'grid':'none';let rows=[];if(t==='student')rows=await rpc('sat_admin_students',{p_class:byId('satQrClass').value});else if(t==='teacher')rows=await rpc('sat_admin_teachers');else rows=await rpc('sat_admin_staff');const h=byId('satQrList');if(!h)return;h.innerHTML=`<div class="sat-qr-grid">${rows.map(r=>{const id=r.student_id||r.person_id,name=r.student_name||r.person_name,qr=r.qr_value||'';return `<div class="sat-person"><h4>${esc(name)}</h4><div class="sat-muted">${esc(id)}${r.class_name?' • '+esc(r.class_name):''}</div><div class="sat-actions"><button class="sat-btn primary" onclick="satGenerateQr('${esc(t)}','${esc(id)}',false)">${qr?'VIEW / REFRESH':'GENERATE QR'}</button>${qr?`<button class="sat-btn warn" onclick="satGenerateQr('${esc(t)}','${esc(id)}',true)">REGENERATE</button><button class="sat-btn" onclick='satShowQr(${JSON.stringify(qr)},${JSON.stringify(name)})'>VIEW QR</button>`:''}</div></div>`;}).join('')}</div>`;};
  window.satGenerateQr=async function(t,id,regen){if(regen&&!confirm('Regenerate QR? Old QR will stop working.'))return;try{const q=await rpc('sat_admin_generate_qr',{p_person_type:t,p_person_id:id,p_regenerate:!!regen});showQr(q,'Attendance QR');await satLoadQrList();toast('QR ready.','ok');}catch(e){toast(e?.message||e,'err');}};
  window.satShowQr=(q,n)=>showQr(q,n);
  function showQr(q,name){currentQrName=name||'Attendance QR';const old=byId('satQrModal');if(old)old.remove();const d=document.createElement('div');d.id='satQrModal';d.className='sat-qr-modal';d.innerHTML=`<div class="sat-qr-box"><h3>${esc(name)}</h3><div id="satQrCode" class="sat-qr-code"></div><div class="sat-qr-value">${esc(q)}</div><div class="sat-actions" style="justify-content:center;margin-top:12px"><button class="sat-btn primary" onclick="satPrintQr()">PRINT</button><button class="sat-btn good" onclick="satDownloadQr()">DOWNLOAD PNG</button><button class="sat-btn" onclick="document.getElementById('satQrModal').remove()">CLOSE</button></div></div>`;document.body.appendChild(d);new QRCode(byId('satQrCode'),{text:q,width:240,height:240,correctLevel:QRCode.CorrectLevel.H});}
  window.satPrintQr=function(){const c=document.querySelector('#satQrCode canvas'),i=document.querySelector('#satQrCode img');const src=c?c.toDataURL('image/png'):i?.src;if(!src)return;const w=window.open('','_blank','width=500,height=650');w.document.write(`<html><head><title>St. Augustine QR</title><style>body{font-family:Arial;text-align:center;padding:35px}img{width:300px;max-width:90%}</style></head><body><h2>${esc(currentQrName)}</h2><img src="${src}"><p>ST. AUGUSTINE ACADEMIC FOUNDATION</p><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close();};
  window.satDownloadQr=function(){const c=document.querySelector('#satQrCode canvas'),i=document.querySelector('#satQrCode img');const src=c?c.toDataURL('image/png'):i?.src;if(!src)return;const a=document.createElement('a');a.href=src;a.download='StAugustine_Attendance_QR.png';a.click();};

  async function renderPeople(){
    if(!ctx.is_admin)throw new Error('Admin access is required.');
    byId('satPage').innerHTML=`<div class="sat-grid">
      <div class="sat-card"><h3 class="sat-title">Teachers</h3>
        <div class="sat-row"><div class="sat-field"><label>Teacher ID</label><input id="satNewTeacherId" placeholder="example: rajan"></div><div class="sat-field"><label>Teacher Name</label><input id="satNewTeacherName" placeholder="Full name"></div><div class="sat-field"><label>Class / Group</label><select id="satNewTeacherClass"><option value="">General / No Class</option>${classOptions('')}</select></div></div>
        <button class="sat-btn primary" onclick="satAddTeacher()">+ ADD / UPDATE TEACHER</button>
        <div id="satTeacherList" style="margin-top:12px">Loading…</div>
      </div>
      <div class="sat-card"><h3 class="sat-title">Staff (Non-Teaching)</h3><div class="sat-row"><div class="sat-field"><label>Staff ID</label><input id="satNewStaffId"></div><div class="sat-field"><label>Name</label><input id="satNewStaffName"></div></div><button class="sat-btn primary" onclick="satAddStaff()">+ ADD STAFF</button><div id="satStaffList" style="margin-top:12px">Loading…</div></div>
    </div>`;await loadPeople();
  }
  async function loadPeople(){
    const teachers=await rpc('sat_admin_teachers'),staff=await rpc('sat_admin_staff');const th=byId('satTeacherList'),sh=byId('satStaffList');
    if(th)th.innerHTML=teachers.length?teachers.map(x=>`<div class="sat-person"><b>${esc(x.person_name)}</b><div class="sat-muted">${esc(x.person_id)}${x.class_name?' • '+esc(x.class_name):''}</div><div class="sat-actions" style="margin-top:8px"><button class="sat-btn danger" onclick="satDeleteTeacher('${esc(x.person_id)}','${esc(x.person_name)}')">DELETE</button></div></div>`).join(''):'<div class="sat-muted">No teachers added.</div>';
    if(sh)sh.innerHTML=staff.map(x=>`<div class="sat-person"><b>${esc(x.person_name)}</b><div class="sat-muted">${esc(x.person_id)}</div><div class="sat-actions"><button class="sat-btn danger" onclick="satDeleteStaff('${esc(x.person_id)}','${esc(x.person_name)}')">DELETE</button></div></div>`).join('');
  }
  window.satAddTeacher=async function(){const id=byId('satNewTeacherId').value,name=byId('satNewTeacherName').value,cls=byId('satNewTeacherClass').value||null;if(!id||!name)return toast('Enter Teacher ID and Name.','warn');try{await rpc('sat_admin_add_teacher',{p_staff_id:id,p_staff_name:name,p_class_name:cls});toast('Teacher saved.','ok');byId('satNewTeacherId').value='';byId('satNewTeacherName').value='';byId('satNewTeacherClass').value='';await loadPeople();}catch(e){toast(e?.message||e,'err');}};
  window.satDeleteTeacher=async function(id,name){if(!confirm(`Delete/disable ${name} from Attendance Teachers?`))return;try{await rpc('sat_admin_delete_teacher',{p_staff_id:id});toast('Teacher removed from Attendance.','ok');await loadPeople();}catch(e){toast(e?.message||e,'err');}};
  window.satAddStaff=async function(){const id=byId('satNewStaffId').value,name=byId('satNewStaffName').value;if(!id||!name)return toast('Enter Staff ID and Name.','warn');try{await rpc('sat_admin_add_staff',{p_staff_id:id,p_staff_name:name});toast('Staff saved.','ok');await loadPeople();}catch(e){toast(e?.message||e,'err');}};
  window.satDeleteStaff=async function(id,name){if(!confirm(`Delete/disable ${name} from Attendance Staff?`))return;try{await rpc('sat_admin_delete_staff',{p_staff_id:id});toast('Staff removed from Attendance.','ok');await loadPeople();}catch(e){toast(e?.message||e,'err');}};

  async function renderAccess(){if(!ctx.is_admin)throw new Error('Admin access is required.');const rows=await rpc('sat_admin_teachers');byId('satPage').innerHTML=`<div class="sat-card"><h3 class="sat-title">Full Attendance Access</h3><div class="sat-table-wrap"><table class="sat-table"><thead><tr><th>Teacher</th><th>ID</th><th>Class</th><th>Full Access</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.person_name)}</td><td>${esc(r.person_id)}</td><td>${esc(r.class_name)}</td><td><label><input type="checkbox" ${r.full_access?'checked':''} onchange="satSetFull('${esc(r.person_id)}',this.checked)"> Enable</label></td></tr>`).join('')}</tbody></table></div></div>`;}
  window.satSetFull=async function(id,en){try{await rpc('sat_admin_set_full_access',{p_staff_id:id,p_enabled:!!en});toast('Access updated.','ok');}catch(e){toast(e?.message||e,'err');}};

  async function renderFaceAccess(){if(!ctx.is_admin)throw new Error('Admin access is required.');const rows=await rpc('sat_face_access_list');byId('satPage').innerHTML=`<div class="sat-card"><h3 class="sat-title">Face Registration Permission</h3><p class="sat-muted">Admin can allow a Class Teacher to register/re-register faces for their own assigned class. Full Access/Admin already have permission.</p><div>${rows.map(r=>`<div class="sat-permission"><div><b>${esc(r.staff_name||r.staff_id)}</b><div class="sat-muted">${esc(r.staff_id)}${r.class_name?' • '+esc(r.class_name):''}</div></div><label><input type="checkbox" ${r.enabled?'checked':''} onchange="satSetFaceAccess('${esc(r.staff_id)}',this.checked)"> Allow Face Registration</label></div>`).join('')}</div></div>`;}
  window.satSetFaceAccess=async function(id,en){try{await rpc('sat_face_set_access',{p_staff_id:id,p_enabled:!!en});toast('Face registration permission updated.','ok');}catch(e){toast(e?.message||e,'err');}};

  async function renderSettings(){await refreshCtx();const hol=await rpc('sat_list_holidays');byId('satPage').innerHTML=`${holidayBanner()}<div class="sat-grid"><div class="sat-card"><h3 class="sat-title">Cut-off Time</h3><div class="sat-field"><label>Last Arrival Time</label><input id="satCutoff" type="time" value="${esc(ctx.cutoff_time||'10:00')}"></div><button class="sat-btn primary" style="margin-top:10px" onclick="satSaveCutoff()">SAVE CUT-OFF</button></div>${ctx.is_admin?`<div class="sat-card"><h3 class="sat-title">Admin Holiday Test Mode</h3><p class="sat-muted">For testing only. On a holiday, Admin can temporarily allow Face / QR / Manual attendance for today.</p><button class="sat-btn ${ctx.test_mode?'warn':'primary'}" onclick="satToggleTestMode(${ctx.test_mode?'false':'true'})">${ctx.test_mode?'TURN OFF TEST MODE':'ENABLE TEST MODE FOR TODAY'}</button></div><div class="sat-card"><h3 class="sat-title">Add School Holiday</h3><div class="sat-field"><label>Nepali Date</label><input id="satHolidayDate" placeholder="2083-06-15"></div><div class="sat-field" style="margin-top:8px"><label>Holiday Name</label><input id="satHolidayTitle"></div><button class="sat-btn primary" style="margin-top:10px" onclick="satSaveHoliday()">+ ADD / UPDATE HOLIDAY</button></div>`:''}<div class="sat-card"><h3 class="sat-title">Custom Holidays</h3>${hol.length?hol.map(h=>`<div class="sat-person"><b>${esc(h.date_bs)}</b> — ${esc(h.title)} ${ctx.is_admin?`<button class="sat-btn danger" style="float:right;padding:6px 9px" onclick="satDeleteHoliday('${esc(h.date_bs)}')">DELETE</button>`:''}</div>`).join(''):'<div class="sat-muted">No extra holidays.</div>'}</div></div>`;}
  window.satSaveCutoff=async function(){try{await rpc('sat_set_cutoff',{p_cutoff:byId('satCutoff').value});toast('Cut-off time saved.','ok');await refreshCtx();}catch(e){toast(e?.message||e,'err');}};
  window.satSaveHoliday=async function(){const d=byId('satHolidayDate').value.trim(),t=byId('satHolidayTitle').value.trim();if(!d)return toast('Enter Nepali date.','warn');try{await rpc('sat_admin_save_holiday',{p_date_bs:d,p_title:t});toast('Holiday saved.','ok');await renderSettings();}catch(e){toast(e?.message||e,'err');}};
  window.satDeleteHoliday=async function(d){if(!confirm(`Delete holiday ${d}?`))return;try{await rpc('sat_admin_delete_holiday',{p_date_bs:d});toast('Holiday deleted.','ok');await renderSettings();}catch(e){toast(e?.message||e,'err');}};
  window.satToggleTestMode=async function(enabled){try{await rpc('sat_admin_set_test_mode',{p_enabled:!!enabled});await refreshCtx();toast(enabled?'Admin Test Mode enabled for today.':'Admin Test Mode turned off.','ok');await satFinalShow(currentView);}catch(e){toast(e?.message||e,'err');}};

  function successSound(){try{const A=window.AudioContext||window.webkitAudioContext,ac=new A(),o=ac.createOscillator(),g=ac.createGain();o.frequency.value=880;g.gain.value=.16;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.16);setTimeout(()=>ac.close(),350);}catch(_){}}
  function alreadySound(){try{const A=window.AudioContext||window.webkitAudioContext,ac=new A(),o=ac.createOscillator(),g=ac.createGain();o.frequency.value=330;g.gain.value=.12;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.14);setTimeout(()=>ac.close(),300);}catch(_){}}

  /* Parent portal: patch existing attendance tab once, without observer. */
  let parentWrapped=false;
  function wrapParentPortal(){
    if(parentWrapped)return; parentWrapped=true;
    const old=window.portalParentTab;
    if(typeof old==='function'){
      window.portalParentTab=function(tab,button){const out=old.apply(this,arguments);if(tab==='attendance')setTimeout(()=>loadParentAttendance(),0);return out;};
    }
  }
  async function loadParentAttendance(){
    const host=byId('parentPortalContent');if(!host)return;
    const token=sessionStorage.getItem('saaf_parent_portal_token')||'';
    if(!token)return;
    try{
      const c=adminDb(); if(!c)return;
      const {data,error}=await c.rpc('sat_parent_my_attendance',{p_token:token,p_from_bs:'2083-01-01',p_to_bs:'2083-12-30'});if(error)throw error;
      const rows=Array.isArray(data?.rows)?data.rows:[];
      host.innerHTML=`<div class="portal-card"><h3>📷 Smart Attendance</h3><div class="sat-table-wrap"><table class="sat-table"><thead><tr><th>Nepali Date</th><th>Day</th><th>Status</th><th>Time</th><th>Source</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.date_bs)}</td><td>${esc(r.day_name)}</td><td>${esc(r.status)}</td><td>${esc(r.time_in||'—')}</td><td>${esc(r.method==='face'?'Face Match':r.method==='qr'?'QR Scan':r.method==='manual'?'Manual Present':'—')}</td></tr>`).join('')}</tbody></table></div></div>`;
    }catch(_){}
  }

  function init(){
    injectStyle();
    injectEntryButtons();
    wrapParentPortal();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();

  /* public aliases */
  window.openSmartAttendance=window.openSmartAttendanceFinal;
  window.closeSmartAttendance=window.closeSmartAttendanceFinal;
})();
