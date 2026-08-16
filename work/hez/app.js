/* ═══════════════════════════════════════════════════════════
   HÊZ — interactions
   The live "next class" countdown is real: it reads the actual
   schedule against the visitor's own clock.
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)');

/* ── copy ────────────────────────────────────────────────── */
const T = {
  en:{dir:'ltr',d:{
    'nav.sched':'Schedule','nav.floor':'The floor','nav.join':'Membership','nav.trial':'Free week',
    'hero.l1':'Strength','hero.l2':'is a habit,','hero.l3':'not a mood.',
    'hero.sub':"Coached classes, a full free-weight floor, and doors open from five in the morning until midnight. Duhok's serious room.",
    'hero.cta1':'Claim a free week','hero.cta2':'See the schedule',
    'live.next':'Next class',
    'sched.ey':'Timetable','sched.h1':'Every class,','sched.h2':'every day.',
    'sched.sub':'Classes are capped at fourteen so the coach can actually see you. Book on the app or just turn up ten minutes early.',
    'floor.ey':'The floor','floor.h':'Twelve hundred square metres.',
    'floor.c1':'Main floor','floor.c2':'Free weights to 60 kg','floor.c3':'Conditioning','floor.c4':'Coached lifting','floor.c5':'Cycle studio',
    'floor.s1':'Square metres','floor.s2':'Coaches','floor.s3':'Classes a week','floor.s4':'Open daily',
    'join.ey':'Membership','join.h1':'Three ways in.',
    'join.sub':'No joining fee, no contract, cancel whenever. Prices in Iraqi dinar per month.',
    'trial.ey':'Free week','trial.h1':'Seven days.','trial.h2':'No card needed.',
    'trial.p':'Full access to the floor and every class for a week. If it is not for you, walk away — we will not chase you.',
    'trial.i1':'Open','trial.i1v':'Every day · 05:00 – 00:00','trial.i2':'Where','trial.i2v':'Malta Road, Duhok','trial.i3':'Phone',
    'trial.g0':'What are you here for?','trial.g1':'Strength','trial.g2':'Conditioning','trial.g3':'Classes','trial.g4':'Sport',
    'trial.f1':'Name','trial.f2':'Phone','trial.f3':'Start day',
    'trial.send':'Start the free week','trial.ok':'Thank you — this is a demonstration site, so nothing was actually sent.',
    'foot.tag':'Athletic Club · Duhok, Kurdistan','foot.demo':'Concept site — not a real gym.',
    'x.free':'Places free','x.full':'Full','x.today':'Today','x.tomorrow':'Tomorrow','x.opens':'Opens in','x.now':'On now'
  }},
  ckb:{dir:'ltr',d:{
    'nav.sched':'خشتە','nav.floor':'هۆڵەکە','nav.join':'ئەندامێتی','nav.trial':'هەفتەی بەخۆڕایی',
    'hero.l1':'هێز','hero.l2':'ڕاهێنانە،','hero.l3':'نەک حاڵەت.',
    'hero.sub':'پۆلی ڕاهێنەردار، هۆڵێکی تەواوی قورسایی ئازاد، و دەرگاکان لە پێنجی بەیانییەوە تا نیوەشەو کراوەن.',
    'hero.cta1':'هەفتەیەکی بەخۆڕایی وەربگرە','hero.cta2':'خشتەکە ببینە',
    'live.next':'پۆلی داهاتوو',
    'sched.ey':'خشتەی کات','sched.h1':'هەموو پۆلێک،','sched.h2':'هەموو ڕۆژێک.',
    'sched.sub':'پۆلەکان بە چواردە کەس سنووردارکراون تا ڕاهێنەرەکە بەڕاستی بتبینێت. لە ئەپەکە حیجز بکە یان دە خولەک زوو وەرە.',
    'floor.ey':'هۆڵەکە','floor.h':'دوازدە سەد مەتر دووجا.',
    'floor.c1':'هۆڵی سەرەکی','floor.c2':'قورسایی تا ٦٠ کگم','floor.c3':'ڕاهێنانی توندی','floor.c4':'هەڵگرتنی ڕاهێنەردار','floor.c5':'ستۆدیۆی پاسکیل',
    'floor.s1':'مەتر دووجا','floor.s2':'ڕاهێنەر','floor.s3':'پۆل لە هەفتەیەکدا','floor.s4':'کاتژمێر ڕۆژانە',
    'join.ey':'ئەندامێتی','join.h1':'سێ ڕێگا بۆ ئەندامبوون.',
    'join.sub':'بەبێ کرێی دەستپێک، بەبێ گرێبەست، هەر کاتێک بتەوێت هەڵدەوەشێتەوە. نرخەکان بە دیناری عێراقی بۆ مانگێک.',
    'trial.ey':'هەفتەی بەخۆڕایی','trial.h1':'حەوت ڕۆژ.','trial.h2':'پێویست بە کارت ناکات.',
    'trial.p':'دەستڕاگەیشتنی تەواو بۆ هۆڵەکە و هەموو پۆلێک بۆ ماوەی هەفتەیەک. ئەگەر بۆ تۆ نەبوو، بڕۆ — بەدواتدا نایەین.',
    'trial.i1':'کراوە','trial.i1v':'هەموو ڕۆژێک · ٠٥:٠٠ – ٠٠:٠٠','trial.i2':'شوێن','trial.i2v':'ڕێگای ماڵتا، دهۆک','trial.i3':'تەلەفۆن',
    'trial.g0':'بۆ چی لێرەیت؟','trial.g1':'هێز','trial.g2':'ڕاهێنانی توندی','trial.g3':'پۆلەکان','trial.g4':'وەرزش',
    'trial.f1':'ناو','trial.f2':'ژمارە','trial.f3':'ڕۆژی دەستپێک',
    'trial.send':'هەفتەی بەخۆڕایی دەستپێبکە','trial.ok':'سوپاس — ئەمە ماڵپەڕێکی نموونەییە، بۆیە هیچ شتێک نەنێردرا.',
    'foot.tag':'یانەی وەرزشی · دهۆک، کوردستان','foot.demo':'ماڵپەڕی نموونەیی — یانەیەکی ڕاستەقینە نییە.',
    'x.free':'شوێنی بەتاڵ','x.full':'پڕە','x.today':'ئەمڕۆ','x.tomorrow':'سبەینێ','x.opens':'دەستپێدەکات لە','x.now':'ئێستا بەردەوامە'
  }},
  ar:{dir:'rtl',d:{
    'nav.sched':'الجدول','nav.floor':'الصالة','nav.join':'العضوية','nav.trial':'أسبوع مجاني',
    'hero.l1':'القوة','hero.l2':'عادة،','hero.l3':'وليست مزاجاً.',
    'hero.sub':'حصص بمدربين، صالة أوزان حرة كاملة، وأبواب مفتوحة من الخامسة صباحاً حتى منتصف الليل.',
    'hero.cta1':'احصل على أسبوع مجاني','hero.cta2':'شاهد الجدول',
    'live.next':'الحصة القادمة',
    'sched.ey':'الجدول','sched.h1':'كل حصة،','sched.h2':'كل يوم.',
    'sched.sub':'الحصص محدودة بأربعة عشر شخصاً ليتمكن المدرب من رؤيتك فعلاً. احجز عبر التطبيق أو احضر قبل عشر دقائق.',
    'floor.ey':'الصالة','floor.h':'ألف ومئتا متر مربع.',
    'floor.c1':'الصالة الرئيسية','floor.c2':'أوزان حرة حتى ٦٠ كغم','floor.c3':'لياقة','floor.c4':'رفع بإشراف','floor.c5':'استوديو الدراجات',
    'floor.s1':'متر مربع','floor.s2':'مدربين','floor.s3':'حصة أسبوعياً','floor.s4':'ساعة يومياً',
    'join.ey':'العضوية','join.h1':'ثلاث طرق للانضمام.',
    'join.sub':'بلا رسوم انضمام، بلا عقد، ألغِ متى شئت. الأسعار بالدينار العراقي شهرياً.',
    'trial.ey':'أسبوع مجاني','trial.h1':'سبعة أيام.','trial.h2':'بلا بطاقة.',
    'trial.p':'وصول كامل للصالة ولكل حصة لمدة أسبوع. إن لم تناسبك، امضِ — لن نلاحقك.',
    'trial.i1':'مفتوح','trial.i1v':'كل يوم · ٠٥:٠٠ – ٠٠:٠٠','trial.i2':'الموقع','trial.i2v':'طريق مالطا، دهوك','trial.i3':'الهاتف',
    'trial.g0':'لماذا أنت هنا؟','trial.g1':'القوة','trial.g2':'اللياقة','trial.g3':'الحصص','trial.g4':'الرياضة',
    'trial.f1':'الاسم','trial.f2':'الهاتف','trial.f3':'يوم البدء',
    'trial.send':'ابدأ الأسبوع المجاني','trial.ok':'شكراً — هذا موقع تجريبي، لذلك لم يُرسل شيء فعلياً.',
    'foot.tag':'نادي رياضي · دهوك، كردستان','foot.demo':'موقع تجريبي — ليس نادياً حقيقياً.',
    'x.free':'أماكن متاحة','x.full':'مكتملة','x.today':'اليوم','x.tomorrow':'غداً','x.opens':'يبدأ بعد','x.now':'جارية الآن'
  }}
};

/* ── classes ─────────────────────────────────────────────── */
const CL = {
  strength:{ en:'Strength',   ckb:'هێز',            ar:'قوة' },
  metcon:  { en:'Metcon',     ckb:'مێتکۆن',         ar:'ميتكون' },
  cycle:   { en:'Cycle',      ckb:'پاسکیل',         ar:'دراجات' },
  boxing:  { en:'Boxing',     ckb:'بۆکسینگ',        ar:'ملاكمة' },
  mobility:{ en:'Mobility',   ckb:'جووڵە',          ar:'مرونة' },
  olympic: { en:'Olympic Lift',ckb:'هەڵگرتنی ئۆلۆمپی',ar:'رفع أولمبي' },
  core:    { en:'Core',       ckb:'ناوەند',         ar:'وسط الجسم' }
};
const COACH = ['Aram','Dilan','Hemin','Rojin','Sipan','Bahar'];

/* [hour, minute, classKey, durationMin, capacityTaken] per weekday 0=Sun … 6=Sat */
const WEEK = [
  [[6,0,'strength',60,9],[7,30,'metcon',45,14],[12,0,'core',30,6],[17,30,'boxing',60,11],[19,0,'cycle',45,8],[20,30,'mobility',45,4]],
  [[6,0,'olympic',75,7],[8,0,'cycle',45,12],[12,30,'core',30,5],[17,0,'strength',60,14],[18,30,'metcon',45,10],[20,0,'boxing',60,6]],
  [[6,0,'strength',60,8],[7,30,'mobility',45,3],[12,0,'metcon',45,9],[17,30,'cycle',45,13],[19,0,'olympic',75,6],[20,30,'core',30,7]],
  [[6,0,'metcon',45,11],[8,0,'strength',60,10],[12,0,'cycle',45,4],[17,0,'boxing',60,14],[18,30,'mobility',45,5],[20,0,'strength',60,9]],
  [[6,0,'olympic',75,6],[7,30,'metcon',45,12],[12,30,'core',30,8],[17,30,'strength',60,14],[19,0,'boxing',60,9],[20,30,'cycle',45,7]],
  [[7,0,'strength',60,7],[9,0,'metcon',45,10],[11,0,'mobility',45,6],[17,0,'cycle',45,11],[18,30,'core',30,4]],
  [[7,0,'metcon',45,13],[9,0,'olympic',75,5],[11,0,'boxing',60,8],[16,0,'strength',60,12],[18,0,'cycle',45,9],[19,30,'mobility',45,3]]
];
const CAP = 14;

const DAYS = {
  en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  ckb:['یەکشەممە','دووشەممە','سێشەممە','چوارشەممە','پێنجشەممە','هەینی','شەممە'],
  ar:['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت']
};

const PLANS = [
  { p:'45,000', best:false,
    en:['Off-Peak','Floor access before 16:00','No class booking','Locker &amp; towel'],
    ckb:['کاتی کەم','دەستڕاگەیشتن پێش ١٦:٠٠','بێ حیجزکردنی پۆل','دۆڵابچە و خاولی'],
    ar:['خارج الذروة','دخول الصالة قبل ١٦:٠٠','بلا حجز حصص','خزانة ومنشفة'] },
  { p:'70,000', best:true,
    en:['Full','Any hour, any day','Every class included','Locker, towel &amp; guest pass'],
    ckb:['تەواو','هەر کاتژمێرێک، هەر ڕۆژێک','هەموو پۆلێک لەخۆدەگرێت','دۆڵابچە، خاولی و کارتی میوان'],
    ar:['كاملة','أي ساعة، أي يوم','كل الحصص مشمولة','خزانة ومنشفة وبطاقة ضيف'] },
  { p:'120,000', best:false,
    en:['Coached','Everything in Full','Two 1-to-1 sessions a month','Programme written for you'],
    ckb:['ڕاهێنەردار','هەموو شتی تەواو','دوو دانیشتنی تاک بۆ تاک لە مانگێکدا','پڕۆگرامێک بۆ خۆت'],
    ar:['بإشراف','كل ما في الكاملة','جلستان فرديتان شهرياً','برنامج مكتوب لك'] }
];

/* ── language ────────────────────────────────────────────── */
let lang = 'en';
try { lang = localStorage.getItem('hez.lang') || 'en'; } catch (_) {}
if (!T[lang]) lang = 'en';
const t = k => T[lang].d[k] ?? T.en.d[k] ?? '';

function applyLang(code){
  lang = code;
  document.documentElement.lang = code;
  document.documentElement.dir = T[code].dir;
  $$('[data-i18n]').forEach(el => { const v = T[code].d[el.dataset.i18n]; if (v != null) el.textContent = v; });
  $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === code));
  try { localStorage.setItem('hez.lang', code); } catch (_) {}
  renderDays(); renderSlots(activeDay); renderPlans(); renderMarquee(); tickLive();
}
$$('.lang button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

/* ── schedule render ─────────────────────────────────────── */
const today = new Date().getDay();
/* open on the day holding the next class, not simply today — otherwise after the last
   session of the evening the timetable shows a day with nothing highlighted */
let activeDay = (nextClass() || { day: today }).day;
const pad = n => String(n).padStart(2,'0');
const hhmm = (h,m) => `${pad(h)}:${pad(m)}`;

function renderDays(){
  $('#days').innerHTML = DAYS[lang].map((d,i) =>
    `<button role="tab" class="${i === activeDay ? 'on' : ''}${i === today ? ' today' : ''}" data-d="${i}">${d}</button>`
  ).join('');
}
$('#days').addEventListener('click', e => {
  const b = e.target.closest('[data-d]');
  if (!b) return;
  activeDay = +b.dataset.d;
  renderDays(); renderSlots(activeDay);
});

function renderSlots(day){
  const next = nextClass();
  $('#slots').innerHTML = WEEK[day].map((s,i) => {
    const [h,m,key,dur,taken] = s;
    const free = CAP - taken;
    const isNext = next && next.day === day && next.i === i;
    return `<article class="slot${isNext ? ' slot--next' : ''}" style="transition-delay:${i*45}ms">
      <span class="slot__t">${hhmm(h,m)}</span>
      <span class="slot__n">${CL[key][lang] || CL[key].en}</span>
      <span class="slot__c">${COACH[(day + i) % COACH.length]} · ${dur}′</span>
      <span class="slot__b ${free > 0 ? 'slot__b--free' : 'slot__b--full'}">${free > 0 ? free + ' ' + t('x.free') : t('x.full')}</span>
    </article>`;
  }).join('');
  $$('.slot').forEach(el => io.observe(el));
}

/* ── the live countdown ──────────────────────────────────── */
function nextClass(){
  const now = new Date();
  for (let ahead = 0; ahead < 8; ahead++){
    const day = (now.getDay() + ahead) % 7;
    const list = WEEK[day];
    for (let i = 0; i < list.length; i++){
      const [h,m,key,dur,taken] = list[i];
      const when = new Date(now);
      when.setDate(now.getDate() + ahead);
      when.setHours(h, m, 0, 0);
      const ends = new Date(when.getTime() + dur * 60000);
      if (ahead === 0 && now >= when && now < ends)
        return { day, i, key, when, dur, taken, live:true };
      if (when > now) return { day, i, key, when, dur, taken, live:false };
    }
  }
  return null;
}

function tickLive(){
  const n = nextClass();
  if (!n) return;
  $('#liveName').textContent = CL[n.key][lang] || CL[n.key].en;

  if (n.live){
    $('#liveTime').textContent = t('x.now');
    $('#liveMeta').textContent = `${hhmm(n.when.getHours(), n.when.getMinutes())} · ${n.dur}′`;
    return;
  }
  const ms = n.when - new Date();
  const s  = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
  $('#liveTime').textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;

  const isToday = n.when.toDateString() === new Date().toDateString();
  const dayLabel = isToday ? t('x.today') : DAYS[lang][n.day];
  $('#liveMeta').textContent = `${dayLabel} · ${hhmm(n.when.getHours(), n.when.getMinutes())} · ${CAP - n.taken} ${t('x.free')}`;
}

/* ── plans + marquee ─────────────────────────────────────── */
function renderPlans(){
  $('#plans').innerHTML = PLANS.map((p,i) => {
    const [name, ...feats] = p[lang] || p.en;
    return `<article class="plan${p.best ? ' plan--best' : ''}" style="transition-delay:${i*70}ms">
      ${p.best ? `<span class="plan__tag">★</span>` : ''}
      <h3>${name}</h3>
      <div class="plan__p"><b>${p.p}</b><em>IQD / ${lang === 'ar' ? 'شهر' : lang === 'ckb' ? 'مانگ' : 'month'}</em></div>
      <ul>${feats.map(f => `<li>${f}</li>`).join('')}</ul>
      <a class="btn btn--full" href="#trial">${t('nav.trial')}</a>
    </article>`;
  }).join('');
  $$('.plan').forEach(el => io.observe(el));
}

function renderMarquee(){
  const names = Object.values(CL).map(c => c[lang] || c.en);
  const strip = names.map(n => `<span>${n}</span>`).join('');
  $('#marq').innerHTML = strip + strip;
}

/* ── reveals + counters ──────────────────────────────────── */
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add('in');
  $$('.line', en.target).forEach(l => l.classList.add('in'));
  io.unobserve(en.target);
}), { threshold:.14, rootMargin:'0px 0px -6% 0px' });
$$('.reveal, .h2, .hero h1').forEach(el => io.observe(el));
setTimeout(() => $$('.reveal:not(.in),.line:not(.in),.slot:not(.in),.plan:not(.in)').forEach(e => e.classList.add('in')), 1700);

const cio = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  const el = en.target; cio.unobserve(el);
  const to = +el.dataset.to, sfx = el.dataset.suffix || '';
  const fmt = n => (el.hasAttribute('data-comma') ? n.toLocaleString('en') : String(n)) + sfx;
  if (RM.matches) { el.textContent = fmt(to); return; }
  const t0 = performance.now();
  const step = ts => {
    const k = Math.min(1, (ts - t0) / 1200);
    el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}), { threshold:.6 });
$$('.num').forEach(n => cio.observe(n));

/* ── nav ─────────────────────────────────────────────────── */
const nav = $('#nav'), prog = $('#navprog');
addEventListener('scroll', () => {
  nav.classList.toggle('stuck', scrollY > 30);
  const max = document.body.scrollHeight - innerHeight;
  prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
}, { passive:true });

const burger = $('#burger'), sheet = $('#sheet');
burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!open));
  sheet.toggleAttribute('hidden', open);
  document.body.classList.toggle('lock', !open);
});
$$('#sheet a').forEach(a => a.addEventListener('click', () => {
  burger.setAttribute('aria-expanded','false'); sheet.setAttribute('hidden',''); document.body.classList.remove('lock');
}));

/* ── form ────────────────────────────────────────────────── */
$$('#goal button').forEach(b => b.addEventListener('click', () => {
  $$('#goal button').forEach(x => x.classList.toggle('on', x === b));
}));
const form = $('#trialform'), ok = $('#okmsg');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  ok.hidden = false;
  form.querySelector('button[type=submit]').disabled = true;
});
const di = form.querySelector('input[type=date]');
if (di){ const d = new Date(); di.min = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; di.value = di.min; }

/* pause the hero loop off-screen */
{
  const v = $('.hero__v');
  new IntersectionObserver(es => { es[0].isIntersecting ? v.play().catch(()=>{}) : v.pause(); }, { threshold:.05 }).observe(v);
}

/* ── boot ────────────────────────────────────────────────── */
applyLang(lang);
setInterval(tickLive, 1000);
requestAnimationFrame(() => $$('.hero .line, .hero .reveal').forEach(e => e.classList.add('in')));
})();
