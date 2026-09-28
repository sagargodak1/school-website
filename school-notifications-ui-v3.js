/* ============================================================
   ST. AUGUSTINE ACADEMIC FOUNDATION
   SCHOOL NOTIFICATIONS UI V3 — FINAL PATCH

   Works WITH the existing school-notifications.js (V1).
   Adds only the approved final improvements:
   1) Staff/Principal bell + Logout under the dashboard Time/Date (no overlap)
   2) Nepal time in 12-hour AM/PM format
   3) Nepali B.S. date for current school year 2083
   4) Admin/Principal Select All + checkbox + Delete Selected
   5) Calls 30-day cleanup RPC when a manager opens/uses notifications
   6) Staff session is not stored here; existing Supabase persistSession remains authoritative
   ============================================================ */
(function(){
  "use strict";

  const PATCH_ID="school-notifications-ui-v3";
  const BS_2083_STARTS=[
    "2026-04-14","2026-05-15","2026-06-15","2026-07-17",
    "2026-08-17","2026-09-17","2026-10-18","2026-11-17",
    "2026-12-16","2027-01-15","2027-02-13","2027-03-15"
  ];
  const BS_2083_LENGTHS=[31,31,32,31,31,31,30,29,30,29,30,30];

  let client=null;
  let role=null;
  let cleanupTried=false;
  let refreshTimer=null;
  let observer=null;

  function injectStyles(){
    if(document.getElementById(PATCH_ID+"-styles"))return;
    const s=document.createElement("style");
    s.id=PATCH_ID+"-styles";
    s.textContent=`
      /* Staff/Principal: place controls INSIDE the blue dashboard hero, below Time/Date. */
      .sn3-header-actions{
        display:flex;
        align-items:center;
        justify-content:flex-end;
        gap:8px;
        margin-top:8px;
        min-height:38px;
        width:100%;
      }
      .sn3-header-actions #schoolNotificationBell{
        position:relative !important;
        inset:auto !important;
        right:auto !important;
        bottom:auto !important;
        top:auto !important;
        width:38px !important;
        height:38px !important;
        min-width:38px !important;
        min-height:38px !important;
        padding:0 !important;
        margin:0 !important;
        border:1px solid rgba(255,255,255,.32) !important;
        border-radius:50% !important;
        background:rgba(255,255,255,.15) !important;
        color:#fff !important;
        box-shadow:none !important;
        font-size:17px !important;
        line-height:38px !important;
        align-items:center !important;
        justify-content:center !important;
        vertical-align:middle !important;
        z-index:3 !important;
      }
      .sn3-header-actions #schoolNotificationBell:hover{
        background:rgba(255,255,255,.25) !important;
      }
      .sn3-header-actions #schoolNotificationBadge{
        top:-6px !important;
        right:-7px !important;
      }
      #schoolStaffQuickLogoutV3{
        height:38px;
        padding:0 12px;
        margin:0;
        border:1px solid rgba(255,255,255,.32);
        border-radius:19px;
        background:rgba(139,29,29,.92);
        color:#fff;
        font:700 12px/38px Arial,sans-serif;
        cursor:pointer;
        white-space:nowrap;
        box-shadow:none;
      }
      #schoolStaffQuickLogoutV3:disabled{opacity:.65;cursor:wait}

      /* Admin does not have the Staff Dashboard clock, so keep only a small fixed bell. */
      body.sn3-admin-mode #schoolNotificationBell{
        position:fixed !important;
        top:86px !important;
        right:18px !important;
        bottom:auto !important;
        width:42px !important;
        height:42px !important;
        min-width:42px !important;
        padding:0 !important;
        border-radius:50% !important;
        font-size:18px !important;
        line-height:42px !important;
        z-index:1000001 !important;
      }

      /* Notification panel stays clear of the header controls. */
      #schoolNotificationPanel{
        top:74px !important;
        right:12px !important;
        bottom:auto !important;
        max-height:calc(100vh - 92px) !important;
        width:min(410px,calc(100vw - 24px)) !important;
      }

      /* Manager multi-delete controls. */
      #sn3ManagerTools{
        padding:10px 12px;
        border-bottom:1px solid #e4eaf0;
        background:#f8fafc;
        display:flex;
        align-items:center;
        gap:8px;
        flex-wrap:wrap;
      }
      #sn3ManagerTools .sn3-label{font-size:12px;color:#526170;margin-right:auto}
      #sn3ManagerTools button{
        border:0;
        border-radius:9px;
        padding:8px 10px;
        font-weight:800;
        cursor:pointer;
      }
      #sn3SelectAll{background:#e9eff5;color:#123c69}
      #sn3DeleteSelected{background:#b42318;color:#fff}
      #sn3DeleteSelected:disabled{opacity:.55;cursor:not-allowed}
      .sn-item{position:relative}
      .sn3-select-wrap{
        float:left;
        width:28px;
        min-height:40px;
        display:flex;
        align-items:flex-start;
        padding-top:2px;
      }
      .sn3-select{
        width:18px;
        height:18px;
        accent-color:#b42318;
        cursor:pointer;
      }
      .sn-item.sn3-manager-item .sn-title,
      .sn-item.sn3-manager-item .sn-body,
      .sn-item.sn3-manager-item .sn-meta{margin-left:30px}
      .sn3-retention-note{
        width:100%;
        font-size:11px;
        color:#758494;
      }

      @media(max-width:600px){
        .staff-dashboard-clock{align-items:flex-end !important}
        .sn3-header-actions{justify-content:flex-end;gap:7px;margin-top:7px}
        .sn3-header-actions #schoolNotificationBell{
          width:36px !important;height:36px !important;min-width:36px !important;min-height:36px !important;
          line-height:36px !important;font-size:16px !important;
        }
        #schoolStaffQuickLogoutV3{height:36px;line-height:36px;border-radius:18px;padding:0 10px;font-size:11px}
        #schoolNotificationPanel{
          top:62px !important;
          right:8px !important;
          width:calc(100vw - 16px) !important;
          max-height:calc(100vh - 76px) !important;
        }
      }
    `;
    document.head.appendChild(s);
  }

  function staffIsLoggedIn(){
    try{
      return typeof loggedInStaff!=="undefined" && !!loggedInStaff &&
             typeof staffAuthSession!=="undefined" && !!staffAuthSession;
    }catch(_){return false;}
  }

  async function resolveClientRole(){
    const candidates=[];
    try{if(typeof initStaffSupabase==="function"){const c=initStaffSupabase();if(c)candidates.push(c);}}catch(_){ }
    try{if(typeof initStudentSupabase==="function"){const c=initStudentSupabase();if(c&&!candidates.includes(c))candidates.push(c);}}catch(_){ }
    for(const c of candidates){
      try{
        const {data:s}=await c.auth.getSession();
        if(!s?.session?.user?.id)continue;
        const {data:r,error}=await c.rpc("school_notification_role");
        if(error||!r)continue;
        client=c;
        role=Array.isArray(r)?r[0]:r;
        return true;
      }catch(_){ }
    }
    client=null; role=null;
    return false;
  }

  function ensureLogoutButton(){
    let b=document.getElementById("schoolStaffQuickLogoutV3");
    if(b)return b;
    b=document.createElement("button");
    b.id="schoolStaffQuickLogoutV3";
    b.type="button";
    b.textContent="⎋ Logout";
    b.title="Log out from Staff / Principal ID";
    b.setAttribute("aria-label","Log out from Staff or Principal ID");
    b.addEventListener("click",async()=>{
      if(!staffIsLoggedIn())return;
      if(!confirm("Log out from this Staff / Principal ID on this device?"))return;
      const old=b.textContent;
      b.disabled=true;b.textContent="Logging out…";
      try{
        if(typeof window.closeSchoolNotifications==="function")window.closeSchoolNotifications();
        if(typeof staffLogout==="function")await staffLogout();
        else if(typeof window.staffLogout==="function")await window.staffLogout();
        else throw new Error("Staff logout function is unavailable.");
        setTimeout(()=>{
          try{
            if(typeof openStaffLogin==="function")openStaffLogin();
            else if(typeof window.openStaffLogin==="function")window.openStaffLogin();
          }catch(_){ }
        },120);
      }catch(error){
        console.error("Staff logout failed:",error);
        alert("Could not log out: "+(error?.message||error));
      }finally{
        b.disabled=false;b.textContent=old;
      }
    });
    return b;
  }

  function placeHeaderControls(){
    injectStyles();
    const bell=document.getElementById("schoolNotificationBell");
    const clock=document.querySelector("#staffDashboardPopup .staff-dashboard-clock");
    const logout=ensureLogoutButton();

    if(staffIsLoggedIn() && clock && bell){
      document.body.classList.remove("sn3-admin-mode");
      let row=clock.querySelector(".sn3-header-actions");
      if(!row){
        row=document.createElement("div");
        row.className="sn3-header-actions";
        clock.appendChild(row);
      }
      if(bell.parentElement!==row)row.appendChild(bell);
      if(logout.parentElement!==row)row.appendChild(logout);
      logout.style.display="inline-block";
      return;
    }

    logout.style.display="none";
    if(bell && role==="admin"){
      document.body.classList.add("sn3-admin-mode");
      if(bell.parentElement!==document.body)document.body.appendChild(bell);
    }else{
      document.body.classList.remove("sn3-admin-mode");
    }
  }

  function kathmanduAdDateString(iso){
    const d=new Date(iso);
    if(Number.isNaN(d.getTime()))return "";
    const parts=new Intl.DateTimeFormat("en-CA",{
      timeZone:"Asia/Kathmandu",year:"numeric",month:"2-digit",day:"2-digit"
    }).formatToParts(d);
    const get=t=>parts.find(x=>x.type===t)?.value||"";
    return `${get("year")}-${get("month")}-${get("day")}`;
  }

  function daysBetween(a,b){
    const [ay,am,ad]=a.split("-").map(Number);
    const [by,bm,bd]=b.split("-").map(Number);
    return Math.round((Date.UTC(ay,am-1,ad)-Date.UTC(by,bm-1,bd))/86400000);
  }

  function adToBs2083(ad){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(ad))return "";
    for(let i=0;i<BS_2083_STARTS.length;i++){
      const diff=daysBetween(ad,BS_2083_STARTS[i]);
      if(diff>=0 && diff<BS_2083_LENGTHS[i]){
        return `2083-${String(i+1).padStart(2,"0")}-${String(diff+1).padStart(2,"0")}`;
      }
    }
    return "";
  }

  function formatNotificationTime(iso){
    try{
      const d=new Date(iso);
      if(Number.isNaN(d.getTime()))return String(iso||"");
      const ad=kathmanduAdDateString(iso);
      const bs=adToBs2083(ad);
      const time=new Intl.DateTimeFormat("en-US",{
        timeZone:"Asia/Kathmandu",hour:"2-digit",minute:"2-digit",hour12:true
      }).format(d);
      /* Current notification retention is 30 days and the school is in session 2083.
         If a future date is outside the configured 2083 calendar map, keep the date explicit
         instead of fabricating a B.S. value. */
      return `${bs || ad} • ${time}`;
    }catch(_){return String(iso||"");}
  }

  function selectedIds(){
    return [...document.querySelectorAll("#schoolNotificationList .sn3-select:checked")]
      .map(x=>Number(x.value)).filter(Number.isFinite);
  }

  function updateDeleteButton(){
    const b=document.getElementById("sn3DeleteSelected");
    if(!b)return;
    const n=selectedIds().length;
    b.disabled=n===0;
    b.textContent=n?`Delete Selected (${n})`:"Delete Selected";
  }

  function ensureManagerTools(){
    const compose=document.getElementById("schoolNotificationCompose");
    const list=document.getElementById("schoolNotificationList");
    if(!list)return;
    let tools=document.getElementById("sn3ManagerTools");

    if(!["admin","principal"].includes(role)){
      tools?.remove();
      return;
    }

    if(!tools){
      tools=document.createElement("div");
      tools.id="sn3ManagerTools";
      tools.innerHTML=`
        <span class="sn3-label">Manage notification history</span>
        <button id="sn3SelectAll" type="button">Select All</button>
        <button id="sn3DeleteSelected" type="button" disabled>Delete Selected</button>
        <div class="sn3-retention-note">History is kept for 30 days. Older notification copies are cleaned automatically.</div>`;
      if(compose?.parentNode)compose.parentNode.insertBefore(tools,list);
      else list.parentNode?.insertBefore(tools,list);

      tools.querySelector("#sn3SelectAll")?.addEventListener("click",()=>{
        const boxes=[...document.querySelectorAll("#schoolNotificationList .sn3-select")];
        const allChecked=boxes.length>0 && boxes.every(x=>x.checked);
        boxes.forEach(x=>x.checked=!allChecked);
        tools.querySelector("#sn3SelectAll").textContent=allChecked?"Select All":"Unselect All";
        updateDeleteButton();
      });

      tools.querySelector("#sn3DeleteSelected")?.addEventListener("click",async()=>{
        const ids=selectedIds();
        if(!ids.length||!client)return;
        if(!confirm(`Delete ${ids.length} selected notification${ids.length===1?"":"s"}?\n\nThis removes the notification copy for everyone. Original Announcement/Attendance records are not deleted.`))return;
        const btn=document.getElementById("sn3DeleteSelected");
        const old=btn.textContent;
        btn.disabled=true;btn.textContent="Deleting…";
        try{
          const {data,error}=await client.rpc("school_delete_notifications",{p_notification_ids:ids});
          if(error)throw error;
          ids.forEach(id=>document.querySelector(`#schoolNotificationList .sn-item[data-id="${id}"]`)?.remove());
          btn.textContent=`Deleted ${Number(data)||ids.length}`;
          setTimeout(()=>document.getElementById("snRefreshBtn")?.click(),250);
          setTimeout(scheduleRefresh,650);
        }catch(error){
          console.error("Delete selected notifications failed:",error);
          alert("Could not delete selected notifications. Run SCHOOL-NOTIFICATIONS-V3-PATCH.sql first.\n\n"+(error?.message||error));
          btn.textContent=old;
        }finally{
          setTimeout(updateDeleteButton,700);
        }
      });
    }
  }

  async function maybeCleanup(){
    if(cleanupTried||!client||!["admin","principal"].includes(role))return;
    cleanupTried=true;
    try{await client.rpc("school_cleanup_old_notifications",{p_days:30});}catch(error){
      console.warn("30-day notification cleanup RPC not ready:",error?.message||error);
    }
  }

  async function enhanceNotificationList(){
    if(!document.getElementById("schoolNotificationPanel"))return;
    if(!client||!role)await resolveClientRole();
    placeHeaderControls();
    if(!client)return;

    await maybeCleanup();
    ensureManagerTools();

    let rows=[];
    try{
      const {data,error}=await client.rpc("school_get_my_notifications",{p_limit:50});
      if(error)throw error;
      rows=Array.isArray(data)?data:[];
    }catch(error){
      console.warn("V3 notification enhancement could not load rows:",error?.message||error);
      return;
    }

    const byId=new Map(rows.map(r=>[String(r.id),r]));
    const manager=["admin","principal"].includes(role);

    document.querySelectorAll("#schoolNotificationList .sn-item[data-id]").forEach(item=>{
      const row=byId.get(String(item.dataset.id));
      if(!row)return;
      const meta=item.querySelector(".sn-meta");
      if(meta){
        const by=row.created_by_name?` • ${row.created_by_name}`:"";
        meta.textContent=formatNotificationTime(row.created_at)+by;
      }

      if(manager){
        item.classList.add("sn3-manager-item");
        if(!item.querySelector(".sn3-select-wrap")){
          const wrap=document.createElement("span");
          wrap.className="sn3-select-wrap";
          wrap.innerHTML=`<input class="sn3-select" type="checkbox" value="${Number(row.id)}" aria-label="Select notification">`;
          const box=wrap.querySelector("input");
          ["click","mousedown","touchstart"].forEach(ev=>box.addEventListener(ev,e=>e.stopPropagation()));
          box.addEventListener("change",e=>{e.stopPropagation();updateDeleteButton();});
          item.insertBefore(wrap,item.firstChild);
        }
      }else{
        item.classList.remove("sn3-manager-item");
        item.querySelector(".sn3-select-wrap")?.remove();
      }
    });
    updateDeleteButton();
  }

  function scheduleRefresh(){
    clearTimeout(refreshTimer);
    refreshTimer=setTimeout(()=>enhanceNotificationList().catch(()=>{}),220);
  }

  function startObserver(){
    const panel=document.getElementById("schoolNotificationPanel");
    if(!panel||observer)return;
    observer=new MutationObserver(()=>scheduleRefresh());
    observer.observe(panel,{childList:true,subtree:true});
  }

  async function boot(){
    injectStyles();
    await resolveClientRole();
    placeHeaderControls();
    startObserver();
    scheduleRefresh();
    setInterval(()=>{
      resolveClientRole().then(()=>{
        placeHeaderControls();
        startObserver();
        scheduleRefresh();
      });
    },2500);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(boot,1400),{once:true});
  else setTimeout(boot,1400);

  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible")setTimeout(()=>{
      resolveClientRole().then(()=>{placeHeaderControls();scheduleRefresh();});
    },250);
  });
})();
