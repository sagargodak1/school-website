/* St Augustine Result Management — Stage 1: isolated, admin-only template designer.
 * NO Supabase calls. NO reads/writes to marks, attendance, student records or published results.
 * Browser-local template drafts only; export JSON to preserve/reuse across devices.
 */
(()=>{'use strict';
const LEGACY_TEMPLATE_KEY='sa-result-template-draft-v3', W=718,H=1019;
let activeTemplateGroup='lower';
const templateStorageKey=()=> 'sa-result-template-group-v1-'+activeTemplateGroup;
const groupOfClass=v=>{const n=String(v||'').toLowerCase().trim();const m=n.match(/(?:class|grade)?\s*(\d+)/);return m&&Number(m[1])>=6?'upper':'lower'};
const sample={StudentName:'SAMPLE STUDENT',ClassName:'8',RollNo:'05',AcademicYear:'2083',TermName:'Second Term',IEMIS_ID:'123456789',SymbolNo:'2083-005',DOB:'2070-02-15',GPA:'3.42',OpeningDays:'57',PresentDays:'54',AttendancePercentage:'94.74%',TeacherName:'SAMPLE CLASS TEACHER',PublishedBS:'2083-07-15'};
const fields=Object.keys(sample);
const wmDefaults=()=>({enabled:false,text:'ST. AUGUSTINE ACADEMIC FOUNDATION',size:10,color:'#9a9a9a',opacity:0.22,angle:0,spacing:8});
const preview={...sample}; // Test-only values. Real class-teacher/publication data will be supplied by Result Processing.

const subjects=[{name:'ENGLISH',inCH:'2.0',thCH:'2.0',inGP:'3.60',thGP:'3.20',inGrade:'A',thGrade:'B+',final:'A'},{name:'NEPALI',inCH:'2.0',thCH:'2.0',inGP:'3.20',thGP:'3.60',inGrade:'B+',thGrade:'A',final:'A'},{name:'MATHEMATICS',inCH:'2.0',thCH:'3.0',inGP:'4.00',thGP:'3.60',inGrade:'A+',thGrade:'A',final:'A'},{name:'SCIENCE',inCH:'1.0',thCH:'3.0',inGP:'3.20',thGP:'3.60',inGrade:'B+',thGrade:'A',final:'A'},{name:'SOCIAL STUDIES',inCH:'1.0',thCH:'3.0',inGP:'3.60',thGP:'3.20',inGrade:'A',thGrade:'B+',final:'A'}];
let doc, selected='', root, drag=null, history=[], historyAt=-1;
function checkpoint(){history=history.slice(0,historyAt+1);history.push(JSON.stringify(doc));if(history.length>35)history.shift();historyAt=history.length-1;}
function restoreHistory(i){if(i<0||i>=history.length)return;historyAt=i;doc=JSON.parse(history[i]);selected='';render();updateWatermarkControls();}
const $=s=>document.querySelector(s), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const obj=(id,type,text,x,y,w,h,size=12,opt={})=>({id,type,text,x,y,w,h,size,bold:false,color:'#203047',align:'left',...opt});
const defaults=()=>({version:1,paper:'A4',watermark:wmDefaults(),objects:[
obj('school','text','ST. AUGUSTINE ACADEMIC FOUNDATION',42,38,634,32,20,{bold:true,align:'center',color:'#174c83'}),
obj('address','text','Suryodaya Municipality-11, Ilam, Nepal',90,79,538,21,12,{align:'center'}),
obj('exam','text','SECOND TERMINAL EXAMINATION — 2083',90,115,538,23,13,{bold:true,align:'center'}),
obj('title','text','GRADE SHEET',190,151,340,33,19,{bold:true,align:'center'}),
obj('secured','text','THE GRADE(S) SECURED BY:',45,180,330,20,11,{bold:true}),
obj('studentlabel','text','Student Name:',45,203,140,23,12,{bold:true}),obj('student','field','StudentName',180,203,420,23,12),
obj('classlabel','text','Class:',45,233,120,23,12,{bold:true}),obj('class','field','ClassName',180,233,120,23,12),
obj('rolllabel','text','Roll No.:',366,233,100,23,12,{bold:true}),obj('roll','field','RollNo',475,233,140,23,12),
obj('iemislabel','text','IEMIS:',45,263,120,23,12,{bold:true}),obj('iemis','field','IEMIS_ID',180,263,160,23,12),
obj('symbollabel','text','Symbol No.:',366,263,100,23,12,{bold:true}),obj('symbol','field','SymbolNo',475,263,170,23,12),
obj('subjects','table','Subject Marks Table',45,310,629,322,11,{rowHeight:22,subjectWidth:38}),

obj('attendance','attendance','TOTAL SCHOOL OPENING DAYS|TOTAL PRESENT DAYS|PRESENT PERCENTAGE',46,668,626,75,12),
obj('legend','legend','A+ Outstanding\nA Excellent\nB+ Very Good\nB Good|C+ Satisfactory\nC Acceptable\nD Basic\nNG Not Graded',46,753,626,76,11),
obj('notes','paragraph','NOTE: ONE CREDIT HOUR EQUALS TO 32 WORKING HOURS.\nINTERNAL (IN): PARTICIPATION, PRACTICAL/PROJECT WORK AND TERMINAL.\nTHEORY (TH): FINAL WRITTEN EXAMINATION.\nABS: ABSENT                                    NG: NOT GRADED',48,842,620,48,9),
obj('preparedlabel','text','Prepared By:',48,899,155,24,12,{bold:true}),
obj('teacher','field','TeacherName',48,927,260,27,12,{bold:true}),
obj('datelabel','text','Date of Issue:',414,899,224,24,12,{bold:true}),
obj('date','field','PublishedBS',414,927,218,27,12)]});
const validColor=s=>/^#[\da-f]{6}$/i.test(s)?s:'#203047';
function valid(d){return d&&d.version===1&&Array.isArray(d.objects)&&d.objects.length<=150&&d.objects.every(o=>o&&typeof o.id==='string'&&o.id.length<120&&['text','field','table','box','line','logo','legend','paragraph','attendance'].includes(o.type)&&String(o.text??'').length<2000&&['x','y','w','h','size'].every(k=>Number.isFinite(Number(o[k]))));}
function upgradeFooter(d){ // Upgrade only unmodified legacy signature placeholders; retain user's other objects.
 const teacher=d.objects.find(o=>o.id==='teacher');
 const principal=d.objects.find(o=>o.id==='principal');
 const date=d.objects.find(o=>o.id==='date');
 const oldTeacher=teacher&&teacher.type==='text'&&/CLASS TEACHER/i.test(teacher.text)&&/_{3,}/.test(teacher.text);
 const oldPrincipal=principal&&principal.type==='text'&&/PRINCIPAL/i.test(principal.text)&&/_{3,}/.test(principal.text);
 if(oldTeacher){Object.assign(teacher,{type:'field',text:'TeacherName',x:48,y:927,w:260,h:27,size:12,align:'left'});}
 if(oldPrincipal){d.objects=d.objects.filter(o=>o!==principal);}
 if(date&&date.type==='field'&&date.text==='PublishedBS'){Object.assign(date,{x:414,y:927,w:218,h:27,align:'left'});}
 if((oldTeacher||oldPrincipal)&&!d.objects.some(o=>o.id==='preparedlabel'))d.objects.push(obj('preparedlabel','text','Prepared By:',48,899,155,24,12,{bold:true}));
 if((oldTeacher||oldPrincipal)&&!d.objects.some(o=>o.id==='datelabel'))d.objects.push(obj('datelabel','text','Date of Issue:',414,899,224,24,12,{bold:true}));
 return d;
}
function load(){try{const data=JSON.parse((localStorage.getItem(templateStorageKey())||(activeTemplateGroup==='lower'?localStorage.getItem(LEGACY_TEMPLATE_KEY):null))||'null');const d=valid(data)?upgradeFooter(data):defaults();d.watermark={...wmDefaults(),...(d.watermark||{})};return d}catch{return defaults()}}
const markup=`<div id="saResultOverlay" class="sard-overlay" role="dialog" aria-modal="true" aria-label="Grade Sheet Designer"><div class="sard-shell"><header class="sard-top"><div><strong>ST. AUGUSTINE · RESULT MANAGEMENT</strong><small>Grade Sheet Designer — Stage 11 — Live Grade Preview (no writes)</small></div><div class="sard-buttons"><button id="sardSave">Save Draft</button><button id="sardExport">Export Template</button><button id="sardImport">Import Template</button><input id="sardUpload" type="file" accept="application/json,.json" hidden><button id="sardLiveMarks" type="button">Second Term · Live Marks (Read Only)</button><button id="sardPrint">Print Sample</button><button id="sardClose" class="sard-primary">Close</button></div></header><div class="sard-body"><aside class="sard-tools"><h3>Add Objects</h3><button data-add="text">+ Text</button><button id="sardGradeHeading">+ THE GRADE(S) SECURED BY:</button><button data-add="field">+ Data Field</button><button data-add="box">+ Border Box</button><button data-add="table">+ Marks Table</button><button data-add="attendance">+ Attendance Table</button><button data-add="legend">+ Grade Legend</button><button data-add="paragraph">+ Paragraph</button><button data-add="line">+ Line</button><button id="sardLogo">+ School Logo</button><input id="sardLogoUpload" type="file" accept="image/png,image/jpeg,image/webp" hidden><button id="sardDuplicate">Duplicate Selected</button><button id="sardUndo">Undo</button><button id="sardRedo">Redo</button><p>Drag to move; drag the blue corner to resize. Select an item to change all its properties.</p><h3>Sample Preview (not live school data)</h3><label>Class <input id="sardPreviewClass" value="8"></label><label>Class Teacher Name <input id="sardPreviewTeacher" value="SAMPLE CLASS TEACHER"></label><label>Published Date (B.S.) <input id="sardPreviewDate" value="2083-07-15"></label><p>These are only sample preview values. Actual class teacher and published date must come from approved class settings and Result Publishing when integrated.</p><h3>Background Watermark</h3><button id="sardWmPreset" type="button">Apply Reference Watermark Style</button><label class="sard-inline"><input type="checkbox" data-wm="enabled"> Watermark on Full Page</label><label>Watermark Text<textarea rows="2" data-wm="text"></textarea></label><div class="sard-grid"><label>Text Size (px)<input type="number" min="8" max="60" data-wm="size"></label><label>Text Colour<input type="color" data-wm="color"></label><label>Opacity %<input type="number" min="1" max="70" data-wm="opacity"></label><label>Angle (degrees)<input type="number" min="-90" max="90" data-wm="angle"></label><label>Row Gap (px)<input type="number" min="0" max="100" data-wm="spacing"></label></div><p>For watermark inside a box only: select that Border Box and enable Box Watermark in Selected Object.</p><h3>Selected Object</h3><div id="sardEditor"><p>Select an object on the page.</p></div><div class="sard-note">Only sample grades are shown here. No student marks are edited, imported, calculated or published in this stage.</div><button id="sardReset">Restore Default Design</button></aside><main class="sard-preview"><div class="sard-sheet-wrap"><div id="sardPaper" class="sard-paper" aria-label="A4 sample grade sheet"></div></div></main></div></div></div>`;
function tableHTML(o){const height=Math.max(16,Math.min(55,Number(o.rowHeight)||22)),subjectWidth=Math.max(20,Math.min(58,Number(o.subjectWidth)||38));return `<table class="sard-table" style="--sard-row:${height}px"><colgroup><col style="width:6%"><col style="width:${subjectWidth}%"><col style="width:${(94-subjectWidth)*.23}%"><col style="width:${(94-subjectWidth)*.23}%"><col style="width:${(94-subjectWidth)*.24}%"><col style="width:${(94-subjectWidth)*.30}%"></colgroup><thead><tr><th>S.N.</th><th>SUBJECT</th><th>CREDIT HOUR</th><th>GRADE POINT</th><th>GRADE</th><th>FINAL GRADE</th></tr></thead><tbody>${subjects.map((s,i)=>`<tr><td rowspan="2">${i+1}</td><td class="sard-subject-name">${esc(s.name)} (IN)</td><td>${esc(s.inCH)}</td><td>${esc(s.inGP)}</td><td>${esc(s.inGrade)}</td><td rowspan="2"><b>${esc(s.final)}</b></td></tr><tr><td class="sard-subject-name">${esc(s.name)} (TH)</td><td>${esc(s.thCH)}</td><td>${esc(s.thGP)}</td><td>${esc(s.thGrade)}</td></tr>`).join('')}<tr class="sard-gpa-row"><td colspan="5"><strong>GRADE POINT AVERAGE (GPA)</strong></td><td><strong>${esc(preview.GPA)}</strong></td></tr></tbody></table>`}
function attendanceHTML(o){const titles=String(o.text||'TOTAL SCHOOL OPENING DAYS|TOTAL PRESENT DAYS|PRESENT PERCENTAGE').split('|');return `<div class="sard-attendance">${[preview.OpeningDays,preview.PresentDays,preview.AttendancePercentage].map((v,i)=>`<div><span>${esc(titles[i]||'')}</span><strong>${esc(v)}</strong></div>`).join('')}</div>`}
function legendHTML(o){const fallback='A+ Outstanding\nA Excellent\nB+ Very Good\nB Good|C+ Satisfactory\nC Acceptable\nD Basic\nNG Not Graded';const groups=String(o.text||'').trim()?String(o.text).split('|'):fallback.split('|');return `<div class="sard-legend">${[0,1].map(i=>`<span>${esc(groups[i]||'').replace(/\n/g,'<br>')}</span>`).join('')}</div>`}

function watermarkSVG(cfg,width,height){
 if(!cfg?.enabled||!String(cfg.text||'').trim())return null;
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('width','100%');svg.setAttribute('height','100%');svg.setAttribute('preserveAspectRatio','none');svg.classList.add('sard-watermark-svg');
 // A seamless row-by-row repeat, as in the user's sample grade sheet.
 // Compute a tile wide enough for the complete label so SVG never crops its letters.
 const fontSize=Math.max(8,Math.min(60,Number(cfg.size)||10));
 const gap=Math.max(0,Math.min(100,Number(cfg.spacing)??8));
 const angle=Math.max(-90,Math.min(90,Number(cfg.angle)||0));
 const opacity=Math.max(.01,Math.min(.7,Number(cfg.opacity)||.22));
 const caption=String(cfg.text).replace(/\s+/g,' ').trim().slice(0,180);
 const canvas=document.createElement('canvas');const context=canvas.getContext('2d');
 let measured=caption.length*fontSize*.56;
 if(context){context.font=`${fontSize}px Arial`;measured=context.measureText(caption).width;}
 const tileW=Math.max(1,Math.ceil(measured+Math.max(6,fontSize*.65)));
 const tileH=Math.max(fontSize+3,Math.ceil(fontSize+gap));
 const defs=document.createElementNS(ns,'defs'),pattern=document.createElementNS(ns,'pattern');
 const id='sardWm'+Math.random().toString(36).slice(2);
 pattern.setAttribute('id',id);pattern.setAttribute('patternUnits','userSpaceOnUse');
 pattern.setAttribute('width',String(tileW));pattern.setAttribute('height',String(tileH));
 if(angle)pattern.setAttribute('patternTransform',`rotate(${angle})`);
 const label=document.createElementNS(ns,'text');
 label.setAttribute('x','0');label.setAttribute('y',String(fontSize+1));
 label.setAttribute('font-family','Arial,sans-serif');label.setAttribute('font-size',String(fontSize));
 label.setAttribute('fill',validColor(cfg.color||'#9a9a9a'));label.setAttribute('opacity',String(opacity));
 label.textContent=caption;pattern.appendChild(label);defs.appendChild(pattern);svg.appendChild(defs);
 const rect=document.createElementNS(ns,'rect');rect.setAttribute('width','100%');rect.setAttribute('height','100%');rect.setAttribute('fill',`url(#${id})`);svg.appendChild(rect);
 return svg;
}
function updateWatermarkControls(){const wm=doc.watermark||wmDefaults();root?.querySelectorAll('[data-wm]').forEach(input=>{const k=input.dataset.wm;input.type==='checkbox'?input.checked=!!wm[k]:input.value=k==='opacity'?Math.round(wm.opacity*100):(wm[k]??'')})}

function render(paperTarget){const paper=paperTarget||$('#saResultOverlay #sardPaper');if(!paper)return;paper.innerHTML='';const pageWM=watermarkSVG(doc.watermark,W,H);if(pageWM)paper.appendChild(pageWM);doc.objects.forEach(o=>{const el=document.createElement('div');el.className='sard-obj'+(o.id===selected?' sard-selected':'');el.dataset.id=o.id;Object.assign(el.style,{left:Math.max(0,Math.min(W-10,+o.x))+'px',top:Math.max(0,Math.min(H-10,+o.y))+'px',width:Math.max(10,Math.min(W,+o.w))+'px',height:Math.max(12,Math.min(H,+o.h))+'px',fontSize:Math.max(8,Math.min(40,+o.size))+'px',fontWeight:o.bold?'700':'400',fontFamily:['Arial','Calibri','Georgia','Verdana','Times New Roman'].includes(o.font)?o.font:'Arial',fontStyle:o.italic?'italic':'normal',textDecoration:o.underline?'underline':'none',background:o.transparent===false?validColor(o.bg||'#ffffff'):'transparent',color:validColor(o.color),textAlign:['center','right'].includes(o.align)?o.align:'left'});
if(o.type==='table')el.innerHTML=tableHTML(o);else if(o.type==='attendance')el.innerHTML=attendanceHTML(o);else if(o.type==='box'){el.style.border=(Math.max(1,Math.min(8,o.borderWidth||2)))+'px solid '+validColor(o.color);if(o.boxWatermark){const layer=watermarkSVG({...doc.watermark,enabled:true},Math.max(10,+o.w),Math.max(10,+o.h));if(layer)el.appendChild(layer)}}else if(o.type==='line'){el.style.borderTop=(Math.max(1,Math.min(8,o.borderWidth||2)))+'px solid '+validColor(o.color)}else if(o.type==='logo'){if(/^data:image\/(png|jpeg|webp);base64,/.test(o.src||'')){const im=document.createElement('img');im.src=o.src;im.style.cssText='width:100%;height:100%;object-fit:contain;pointer-events:none';el.appendChild(im)}}else if(o.type==='legend')el.innerHTML=legendHTML(o);else{el.textContent=o.type==='field'?(preview[o.text]??`[${o.text}]`):o.text}if(o.id===selected){const h=document.createElement('span');h.className='sard-handle';el.appendChild(h)}paper.appendChild(el)});if(!paperTarget)editor()}
function editor(){const host=$('#sardEditor');if(!host)return;const o=doc.objects.find(x=>x.id===selected);if(!o){host.innerHTML='<p>Select an object on the page.</p>';return}host.innerHTML=`<label>${o.type==='field'?'Linked Data Field':'Text'}${o.type==='field'?`<select data-prop="text">${fields.map(v=>`<option value="${esc(v)}" ${o.text===v?'selected':''}>${esc(v)}</option>`).join('')}</select>`:['text','paragraph','attendance','legend','table'].includes(o.type)?`<textarea data-prop="text" rows="${o.type==='legend'?7:3}">${esc(o.text)}</textarea>`:`<input value="${esc(o.text)}" disabled>`}</label><div class="sard-grid">${[['x','X'],['y','Y'],['w','Width'],['h','Height'],['size','Font']].map(([k,label])=>`<label>${label}<input type="number" data-prop="${k}" value="${Number(o[k])}"></label>`).join('')}</div>${o.type==='table'?`<label>Subject Row Height (px)<input type="number" min="16" max="55" data-prop="rowHeight" value="${o.rowHeight||22}"></label><label>Subject Column Width (%)<input type="number" min="20" max="58" data-prop="subjectWidth" value="${o.subjectWidth||38}"></label>`:''}<label>Font Name<select data-prop="font">${['Arial','Calibri','Georgia','Times New Roman','Verdana','Tahoma','Trebuchet MS','Courier New'].map(x=>`<option ${o.font===x?'selected':''}>${x}</option>`).join('')}</select></label><label>Background Color<input data-prop="bg" type="color" value="${validColor(o.bg||'#ffffff')}"></label><label>Border Width<input data-prop="borderWidth" type="number" min="1" max="8" value="${o.borderWidth||2}"></label><label>Font Colour<input data-prop="color" type="color" value="${validColor(o.color)}"></label><label>Alignment<select data-prop="align">${['left','center','right'].map(x=>`<option ${o.align===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="sard-inline"><input data-prop="bold" type="checkbox" ${o.bold?'checked':''}> Bold</label><label class="sard-inline"><input data-prop="italic" type="checkbox" ${o.italic?'checked':''}> Italic</label><label class="sard-inline"><input data-prop="underline" type="checkbox" ${o.underline?'checked':''}> Underline</label><label class="sard-inline"><input data-prop="transparent" type="checkbox" ${o.transparent!==false?'checked':''}> Transparent Background</label>${o.type==='box'?`<label class="sard-inline"><input type="checkbox" data-prop="boxWatermark" ${o.boxWatermark?'checked':''}> Repeat Watermark Inside This Box</label>`:''}<button id="sardDelete">Delete Selected Object</button>`}
function mutate(e,live=false){const field=e.target.closest('[data-prop]');if(!field)return;const o=doc.objects.find(x=>x.id===selected);if(!o)return;const p=field.dataset.prop;o[p]=['bold','italic','underline','transparent','boxWatermark'].includes(p)?field.checked:['x','y','w','h','size','borderWidth','rowHeight','subjectWidth'].includes(p)?Math.round(Number(field.value)||0):field.value;if(live){const el=$('#sardPaper')?.querySelectorAll('.sard-obj');const current=el&&Array.from(el).find(x=>x.dataset.id===selected);if(current){if(p==='text'){if(o.type==='text'||o.type==='paragraph')current.textContent=o.text;else if(o.type==='legend')current.innerHTML=legendHTML(o);else if(o.type==='attendance')current.innerHTML=attendanceHTML(o)}else if(p==='color')current.style.color=validColor(o.color);else if(p==='font')current.style.fontFamily=o.font;else if(p==='size')current.style.fontSize=o.size+'px';}return}render()}
function download(){const blob=new Blob([JSON.stringify(doc,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='St_Augustine_Grade_Sheet_Template.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)}
function notify(s){const x=$('#sardNotice');if(x)x.textContent=s;else window.alert(s)}
function open(){const admin=$('#websiteAdminPanel');if(!admin||admin.style.display!=='block'){window.alert('Open Website Admin Control Center first.');return}if($('#saResultOverlay'))return;doc=load();selected='';history=[];historyAt=-1;checkpoint();document.body.insertAdjacentHTML('beforeend',markup);root=$('#saResultOverlay');
const grpBar=document.createElement('label');grpBar.style.cssText='display:inline-flex;align-items:center;gap:8px;font-weight:700;color:#163451;margin:8px';grpBar.innerHTML='Grade Sheet Design <select id="sardGroupSelector"><option value="lower">Nursery – Class 5</option><option value="upper">Class 6 – Class 10</option></select>';root.querySelector('.sard-top .sard-buttons').prepend(grpBar);const sel=grpBar.querySelector('select');sel.value=activeTemplateGroup;sel.onchange=()=>{if(!confirm('Switch Grade Sheet Design? Save current changes first.')){sel.value=activeTemplateGroup;return}activeTemplateGroup=sel.value;doc=load();selected='';checkpoint();render();updateWatermarkControls()};root.querySelector('#sardLiveMarks')?.addEventListener('click',openLiveSecondTermMarks);render();updateWatermarkControls();root.addEventListener('input',e=>{if(e.target.matches('[data-wm]')){const p=e.target.dataset.wm;doc.watermark[p]=p==='enabled'?e.target.checked:p==='opacity'?Math.max(.01,Math.min(.7,Number(e.target.value)/100)):['size','angle','spacing'].includes(p)?Number(e.target.value):e.target.value;render();return}const id=e.target.id;if(id==='sardPreviewClass'||id==='sardPreviewTeacher'||id==='sardPreviewDate'){preview[id==='sardPreviewClass'?'ClassName':id==='sardPreviewTeacher'?'TeacherName':'PublishedBS']=e.target.value;render();return}if(e.target.matches('[data-prop]')&&['text','color','font','size'].includes(e.target.dataset.prop))mutate(e,true)});root.addEventListener('change',e=>{if(e.target.matches('[data-wm]')){checkpoint();return}if(e.target.matches('[data-prop]')){mutate(e);checkpoint()}});
root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='sardClose'){root.remove();return}if(b.id==='sardSave'){try{localStorage.setItem(templateStorageKey(),JSON.stringify(doc));notify('Template saved in this browser. Export JSON for backup.')}catch{notify('Local storage unavailable; please Export Template.')}return}if(b.id==='sardExport'){download();return}if(b.id==='sardImport'){$('#sardUpload').click();return}if(b.id==='sardPrint'){window.print();return}if(b.id==='sardReset'){if(confirm('Restore the original sample layout? The current unsaved layout will be replaced.')){doc=defaults();selected='';render();updateWatermarkControls()}return}if(b.id==='sardUndo'){restoreHistory(historyAt-1);return}if(b.id==='sardRedo'){restoreHistory(historyAt+1);return}if(b.id==='sardLogo'){$('#sardLogoUpload').click();return}if(b.id==='sardWmPreset'){doc.watermark={...wmDefaults(),enabled:true,text:'St. Augustine Academic Foundation'};checkpoint();render();updateWatermarkControls();return}if(b.id==='sardGradeHeading'){const id='grade_heading_'+Date.now();doc.objects.push(obj(id,'text','THE GRADE(S) SECURED BY:',45,180,350,24,11,{bold:true}));selected=id;checkpoint();render();return}if(b.id==='sardDuplicate'){const o=doc.objects.find(x=>x.id===selected);if(o){const n={...o,id:'copy_'+Date.now(),x:o.x+15,y:o.y+15};doc.objects.push(n);selected=n.id;checkpoint();render()}return}if(b.id==='sardDelete'){doc.objects=doc.objects.filter(o=>o.id!==selected);selected='';checkpoint();render();return}if(b.dataset.add){const type=b.dataset.add;const id='item_'+Date.now()+'_'+doc.objects.length;doc.objects.push(obj(id,type,type==='field'?'StudentName':type==='text'?'New Text':type==='paragraph'?'Enter paragraph text':type==='legend'?'A+ Outstanding\nA Excellent\nB+ Very Good\nB Good|C+ Satisfactory\nC Acceptable\nD Basic\nNG Not Graded':type==='attendance'?'TOTAL SCHOOL OPENING DAYS|TOTAL PRESENT DAYS|PRESENT PERCENTAGE':'',65,370,type==='table'||type==='attendance'||type==='legend'?625:230,type==='table'?325:type==='attendance'?80:type==='legend'?80:type==='box'?100:42,12));if(type==='table'){doc.objects[doc.objects.length-1].rowHeight=22;doc.objects[doc.objects.length-1].subjectWidth=38}selected=id;checkpoint();render()}});
$('#sardUpload').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{if(f.size>180000)throw Error('File too large');const v=JSON.parse(await f.text());if(!valid(v))throw Error('Unsupported template format');doc=v;doc.watermark={...wmDefaults(),...(doc.watermark||{})};selected='';checkpoint();render();updateWatermarkControls();notify('Template imported. Save Draft to keep it on this browser.')}catch(err){notify('Cannot import: '+err.message)}e.target.value=''});
$('#sardLogoUpload').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{if(f.size>250000)throw Error('Logo should be under 250 KB');if(!['image/png','image/jpeg','image/webp'].includes(f.type))throw Error('Use PNG, JPG or WebP');const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(f)});const id='logo_'+Date.now();doc.objects.push({...obj(id,'logo','',55,40,85,85),src:data});selected=id;checkpoint();render()}catch(err){notify(err.message)}e.target.value=''});
$('#sardPaper').addEventListener('pointerdown',e=>{const el=e.target.closest('.sard-obj');if(!el)return;selected=el.dataset.id;const o=doc.objects.find(x=>x.id===selected);if(!o)return;drag={id:o.id,startX:e.clientX,startY:e.clientY,x:+o.x,y:+o.y,w:+o.w,h:+o.h,resize:!!e.target.closest('.sard-handle')};render()});
root.addEventListener('pointermove',e=>{if(!drag)return;const o=doc.objects.find(x=>x.id===drag.id);if(!o)return;const paper=$('#sardPaper'),scale=paper.getBoundingClientRect().width/W;const dx=(e.clientX-drag.startX)/scale,dy=(e.clientY-drag.startY)/scale;if(drag.resize){o.w=Math.max(15,Math.min(W-o.x,Math.round(drag.w+dx)));o.h=Math.max(8,Math.min(H-o.y,Math.round(drag.h+dy)))}else{o.x=Math.max(0,Math.min(W-10,Math.round(drag.x+dx)));o.y=Math.max(0,Math.min(H-10,Math.round(drag.y+dy)))}const el=paper.querySelector(`[data-id="${drag.id}"]`);if(el){el.style.left=o.x+'px';el.style.top=o.y+'px';el.style.width=o.w+'px';el.style.height=o.h+'px'}});
root.addEventListener('pointerup',()=>{if(drag){drag=null;checkpoint();render()}});root.addEventListener('pointercancel',()=>{drag=null;render()});
}

// Stage 10: class-dependent IN/TH mapping for read-only Result previews.
// Never changes original component names, marks or source bundles.
function sardComponentKind(name,lower){
 const n=String(name||'').toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
 if(lower){
  if(/\bexam(?:ination)?\b/.test(n))return 'TH';
  if(/\b(internal|evaluation|eval)\b/.test(n))return 'IN';
 }else{
  if(/\b(participation|project work|terminal)\b/.test(n))return 'IN';
  if(/\bexam(?:ination)?\b/.test(n))return 'TH';
 }
 return 'CHECK';
}
function sardIsLowerClass(className){
 // Existing school classes may be stored as Nursery, LKG, UKG, Class 1,
 // Grade-8, 8, or their Nepali equivalents. Never infer from student ID.
 const raw=String(className??'').trim();
 const n=raw.toLowerCase().replace(/[.\-_]+/g,' ').replace(/\s+/g,' ').trim();
 if(!n)return null;
 // Pre-primary has the same internal/evaluation + exam mapping as classes 1–5.
 if(/^(?:nursery|nur|nursary|lkg|lower\s*(?:kg|kindergarten)|ukg|upper\s*(?:kg|kindergarten)|kg|kindergarten|pre\s*primary|pre\s*school|play\s*group|playgroup|बालविकास|नर्सरी|एलकेजी|युकेजी)$/.test(n))return true;
 const match=n.match(/^(?:(?:class|grade|std|standard|कक्षा)\s*)?(1[0]|[1-9])(?:\s*(?:class|grade))?$/)
   || n.match(/^(?:class|grade|std|standard|कक्षा)\s*(1[0]|[1-9])(?:\s|$)/);
 if(!match)return null;
 const number=Number(match[1]);
 return number>=1&&number<=10?number<=5:null;
}
function sardMappedResult(entries,lower,escapeHtml){
 const bySubject=new Map();
 for(const row of entries){
  if(!bySubject.has(row.subject))bySubject.set(row.subject,{IN:[],TH:[],CHECK:[]});
  bySubject.get(row.subject)[sardComponentKind(row.component,lower)].push(row);
 }
 const summarize=(items)=>{
  if(!items.length)return {value:'—',full:'—',note:'Not found'};
  const missing=items.some(r=>r.marks==='—'||r.marks==null||r.marks==='');
  const absent=items.some(r=>r.marks==='ABS');
  const bad=items.some(r=>!Number.isFinite(Number(r.full))||(r.marks!=='ABS'&&r.marks!=='—'&&!Number.isFinite(Number(r.marks))));
  const full=items.reduce((a,r)=>a+Number(r.full||0),0);
  return {value:absent?'ABS':missing||bad?'Pending':String(Number(items.reduce((a,r)=>a+Number(r.marks||0),0).toFixed(2))),full:String(full),note:items.map(r=>r.component).join(' + ')};
 };
 let incomplete=false;
 const rows=[...bySubject].map(([subject,parts])=>{
  const inRow=summarize(parts.IN),thRow=summarize(parts.TH);
  if(parts.CHECK.length||inRow.value==='—'||thRow.value==='—'||['Pending','ABS'].includes(inRow.value)||['Pending','ABS'].includes(thRow.value))incomplete=true;
  return `<tr><td>${escapeHtml(subject)}</td><td>${escapeHtml(inRow.value)} / ${escapeHtml(inRow.full)}</td><td>${escapeHtml(thRow.value)} / ${escapeHtml(thRow.full)}</td><td>${escapeHtml(parts.CHECK.map(r=>r.component).join(', ')||'—')}</td></tr>`;
 });
 return `<h4>Result component mapping — ${lower?'Nursery–5':'Class 6–10'} (preview only)</h4><div class="sard-live-table"><table><thead><tr><th>Subject</th><th>IN (Marks / Full)</th><th>TH (Marks / Full)</th><th>Unmapped — Check</th></tr></thead><tbody>${rows.join('')}</tbody></table></div><p>${incomplete?'Some components are missing, absent or unrecognized. Verify before grade calculation.':'IN/TH mapping complete for the submitted components shown.'} Original marks are unchanged. <strong>Grade/GPA and publication remain disabled.</strong></p>`;
}
// Stage 11: Result Studio V2 grade rules, preview-only. CH values are never guessed.
const sardGradeBands=[[90,'A+',4],[80,'A',3.6],[70,'B+',3.2],[60,'B',2.8],[50,'C+',2.4],[40,'C',2],[35,'D',1.6]];
const sardFinalBands=[[3.7,'A+'],[3.3,'A'],[2.9,'B+'],[2.5,'B'],[2.1,'C+'],[1.7,'C'],[1.6,'D'],[0,'NG']];
function sardGradePart(rows,pass){
 if(!rows.length)return {grade:'—',gp:null,status:'Missing component'};
 if(rows.some(r=>String(r.marks).trim().toUpperCase()==='ABS'))return {grade:'NG',gp:null,status:'ABS'};
 const fulls=rows.map(r=>Number(r.full)),marks=rows.map(r=>Number(r.marks));
 if(rows.some(r=>r.marks==='—'||r.marks==null||r.marks==='')||fulls.some(x=>!Number.isFinite(x)||x<=0)||marks.some((x,i)=>!Number.isFinite(x)||x<0||x>fulls[i]))return {grade:'—',gp:null,status:'Check component marks/full marks'};
 const fm=fulls.reduce((a,b)=>a+b,0),score=marks.reduce((a,b)=>a+b,0),pct=score/fm*100;
 if(pct+1e-9<pass)return {grade:'NG',gp:null,status:`${score} / ${fm} (${pct.toFixed(2)}%)`};
 const band=sardGradeBands.find(b=>pct+1e-9>=b[0]);return {grade:band?.[1]||'NG',gp:band?.[2]??null,status:`${score} / ${fm} (${pct.toFixed(2)}%)`};
}
function sardBuildGradeRows(entries,lower){
 const by=new Map();
 for(const r of entries){const k=String(r.subject||'').trim();if(!by.has(k))by.set(k,{IN:[],TH:[],CHECK:[]});by.get(k)[sardComponentKind(r.component,lower)].push(r)}
 return [...by].map(([subject,parts])=>({subject,parts,IN:sardGradePart(parts.IN,40),TH:sardGradePart(parts.TH,35)}));
}
function sardGradePreviewHTML(entries,lower,esc){
 if(lower===null)return '<p>Class not identified; grade calculation is paused.</p>';
 const rows=sardBuildGradeRows(entries,lower);
 return `<h4>Result Studio V2 · Grade & GPA Preview (read only)</h4><p>IN pass ≥40%, TH pass ≥35%. Fill each subject's IN/TH Credit Hours below to preview a weighted GPA. Credit Hours are <strong>not</strong> taken from guesses and are not saved.</p><div class="sard-live-table"><table id="sardGradeTable"><thead><tr><th>Subject</th><th>IN Grade / GP</th><th>TH Grade / GP</th><th>IN CH</th><th>TH CH</th><th>Final Grade</th></tr></thead><tbody>${rows.map((r,i)=>`<tr data-grade-index="${i}"><td>${esc(r.subject)}${r.parts.CHECK.length?'<br><small>Unmapped components: '+esc(r.parts.CHECK.map(x=>x.component).join(', '))+'</small>':''}</td><td>${esc(r.IN.grade)} / ${r.IN.gp??'—'}<br><small>${esc(r.IN.status)}</small></td><td>${esc(r.TH.grade)} / ${r.TH.gp??'—'}<br><small>${esc(r.TH.status)}</small></td><td><input data-ch="in" type="number" min="0" step="0.25" style="width:65px" aria-label="IN credit hours for ${esc(r.subject)}"></td><td><input data-ch="th" type="number" min="0" step="0.25" style="width:65px" aria-label="TH credit hours for ${esc(r.subject)}"></td><td data-final>—</td></tr>`).join('')}</tbody></table></div><p id="sardGradeOverall">GPA: — (Enter verified credit hours)</p><p>Preview only; no attendance, correction, save or publish. Original marks remain untouched.</p>`;
}
function sardUpdateGradePreview(container,entries,lower){
 const table=container.querySelector('#sardGradeTable');if(!table)return;
 const rows=sardBuildGradeRows(entries,lower);let sum=0,totalCH=0,incomplete=false,ng=false;
 for(const [i,r] of rows.entries()){
  const tr=table.querySelector(`[data-grade-index="${i}"]`);if(!tr)continue;
  const inText=tr.querySelector('[data-ch="in"]').value, thText=tr.querySelector('[data-ch="th"]').value;
  const inCH=Number(inText),thCH=Number(thText),filled=inText.trim()!==''&&thText.trim()!=='';
  const valid=filled&&Number.isFinite(inCH)&&Number.isFinite(thCH)&&inCH>=0&&thCH>=0&&inCH+thCH>0;
  const bad=r.parts.CHECK.length||r.IN.grade==='—'||r.TH.grade==='—';
  if(bad||!valid){incomplete=true;tr.querySelector('[data-final]').textContent=bad?'CHECK':'Set CH';continue}
  if(r.IN.grade==='NG'||r.TH.grade==='NG'){ng=true;tr.querySelector('[data-final]').textContent='NG';continue}
  const weighted=(r.IN.gp*inCH+r.TH.gp*thCH)/(inCH+thCH);
  const letter=sardFinalBands.find(b=>weighted+1e-10>=b[0])?.[1]||'NG';
  tr.querySelector('[data-final]').textContent=`${letter} (weighted GP ${weighted.toFixed(2)})`;
  sum+=weighted*(inCH+thCH);totalCH+=inCH+thCH;
 }
 const label=container.querySelector('#sardGradeOverall');if(label)label.textContent=incomplete?'GPA: — (Missing components or verified credit hours)':ng?'GPA: 0.00 (NG in one or more subjects)':totalCH?`Preview GPA: ${(sum/totalCH+1e-10).toFixed(2)} — based on manually supplied CH, not published`:'GPA: —';
}
// Stage 9: Read-only inspection of the EXISTING submitted marks bundles.
// This does not write to Supabase, alter the designer, compute grades, or publish results.
async function openLiveSecondTermMarks(){
 const owner=document.getElementById('sardDashboard') || document.getElementById('saResultOverlay');
 if(!owner)return;
 let old=document.getElementById('sardLiveInspector');if(old)old.remove();
 const modal=document.createElement('div');modal.id='sardLiveInspector';modal.className='sard-live-mask';
 modal.innerHTML=`<section class="sard-live-card" role="dialog" aria-modal="true" aria-label="Second Term read-only marks"><header><strong>SECOND TERM · REAL MARKS INSPECTOR</strong><button type="button" id="sardLiveClose">✕ Close</button></header><p>Read only — records submitted to Admin only. These are original marks, not a calculated Grade Sheet. No database changes.</p><div id="sardLiveStatus">Connecting to existing Unified Marks Entry…</div><div class="sard-live-filters"><label>Class <select id="sardLiveClass" disabled><option>Loading...</option></select></label><label>Student <select id="sardLiveStudent" disabled><option>Select class first</option></select></label></div><div id="sardLiveBody"></div></section>`;
 owner.appendChild(modal);
 const q=s=>modal.querySelector(s),escLive=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 q('#sardLiveClose').addEventListener('click',()=>modal.remove());
 const normTerm=s=>String(s||'').toLowerCase().replace(/\b(terminal|term|examination|exam)\b/g,'').replace(/[^a-z0-9]/g,'').trim();
 let groups=[],current=null,entries=[];
 try{
  if(typeof umeAdminDb!=='function'||typeof umeRpc!=='function'||typeof umeCombinedState!=='function'||typeof umeEntryMap!=='function')throw Error('Unified Marks Entry functions were not loaded.');
  if(!(typeof studentAdminSession !== "undefined" && studentAdminSession?.access_token))throw Error('Admin session is required. Sign in to the Website Admin Control Center.');
  const rows=await umeRpc(umeAdminDb(),'ume_list_final_projects');
  const grouped=new Map();
  for(const p of rows||[]){
   if(p.status!=='submitted_to_admin'||normTerm(p.term_name)!=='second')continue;
   const key=[p.academic_session,p.class_name].join('|');
   if(!grouped.has(key))grouped.set(key,{session:p.academic_session,className:p.class_name,projects:[]});
   grouped.get(key).projects.push(p);
  }
  groups=[...grouped.values()].sort((a,b)=>String(a.className).localeCompare(String(b.className),undefined,{numeric:true}));
  const classBox=q('#sardLiveClass');classBox.innerHTML='<option value="">Select class</option>'+groups.map((g,i)=>`<option value="${i}">${escLive(g.className)} · ${escLive(g.session)} (${g.projects.length} subjects)</option>`).join('');
  classBox.disabled=!groups.length;
  q('#sardLiveStatus').textContent=groups.length?`${groups.length} submitted Second Term class package(s) found. Choose a class.`:'No submitted Second Term subject bundles were found. This does not mean other statuses are empty.';
  classBox.addEventListener('change',async()=>{
   const ix=classBox.value;q('#sardLiveBody').textContent='';q('#sardLiveStudent').disabled=true;
   if(ix==='')return;
   const group=groups[Number(ix)];q('#sardLiveStatus').textContent='Loading original subject bundles…';
   try{
    const bundles=await Promise.all(group.projects.map(async p=>{const b=await umeRpc(umeAdminDb(),'ume_get_project_bundle',{p_project_id:Number(p.id)});if(b?.project?.status!=='submitted_to_admin')throw Error('A subject status changed. Refresh and retry.');return b}));
    current={group,bundles};
    const state=umeCombinedState(bundles);
    const sb=q('#sardLiveStudent');sb.innerHTML='<option value="">Select student</option>'+state.students.map((s,i)=>`<option value="${i}">${escLive(s.student_name||s.name)} · ${escLive(s.student_id)}</option>`).join('');
    sb.disabled=!state.students.length;
    q('#sardLiveStatus').textContent=`${group.className} · ${group.session}: ${bundles.length} submitted subjects, ${state.students.length} students. Missing subjects may still be pending or returned.`;
    sb.onchange=()=>{
     const idx=sb.value; if(idx===''){q('#sardLiveBody').textContent='';return;}
     const student=state.students[Number(idx)];
     entries=state.bundles.flatMap(b=>{
       const map=umeEntryMap(b);
       return (b.components||[]).map(c=>{
         const ent=map.get(`${c.id}|${student.student_id}`);
         const absent=typeof umeEntryIsAbsent==='function'&&umeEntryIsAbsent(ent);
         return {subject:b.project.subject_name,component:c.component_name,full:c.full_marks,marks:absent?'ABS':(ent?.obtained_marks??'—')};
       });
     });
     const lower=sardIsLowerClass(group.className);
     const mapped=lower===null?'<p>Cannot determine Class 1–5 or 6–10 from the class name. Mapping paused.</p>':sardMappedResult(entries,lower,escLive);
     q('#sardLiveBody').innerHTML=`<h3>${escLive(student.student_name||student.name)} <small>(${escLive(student.student_id)})</small></h3>${mapped}${sardGradePreviewHTML(entries,lower,escLive)}<h4>Original submitted components (unchanged)</h4><div class="sard-live-table"><table><thead><tr><th>Subject</th><th>Original Component</th><th>Full Marks</th><th>Original Marks</th></tr></thead><tbody>${entries.map(r=>`<tr><td>${escLive(r.subject)}</td><td>${escLive(r.component)}</td><td>${escLive(r.full)}</td><td>${escLive(r.marks)}</td></tr>`).join('')}</tbody></table></div><p><strong>Attendance:</strong> Not yet connected. <strong>Grade/GPA:</strong> Preview only with verified Credit Hours. <strong>Publishing:</strong> Disabled for data safety.</p>`;
     q('#sardLiveBody').querySelector('#sardGradeTable')?.addEventListener('input',()=>sardUpdateGradePreview(q('#sardLiveBody'),entries,lower));
    };
   }catch(e){q('#sardLiveStatus').textContent='Could not load records: '+e.message;}
  });
 }catch(e){q('#sardLiveStatus').textContent='Could not open live marks: '+e.message;}
}

// Stage 12: class-wide CH setup and Result Studio-inspired admin dashboard.
// No database writes. Browser-local CH settings are keyed by session, term, class and subject.
const sardCHStorage='sa-result-ch-class-settings-v1';
const sardRegisterStore='sa-result-register-local-v1';
const sardSubjectPalette=['#eaf2ff','#e9f8ed','#fff2dc','#f5ecff','#e6f6f5','#fff0f2','#f1f3df','#e9f0f7','#fcecf8','#eef6df'];
function sardReadRegister(){try{const v=JSON.parse(localStorage.getItem(sardRegisterStore)||'{}');return v&&typeof v==='object'?v:{}}catch{return {}}}

const sardKey=(session,term,cls)=>[session,term,cls].map(v=>String(v||'').trim().toLowerCase()).join('||');
function sardReadCH(){try{const x=JSON.parse(localStorage.getItem(sardCHStorage)||'{}');return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}catch{return {}}}
function sardGradeForStudent(rows,credits,lower){
 const entries=sardBuildGradeRows(rows,lower);let earned=0,weight=0,ng=false,missing=false;
 const subjects=entries.map(r=>{
  const ch=credits[String(r.subject).trim().toLowerCase()];
  const a=ch?Number(ch.IN):NaN,b=ch?Number(ch.TH):NaN;
  if(r.parts.CHECK.length||r.IN.grade==='—'||r.TH.grade==='—'||!Number.isFinite(a)||!Number.isFinite(b)||a<0||b<0||a+b<=0){missing=true;return {subject:r.subject,final:'CHECK'}};
  if(r.IN.grade==='NG'||r.TH.grade==='NG'){ng=true;return {subject:r.subject,final:'NG'}};
  const gp=(r.IN.gp*a+r.TH.gp*b)/(a+b);
  earned+=gp*(a+b);weight+=a+b;
  return {subject:r.subject,final:sardFinalBands.find(x=>gp+1e-10>=x[0])?.[1]||'NG',gp};
 });
 return {subjects,status:missing?'CHECK':ng?'NG':weight?'READY':'CHECK',gpa:missing?null:ng?'0.00':weight?(earned/weight).toFixed(2):null};
}

function sardCopyFallback(text){const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove()}
function sardExportXlsx(rows,fileName){
 const enc=new TextEncoder(),xml=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
 const col=i=>{let n=i+1,s='';while(n){n--;s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26)}return s};
 const sheet='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>'+rows.map((r,i)=>'<row r="'+(i+1)+'">'+r.map((v,j)=>{const number=typeof v==='number'&&Number.isFinite(v);return '<c r="'+col(j)+(i+1)+'"'+(number?'':' t="inlineStr"')+'>'+(number?'<v>'+v+'</v>':'<is><t>'+xml(v)+'</t></is>')+'</c>'}).join('')+'</row>').join('')+'</sheetData></worksheet>';
 const files=[['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'],['_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],['xl/workbook.xml','<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Class Marks" sheetId="1" r:id="rId1"/></sheets></workbook>'],['xl/_rels/workbook.xml.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'],['xl/worksheets/sheet1.xml',sheet]];
 const crcTable=Array.from({length:256},(_,i)=>{let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0});
 const crc=a=>{let c=0xffffffff;for(const x of a)c=crcTable[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0};
 const u16=n=>[n&255,n>>>8&255],u32=n=>[n&255,n>>>8&255,n>>>16&255,n>>>24&255];let local=[],central=[],offset=0;
 for(const [name,body] of files){const n=enc.encode(name),d=enc.encode(body),checksum=crc(d),header=[...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(checksum),...u32(d.length),...u32(d.length),...u16(n.length),...u16(0),...n];local.push(new Uint8Array(header),d);central.push(...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(checksum),...u32(d.length),...u32(d.length),...u16(n.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...n);offset+=header.length+d.length}
 const cd=new Uint8Array(central),end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(cd.length),...u32(offset),...u16(0)]),blob=new Blob([...local,cd,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fileName;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)
}

const sardRenderGradeSheetPaper = render;
function sardOpenDashboard(){
 if(document.getElementById('sardDashboard'))return;
 const escd=esc;
 const dash=document.createElement('div');dash.id='sardDashboard';dash.className='sard-dashboard';
 dash.innerHTML=`<div class="sard-dash-app"><aside class="sard-dash-side"><div class="sard-dash-brand"><b>SA</b><span><strong>ST. AUGUSTINE</strong><small>RESULT MANAGEMENT</small></span></div><label>ACADEMIC YEAR<select id="sardDashYear"><option>Loading…</option></select></label><div class="sard-dash-menu"><button data-tab="dashboard" class="on">▦ &nbsp; Dashboard</button><button data-tab="subjects">▤ &nbsp; Subject Setup / CH</button><button data-tab="verification">✓ &nbsp; Marks & Grade Verification</button><button data-tab="register">▦ &nbsp; Class Marks Register</button><button data-tab="attendance">▤ &nbsp; Attendance</button><button data-tab="sheets">▤ &nbsp; Grade Sheets</button><button data-tab="students">▤ &nbsp; Student Details</button><button data-tab="publication">▣ &nbsp; Publish / Unpublish</button><button data-tab="portalPreview">◉ &nbsp; Published Result Access</button><button id="sardDashDesigner">▤ &nbsp; Grade Sheet Designer</button><button id="sardDashInspector">◫ &nbsp; Original Marks Inspector</button></div><p>Official publication · Supabase confirmation required</p></aside><main class="sard-dash-main"><div class="sard-dash-head"><div><small>ACADEMIC MANAGEMENT / RESULT DASHBOARD</small><h1 id="sardDashTitle">Dashboard</h1></div><button id="sardDashClose">✕ Close</button></div><div class="sard-dash-hero"><div><small>ST. AUGUSTINE · ACADEMIC YEAR <span id="sardDashHeroYear">—</span></small><h2>Every class. Every result.</h2><p>SECOND TERMINAL EXAMINATION</p></div><div class="sard-dash-filters"><label>Class<select id="sardDashClass"><option value="">Select Class</option></select></label><label>Term / Examination<select id="sardDashTerm"><option value="second">Second Terminal Examination</option></select></label><button id="sardDashRefresh">Refresh</button></div></div><div id="sardDashStatus">Loading existing submitted marks…</div><section id="sardDashContent"></section></main></div>`;
 document.body.appendChild(dash);
 const q=s=>dash.querySelector(s);
 let groups=[],state=null,bundles=[],attendance=null,attendanceError='',tab='dashboard',busy=0,classes=[];
 const normTerm=s=>String(s||'').toLowerCase().replace(/\b(terminal|term|examination|exam)\b/g,'').replace(/[^a-z0-9]/g,'').trim();
 const keyFor=()=>sardKey(q('#sardDashYear').value,'second',q('#sardDashClass').value);
 const groupFor=()=>groups.find(g=>String(g.session)===q('#sardDashYear').value&&g.className===q('#sardDashClass').value);
 const attendanceFor=(student)=>{
  const normalizeId=v=>String(v??'').trim().toUpperCase();
  const id=normalizeId(student.student_id);
  const rows=attendance?.entries||[];
  let matched=rows.filter(e=>normalizeId(e.student_id)===id);
  // A verified, unambiguous name match handles legacy Nursery roster IDs without
  // changing either the original attendance entry or the submitted marks.
  if(!matched.length){
    const normalizeName=v=>String(v??'').normalize('NFKC').trim().replace(/\s+/g,' ').toUpperCase();
    const name=normalizeName(student.student_name||student.name);
    if(name){
      const attendanceNames=new Map((attendance?.students||[]).map(s=>[normalizeId(s.student_id),normalizeName(s.student_name||s.name)]));
      const same=rows.filter(e=>normalizeName(e.student_name||e.name||attendanceNames.get(normalizeId(e.student_id)))===name);
      const rosterSame=(state?.students||[]).filter(s=>normalizeName(s.student_name||s.name)===name);
      if(same.length===1&&rosterSame.length===1)matched=same;
    }
  }
  const e=matched.length===1?matched[0]:null;
  const opening=attendance?.header?.total_opening_days;
  const present=e?.present_days;
  const days=Number(opening),att=Number(present);
  const valid=opening!==null&&opening!==undefined&&opening!==''&&present!==null&&present!==undefined&&present!==''&&Number.isFinite(days)&&days>0&&Number.isFinite(att)&&att>=0&&att<=days;
  return {opening:valid?days:null,present:valid?att:null,percentage:valid?(100*att/days).toFixed(2)+'%':null,status:valid?'READY':'MISSING'};
 };
   // Local draft fingerprint is captured only after Supabase confirms a publication.
   // It detects changes to browser-local settings; it does NOT certify that live source
   // marks/attendance are unchanged. Older publications remain UNVERIFIED, not CLEAN.
   const pubBaselineStore='sa-result-published-local-fingerprints-v1';
   const readPubBaselines=()=>{try{const o=JSON.parse(localStorage.getItem(pubBaselineStore)||'{}');return o&&typeof o==='object'?o:{}}catch{return {}}};
   const canonical=(value)=>JSON.stringify(value,(k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
   const fingerprintOf=(cl)=>{
     const key=sardKey(q('#sardDashYear').value,'second',cl),lower=groupOfClass(cl);
     const ch=sardReadCH()[key]||{},regs=sardReadRegister()[key]||{};
     const detail=readStudentDetails(),items=Object.fromEntries(Object.entries(detail).filter(([k])=>k.startsWith(key+'||')));
     const footer=(()=>{try{return JSON.parse(localStorage.getItem('sa-result-footer-v1::'+key)||'{}')}catch{return {invalid:true}}})();
     const tplRaw=localStorage.getItem('sa-result-template-group-v1-'+lower)||(lower==='lower'?localStorage.getItem(LEGACY_TEMPLATE_KEY):null);
     let tpl;try{tpl=tplRaw?JSON.parse(tplRaw):null}catch{tpl={invalid:true}};
     return canonical({ch,regs,items,footer,tpl});
   };
   // Store per-section checksums as well as the combined fingerprint. This is advisory
   // browser-local change tracking; it never claims live source marks/attendance are unchanged.
   const draftSections=(cl)=>{
     const key=sardKey(q('#sardDashYear').value,'second',cl),lower=groupOfClass(cl);
     const details=readStudentDetails();
     const tplRaw=localStorage.getItem('sa-result-template-group-v1-'+lower)||(lower==='lower'?localStorage.getItem(LEGACY_TEMPLATE_KEY):null);
     const footerRaw=localStorage.getItem('sa-result-footer-v1::'+key);
     const safeParse=(v)=>{try{return v?JSON.parse(v):null}catch{return {invalidJSON:true}}};
     return {
       'Grade Sheet Design':safeParse(tplRaw),
       'Subject / Credit Hours':sardReadCH()[key]||{},
       'Marks Corrections':sardReadRegister()[key]||{},
       'Student Details':Object.fromEntries(Object.entries(details).filter(([k])=>k.startsWith(key+'||'))),
       'Class Teacher / Date':safeParse(footerRaw)
     };
   };
   const draftSectionFingerprints=cl=>Object.fromEntries(Object.entries(draftSections(cl)).map(([name,val])=>[name,canonical(val)]));
   const markPublishedBaseline=(cl,revision)=>{const all=readPubBaselines(),key=sardKey(q('#sardDashYear').value,'second',cl);all[key]={revision:Number(revision),fingerprint:fingerprintOf(cl),sections:draftSectionFingerprints(cl)};localStorage.setItem(pubBaselineStore,JSON.stringify(all))};
   const isPublished=r=>!!r&&(r.is_published===true||r.isPublished===true);
   const draftStatus=(cl,record)=>{
     if(!record||!isPublished(record))return 'Not published';
     const baseline=readPubBaselines()[sardKey(q('#sardDashYear').value,'second',cl)];
     if(!baseline||Number(baseline.revision)!==Number(record.revision))return 'NOT VERIFIED — published earlier/elsewhere';
     if(baseline.fingerprint===fingerprintOf(cl))return 'NO LOCAL EDITS DETECTED — live marks/attendance not checked';
     if(!baseline.sections)return 'CHANGES NOT PUBLISHED — older tracking format (details unknown)';
     const now=draftSectionFingerprints(cl);
     const changed=Object.keys(now).filter(name=>now[name]!==baseline.sections[name]);
     return 'CHANGES NOT PUBLISHED — '+(changed.join(', ')||'local settings');
   };
 const publicationStore='sa-result-local-publication-v1';
 const readPublications=()=>{try{return JSON.parse(localStorage.getItem(publicationStore)||'{}')}catch{return {}}};
 const publicationKey=(cl)=>sardKey(q('#sardDashYear').value,'second',cl);
 const currentPublication=()=>readPublications()[publicationKey(q('#sardDashClass').value)];
 const studentDetailsStore='sa-result-student-details-v1';
 const readStudentDetails=()=>{try{return JSON.parse(localStorage.getItem(studentDetailsStore)||'{}')}catch{return {}}};
 const studentDetailsKey=st=>keyFor()+'||'+String(st.student_id);
 // Use actual roll when supplied. Older Unified Marks bundles display the
 // alphabetical roster position as Roll No; reproduce that same position.
 const studentRoll=st=>{
  const explicit=st.roll_no??st.roll_number??st.roll??st.rollNo;
  if(explicit!==undefined&&explicit!==null&&String(explicit).trim()!=='')return String(explicit);
  const index=(state?.students||[]).findIndex(s=>String(s.student_id)===String(st.student_id));
  return index>=0?String(index+1):'';
 };
 const studentDisplayDetails=st=>{
  const saved=readStudentDetails()[studentDetailsKey(st)]||{};
  const get=(key,base)=>Object.prototype.hasOwnProperty.call(saved,key)?saved[key]:base;
  return {roll:get('roll',studentRoll(st)),symbol:String(st.student_id??''),iemis:get('iemis',st.iemis_id??st.iemis??st.emis_id??st.emis??'')};
 };
 const footerKey=()=> 'sa-result-footer-v1::'+keyFor();
 const readFooter=()=>{try{return JSON.parse(localStorage.getItem(footerKey())||'{}')}catch{return {}}};
 function renderStudentPaper(st,paper){
  const result=results().find(r=>String(r.student.student_id)===String(st.student_id));
  if(!result||result.status==='CHECK')return 'Complete subject mapping, IN/TH CH and marks first.';
  const footer=readFooter();if(!footer.teacher||!footer.date)return 'Save Class Teacher Name and Date of Issue first.';
  const att=attendanceFor(st);if(att.status!=='READY')return 'Student attendance is missing.';
  const mapped=sardBuildGradeRows(entriesFor(st),sardIsLowerClass(q('#sardDashClass').value));
  const ch=sardReadCH()[keyFor()]||{},order=orderedSubjects();
  const converted=mapped.sort((a,b)=>order.indexOf(a.subject)-order.indexOf(b.subject)).map(r=>{
   const c=ch[r.subject.trim().toLowerCase()]||{};
   const final=result.subjects.find(x=>x.subject===r.subject);
   return {name:displaySubject(r.subject),inCH:c.IN??'—',thCH:c.TH??'—',inGP:r.IN.gp??'—',thGP:r.TH.gp??'—',inGrade:r.IN.grade,thGrade:r.TH.grade,final:final?.final||'CHECK'};
  });
  const oldPreview={...preview},oldSubjects=subjects.slice(),oldDoc=doc,oldSelected=selected;
  try{
   Object.assign(preview,{StudentName:st.student_name||st.name||'',ClassName:q('#sardDashClass').value,RollNo:studentDisplayDetails(st).roll||'—',AcademicYear:q('#sardDashYear').value,TermName:'Second Term',IEMIS_ID:studentDisplayDetails(st).iemis||'—',SymbolNo:studentDisplayDetails(st).symbol||'—',GPA:result.gpa||'—',OpeningDays:String(att.opening),PresentDays:String(att.present),AttendancePercentage:att.percentage,TeacherName:footer.teacher,PublishedBS:footer.date});
   subjects.splice(0,subjects.length,...converted);
   // Render using the template assigned to this student's class, never the
   // template that happened to be open last in the designer.
   const sheetGroup=groupOfClass(q('#sardDashClass').value);
   const stored=localStorage.getItem('sa-result-template-group-v1-'+sheetGroup)
     ||(sheetGroup==='lower'?localStorage.getItem(LEGACY_TEMPLATE_KEY):null);
   let sheetTemplate=null;
   if(stored){try{sheetTemplate=JSON.parse(stored)}catch{throw Error('The saved Grade Sheet template is not valid JSON.')}}
   doc=valid(sheetTemplate)?upgradeFooter(sheetTemplate):defaults();
   doc.watermark={...wmDefaults(),...(doc.watermark||{})};
   selected='';
   if(!Array.isArray(doc.objects)||!doc.objects.length)return 'Grade Sheet template is empty. Open Grade Sheet Designer and restore/save the layout.';
   sardRenderGradeSheetPaper(paper);
   // Never silently present an empty A4 page when a template or browser error occurs.
   if(!paper.querySelector('.sard-obj'))return 'Grade Sheet layout could not be drawn. Check the saved template.';
  }catch(error){
   console.error('St. Augustine grade sheet rendering:',error);
   return 'Grade Sheet rendering failed: '+String(error?.message||error);
  }finally{
   Object.assign(preview,oldPreview);subjects.splice(0,subjects.length,...oldSubjects);doc=oldDoc;selected=oldSelected;
  }
  return '';
 }
 function openStudentSheets(students){
  if(document.querySelector('#sardResultPrint'))return;
  const overlay=document.createElement('div');overlay.id='sardResultPrint';overlay.className='sard-result-print';
  overlay.innerHTML='<div class="sard-result-actions"><b>Student Grade Sheets</b><span id="sardSheetCount"></span><button type="button" id="sardSheetPrint">Print / Save as PDF</button><button type="button" id="sardSheetClose">Close</button></div><div class="sard-result-scroll" id="sardResultPages"></div>';
  document.body.appendChild(overlay);
  const pages=overlay.querySelector('#sardResultPages');let count=0,firstError='';
  for(const st of students){
   const page=document.createElement('section');page.className='sard-result-page';
   const paper=document.createElement('div');paper.className='sard-paper';page.appendChild(paper);
   const error=renderStudentPaper(st,paper);
   if(error){
    firstError=firstError||error;
    console.warn('Skipped grade sheet for student',st.student_id,error);
    if(students.length===1){
     overlay.querySelector('#sardSheetCount').textContent='Unable to display grade sheet';
     pages.innerHTML='';
     const message=document.createElement('div');message.className='sard-sheet-error';message.textContent=error;pages.appendChild(message);
     overlay.querySelector('#sardSheetPrint').disabled=true;
     overlay.querySelector('#sardSheetClose').onclick=()=>overlay.remove();
     return;
    }
    continue;
   }
   pages.appendChild(page);count++;
  }
  if(!count){
   overlay.querySelector('#sardSheetCount').textContent='Unable to display grade sheets';
   const message=document.createElement('div');message.className='sard-sheet-error';message.textContent=firstError||'No complete Grade Sheets to print.';pages.appendChild(message);
   overlay.querySelector('#sardSheetPrint').disabled=true;
   overlay.querySelector('#sardSheetClose').onclick=()=>overlay.remove();
   return;
  }
  overlay.querySelector('#sardSheetCount').textContent=count+' student(s)';
  overlay.querySelector('#sardSheetClose').onclick=()=>overlay.remove();
  overlay.querySelector('#sardSheetPrint').onclick=()=>window.print();
  if(count<students.length)alert(`${students.length-count} student(s) could not be included because marks, CH, attendance or class details are incomplete.`);
 }
 function showStudentSheet(st){openStudentSheets([st])}
 function showAllStudentSheets(){
  const all=results().filter(r=>r.status!=='CHECK'&&attendanceFor(r.student).status==='READY').map(r=>r.student);
  if(!all.length){alert('No complete student grade sheets found. Check marks, CH and attendance.');return}
  openStudentSheets(all);
 }
 const subjectsFor=()=>state?Array.from(new Set(state.bundles.map(b=>String(b.project.subject_name||'').trim()))).filter(Boolean):[];
 const subjectSettings=()=>sardReadRegister()[keyFor()]?.subjects||{};
 const orderedSubjects=()=>subjectsFor().sort((a,b)=>(Number(subjectSettings()[a.toLowerCase()]?.order)||999)-(Number(subjectSettings()[b.toLowerCase()]?.order)||999)||a.localeCompare(b));
 const displaySubject=s=>subjectSettings()[String(s).toLowerCase()]?.label||s;
 function entriesFor(student){const edits=sardReadRegister()[keyFor()]?.edits||{};return state.bundles.flatMap(b=>{const em=umeEntryMap(b);return (b.components||[]).map(c=>{const e=em.get(`${c.id}|${student.student_id}`), original=typeof umeEntryIsAbsent==='function'&&umeEntryIsAbsent(e)?'ABS':(e?.obtained_marks??'—');const id=[student.student_id,b.project.subject_name,c.id].join('||');return {subject:b.project.subject_name,component:c.component_name,componentId:c.id,full:c.full_marks,marks:Object.prototype.hasOwnProperty.call(edits,id)?edits[id].value:original,original}})})}
 function results(){const lower=sardIsLowerClass(q('#sardDashClass').value);const saved=sardReadCH()[keyFor()]||{};return (state?.students||[]).map(st=>({student:st,...sardGradeForStudent(entriesFor(st),saved,lower)}))}
 function render(){q('#sardDashTitle').textContent=tab==='subjects'?'Subject Setup / Credit Hours':tab==='verification'?'Marks & Grade Verification':tab==='register'?'Class Marks Register':tab==='attendance'?'Attendance':tab==='sheets'?'Grade Sheets':tab==='students'?'Student Details':tab==='publication'?'Publish / Unpublish':tab==='portalPreview'?'Published Result Access':'Dashboard';const host=q('#sardDashContent');
 const rs=results(),ready=rs.filter(r=>r.status==='READY').length,ng=rs.filter(r=>r.status==='NG').length,check=rs.filter(r=>r.status==='CHECK').length,ss=orderedSubjects(),ch=sardReadCH()[keyFor()]||{};
 if(tab==='portalPreview'){
  const saved=readPublications();
  const publications=Object.values(saved).filter(v=>v&&String(v.academicYear)===String(q('#sardDashYear').value)&&v.term==='second'&&Array.isArray(v.students));
  const order=publications.sort((a,b)=>String(a.className).localeCompare(String(b.className),undefined,{numeric:true}));
  host.innerHTML=`<div class="sard-dash-card"><h2>Published Result Access</h2><p>Local publication verification. No student or parent login is changed here.</p><div class="sard-dash-actions"><label>Access view <select id="sardPortalRole"><option value="principal">Principal — Published Classes</option><option value="staff">Class Teacher — Assigned Class</option><option value="parent">Parent — Own Student</option></select></label><label>Class <select id="sardPortalClass"></select></label><label>Student ID <input id="sardPortalStudent" placeholder="Student ID"></label><button id="sardPortalShow" class="primary">View Published Result</button></div><div id="sardPortalOutput"></div></div>`;
  const role=host.querySelector('#sardPortalRole'),classSelect=host.querySelector('#sardPortalClass'),studentInput=host.querySelector('#sardPortalStudent'),output=host.querySelector('#sardPortalOutput');
  classSelect.innerHTML='<option value="">Select Class</option>'+order.map(v=>`<option value="${escd(v.className)}">${escd(v.className)}</option>`).join('');
  const choose=()=>{const isParent=role.value==='parent';classSelect.parentElement.style.display=isParent?'none':'';studentInput.parentElement.style.display=isParent?'':'none';output.innerHTML=''};
  role.onchange=choose;choose();
  host.querySelector('#sardPortalShow').onclick=()=>{
   const isParent=role.value==='parent';let selected=order;
   if(isParent){const id=studentInput.value.trim().toUpperCase();if(!id){output.textContent='Enter a student ID.';return}selected=order.map(p=>({...p,students:p.students.filter(st=>String(st.id).trim().toUpperCase()===id)})).filter(p=>p.students.length===1);}
   else{selected=order.filter(p=>p.className===classSelect.value);if(!classSelect.value){output.textContent='Choose a published class.';return}}
   if(!selected.length){output.textContent='No published result found for this selection.';return}
   const rows=selected.flatMap(p=>p.students.map(st=>`<tr><td>${escd(p.className)}</td><td>${escd(st.name)}</td><td>${escd(st.id)}</td><td>${escd(st.status)}</td><td>${escd(st.gpa??'—')}</td><td>${escd(st.attendance?.present??'—')} / ${escd(st.attendance?.opening??'—')}</td></tr>`)).join('');
   output.innerHTML=`<div class="sard-dash-table"><table><thead><tr><th>Class</th><th>Name</th><th>Student ID</th><th>Result</th><th>GPA</th><th>Attendance</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  };
  return;
 }
 if(tab==='publication'){
   const published=readPublications(),year=q('#sardDashYear').value;
   let serverRows=null, serverError='', loadingStatus=true;
   const serverKey=v=>String(v??'').trim().toLowerCase();
   const serverMatch=cl=>(serverRows||[]).find(r=>serverKey(r.academic_year??r.academicYear)===serverKey(year)&&serverKey(r.term_key??r.term??'second')=== 'second'&&serverKey(r.class_name??r.className)===serverKey(cl));
   const redrawStatus=()=>{if(!host.isConnected||!host.querySelector('#sardPubLiveStatus'))return;for(const tr of host.querySelectorAll('tr[data-pub-class]')){try{const cl=tr.dataset.pubClass,record=serverMatch(cl),status=tr.querySelector('[data-server-status]');if(!status)continue;status.textContent=loadingStatus?'Checking Supabase…':serverError?'ERROR — status unknown':record?(isPublished(record)?'PUBLISHED':'UNPUBLISHED'):'UNPUBLISHED';const rev=tr.querySelector('[data-server-revision]');if(rev)rev.textContent=record?String(record.revision??'—'):'—';const ct=tr.querySelector('[data-server-students]');if(ct)ct.textContent=record?String(record.student_count??record.studentCount??'—'):'—';const local=!!published[publicationKey(cl)];const draft=tr.querySelector('[data-draft-status]');if(draft){
       if(serverError)draft.textContent='UNKNOWN — Supabase unavailable';
       else if(loadingStatus)draft.textContent='Checking…';
       else {try{draft.textContent=draftStatus(cl,record)}catch(e){draft.textContent='LOCAL CHECK ERROR — '+String(e?.message||e);console.error('Publication local change check:',cl,e)}}
     }const difference=tr.querySelector('[data-server-diff]');if(difference)difference.textContent=loadingStatus?'Checking…':serverError?'Unknown':local!==!!isPublished(record)?'Local / Supabase differ':'—';}catch(e){console.error('Publication row render error',e);const s=tr.querySelector('[data-draft-status]');if(s)s.textContent='CHECK ERROR — '+String(e?.message||e);const s2=tr.querySelector('[data-server-status]');if(s2&&s2.textContent==='Checking Supabase…')s2.textContent='CHECK ERROR';}}const update=host.querySelector('#sardPubLiveStatus');if(update)update.textContent=loadingStatus?'Loading actual Supabase publication status…':serverError?'Supabase status unavailable: '+serverError:'Live status verified from Supabase. Local change tracking cannot verify external edits to original marks or attendance. Older publications may show NOT VERIFIED.';host.querySelectorAll('#sardPublishSelected,#sardUnpublishSelected').forEach(btn=>btn.disabled=loadingStatus||!!serverError);};
   const fetchServer=async()=>{if(writing)return;loadingStatus=true;serverError='';redrawStatus();try{const result=await publicationApi().list();if(!Array.isArray(result))throw Error('Unexpected Supabase status response; expected list.');serverRows=result;}catch(e){serverRows=null;serverError=String(e?.message||e)}finally{loadingStatus=false;try{redrawStatus()}catch(e){serverError='Publication status display error: '+String(e?.message||e);console.error(e);const label=host.querySelector('#sardPubLiveStatus');if(label)label.textContent=serverError;host.querySelectorAll('#sardPublishSelected,#sardUnpublishSelected').forEach(b=>b.disabled=true)}}};
   const rows=classes.map(g=>{const snap=published[publicationKey(g.className)];return `<tr data-pub-class="${escd(g.className)}"><td><input type="checkbox" class="sard-pub-check" value="${escd(g.className)}" aria-label="Select ${escd(g.className)}"></td><td>${escd(g.className)}</td><td data-server-status>Checking Supabase…</td><td data-server-revision>—</td><td>${snap?escd(snap.publishedAt):'—'}</td><td data-server-students>—</td><td>${snap?snap.students.length:'—'}</td><td data-server-diff>—</td><td data-draft-status>Checking…</td></tr>`}).join('');
   host.innerHTML=`<div class="sard-dash-card"><h2>Class-wise Result Publication</h2><div class="sard-dash-actions"><button type="button" id="sardPubSelectAll">Select All</button><button type="button" id="sardPubClear">Clear</button><button type="button" class="primary" id="sardPublishSelected">Publish / Update Selected</button><button type="button" id="sardUnpublishSelected">Unpublish Selected</button></div><div class="sard-dash-table"><table><thead><tr><th>Select</th><th>Class</th><th>Supabase Status</th><th>Revision</th><th>Saved Local Snapshot At</th><th>Supabase Students</th><th>Local Students</th><th>Difference</th><th>Local changes since confirmed update</th></tr></thead><tbody>${rows}</tbody></table></div><p id="sardPubLiveStatus" role="status">Checking Supabase…</p><div class="sard-dash-actions"><button type="button" id="sardPubReload">Refresh Supabase Status</button></div><p id="sardPubMessage" role="status"></p><p><strong>Supabase status controls visibility.</strong> A saved local snapshot is retained on Unpublish and is not proof of public access. Edit/save locally first, then review and Publish / Update to send a new snapshot. If an error appears after a write, refresh status and inspect revision before retrying.</p></div>`;
   const checks=()=>[...host.querySelectorAll('.sard-pub-check')];const chosen=()=>checks().filter(x=>x.checked).map(x=>x.value);
   host.querySelector('#sardPubSelectAll').onclick=()=>checks().forEach(x=>x.checked=true);
   host.querySelector('#sardPubClear').onclick=()=>checks().forEach(x=>x.checked=false);
   const say=m=>{const e=host.querySelector('#sardPubMessage');if(e)e.textContent=m};
   // Single-step official publication: the server must confirm the write before local status changes.
   const publicationApi=()=>{const api=window.saResultPublicationApi;if(!api||!api.upsert||!api.unpublish||!api.list)throw Error('Publication connection missing. Load 04_ADMIN_LOCAL_SYNC.js after result-grade-designer.js.');return api};
   let writing=false;
   const working=(busy)=>{writing=busy;host.querySelectorAll('#sardPublishSelected,#sardUnpublishSelected,#sardPubReload').forEach(b=>{if(b)b.disabled=busy||((b.id!=='sardPubReload')&&(loadingStatus||!!serverError))})};
   const safeReload=async()=>{try{await fetchServer()}catch(e){say('Status refresh failed: '+String(e?.message||e))}};
   const verifyChange=async(cl,shouldBePublished,previousRevision=null,expectedStudents=null)=>{
     const data=await publicationApi().list();
     if(!Array.isArray(data))throw Error('Supabase verification returned invalid data.');
     const key=v=>String(v??'').trim().toLowerCase();
     const match=data.find(r=>key(r.academic_year??r.academicYear)===key(year)&&key(r.term_key??r.term??'second')==='second'&&key(r.class_name??r.className)===key(cl));
     if(!match)throw Error('Supabase did not return the publication record. Do not retry before checking SQL.');
     if(!!isPublished(match)!==shouldBePublished)throw Error('Supabase did not confirm the requested publication status. Refresh and check before retrying.');
     // A successful RPC response alone is not enough to claim the update was saved.
     // Only compare fields that the installed admin list RPC actually returns.
     if(previousRevision!==null && match.revision!==undefined && match.revision!==null && Number(match.revision)<previousRevision)throw Error('Supabase revision moved backward; review server state before retrying.');
     if(shouldBePublished){
       if(!match)throw Error('Supabase publication record was not returned. Verify in SQL before retrying.');
       const rawRevision=match.revision;
       if(rawRevision===undefined||rawRevision===null||!Number.isInteger(Number(rawRevision))||Number(rawRevision)<1)throw Error('Supabase revision is missing or invalid. Do not retry before checking.');
       if(previousRevision!==null&&Number(rawRevision)<=previousRevision)throw Error('Publication revision did not advance. Refresh Supabase and inspect before retrying.');
       if(expectedStudents!==null){
         const count=match.student_count??match.studentCount;
         if(count===undefined||count===null||!Number.isInteger(Number(count))||Number(count)!==expectedStudents)throw Error('Supabase student count was missing or mismatched. Verify before retrying.');
       }
     }
     return match;
   };
   host.querySelector('#sardUnpublishSelected').onclick=async()=>{
     if(writing)return;
     const picked=chosen();if(!picked.length){say('Select at least one class.');return}
     if(loadingStatus||serverError||!serverRows){say('Supabase status is not verified. Refresh first.');return}
     const store=readPublications(),targets=picked.filter(c=>isPublished(serverMatch(c)));
     if(!targets.length){say('Selected classes are not published in Supabase.');return}
     if(targets.length!==picked.length){say('Selection includes unpublished classes. Select only published classes to unpublish.');return}
     if(!confirm(`Unpublish ${targets.length} class(es) from Supabase? Parents and staff will no longer see their results. Original marks will not be deleted.`))return;
     working(true);const done=[],failed=[];
     try{const api=publicationApi();for(const cl of targets){try{
       const before=serverMatch(cl);
       await api.unpublish({academicYear:year,term:'second',className:cl});
       await verifyChange(cl,false,before&&Number.isFinite(Number(before.revision))?Number(before.revision):null);
       // Preserve last known local snapshot for recovery; public visibility is determined by Supabase.
       done.push(cl);
     }catch(e){failed.push(cl+': '+String(e?.message||e)+' — Refresh Supabase Status and verify SQL before retrying.');break}}}
     catch(e){failed.push(String(e?.message||e))}
     finally{working(false)}
     await safeReload();say(`Unpublished: ${done.join(', ')||'none'}. ${failed.length?'Errors: '+failed.join(' | '):''}`);q('#sardDashStatus').textContent=`Supabase unpublished: ${done.join(', ')||'none'}. ${failed.length?'Errors: '+failed.join(' | '):''}`;
   };
   host.querySelector('#sardPublishSelected').onclick=async()=>{
     if(writing)return;
     const picked=chosen();if(!picked.length){say('Select at least one class.');return}
     if(loadingStatus||serverError||!serverRows){say('Supabase status is not verified. Refresh first.');return}
     if(picked.length>1&&!confirm(`You selected ${picked.length} classes. Each class publishes separately (not a single database transaction). If a write fails, previously completed classes may remain published. Continue?`))return;
     const review=picked.map(cl=>{const rec=serverMatch(cl);const snap=readPublications()[publicationKey(cl)];return cl+' — '+(isPublished(rec)?'UPDATE EXISTING RESULT (rev '+String(rec?.revision??'?')+')':'PUBLISH NEW RESULT')+(snap?.students?.length?' · local snapshot '+snap.students.length+' students':'');}).join('\n');
     if(!confirm('CONFIRM DIRECT SUPABASE PUBLICATION\n\n'+review+'\n\nThis updates what parents/staff may see immediately. Review marks, attendance and Grade Sheet before confirming.'))return;
     working(true);const current=q('#sardDashClass').value,store=readPublications(),done=[],failed=[];
     try{
       const api=publicationApi();
       for(const cl of picked){try{
         const group=classes.find(g=>g.className===cl);if(!group)throw Error('Class not found');
         q('#sardDashClass').value=cl;await selectClass();if(!state)throw Error('Marks not loaded');
         const all=results(),footer=readFooter();if(!all.length)throw Error('No students');
         if(!footer.teacher||!footer.date)throw Error('Save Class Teacher and Date of Issue in Grade Sheets');
         if(all.some(r=>r.status==='CHECK'))throw Error('Incomplete marks/CH');
         if(all.some(r=>attendanceFor(r.student).status!=='READY'))throw Error('Missing attendance');
         const subjectOrder=orderedSubjects(),chSettings=sardReadCH()[keyFor()]||{};
         const students=all.map(r=>{const comps=sardBuildGradeRows(entriesFor(r.student),sardIsLowerClass(cl));const details=studentDisplayDetails(r.student);return {id:r.student.student_id,name:r.student.student_name||r.student.name,roll:details.roll,symbol:details.symbol,iemis:details.iemis,gpa:r.gpa,status:r.status,subjects:r.subjects,attendance:attendanceFor(r.student),gradeRows:comps.sort((a,b)=>subjectOrder.indexOf(a.subject)-subjectOrder.indexOf(b.subject)).map(s=>({subject:displaySubject(s.subject),inCH:chSettings[s.subject.toLowerCase()]?.IN??null,thCH:chSettings[s.subject.toLowerCase()]?.TH??null,inGP:s.IN.gp,inGrade:s.IN.grade,thGP:s.TH.gp,thGrade:s.TH.grade,final:r.subjects.find(t=>t.subject===s.subject)?.final||'CHECK'}))}});
         const tplGroup=groupOfClass(cl),tplRaw=localStorage.getItem('sa-result-template-group-v1-'+tplGroup)||(tplGroup==='lower'?localStorage.getItem(LEGACY_TEMPLATE_KEY):null);const tpl=tplRaw?JSON.parse(tplRaw):defaults();
         if(!valid(tpl))throw Error('Grade Sheet Design invalid. Check saved template.');
         const snapshot={academicYear:year,term:'second',className:cl,teacher:footer.teacher,dateOfIssue:footer.date,publishedAt:new Date().toISOString(),templateGroup:tplGroup,template:tpl,students};
         const beforeRecord=serverMatch(cl);
         const beforeRevision=beforeRecord&&Number.isFinite(Number(beforeRecord.revision))?Number(beforeRecord.revision):null;
         await api.upsert(snapshot); // Require confirmation BEFORE marking the class as locally published.
         const confirmed=await verifyChange(cl,true,beforeRevision,students.length);
         // A failure to store this advisory fingerprint must never undo a successful server write.
         try{markPublishedBaseline(cl,confirmed.revision)}catch(baselineError){failed.push(cl+': published, but local change tracking could not save: '+baselineError.message)}
         store[publicationKey(cl)]=snapshot;
         try{localStorage.setItem(publicationStore,JSON.stringify(store))}catch(localErr){failed.push(cl+': Supabase updated, but local copy could not save: '+localErr.message)}
         done.push(cl);
       }catch(err){failed.push(cl+': '+(err?.message||'Unknown error')+' — A write may already have succeeded. Refresh Supabase Status and verify SQL before retrying.');break}}
     }catch(err){failed.push(String(err?.message||err))}
     finally{q('#sardDashClass').value=current;try{await selectClass()}catch{}working(false)}
     // Rebuild the publication tab after asynchronous class selections, then display the verified status.
     render();const finalMsg=`Supabase verified published/updated: ${done.join(', ')||'none'}. ${failed.length?'Check required: '+failed.join(' | '):''}`;q('#sardDashStatus').textContent=finalMsg;const out=q('#sardPubMessage');if(out)out.textContent=finalMsg;
   };
   host.querySelector('#sardPubReload').onclick=fetchServer;
   fetchServer();
   return;
 }
 if(!state){host.innerHTML='<div class="sard-dash-card">Select an academic year and class to view its submitted marks.</div>';return}
 if(tab==='students'){
  const rows=state.students||[];
  host.innerHTML=`<div class="sard-dash-card"><h2>Student Details</h2><div class="sard-dash-table"><table><thead><tr><th>Student ID</th><th>Student Name</th><th>Roll No.</th><th>Symbol No.</th><th>IEMIS ID</th></tr></thead><tbody>${rows.map((st,i)=>{const d=studentDisplayDetails(st);return `<tr data-detail-row="${i}"><td>${escd(st.student_id)}</td><td>${escd(st.student_name||st.name)}</td><td><input data-detail="roll" value="${escd(d.roll)}" style="width:76px" aria-label="Roll number for ${escd(st.student_name||st.name)}"></td><td><span title="Student ID (automatic)">${escd(d.symbol)}</span></td><td><input data-detail="iemis" value="${escd(d.iemis)}" style="width:150px"></td></tr>`}).join('')}</tbody></table></div><div class="sard-dash-actions"><button class="primary" id="sardDetailsSave">Save Student Details</button></div></div>`;
  host.querySelector('#sardDetailsSave').onclick=()=>{
   const all=readStudentDetails();const seen=new Set();
   for(const [i,st] of rows.entries()){
    const row=host.querySelector(`[data-detail-row="${i}"]`);
    const get=field=>row.querySelector(`[data-detail="${field}"]`).value.trim();
    const roll=get('roll'),iemis=get('iemis');
    if(!roll){alert('Roll No. is required for '+(st.student_name||st.name));return}
    if(seen.has(roll.toLowerCase())){alert('Duplicate Roll No.: '+roll);return}
    seen.add(roll.toLowerCase());
    if(roll.length>20||iemis.length>70){alert('Student detail is too long.');return}
    all[studentDetailsKey(st)]={roll,iemis};
   }
   try{localStorage.setItem(studentDetailsStore,JSON.stringify(all));q('#sardDashStatus').textContent='Student details saved in this browser. Grade Sheets use the saved details.';render()}catch(err){alert('Could not save student details: '+err.message)}
  };
  return;
 }
 if(tab==='sheets'){
  const f=readFooter();
  host.innerHTML=`<div class="sard-dash-card"><h2>Grade Sheets</h2><div class="sard-dash-actions"><label>Class Teacher Name <input id="sardClassTeacher" value="${escd(f.teacher||'')}" maxlength="120"></label><label>Date of Issue (B.S.) <input id="sardIssueDate" value="${escd(f.date||'')}" placeholder="2083-07-15" maxlength="16"></label><button class="primary" id="sardSaveFooter">Save Class Details</button></div><div class="sard-dash-actions sard-sheet-select-actions"><button type="button" id="sardSelectAllSheets">Select All Ready</button><button type="button" id="sardClearAllSheets">Clear</button><button type="button" class="primary" id="sardPrintSelectedSheets">View / Print Selected</button><button type="button" id="sardPrintAllSheets">View / Print All Ready</button><span id="sardSelectedSheetsCount" aria-live="polite">0 selected</span></div><div class="sard-dash-table"><table><thead><tr><th>Select</th><th>Student</th><th>Result</th><th>GPA</th><th>Attendance</th><th>Grade Sheet</th></tr></thead><tbody>${rs.map((r,i)=>`<tr><td><input type="checkbox" data-sheet-select="${i}" aria-label="Select ${escd(r.student.student_name||r.student.name||r.student.student_id)}" ${r.status==='CHECK'||attendanceFor(r.student).status!=='READY'?'disabled':''}></td><td>${escd(r.student.student_name||r.student.name||r.student.student_id)}</td><td>${escd(r.status)}</td><td>${escd(r.gpa||'—')}</td><td>${escd(attendanceFor(r.student).status)}</td><td><button data-sheet="${i}" ${r.status==='CHECK'||attendanceFor(r.student).status!=='READY'?'disabled':''}>View</button></td></tr>`).join('')}</tbody></table></div></div>`;
  host.querySelector('#sardSaveFooter').onclick=()=>{const teacher=host.querySelector('#sardClassTeacher').value.trim(),date=host.querySelector('#sardIssueDate').value.trim();if(!teacher||!/^(?:20|21)\d{2}-\d{2}-\d{2}$/.test(date)){alert('Enter a class teacher and a B.S. date in YYYY-MM-DD format.');return}localStorage.setItem(footerKey(),JSON.stringify({teacher,date}));q('#sardDashStatus').textContent='Class Teacher and Date of Issue saved in this browser.'};
  const sheetBoxes=Array.from(host.querySelectorAll('[data-sheet-select]'));
  const sheetCount=host.querySelector('#sardSelectedSheetsCount');
  const updateSheetCount=()=>{const n=sheetBoxes.filter(b=>b.checked).length;sheetCount.textContent=n+' selected';host.querySelector('#sardPrintSelectedSheets').disabled=n===0};
  sheetBoxes.forEach(b=>b.addEventListener('change',updateSheetCount));
  host.querySelector('#sardSelectAllSheets').onclick=()=>{sheetBoxes.forEach(b=>{if(!b.disabled)b.checked=true});updateSheetCount()};
  host.querySelector('#sardClearAllSheets').onclick=()=>{sheetBoxes.forEach(b=>b.checked=false);updateSheetCount()};
  host.querySelector('#sardPrintSelectedSheets').onclick=()=>{
   const chosen=sheetBoxes.filter(b=>b.checked&&!b.disabled).map(b=>rs[Number(b.dataset.sheetSelect)].student);
   if(!chosen.length){alert('Select at least one ready student.');return}
   openStudentSheets(chosen);
  };
  host.querySelector('#sardPrintAllSheets').onclick=showAllStudentSheets;
  host.querySelectorAll('[data-sheet]').forEach(b=>b.onclick=()=>showStudentSheet(rs[Number(b.dataset.sheet)].student));
  updateSheetCount();return;
 }
 if(tab==='attendance'){
  const entries=(state.students||[]).map(st=>({st,...attendanceFor(st)}));
  const ready=entries.filter(e=>e.status==='READY').length;
  const opening=attendance?.header?.total_opening_days;
  host.innerHTML=`<div class="sard-dash-card"><h2>Class Attendance</h2><p>${escd(q('#sardDashClass').value)} · ${escd(q('#sardDashYear').value)} · Second Term</p><p>School Opening Days: <b>${opening===null||opening===undefined?'Missing':escd(opening)}</b> · Attendance Ready: <b>${ready}/${entries.length}</b>${attendanceError?' · '+escd(attendanceError):''}</p><div class="sard-dash-actions"><button id="sardAttCopy">Copy All</button><button id="sardAttExcel" class="primary">Export Excel</button></div><div class="sard-dash-table"><table><thead><tr><th>Student ID</th><th>Student Name</th><th>Opening Days</th><th>Present Days</th><th>Present %</th></tr></thead><tbody>${entries.map(e=>`<tr><td>${escd(e.st.student_id)}</td><td>${escd(e.st.student_name||e.st.name)}</td><td>${e.opening??'Missing'}</td><td>${e.present??'Missing'}</td><td>${e.percentage??'Missing'}</td></tr>`).join('')}</tbody></table></div></div>`;
  const r=[['Student ID','Student Name','Opening Days','Present Days','Present %'],...entries.map(e=>[String(e.st.student_id),e.st.student_name||e.st.name,e.opening??'Missing',e.present??'Missing',e.percentage??'Missing'])];
  host.querySelector('#sardAttExcel').onclick=()=>sardExportXlsx(r,`${q('#sardDashClass').value}_Second_Term_Attendance.xlsx`);
  host.querySelector('#sardAttCopy').onclick=()=>{const text=r.map(x=>x.join('\t')).join('\n');if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).catch(()=>sardCopyFallback(text));else sardCopyFallback(text)};
  return;
 }
 if(tab==='subjects'){
 host.innerHTML=`<div class="sard-dash-card"><h2>Class-wide IN / TH Credit Hours</h2><p>Set and save each subject once. The same CH applies to all students of ${escd(q('#sardDashClass').value)} for this term. CH stays in this browser, not Supabase.</p><div class="sard-dash-table"><table><thead><tr><th>Original Subject</th><th>Grade Sheet Name</th><th>Display Order</th><th>IN Credit Hour</th><th>TH Credit Hour</th></tr></thead><tbody>${ss.map((name,i)=>{const x=ch[name.toLowerCase()]||{};return `<tr data-chrow="${i}"><td>${escd(name)}</td><td><input data-name value="${escd(displaySubject(name))}" maxlength="100"></td><td><input data-order type="number" min="1" max="99" value="${Number(subjectSettings()[name.toLowerCase()]?.order)||i+1}" style="width:65px"></td><td><input data-in="1" type="number" min="0" step="0.25" value="${Number.isFinite(Number(x.IN))&&x.IN!==undefined?escd(x.IN):''}"></td><td><input data-th="1" type="number" min="0" step="0.25" value="${Number.isFinite(Number(x.TH))&&x.TH!==undefined?escd(x.TH):''}"></td></tr>`}).join('')}</tbody></table></div><div class="sard-dash-actions"><button id="sardDashSaveCH" class="primary">Save Class Credit Hours</button><button id="sardDashToVerify">Calculate All Students</button></div><small>Do not guess Credit Hours. Save verified values from the school’s approved subject structure.</small></div>`;
 host.querySelector('#sardDashSaveCH').onclick=()=>{const v={};let error='';for(const [i,name] of ss.entries()){const tr=host.querySelector(`[data-chrow="${i}"]`),a=tr.querySelector('[data-in]').value.trim(),b=tr.querySelector('[data-th]').value.trim();if(!a||!b||!Number.isFinite(+a)||!Number.isFinite(+b)||+a<0||+b<0||(+a)+(+b)<=0){error=`Enter valid IN/TH credit hours for ${name}.`;break}v[name.toLowerCase()]={IN:+a,TH:+b}}if(error){alert(error);return}const ord=new Set(),named={};for(const [i,name] of ss.entries()){const tr=host.querySelector(`[data-chrow="${i}"]`),label=tr.querySelector('[data-name]').value.trim(),order=Number(tr.querySelector('[data-order]').value);if(!label||!Number.isInteger(order)||order<1||ord.has(order)){alert('Enter valid unique display order and subject name.');return}ord.add(order);named[name.toLowerCase()]={label,order}}try{const all=sardReadCH();all[keyFor()]=v;localStorage.setItem(sardCHStorage,JSON.stringify(all));const store=sardReadRegister(),k=keyFor();store[k]={...(store[k]||{}),subjects:named};localStorage.setItem(sardRegisterStore,JSON.stringify(store));q('#sardDashStatus').textContent=`Saved ${ss.length} subject CH settings for ${q('#sardDashClass').value} (${q('#sardDashYear').value}) in this browser. All student results recalculated locally.`;render()}catch(e){alert('Could not save CH in this browser: '+e.message)}};
 host.querySelector('#sardDashToVerify').onclick=()=>{tab='verification';syncTabs();render()};return;
 }
 if(tab==='register'){
  const cfg=sardReadRegister()[keyFor()]||{},edits=cfg.edits||{},rows=state.students||[],lower=sardIsLowerClass(q('#sardDashClass').value),ordered=orderedSubjects();
  const compsBySubject=new Map(ordered.map(name=>[name,state.bundles.filter(b=>b.project.subject_name===name).flatMap(b=>b.components||[])]));
  const mapped=rows.map(st=>{const group=new Map();for(const e of entriesFor(st)){const kind=sardComponentKind(e.component,lower);if(!group.has(e.subject))group.set(e.subject,{IN:[],TH:[],CHECK:[]});group.get(e.subject)[kind].push(e)}return {st,group}});
  const sum=(arr,key)=>arr.length&&arr.every(r=>r[key]!=='—'&&r[key]!=='ABS'&&r[key]!==''&&Number.isFinite(Number(r[key])))?Number(arr.reduce((n,r)=>n+Number(r[key]),0).toFixed(2)):'—';
  // Register and Excel use exactly the same per-component grading and
  // class-wide CH calculation as Marks & Grade Verification.
  const grades=mapped.map(({st})=>({
    perSubject:new Map(sardBuildGradeRows(entriesFor(st),lower).map(r=>[r.subject,r])),
    result:sardGradeForStudent(entriesFor(st),ch,lower)
  }));
  const marksSum=(arr)=>arr.length&&arr.every(r=>r.marks!=='—'&&r.marks!=='ABS'&&r.marks!==''&&r.marks!=null&&Number.isFinite(Number(r.marks)))?Number(arr.reduce((n,r)=>n+Number(r.marks),0).toFixed(2)):'—';
  const fullFor=(name,kind)=>{const cc=compsBySubject.get(name)||[],arr=cc.filter(c=>sardComponentKind(c.component_name,lower)===kind);return arr.length&&arr.every(c=>c.full_marks!==null&&c.full_marks!==''&&Number.isFinite(Number(c.full_marks))&&Number(c.full_marks)>0)?arr.reduce((v,c)=>v+Number(c.full_marks),0):'—'};
  const headers=ordered.map((name,i)=>`<th colspan="6" style="background:${sardSubjectPalette[i%sardSubjectPalette.length]}">${escd(displaySubject(name))}</th>`).join('');
  const fmHeaders=ordered.map((name,i)=>{
    const color=sardSubjectPalette[i%sardSubjectPalette.length];
    return [`IN (${fullFor(name,'IN')})`,'IN Grade','IN GP',`TH (${fullFor(name,'TH')})`,'TH Grade','TH GP'].map(v=>`<th style="background:${color}">${escd(v)}</th>`).join('');
  }).join('');
  const exportRows=[
    ['Student','Student ID',...ordered.flatMap(name=>['IN Marks','IN Grade','IN GP','TH Marks','TH Grade','TH GP'].map(x=>displaySubject(name)+' '+x)),'GPA','Opening Days','Present Days','Present %'],
    ['Full Marks','',...ordered.flatMap(name=>[fullFor(name,'IN'),'','',fullFor(name,'TH'),'','']),'','','',''],
  ];
  const cells=mapped.map(({st,group},j)=>{
    const grade=grades[j],values=[];
    for(const [i,name] of ordered.entries()){
      const parts=group.get(name)||{IN:[],TH:[],CHECK:[]},g=grade.perSubject.get(name);
      const color=sardSubjectPalette[i%sardSubjectPalette.length];
      const row=[marksSum(parts.IN),g?.IN?.grade||'—',g?.IN?.gp??'—',marksSum(parts.TH),g?.TH?.grade||'—',g?.TH?.gp??'—'];
      values.push(...row);
    }
    const gpa=grade.result.gpa??'CHECK';
    const at=attendanceFor(st);exportRows.push([st.student_name||st.name||'',st.student_id,...values,gpa,at.opening??'Missing',at.present??'Missing',at.percentage??'Missing']);
    let pos=0;
    return `<tr><th>${escd(st.student_name||st.name||'')}<small>${escd(st.student_id)}</small></th>${ordered.map((name,i)=>{const color=sardSubjectPalette[i%sardSubjectPalette.length];return Array.from({length:6},()=>`<td style="background:${color}">${escd(values[pos++])}</td>`).join('')}).join('')}<td><b>${escd(gpa)}</b></td><td>${at.opening??'Missing'}</td><td>${at.present??'Missing'}</td><td>${at.percentage??'Missing'}</td></tr>`;
  }).join('');
  host.innerHTML=`<div class="sard-dash-card"><h2>Class Marks Register</h2><div class="sard-dash-actions"><button id="sardRegisterCopy">Copy All</button><button id="sardRegisterExcel" class="primary">Export Excel</button><button id="sardRegisterEdit">Edit Student Marks</button></div><div class="sard-dash-table sard-register-table"><table id="sardRegisterTable"><thead><tr><th rowspan="2">Student</th>${headers}<th rowspan="2">GPA</th><th rowspan="2">Opening Days</th><th rowspan="2">Present Days</th><th rowspan="2">Present %</th></tr><tr>${fmHeaders}</tr></thead><tbody>${cells}</tbody></table></div><div id="sardRegisterEditHost"></div></div>`;
  host.querySelector('#sardRegisterCopy').onclick=()=>{const text=exportRows.map(r=>r.join('\t')).join('\n');if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>{q('#sardDashStatus').textContent='Register copied.'}).catch(()=>sardCopyFallback(text));else sardCopyFallback(text)};
  host.querySelector('#sardRegisterExcel').onclick=()=>sardExportXlsx(exportRows,`${q('#sardDashClass').value}_Second_Term_Marks_Grades_GPA.xlsx`);
  host.querySelector('#sardRegisterEdit').onclick=()=>{
   const editHost=host.querySelector('#sardRegisterEditHost');editHost.innerHTML=`<h3>Edit Student Marks</h3><label>Student <select id="sardRegStudent">${rows.map((st,i)=>`<option value="${i}">${escd(st.student_name||st.name||st.student_id)}</option>`).join('')}</select></label><div id="sardRegFields"></div>`;
   const studentSel=editHost.querySelector('#sardRegStudent');const buildFields=()=>{const st=rows[Number(studentSel.value)],all=entriesFor(st);editHost.querySelector('#sardRegFields').innerHTML=`<div class="sard-dash-table"><table><thead><tr><th>Subject</th><th>Component</th><th>Full Marks</th><th>Original</th><th>Verified Marks</th></tr></thead><tbody>${all.map((v,i)=>`<tr><td>${escd(displaySubject(v.subject))}</td><td>${escd(v.component)}</td><td>${escd(v.full)}</td><td>${escd(v.original)}</td><td><input data-edit="${i}" value="${escd(v.marks)}" type="text" inputmode="decimal" style="width:85px"></td></tr>`).join('')}</tbody></table></div><label>Correction Reason <input id="sardRegReason" placeholder="Required for any marks change"></label><div class="sard-dash-actions"><button class="primary" id="sardRegSave">Save Corrections</button></div>`;
   editHost.querySelector('#sardRegSave').onclick=()=>{
     const store=sardReadRegister(), key=keyFor();
     const bucket=store[key]&&typeof store[key]==='object'?{...store[key]}:{};
     bucket.edits={...(bucket.edits||{})};
     const updates=[];
     for(const [i,v] of all.entries()){
       const input=editHost.querySelector(`[data-edit="${i}"]`);
       if(!input){alert('Marks input is missing. Reopen Edit Student Marks.');return;}
       const value=input.value.trim(), old=String(v.marks??'').trim();
       if(value===old || (value!==''&&old!==''&&Number.isFinite(Number(value))&&Number.isFinite(Number(old))&&Number(value)===Number(old)))continue;
       const full=Number(v.full), mark=Number(value);
       if(!value||!Number.isFinite(mark)||mark<0||!Number.isFinite(full)||full<=0||mark>full){alert(`Invalid marks for ${v.subject} / ${v.component}. Enter a number between 0 and ${v.full}.`);input.focus();return;}
       updates.push({id:[st.student_id,v.subject,v.componentId].join('||'),value:mark,from:v.marks,subject:v.subject,component:v.component});
     }
     if(!updates.length){alert('No marks changed. Enter a different value in Verified Marks.');return;}
     const reason=editHost.querySelector('#sardRegReason')?.value.trim()||'';
     if(reason.length<5){alert('Correction Reason is required (at least 5 characters).');editHost.querySelector('#sardRegReason')?.focus();return;}
     const now=new Date().toISOString();
     for(const u of updates){const previous=bucket.edits[u.id];bucket.edits[u.id]={value:u.value,reason,updatedAt:now,history:[...(previous?.history||[]),{from:u.from,to:u.value,reason,at:now}]};}
     store[key]=bucket;
     try{
       localStorage.setItem(sardRegisterStore,JSON.stringify(store));
       // Verify that the actual saved values can be read back before announcing success.
       const saved=JSON.parse(localStorage.getItem(sardRegisterStore)||'null');
       if(!saved?.[key]?.edits||updates.some(u=>Number(saved[key].edits[u.id]?.value)!==u.value))throw Error('Saved marks could not be verified.');
       const studentIndex=Number(studentSel.value);
       render();
       // Restore the edit panel with the same student so the corrected marks are visible immediately.
       const reopen=host.querySelector('#sardRegisterEdit');
       reopen?.click();
       const selector=host.querySelector('#sardRegStudent');
       if(selector){selector.value=String(studentIndex);selector.dispatchEvent(new Event('change'));}
       q('#sardDashStatus').textContent=`Saved and verified ${updates.length} correction(s) for ${st.student_name||st.name||st.student_id}. Register / GPA recalculated locally. Published Supabase result is NOT updated yet.`;
       alert(`Saved and verified ${updates.length} marks correction(s). Check the updated Verified Marks. To show this in the published result, use Publish / Update Selected.`);
     }catch(e){alert('Correction save/verification failed: '+e.message+'. Do not publish until corrected marks are visible.');}
   };
   };studentSel.onchange=buildFields;buildFields();
  };return;
 }
 if(tab==='verification'){
 host.innerHTML=`<div class="sard-dash-card"><h2>All Students · Class Result Preview</h2><p>Submitted marks only · Unmapped or missing components show CHECK · NG is not converted to a passing result.</p><div class="sard-dash-table"><table><thead><tr><th>Roll / ID</th><th>Student Name</th><th>Subjects</th><th>Status</th><th>GPA Preview</th><th>Opening Days</th><th>Present Days</th><th>Present %</th><th>Detail</th></tr></thead><tbody>${rs.map((r,i)=>`<tr><td>${escd(r.student.student_id)}</td><td>${escd(r.student.student_name||r.student.name)}</td><td>${r.subjects.length}</td><td><b>${r.status}</b></td><td>${r.gpa??'—'}</td><td>${attendanceFor(r.student).opening??'Missing'}</td><td>${attendanceFor(r.student).present??'Missing'}</td><td>${attendanceFor(r.student).percentage??'Missing'}</td><td><button data-student="${i}">View</button></td></tr>`).join('')}</tbody></table></div><div id="sardDashStudentDetail"></div></div>`;
 host.querySelectorAll('[data-student]').forEach(b=>b.onclick=()=>{const r=rs[Number(b.dataset.student)];host.querySelector('#sardDashStudentDetail').innerHTML=`<h3>${escd(r.student.student_name||r.student.name)} · ${escd(r.student.student_id)} · ${r.status} · GPA ${r.gpa??'—'}</h3><div class="sard-dash-table"><table><thead><tr><th>Subject</th><th>Final Grade</th></tr></thead><tbody>${r.subjects.map(x=>`<tr><td>${escd(x.subject)}</td><td>${escd(x.final)}</td></tr>`).join('')}</tbody></table></div>`});return;
 }
 host.innerHTML=`<div class="sard-dash-stats"><article><small>SUBJECTS SUBMITTED</small><strong>${ss.length}</strong><span>For selected class</span></article><article><small>TOTAL STUDENTS</small><strong>${rs.length}</strong><span>In submitted marks bundles</span></article><article><small>RESULT PREVIEW READY</small><strong>${ready}</strong><span>Verified CH & components</span></article><article><small>CHECK / NG</small><strong>${check} / ${ng}</strong><span>Requires review / Not graded</span></article></div><div class="sard-dash-columns"><div class="sard-dash-card"><h2>Class Result Completion</h2><div class="sard-dash-progress"><strong>${rs.length?Math.round(ready/rs.length*100):0}%</strong><span>Calculation ready (not published)</span></div><p>${ready} ready · ${check} check · ${ng} NG</p><button id="sardDashStartCH">Set Subject Credit Hours</button></div><div class="sard-dash-card"><h2>Class Progress</h2><div class="sard-dash-bars">${classes.map(g=>{const active=g.className===q('#sardDashClass').value,percent=Math.round(g.projects.length/Math.max(1,ss.length)*100);return `<div title="${escd(g.className)} · ${g.projects.length} submitted subjects" class="${active?'active':''}"><span>${g.projects.length}</span><i style="height:${Math.max(18,Math.min(100,percent))}%"></i><small>${escd(g.className)}</small></div>`}).join('')}</div><p>Bars show number of submitted subjects relative to the selected class. They do not indicate full school result completion.</p></div></div>`;
 host.querySelector('#sardDashStartCH').onclick=()=>{tab='subjects';syncTabs();render()};
 }
 function syncTabs(){dash.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===tab))}
 async function loadGroups(){const seq=++busy;try{q('#sardDashStatus').textContent='Loading submitted Second Term projects…';if(typeof umeAdminDb!=='function'||typeof umeRpc!=='function'||typeof umeCombinedState!=='function'||typeof umeEntryMap!=='function')throw Error('Website marks functions unavailable.');if(!(typeof studentAdminSession!=='undefined'&&studentAdminSession?.access_token))throw Error('Admin login required.');const rows=await umeRpc(umeAdminDb(),'ume_list_final_projects');if(seq!==busy)return;const map=new Map();for(const p of rows||[]){if(p.status!=='submitted_to_admin'||normTerm(p.term_name)!=='second')continue;const k=sardKey(p.academic_session,'second',p.class_name);if(!map.has(k))map.set(k,{session:String(p.academic_session),className:String(p.class_name),projects:[]});map.get(k).projects.push(p)}groups=[...map.values()];const years=[...new Set(groups.map(x=>x.session))].sort().reverse();q('#sardDashYear').innerHTML=years.map(y=>`<option>${escd(y)}</option>`).join('')||'<option value="">No academic year</option>';fillClasses();q('#sardDashStatus').textContent=`${groups.length} class packages found for Second Term (submitted to Admin).`;}
 catch(e){q('#sardDashStatus').textContent='Could not load marks: '+e.message;render()}}
 function fillClasses(){classes=groups.filter(g=>g.session===q('#sardDashYear').value).sort((a,b)=>a.className.localeCompare(b.className,undefined,{numeric:true}));q('#sardDashClass').innerHTML='<option value="">Select class</option>'+classes.map(g=>`<option value="${escd(g.className)}">${escd(g.className)}</option>`).join('');q('#sardDashHeroYear').textContent=q('#sardDashYear').value||'—';state=null;render()}
 async function selectClass(){const seq=++busy,g=groupFor();state=null;attendance=null;attendanceError='';if(!g){render();return}q('#sardDashStatus').textContent=`Loading ${g.className} submitted marks bundles…`;try{bundles=await Promise.all(g.projects.map(async p=>{const b=await umeRpc(umeAdminDb(),'ume_get_project_bundle',{p_project_id:Number(p.id)});if(b?.project?.status!=='submitted_to_admin')throw Error('Subject status changed. Refresh before continuing.');return b}));if(seq!==busy)return;state=umeCombinedState(bundles);try{
    // Attendance is sometimes stored under a canonical term (Second) while
    // earlier marks files have a longer term name. Read only, never auto-save.
    const terms=[g.projects[0]?.term_name,'Second','Second Term','Second Terminal Examination','Second Term Exam'];
    const unique=[...new Set(terms.map(t=>String(t||'').trim()).filter(Boolean))];
    const errors=[];
    for(const term of unique){
      try{
        const candidate=await umeRpc(umeAdminDb(),'ume_get_attendance_bundle',{p_class_name:g.className,p_term_name:term,p_academic_session:g.session});
        if(candidate?.header?.total_opening_days!==null&&candidate?.header?.total_opening_days!==undefined&&Array.isArray(candidate.entries)&&candidate.entries.length){attendance=candidate;break}
      }catch(err){errors.push(term+': '+(err?.message||'Query failed'))}
    }
    if(!attendance)attendanceError=errors.length===unique.length?'Attendance lookup failed: '+errors[0]:'No matching submitted Attendance found for this Class / Second Term';
  }catch(err){attendanceError='Attendance unavailable: '+(err?.message||'Unknown error');attendance=null;}if(seq!==busy)return;q('#sardDashStatus').textContent=`${g.className} · ${g.session}: ${bundles.length} submitted subjects and ${state.students.length} students. Missing or unsubmitted subjects may not be included.`;render()}catch(e){q('#sardDashStatus').textContent='Could not load class: '+e.message;render()}}
 q('#sardDashClose').onclick=()=>dash.remove();q('#sardDashDesigner').onclick=()=>{open()};q('#sardDashInspector').onclick=()=>openLiveSecondTermMarks();q('#sardDashRefresh').onclick=()=>loadGroups();q('#sardDashYear').onchange=fillClasses;q('#sardDashClass').onchange=selectClass;
 dash.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;syncTabs();render()});loadGroups();
}


// Result Management launcher: resilient to dynamically rebuilt Admin tabs.
function sardLaunchResultDashboard(e){
 if(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
 try{
  if(document.getElementById('sardDashboard')){
   const existing=document.getElementById('sardDashboard');
   existing.style.display='';existing.style.visibility='visible';return;
  }
  sardOpenDashboard();
  if(!document.getElementById('sardDashboard'))throw Error('Dashboard was not created');
 }catch(error){
  console.error('Result Management open failed:',error);
  window.alert('Result Management खोल्दा समस्या: '+String(error?.message||error));
 }
}
function sardEnsureResultButton(){
 const admin=document.querySelector('#websiteAdminPanel .website-admin-tabs');
 if(!admin)return;
 let button=admin.querySelector('#sardOpenButton');
 if(!button){
  button=document.createElement('button');button.id='sardOpenButton';button.type='button';
  button.textContent='📄 Result Management';admin.appendChild(button);
 }
 // The delegated click handler below remains attached if this tab is re-created.
}
// Capture-phase listener survives replacement of the Admin navigation element.
// Handles only our explicit Result Management button; leaves all other tabs alone.
document.addEventListener('click',function(event){
 const button=event.target?.closest?.('#sardOpenButton');
 if(!button||!button.closest('#websiteAdminPanel'))return;
 sardLaunchResultDashboard(event);
},true);
let sardRecheckQueued=false;
const sardButtonObserver=new MutationObserver(()=>{
 if(sardRecheckQueued)return;
 sardRecheckQueued=true;
 queueMicrotask(()=>{sardRecheckQueued=false;sardEnsureResultButton()});
});
function sardStartButtonWatch(){
 sardEnsureResultButton();
 const admin=document.getElementById('websiteAdminPanel');
 if(admin)sardButtonObserver.observe(admin,{childList:true,subtree:true});
 else sardButtonObserver.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sardStartButtonWatch,{once:true});else sardStartButtonWatch();

window.saResultDesignerOpen=open;window.saResultDashboardOpen=sardOpenDashboard;
})();


/* Staff/Principal published results — local-only read view.
   This never reads unpublished marks or writes result records. */
(function(){
 'use strict';
 const STORE='sa-result-local-publication-v1';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const style=`<style id="saStaffResultStyle">
 #saStaffResultOverlay{position:fixed;inset:0;background:#0b2035b8;z-index:2147483000;overflow:auto;padding:25px 12px;font-family:Arial,sans-serif;color:#172b4d}
 #saStaffResultOverlay .sr-card{max-width:1100px;margin:auto;background:#fff;border-radius:16px;padding:22px;box-shadow:0 16px 50px #1115}
 #saStaffResultOverlay header{display:flex;justify-content:space-between;align-items:center;gap:12px}
 #saStaffResultOverlay button,#saStaffResultOverlay select{border:1px solid #cbd5e1;border-radius:8px;padding:9px 12px;background:#fff;color:#102a43;cursor:pointer}
 #saStaffResultOverlay button.primary{background:#154a77;color:white;border-color:#154a77}
 #saStaffResultOverlay .sr-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin:20px 0}
 #saStaffResultOverlay table{width:100%;border-collapse:collapse;font-size:13px;margin:12px 0}
 #saStaffResultOverlay th,#saStaffResultOverlay td{border:1px solid #dce3eb;padding:9px;text-align:left}
 #saStaffResultOverlay th{background:#f0f5fa}
 #saStaffResultOverlay .sr-muted{color:#596a7e;font-size:13px}
 #saStaffResultOverlay .sr-sheet{border:1px solid #bbc9d9;padding:20px;margin-top:18px;break-inside:avoid}
 #saStaffResultOverlay .sr-sheet h3{text-align:center;margin:0 0 5px}
 @media print{body>*:not(#saStaffResultOverlay){display:none!important}#saStaffResultOverlay{position:static!important;background:white!important;padding:0!important;overflow:visible!important}#saStaffResultOverlay .sr-card{box-shadow:none!important;padding:0!important;max-width:none!important}#saStaffResultOverlay .sr-toolbar,#saStaffResultOverlay header button,#saStaffResultOverlay .sr-muted{display:none!important}#saStaffResultOverlay .sr-sheet{break-after:page;border:none!important} @page{size:A4 portrait;margin:12mm}}
 </style>`;
 function snapshot(){try{const x=JSON.parse(localStorage.getItem(STORE)||'{}');return Object.values(x).filter(p=>p&&Array.isArray(p.students)&&p.className&&p.academicYear)}catch{return []}}
 async function allowed(){
   if(typeof loggedInStaff==='undefined'||!loggedInStaff||typeof staffAuthSession==='undefined'||!staffAuthSession?.user?.id)throw Error('Staff or Principal login is required.');
   if(typeof staffDashboardIsPrincipal==='function'&&staffDashboardIsPrincipal())return {role:'principal',classes:null};
   if(typeof umeRpc!=='function'||typeof umeStaffDb!=='function')throw Error('Class Teacher assignment service is unavailable.');
   // Class assignments come from authenticated teacher-scoped RPC, never from a user-editable selector.
   const rows=await umeRpc(umeStaffDb(),'ume_list_class_teacher_projects');
   const ids=new Set((rows||[]).filter(r=>String(r.class_teacher_id??r.class_teacher_staff_id??'')===String(loggedInStaff.username??'')).map(r=>String(r.class_name??'')));
   // Do not guess classes when the RPC is missing staff-id information.
   return {role:'staff',classes:ids};
 }
 async function open(){
   if(document.getElementById('saStaffResultOverlay'))return;
   const root=document.createElement('div');root.id='saStaffResultOverlay';
   root.innerHTML=style+`<div class="sr-card"><header><div><h2>Published Results</h2><div class="sr-muted">Academic Year · Term · Class</div></div><button id="saStaffResultClose">✕ Close</button></header><div class="sr-toolbar"><label>Published Class <select id="saStaffResultClass"></select></label><button class="primary" id="saStaffResultPrint">Print / Save PDF</button></div><div id="saStaffResultContent">Loading…</div></div>`;
   document.body.appendChild(root);
   root.querySelector('#saStaffResultClose').onclick=()=>root.remove();
   root.querySelector('#saStaffResultPrint').onclick=()=>window.print();
   const content=root.querySelector('#saStaffResultContent'),sel=root.querySelector('#saStaffResultClass');
   try{
     const perms=await allowed();
     const docs=snapshot().filter(p=>perms.role==='principal'||perms.classes.has(String(p.className)));
     docs.sort((a,b)=>String(a.academicYear).localeCompare(String(b.academicYear))||String(a.className).localeCompare(String(b.className),undefined,{numeric:true}));
     if(!docs.length){content.textContent=perms.role==='principal'?'No published results exist in this browser.':'No published results for your assigned Class are available in this browser.';sel.disabled=true;root.querySelector('#saStaffResultPrint').disabled=true;return}
     sel.innerHTML=docs.map((p,i)=>`<option value="${i}">${esc(p.academicYear)} · ${esc(p.className)} · ${esc(p.term)}</option>`).join('');
     const render=()=>{
       const p=docs[Number(sel.value)];if(!p)return;
       content.innerHTML=`<p class="sr-muted">Class Teacher: ${esc(p.teacher)}　|　Date of Issue: ${esc(p.dateOfIssue)}</p><table><thead><tr><th>Roll</th><th>Student</th><th>Student ID / Symbol No.</th><th>GPA</th><th>Result</th><th>View</th></tr></thead><tbody>${p.students.map((st,i)=>`<tr><td>${esc(st.roll??'—')}</td><td>${esc(st.name)}</td><td>${esc(st.id)}</td><td>${esc(st.gpa)}</td><td>${esc(st.status)}</td><td><button data-sr-student="${i}">View</button></td></tr>`).join('')}</tbody></table><div id="saStaffResultSheet"></div>`;
       content.querySelectorAll('[data-sr-student]').forEach(b=>b.onclick=()=>{
         const st=p.students[Number(b.dataset.srStudent)],sheet=content.querySelector('#saStaffResultSheet');
         sheet.innerHTML=`<div class="sr-sheet"><h3>ST. AUGUSTINE ACADEMIC FOUNDATION</h3><p style="text-align:center">GRADE SHEET · ${esc(p.term)} · ${esc(p.academicYear)}</p><p><b>${esc(st.name)}</b>　Class: ${esc(p.className)}　Roll: ${esc(st.roll??'—')}　Symbol No.: ${esc(st.id)}</p><table><thead><tr><th>Subject</th><th>Final Grade</th></tr></thead><tbody>${(st.subjects||[]).map(s=>`<tr><td>${esc(s.subject)}</td><td>${esc(s.final)}</td></tr>`).join('')}</tbody></table><p><b>GPA: ${esc(st.gpa)}</b>　Opening Days: ${esc(st.attendance?.opening??'—')}　Present Days: ${esc(st.attendance?.present??'—')}　Present: ${esc(st.attendance?.percentage??'—')}</p><p>Prepared By: ${esc(p.teacher)}　 Date of Issue: ${esc(p.dateOfIssue)}</p></div>`;
       });
     };
     sel.onchange=render;render();
   }catch(e){content.textContent='Published Results unavailable: '+String(e.message||e);sel.disabled=true;root.querySelector('#saStaffResultPrint').disabled=true}
 }
 function init(){const quick=document.querySelector('#staffDashboardPopup .staff-dashboard-quick-actions');if(!quick||document.getElementById('saStaffResultAction'))return;const b=document.createElement('button');b.id='saStaffResultAction';b.type='button';b.className='staff-dashboard-action marks';b.innerHTML='<span class="staff-dashboard-action-icon">📄</span><span class="staff-dashboard-action-copy"><strong>RESULT</strong><small>Published grade sheets</small></span><span class="staff-dashboard-action-arrow">→</span>';b.onclick=open;quick.appendChild(b)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 window.saOpenStaffPublishedResults=open;
})();
