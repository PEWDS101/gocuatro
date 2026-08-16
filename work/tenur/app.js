/* ═══════════════════════════════════════════════════════════
   TENÛR — interactions
   Vanilla. No dependencies. Everything degrades without JS.
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)');

/* ── 1. copy ─────────────────────────────────────────────── */
const T = {
  en: { label:'EN', dir:'ltr', d:{
    'nav.menu':'Menu','nav.story':'Our story','nav.gallery':'Gallery','nav.visit':'Visit','nav.book':'Reserve',
    'hero.eyebrow':'Duhok · Since 1984','hero.l1':'Fire.','hero.l2':'Flour.','hero.l3':'Bread.',
    'hero.sub':'Forty years of the same clay oven, the same dough, the same fire — Kurdish food the way Duhok remembers it.',
    'hero.cta1':'See the menu','hero.cta2':'Reserve a table',
    'story.eyebrow':'Our story','story.h1':'One oven.','story.h2':'Forty years.',
    'story.cap':'The oven has not gone cold since 1984.',
    'story.p1':'My grandfather built this tenûr with his own hands, out of clay dug from the riverbank. He baked the first nan in it the winter my father was born.',
    'story.p2':'Nothing about it has changed. Same clay, same wood, same fire lit before dawn. We still slap the dough to the wall by hand, still turn the kebab over coals, still send it out the moment it comes off. There is no second oven and there is no shortcut.',
    'stats.s1':'Opened','stats.s2':'Clay oven','stats.s3':'Dishes','stats.s4':'Years',
    'menu.eyebrow':'The menu','menu.h1':'Cooked over','menu.h2':'open fire.',
    'menu.sub':'Prices in Iraqi dinar. Bread and tea come with every table, and they are never charged for.',
    'menu.c1':'From the fire','menu.c2':'From the oven','menu.c3':'To begin','menu.c4':'To drink',
    'gal.eyebrow':'The room','gal.h1':'Come and sit','gal.h2':'by the fire.',
    'res.eyebrow':'Reserve','res.h1':'Keep a table','res.h2':'by the oven.',
    'res.sub':'Send it and we will confirm on WhatsApp within the hour. For more than eight people, message us directly.',
    'res.i1':'Hours','res.i1v':'Every day · 11:00 – 23:30','res.i2':'Where','res.i2v':'Zaxo Road, near Nawroz Park, Duhok','res.i3':'Phone',
    'res.f1':'Name','res.f2':'Phone','res.f3':'Date','res.f4':'Time','res.f5':'People','res.f6':'Anything we should know',
    'res.send':'Send the request','res.ok':'Thank you — this is a demonstration site, so nothing was actually sent.',
    'foot.tag':'Fire. Flour. Bread. Duhok, since 1984.','foot.demo':'Concept site — not a real restaurant.'
  }},
  ckb: { label:'KU', dir:'ltr', d:{
    'nav.menu':'خواردنەکان','nav.story':'چیرۆکی ئێمە','nav.gallery':'وێنەکان','nav.visit':'سەردانمان بکە','nav.book':'حیجزکردن',
    'hero.eyebrow':'دهۆک · لە ١٩٨٤ەوە','hero.l1':'ئاگر.','hero.l2':'ئارد.','hero.l3':'نان.',
    'hero.sub':'چل ساڵ هەمان تەنوری قوڕ، هەمان هەویر، هەمان ئاگر — خواردنی کوردی بەو شێوەیەی دهۆک لەبیریەتی.',
    'hero.cta1':'خواردنەکان ببینە','hero.cta2':'مێزێک حیجز بکە',
    'story.eyebrow':'چیرۆکی ئێمە','story.h1':'یەک تەنور.','story.h2':'چل ساڵ.',
    'story.cap':'تەنورەکە لە ١٩٨٤ەوە سارد نەبووەتەوە.','story.p1':'باپیرم ئەم تەنورەی بە دەستی خۆی دروستکرد، لە قوڕی کەناری ڕووبار. یەکەم نانی تێدا برشتی ئەو زستانەی باوکم لەدایکبوو.',
    'story.p2':'هیچ شتێک نەگۆڕاوە. هەمان قوڕ، هەمان دار، هەمان ئاگر کە پێش بەرەبەیان دادەگیرسێت. هێشتا بە دەست هەویر بە دیوارەکەوە دەنووسێنین، هێشتا کەباب بەسەر خەڵووزدا وەردەگێڕین. نە تەنوری دووەم هەیە نە ڕێگای کورتکراوە.',
    'stats.s1':'کرایەوە','stats.s2':'تەنوری قوڕ','stats.s3':'خواردن','stats.s4':'ساڵ',
    'menu.eyebrow':'خواردنەکان','menu.h1':'بەسەر','menu.h2':'ئاگری کراوە.',
    'menu.sub':'نرخەکان بە دیناری عێراقی. نان و چا لەگەڵ هەموو مێزێک دێن و هەرگیز نرخیان لەسەر ناکرێت.',
    'menu.c1':'لە ئاگرەوە','menu.c2':'لە تەنورەوە','menu.c3':'بۆ دەستپێک','menu.c4':'خواردنەوە',
    'gal.eyebrow':'شوێنەکە','gal.h1':'وەرە و دانیشە','gal.h2':'لەتەنیشت ئاگر.',
    'res.eyebrow':'حیجزکردن','res.h1':'مێزێک بۆ خۆت','res.h2':'لەتەنیشت تەنور.',
    'res.sub':'بینێرە و لە ماوەی کاتژمێرێکدا لە واتسئاپ پشتڕاستی دەکەینەوە. بۆ زیاتر لە هەشت کەس، ڕاستەوخۆ پەیوەندیمان پێوە بکە.',
    'res.i1':'کاتژمێر','res.i1v':'هەموو ڕۆژێک · ١١:٠٠ – ٢٣:٣٠','res.i2':'شوێن','res.i2v':'ڕێگای زاخۆ، نزیک پارکی نەورۆز، دهۆک','res.i3':'تەلەفۆن',
    'res.f1':'ناو','res.f2':'ژمارە','res.f3':'بەروار','res.f4':'کات','res.f5':'ژمارەی کەس','res.f6':'شتێک هەیە بیزانین',
    'res.send':'داواکارییەکە بنێرە','res.ok':'سوپاس — ئەمە ماڵپەڕێکی نموونەییە، بۆیە هیچ شتێک نەنێردرا.',
    'foot.tag':'ئاگر. ئارد. نان. دهۆک، لە ١٩٨٤ەوە.','foot.demo':'ماڵپەڕی نموونەیی — چێشتخانەیەکی ڕاستەقینە نییە.'
  }},
  ar: { label:'AR', dir:'rtl', d:{
    'nav.menu':'قائمة الطعام','nav.story':'قصتنا','nav.gallery':'الصور','nav.visit':'زورونا','nav.book':'حجز',
    'hero.eyebrow':'دهوك · منذ ١٩٨٤','hero.l1':'نار.','hero.l2':'طحين.','hero.l3':'خبز.',
    'hero.sub':'أربعون عاماً ونفس التنور الطيني، نفس العجين، نفس النار — طعام كردي كما تتذكره دهوك.',
    'hero.cta1':'شاهد القائمة','hero.cta2':'احجز طاولة',
    'story.eyebrow':'قصتنا','story.h1':'تنور واحد.','story.h2':'أربعون عاماً.',
    'story.cap':'لم يبرد التنور منذ عام ١٩٨٤.','story.p1':'بنى جدي هذا التنور بيديه، من طين حُفر من ضفة النهر. خبز فيه أول رغيف في الشتاء الذي وُلد فيه أبي.',
    'story.p2':'لم يتغير شيء. نفس الطين، نفس الحطب، نفس النار التي تُشعل قبل الفجر. ما زلنا نلصق العجين على الجدار بأيدينا، وما زلنا نقلب الكباب على الجمر. لا يوجد تنور ثانٍ ولا طريق مختصر.',
    'stats.s1':'الافتتاح','stats.s2':'تنور طيني','stats.s3':'طبق','stats.s4':'سنة',
    'menu.eyebrow':'قائمة الطعام','menu.h1':'مطبوخ على','menu.h2':'نار مكشوفة.',
    'menu.sub':'الأسعار بالدينار العراقي. الخبز والشاي يأتيان مع كل طاولة، ولا يُحسب ثمنهما أبداً.',
    'menu.c1':'من النار','menu.c2':'من التنور','menu.c3':'للبداية','menu.c4':'للشرب',
    'gal.eyebrow':'المكان','gal.h1':'تعال واجلس','gal.h2':'بجانب النار.',
    'res.eyebrow':'حجز','res.h1':'احجز طاولة','res.h2':'بجانب التنور.',
    'res.sub':'أرسل الطلب وسنؤكده على واتساب خلال ساعة. لأكثر من ثمانية أشخاص، راسلنا مباشرة.',
    'res.i1':'الأوقات','res.i1v':'كل يوم · ١١:٠٠ – ٢٣:٣٠','res.i2':'الموقع','res.i2v':'طريق زاخو، قرب حديقة نوروز، دهوك','res.i3':'الهاتف',
    'res.f1':'الاسم','res.f2':'الهاتف','res.f3':'التاريخ','res.f4':'الوقت','res.f5':'عدد الأشخاص','res.f6':'هل من شيء نعرفه',
    'res.send':'أرسل الطلب','res.ok':'شكراً — هذا موقع تجريبي، لذلك لم يُرسل شيء فعلياً.',
    'foot.tag':'نار. طحين. خبز. دهوك، منذ ١٩٨٤.','foot.demo':'موقع تجريبي — ليس مطعماً حقيقياً.'
  }}
};

/* ── 2. the menu itself ──────────────────────────────────── */
const DISHES = {
  fire: [
    { p:'9,000',  img:'dish-kebab', tag:'house',
      en:['Kebab Tenûr','Hand-minced lamb and beef, onion, parsley, turned over charcoal until the fat crisps.'],
      ckb:['کەبابی تەنور','گۆشتی بەرخ و مانگا بە دەست وردکراو، پیاز، جەعدە، بەسەر خەڵووزدا وەردەگێڕدرێت.'],
      ar:['كباب التنور','لحم غنم وبقر مفروم يدوياً، بصل، بقدونس، يُقلب على الجمر حتى تتحمص الدهون.'] },
    { p:'11,000', img:'dish-plate',
      en:['Tikka Şîş','Cubes of lamb shoulder marinated overnight, grilled with tomato and long pepper.'],
      ckb:['تیکەی شیش','پارچە گۆشتی شانی بەرخ کە بە شەو تامدراوە، لەگەڵ تەماتە و بیبەر برژاوە.'],
      ar:['تكة شيش','مكعبات كتف الغنم منقوعة طوال الليل، مشوية مع الطماطم والفلفل الطويل.'] },
    { p:'8,500',  img:'grill-close',
      en:['Şîşa Mirîşk','Chicken thigh in yoghurt, garlic and sumac, cooked close to the coals.'],
      ckb:['شیشی مریشک','ڕانی مریشک لە ماست و سیر و سماق، نزیک خەڵووز لێدەنرێت.'],
      ar:['شيش دجاج','فخذ دجاج في اللبن والثوم والسماق، يُطهى قريباً من الجمر.'] },
    { p:'14,000', img:'dish-tray', tag:'for two',
      en:['Sênî Mişterek','A mixed tray for two — kebab, tikka, chicken, grilled vegetables, rice.'],
      ckb:['سێنی موشتەرەک','سێنییەکی تێکەڵ بۆ دوو کەس — کەباب، تیکە، مریشک، سەوزەی برژاو، برنج.'],
      ar:['صينية مشتركة','صينية مشكلة لشخصين — كباب، تكة، دجاج، خضار مشوية، رز.'] }
  ],
  oven: [
    { p:'1,000',  img:'hero-tandoor',
      en:['Nanê Tenûr','Flatbread pressed to the oven wall and pulled off blistered. Free with every table.'],
      ckb:['نانی تەنور','نانی تەنور کە بە دیوارەکەوە دەنووسێنرێت. لەگەڵ هەموو مێزێک بەخۆڕاییە.'],
      ar:['خبز التنور','خبز يُلصق بجدار التنور ويُسحب منتفخاً. مجاني مع كل طاولة.'] },
    { p:'12,000', img:'dish-mezze',
      en:['Kuzî','Lamb shank cooked six hours in the cooling oven, served over spiced rice.'],
      ckb:['قوزی','قاچی بەرخ کە شەش کاتژمێر لە تەنوری سارددەبووەوە لێنراوە، لەسەر برنجی بەهارات.'],
      ar:['قوزي','موزة غنم تُطهى ست ساعات في التنور الهادئ، تُقدم على رز متبل.'] },
    { p:'7,500',  img:'dish-plate',
      en:['Lehmacun','Thin dough, minced meat, tomato and pepper — thirty seconds against the clay.'],
      ckb:['لەحمەعەجین','هەویری تەنک، گۆشتی وردکراو، تەماتە و بیبەر — سی چرکە بەردەم قوڕەکە.'],
      ar:['لحم بعجين','عجين رقيق، لحم مفروم، طماطم وفلفل — ثلاثون ثانية على الطين.'] }
  ],
  start: [
    { p:'3,500', img:'dish-mezze',
      en:['Mezze Tenûr','Seven small plates — hummus, mutabbal, cacık, olives, pickles, herbs, cheese.'],
      ckb:['مەزەی تەنور','حەوت قاپی بچووک — حومس، موتەبەل، جاجک، زەیتوون، تورشی، سەوزە، پەنیر.'],
      ar:['مزة التنور','سبعة أطباق صغيرة — حمص، متبل، جاجيك، زيتون، مخلل، أعشاب، جبن.'] },
    { p:'2,500', img:'dish-tray',
      en:['Dolma','Vine leaves and peppers rolled around rice, lamb and dried mint.'],
      ckb:['دۆڵمە','گەڵای مێو و بیبەر کە بە برنج و گۆشتی بەرخ و پونگی وشک پێچراونەتەوە.'],
      ar:['دولمة','ورق عنب وفلفل ملفوف حول الرز ولحم الغنم والنعناع المجفف.'] },
    { p:'2,000', img:'dish-plate',
      en:['Şorbaya Nîsk','Red lentil soup with cumin and a squeeze of lemon.'],
      ckb:['شۆربای نیسک','شۆربای نیسکی سوور بە کەمون و کەمێک لیمۆ.'],
      ar:['شوربة عدس','شوربة عدس أحمر بالكمون وعصرة ليمون.'] }
  ],
  drink: [
    { p:'Free',  img:'lamps',
      en:['Çay','Black tea in a small glass, poured all evening. Never charged for.'],
      ckb:['چا','چای ڕەش لە پەرداخێکی بچووک، بە درێژایی ئێوارە. هەرگیز نرخی لەسەر ناکرێت.'],
      ar:['شاي','شاي أسود في كأس صغير، يُصب طوال المساء. لا يُحسب ثمنه أبداً.'] },
    { p:'1,500', img:'room-warm',
      en:['Mastaw','Salted yoghurt beaten with cold water and dried mint.'],
      ckb:['مەستاو','ماستی سوێردار کە بە ئاوی سارد و پونگی وشک لێدەدرێت.'],
      ar:['مستو','لبن مملح مخفوق بالماء البارد والنعناع المجفف.'] },
    { p:'2,000', img:'room',
      en:['Şerbeta Tû','Mulberry cordial from the trees behind the kitchen, served over ice.'],
      ckb:['شەربەتی تو','شەربەتی تو لە درەختەکانی پشت چێشتخانە، بەسەر سەهۆڵدا.'],
      ar:['شربة توت','شراب التوت من أشجار خلف المطبخ، يُقدم على الثلج.'] }
  ]
};

const MARQ = ['Kebab Tenûr','Nanê Tenûr','Kuzî','Dolma','Mastaw','Lehmacun','Şîşa Mirîşk','Çay','Mezze','Tikka Şîş'];

/* ── 3. language ─────────────────────────────────────────── */
let lang = 'en';
try { lang = localStorage.getItem('tenur.lang') || 'en'; } catch (_) {}
if (!T[lang]) lang = 'en';

function applyLang(code) {
  lang = code;
  const pack = T[code];
  document.documentElement.lang = code;
  document.documentElement.dir = pack.dir;
  $$('[data-i18n]').forEach(el => {
    const v = pack.d[el.dataset.i18n];
    if (v != null) el.textContent = v;
  });
  $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === code));
  try { localStorage.setItem('tenur.lang', code); } catch (_) {}
  buildMenu(currentCat);
}
$$('.lang button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

/* ── 4. menu render ──────────────────────────────────────── */
let currentCat = 'fire';
const dishesEl = $('#dishes');

function buildMenu(cat) {
  currentCat = cat;
  const rows = DISHES[cat] || [];
  dishesEl.innerHTML = '';
  rows.forEach((d, i) => {
    const [name, desc] = d[lang] || d.en;
    const el = document.createElement('article');
    el.className = 'dish';
    el.style.animationDelay = (i * 65) + 'ms';
    el.dataset.img = d.img;
    const price = d.p === 'Free'
      ? `<span class="dish__p"><b>${lang === 'en' ? 'Free' : lang === 'ar' ? 'مجاناً' : 'بەخۆڕایی'}</b></span>`
      : `<span class="dish__p"><b>${d.p}</b> IQD</span>`;
    el.innerHTML =
      `<h3 class="dish__n">${name}${d.tag ? `<span class="dish__tag">${d.tag}</span>` : ''}</h3>
       ${price}
       <p class="dish__d">${desc}</p>`;
    dishesEl.appendChild(el);
  });
}

$$('#tabs button').forEach(b => b.addEventListener('click', () => {
  $$('#tabs button').forEach(x => x.classList.toggle('on', x === b));
  buildMenu(b.dataset.cat);
}));

/* cursor-follow dish preview (desktop pointers only) */
const peek = $('#peek'), peekImg = $('#peek img');
if (matchMedia('(hover:hover) and (pointer:fine)').matches && !RM.matches) {
  let raf = 0, tx = 0, ty = 0;
  dishesEl.addEventListener('pointerover', e => {
    const row = e.target.closest('.dish');
    if (!row) return;
    peekImg.src = `media/${row.dataset.img}.webp`;
    peek.classList.add('on');
  });
  dishesEl.addEventListener('pointerout', e => {
    if (!e.relatedTarget || !e.relatedTarget.closest('.dish')) peek.classList.remove('on');
  });
  dishesEl.addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      peek.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%) scale(1) rotate(-2deg)`;
      peek.style.left = '0'; peek.style.top = '0';
      raf = 0;
    });
  });
}

/* ── 5. marquee ──────────────────────────────────────────── */
const marq = $('#marq');
const strip = MARQ.map(m => `<span>${m}</span>`).join('');
marq.innerHTML = strip + strip;   // duplicated so the -50% loop is seamless

/* ── 6. reveals ──────────────────────────────────────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    if (en.target.classList.contains('h2') || en.target.classList.contains('hero__h')) {
      $$('.line', en.target).forEach(l => l.classList.add('in'));
    }
    io.unobserve(en.target);
  });
}, { threshold: .18, rootMargin: '0px 0px -8% 0px' });

$$('.reveal, .h2, .hero__h, .stats, .gal figure').forEach(el => io.observe(el));

/* failsafe — if the observer never fires, show everything anyway */
setTimeout(() => {
  $$('.reveal:not(.in)').forEach(e => e.classList.add('in'));
  $$('.line:not(.in)').forEach(e => e.classList.add('in'));
}, 1800);

/* ── 7. counters ─────────────────────────────────────────── */
const cio = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  const el = en.target;
  cio.unobserve(el);
  if (el.hasAttribute('data-plain') || RM.matches) { el.textContent = el.dataset.to + (el.dataset.suffix || ''); return; }
  const to = +el.dataset.to, sfx = el.dataset.suffix || '', t0 = performance.now(), dur = 1100;
  const step = t => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + sfx;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}), { threshold: .6 });
$$('.num').forEach(n => cio.observe(n));

/* ── 8. nav ──────────────────────────────────────────────── */
const nav = $('#nav'), prog = $('#navprog');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  nav.classList.toggle('stuck', y > 40);
  nav.classList.toggle('hide', y > 400 && y > lastY && !$('#sheet').hasAttribute('hidden') === false);
  lastY = y;
  const max = document.body.scrollHeight - innerHeight;
  prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
}, { passive: true });

const burger = $('#burger'), sheet = $('#sheet');
burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!open));
  sheet.toggleAttribute('hidden', open);
  document.body.classList.toggle('lock', !open);
});
$$('#sheet a').forEach(a => a.addEventListener('click', () => {
  burger.setAttribute('aria-expanded', 'false');
  sheet.setAttribute('hidden', '');
  document.body.classList.remove('lock');
}));

/* ── 9. parallax + rail ──────────────────────────────────── */
const pars = $$('.par'), rail = $('#rail');
if (!RM.matches) {
  let ticking = false;
  const frame = () => {
    const vh = innerHeight;
    pars.forEach(p => {
      const r = p.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const k = (r.top + r.height / 2 - vh / 2) / vh;      // -1 … 1
      const img = $('img', p);
      if (img) img.style.transform = `translate3d(0,${k * (+p.dataset.speed || -20)}px,0) scale(1.08)`;
    });
    if (rail) {
      const r = rail.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        const k = 1 - (r.top + r.height) / (vh + r.height);  // 0 … 1 through the viewport
        const travel = Math.max(0, rail.scrollWidth - innerWidth + 40);
        rail.style.transform = `translate3d(${-k * travel}px,0,0)`;
      }
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', frame, { passive: true });
  frame();
}

/* ── 10. embers ──────────────────────────────────────────── */
const cv = $('#embers');
if (cv && !RM.matches) {
  const ctx = cv.getContext('2d');
  let w = 0, h = 0, parts = [], running = true;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  const size = () => {
    const r = cv.getBoundingClientRect();
    w = r.width; h = r.height;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    parts = Array.from({ length: Math.round(Math.min(70, w / 16)) }, spawn);
  };
  function spawn() {
    return {
      x: Math.random() * w,
      y: h + Math.random() * h * .5,
      r: Math.random() * 1.7 + .5,
      vy: -(Math.random() * .42 + .16),
      vx: (Math.random() - .5) * .22,
      a: Math.random() * .5 + .18,
      hue: 22 + Math.random() * 22
    };
  }
  const tick = () => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    parts.forEach((p, i) => {
      p.y += p.vy; p.x += p.vx + Math.sin(p.y * .012) * .18;
      p.a -= .0011;
      if (p.y < -12 || p.a <= 0) parts[i] = spawn();
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue},95%,58%,${Math.max(0, p.a)})`;
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  };
  size();
  addEventListener('resize', size, { passive: true });
  new IntersectionObserver(es => {
    running = es[0].isIntersecting;
    if (running) requestAnimationFrame(tick);
  }, { threshold: .01 }).observe(cv);
}

/* ── 11. reservation form ────────────────────────────────── */
$$('#party button').forEach(b => b.addEventListener('click', () => {
  $$('#party button').forEach(x => x.classList.toggle('on', x === b));
}));

const form = $('#resform'), ok = $('#resok');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  ok.hidden = false;
  form.querySelector('button[type=submit]').disabled = true;
  ok.scrollIntoView({ block: 'nearest', behavior: RM.matches ? 'auto' : 'smooth' });
});

/* today as the minimum reservation date */
const dateInput = form.querySelector('input[type=date]');
if (dateInput) {
  const d = new Date();
  dateInput.min = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ── 12. boot ────────────────────────────────────────────── */
buildMenu('fire');
applyLang(lang);

const loader = $('#loader');
const done = () => {
  if (!loader.isConnected) return;
  loader.classList.add('gone');
  // drop it from the DOM once faded — a transition that never runs (background tab,
  // headless render) would otherwise leave it covering the page forever
  setTimeout(() => loader.remove(), 900);
  document.body.classList.remove('lock');
  requestAnimationFrame(() => {
    $$('.hero__h .line, .hero .reveal').forEach(e => e.classList.add('in'));
  });
};
if (RM.matches) { loader.remove(); $$('.hero__h .line, .hero .reveal').forEach(e => e.classList.add('in')); }
else {
  document.body.classList.add('lock');
  addEventListener('load', () => setTimeout(done, 620));
  setTimeout(done, 2600);                  // never trap the visitor behind the loader
}

/* pause the hero video when it is off-screen — saves battery on phones */
const hv = $('#herovid');
if (hv) new IntersectionObserver(es => {
  es[0].isIntersecting ? hv.play().catch(() => {}) : hv.pause();
}, { threshold: .05 }).observe(hv);

})();
