/* ═══════════════════════════════════════════════════════════
   ZANA Dental Studio — interactions
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)');

/* ── copy ────────────────────────────────────────────────── */
const T = {
  en:{label:'EN',dir:'ltr',d:{
    'nav.care':'Treatments','nav.results':'Results','nav.visit':'Your visit','nav.team':'Team','nav.book':'Book',
    'hero.pill':'Taking new patients this month',
    'hero.l1':'Dentistry that','hero.l2':'explains itself','hero.l3':'before it begins.',
    'hero.sub':'You will see the plan, the number of visits and the full price written down before we pick up a single instrument. No surprises halfway through.',
    'hero.cta1':'Book a consultation','hero.cta2':'See real results',
    'hero.a1':'Written price first','hero.a2':'Evening appointments','hero.a3':'Kurdish · Arabic · English',
    'hero.badge':'years caring for Duhok',
    'trust.t1':'Patients treated','trust.t2':'Years open','trust.t3':'Specialists','trust.t4':'Would return',
    'care.eyebrow':'Treatments','care.h1':'What we do,','care.h2':'and what it costs.',
    'care.sub':'Starting prices in Iraqi dinar. Your exact figure is confirmed in writing at the consultation, which is free.',
    'ba.eyebrow':'Real results','ba.h1':'Drag to see','ba.h2':'the difference.',
    'ba.before':'Before','ba.after':'After','ba.note':'Composite veneers and whitening, four visits over three weeks.',
    'steps.eyebrow':'Your visit','steps.h1':'Four steps.','steps.h2':'No surprises.',
    'team.eyebrow':'The team','team.h1':'Six people who','team.h2':'will know your name.',
    'team.p':'You are seen by the same dentist each visit. Nurses, hygienist and technician all work in this building, so nothing is sent away and nothing gets lost between clinics.',
    'team.r1':'Implants & surgery','team.r2':'Alignment','team.r3':'Cosmetic & whitening','team.r4':'Children',
    'book.eyebrow':'Book','book.h1':'The consultation','book.h2':'is free.',
    'book.sub':'Twenty minutes, an examination, and a written plan you can take away and think about. There is no obligation to book anything after it.',
    'book.i1':'Hours','book.i1v':'Sat – Thu · 09:00 – 20:00','book.i2':'Where','book.i2v':'Barzani Street, opposite Duhok Mall',
    'book.i3':'Phone','book.i4':'Emergency','book.i4v':'Same-day slots kept free every morning',
    'book.f0':'What is it about?','book.p1':'Check-up','book.p2':'Pain','book.p3':'Cosmetic','book.p4':'Implant','book.p5':'Alignment',
    'book.f1':'Name','book.f2':'Phone','book.f3':'Preferred day','book.f4':'Preferred time','book.f5':'Anything you want us to know',
    'book.send':'Request the appointment','book.ok':'Thank you — this is a demonstration site, so nothing was actually sent.',
    'faq.eyebrow':'Questions','faq.h1':'The ones people actually ask.',
    'foot.tag':'Dental Studio · Duhok, Kurdistan','foot.demo':'Concept site — not a real clinic.'
  }},
  ckb:{label:'KU',dir:'ltr',d:{
    'nav.care':'چارەسەرەکان','nav.results':'ئەنجامەکان','nav.visit':'سەردانەکەت','nav.team':'تیمەکە','nav.book':'کاتێک بگرە',
    'hero.pill':'ئەم مانگە نەخۆشی نوێ وەردەگرین',
    'hero.l1':'ددانسازییەک کە','hero.l2':'خۆی ڕوون دەکاتەوە','hero.l3':'پێش ئەوەی دەست پێبکات.',
    'hero.sub':'پلانەکە، ژمارەی سەردانەکان و نرخی تەواو بە نووسراوی دەبینیت پێش ئەوەی هیچ ئامرازێک هەڵبگرین. هیچ سەرسوڕمانێک لە ناوەڕاستدا نییە.',
    'hero.cta1':'کاتی ڕاوێژکاری بگرە','hero.cta2':'ئەنجامی ڕاستەقینە ببینە',
    'hero.a1':'یەکەم جار نرخی نووسراو','hero.a2':'کاتی ئێوارە','hero.a3':'کوردی · عەرەبی · ئینگلیزی',
    'hero.badge':'ساڵ خزمەتی دهۆک',
    'trust.t1':'نەخۆشی چارەسەرکراو','trust.t2':'ساڵ کراوەیە','trust.t3':'پسپۆڕ','trust.t4':'دووبارە دێنەوە',
    'care.eyebrow':'چارەسەرەکان','care.h1':'چی دەکەین،','care.h2':'و چەندی دەوێت.',
    'care.sub':'نرخی دەستپێک بە دیناری عێراقی. ژمارە تەواوەکەت لە ڕاوێژکاریدا بە نووسراوی پشتڕاست دەکرێتەوە، کە بەخۆڕاییە.',
    'ba.eyebrow':'ئەنجامی ڕاستەقینە','ba.h1':'ڕایبکێشە بۆ بینینی','ba.h2':'جیاوازییەکە.',
    'ba.before':'پێشتر','ba.after':'دواتر','ba.note':'ڤینیری کۆمپۆزیت و سپیکردنەوە، چوار سەردان لە ماوەی سێ هەفتەدا.',
    'steps.eyebrow':'سەردانەکەت','steps.h1':'چوار هەنگاو.','steps.h2':'هیچ سەرسوڕمانێک نییە.',
    'team.eyebrow':'تیمەکە','team.h1':'شەش کەس کە','team.h2':'ناوت دەزانن.',
    'team.p':'هەموو سەردانێک هەمان ددانساز دەتبینێت. پەرستار، پاککەرەوە و تەکنیکار هەموویان لەم بینایەدا کاردەکەن، بۆیە هیچ شتێک بۆ دەرەوە نانێردرێت.',
    'team.r1':'دانانی ددان و نەشتەرگەری','team.r2':'ڕێکخستنی ددان','team.r3':'جوانکاری و سپیکردنەوە','team.r4':'منداڵان',
    'book.eyebrow':'کاتێک بگرە','book.h1':'ڕاوێژکارییەکە','book.h2':'بەخۆڕاییە.',
    'book.sub':'بیست خولەک، پشکنینێک، و پلانێکی نووسراو کە دەتوانیت لەگەڵ خۆت ببەیت و بیری لێبکەیتەوە. هیچ پابەندبوونێک نییە.',
    'book.i1':'کاتژمێر','book.i1v':'شەممە – پێنجشەممە · ٠٩:٠٠ – ٢٠:٠٠','book.i2':'شوێن','book.i2v':'شەقامی بارزانی، بەرامبەر دهۆک مۆڵ',
    'book.i3':'تەلەفۆن','book.i4':'فریاکەوتن','book.i4v':'هەموو بەیانییەک کاتی هەمان ڕۆژ بەتاڵ دەهێڵینەوە',
    'book.f0':'دەربارەی چییە؟','book.p1':'پشکنین','book.p2':'ئازار','book.p3':'جوانکاری','book.p4':'دانانی ددان','book.p5':'ڕێکخستن',
    'book.f1':'ناو','book.f2':'ژمارە','book.f3':'ڕۆژی باشتر','book.f4':'کاتی باشتر','book.f5':'شتێک هەیە بیزانین',
    'book.send':'داوای کاتەکە بکە','book.ok':'سوپاس — ئەمە ماڵپەڕێکی نموونەییە، بۆیە هیچ شتێک نەنێردرا.',
    'faq.eyebrow':'پرسیارەکان','faq.h1':'ئەوانەی خەڵک بەڕاستی دەیانپرسن.',
    'foot.tag':'ددانسازی · دهۆک، کوردستان','foot.demo':'ماڵپەڕی نموونەیی — نەخۆشخانەیەکی ڕاستەقینە نییە.'
  }},
  ar:{label:'AR',dir:'rtl',d:{
    'nav.care':'العلاجات','nav.results':'النتائج','nav.visit':'زيارتك','nav.team':'الفريق','nav.book':'احجز',
    'hero.pill':'نستقبل مرضى جدد هذا الشهر',
    'hero.l1':'طب أسنان','hero.l2':'يشرح نفسه','hero.l3':'قبل أن يبدأ.',
    'hero.sub':'سترى الخطة وعدد الزيارات والسعر الكامل مكتوباً قبل أن نمسك أي أداة. لا مفاجآت في منتصف الطريق.',
    'hero.cta1':'احجز استشارة','hero.cta2':'شاهد نتائج حقيقية',
    'hero.a1':'السعر مكتوب أولاً','hero.a2':'مواعيد مسائية','hero.a3':'كردي · عربي · إنجليزي',
    'hero.badge':'عاماً في خدمة دهوك',
    'trust.t1':'مريض عولج','trust.t2':'عاماً من العمل','trust.t3':'أخصائيين','trust.t4':'سيعودون',
    'care.eyebrow':'العلاجات','care.h1':'ما نقوم به،','care.h2':'وكم يكلف.',
    'care.sub':'أسعار البداية بالدينار العراقي. رقمك الدقيق يُؤكد كتابةً في الاستشارة، وهي مجانية.',
    'ba.eyebrow':'نتائج حقيقية','ba.h1':'اسحب لترى','ba.h2':'الفرق.',
    'ba.before':'قبل','ba.after':'بعد','ba.note':'قشور تجميلية وتبييض، أربع زيارات خلال ثلاثة أسابيع.',
    'steps.eyebrow':'زيارتك','steps.h1':'أربع خطوات.','steps.h2':'بلا مفاجآت.',
    'team.eyebrow':'الفريق','team.h1':'ستة أشخاص','team.h2':'سيعرفون اسمك.',
    'team.p':'يراك نفس الطبيب في كل زيارة. الممرضات وأخصائي التنظيف والفني جميعهم يعملون في هذا المبنى، فلا شيء يُرسل خارجاً ولا شيء يضيع بين العيادات.',
    'team.r1':'الزراعة والجراحة','team.r2':'تقويم الأسنان','team.r3':'التجميل والتبييض','team.r4':'الأطفال',
    'book.eyebrow':'احجز','book.h1':'الاستشارة','book.h2':'مجانية.',
    'book.sub':'عشرون دقيقة، فحص، وخطة مكتوبة تأخذها معك وتفكر فيها. لا التزام بحجز أي شيء بعدها.',
    'book.i1':'الأوقات','book.i1v':'السبت – الخميس · ٠٩:٠٠ – ٢٠:٠٠','book.i2':'الموقع','book.i2v':'شارع بارزاني، مقابل دهوك مول',
    'book.i3':'الهاتف','book.i4':'الطوارئ','book.i4v':'مواعيد في نفس اليوم محجوزة كل صباح',
    'book.f0':'بخصوص ماذا؟','book.p1':'فحص','book.p2':'ألم','book.p3':'تجميل','book.p4':'زراعة','book.p5':'تقويم',
    'book.f1':'الاسم','book.f2':'الهاتف','book.f3':'اليوم المفضل','book.f4':'الوقت المفضل','book.f5':'أي شيء تريد إخبارنا به',
    'book.send':'اطلب الموعد','book.ok':'شكراً — هذا موقع تجريبي، لذلك لم يُرسل شيء فعلياً.',
    'faq.eyebrow':'أسئلة','faq.h1':'الأسئلة التي يسألها الناس فعلاً.',
    'foot.tag':'عيادة أسنان · دهوك، كردستان','foot.demo':'موقع تجريبي — ليست عيادة حقيقية.'
  }}
};

const ICONS = {
  tooth:'<path d="M12 4c2-1.7 4.7-1.5 6 .3 1.4 2 1 5-.2 7.8-.7 2.6-1.8 5.6-3.2 6-1 .2-1.5-1-3-1s-2 1.2-3 1c-1.4-.4-2.5-3.4-3.2-6C4.2 9.3 3.8 6.3 5.2 4.3 6.5 2.5 10 2.3 12 4Z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',
  spark:'<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6.5 6.5l3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  align:'<rect x="3" y="7" width="18" height="4" rx="1.5" stroke="currentColor" stroke-width="1.6" fill="none"/><rect x="3" y="14" width="12" height="4" rx="1.5" stroke="currentColor" stroke-width="1.6" fill="none"/>',
  screw:'<path d="M12 3v12M9 18c0 1.7 1.3 3 3 3s3-1.3 3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="M8 6h8M8.5 9h7M9 12h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  child:'<circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  shield:'<path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3Z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>'
};

const CARE = [
  { i:'shield', p:'25,000',  en:['Examination & clean','A full look at every tooth and the gums, scale and polish, and a plan written on paper.'], ckb:['پشکنین و پاککردنەوە','سەیرکردنی تەواوی هەموو ددانێک و پوکەکان، پاککردنەوە و سافکردن، و پلانێکی نووسراو.'], ar:['فحص وتنظيف','نظرة كاملة على كل سن واللثة، تنظيف وتلميع، وخطة مكتوبة على ورق.'] },
  { i:'screw',  p:'450,000', en:['Implants','A titanium root and a matched crown. Planned on a 3D scan, placed in one visit.'], ckb:['دانانی ددان','ڕەگی تیتانیۆم و تاجێکی گونجاو. بە سکانی سێ ڕەهەندی پلان دادەنرێت، لە یەک سەردان دادەنرێت.'], ar:['زراعة الأسنان','جذر تيتانيوم وتاج مطابق. يُخطط بمسح ثلاثي الأبعاد، ويُركب في زيارة واحدة.'] },
  { i:'align',  p:'900,000', en:['Clear alignment','Removable clear trays, changed every fortnight. Most cases finish in nine to fourteen months.'], ckb:['ڕێکخستنی ڕوون','قاڵبی ڕوونی لابردنەوە، هەر دوو هەفتە جارێک دەگۆڕدرێت. زۆربەی حاڵەتەکان لە نۆ بۆ چواردە مانگدا تەواو دەبن.'], ar:['تقويم شفاف','قوالب شفافة قابلة للإزالة، تُغير كل أسبوعين. معظم الحالات تنتهي في تسعة إلى أربعة عشر شهراً.'] },
  { i:'spark',  p:'150,000', en:['Whitening','Done here in one sitting, or as a kit for home if you would rather go slowly.'], ckb:['سپیکردنەوە','لێرە لە یەک دانیشتندا دەکرێت، یان وەک کیتێک بۆ ماڵەوە ئەگەر حەز دەکەیت بەهێواشی بڕۆیت.'], ar:['تبييض','يُنجز هنا في جلسة واحدة، أو كطقم للمنزل إذا كنت تفضل التدرج.'] },
  { i:'tooth',  p:'175,000', en:['Veneers & crowns','Shaped and shaded against your own teeth so the repair is the part nobody notices.'], ckb:['ڤینیر و تاج','بەپێی ددانەکانی خۆت شێوە و ڕەنگی دەدرێت، بۆ ئەوەی چاککردنەوەکە ئەو بەشە بێت کە کەس تێی نەگات.'], ar:['قشور وتيجان','تُشكل وتُلون على أسنانك نفسها ليكون الترميم هو الجزء الذي لا يلاحظه أحد.'] },
  { i:'child',  p:'20,000',  en:["Children's care",'Short, gentle, and never rushed. The first visit is only a look and a sticker.'], ckb:['چاودێری منداڵان','کورت، نەرم، و هەرگیز بەپەلە نییە. یەکەم سەردان تەنها سەیرکردنێک و ستیکەرێکە.'], ar:['طب أسنان الأطفال','قصيرة ولطيفة ولا تكون مستعجلة أبداً. الزيارة الأولى مجرد نظرة وملصق.'] }
];

const STEPS = [
  { en:['You get in touch','Message or call. We will tell you honestly whether you need to come in at all.'], ckb:['پەیوەندیمان پێوە دەکەیت','نامە بنێرە یان پەیوەندی بکە. بە ڕاستگۆیی پێت دەڵێین ئایا پێویستە بێیت یان نا.'], ar:['تتواصل معنا','راسلنا أو اتصل. سنخبرك بصراحة إن كنت تحتاج للحضور أصلاً.'] },
  { en:['We look properly','A twenty minute examination and, if it helps, a scan. This part is free.'], ckb:['بە باشی سەیر دەکەین','پشکنینێکی بیست خولەکی و، ئەگەر سوودی هەبوو، سکانێک. ئەم بەشە بەخۆڕاییە.'], ar:['نفحص بدقة','فحص لمدة عشرين دقيقة، ومسح إن كان مفيداً. هذا الجزء مجاني.'] },
  { en:['You get it in writing','Every option, every visit, every number. Take it home and think about it.'], ckb:['بە نووسراوی وەریدەگریت','هەموو هەڵبژاردنێک، هەموو سەردانێک، هەموو ژمارەیەک. بیبە بۆ ماڵەوە و بیری لێبکەرەوە.'], ar:['تحصل عليه مكتوباً','كل خيار، كل زيارة، كل رقم. خذه للبيت وفكر فيه.'] },
  { en:['We do the work','Same dentist each time, at the price we wrote down. Nothing gets added quietly.'], ckb:['کارەکە دەکەین','هەمان ددانساز هەموو جارێک، بەو نرخەی نووسیمانەوە. هیچ شتێک بێدەنگانە زیاد ناکرێت.'], ar:['ننفذ العمل','نفس الطبيب في كل مرة، وبالسعر الذي كتبناه. لا شيء يُضاف بصمت.'] }
];

const FAQ = [
  { en:['Does it hurt?','Almost nothing we do needs more than local anaesthetic, and we numb before we start rather than after you flinch. Tell us at any point and we stop.'], ckb:['ئازار دەدات؟','بەنزیکەیی هیچ شتێک کە دەیکەین زیاتر لە بێهۆشکەری ناوخۆیی ناوێت، و پێش دەستپێکردن بێهەستی دەکەین. لە هەر ساتێکدا پێمان بڵێ و دەوەستین.'], ar:['هل يؤلم؟','تقريباً لا شيء نقوم به يحتاج أكثر من تخدير موضعي، ونخدر قبل أن نبدأ لا بعد أن تنزعج. أخبرنا في أي لحظة ونتوقف.'] },
  { en:['Can I pay in instalments?','Yes, for anything over 300,000 IQD. Split across the treatment with nothing added on top.'], ckb:['دەتوانم بە قیست بدەم؟','بەڵێ، بۆ هەر شتێک زیاتر لە ٣٠٠,٠٠٠ دینار. بەسەر چارەسەرەکەدا دابەش دەکرێت بەبێ هیچ زیادەیەک.'], ar:['هل يمكنني الدفع بالتقسيط؟','نعم، لأي شيء يتجاوز ٣٠٠٬٠٠٠ دينار. مقسم على فترة العلاج دون أي إضافة.'] },
  { en:['What if I have not been in years?','That is most people who walk in here. Nobody is going to lecture you. We start with a look and work out an order to do things in.'], ckb:['ئەگەر ساڵانێکە نەهاتووم چی؟','زۆربەی ئەوانەی دێنە ژوورەوە وایە. کەس وانەت پێ ناڵێتەوە. بە سەیرکردنێک دەستپێدەکەین و ڕیزبەندییەک دادەنێین.'], ar:['ماذا لو لم أزر طبيباً منذ سنوات؟','هذا حال معظم من يدخل إلى هنا. لن يحاضرك أحد. نبدأ بنظرة ونضع ترتيباً للأمور.'] },
  { en:['Do you see emergencies?','Every morning we keep slots free for same-day pain. Call early and we will fit you in.'], ckb:['حاڵەتی فریاکەوتن دەبینن؟','هەموو بەیانییەک کاتی بەتاڵ دەهێڵینەوە بۆ ئازاری هەمان ڕۆژ. زوو پەیوەندی بکە و شوێنت بۆ دەکەینەوە.'], ar:['هل تستقبلون الحالات الطارئة؟','كل صباح نبقي مواعيد شاغرة لألم اليوم نفسه. اتصل مبكراً وسنجد لك مكاناً.'] }
];

/* ── language ────────────────────────────────────────────── */
let lang = 'en';
try { lang = localStorage.getItem('zana.lang') || 'en'; } catch (_) {}
if (!T[lang]) lang = 'en';

function applyLang(code){
  lang = code;
  const p = T[code];
  document.documentElement.lang = code;
  document.documentElement.dir = p.dir;
  $$('[data-i18n]').forEach(el => { const v = p.d[el.dataset.i18n]; if (v != null) el.textContent = v; });
  $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === code));
  try { localStorage.setItem('zana.lang', code); } catch (_) {}
  render();
}
$$('.lang button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

/* ── render lists ────────────────────────────────────────── */
const IQD = { en:'IQD', ckb:'دینار', ar:'دينار' };
const FROM = { en:'from', ckb:'لە', ar:'من' };

function render(){
  const cards = $('#cards');
  cards.innerHTML = CARE.map((c,i) => {
    const [t,d] = c[lang] || c.en;
    return `<article class="card" style="transition-delay:${i*70}ms">
      <span class="card__ico"><svg viewBox="0 0 24 24">${ICONS[c.i]}</svg></span>
      <h3>${t}</h3><p>${d}</p>
      <p class="card__p">${FROM[lang]} <b>${c.p}</b> ${IQD[lang]}</p>
    </article>`;
  }).join('');

  $('#steplist').innerHTML = STEPS.map((s,i) => {
    const [t,d] = s[lang] || s.en;
    return `<li style="transition-delay:${i*90}ms"><h3>${t}</h3><p>${d}</p></li>`;
  }).join('');

  $('#faqlist').innerHTML = FAQ.map(f => {
    const [q,a] = f[lang] || f.en;
    return `<details><summary>${q}</summary><p>${a}</p></details>`;
  }).join('');

  // these are re-created on every language switch, so re-arm their scroll reveal
  $$('.card, .steps__list li').forEach(el => io.observe(el));
}

/* ── before / after slider ───────────────────────────────── */
const cmp = $('#compare'), clip = $('#clip'), handle = $('#handle'), range = $('#range');
function setCmp(p){
  p = Math.max(0, Math.min(100, p));
  clip.style.width = p + '%';
  handle.style.left = p + '%';
  range.value = p;
}
function sizeCmp(){ clip.style.setProperty('--cw', cmp.getBoundingClientRect().width + 'px'); }
range.addEventListener('input', () => setCmp(+range.value));
let dragging = false;
const fromEvent = e => {
  const r = cmp.getBoundingClientRect();
  setCmp(((e.clientX - r.left) / r.width) * 100);
};
cmp.addEventListener('pointerdown', e => { dragging = true; cmp.setPointerCapture(e.pointerId); fromEvent(e); });
cmp.addEventListener('pointermove', e => { if (dragging) fromEvent(e); });
cmp.addEventListener('pointerup',   e => { dragging = false; try { cmp.releasePointerCapture(e.pointerId); } catch(_){} });
addEventListener('resize', sizeCmp, { passive:true });
sizeCmp();
setCmp(50);

/* a slow sweep the first time it scrolls into view, so it reads as draggable */
if (!RM.matches) {
  new IntersectionObserver((es, ob) => {
    if (!es[0].isIntersecting) return;
    ob.disconnect();
    const t0 = performance.now();
    const run = t => {
      const k = Math.min(1, (t - t0) / 1900);
      const ease = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2) / 2;
      setCmp(50 + Math.sin(ease * Math.PI * 1.5) * 26);
      if (k < 1) requestAnimationFrame(run); else setCmp(50);
    };
    requestAnimationFrame(run);
  }, { threshold:.45 }).observe(cmp);
}

/* ── reveals + counters ──────────────────────────────────── */
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add('in');
  $$('.line', en.target).forEach(l => l.classList.add('in'));
  io.unobserve(en.target);
}), { threshold:.16, rootMargin:'0px 0px -8% 0px' });
$$('.reveal, .h2, .hero h1').forEach(el => io.observe(el));
setTimeout(() => {
  $$('.reveal:not(.in),.line:not(.in),.card:not(.in),.steps__list li:not(.in)')
    .forEach(e => e.classList.add('in'));
}, 1600);

const cio = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  const el = en.target; cio.unobserve(el);
  const to = +el.dataset.to, sfx = el.dataset.suffix || '';
  if (RM.matches) { el.textContent = to.toLocaleString('en') + sfx; return; }
  const t0 = performance.now();
  const step = t => {
    const k = Math.min(1, (t - t0) / 1200);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('en') + sfx;
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

/* ── parallax ────────────────────────────────────────────── */
if (!RM.matches) {
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
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive:true });
  frame();
}

/* ── form ────────────────────────────────────────────────── */
$$('#reason button').forEach(b => b.addEventListener('click', () => {
  $$('#reason button').forEach(x => x.classList.toggle('on', x === b));
}));
const form = $('#bookform'), ok = $('#okmsg');
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
