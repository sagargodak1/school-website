/* ============================================================
   ST. AUGUSTINE — ABSENCE SUBMITTED CLASSES SUMMARY
   Date: 2026-09-24
   Safe additive frontend patch.

   Purpose:
   - Keep the existing Student Absence module unchanged.
   - In Admin/Principal monitoring view, show Submitted Classes
     immediately below the existing Not Submitted section.
   - Reuse existing sa_get_submission_status_bs() RPC.
   - Works with selected Nepali B.S. date.
   ============================================================ */
(function () {
  "use strict";

  const PANEL_ID = "saSubmittedClassesSummaryV1";
  const STYLE_ID = "saSubmittedClassesSummaryStyleV1";
  let renderTimer = null;
  let rendering = false;
  let lastSignature = "";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function textOf(node) {
    return String(node && (node.textContent || "") || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isVisible(el) {
    if (!el || !(el instanceof Element)) return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID}{
        margin:14px 0 4px;
        padding:15px;
        border:1px solid #b8e3c8;
        border-radius:16px;
        background:linear-gradient(180deg,#f6fff9 0%,#effbf4 100%);
        box-shadow:0 7px 18px rgba(22,101,52,.08);
      }
      #${PANEL_ID} .sa-submitted-head{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin-bottom:12px;
      }
      #${PANEL_ID} .sa-submitted-title{
        font-size:15px;
        font-weight:800;
        color:#166534;
        letter-spacing:.01em;
      }
      #${PANEL_ID} .sa-submitted-count{
        flex:0 0 auto;
        padding:5px 10px;
        border-radius:999px;
        background:#dcfce7;
        color:#166534;
        font-size:12px;
        font-weight:800;
      }
      #${PANEL_ID} .sa-submitted-grid{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(210px,1fr));
        gap:9px;
      }
      #${PANEL_ID} .sa-submitted-item{
        display:flex;
        align-items:flex-start;
        gap:9px;
        min-width:0;
        padding:10px 11px;
        border:1px solid #d1ead9;
        border-radius:12px;
        background:#fff;
      }
      #${PANEL_ID} .sa-submitted-check{
        flex:0 0 28px;
        width:28px;
        height:28px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        border-radius:50%;
        background:#dcfce7;
        color:#15803d;
        font-weight:900;
      }
      #${PANEL_ID} .sa-submitted-copy{
        min-width:0;
        flex:1 1 auto;
      }
      #${PANEL_ID} .sa-submitted-class{
        color:#14532d;
        font-weight:800;
        line-height:1.25;
      }
      #${PANEL_ID} .sa-submitted-meta{
        margin-top:3px;
        color:#64748b;
        font-size:11px;
        line-height:1.35;
      }
      #${PANEL_ID} .sa-submitted-zero{
        display:inline-block;
        margin-top:4px;
        padding:2px 7px;
        border-radius:999px;
        background:#f0fdf4;
        color:#15803d;
        font-size:10px;
        font-weight:800;
      }
      #${PANEL_ID} .sa-submitted-empty{
        padding:11px;
        border:1px dashed #bbdfc7;
        border-radius:11px;
        background:#fff;
        color:#64748b;
        font-size:13px;
      }
      @media(max-width:640px){
        #${PANEL_ID}{padding:12px}
        #${PANEL_ID} .sa-submitted-grid{grid-template-columns:1fr}
      }
    `;
    document.head.appendChild(style);
  }

  function getSupabaseClient() {
    try {
      if (typeof initStaffSupabase === "function") {
        const client = initStaffSupabase();
        if (client) return client;
      }
    } catch (_) {}

    try {
      if (typeof initStudentSupabase === "function") {
        const client = initStudentSupabase();
        if (client) return client;
      }
    } catch (_) {}

    try {
      if (typeof staffSupabase !== "undefined" && staffSupabase) return staffSupabase;
    } catch (_) {}

    try {
      if (typeof studentSupabase !== "undefined" && studentSupabase) return studentSupabase;
    } catch (_) {}

    return null;
  }

  function findNotSubmittedHeading() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const t = String(node.nodeValue || "").replace(/\s+/g, " ").trim();
          if (!t || t.length > 140) return NodeFilter.FILTER_REJECT;
          return /(attendance\s*)?not\s*submitted|not\s*submitted\s*classes/i.test(t)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      const el = node.parentElement;
      if (el && isVisible(el) && !el.closest("#" + PANEL_ID)) return el;
    }
    return null;
  }

  function findMonitorRoot(heading) {
    if (!heading) return null;
    return (
      heading.closest('[role="dialog"]') ||
      heading.closest(".popup") ||
      heading.closest(".modal") ||
      heading.closest('[class*="absence"]') ||
      heading.closest('[id*="absence"]') ||
      document.body
    );
  }

  function selectedBsDate(root) {
    if (!root) return "";

    const candidates = Array.from(root.querySelectorAll("input"))
      .filter(isVisible)
      .map((el) => {
        const value = String(el.value || "").trim();
        let score = 0;
        const meta = `${el.id || ""} ${el.name || ""} ${el.placeholder || ""} ${el.getAttribute("aria-label") || ""}`.toLowerCase();
        if (/absence|attendance/.test(meta)) score += 4;
        if (/date|nepali|bs/.test(meta)) score += 3;
        if (/^20\d{2}-\d{2}-\d{2}$/.test(value)) score += 10;
        return { el, value, score };
      })
      .filter((x) => /^20\d{2}-\d{2}-\d{2}$/.test(x.value))
      .sort((a, b) => b.score - a.score);

    if (candidates.length) return candidates[0].value;

    const txt = textOf(root);
    const matches = txt.match(/\b20\d{2}-\d{2}-\d{2}\b/g);
    return matches && matches.length ? matches[0] : "";
  }

  function chooseAnchor(heading, root) {
    if (!heading) return null;

    let current = heading;
    let best = heading.parentElement || heading;

    for (let i = 0; i < 5 && current && current.parentElement && current.parentElement !== root; i++) {
      const parent = current.parentElement;
      const txt = textOf(parent);
      if (txt.length > 0 && txt.length < 1800 && /not\s*submitted/i.test(txt)) {
        best = parent;
        current = parent;
      } else {
        break;
      }
    }
    return best;
  }

  function formatTime(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    try {
      return d.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kathmandu",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch (_) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  }

  function createPanel() {
    let panel = document.getElementById(PANEL_ID);
    if (!panel) {
      panel = document.createElement("section");
      panel.id = PANEL_ID;
      panel.setAttribute("aria-label", "Absence Submitted Classes");
    }
    return panel;
  }

  function renderPanel(panel, submitted, totalRows, bsDate) {
    const items = submitted.map((row) => {
      const absent = Number(row.absent_count || 0);
      const who = row.submitted_by_name || row.class_teacher_name || "Class Teacher";
      const time = formatTime(row.submitted_at);
      return `
        <div class="sa-submitted-item">
          <span class="sa-submitted-check" aria-hidden="true">✓</span>
          <div class="sa-submitted-copy">
            <div class="sa-submitted-class">${esc(row.class_name || "Class")}</div>
            <div class="sa-submitted-meta">
              Submitted by ${esc(who)} • ${esc(time)}<br>
              ${absent} absent student${absent === 1 ? "" : "s"}
            </div>
            ${absent === 0 ? '<span class="sa-submitted-zero">No Absentees Today</span>' : ""}
          </div>
        </div>
      `;
    }).join("");

    panel.innerHTML = `
      <div class="sa-submitted-head">
        <div class="sa-submitted-title">✅ Absence Submitted Classes</div>
        <div class="sa-submitted-count">${submitted.length} / ${totalRows}</div>
      </div>
      ${items
        ? `<div class="sa-submitted-grid">${items}</div>`
        : `<div class="sa-submitted-empty">No Class has submitted absence for ${esc(bsDate)} yet.</div>`}
    `;
  }

  async function renderSubmittedClasses() {
    if (rendering) return;

    const heading = findNotSubmittedHeading();
    if (!heading) return;

    const root = findMonitorRoot(heading);
    const bsDate = selectedBsDate(root);
    if (!bsDate) return;

    const client = getSupabaseClient();
    if (!client || typeof client.rpc !== "function") return;

    rendering = true;
    try {
      const result = await client.rpc("sa_get_submission_status_bs", { p_date_bs: bsDate });
      if (result && result.error) throw result.error;

      const rows = Array.isArray(result && result.data) ? result.data : [];

      /* Normal class teachers normally receive only their own class.
         The all-classes summary is intended for Admin/Principal monitor view. */
      if (rows.length <= 1) {
        const old = document.getElementById(PANEL_ID);
        if (old) old.remove();
        lastSignature = "";
        return;
      }

      const submitted = rows.filter((row) => row && row.submitted === true);
      const signature = JSON.stringify({
        date: bsDate,
        total: rows.length,
        submitted: submitted.map((r) => [
          r.class_name,
          r.absent_count,
          r.submitted_by_name,
          r.submitted_at
        ])
      });

      ensureStyles();

      let panel = createPanel();
      const anchor = chooseAnchor(heading, root);
      if (!anchor) return;

      if (!panel.isConnected || panel.previousElementSibling !== anchor) {
        anchor.insertAdjacentElement("afterend", panel);
      }

      if (signature !== lastSignature) {
        renderPanel(panel, submitted, rows.length, bsDate);
        lastSignature = signature;
      }
    } catch (error) {
      console.warn("Absence Submitted Classes summary:", error);
    } finally {
      rendering = false;
    }
  }

  function scheduleRender(delay) {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(renderSubmittedClasses, typeof delay === "number" ? delay : 120);
  }

  document.addEventListener("change", function (event) {
    const target = event.target;
    if (target && target.matches && target.matches("input,select")) scheduleRender(120);
  }, true);

  document.addEventListener("click", function () {
    scheduleRender(260);
  }, true);

  const observer = new MutationObserver(function (mutations) {
    let relevant = false;
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length) {
        relevant = true;
        break;
      }
    }
    if (relevant) scheduleRender(120);
  });

  function start() {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleRender(250);
    setTimeout(() => scheduleRender(0), 900);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
