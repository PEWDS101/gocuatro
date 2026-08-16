/* ═══════════════════════════════════════════════════════════
   ZERÎ — interactions
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const FINE = matchMedia('(hover:hover) and (pointer:fine)');

/* ── copy ────────────────────────────────────────────────── */
const T = {
  en:{dir:'ltr',d:{
    'nav.shop':'Shop','nav.look':'Lookbook','nav.index':'Index','nav.visit':'Visit','nav.cart':'Cart',
    'hero.ey':'Autumn / Winter — Duhok','hero.l1':'Cut in','hero.l2':'small','hero.l3':'numbers.',
    'hero.sub':'Nothing here is made more than forty times. When a piece is gone it does not come back.',
    'hero.cta':'See the collection','hero.m1':'Est. 2019','hero.m2':'Made in Kurdistan','hero.m3':'40 pieces per run',
    'silk.q':'We would rather sell forty things properly than four hundred badly.','silk.c':'Rezan — founder',
    'look.ey':'Lookbook','look.h':'Six looks.','look.hint':'drag',
    'look.n1':'The Long Coat','look.n2':'Leather, softened','look.n3':'The Red Dress',
    'look.n4':'Shoulder & Line','look.n5':'Grey Scarf','look.n6':'Evening, plain',
    'shop.ey':'The collection','shop.h1':'Everything','shop.h2':'in stock.',
    'shop.f1':'All','shop.f2':'Outerwear','shop.f3':'Dresses','shop.f4':'Knitwear',
    'shop.add':'Add to bag','shop.added':'Added','shop.sold':'Sold out',
    'idx.ey':'Index','idx.h':'Hover to look.',
    'visit.ey':'The shop','visit.h1':'Come and','visit.h2':'try things on.',
    'visit.p':'Alterations are done upstairs and included in the price. Bring the shoes you plan to wear and we will pin the hem while you wait.',
    'visit.i1':'Hours','visit.i1v':'Sat – Thu · 10:00 – 21:00','visit.i2':'Where','visit.i2v':'Nawroz Street, Duhok','visit.i3':'Phone',
    'cart.h':'Your bag','cart.total':'Total','cart.go':'Checkout','cart.empty':'Your bag is empty.',
    'cart.demo':'This is a demonstration site — no order was placed.',
    'foot.demo':'Concept site — not a real shop.'
  }},
  ckb:{dir:'ltr',d:{
    'nav.shop':'فرۆشگا','nav.look':'وێنەکان','nav.index':'پێڕست','nav.visit':'سەردان','nav.cart':'سەبەتە',
    'hero.ey':'پاییز / زستان — دهۆک','hero.l1':'بە ژمارەی','hero.l2':'کەم','hero.l3':'دروستکراو.',
    'hero.sub':'هیچ شتێک لێرە زیاتر لە چل جار دروست ناکرێت. کاتێک پارچەیەک تەواو بوو، ناگەڕێتەوە.',
    'hero.cta':'کۆلێکشنەکە ببینە','hero.m1':'دامەزراوە ٢٠١٩','hero.m2':'دروستکراوی کوردستان','hero.m3':'٤٠ پارچە بۆ هەر دەستەیەک',
    'silk.q':'پێمان باشترە چل شت بە باشی بفرۆشین لەوەی چوارسەد شت بە خراپی.','silk.c':'ڕەزان — دامەزرێنەر',
    'look.ey':'وێنەکان','look.h':'شەش شێواز.','look.hint':'ڕایبکێشە',
    'look.n1':'چاکەتی درێژ','look.n2':'چەرمی نەرم','look.n3':'کراسی سوور',
    'look.n4':'شان و هێڵ','look.n5':'شاڵی خۆڵەمێشی','look.n6':'ئێوارە، سادە',
    'shop.ey':'کۆلێکشنەکە','shop.h1':'هەموو شتێک','shop.h2':'لە ئامادەییدا.',
    'shop.f1':'هەموو','shop.f2':'چاکەت','shop.f3':'کراس','shop.f4':'چنراو',
    'shop.add':'زیادی بکە','shop.added':'زیادکرا','shop.sold':'تەواو بووە',
    'idx.ey':'پێڕست','idx.h':'دەستی بخەرە سەر بۆ بینین.',
    'visit.ey':'فرۆشگاکە','visit.h1':'وەرە و','visit.h2':'تاقی بکەرەوە.',
    'visit.p':'گۆڕانکارییەکان لە سەرەوە دەکرێن و لە نرخەکەدا هەژمار کراون. ئەو پێڵاوانە بهێنە کە دەتەوێت لەبەری بکەیت.',
    'visit.i1':'کاتژمێر','visit.i1v':'شەممە – پێنجشەممە · ١٠:٠٠ – ٢١:٠٠','visit.i2':'شوێن','visit.i2v':'شەقامی نەورۆز، دهۆک','visit.i3':'تەلەفۆن',
    'cart.h':'سەبەتەکەت','cart.total':'کۆی گشتی','cart.go':'پارەدان','cart.empty':'سەبەتەکەت بەتاڵە.',
    'cart.demo':'ئەمە ماڵپەڕێکی نموونەییە — هیچ داواکارییەک تۆمار نەکرا.',
    'foot.demo':'ماڵپەڕی نموونەیی — فرۆشگایەکی ڕاستەقینە نییە.'
  }},
  ar:{dir:'rtl',d:{
    'nav.shop':'المتجر','nav.look':'الصور','nav.index':'الفهرس','nav.visit':'زورونا','nav.cart':'الحقيبة',
    'hero.ey':'خريف / شتاء — دهوك','hero.l1':'تُخاط','hero.l2':'بأعداد','hero.l3':'قليلة.',
    'hero.sub':'لا شيء هنا يُصنع أكثر من أربعين مرة. حين تنتهي القطعة لا تعود.',
    'hero.cta':'شاهد المجموعة','hero.m1':'تأسس ٢٠١٩','hero.m2':'صُنع في كردستان','hero.m3':'٤٠ قطعة لكل دفعة',
    'silk.q':'نفضّل أن نبيع أربعين قطعة بإتقان على أربعمئة بإهمال.','silk.c':'ريزان — المؤسِّسة',
    'look.ey':'الصور','look.h':'ستة إطلالات.','look.hint':'اسحب',
    'look.n1':'المعطف الطويل','look.n2':'جلد ناعم','look.n3':'الفستان الأحمر',
    'look.n4':'الكتف والخط','look.n5':'الوشاح الرمادي','look.n6':'سهرة، بسيطة',
    'shop.ey':'المجموعة','shop.h1':'كل شيء','shop.h2':'متوفر.',
    'shop.f1':'الكل','shop.f2':'معاطف','shop.f3':'فساتين','shop.f4':'تريكو',
    'shop.add':'أضف للحقيبة','shop.added':'أُضيف','shop.sold':'نفدت',
    'idx.ey':'الفهرس','idx.h':'مرّر لترى.',
    'visit.ey':'المتجر','visit.h1':'تعالي','visit.h2':'وجرّبي.',
    'visit.p':'التعديلات تُنجز في الطابق العلوي وسعرها مشمول. أحضري الحذاء الذي تنوين ارتداءه وسنثبّت الحاشية بينما تنتظرين.',
    'visit.i1':'الأوقات','visit.i1v':'السبت – الخميس · ١٠:٠٠ – ٢١:٠٠','visit.i2':'الموقع','visit.i2v':'شارع نوروز، دهوك','visit.i3':'الهاتف',
    'cart.h':'حقيبتك','cart.total':'المجموع','cart.go':'إتمام الشراء','cart.empty':'حقيبتك فارغة.',
    'cart.demo':'هذا موقع تجريبي — لم يُسجَّل أي طلب.',
    'foot.demo':'موقع تجريبي — ليس متجراً حقيقياً.'
  }}
};

/* ── stock ───────────────────────────────────────────────── */
const P = [
  { id:'c1', img:'look-01', cat:'outer', price:185000, tag:null, sold:false,
    en:['Bahdinan Coat','Wool · charcoal'], ckb:['چاکەتی بادینان','خوری · خۆڵەمێشی'], ar:['معطف بادينان','صوف · فحمي'] },
  { id:'c2', img:'look-02', cat:'outer', price:240000, tag:'new', sold:false,
    en:['Softened Leather','Lambskin · black'], ckb:['چەرمی نەرم','چەرمی بەرخ · ڕەش'], ar:['جلد ناعم','جلد حمل · أسود'] },
  { id:'c3', img:'look-03', cat:'dress', price:165000, tag:'last 3', sold:false,
    en:['The Red Dress','Crepe · oxblood'], ckb:['کراسی سوور','کرێپ · سووری تۆخ'], ar:['الفستان الأحمر','كريب · عنابي'] },
  { id:'c4', img:'look-04', cat:'dress', price:145000, tag:null, sold:false,
    en:['Shoulder Line','Cotton blend · bone'], ckb:['هێڵی شان','تێکەڵی لۆکە · ئێسکی'], ar:['خط الكتف','قطن مخلوط · عاجي'] },
  { id:'c5', img:'look-05', cat:'knit', price:95000, tag:null, sold:false,
    en:['Grey Scarf','Merino · grey'], ckb:['شاڵی خۆڵەمێشی','مێرینۆ · خۆڵەمێشی'], ar:['وشاح رمادي','ميرينو · رمادي'] },
  { id:'c6', img:'look-06', cat:'dress', price:210000, tag:null, sold:true,
    en:['Evening, Plain','Silk · ink'], ckb:['ئێوارە، سادە','ئاوریشم · ڕەش'], ar:['سهرة، بسيطة','حرير · حبري'] },
  { id:'c7', img:'store-alt', cat:'knit', price:120000, tag:null, sold:false,
    en:['House Knit','Lambswool · sand'], ckb:['چنراوی ماڵ','خوری بەرخ · قومی'], ar:['تريكو البيت','صوف حمل · رملي'] },
  { id:'c8', img:'hero-look', cat:'outer', price:275000, tag:'new', sold:false,
    en:['Long Sleeve Coat','Wool cashmere · ink'], ckb:['چاکەتی درێژ','خوری کەشمیر · ڕەش'], ar:['معطف طويل','صوف كشمير · حبري'] }
];

/* ── language ────────────────────────────────────────────── */
let lang = 'en';
try { lang = localStorage.getItem('zeri.lang') || 'en'; } catch (_) {}
if (!T[lang]) lang = 'en';
const t = k => (T[lang].d[k] ?? T.en.d[k] ?? '');

function applyLang(code){
  lang = code;
  document.documentElement.lang = code;
  document.documentElement.dir = T[code].dir;
  $$('[data-i18n]').forEach(el => { const v = T[code].d[el.dataset.i18n]; if (v != null) el.textContent = v; });
  $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === code));
  try { localStorage.setItem('zeri.lang', code); } catch (_) {}
  renderGrid(filter);
  renderIndex();
  renderCart();
}
$$('.lang button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

const money = n => n.toLocaleString('en') + ' IQD';

/* ── grid ────────────────────────────────────────────────── */
let filter = 'all';
const grid = $('#grid');

function renderGrid(f){
  filter = f;
  const rows = P.filter(p => f === 'all' || p.cat === f);
  grid.innerHTML = rows.map((p,i) => {
    const [n,s] = p[lang] || p.en;
    return `<article class="prod" data-id="${p.id}" style="transition-delay:${i*55}ms">
      <div class="prod__img">
        <img src="media/${p.img}.webp" alt="${n}" loading="lazy" decoding="async" />
        ${p.tag ? `<span class="prod__tag">${p.tag}</span>` : ''}
        <button class="prod__add" ${p.sold ? 'disabled' : ''} data-add="${p.id}">${p.sold ? t('shop.sold') : t('shop.add')}</button>
      </div>
      <div class="prod__b"><span class="prod__n">${n}</span><span class="prod__p">${money(p.price)}</span></div>
      <p class="prod__s">${s}</p>
    </article>`;
  }).join('');
  $$('.prod', grid).forEach(el => io.observe(el));
}

$$('#filters button').forEach(b => b.addEventListener('click', () => {
  $$('#filters button').forEach(x => x.classList.toggle('on', x === b));
  renderGrid(b.dataset.f);
}));

/* ── cart ────────────────────────────────────────────────── */
const bag = [];
const cart = $('#cart'), scrim = $('#scrim');

function renderCart(){
  const body = $('#cartbody');
  if (!bag.length){
    body.innerHTML = `<p class="cart__empty">${t('cart.empty')}</p>`;
  } else {
    body.innerHTML = bag.map((p,i) => {
      const [n,s] = p[lang] || p.en;
      return `<div class="ci">
        <img src="media/${p.img}.webp" alt="" />
        <div><div class="ci__n">${n}</div><div class="ci__m">${money(p.price)}</div></div>
        <button class="ci__x" data-rm="${i}" aria-label="Remove">&times;</button>
      </div>`;
    }).join('');
  }
  $('#cartn').textContent = bag.length;
  $('#carttot').textContent = money(bag.reduce((s,p) => s + p.price, 0));
}

function openCart(on){
  cart.hidden = !on; scrim.hidden = !on;
  // forced reflow rather than rAF: rAF never fires in a background tab, which would
  // leave the drawer un-slid until the tab is focused again
  void cart.offsetHeight;
  cart.classList.toggle('open', on);
  scrim.classList.toggle('on', on);
  document.body.classList.toggle('lock', on);
}

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add && !add.disabled){
    const p = P.find(x => x.id === add.dataset.add);
    if (p && !p.sold){
      bag.push(p); renderCart();
      add.textContent = t('shop.added');
      setTimeout(() => { add.textContent = t('shop.add'); }, 1200);
    }
    return;
  }
  const rm = e.target.closest('[data-rm]');
  if (rm){ bag.splice(+rm.dataset.rm, 1); renderCart(); }
});

$('#cartbtn').addEventListener('click', () => openCart(true));
$('#cartx').addEventListener('click', () => openCart(false));
scrim.addEventListener('click', () => openCart(false));
addEventListener('keydown', e => { if (e.key === 'Escape') openCart(false); });
$('#checkout').addEventListener('click', () => { $('#cartnote').hidden = false; });

/* ── hover index ─────────────────────────────────────────── */
function renderIndex(){
  $('#idxlist').innerHTML = P.map(p => {
    const [n,s] = p[lang] || p.en;
    return `<li><a href="#shop" data-img="${p.img}">
      <span class="idx__n">${n}</span><span class="idx__m">${s} · ${money(p.price)}</span></a></li>`;
  }).join('');
}

const peek = $('#idxpeek'), peekImg = $('#idxpeek img');
if (FINE.matches && !RM.matches){
  const list = $('#idxlist');
  let raf = 0, x = 0, y = 0;
  list.addEventListener('pointerover', e => {
    const a = e.target.closest('[data-img]');
    if (!a) return;
    peekImg.src = `media/${a.dataset.img}.webp`;
    peek.classList.add('on');
  });
  list.addEventListener('pointerleave', () => peek.classList.remove('on'));
  list.addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      peek.style.left = x + 'px'; peek.style.top = y + 'px';
      raf = 0;
    });
  });
}

/* ── lookbook drag ───────────────────────────────────────── */
const track = $('#looktrack');
{
  let down = false, startX = 0, startScroll = 0;
  track.addEventListener('pointerdown', e => {
    down = true; startX = e.clientX; startScroll = track.scrollLeft;
    track.classList.add('drag'); track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', e => {
    if (!down) return;
    track.scrollLeft = startScroll - (e.clientX - startX);
  });
  const up = e => { down = false; track.classList.remove('drag'); try { track.releasePointerCapture(e.pointerId); } catch(_){} };
  track.addEventListener('pointerup', up);
  track.addEventListener('pointercancel', up);
}

/* ── reveals ─────────────────────────────────────────────── */
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add('in');
  $$('.line', en.target).forEach(l => l.classList.add('in'));
  io.unobserve(en.target);
}), { threshold:.15, rootMargin:'0px 0px -6% 0px' });
$$('.reveal, .h2, .hero h1, .silk__q p, .prod').forEach(el => io.observe(el));
setTimeout(() => $$('.reveal:not(.in),.line:not(.in),.prod:not(.in)').forEach(e => e.classList.add('in')), 1700);

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

/* ── parallax ────────────────────────────────────────────── */
if (!RM.matches){
  const pars = $$('.par');
  let tick = false;
  const frame = () => {
    const vh = innerHeight;
    pars.forEach(p => {
      const r = p.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const k = (r.top + r.height/2 - vh/2) / vh;
      const img = $('img', p);
      if (img) img.style.transform = `translate3d(0,${k * (+p.dataset.speed || -20)}px,0) scale(1.08)`;
    });
    tick = false;
  };
  addEventListener('scroll', () => { if (!tick){ tick = true; requestAnimationFrame(frame); } }, { passive:true });
  frame();
}

/* the silk loop is heavy — only fetch it once it is nearly on screen */
{
  const v = $('.silk__v');
  new IntersectionObserver((es, ob) => {
    if (!es[0].isIntersecting) return;
    v.preload = 'auto'; v.load(); v.play().catch(() => {});
    ob.disconnect();
  }, { rootMargin:'250px' }).observe(v);
}

/* ── boot ────────────────────────────────────────────────── */
applyLang(lang);
requestAnimationFrame(() => $$('.hero .line, .hero .reveal').forEach(e => e.classList.add('in')));
})();
