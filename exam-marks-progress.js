/* St. Augustine Exam Tracker - SAFE V5 display-only progress overlay.
 * Does not replace any Marks/Question Submission functions or modify the DB.
 */
(function () {
  'use strict';
  const host = document.getElementById('examTrackerHost');
  if (!host) return;
  const records = new Map();
  const normalize = value => String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
  const keyFor = (cls, subject) => normalize(cls) + '|' + normalize(subject);
  const labels = {
    draft: 'Draft / Not Submitted',
    submitted_to_class_teacher: 'Sent to Class Teacher',
    accepted_by_class_teacher: 'Class Teacher Accepted',
    submitted_to_admin: 'Sent to Admin',
    returned_by_admin: 'Returned by Admin',
    returned_to_subject_teacher: 'Returned to Subject Teacher'
  };
  let requestedPeriod = null;
  let latestRequest = 0;
  let errorMessage = '';
  let applying = false;
  const css = document.createElement('style');
  css.id = 'saMarksProgressStyle';
  css.textContent = '.sa-marks-progress{font-size:10px;font-weight:750;line-height:1.4;margin-top:7px;padding:5px 7px;border-radius:7px;color:#164e85;background:#eaf4ff;overflow-wrap:anywhere}.sa-marks-progress.accepted{color:#146c43;background:#e1f5e9}.sa-marks-progress.returned{color:#923b20;background:#fff0e7}.sa-marks-progress.none{color:#687687;background:#f0f3f7}.sa-marks-progress.unavailable{color:#8d4c15;background:#fff2d9}';
  document.head.appendChild(css);
  function getPeriod() {
    try { return typeof examCurrentPeriod !== 'undefined' ? examCurrentPeriod : null; }
    catch (_) { return null; }
  }
  async function fetchMarks(period) {
    const id = String(period.id);
    requestedPeriod = id;
    const token = ++latestRequest;
    records.clear();
    errorMessage = '';
    try {
      if (typeof examDb !== 'function') throw new Error('Exam database is not available');
      const db = examDb();
      if (!db) throw new Error('Exam database is not available');
      const { data, error } = await db.rpc('school_exam_marks_progress', {
        p_academic_session: String(period.academic_year),
        p_term_name: String(period.term_name)
      });
      if (error) throw error;
      if (token !== latestRequest || String(getPeriod()?.id) !== id) return;
      for (const record of data || []) {
        const k = keyFor(record.class_name, record.subject_name);
        const old = records.get(k);
        if (!old || Number(record.project_id) > Number(old.project_id)) records.set(k, record);
      }
    } catch (e) {
      if (token !== latestRequest) return;
      errorMessage = String(e?.message || e);
      console.warn('[Marks Progress] read-only fetch failed:', e);
    }
    if (token === latestRequest && String(getPeriod()?.id) === id) decorate();
  }
  function decorate() {
    if (applying) return;
    applying = true;
    try {
      const period = getPeriod();
      if (!period) return;
      if (String(period.id) !== requestedPeriod) {
        fetchMarks(period);
      }
      if (typeof examEntryFor !== 'function' || typeof examStatusFor !== 'function' || typeof examDays === 'undefined' || typeof EXAM_CLASSES === 'undefined') return;
      const rows = host.querySelectorAll('table tbody tr');
      rows.forEach((tr, rowIdx) => {
        const cls = EXAM_CLASSES[rowIdx];
        if (!cls) return;
        examDays.forEach((day, dayIdx) => {
          const cell = tr.cells[dayIdx + 1];
          if (!cell) return;
          const entries = typeof window.examEntriesFor === 'function'
            ? window.examEntriesFor(day.id, cls) : [examEntryFor(day.id, cls)].filter(Boolean);
          const old = cell.querySelector('.sa-marks-progress');
          const eligible = entries.filter(e => e.question_required && e.activity_title);
          if (!eligible.length) { if (old) old.remove(); return; }
          const lines = eligible.map(entry => {
            const combined = /[\/\+&,]/.test(String(entry.activity_title || ''));
            const record = combined ? null : records.get(keyFor(entry.class_name, entry.activity_title));
            let label, style='';
            if(errorMessage) {label='Unavailable';style='unavailable';}
            else if(requestedPeriod !== String(period.id)) label='Loading...';
            else if(combined) {label='Manual Tracking';style='none';}
            else if(!record) {label='No Marks File';style='none';}
            else if(record.admin_accepted) {label='Admin Accepted ✓';style='accepted';}
            else {label=labels[record.status]||record.status||'Unknown';if(String(record.status).startsWith('returned'))style='returned';}
            return {title:String(entry.activity_title),label,style};
          });
          const target = old || document.createElement('div');
          const label = lines.map(l=>l.title+': '+l.label).join(' | ');
          if(target.textContent!==label)target.textContent=label;
          target.className='sa-marks-progress'+(lines.some(l=>l.style==='returned')?' returned':lines.every(l=>l.style==='accepted')?' accepted':'');
          if(!old)cell.appendChild(target);
        });
      });
    } finally { applying = false; }
  }
  // This observes only the already-rendered table. It never wraps or replaces the
  // original Exam/Question logic, including its delayed 1.2-second re-installation.
  let queued = false;
  const observer = new MutationObserver(() => {
    if (applying || queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; decorate(); });
  });
  observer.observe(host, { childList: true, subtree: true });
  decorate();
  window.saMarksProgressRefresh = function () {
    const period = getPeriod();
    if (period) fetchMarks(period);
    else decorate();
  };
})();
