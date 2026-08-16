/* ═══════════════════════════════════════════════════════════
   ZAGROS MOTORS — interactions
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)');

/* ── copy ────────────────────────────────────────────────── */
const T = {
  en:{dir:'ltr',d:{
    'nav.stock':'Stock','nav.featured':'Featured','nav.why':'Why us','nav.visit':'Visit','nav.drive':'Test drive',
    'hero.ey':'Duhok · 41 cars on the floor today',
    'hero.l1':'Every car','hero.l2':'comes with its','hero.l3':'inspection sheet.',
    'hero.sub':'Chassis, service history, accident record and customs papers — printed, stapled and handed to you before you are asked for a single dollar.',
    'hero.cta1':'Browse the stock','hero.cta2':'Book a test drive',
    'hero.s1':'In stock','hero.s2':'Point check','hero.s3':'Warranty','hero.s4':'Trading since',
    'stock.ey':'Current stock','stock.h1':'On the floor','stock.h2':'right now.',
    'stock.f1':'All','stock.f2':'Full-size SUV','stock.f3':'Mid-size','stock.f4':'Luxury',
    'stock.sort':'Sort','stock.s1':'Newest','stock.s2':'Price low to high','stock.s3':'Price high to low','stock.s4':'Lowest km',
    'feat.ey':"This week's pick",'feat.h1':'Land Cruiser',
    'feat.p':'One owner from new, serviced at the agency every 5,000 km, never off tarmac. Papers clean and in the car.',
    'feat.price':'Asking','feat.neg':'negotiable','feat.cta':'Book this car for a drive',
    'road.h1':'Between here','road.h2':'and anywhere.',
    'road.p':'Every car we sell is driven the Duhok–Zakho road and back before it reaches the floor. If something is going to rattle, it rattles for us first.',
    'why.ey':'Why us','why.h':'Four things we do differently.',
    'drive.ey':'Test drive','drive.h1':'Take it out','drive.h2':'for an hour.',
    'drive.p':'No salesperson in the passenger seat unless you want one. Bring your licence, take the car, drive the road you actually drive.',
    'drive.i1':'Hours','drive.i1v':'Sat – Thu · 09:00 – 19:00','drive.i2':'Where','drive.i2v':'Zaxo Road km 4, Duhok','drive.i3':'Phone',
    'drive.f0':'Which car','drive.f1':'Name','drive.f2':'Phone','drive.f3':'Day','drive.f4':'Time','drive.f5':'I have a car to trade in',
    'drive.send':'Request the drive','drive.ok':'Thank you — this is a demonstration site, so nothing was actually sent.',
    'foot.tag':'Duhok, Kurdistan · Trading since 2017','foot.demo':'Concept site — not a real dealership.'
  }},
  ckb:{dir:'ltr',d:{
    'nav.stock':'ئۆتۆمبێلەکان','nav.featured':'دیاریکراو','nav.why':'بۆچی ئێمە','nav.visit':'سەردان','nav.drive':'تاقیکردنەوە',
    'hero.ey':'دهۆک · ٤١ ئۆتۆمبێل ئەمڕۆ ئامادەن',
    'hero.l1':'هەموو ئۆتۆمبێلێک','hero.l2':'بە پەڕەی','hero.l3':'پشکنینەوە دێت.',
    'hero.sub':'شاسی، مێژووی خزمەتگوزاری، تۆماری ڕووداو و کاغەزی گومرگ — چاپکراو و پێت دەدرێت پێش ئەوەی داوای یەک دۆلارت لێ بکرێت.',
    'hero.cta1':'ئۆتۆمبێلەکان ببینە','hero.cta2':'تاقیکردنەوە حیجز بکە',
    'hero.s1':'ئامادە','hero.s2':'خاڵی پشکنین','hero.s3':'گەرەنتی','hero.s4':'لە کارداین',
    'stock.ey':'ئۆتۆمبێلە ئامادەکان','stock.h1':'ئێستا','stock.h2':'لەبەردەستدان.',
    'stock.f1':'هەموو','stock.f2':'ئێس یو ڤی گەورە','stock.f3':'مامناوەند','stock.f4':'خۆشگوزەرانی',
    'stock.sort':'ڕیزکردن','stock.s1':'نوێترین','stock.s2':'نرخ لە کەمەوە','stock.s3':'نرخ لە زۆرەوە','stock.s4':'کەمترین کیلۆمەتر',
    'feat.ey':'هەڵبژاردەی ئەم هەفتەیە','feat.h1':'لاند کروزەر',
    'feat.p':'یەک خاوەن لە نوێوە، هەر ٥,٠٠٠ کیلۆمەتر لە کۆمپانیاکە خزمەتی پێکراوە، هەرگیز لە دەرەوەی ڕێگا نەڕۆیشتووە. کاغەزەکان پاکن.',
    'feat.price':'نرخ','feat.neg':'گفتوگۆی لەسەر دەکرێت','feat.cta':'ئەم ئۆتۆمبێلە بۆ تاقیکردنەوە حیجز بکە',
    'road.h1':'لە نێوان ئێرە','road.h2':'و هەر شوێنێک.',
    'road.p':'هەموو ئۆتۆمبێلێک کە دەیفرۆشین، ڕێگای دهۆک–زاخۆ و گەڕانەوەی پێدا لێدەخوڕدرێت پێش ئەوەی بگاتە فرۆشگا.',
    'why.ey':'بۆچی ئێمە','why.h':'چوار شت بە جیاوازی دەکەین.',
    'drive.ey':'تاقیکردنەوە','drive.h1':'کاتژمێرێک','drive.h2':'لێی بخوڕە.',
    'drive.p':'هیچ فرۆشیارێک لە کورسی تەنیشتەوە نییە مەگەر خۆت بتەوێت. مۆڵەتەکەت بهێنە، ئۆتۆمبێلەکە ببە، ئەو ڕێگایە بخوڕە کە بەڕاستی دەیخوڕیت.',
    'drive.i1':'کاتژمێر','drive.i1v':'شەممە – پێنجشەممە · ٠٩:٠٠ – ١٩:٠٠','drive.i2':'شوێن','drive.i2v':'ڕێگای زاخۆ کم ٤، دهۆک','drive.i3':'تەلەفۆن',
    'drive.f0':'کام ئۆتۆمبێل','drive.f1':'ناو','drive.f2':'ژمارە','drive.f3':'ڕۆژ','drive.f4':'کات','drive.f5':'ئۆتۆمبێلێکم هەیە بۆ گۆڕینەوە',
    'drive.send':'داوای تاقیکردنەوە بکە','drive.ok':'سوپاس — ئەمە ماڵپەڕێکی نموونەییە، بۆیە هیچ شتێک نەنێردرا.',
    'foot.tag':'دهۆک، کوردستان · لە ٢٠١٧ەوە','foot.demo':'ماڵپەڕی نموونەیی — فرۆشگایەکی ڕاستەقینە نییە.'
  }},
  ar:{dir:'rtl',d:{
    'nav.stock':'المعروض','nav.featured':'المميز','nav.why':'لماذا نحن','nav.visit':'زورونا','nav.drive':'تجربة قيادة',
    'hero.ey':'دهوك · ٤١ سيارة متوفرة اليوم',
    'hero.l1':'كل سيارة','hero.l2':'تأتي مع','hero.l3':'تقرير فحصها.',
    'hero.sub':'الشاسيه، سجل الصيانة، تقرير الحوادث وأوراق الجمرك — مطبوعة ومرفقة وتُسلَّم لك قبل أن يُطلب منك دولار واحد.',
    'hero.cta1':'تصفح المعروض','hero.cta2':'احجز تجربة قيادة',
    'hero.s1':'متوفرة','hero.s2':'نقطة فحص','hero.s3':'ضمان','hero.s4':'سنوات عمل',
    'stock.ey':'المعروض حالياً','stock.h1':'متوفر','stock.h2':'الآن.',
    'stock.f1':'الكل','stock.f2':'دفع رباعي كبير','stock.f3':'متوسطة','stock.f4':'فاخرة',
    'stock.sort':'ترتيب','stock.s1':'الأحدث','stock.s2':'السعر تصاعدي','stock.s3':'السعر تنازلي','stock.s4':'الأقل كيلومترات',
    'feat.ey':'اختيار هذا الأسبوع','feat.h1':'لاند كروزر',
    'feat.p':'مالك واحد منذ الجديد، صيانة في الوكالة كل ٥٬٠٠٠ كم، لم تخرج عن الإسفلت. الأوراق نظيفة وموجودة في السيارة.',
    'feat.price':'السعر','feat.neg':'قابل للتفاوض','feat.cta':'احجز هذه السيارة للتجربة',
    'road.h1':'بين هنا','road.h2':'وأي مكان.',
    'road.p':'كل سيارة نبيعها تُقاد على طريق دهوك–زاخو ذهاباً وإياباً قبل أن تصل للمعرض. إن كان هناك ما سيصدر صوتاً، فسيصدره لنا أولاً.',
    'why.ey':'لماذا نحن','why.h':'أربعة أشياء نفعلها بشكل مختلف.',
    'drive.ey':'تجربة قيادة','drive.h1':'خذها','drive.h2':'لمدة ساعة.',
    'drive.p':'لا بائع في المقعد المجاور إلا إذا أردت. أحضر رخصتك، خذ السيارة، وقُد الطريق الذي تقوده فعلاً.',
    'drive.i1':'الأوقات','drive.i1v':'السبت – الخميس · ٠٩:٠٠ – ١٩:٠٠','drive.i2':'الموقع','drive.i2v':'طريق زاخو كم ٤، دهوك','drive.i3':'الهاتف',
    'drive.f0':'أي سيارة','drive.f1':'الاسم','drive.f2':'الهاتف','drive.f3':'اليوم','drive.f4':'الوقت','drive.f5':'لدي سيارة للمقايضة',
    'drive.send':'اطلب التجربة','drive.ok':'شكراً — هذا موقع تجريبي، لذلك لم يُرسل شيء فعلياً.',
    'foot.tag':'دهوك، كردستان · نعمل منذ ٢٠١٧','foot.demo':'موقع تجريبي — ليس معرضاً حقيقياً.'
  }}
};

/* ── stock ───────────────────────────────────────────────── */
const CARS = [
  { img:'car-01', y:2021, km:64000, p:52000, cat:'suv', flag:null,     tr:'auto', fuel:'petrol', name:'Toyota Land Cruiser VX' },
  { img:'car-02', y:2023, km:21000, p:96000, cat:'lux', flag:'new in', tr:'auto', fuel:'petrol', name:'Mercedes G 500' },
  { img:'car-03', y:2022, km:38000, p:78000, cat:'lux', flag:null,     tr:'auto', fuel:'petrol', name:'Cadillac Escalade' },
  { img:'car-04', y:2020, km:88000, p:41000, cat:'mid', flag:null,     tr:'auto', fuel:'petrol', name:'Lexus RX 350' },
  { img:'car-05', y:2022, km:45000, p:57000, cat:'suv', flag:'sold',   tr:'auto', fuel:'diesel', name:'Toyota Prado TXL' },
  { img:'car-06', y:2023, km:19000, p:84000, cat:'lux', flag:null,     tr:'auto', fuel:'petrol', name:'Chevrolet Tahoe RST' },
  { img:'car-07', y:2021, km:71000, p:36000, cat:'mid', flag:null,     tr:'auto', fuel:'petrol', name:'Alfa Romeo Stelvio' },
  { img:'showroom', y:2022, km:52000, p:63000, cat:'suv', flag:null,   tr:'auto', fuel:'petrol', name:'Nissan Patrol SE' }
];

const TRIMS = [
  { img:'car-01', c:'#2B2F33', en:'Graphite', ckb:'ڕەساسی', ar:'غرافيت' },
  { img:'car-04', c:'#E8E9EA', en:'Pearl',    ckb:'مرواری', ar:'لؤلؤي' },
  { img:'car-02', c:'#39463A', en:'Olive',    ckb:'زەیتوونی', ar:'زيتوني' },
  { img:'car-07', c:'#8E2F2A', en:'Red',      ckb:'سوور',   ar:'أحمر' }
];

const SPECS = [
  { en:['Engine','4.0 V6'],       ckb:['بزوێنەر','4.0 V6'],        ar:['المحرك','4.0 V6'] },
  { en:['Year','2022'],           ckb:['ساڵ','٢٠٢٢'],              ar:['السنة','٢٠٢٢'] },
  { en:['Kilometres','44,800'],   ckb:['کیلۆمەتر','٤٤,٨٠٠'],       ar:['الكيلومترات','٤٤٬٨٠٠'] },
  { en:['Gearbox','8-speed auto'],ckb:['گێربۆکس','ئۆتۆماتیک ٨'],   ar:['ناقل الحركة','أوتوماتيك ٨'] },
  { en:['Drive','Full-time 4WD'], ckb:['لێخوڕین','٤ چەرخ'],        ar:['الدفع','رباعي دائم'] },
  { en:['Owners','One'],          ckb:['خاوەن','یەک'],             ar:['المُلّاك','واحد'] },
  { en:['Customs','Cleared'],     ckb:['گومرگ','تەواوکراو'],       ar:['الجمرك','مخلَّص'] },
  { en:['Warranty','12 months'],  ckb:['گەرەنتی','١٢ مانگ'],       ar:['الضمان','١٢ شهراً'] }
];

const WHY = [
  { en:['Papers first','You see the inspection sheet, the chassis check and the customs file before we talk price.'],
    ckb:['یەکەم جار کاغەز','پەڕەی پشکنین، پشکنینی شاسی و فایلی گومرگ دەبینیت پێش ئەوەی باسی نرخ بکەین.'],
    ar:['الأوراق أولاً','ترى تقرير الفحص وفحص الشاسيه وملف الجمرك قبل أن نتحدث عن السعر.'] },
  { en:['132-point check','Done in our own workshop, not a friend\'s. The list is printed and anything failed is fixed or disclosed.'],
    ckb:['پشکنینی ١٣٢ خاڵ','لە وۆرکشۆپی خۆماندا دەکرێت. لیستەکە چاپ دەکرێت و هەر شتێک سەرکەوتوو نەبێت چاک دەکرێت یان ڕادەگەیەنرێت.'],
    ar:['فحص ١٣٢ نقطة','يُنجز في ورشتنا نحن. القائمة تُطبع وأي عطل يُصلح أو يُفصح عنه.'] },
  { en:['Twelve month warranty','Engine and gearbox, in writing, at no extra cost. It is not an upsell.'],
    ckb:['گەرەنتی ١٢ مانگ','بزوێنەر و گێربۆکس، بە نووسراوی، بەبێ تێچووی زیادە. فرۆشتنی زیادە نییە.'],
    ar:['ضمان اثني عشر شهراً','المحرك وناقل الحركة، كتابةً، بلا تكلفة إضافية. ليست خدمة إضافية مدفوعة.'] },
  { en:['We buy it back','If it is not right within thirty days we take it back at what you paid. That has happened four times.'],
    ckb:['دەیکڕینەوە','ئەگەر لە ماوەی سی ڕۆژدا گونجاو نەبوو، بەو نرخەی دات دەیگەڕێنینەوە. چوار جار ڕوویداوە.'],
    ar:['نشتريها منك','إن لم تكن مناسبة خلال ثلاثين يوماً نستردها بما دفعت. حدث ذلك أربع مرات.'] }
];

/* ── language ────────────────────────────────────────────── */
let lang = 'en';
try { lang = localStorage.getItem('zagros.lang') || 'en'; } catch (_) {}
if (!T[lang]) lang = 'en';

function applyLang(code){
  lang = code;
  document.documentElement.lang = code;
  document.documentElement.dir = T[code].dir;
  $$('[data-i18n]').forEach(el => { const v = T[code].d[el.dataset.i18n]; if (v != null) el.textContent = v; });
  $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === code));
  try { localStorage.setItem('zagros.lang', code); } catch (_) {}
  renderCars(); renderSpecs(); renderWhy(); renderSwatch(); fillCarSelect();
}
$$('.lang button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

/* ── stock grid ──────────────────────────────────────────── */
let filter = 'all', sort = 'new';
const KM = { en:'km', ckb:'کم', ar:'كم' };

function renderCars(){
  let rows = CARS.filter(c => filter === 'all' || c.cat === filter);
  rows = rows.slice().sort((a,b) =>
    sort === 'low'  ? a.p - b.p :
    sort === 'high' ? b.p - a.p :
    sort === 'km'   ? a.km - b.km : b.y - a.y);

  $('#cars').innerHTML = rows.map((c,i) => `
    <article class="car" style="transition-delay:${i*55}ms">
      <div class="car__img">
        <img src="media/${c.img}.webp" alt="${c.name}" loading="lazy" decoding="async" />
        ${c.flag ? `<span class="car__flag">${c.flag}</span>` : ''}
      </div>
      <div class="car__b">
        <div class="car__t"><span class="car__n">${c.name}</span><span class="car__p">$${c.p.toLocaleString('en')}</span></div>
        <div class="car__y">${c.y}</div>
        <div class="car__row">
          <span><i>${KM[lang]}</i> ${c.km.toLocaleString('en')}</span>
          <span><i>⛽</i> ${c.fuel}</span>
          <span><i>⚙</i> ${c.tr}</span>
        </div>
      </div>
    </article>`).join('');
  $$('.car').forEach(el => io.observe(el));
}

$$('#filters button').forEach(b => b.addEventListener('click', () => {
  $$('#filters button').forEach(x => x.classList.toggle('on', x === b));
  filter = b.dataset.f; renderCars();
}));
$('#sort').addEventListener('change', e => { sort = e.target.value; renderCars(); });

/* ── featured: trim swatches cross-fade real photos ──────── */
function renderSwatch(){
  $('#featimgs').innerHTML = TRIMS.map((t,i) =>
    `<img src="media/${t.img}.webp" alt="${t[lang] || t.en}" class="${i === 0 ? 'on' : ''}" loading="lazy" decoding="async" />`).join('');
  $('#swatch').innerHTML = TRIMS.map((t,i) =>
    `<button type="button" class="${i === 0 ? 'on' : ''}" data-i="${i}" style="background:${t.c}" aria-label="${t[lang] || t.en}"></button>`).join('');
}
$('#swatch').addEventListener('click', e => {
  const b = e.target.closest('[data-i]');
  if (!b) return;
  const i = +b.dataset.i;
  $$('#swatch button').forEach((x,j) => x.classList.toggle('on', j === i));
  $$('#featimgs img').forEach((x,j) => x.classList.toggle('on', j === i));
});

function renderSpecs(){
  $('#specs').innerHTML = SPECS.map(s => {
    const [k,v] = s[lang] || s.en;
    return `<div><dt>${k}</dt><dd>${v}</dd></div>`;
  }).join('');
}

function renderWhy(){
  $('#whygrid').innerHTML = WHY.map((w,i) => {
    const [h,p] = w[lang] || w.en;
    return `<article class="whyc" style="transition-delay:${i*70}ms"><b>0${i+1}</b><h3>${h}</h3><p>${p}</p></article>`;
  }).join('');
  $$('.whyc').forEach(el => io.observe(el));
}

function fillCarSelect(){
  const sel = $('#carselect');
  const keep = sel.value;
  sel.innerHTML = CARS.filter(c => c.flag !== 'sold')
    .map(c => `<option value="${c.name}">${c.name} — ${c.y} — $${c.p.toLocaleString('en')}</option>`).join('');
  if (keep) sel.value = keep;
}

/* ── reveals ─────────────────────────────────────────────── */
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add('in');
  $$('.line', en.target).forEach(l => l.classList.add('in'));
  io.unobserve(en.target);
}), { threshold:.15, rootMargin:'0px 0px -6% 0px' });
$$('.reveal, .h2, .hero h1').forEach(el => io.observe(el));
setTimeout(() => $$('.reveal:not(.in),.line:not(.in),.car:not(.in),.whyc:not(.in)').forEach(e => e.classList.add('in')), 1700);

/* ── counters ────────────────────────────────────────────── */
const cio = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  const el = en.target; cio.unobserve(el);
  const to = +el.dataset.to, sfx = el.dataset.suffix || '';
  const fmt = n => (el.hasAttribute('data-comma') ? n.toLocaleString('en') : String(n)) + sfx;
  if (RM.matches) { el.textContent = fmt(to); return; }
  const t0 = performance.now();
  const step = t => {
    const k = Math.min(1, (t - t0) / 1250);
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

/* ── road video: fetch only when close ───────────────────── */
{
  const v = $('.road__v');
  new IntersectionObserver((es, ob) => {
    if (!es[0].isIntersecting) return;
    v.preload = 'auto'; v.load(); v.play().catch(() => {});
    ob.disconnect();
  }, { rootMargin:'300px' }).observe(v);
}

/* ── form ────────────────────────────────────────────────── */
const form = $('#driveform'), ok = $('#okmsg');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  ok.hidden = false;
  form.querySelector('button[type=submit]').disabled = true;
});
const di = form.querySelector('input[type=date]');
if (di) { const d = new Date(); di.min = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

/* ── boot ────────────────────────────────────────────────── */
applyLang(lang);
requestAnimationFrame(() => $$('.hero .line, .hero .reveal').forEach(e => e.classList.add('in')));
})();
