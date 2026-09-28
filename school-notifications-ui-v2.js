/* ============================================================
   ST. AUGUSTINE ACADEMIC FOUNDATION
   SCHOOL NOTIFICATION QUICK UI V2
   - Small floating bell at lower-right
   - Staff/Principal quick Logout beside bell
   - Uses the existing secure staffLogout() function
   - Does NOT store passwords
   ============================================================ */
(function(){
  "use strict";

  function injectQuickUiStyles(){
    if(document.getElementById("schoolNotificationQuickUiV2Styles")) return;
    const style=document.createElement("style");
    style.id="schoolNotificationQuickUiV2Styles";
    style.textContent=`
      /* Compact notification bell */
      #schoolNotificationBell{
        top:auto !important;
        bottom:18px !important;
        right:96px !important;
        width:42px !important;
        height:42px !important;
        font-size:18px !important;
        border-radius:50% !important;
        box-shadow:0 5px 18px rgba(0,0,0,.22) !important;
      }

      /* Keep notification panel above the small bottom controls */
      #schoolNotificationPanel{
        top:auto !important;
        bottom:70px !important;
        right:12px !important;
        max-height:calc(100vh - 92px) !important;
      }

      #schoolStaffQuickLogout{
        position:fixed;
        right:14px;
        bottom:18px;
        z-index:1000001;
        height:42px;
        min-width:72px;
        padding:0 12px;
        border:0;
        border-radius:21px;
        background:#8f1d1d;
        color:#fff;
        box-shadow:0 5px 18px rgba(0,0,0,.22);
        font:700 13px/42px Arial,sans-serif;
        cursor:pointer;
        display:none;
        white-space:nowrap;
      }
      #schoolStaffQuickLogout:active{transform:translateY(1px)}

      @media(max-width:600px){
        #schoolNotificationBell{
          bottom:16px !important;
          right:94px !important;
          width:40px !important;
          height:40px !important;
          font-size:17px !important;
        }
        #schoolStaffQuickLogout{
          right:12px;
          bottom:16px;
          height:40px;
          min-width:70px;
          line-height:40px;
          border-radius:20px;
          font-size:12px;
        }
        #schoolNotificationPanel{
          top:70px !important;
          bottom:68px !important;
          right:10px !important;
          width:calc(100vw - 20px) !important;
          max-height:none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function staffIsLoggedIn(){
    try{
      return typeof loggedInStaff!=="undefined" && !!loggedInStaff &&
             typeof staffAuthSession!=="undefined" && !!staffAuthSession;
    }catch(_){
      return false;
    }
  }

  function ensureQuickLogoutButton(){
    let button=document.getElementById("schoolStaffQuickLogout");
    if(button) return button;

    button=document.createElement("button");
    button.id="schoolStaffQuickLogout";
    button.type="button";
    button.setAttribute("aria-label","Log out from Staff Login");
    button.title="Log out from Staff Login";
    button.textContent="⎋ Logout";

    button.addEventListener("click",async()=>{
      if(!staffIsLoggedIn()) return;
      if(!confirm("Log out from this Staff / Principal ID on this device?")) return;

      button.disabled=true;
      const oldText=button.textContent;
      button.textContent="Logging out…";

      try{
        if(typeof window.closeSchoolNotifications==="function"){
          window.closeSchoolNotifications();
        }

        if(typeof staffLogout==="function"){
          await staffLogout();
        }else if(typeof window.staffLogout==="function"){
          await window.staffLogout();
        }else{
          throw new Error("Staff logout function is unavailable.");
        }

        button.style.display="none";

        /* Browser mode also returns to Staff Login immediately.
           Installed PWA already does this through the existing app.js logout wrapper. */
        setTimeout(()=>{
          try{
            if(typeof openStaffLogin==="function") openStaffLogin();
            else if(typeof window.openStaffLogin==="function") window.openStaffLogin();
          }catch(_){ }
        },120);
      }catch(error){
        console.error("Quick staff logout failed:",error);
        alert("Could not log out: "+(error?.message||error));
        button.disabled=false;
        button.textContent=oldText;
      }
    });

    document.body.appendChild(button);
    return button;
  }

  function syncQuickUi(){
    injectQuickUiStyles();
    const logout=ensureQuickLogoutButton();
    logout.style.display=staffIsLoggedIn()?"block":"none";

    /* If no authenticated notification bell is currently visible,
       keep the logout button tucked to the right by itself. */
    const bell=document.getElementById("schoolNotificationBell");
    const bellVisible=!!bell && getComputedStyle(bell).display!=="none";
    logout.style.right=bellVisible?"14px":"14px";
  }

  document.addEventListener("DOMContentLoaded",()=>{
    syncQuickUi();
    setTimeout(syncQuickUi,1400);
    setInterval(syncQuickUi,1500);
  });

  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible") syncQuickUi();
  });
})();
