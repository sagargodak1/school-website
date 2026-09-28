/* ============================================================
   ST. AUGUSTINE ACADEMIC FOUNDATION
   SCHOOL NOTIFICATIONS — MANAGER HISTORY V4

   Load AFTER:
     school-notifications.js
     school-notifications-ui-v3.js

   Adds:
   - Admin / Principal: ALL Notification Records section
   - Shows Staff-only notifications too
   - Select All + Delete Selected for the global history
   - Nepal 12-hour time + B.S. 2083 date
   - Keeps Staff view unchanged
   ============================================================ */
(function(){
  "use strict";

  const STYLE_ID="school-notifications-manager-v4-styles";
  const SECTION_ID="sn4ManagerHistory";
  const BS_2083_STARTS=[
    "2026-04-14","2026-05-15","2026-06-15","2026-07-17",
    "2026-08-17","2026-09-17","2026-10-18","2026-11-17",
    "2026-12-16","2027-01-15","2027-02-13","2027-03-15"
  ];
  const BS_2083_LENGTHS=[31,31,32,31,31,31,30,29,30,29,30,30];

  let client=null;
  let role=null;
  let lastLoad=0;
  let loading=false;
  let cleanupTried=false;

  function esc(v){
    return String(v??"")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function injectStyles(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement("style");
    s.id=STYLE_ID;
    s.textContent=`
      /* V3 manager checkboxes were attached only to the manager's own inbox.
         V4 moves manager deletion to the true global history section. */
      #sn3ManagerTools{display:none!important}
      #schoolNotificationList .sn3-select-wrap{display:none!important}
      #schoolNotificationList .sn-item.sn3-manager-item .sn-title,
      #schoolNotificationList .sn-item.sn3-manager-item .sn-body,
      #schoolNotificationList .sn-item.sn3-manager-item .sn-meta{margin-left:0!important}

      #${SECTION_ID}{
        border-bottom:1px solid #e4eaf0;
        background:#f7f9fc;
      }
      .sn4-head{
        padding:11px 12px 9px;
        display:flex;
        align-items:center;
        gap:8px;
        flex-wrap:wrap;
        border-bottom:1px solid #e4eaf0;
      }
      .sn4-head-main{margin-right:auto;min-width:170px}
      .sn4-head-main strong{display:block;color:#123c69;font-size:14px}
      .sn4-head-main small{display:block;color:#6d7b89;font-size:10.5px;margin-top:2px}
      .sn4-btn{
        border:0;border-radius:9px;padding:7px 9px;font-weight:800;font-size:11px;
        cursor:pointer;background:#e8eef5;color:#123c69;
      }
      .sn4-btn.danger{background:#b42318;color:#fff}
      .sn4-btn:disabled{opacity:.5;cursor:not-allowed}
      .sn4-list{max-height:310px;overflow:auto;background:#fff}
      .sn4-row{
        display:grid;grid-template-columns:28px 1fr;gap:5px;
        padding:10px 12px;border-bottom:1px solid #edf1f5;
      }
      .sn4-row:last-child{border-bottom:0}
      .sn4-check{width:17px;height:17px;margin-top:3px;accent-color:#b42318;cursor:pointer}
      .sn4-title{font-size:13px;font-weight:800;color:#243443;line-height:1.25}
      .sn4-body{font-size:12px;color:#526170;line-height:1.38;margin-top:3px;white-space:pre-wrap;overflow-wrap:anywhere}
      .sn4-meta{font-size:10.5px;color:#7a8896;margin-top:5px;line-height:1.35}
      .sn4-audience{
        display:inline-block;margin-top:5px;padding:2px 7px;border-radius:10px;
        background:#eaf3fb;color:#155b8f;font-size:10px;font-weight:800;
      }
      .sn4-empty{padding:16px;text-align:center;color:#708090;font-size:12px}
      .sn4-retention{padding:7px 12px;font-size:10px;color:#7a8896;background:#fbfcfd;border-top:1px solid #edf1f5}
      @media(max-width:600px){
        .sn4-list{max-height:36vh}
        .sn4-head{padding:10px}
        .sn4-row{padding:9px 10px}
      }
    `;
    document.head.appendChild(s);
  }

  async function resolveAuth(){
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
    client=null;role=null;
    return false;
  }

  function isManager(){return role==="admin"||role==="principal";}

  function daysBetween(a,b){
    const [ay,am,ad]=String(a).split("-").map(Number);
    const [by,bm,bd]=String(b).split("-").map(Number);
    return Math.round((Date.UTC(ay,am-1,ad)-Date.UTC(by,bm-1,bd))/86400000);
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

  function adToBs2083(ad){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(ad))return "";
    for(let i=0;i<BS_2083_STARTS.length;i++){
      const diff=daysBetween(ad,BS_2083_STARTS[i]);
      if(diff>=0&&diff<BS_2083_LENGTHS[i]){
        return `2083-${String(i+1).padStart(2,"0")}-${String(diff+1).padStart(2,"0")}`;
      }
    }
    return "";
  }

  function formatWhen(iso){
    try{
      const d=new Date(iso);
      if(Number.isNaN(d.getTime()))return String(iso||"");
      const ad=kathmanduAdDateString(iso);
      const bs=adToBs2083(ad)||ad;
      const tm=new Intl.DateTimeFormat("en-US",{
        timeZone:"Asia/Kathmandu",hour:"2-digit",minute:"2-digit",hour12:true
      }).format(d);
      return `${bs} • ${tm}`;
    }catch(_){return String(iso||"");}
  }

  function audienceLabel(v){
    const map={
      all_internal:"Admin + Principal + All Staff",
      staff_all:"Principal + All Staff",
      ordinary_staff:"All Staff",
      admin_principal:"Admin + Principal",
      principal:"Principal Only",
      admin:"Admin Only",
      selected_staff:"Selected Staff"
    };
    return map[String(v||"")]||String(v||"Audience not recorded");
  }

  function ensureSection(){
    const panel=document.getElementById("schoolNotificationPanel");
    const list=document.getElementById("schoolNotificationList");
    if(!panel||!list)return null;

    let section=document.getElementById(SECTION_ID);
    if(!isManager()){
      section?.remove();
      return null;
    }

    if(!section){
      section=document.createElement("section");
      section.id=SECTION_ID;
      section.innerHTML=`
        <div class="sn4-head">
          <div class="sn4-head-main">
            <strong>All Notification Records</strong>
            <small>Admin / Principal history — includes Staff-only notifications</small>
          </div>
          <button id="sn4Refresh" class="sn4-btn" type="button">Refresh</button>
          <button id="sn4SelectAll" class="sn4-btn" type="button">Select All</button>
          <button id="sn4Delete" class="sn4-btn danger" type="button" disabled>Delete Selected</button>
        </div>
        <div id="sn4List" class="sn4-list"><div class="sn4-empty">Loading all notification records…</div></div>
        <div class="sn4-retention">Notification-copy history is retained for 30 days. Deleting here does not delete the original Announcement or Attendance record.</div>`;
      list.parentNode.insertBefore(section,list);

      section.querySelector("#sn4Refresh")?.addEventListener("click",()=>loadManagerHistory(true));
      section.querySelector("#sn4SelectAll")?.addEventListener("click",()=>{
        const boxes=[...section.querySelectorAll(".sn4-check")];
        const all=boxes.length>0&&boxes.every(x=>x.checked);
        boxes.forEach(x=>x.checked=!all);
        updateDeleteButton();
      });
      section.querySelector("#sn4Delete")?.addEventListener("click",deleteSelected);
      section.addEventListener("change",e=>{
        if(e.target?.classList?.contains("sn4-check"))updateDeleteButton();
      });
    }
    return section;
  }

  function selectedIds(){
    const section=document.getElementById(SECTION_ID);
    if(!section)return [];
    return [...section.querySelectorAll(".sn4-check:checked")]
      .map(x=>Number(x.value)).filter(Number.isFinite);
  }

  function updateDeleteButton(){
    const b=document.getElementById("sn4Delete");
    if(!b)return;
    const n=selectedIds().length;
    b.disabled=n===0;
    b.textContent=n?`Delete Selected (${n})`:"Delete Selected";
    const allBtn=document.getElementById("sn4SelectAll");
    const boxes=[...document.querySelectorAll(`#${SECTION_ID} .sn4-check`)];
    if(allBtn)allBtn.textContent=(boxes.length&&boxes.every(x=>x.checked))?"Unselect All":"Select All";
  }

  async function maybeCleanup(){
    if(cleanupTried||!client||!isManager())return;
    cleanupTried=true;
    try{await client.rpc("school_cleanup_old_notifications",{p_days:30});}catch(_){ }
  }

  async function loadManagerHistory(force=false){
    if(loading)return;
    if(!client||!role)await resolveAuth();
    if(!isManager())return;
    const section=ensureSection();
    if(!section)return;

    const now=Date.now();
    if(!force&&now-lastLoad<5000)return;
    lastLoad=now;
    loading=true;
    const host=document.getElementById("sn4List");
    if(host)host.innerHTML='<div class="sn4-empty">Loading all notification records…</div>';

    try{
      await maybeCleanup();
      const {data,error}=await client.rpc("school_get_manager_notifications",{p_limit:500});
      if(error)throw error;
      const rows=Array.isArray(data)?data:[];
      if(!host)return;

      if(!rows.length){
        host.innerHTML='<div class="sn4-empty">No notification records found.</div>';
        updateDeleteButton();
        return;
      }

      host.innerHTML=rows.map(n=>`
        <div class="sn4-row" data-id="${Number(n.id)}">
          <input class="sn4-check" type="checkbox" value="${Number(n.id)}" aria-label="Select notification record">
          <div>
            <div class="sn4-title">${esc(n.title||"Notification")}</div>
            <div class="sn4-body">${esc(n.body||"")}</div>
            <span class="sn4-audience">${esc(audienceLabel(n.audience))}</span>
            <div class="sn4-meta">${esc(formatWhen(n.created_at))}${n.created_by_name?` • ${esc(n.created_by_name)}`:""}</div>
          </div>
        </div>`).join("");
      updateDeleteButton();
    }catch(error){
      console.error("Manager notification history load failed:",error);
      if(host)host.innerHTML=`<div class="sn4-empty">Could not load all records.<br>${esc(error?.message||error)}</div>`;
    }finally{
      loading=false;
    }
  }

  async function deleteSelected(){
    const ids=selectedIds();
    if(!ids.length||!client)return;
    if(!confirm(`Delete ${ids.length} selected notification record${ids.length===1?"":"s"}?\n\nThis removes the notification copy for everyone. Original Announcement/Attendance records stay safe.`))return;

    const b=document.getElementById("sn4Delete");
    const old=b?.textContent||"Delete Selected";
    if(b){b.disabled=true;b.textContent="Deleting…";}
    try{
      const {data,error}=await client.rpc("school_delete_notifications",{p_notification_ids:ids});
      if(error)throw error;
      await loadManagerHistory(true);
      setTimeout(()=>document.getElementById("snRefreshBtn")?.click(),100);
      if(typeof showStaffDashboardToast==="function")showStaffDashboardToast(`✓ ${Number(data)||ids.length} notification record(s) deleted.`);
    }catch(error){
      console.error("Delete manager notifications failed:",error);
      alert("Could not delete selected notifications: "+(error?.message||error));
      if(b){b.disabled=false;b.textContent=old;}
    }
  }

  async function boot(force=false){
    injectStyles();
    await resolveAuth();
    ensureSection();
    const panel=document.getElementById("schoolNotificationPanel");
    if(isManager()&&panel?.style?.display==="block")await loadManagerHistory(force);
  }

  document.addEventListener("click",e=>{
    if(e.target?.closest?.("#schoolNotificationBell")){
      setTimeout(()=>boot(true),120);
    }
    if(e.target?.closest?.("#snRefreshBtn")){
      setTimeout(()=>loadManagerHistory(true),250);
    }
  },true);

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>boot(true),1600),{once:true});
  }else{
    setTimeout(()=>boot(true),1600);
  }

  setInterval(()=>{
    const panel=document.getElementById("schoolNotificationPanel");
    if(panel?.style?.display==="block")boot(false);
  },5000);
})();
