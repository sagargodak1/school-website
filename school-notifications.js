/* =========================================================
   ST. AUGUSTINE ACADEMIC FOUNDATION
   SCHOOL NOTIFICATIONS — V1
   Web Push + Bell + Read/Unread + Admin/Principal Send Form
   ========================================================= */
(function(){
  "use strict";

  const VAPID_PUBLIC_KEY="BEwBJeacvvXqRp1mRoE-g6nHtCz6NG2VgLKrkO-g7Ro5SaLfu7VXgch04kXFllHCoiKcj1hUGayer2_ww9CzKSE";
  const POLL_MS=60000;
  let activeClient=null;
  let activeSession=null;
  let activeRole=null;
  let activeStaffId=null;
  let swRegistration=null;
  let pollTimer=null;

  function esc(v){
    return String(v??"")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function urlBase64ToUint8Array(base64String){
    const padding="=".repeat((4-base64String.length%4)%4);
    const base64=(base64String+padding).replace(/-/g,"+").replace(/_/g,"/");
    const raw=atob(base64);
    return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)));
  }

  async function resolveAuth(){
    const candidates=[];
    try{
      if(typeof initStaffSupabase==="function"){
        const c=initStaffSupabase();
        if(c)candidates.push(c);
      }
    }catch(_){
    }
    try{
      if(typeof initStudentSupabase==="function"){
        const c=initStudentSupabase();
        if(c&&!candidates.includes(c))candidates.push(c);
      }
    }catch(_){
    }

    for(const client of candidates){
      try{
        const {data}=await client.auth.getSession();
        const session=data?.session||null;
        if(!session?.user?.id)continue;

        const {data:role,error:roleError}=await client.rpc("school_notification_role");
        if(roleError||!role)continue;
        const {data:staffId}=await client.rpc("school_notification_staff_id");

        activeClient=client;
        activeSession=session;
        activeRole=Array.isArray(role)?role[0]:role;
        activeStaffId=Array.isArray(staffId)?staffId[0]:staffId;
        return true;
      }catch(_){
      }
    }

    activeClient=null;activeSession=null;activeRole=null;activeStaffId=null;
    return false;
  }

  async function ensureServiceWorker(){
    if(!("serviceWorker" in navigator))return null;
    try{
      swRegistration=await navigator.serviceWorker.getRegistration("./");
      if(!swRegistration){
        swRegistration=await navigator.serviceWorker.register("./sw.js",{scope:"./",updateViaCache:"none"});
      }
      try{await swRegistration.update();}catch(_){
      }
      return swRegistration;
    }catch(error){
      console.warn("Notification service worker unavailable:",error);
      return null;
    }
  }

  function injectStyles(){
    if(document.getElementById("schoolNotificationStyles"))return;
    const s=document.createElement("style");
    s.id="schoolNotificationStyles";
    s.textContent=`
      #schoolNotificationBell{position:fixed;top:82px;right:16px;z-index:1000001;width:50px;height:50px;border:0;border-radius:50%;background:#123c69;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.22);font-size:23px;cursor:pointer;display:none}
      #schoolNotificationBadge{position:absolute;top:-4px;right:-4px;min-width:21px;height:21px;padding:0 5px;border-radius:12px;background:#d32f2f;color:#fff;font:700 12px/21px Arial;text-align:center;display:none}
      #schoolNotificationPanel{position:fixed;top:140px;right:14px;z-index:1000002;width:min(390px,calc(100vw - 28px));max-height:72vh;overflow:auto;background:#fff;color:#1e2a36;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.26);display:none;border:1px solid #dbe4ee}
      .sn-head{position:sticky;top:0;background:#123c69;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;z-index:2}
      .sn-head strong{font-size:17px} .sn-close{border:0;background:transparent;color:#fff;font-size:24px;cursor:pointer}
      .sn-actions{padding:12px 14px;border-bottom:1px solid #e4eaf0;background:#f8fafc}
      .sn-btn{border:0;border-radius:10px;padding:10px 12px;font-weight:700;cursor:pointer;background:#0b78c4;color:#fff}
      .sn-btn.secondary{background:#e9eff5;color:#123c69} .sn-btn.danger{background:#b42318}
      .sn-status{font-size:12px;margin-top:8px;color:#526170}
      .sn-list{padding:5px 0} .sn-item{padding:12px 14px;border-bottom:1px solid #edf1f5;cursor:pointer}
      .sn-item.unread{background:#eef7ff} .sn-title{font-weight:800;margin-bottom:4px} .sn-body{font-size:13px;line-height:1.42;color:#455565}
      .sn-meta{margin-top:6px;font-size:11px;color:#758494} .sn-empty{padding:22px;text-align:center;color:#6a7887}
      .sn-compose{padding:12px 14px;border-bottom:1px solid #e4eaf0;background:#fff8e8}
      .sn-compose input,.sn-compose textarea,.sn-compose select{width:100%;box-sizing:border-box;margin:5px 0;padding:9px;border:1px solid #cfd9e3;border-radius:9px;font:inherit}
      .sn-compose textarea{min-height:70px;resize:vertical} .sn-row{display:flex;gap:8px;flex-wrap:wrap}
      @media(max-width:600px){#schoolNotificationBell{top:auto;bottom:22px;right:18px}#schoolNotificationPanel{top:70px;bottom:82px;max-height:none}}
    `;
    document.head.appendChild(s);
  }

  function ensureUi(){
    injectStyles();
    if(!document.getElementById("schoolNotificationBell")){
      const b=document.createElement("button");
      b.id="schoolNotificationBell";
      b.type="button";
      b.setAttribute("aria-label","School notifications");
      b.innerHTML='🔔<span id="schoolNotificationBadge"></span>';
      b.addEventListener("click",togglePanel);
      document.body.appendChild(b);
    }
    if(!document.getElementById("schoolNotificationPanel")){
      const p=document.createElement("div");
      p.id="schoolNotificationPanel";
      p.innerHTML=`
        <div class="sn-head"><strong>🔔 School Notifications</strong><button class="sn-close" type="button" onclick="window.closeSchoolNotifications()">×</button></div>
        <div id="schoolNotificationActions" class="sn-actions"></div>
        <div id="schoolNotificationCompose"></div>
        <div id="schoolNotificationList" class="sn-list"><div class="sn-empty">Loading…</div></div>`;
      document.body.appendChild(p);
    }
  }

  function setVisible(on){
    const bell=document.getElementById("schoolNotificationBell");
    if(bell)bell.style.display=on?"block":"none";
    if(!on)window.closeSchoolNotifications();
  }

  function permissionText(){
    if(!("Notification" in window))return "This browser does not support notifications.";
    if(Notification.permission==="denied")return "Notifications are blocked in this browser/phone settings.";
    if(Notification.permission==="granted")return "Phone notification permission is allowed.";
    return "Tap Enable Notifications to allow phone alerts.";
  }

  async function renderActions(){
    const box=document.getElementById("schoolNotificationActions");
    if(!box)return;
    let subscribed=false;
    try{
      const reg=swRegistration||await ensureServiceWorker();
      subscribed=!!(reg&&await reg.pushManager.getSubscription());
    }catch(_){
    }
    box.innerHTML=`
      <div class="sn-row">
        <button id="snEnableBtn" class="sn-btn" type="button">${subscribed?"✓ Notifications Active":"Enable Notifications"}</button>
        ${subscribed?'<button id="snDisableBtn" class="sn-btn danger" type="button">Disable This Device</button>':""}
        <button id="snRefreshBtn" class="sn-btn secondary" type="button">Refresh</button>
      </div>
      <div class="sn-status">${esc(permissionText())}</div>`;
    document.getElementById("snEnableBtn")?.addEventListener("click",enablePush);
    document.getElementById("snDisableBtn")?.addEventListener("click",disablePush);
    document.getElementById("snRefreshBtn")?.addEventListener("click",loadNotifications);
  }

  function renderCompose(){
    const host=document.getElementById("schoolNotificationCompose");
    if(!host)return;
    if(!["admin","principal"].includes(activeRole)){
      host.innerHTML="";
      return;
    }
    host.innerHTML=`
      <div class="sn-compose">
        <strong>Send Notification</strong>
        <input id="snSendTitle" maxlength="100" placeholder="Title">
        <textarea id="snSendBody" maxlength="500" placeholder="Message"></textarea>
        <select id="snSendAudience">
          <option value="all_internal">Admin + Principal + All Staff</option>
          <option value="staff_all">Principal + All Staff</option>
          <option value="ordinary_staff">All Staff</option>
          <option value="admin_principal">Admin + Principal</option>
          <option value="principal">Principal Only</option>
          <option value="admin">Admin Only</option>
        </select>
        <button id="snSendBtn" class="sn-btn" type="button">SEND NOTIFICATION</button>
        <div id="snSendStatus" class="sn-status"></div>
      </div>`;
    document.getElementById("snSendBtn")?.addEventListener("click",sendManualNotification);
  }

  async function sendManualNotification(){
    if(!activeClient)return;
    const title=document.getElementById("snSendTitle")?.value.trim()||"";
    const body=document.getElementById("snSendBody")?.value.trim()||"";
    const audience=document.getElementById("snSendAudience")?.value||"all_internal";
    const status=document.getElementById("snSendStatus");
    if(!title||!body){
      if(status)status.textContent="Enter both title and message.";
      return;
    }
    const btn=document.getElementById("snSendBtn");
    if(btn)btn.disabled=true;
    if(status)status.textContent="Sending…";
    try{
      const {error}=await activeClient.rpc("school_send_notification",{
        p_title:title,p_body:body,p_audience:audience,p_selected_staff_ids:[],
        p_priority:"normal",p_click_path:"/",p_data:{open:"staff_dashboard"}
      });
      if(error)throw error;
      if(status)status.textContent="✓ Notification created and queued for push.";
      document.getElementById("snSendTitle").value="";
      document.getElementById("snSendBody").value="";
      setTimeout(loadNotifications,500);
    }catch(error){
      console.error(error);
      if(status)status.textContent="Could not send: "+(error?.message||error);
    }finally{
      if(btn)btn.disabled=false;
    }
  }

  async function enablePush(){
    if(!activeClient||!activeSession){
      alert("Please log in first.");
      return;
    }
    if(!("Notification" in window)||!("PushManager" in window)){
      alert("Push notifications are not supported on this browser/device.");
      return;
    }
    try{
      const reg=swRegistration||await ensureServiceWorker();
      if(!reg)throw new Error("Service worker is not available.");

      if(Notification.permission!=="granted"){
        const permission=await Notification.requestPermission();
        if(permission!=="granted"){
          await renderActions();
          return;
        }
      }

      let sub=await reg.pushManager.getSubscription();
      if(!sub){
        sub=await reg.pushManager.subscribe({
          userVisibleOnly:true,
          applicationServerKey:urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
      }

      const j=sub.toJSON();
      const keys=j.keys||{};
      if(!keys.p256dh||!keys.auth)throw new Error("Push subscription keys are missing.");

      const deviceName=[
        navigator.userAgentData?.platform||navigator.platform||"",
        /iPhone|iPad|iPod/i.test(navigator.userAgent)?"iOS":
          /Android/i.test(navigator.userAgent)?"Android":"Web"
      ].filter(Boolean).join(" • ");

      const {error}=await activeClient.rpc("school_register_push_subscription",{
        p_endpoint:sub.endpoint,
        p_p256dh:keys.p256dh,
        p_auth_key:keys.auth,
        p_device_name:deviceName
      });
      if(error)throw error;

      await renderActions();
      if(typeof showStaffDashboardToast==="function")showStaffDashboardToast("✓ School notifications enabled.");
      else alert("School notifications are enabled on this device.");
    }catch(error){
      console.error("Enable push failed",error);
      alert("Could not enable notifications: "+(error?.message||error));
      await renderActions();
    }
  }

  async function disablePush(){
    try{
      const reg=swRegistration||await ensureServiceWorker();
      const sub=reg?await reg.pushManager.getSubscription():null;
      if(sub&&activeClient){
        try{await activeClient.rpc("school_unregister_push_subscription",{p_endpoint:sub.endpoint});}catch(_){
        }
        await sub.unsubscribe();
      }
      await renderActions();
    }catch(error){
      alert("Could not disable notifications: "+(error?.message||error));
    }
  }

  function fmtTime(v){
    try{
      return new Date(v).toLocaleString("en-GB",{
        timeZone:"Asia/Kathmandu",day:"2-digit",month:"short",
        hour:"2-digit",minute:"2-digit"
      });
    }catch(_){
      return String(v||"");
    }
  }

  async function loadNotifications(){
    if(!activeClient)return;
    const host=document.getElementById("schoolNotificationList");
    if(host)host.innerHTML='<div class="sn-empty">Loading…</div>';
    try{
      const {data,error}=await activeClient.rpc("school_get_my_notifications",{p_limit:50});
      if(error)throw error;
      const rows=Array.isArray(data)?data:[];
      const unread=rows.filter(x=>!x.is_read).length;
      const badge=document.getElementById("schoolNotificationBadge");
      if(badge){
        badge.textContent=unread>99?"99+":String(unread);
        badge.style.display=unread?"block":"none";
      }
      if(!host)return;
      if(!rows.length){
        host.innerHTML='<div class="sn-empty">No notifications yet.</div>';
        return;
      }
      host.innerHTML=rows.map(n=>`
        <div class="sn-item ${n.is_read?"":"unread"}" data-id="${n.id}">
          <div class="sn-title">${esc(n.title)}</div>
          <div class="sn-body">${esc(n.body)}</div>
          <div class="sn-meta">${esc(fmtTime(n.created_at))}${n.created_by_name?` • ${esc(n.created_by_name)}`:""}</div>
        </div>`).join("");
      host.querySelectorAll(".sn-item").forEach((el,i)=>{
        el.addEventListener("click",()=>openNotification(rows[i]));
      });
    }catch(error){
      console.error("Load notifications failed",error);
      if(host)host.innerHTML='<div class="sn-empty">Could not load notifications.</div>';
    }
  }

  async function openNotification(n){
    try{
      if(activeClient&&!n.is_read){
        await activeClient.rpc("school_mark_notification_read",{p_notification_id:n.id});
      }
    }catch(_){
    }
    await loadNotifications();
    window.closeSchoolNotifications();
    routeNotification(n?.data||{});
  }

  function routeNotification(data){
    const open=String(data?.open||"");
    if(open==="absence_monitor"&&typeof openStudentAbsence==="function"){
      const source=activeRole==="admin"?"admin":"staff";
      openStudentAbsence(source);
      return;
    }
    if(typeof openStaffDashboard==="function"&&activeRole!=="admin"){
      openStaffDashboard();
      return;
    }
    if(activeRole==="admin"&&typeof openWebsiteAdminPanel==="function"){
      openWebsiteAdminPanel();
    }
  }

  async function togglePanel(){
    const p=document.getElementById("schoolNotificationPanel");
    if(!p)return;
    const opening=p.style.display!=="block";
    p.style.display=opening?"block":"none";
    if(opening){
      await renderActions();
      renderCompose();
      await loadNotifications();
    }
  }

  window.closeSchoolNotifications=function(){
    const p=document.getElementById("schoolNotificationPanel");
    if(p)p.style.display="none";
  };

  async function sync(){
    ensureUi();
    const ok=await resolveAuth();
    setVisible(ok);
    if(!ok)return;
    await ensureServiceWorker();

    /* If the browser already has a subscription, silently refresh it in DB. */
    try{
      if(Notification.permission==="granted"&&swRegistration){
        const sub=await swRegistration.pushManager.getSubscription();
        if(sub){
          const j=sub.toJSON(),keys=j.keys||{};
          if(keys.p256dh&&keys.auth){
            await activeClient.rpc("school_register_push_subscription",{
              p_endpoint:sub.endpoint,p_p256dh:keys.p256dh,p_auth_key:keys.auth,
              p_device_name:navigator.userAgentData?.platform||navigator.platform||"Web"
            });
          }
        }
      }
    }catch(_){
    }
    await loadNotifications();
  }

  navigator.serviceWorker?.addEventListener("message",event=>{
    if(event.data?.type==="SCHOOL_NOTIFICATION_CLICK"){
      sync().then(()=>routeNotification(event.data.payload||{}));
    }
  });

  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible")sync();
  });

  document.addEventListener("DOMContentLoaded",()=>{
    ensureUi();
    ensureServiceWorker();
    setTimeout(sync,1200);
    pollTimer=setInterval(sync,POLL_MS);
  });
})();
