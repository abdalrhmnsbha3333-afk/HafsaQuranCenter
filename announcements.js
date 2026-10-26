// قسم الإعلانات ولوحات الشرف — ملف مستقل يُحمَّل من index.html
(function(){var st=document.createElement('style');st.textContent=`
.an-card{background:linear-gradient(135deg,#fff,#f6efe0);border:1.5px solid var(--gold);border-radius:var(--radius);padding:16px;margin-bottom:16px}
.an-card h3{margin:0 0 8px;font-size:15px;color:var(--green-deep)}
.an-modal{position:fixed;inset:0;background:rgba(31,42,36,.78);display:none;align-items:center;justify-content:center;z-index:940;padding:12px}
.an-box{background:var(--sand);border-radius:16px;width:100%;max-width:720px;max-height:94vh;overflow-y:auto}
.an-head{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;padding:12px 16px;background:var(--green);color:#fff;font-weight:700}
.an-x{background:none;border:none;color:#fff;font-size:20px;cursor:pointer}
.an-tabs{display:flex;gap:6px;padding:10px 14px 0;flex-wrap:wrap}
.an-tab{border:1.5px solid var(--sand-deep);background:var(--sand);border-radius:9px;padding:7px 12px;font:700 12.5px Tajawal;cursor:pointer;color:#6b7a70}
.an-tab.on{background:var(--green);color:#fff;border-color:var(--green)}
#anBody{padding:12px 14px 18px}
.an-in{width:100%;border:1px solid var(--sand-deep);border-radius:9px;padding:9px;font:14px Tajawal;background:#fff;margin:3px 0 10px}
.an-lbl{font-size:12px;font-weight:700;color:#6b7a70}
.an-row{display:flex;gap:8px;flex-wrap:wrap}.an-row>*{flex:1;min-width:130px}
.an-item{background:#fff;border:1px solid var(--sand-deep);border-radius:12px;padding:10px;margin-bottom:8px}
.an-item b{color:var(--green-deep)}.an-tag{font-size:11px;background:var(--gold-soft);border-radius:10px;padding:2px 8px;margin-inline-start:6px}
.an-tag.off{background:#ddd}.an-tag.act{background:#cfe5d6}
.an-mini{border:1.5px solid var(--green);background:none;color:var(--green-deep);border-radius:8px;padding:3px 9px;font:700 11.5px Tajawal;cursor:pointer;margin:6px 4px 0 0}
.an-prev{aspect-ratio:16/9;width:100%;border-radius:12px;overflow:hidden;position:relative;margin:8px 0}
.an-stu{display:flex;align-items:center;gap:8px;margin:6px 0;background:#fff;padding:6px;border-radius:10px}
.an-stu img,.an-stu .ph{width:44px;height:44px;border-radius:50%;object-fit:cover;background:var(--sand-deep);display:flex;align-items:center;justify-content:center;font-weight:900}

/* ==================== تنسيقات شاشة العرض التكيُّفية الكاملة (Override) ==================== */
#anDisp, #anDisp .an-stage, #anDisp .an-stage-inner {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  background: #000 !important;
}

.an-s{position:absolute !important;inset:0 !important;width:100vw !important;height:100vh !important;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:2.5cqw 4cqw 4.5cqw;text-align:center;color:#fbf7ec;background:#15231b;opacity:0;transition:opacity .8s ease;container-type:inline-size;direction:rtl;font-family:Tajawal,sans-serif;overflow:hidden;box-sizing:border-box}
.an-s.on{opacity:1 !important}

/* نمط الإعلانات المصورة (Hero Blur Layout) */
.an-s.an-ad-slide{padding:0 !important;justify-content:center !important}
.an-bg-blur{position:absolute;inset:0;background-size:cover;background-position:center;filter:blur(40px) brightness(0.5);transform:scale(1.2);z-index:1}
.an-ad-hero{position:relative;z-index:2;height:100% !important;width:100% !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:1.5vh 1.5vw;box-sizing:border-box}
.an-img-hero{max-height:94vh !important;max-width:96vw !important;width:auto !important;height:auto !important;object-fit:contain !important;border-radius:1.2cqw;box-shadow:0 1.5cqw 4cqw rgba(0,0,0,0.7);border:0.15cqw solid rgba(255,255,255,0.18)}

/* شارة الإعلان والعنوان المدمجان */
.an-badge-top{position:absolute;top:2.5cqw;right:3cqw;z-index:5;background:rgba(15,25,20,0.75);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:0.15cqw solid rgba(212,175,55,0.4);color:#f5e5c9;padding:0.5cqw 2cqw;border-radius:3cqw;font-size:2cqw;font-weight:800;box-shadow:0 0.5cqw 1.5cqw rgba(0,0,0,0.5)}
.an-title-overlay{position:absolute;top:2.2cqw;left:50%;transform:translateX(-50%);z-index:5;background:rgba(15,25,19,0.75);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:0.1cqw solid rgba(255,255,255,0.18);padding:0.4cqw 3cqw;border-radius:2cqw;font:700 3cqw Amiri,serif;color:#fdf8ec;text-shadow:0 0.2cqw 0.8cqw rgba(0,0,0,0.8);white-space:nowrap;max-width:60%;overflow:hidden;text-overflow:ellipsis}

/* نمط لوحات الشرف والنجوم (Honor Boards) */
.an-s.an-honor-slide{background:radial-gradient(circle at 50% 30%,rgba(43,72,55,0.85),transparent 70%),linear-gradient(145deg,#0b140f,#18291f)}
.an-honor-header{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:0.3cqw;margin-top:0.5cqw}
.an-honor-header::before{content:"✦ ❖ ✦";font-size:2.2cqw;color:#d4af37;opacity:0.85;letter-spacing:0.8cqw}
.an-t{font:900 4.8cqw Amiri,serif;color:#f3e4c8;text-shadow:0 0.3cqw 1cqw rgba(0,0,0,0.7)}
.an-d{font-size:2.2cqw;color:#d0ded5;max-width:85%;line-height:1.5;font-weight:500}

/* شبكة كروت الطلاب (Grid & Podium Cards) */
.an-grid{position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:2.2cqw;justify-content:center;align-items:center;width:100%;margin:auto 0}
.an-e{position:relative;background:rgba(255,255,255,0.06);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:0.18cqw solid rgba(212,175,55,0.3);border-radius:2cqw;padding:1.8cqw 1.2cqw;width:21cqw;display:flex;flex-direction:column;align-items:center;gap:0.7cqw;box-shadow:0 1cqw 2.5cqw rgba(0,0,0,0.4);transition:transform 0.3s ease}
.an-e.first{background:linear-gradient(160deg,rgba(184,135,59,0.42),rgba(35,52,42,0.65));border-color:#e8ca7b;transform:scale(1.08);box-shadow:0 1.2cqw 3cqw rgba(212,175,55,0.3)}
.an-e.big{width:36cqw;padding:2.5cqw 2cqw}.an-e.big .ph,.an-e.big img{width:18cqw;height:18cqw}

/* الصورة الرمزية وشعار النجمة */
.an-e img,.an-e .ph{width:11cqw;height:11cqw;border-radius:50%;object-fit:cover;background:linear-gradient(135deg,#2b3d32,#18261e);color:#e8ca7b;display:flex;align-items:center;justify-content:center;border:0.35cqw solid #d4af37;box-shadow:0 0.6cqw 1.8cqw rgba(0,0,0,0.5)}
.an-e .ph-icon{width:55%;height:55%;fill:currentColor;opacity:0.9}

.an-n{font-weight:800;font-size:2.4cqw;color:#ffffff;text-shadow:0 0.2cqw 0.5cqw rgba(0,0,0,0.8)}.an-e.big .an-n{font-size:3.6cqw}
.an-h{font-size:1.7cqw;color:#b2c7bb;background:rgba(0,0,0,0.3);padding:0.2cqw 1.2cqw;border-radius:1cqw}
.an-p{color:#f0cf75;font-weight:800;font-size:2cqw;background:rgba(212,175,55,0.15);padding:0.3cqw 1.4cqw;border-radius:2cqw;border:0.1cqw solid rgba(212,175,55,0.35)}
.an-r{position:absolute;top:-1cqw;right:-0.5cqw;background:linear-gradient(135deg,#d4af37,#aa8222);color:#121e17;border-radius:50%;width:3.8cqw;height:3.8cqw;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:2.2cqw;box-shadow:0 0.4cqw 1cqw rgba(0,0,0,0.4);border:0.15cqw solid #fff}
.an-empty{color:#cbdcd1;font-size:3.2cqw;font-weight:700}

/* شريط التحكم المصغر في الأسفل */
body.an-disp{background:#000;overflow:hidden}
body.an-disp #lockScreen,body.an-disp #appRoot,body.an-disp .exam-modal,body.an-disp #saveStatus{display:none!important}
#anDisp{position:fixed;inset:0;background:#000;z-index:5000}
#anCtl{position:fixed;bottom:1.5vh;left:50%;transform:translateX(-50%);z-index:5001;display:flex;gap:8px;background:rgba(12,20,15,0.8);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);padding:6px 14px;border-radius:30px;border:1px solid rgba(255,255,255,0.15);box-shadow:0 8px 24px rgba(0,0,0,0.6);transition:opacity 0.5s}
#anCtl button{border:none;background:rgba(255,255,255,0.12);color:#f5e5c9;border-radius:20px;padding:6px 14px;font:700 13px Tajawal;cursor:pointer;transition:background 0.2s}
#anCtl button:hover{background:rgba(212,175,55,0.35);color:#fff}
#anCtl.hide{opacity:0;pointer-events:none}#anWarn{position:fixed;top:8px;right:8px;z-index:5001;color:#f6c;font-size:12px}
`;document.head.appendChild(st)})();

(function(){
const A='sawaed-ann:',P='sawaed-photo:',HL='sawaed-halaqat-list';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const today=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
const TYPES={course:'دورة',activity:'نشاط',contest:'مسابقة',general:'إعلان عام',star:'🌟 نجم الحلقة',heroes:'🏅 أبطال الشعب',center:'✨ نجوم المركز'};
const isHonor=t=>['star','heroes','center'].includes(t);
async function sget(k){try{const r=await window.storage.get(k,false);return r&&r.value?JSON.parse(r.value):null}catch(e){return null}}
async function sset(k,v){for(let i=0;i<3;i++){try{if(await window.storage.set(k,JSON.stringify(v),false))return true}catch(e){}await sleep(500*(i+1))}return false}
async function getHal(){const l=await sget(HL);return Array.isArray(l)&&l.length?l:[{id:'h1',name:'سواعد الحفاظ'},{id:'h2',name:'زاد الحفاظ'}]}
async function getStu(hid){const c=await sget(hid==='h1'?'sawaed-config':'sawaed-config:'+hid);return((c&&c.students)||[]).filter(s=>(s.name||'').trim())}
const IDX='sawaed-ann-index';
async function getItems(){
  let ids=await sget(IDX);
  if(!Array.isArray(ids)){
    const r=await window.storage.list(A,false);
    ids=(r.keys||[]).map(k=>k.slice(A.length));
    if(ids.length)await sset(IDX,ids);
  }
  const out=[];
  for(const id of ids){const v=await sget(A+id);if(v)out.push(v)}
  return out.sort((a,b)=>(a.order||0)-(b.order||0));
}
async function saveItem(it){
  if(!await sset(A+it.id,it))return false;
  const ids=(await sget(IDX))||[];
  if(!ids.includes(it.id)){ids.push(it.id);await sset(IDX,ids)}
  return true;
}
async function delItem(id){
  await window.storage.delete(A+id,false);
  const ids=((await sget(IDX))||[]).filter(x=>x!==id);await sset(IDX,ids);
}
const photoCache={};
async function getPhoto(hid,sid){const k=P+hid+':'+sid;if(!(k in photoCache)){const v=await sget(k);photoCache[k]=v&&v.d||null}return photoCache[k]}

function rank(stu){
  const s=stu.filter(x=>(x.totalPoints||0)>0).sort((a,b)=>b.totalPoints-a.totalPoints);
  let r=0;return s.map((x,i)=>{if(i===0||x.totalPoints!==s[i-1].totalPoints)r=i+1;return{...x,rank:r}});
}
const isActive=i=>i.status==='active'&&(!i.start||today()>=i.start)&&(!i.end||today()<=i.end);

// أيقونة النجمة الذهبية الافتراضية
const STAR_ICON=`<svg class="ph-icon" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

function entry(e,o){
  const img=e.photo?`<img src="${esc(e.photo)}" alt="">`:`<div class="ph">${STAR_ICON}</div>`;
  return `<div class="an-e ${o.big?'big':''} ${e.rank===1?'first':''}">${o.rk?`<div class="an-r">${e.rank}</div>`:''}${img}<div class="an-n">${esc(e.name)}</div><div class="an-h">${esc(e.hname)}</div>${o.pts?`<div class="an-p">${e.totalPoints||0} نقطة</div>`:''}</div>`}

// توليد الشرائح الهيكلية للواجهة
async function slidesFor(it,hal){
  const dur=Math.max(3,+it.duration||10);
  
  // 1. حالة الإعـلان المصـور (صورة/دورة/نشاط/عام)
  if(!isHonor(it.type)){
    const bgBlur=it.image?`<div class="an-bg-blur" style="background-image:url('${esc(it.image)}')"></div>`:'';
    const heroImg=it.image?`<div class="an-ad-hero"><img class="an-img-hero" src="${esc(it.image)}" alt=""></div>`:'';
    const badge=`<span class="an-badge-top">${TYPES[it.type]||'إعلان'}</span>`;
    const titleOverlay=it.title?`<div class="an-title-overlay">${esc(it.title)}</div>`:'';
    
    return[{
      key:it.id,
      dur,
      isAd:true,
      html:`<div class="an-s an-ad-slide on">${bgBlur}${badge}${titleOverlay}${heroImg}</div>`
    }];
  }

  // 2. حالة لوحات الشرف والنجوم (Honor Boards)
  const hn=id=>(hal.find(h=>h.id===id)||{}).name||'';
  const lim=it.topN==='all'?1e9:+it.topN||1;
  const o={pts:!!it.showPoints,rk:true};
  const fill=async(rows,hid)=>{for(const e of rows){e.hname=hn(hid);e.photo=await getPhoto(hid,e.id)}return rows};
  let all=[];
  
  const headerHtml=`<div class="an-honor-header"><div class="an-t">${esc(it.title||TYPES[it.type]||'لوحة الشرف')}</div>${it.desc?`<div class="an-d">${esc(it.desc)}</div>`:''}</div>`;

  if(it.type==='star'){
    const hid=it.halaqat[0],stu=await getStu(hid);
    let rows=it.studentId?stu.filter(s=>s.id===it.studentId).map(s=>({...s,rank:1})):rank(stu).filter(s=>s.rank===1);
    all=await fill(rows,hid);
    if(!all.length)return[];
    return[{
      key:it.id,
      dur,
      html:`<div class="an-s an-honor-slide on">${headerHtml}<div class="an-grid">${all.map(e=>entry(e,{...o,big:true,rk:false})).join('')}</div></div>`
    }];
  }

  for(const hid of(it.type==='heroes'?[it.halaqat[0]]:it.halaqat)){
    const rows=rank(await getStu(hid)).filter(s=>s.rank<=lim);
    all.push(...await fill(rows,hid));
  }
  
  const per=it.type==='heroes'?5:6,out=[];
  for(let i=0;i<all.length;i+=per){
    const part=all.slice(i,i+per);
    const subTitle=it.title||(it.type==='heroes'?'أبطال '+hn(it.halaqat[0]):'نجوم المركز');
    const pageHeader=`<div class="an-honor-header"><div class="an-t">${esc(subTitle)}</div>${it.desc?`<div class="an-d">${esc(it.desc)}</div>`:''}</div>`;
    out.push({
      key:it.id+'#'+i,
      dur,
      html:`<div class="an-s an-honor-slide on">${pageHeader}<div class="an-grid">${part.map(e=>entry(e,o)).join('')}</div></div>`
    });
  }
  return out;
}

async function buildAll(){
  const hal=await getHal(),items=(await getItems()).filter(isActive),sl=[];
  for(const it of items){try{sl.push(...await slidesFor(it,hal))}catch(e){console.error(e)}}
  return sl;
}
const emptyHtml='<div class="an-s an-honor-slide on"><div class="an-empty">لا توجد إعلانات حالياً 🌙</div></div>';

// ======== شاشة العرض (#display) ========
if(location.hash==='#display'){
  document.body.classList.add('an-disp');
  const d=document.createElement('div');d.id='anDisp';
  d.innerHTML='<div class="an-stage"><div class="an-stage-inner"></div></div><span id="anWarn"></span><div id="anCtl"><button id="cPrev">⏮</button><button id="cPause">⏸ إيقاف</button><button id="cPin">📌 تثبيت</button><button id="cNext">⏭</button><button id="cFs">⛶</button><button id="cExit">✕ خروج</button></div>';
  document.body.appendChild(d);
  
  const stageInner=d.querySelector('.an-stage-inner');
  let cur=0,sl=[],paused=false,pinned=false,tm;
  
  const show=()=>{
    clearTimeout(tm);const s=sl[cur];
    stageInner.innerHTML=s?s.html:emptyHtml;
    if(s&&!paused&&!pinned&&sl.length>1)tm=setTimeout(()=>go(1),s.dur*1000);
  };
  
  const go=n=>{if(!sl.length)return;cur=(cur+n+sl.length)%sl.length;show()};
  async function refresh(){
    try{
      const keyNow=sl[cur]&&sl[cur].key,n=await buildAll();
      const same=sl.length===n.length&&sl.every((x,i)=>x.key===n[i].key);
      const i=n.findIndex(x=>x.key===keyNow);
      const htmlNow=sl[cur]&&sl[cur].html;sl=n;
      document.getElementById('anWarn').textContent='';
      if(!n.length){cur=0;show();return}
      if(i<0){cur=Math.min(cur,n.length-1);show()}
      else{cur=i;if(!same||n[i].html!==htmlNow){stageInner.innerHTML=n[i].html} if(!tm)show()}
    }catch(e){console.error(e);document.getElementById('anWarn').textContent='⚠ تعذّر التحديث'}
  }
  const $=id=>document.getElementById(id);
  $('cNext').onclick=()=>go(1);$('cPrev').onclick=()=>go(-1);
  $('cPause').onclick=()=>{paused=!paused;$('cPause').textContent=paused?'▶ استئناف':'⏸ إيقاف';show()};
  $('cPin').onclick=()=>{pinned=!pinned;$('cPin').textContent=pinned?'📍 إلغاء التثبيت':'📌 تثبيت';show()};
  $('cFs').onclick=()=>{try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(e){}};
  $('cExit').onclick=()=>{history.replaceState(null,'',location.pathname+location.search);location.reload()};
  document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(1);if(e.key==='ArrowRight')go(-1);if(e.key===' '){e.preventDefault();$('cPause').click()}});
  let ht;const wake=()=>{$('anCtl').classList.remove('hide');clearTimeout(ht);ht=setTimeout(()=>$('anCtl').classList.add('hide'),4000)};
  document.addEventListener('mousemove',wake);document.addEventListener('touchstart',wake);wake();
  window.addEventListener('load',()=>{refresh();setInterval(refresh,120000)});
  if(document.readyState==='complete'){refresh();setInterval(refresh,120000)}
  return;
}

// ======== واجهة الإدارة ========
const card=document.createElement('div');card.className='an-card';
card.innerHTML='<h3>📢 الإعلانات ولوحات الشرف</h3><button class="btn btn-gold btn-block" id="anOpen">فتح الإعلانات</button><button class="btn btn-green btn-block" style="margin-top:8px" id="anScreen">📺 عرض على الشاشة</button>';
const anchor=document.querySelector('.markaz-title');anchor.parentNode.insertBefore(card,anchor);
const m=document.createElement('div');m.className='an-modal';
m.innerHTML='<div class="an-box"><div class="an-head"><span>📢 الإعلانات</span><button class="an-x" id="anX">✕</button></div><div class="an-tabs" id="anTabs"></div><div id="anBody"></div></div>';
document.body.appendChild(m);const B=m.querySelector('#anBody');
let tab='all',q='',fs='',hal=[];
const TABS={all:'الكل',ads:'إعلانات',honor:'لوحات الشرف',photos:'صور الطلاب',ach:'إنجاز قرآني'};
function tabs(){m.querySelector('#anTabs').innerHTML=Object.entries(TABS).map(([k,v])=>`<button class="an-tab ${k===tab?'on':''}" data-t="${k}">${v}</button>`).join('')}
async function view(){
  tabs();
  if(tab==='photos')return photos();
  if(tab==='ach'){B.innerHTML='<p class="ex-hint">🚧 غير متاح حالياً: النظام يخزّن عدد صفحات الحفظ والمراجعة فقط ولا يخزّن السور أو المقرر المنجز، فما بنقدر نعرض إنجازاً حقيقياً بدون اختلاق بيانات. بيتفعّل لما تتوفر هالبيانات.</p>';return}
  B.innerHTML='<p class="ex-hint">جارِ التحميل...</p>';
  hal=await getHal();let items=await getItems();
  if(tab==='ads')items=items.filter(i=>!isHonor(i.type));if(tab==='honor')items=items.filter(i=>isHonor(i.type));
  if(q)items=items.filter(i=>(i.title+i.desc).includes(q));if(fs)items=items.filter(i=>i.status===fs);
  B.innerHTML=`<button class="btn btn-gold btn-block" data-a="new">➕ إنشاء جديد</button>
  <div class="an-row" style="margin-top:8px"><input class="an-in" id="anQ" placeholder="🔍 بحث" value="${esc(q)}"><select class="an-in" id="anF"><option value="">كل الحالات</option>${['draft','active','inactive'].map(s=>`<option value="${s}" ${fs===s?'selected':''}>${{draft:'مسودة',active:'نشط',inactive:'غير نشط'}[s]}</option>`).join('')}</select></div>`+
  (items.length?items.map(i=>`<div class="an-item"><b>${esc(i.title||'(بدون عنوان)')}</b><span class="an-tag">${TYPES[i.type]}</span><span class="an-tag ${i.status==='active'?'act':'off'}">${{draft:'مسودة',active:isActive(i)?'نشط':'نشط (خارج الفترة)',inactive:'غير نشط'}[i.status]}</span> <span class="ex-note">ترتيب ${i.order||0} · ${i.duration||10}ث</span><br>
  ${[['edit','✏️ تعديل'],['prev','👁 معاينة'],['copy','📄 نسخ'],['tog',i.status==='active'?'⏸ إيقاف':'▶ تفعيل'],['up','↑'],['down','↓'],['del','🗑']].map(([a,l])=>`<button class="an-mini" data-a="${a}" data-id="${i.id}">${l}</button>`).join('')}</div>`).join(''):'<p class="ex-hint">لا يوجد شيء بعد.</p>');
}
async function form(it){
  hal=await getHal();const n=!it;it=it||{id:'a'+Date.now().toString(36),type:'general',status:'draft',duration:10,order:99,halaqat:[],topN:'3',showPoints:true,title:'',desc:''};
  const sel=(id,opts,v)=>`<select class="an-in" id="${id}">${opts.map(([k,l])=>`<option value="${k}" ${String(v)===String(k)?'selected':''}>${l}</option>`).join('')}</select>`;
  B.innerHTML=`<div class="an-lbl">النوع</div>${sel('fType',Object.entries(TYPES),it.type)}
  <div class="an-lbl">العنوان / عبارة التكريم</div><input class="an-in" id="fTitle" value="${esc(it.title)}">
  <div class="an-lbl">الوصف / العبارة المرافقة</div><textarea class="an-in" id="fDesc" rows="2">${esc(it.desc)}</textarea>
  <div id="fAd"><div class="an-lbl">صورة (اختياري، JPG/PNG/WebP حتى 5MB)</div><input type="file" accept="image/jpeg,image/png,image/webp" id="fImg" class="an-in"><div class="ex-note" id="fImgS">${it.image?'✓ صورة محفوظة':''}</div></div>
  <div id="fHon"><div class="an-lbl">الشعبة / الشعب</div><div id="fHal">${hal.map(h=>`<label class="ex-juz" style="display:inline-flex;margin:2px"><input type="checkbox" value="${h.id}" ${it.halaqat.includes(h.id)?'checked':''}> ${esc(h.name)}</label>`).join('')}</div>
  <div class="an-row"><div><div class="an-lbl">عدد الأوائل</div>${sel('fTop',[['1','الأول'],['3','أول 3'],['5','أول 5'],['10','أول 10'],['all','الكل']],it.topN)}</div>
  <div id="fManW"><div class="an-lbl">الطالب (نجم الحلقة)</div><select class="an-in" id="fMan"><option value="">تلقائي: المتصدر</option></select></div></div>
  <label><input type="checkbox" id="fPts" ${it.showPoints?'checked':''}> إظهار النقاط</label></div>
  <div class="an-row"><div><div class="an-lbl">الحالة</div>${sel('fSt',[['draft','مسودة'],['active','نشط'],['inactive','غير نشط']],it.status)}</div>
  <div><div class="an-lbl">مدة العرض (ثانية)</div><input class="an-in" type="number" min="3" max="120" id="fDur" value="${it.duration}"></div>
  <div><div class="an-lbl">الترتيب</div><input class="an-in" type="number" id="fOrd" value="${it.order}"></div></div>
  <div class="an-row"><div><div class="an-lbl">من تاريخ</div><input class="an-in" type="date" id="fSt1" value="${it.start||''}"></div><div><div class="an-lbl">إلى تاريخ</div><input class="an-in" type="date" id="fEnd" value="${it.end||''}"></div></div>
  <div class="an-prev" id="fPrev"></div>
  <button class="btn btn-outline btn-block" data-a="fprev">👁 معاينة</button><button class="btn btn-green btn-block" style="margin-top:8px" data-a="fsave">💾 حفظ</button><button class="btn btn-outline btn-block" style="margin-top:8px" data-a="back">رجوع</button>`;
  B._it=it;B._img=it.image||'';
  const sync=async()=>{const t=B.querySelector('#fType').value,h=isHonor(t);B.querySelector('#fAd').style.display=h?'none':'';B.querySelector('#fHon').style.display=h?'':'none';B.querySelector('#fManW').style.display=t==='star'?'':'none';
    if(t==='star'){const hid=[...B.querySelectorAll('#fHal input:checked')][0];const st=hid?await getStu(hid.value):[];B.querySelector('#fMan').innerHTML='<option value="">تلقائي: المتصدر</option>'+st.map(s=>`<option value="${s.id}" ${s.id===it.studentId?'selected':''}>${esc(s.name)}</option>`).join('')}};
  B.querySelector('#fType').onchange=sync;B.querySelector('#fHal').onchange=e=>{if(B.querySelector('#fType').value!=='center'&&e.target.checked)B.querySelectorAll('#fHal input').forEach(c=>{if(c!==e.target)c.checked=false});sync()};
  B.querySelector('#fImg').onchange=async e=>{const f=e.target.files[0];if(!f)return;
    if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>5e6){B.querySelector('#fImgS').textContent='⚠ ملف غير مقبول (نوع أو حجم)';e.target.value='';return}
    try{B._img=await shrink(f,900);B.querySelector('#fImgS').textContent='✓ جاهزة'}catch(x){B.querySelector('#fImgS').textContent='⚠ تعذّر قراءة الصورة'}};
  sync();
}
function shrink(file,max){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{const r=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*r;c.height=im.height*r;c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.8))};im.onerror=rej;im.src=u})}
function collect(){const g=id=>B.querySelector(id),t=g('#fType').value,it={...B._it};
  Object.assign(it,{type:t,title:g('#fTitle').value.trim(),desc:g('#fDesc').value.trim(),status:g('#fSt').value,duration:Math.min(120,Math.max(3,+g('#fDur').value||10)),order:+g('#fOrd').value||0,start:g('#fSt1').value,end:g('#fEnd').value,image:B._img,
   halaqat:[...B.querySelectorAll('#fHal input:checked')].map(c=>c.value),topN:g('#fTop').value,showPoints:g('#fPts').checked,studentId:t==='star'?g('#fMan').value:''});return it}
function validate(it){
  if(!it.title&&!isHonor(it.type))return'العنوان مطلوب';
  if(it.start&&it.end&&it.end<it.start)return'تاريخ النهاية قبل البداية';
  if(it.status==='active'&&isHonor(it.type)&&!it.halaqat.length)return'لا يمكن تفعيل لوحة شرف بدون تحديد شعبة';return''}
async function preview(it){
  const s=await slidesFor(it,hal),p=B.querySelector('#fPrev')||B.querySelector('.an-prev');
  p.innerHTML=s.length?`<div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:12px;">${s[0].html}</div>`:emptyHtml;
}
async function photos(){
  hal=await getHal();B.innerHTML='<p class="ex-hint">جارِ التحميل...</p>';let h='<p class="ex-hint">الصور تُحفظ مصغّرة (حتى 300px) بمفتاح منفصل وتُستخدم تلقائياً بكل اللوحات.</p>';
  for(const x of hal){h+=`<h4>${esc(x.name)}</h4>`;for(const s of await getStu(x.id)){const p=await getPhoto(x.id,s.id);
    h+=`<div class="an-stu">${p?`<img src="${esc(p)}">`:`<div class="ph">${STAR_ICON}</div>`}<b style="flex:1">${esc(s.name)}</b><input type="file" accept="image/jpeg,image/png,image/webp" data-h="${x.id}" data-s="${s.id}">${p?`<button class="an-mini" data-a="delph" data-h="${x.id}" data-s="${s.id}">حذف</button>`:''}</div>`}}
  B.innerHTML=h}
B.addEventListener('change',async e=>{
  if(e.target.id==='anF'){fs=e.target.value;view()}
  if(e.target.dataset.s&&e.target.type==='file'){const f=e.target.files[0];if(!f)return;
    if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>5e6)return alert('نوع الملف أو حجمه غير مقبول');
    try{const d=await shrink(f,300),k=P+e.target.dataset.h+':'+e.target.dataset.s;if(!await sset(k,{d}))throw 0;photoCache[k]=d;photos()}catch(x){alert('تعذّر حفظ الصورة')}}});
B.addEventListener('input',e=>{if(e.target.id==='anQ'){q=e.target.value.trim();clearTimeout(B._t);B._t=setTimeout(()=>{view().then(()=>{const i=B.querySelector('#anQ');i.focus();i.setSelectionRange(99,99)})},400)}});
B.addEventListener('click',async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,id=b.dataset.id;
  const items=id?await getItems():[],it=items.find(x=>x.id===id);
  if(a==='new')return form();if(a==='back')return view();if(a==='edit')return form(it);
  if(a==='fprev')return preview(collect());
  if(a==='fsave'){const x=collect(),er=validate(x);if(er)return alert(er);if(await saveItem(x)){view()}else alert('⚠ تعذّر الحفظ، تأكدي من الإنترنت');return}
  if(a==='prev'){hal=await getHal();B.innerHTML='<div class="an-prev"></div><button class="btn btn-outline btn-block" data-a="back">رجوع</button>';return preview(it)}
  if(a==='copy'){const c={...it,id:'a'+Date.now().toString(36),title:it.title+' (نسخة)',status:'draft'};await saveItem(c);return view()}
  if(a==='tog'){const er=it.status==='active'?'':validate({...it,status:'active'});if(er)return alert(er);it.status=it.status==='active'?'inactive':'active';await saveItem(it);return view()}
  if(a==='up'||a==='down'){const i=items.findIndex(x=>x.id===id),j=i+(a==='up'?-1:1);if(j<0||j>=items.length)return;items.forEach((x,k)=>x.order=k+1);[items[i].order,items[j].order]=[items[j].order,items[i].order];for(const x of items)await saveItem(x);return view()}
  if(a==='del'){if(confirm('حذف هذا العنصر نهائياً؟')){await delItem(id);view()}return}
  if(a==='delph'){const k=P+b.dataset.h+':'+b.dataset.s;await window.storage.delete(k,false);delete photoCache[k];photos()}});
m.querySelector('#anTabs').addEventListener('click',e=>{const t=e.target.dataset.t;if(t){tab=t;view()}});
m.querySelector('#anX').onclick=()=>m.style.display='none';
document.getElementById('anOpen').onclick=()=>{m.style.display='flex';view()};
document.getElementById('anScreen').onclick=()=>window.open(location.href.split('#')[0]+'#display','_blank');
})();
