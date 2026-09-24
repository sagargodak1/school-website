/* ============================================================
   ST. AUGUSTINE — STAFF "MY TODAY" DASHBOARD
   Date: 2026-09-24
   Additive frontend enhancement. No table/schema changes.

   Live data used:
   - Attendance: sa_today_bs + sa_get_submission_status_bs
   - Class counters: sa_today + sa_get_roster
   - Parent Concern: pc_my_concerns
   - Existing Staff Dashboard counters for announcements/leaves/plans

   Existing modules remain unchanged.
   ============================================================ */
(function () {
  "use strict";

  const ROOT_ID = "staffMyTodayV1";
  const STYLE_ID = "staffMyTodayStyleV1";
  let refreshBusy = false;
  let refreshTimer = null;
  let lastSignature = "";

  const state = {
    attendance: { kind: "loading", title: "Attendance", value: "Checking…", note: "" },
    concerns: { kind: "loading", title: "Parent Concerns", value: "Checking…", note: "" },
    notices: 0,
    leaves: 0,
    plans: 0,
    classStats: {
      visible: false,
      className: "",
      total: 0,
      present: 0,
      absent: 0,
      submitted: false
    }
  };

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function textNumber(id) {
    const raw = String(document.getElementById(id)?.textContent || "0").replace(/[^\d]/g, "");
    return Number(raw || 0);
  }

  function loggedIn() {
    try { return !!(typeof loggedInStaff !== "undefined" && loggedInStaff); } catch (_) { return false; }
  }

  function getDb() {
    try {
      if (typeof initStaffSupabase === "function") {
        const db = initStaffSupabase();
        if (db) return db;
      }
    } catch (_) {}
    try {
      if (typeof staffSupabase !== "undefined" && staffSupabase) return staffSupabase;
    } catch (_) {}
    return null;
  }

  function staffName() {
    try {
      if (typeof loggedInStaff !== "undefined" && loggedInStaff) {
        return loggedInStaff.name || loggedInStaff.staff_name || loggedInStaff.full_name || loggedInStaff.id || "Staff Member";
      }
    } catch (_) {}
    const greeting = String(document.getElementById("staffDashboardGreeting")?.textContent || "").trim();
    return greeting.replace(/^welcome[,\s]*/i, "").trim() || "Staff Member";
  }

  function staffRole() {
    try {
      if (typeof loggedInStaff !== "undefined" && loggedInStaff) {
        return loggedInStaff.designation || loggedInStaff.role || loggedInStaff.position || "";
      }
    } catch (_) {}
    return String(document.getElementById("staffDashboardRole")?.textContent || "Staff Member").trim();
  }

  function firstName(name) {
    const clean = String(name || "").trim();
    return clean ? clean.split(/\s+/)[0] : "Staff";
  }

  function timeGreeting() {
    let hour = new Date().getHours();
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kathmandu",
        hour: "2-digit",
        hour12: false
      }).formatToParts(new Date());
      const hp = parts.find(x => x.type === "hour");
      if (hp) hour = Number(hp.value);
    } catch (_) {}
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${ROOT_ID}{
        --mt-ink:#0b1739;
        --mt-blue:#1268ff;
        --mt-cyan:#17b5ef;
        --mt-gold:#ffb21a;
        --mt-green:#20a862;
        --mt-red:#dc3c50;
        --mt-soft:#f5f8ff;
        position:relative;
        overflow:hidden;
        margin:0 0 22px;
        border-radius:24px;
        border:1px solid rgba(18,104,255,.16);
        background:
          radial-gradient(circle at 92% 8%, rgba(23,181,239,.22), transparent 26%),
          radial-gradient(circle at 8% 100%, rgba(255,178,26,.16), transparent 28%),
          linear-gradient(135deg,#07132f 0%,#0d2451 48%,#123c70 100%);
        box-shadow:0 22px 55px rgba(8,27,65,.18);
        color:#fff;
      }
      #${ROOT_ID}::before{
        content:"";
        position:absolute;
        width:260px;height:260px;
        right:-120px;top:-135px;
        border-radius:50%;
        border:1px solid rgba(255,255,255,.12);
        box-shadow:0 0 0 34px rgba(255,255,255,.025),0 0 0 68px rgba(255,255,255,.018);
        pointer-events:none;
      }
      #${ROOT_ID} .mt-top{
        position:relative;
        z-index:2;
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:18px;
        align-items:center;
        padding:24px 25px 18px;
      }
      #${ROOT_ID} .mt-eyebrow{
        display:flex;align-items:center;gap:8px;
        margin:0 0 7px;
        font-size:10px;font-weight:900;letter-spacing:1.25px;
        color:#9bdcff;text-transform:uppercase;
      }
      #${ROOT_ID} .mt-live-dot{
        width:8px;height:8px;border-radius:50%;
        background:#50e38f;
        box-shadow:0 0 0 5px rgba(80,227,143,.12),0 0 18px rgba(80,227,143,.65);
      }
      #${ROOT_ID} h2{
        margin:0;
        font-size:clamp(24px,3vw,35px);
        line-height:1.07;
        color:#fff;
        letter-spacing:-.7px;
      }
      #${ROOT_ID} .mt-sub{
        margin:8px 0 0;
        color:rgba(255,255,255,.74);
        font-size:12px;
        line-height:1.45;
      }
      #${ROOT_ID} .mt-ring{
        --pct:0deg;
        width:112px;height:112px;
        display:grid;place-items:center;
        border-radius:50%;
        background:conic-gradient(#58e39a 0deg,var(--pct),rgba(255,255,255,.13) var(--pct),360deg);
        position:relative;
        box-shadow:0 12px 30px rgba(0,0,0,.18);
      }
      #${ROOT_ID} .mt-ring::after{
        content:"";
        position:absolute;inset:8px;border-radius:50%;
        background:linear-gradient(145deg,#0b1d43,#102d5c);
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);
      }
      #${ROOT_ID} .mt-ring-copy{
        position:relative;z-index:2;
        text-align:center;
        display:flex;flex-direction:column;gap:1px;
      }
      #${ROOT_ID} .mt-ring-copy strong{font-size:25px;line-height:1;color:#fff}
      #${ROOT_ID} .mt-ring-copy span{font-size:8px;font-weight:900;letter-spacing:.8px;color:#a9c7ee}
      #${ROOT_ID} .mt-body{
        position:relative;z-index:2;
        padding:0 18px 19px;
      }
      #${ROOT_ID} .mt-status-grid{
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:10px;
      }
      #${ROOT_ID} .mt-status{
        position:relative;
        min-width:0;
        padding:14px 13px;
        border-radius:17px;
        background:rgba(255,255,255,.09);
        border:1px solid rgba(255,255,255,.11);
        backdrop-filter:blur(10px);
        -webkit-backdrop-filter:blur(10px);
        transition:transform .18s ease,background .18s ease,border-color .18s ease;
      }
      #${ROOT_ID} .mt-status:hover{
        transform:translateY(-2px);
        background:rgba(255,255,255,.12);
        border-color:rgba(255,255,255,.2);
      }
      #${ROOT_ID} .mt-status-top{
        display:flex;align-items:center;justify-content:space-between;gap:8px;
        margin-bottom:8px;
      }
      #${ROOT_ID} .mt-status-icon{
        width:34px;height:34px;border-radius:11px;
        display:grid;place-items:center;
        background:rgba(255,255,255,.12);
        font-size:17px;
      }
      #${ROOT_ID} .mt-status-badge{
        padding:4px 7px;border-radius:999px;
        font-size:8px;font-weight:900;letter-spacing:.45px;
        white-space:nowrap;
        background:rgba(255,255,255,.12);color:#dce9ff;
      }
      #${ROOT_ID} .mt-status.ok .mt-status-badge{background:rgba(54,211,124,.16);color:#73efa9}
      #${ROOT_ID} .mt-status.warn .mt-status-badge{background:rgba(255,178,26,.16);color:#ffd16d}
      #${ROOT_ID} .mt-status.alert .mt-status-badge{background:rgba(255,92,112,.16);color:#ff9dac}
      #${ROOT_ID} .mt-status.info .mt-status-badge{background:rgba(83,181,255,.16);color:#93d7ff}
      #${ROOT_ID} .mt-status strong{
        display:block;
        overflow:hidden;text-overflow:ellipsis;
        color:#fff;font-size:13px;line-height:1.3;
      }
      #${ROOT_ID} .mt-status small{
        display:block;margin-top:4px;
        color:rgba(255,255,255,.64);
        font-size:10px;line-height:1.35;
      }
      #${ROOT_ID} .mt-lower{
        display:grid;
        grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);
        gap:11px;
        margin-top:11px;
      }
      #${ROOT_ID} .mt-panel{
        padding:14px;
        border-radius:18px;
        background:rgba(255,255,255,.96);
        color:var(--mt-ink);
        box-shadow:0 12px 30px rgba(0,0,0,.09);
      }
      #${ROOT_ID} .mt-panel-head{
        display:flex;align-items:center;justify-content:space-between;gap:10px;
        margin-bottom:10px;
      }
      #${ROOT_ID} .mt-panel-head div:first-child{
        font-size:12px;font-weight:900;color:#0b1739;
      }
      #${ROOT_ID} .mt-panel-head span{
        font-size:9px;font-weight:800;color:#6e7d9c;
      }
      #${ROOT_ID} .mt-focus-list{
        display:grid;gap:7px;
      }
      #${ROOT_ID} .mt-focus{
        width:100%;
        border:1px solid #e7ecf6;
        background:#f9fbff;
        border-radius:12px;
        padding:9px 10px;
        display:grid;
        grid-template-columns:31px minmax(0,1fr) auto;
        gap:9px;align-items:center;
        text-align:left;cursor:pointer;
        color:#152344;
        transition:.16s ease;
      }
      #${ROOT_ID} .mt-focus:hover{transform:translateX(2px);border-color:#cbdcff;background:#f4f8ff}
      #${ROOT_ID} .mt-focus-icon{
        width:31px;height:31px;border-radius:9px;
        display:grid;place-items:center;
        background:#eaf2ff;
      }
      #${ROOT_ID} .mt-focus strong{display:block;font-size:11px;color:#12203e}
      #${ROOT_ID} .mt-focus small{display:block;margin-top:2px;font-size:9px;color:#6c7890}
      #${ROOT_ID} .mt-focus-arrow{font-size:16px;color:#6d7d9a}
      #${ROOT_ID} .mt-clear{
        border:1px solid #cfeedd;
        background:#f2fcf6;
        border-radius:13px;
        padding:12px;
        color:#17673d;
        font-size:11px;
        font-weight:800;
        line-height:1.45;
      }
      #${ROOT_ID} .mt-shortcuts{
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:7px;
      }
      #${ROOT_ID} .mt-shortcut{
        border:1px solid #e5ebf5;
        background:#fff;
        color:#17284b;
        border-radius:12px;
        min-height:62px;
        padding:9px;
        cursor:pointer;
        display:flex;flex-direction:column;align-items:flex-start;justify-content:center;
        text-align:left;
        transition:.16s ease;
      }
      #${ROOT_ID} .mt-shortcut:hover{
        transform:translateY(-2px);
        border-color:#b8cff8;
        box-shadow:0 7px 18px rgba(22,72,150,.08);
      }
      #${ROOT_ID} .mt-shortcut span{font-size:17px;line-height:1}
      #${ROOT_ID} .mt-shortcut strong{margin-top:6px;font-size:10px;color:#1c2d50;line-height:1.25}
      #${ROOT_ID} .mt-refresh{
        border:0;
        border-radius:999px;
        padding:6px 9px;
        background:#edf4ff;
        color:#2861b2;
        font-size:9px;font-weight:900;
        cursor:pointer;
      }
      #${ROOT_ID} .mt-refresh:disabled{opacity:.55;cursor:wait}

      #${ROOT_ID} .mt-class-live{
        margin-top:11px;
        display:flex;
        align-items:stretch;
        justify-content:flex-end;
        gap:8px;
      }
      #${ROOT_ID} .mt-class-live-label{
        min-width:150px;
        padding:10px 12px;
        border-radius:15px;
        display:flex;
        flex-direction:column;
        justify-content:center;
        background:rgba(255,255,255,.07);
        border:1px solid rgba(255,255,255,.10);
      }
      #${ROOT_ID} .mt-class-live-label small{
        color:#9bdcff;
        font-size:8px;
        font-weight:900;
        letter-spacing:.9px;
      }
      #${ROOT_ID} .mt-class-live-label strong{
        margin-top:3px;
        color:#fff;
        font-size:12px;
        line-height:1.25;
      }
      #${ROOT_ID} .mt-class-stat{
        min-width:118px;
        padding:10px 13px;
        border-radius:15px;
        display:grid;
        grid-template-columns:32px minmax(0,1fr);
        align-items:center;
        gap:8px;
        background:rgba(255,255,255,.96);
        border:1px solid rgba(255,255,255,.55);
        box-shadow:0 10px 26px rgba(0,0,0,.12);
      }
      #${ROOT_ID} .mt-class-stat-icon{
        width:32px;height:32px;
        display:grid;place-items:center;
        border-radius:10px;
        font-size:16px;
      }
      #${ROOT_ID} .mt-class-stat-copy{
        min-width:0;
        display:flex;
        flex-direction:column;
      }
      #${ROOT_ID} .mt-class-stat-copy strong{
        color:#101d39;
        font-size:21px;
        line-height:1;
      }
      #${ROOT_ID} .mt-class-stat-copy span{
        margin-top:3px;
        color:#6d7990;
        font-size:8px;
        font-weight:900;
        letter-spacing:.5px;
        white-space:nowrap;
      }
      #${ROOT_ID} .mt-class-stat.total .mt-class-stat-icon{
        background:#eaf2ff;
        color:#1268ff;
      }
      #${ROOT_ID} .mt-class-stat.present .mt-class-stat-icon{
        background:#e7faef;
        color:#16864c;
      }
      #${ROOT_ID} .mt-class-stat.absent{
        position:relative;
        overflow:hidden;
        border-color:#ffd0d7;
        background:linear-gradient(135deg,#fff 0%,#fff5f6 100%);
      }
      #${ROOT_ID} .mt-class-stat.absent .mt-class-stat-icon{
        background:#ffe5e9;
        color:#d82f48;
      }
      #${ROOT_ID} .mt-class-stat.absent .mt-class-stat-copy strong{
        color:#c91f3a;
      }
      #${ROOT_ID} .mt-class-stat.absent.has-absent{
        animation:mtAbsentPulse 1.25s ease-in-out infinite;
      }
      #${ROOT_ID} .mt-class-stat.absent.has-absent::after{
        content:"";
        position:absolute;
        inset:-30% -50%;
        background:linear-gradient(110deg,transparent 35%,rgba(255,67,91,.14) 50%,transparent 65%);
        transform:translateX(-70%);
        animation:mtAbsentShine 1.25s ease-in-out infinite;
        pointer-events:none;
      }
      @keyframes mtAbsentPulse{
        0%,100%{
          box-shadow:0 8px 22px rgba(190,31,55,.10);
          transform:scale(1);
          border-color:#ffd0d7;
        }
        50%{
          box-shadow:0 0 0 4px rgba(231,50,76,.10),0 12px 30px rgba(190,31,55,.22);
          transform:scale(1.025);
          border-color:#ef6b7f;
        }
      }
      @keyframes mtAbsentShine{
        0%{transform:translateX(-75%)}
        55%,100%{transform:translateX(75%)}
      }
      @media (prefers-reduced-motion:reduce){
        #${ROOT_ID} .mt-class-stat.absent.has-absent,
        #${ROOT_ID} .mt-class-stat.absent.has-absent::after{
          animation:none !important;
        }
      }

      @media(max-width:900px){
        #${ROOT_ID} .mt-status-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      }
      @media(max-width:680px){
        #${ROOT_ID}{border-radius:20px}
        #${ROOT_ID} .mt-top{grid-template-columns:1fr auto;padding:19px 17px 14px}
        #${ROOT_ID} .mt-ring{width:82px;height:82px}
        #${ROOT_ID} .mt-ring-copy strong{font-size:19px}
        #${ROOT_ID} .mt-body{padding:0 11px 12px}
        #${ROOT_ID} .mt-status-grid{grid-template-columns:1fr 1fr;gap:7px}
        #${ROOT_ID} .mt-status{padding:11px 10px;border-radius:14px}
        #${ROOT_ID} .mt-lower{grid-template-columns:1fr}
        #${ROOT_ID} .mt-class-live{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
        }
        #${ROOT_ID} .mt-class-live-label{
          grid-column:1 / -1;
          min-width:0;
        }
        #${ROOT_ID} .mt-class-stat{
          min-width:0;
          grid-template-columns:1fr;
          text-align:center;
          justify-items:center;
          padding:10px 6px;
        }
      }
      @media(max-width:410px){
        #${ROOT_ID} .mt-top{grid-template-columns:1fr}
        #${ROOT_ID} .mt-ring{display:none}
        #${ROOT_ID} .mt-status-grid{grid-template-columns:1fr}
        #${ROOT_ID} .mt-class-live{gap:5px}
        #${ROOT_ID} .mt-class-stat-copy strong{font-size:18px}
        #${ROOT_ID} .mt-class-stat-copy span{font-size:7px}
      }
    `;
    document.head.appendChild(style);
  }

  function clickExisting(pattern) {
    const host = document.querySelector("#staffDashboardPopup") || document;
    const nodes = host.querySelectorAll("button,a,[role='button']");
    for (const node of nodes) {
      const label = String(node.textContent || "").replace(/\s+/g, " ").trim();
      if (pattern.test(label) && node.offsetParent !== null) {
        node.click();
        return true;
      }
    }
    return false;
  }

  window.staffMyTodayAction = function (action) {
    try {
      if (action === "attendance") {
        if (!clickExisting(/student\s*absentee|student\s*absence/i)) {
          alert("Open Student Absentees from the Staff Dashboard.");
        }
        return;
      }
      if (action === "concerns") {
        if (typeof openParentConcernCenter === "function") openParentConcernCenter("history");
        else clickExisting(/parent\s*concern/i);
        return;
      }
      if (action === "concernNew") {
        if (typeof openParentConcernCenter === "function") openParentConcernCenter("new");
        else clickExisting(/parent\s*concern/i);
        return;
      }
      if (action === "question") {
        if (!clickExisting(/question\s*submission/i)) alert("Question Submission is not available in this Staff session.");
        return;
      }
      if (action === "marks") {
        if (typeof openUnifiedMarksEntry === "function") openUnifiedMarksEntry("teacher");
        else if (typeof openMarksEntryHub === "function") openMarksEntryHub();
        else clickExisting(/marks\s*entry/i);
        return;
      }
      if (action === "leave") {
        if (typeof openDashboardFeature === "function") openDashboardFeature("leave");
        else clickExisting(/leave\s*application/i);
        return;
      }
      if (action === "plans") {
        if (typeof openDashboardFeature === "function") openDashboardFeature("plans");
        else clickExisting(/upcoming\s*plan/i);
        return;
      }
      if (action === "password") {
        if (typeof openStaffSelfPasswordReset === "function") openStaffSelfPasswordReset();
        else clickExisting(/reset\s*my\s*password/i);
        return;
      }
      if (action === "announcements") {
        const target = document.getElementById("staffDashboardAnnouncementList");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (error) {
      console.warn("My Today action:", error);
    }
  };

  function buildRoot() {
    ensureStyle();
    const content = document.querySelector("#staffDashboardPopup .staff-dashboard-content");
    if (!content) return null;

    let root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement("section");
      root.id = ROOT_ID;
      root.setAttribute("aria-label", "My Today staff work dashboard");
      const toast = document.getElementById("staffDashboardToast");
      if (toast && toast.parentElement === content) toast.insertAdjacentElement("afterend", root);
      else content.prepend(root);
    }
    return root;
  }

  function statusCard(icon, title, value, note, kind, badge) {
    return `
      <article class="mt-status ${esc(kind || "info")}">
        <div class="mt-status-top">
          <span class="mt-status-icon">${icon}</span>
          <span class="mt-status-badge">${esc(badge || "LIVE")}</span>
        </div>
        <strong>${esc(value)}</strong>
        <small>${esc(title)}${note ? " • " + esc(note) : ""}</small>
      </article>`;
  }

  function focusItems() {
    const items = [];

    if (state.attendance.kind === "warn" || state.attendance.kind === "alert") {
      items.push({
        icon: "🧑‍🎓",
        title: state.attendance.value,
        note: state.attendance.note || "Attendance needs your attention",
        action: "attendance"
      });
    }

    if (state.concerns.active > 0) {
      items.push({
        icon: "👪",
        title: `${state.concerns.active} active Parent Concern${state.concerns.active === 1 ? "" : "s"}`,
        note: "Check Principal/Admin status and messages",
        action: "concerns"
      });
    }

    if (state.notices > 0) {
      items.push({
        icon: "🔔",
        title: `${state.notices} staff announcement${state.notices === 1 ? "" : "s"}`,
        note: "Review Principal's latest information",
        action: "announcements"
      });
    }

    if (state.plans > 0) {
      items.push({
        icon: "📅",
        title: `${state.plans} upcoming school plan${state.plans === 1 ? "" : "s"}`,
        note: "Check upcoming activities and preparation",
        action: "plans"
      });
    }

    return items.slice(0, 4);
  }

  function render() {
    const root = buildRoot();
    if (!root) return;

    const focus = focusItems();
    const actionCount =
      (state.attendance.kind === "warn" || state.attendance.kind === "alert" ? 1 : 0) +
      (state.concerns.active > 0 ? 1 : 0);

    const ringValue = actionCount === 0 ? "✓" : String(actionCount);
    const ringLabel = actionCount === 0 ? "ALL CLEAR" : "ACTION ITEMS";
    const pct = actionCount === 0 ? 360 : Math.max(90, 360 - (actionCount * 90));

    const signature = JSON.stringify({
      staff: staffName(),
      role: staffRole(),
      attendance: state.attendance,
      concerns: state.concerns,
      notices: state.notices,
      leaves: state.leaves,
      plans: state.plans,
      classStats: state.classStats
    });
    if (signature === lastSignature && root.dataset.ready === "1") return;
    lastSignature = signature;

    const attendanceBadge =
      state.attendance.kind === "ok" ? "COMPLETE" :
      state.attendance.kind === "warn" ? "PENDING" :
      state.attendance.kind === "alert" ? "ATTENTION" : "LIVE";

    const concernBadge =
      state.concerns.active > 0 ? "FOLLOW UP" :
      state.concerns.kind === "loading" ? "LIVE" : "CLEAR";

    root.innerHTML = `
      <div class="mt-top">
        <div>
          <p class="mt-eyebrow"><span class="mt-live-dot"></span> MY TODAY • SMART STAFF WORKSPACE</p>
          <h2>${esc(timeGreeting())}, ${esc(firstName(staffName()))} 👋</h2>
          <p class="mt-sub">${esc(staffRole() || "Staff Member")} • See what needs attention and jump straight into your work.</p>
        </div>
        <div class="mt-ring" style="--pct:${pct}deg" aria-label="${esc(ringLabel)}">
          <div class="mt-ring-copy"><strong>${esc(ringValue)}</strong><span>${esc(ringLabel)}</span></div>
        </div>
      </div>

      <div class="mt-body">
        <div class="mt-status-grid">
          ${statusCard("🧑‍🎓","Attendance",state.attendance.value,state.attendance.note,state.attendance.kind,attendanceBadge)}
          ${statusCard("👪","Parent Concerns",state.concerns.value,state.concerns.note,state.concerns.kind,concernBadge)}
          ${statusCard("🔔","Principal Announcements",`${state.notices} notice${state.notices===1?"":"s"}`,"Staff information","info","LIVE")}
          ${statusCard("📅","Upcoming Plans",`${state.plans} plan${state.plans===1?"":"s"}`,"School activities","info","UPCOMING")}
        </div>

        ${state.classStats.visible ? `
        <div class="mt-class-live" aria-label="My class student status">
          <div class="mt-class-live-label">
            <small>📍 MY CLASS • LIVE TODAY</small>
            <strong>${esc(state.classStats.className)}${state.classStats.submitted ? " • Attendance Submitted" : " • Before Submission"}</strong>
          </div>
          <div class="mt-class-stat total">
            <span class="mt-class-stat-icon">👥</span>
            <span class="mt-class-stat-copy"><strong>${state.classStats.total}</strong><span>TOTAL STUDENTS</span></span>
          </div>
          <div class="mt-class-stat present">
            <span class="mt-class-stat-icon">✓</span>
            <span class="mt-class-stat-copy"><strong>${state.classStats.present}</strong><span>PRESENT TODAY</span></span>
          </div>
          <div class="mt-class-stat absent ${state.classStats.absent > 0 ? "has-absent" : ""}">
            <span class="mt-class-stat-icon">●</span>
            <span class="mt-class-stat-copy"><strong>${state.classStats.absent}</strong><span>ABSENT TODAY</span></span>
          </div>
        </div>` : ""}

        <div class="mt-lower">
          <section class="mt-panel">
            <div class="mt-panel-head">
              <div>⚡ ACTION REQUIRED / TODAY'S FOCUS</div>
              <button class="mt-refresh" id="mtRefreshBtn" type="button" onclick="staffMyTodayRefresh(true)">↻ REFRESH</button>
            </div>
            <div class="mt-focus-list">
              ${focus.length ? focus.map(item => `
                <button class="mt-focus" type="button" onclick="staffMyTodayAction('${esc(item.action)}')">
                  <span class="mt-focus-icon">${item.icon}</span>
                  <span><strong>${esc(item.title)}</strong><small>${esc(item.note)}</small></span>
                  <span class="mt-focus-arrow">→</span>
                </button>`).join("") :
                `<div class="mt-clear">✓ No urgent personal action is detected right now. You can continue with your regular class, Marks, Question Submission and school work.</div>`}
            </div>
          </section>

          <section class="mt-panel">
            <div class="mt-panel-head">
              <div>🚀 ONE-TAP WORK</div>
              <span>QUICK LAUNCH</span>
            </div>
            <div class="mt-shortcuts">
              <button class="mt-shortcut" type="button" onclick="staffMyTodayAction('attendance')"><span>🧑‍🎓</span><strong>Student Absentees</strong></button>
              <button class="mt-shortcut" type="button" onclick="staffMyTodayAction('concernNew')"><span>👪</span><strong>Parent Concern</strong></button>
              <button class="mt-shortcut" type="button" onclick="staffMyTodayAction('question')"><span>📄</span><strong>Question Submission</strong></button>
              <button class="mt-shortcut" type="button" onclick="staffMyTodayAction('marks')"><span>📘</span><strong>Marks Entry</strong></button>
              <button class="mt-shortcut" type="button" onclick="staffMyTodayAction('leave')"><span>📝</span><strong>Leave Application</strong></button>
              <button class="mt-shortcut" type="button" onclick="staffMyTodayAction('password')"><span>🔐</span><strong>Reset Password</strong></button>
            </div>
          </section>
        </div>
      </div>`;
    root.dataset.ready = "1";
  }

  function scalarRpcValue(data) {
    let value = data;
    if (Array.isArray(value)) {
      const first = value[0];
      value = typeof first === "object" && first ? Object.values(first)[0] : first;
    } else if (value && typeof value === "object") {
      value = Object.values(value)[0];
    }
    return value;
  }

  async function loadClassStats(db) {
    state.classStats = {
      visible: false,
      className: "",
      total: 0,
      present: 0,
      absent: 0,
      submitted: false
    };

    try {
      const today = await db.rpc("sa_today");
      if (today.error) throw today.error;
      const ad = String(scalarRpcValue(today.data) || "").trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ad)) throw new Error("School date unavailable");

      const roster = await db.rpc("sa_get_roster", { p_date: ad });
      if (roster.error) throw roster.error;

      const rows = Array.isArray(roster.data) ? roster.data : [];
      if (!rows.length) return;

      const className = String(rows[0]?.class_name || "").trim();
      const submitted = rows.some(row => row && row.class_submitted === true);
      const total = rows.length;
      const absent = submitted ? rows.filter(row => row && row.is_absent === true).length : 0;
      const present = Math.max(0, total - absent);

      state.classStats = {
        visible: true,
        className: className || "My Class",
        total,
        present,
        absent,
        submitted
      };
    } catch (error) {
      /* Principal/Admin and non-class-teacher Staff may not have one assigned roster.
         In that case the three Class Teacher counters stay hidden. */
      console.debug("My Today class stats:", error?.message || error);
    }
  }

  async function loadAttendance(db) {
    try {
      const today = await db.rpc("sa_today_bs");
      if (today.error) throw today.error;

      let bs = String(scalarRpcValue(today.data) || "").trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(bs)) throw new Error("Nepali date unavailable");

      const res = await db.rpc("sa_get_submission_status_bs", { p_date_bs: bs });
      if (res.error) throw res.error;
      const rows = Array.isArray(res.data) ? res.data : [];

      if (!rows.length) {
        state.attendance = {
          kind: "info",
          value: "No class assignment",
          note: `Today ${bs}`
        };
        return;
      }

      if (rows.length === 1) {
        const row = rows[0];
        if (row.submitted) {
          state.attendance = {
            kind: "ok",
            value: `${row.class_name} submitted ✓`,
            note: `${Number(row.absent_count || 0)} absent • ${bs}`
          };
        } else {
          state.attendance = {
            kind: "warn",
            value: `${row.class_name} not submitted`,
            note: `Submit today's absence • ${bs}`
          };
        }
        return;
      }

      const submitted = rows.filter(x => x && x.submitted === true).length;
      state.attendance = {
        kind: submitted === rows.length ? "ok" : "warn",
        value: `${submitted}/${rows.length} classes submitted`,
        note: `School attendance • ${bs}`
      };
    } catch (error) {
      state.attendance = {
        kind: "info",
        value: "Attendance available",
        note: "Open Student Absentees"
      };
      console.warn("My Today attendance:", error);
    }
  }

  async function loadConcerns(db) {
    try {
      const res = await db.rpc("pc_my_concerns", {
        p_from_date: null,
        p_to_date: null,
        p_status: null
      });
      if (res.error) throw res.error;
      const rows = Array.isArray(res.data) ? res.data : [];
      const active = rows.filter(r => ["pending","reviewed","in_progress"].includes(String(r.status || ""))).length;
      const solved = rows.filter(r => ["solved","closed"].includes(String(r.status || ""))).length;

      state.concerns = {
        kind: active > 0 ? "warn" : "ok",
        active,
        total: rows.length,
        value: active > 0 ? `${active} active concern${active === 1 ? "" : "s"}` : "No active concerns ✓",
        note: rows.length ? `${solved} solved/closed • ${rows.length} total` : "Nothing pending"
      };
    } catch (error) {
      state.concerns = {
        kind: "info",
        active: 0,
        total: 0,
        value: "Concern Center ready",
        note: "Submit or track status"
      };
      console.warn("My Today concerns:", error);
    }
  }

  function loadExistingCounts() {
    state.notices = textNumber("staffDashboardNoticeCount");
    state.leaves = textNumber("staffDashboardLeaveCount");
    state.plans = textNumber("staffDashboardPlanCount");
  }

  window.staffMyTodayRefresh = async function (manual) {
    if (refreshBusy || !loggedIn()) return;
    refreshBusy = true;
    const btn = document.getElementById("mtRefreshBtn");
    if (btn) { btn.disabled = true; btn.textContent = "REFRESHING…"; }

    try {
      const db = getDb();
      loadExistingCounts();
      if (db) {
        await Promise.allSettled([loadAttendance(db), loadConcerns(db), loadClassStats(db)]);
      }
      loadExistingCounts();
      render();
    } finally {
      refreshBusy = false;
      const b = document.getElementById("mtRefreshBtn");
      if (b) { b.disabled = false; b.textContent = "↻ REFRESH"; }
      if (manual) {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => {
          loadExistingCounts();
          render();
        }, 900);
      }
    }
  };

  function dashboardVisible() {
    const popup = document.getElementById("staffDashboardPopup");
    if (!popup) return false;
    const s = getComputedStyle(popup);
    return s.display !== "none" && s.visibility !== "hidden";
  }

  function scheduleRefresh(delay) {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      if (dashboardVisible() && loggedIn()) {
        buildRoot();
        staffMyTodayRefresh(false);
      }
    }, typeof delay === "number" ? delay : 180);
  }

  function start() {
    buildRoot();
    scheduleRefresh(500);

    const observer = new MutationObserver((mutations) => {
      let should = false;
      for (const m of mutations) {
        if (m.type === "childList" && m.addedNodes.length) { should = true; break; }
        if (m.type === "attributes") { should = true; break; }
        if (m.type === "characterData") { should = true; break; }
      }
      if (should) scheduleRefresh(240);
    });

    const popup = document.getElementById("staffDashboardPopup");
    if (popup) observer.observe(popup, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["style","class"]
    });

    document.addEventListener("click", () => {
      if (dashboardVisible()) scheduleRefresh(500);
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
