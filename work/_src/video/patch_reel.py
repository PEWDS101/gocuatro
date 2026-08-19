"""Replace reel.html's config + timeline so captions are generated from the
footage slice they describe (they can no longer drift), with 6 beats per site
and a quicker overall cut."""
import pathlib

NEW = r'''/* ═══ per-site content ═══════════════════════════════════
   Every beat pairs a slice of the recording with the caption describing THAT
   slice. Captions are generated from the beats, so a caption can never
   describe a moment the viewer is not looking at. Fractions were read off the
   actual recordings frame by frame.                                      */
const CFG = {
  tenur: {
    g:'radial-gradient(120% 90% at 50% 10%,#1b120a 0%,#0a0705 60%,#000 100%)',
    acc:'#F0AC33', acc2:'#C9431E', kind:'RESTAURANT',
    hook:['مطعمك بدون','<em>موقع؟</em>'],
    endh:'نصمّم لك <em>موقعاً مثل هذا</em>',
    endp:'تصميم يدوي بالكامل · بدون قوالب جاهزة',
    beats:[
      {f:[0.20,0.29], cam:'rise',  ar:'واجهة تفتح على النار',       en:'THE HERO'},
      {f:[0.55,0.63], cam:'punch', ar:'قائمة الطعام كاملة',         en:'FULL MENU'},
      {f:[0.65,0.73], cam:'hero',  ar:'صورة كل طبق أمام الزبون',     en:'DISH PREVIEW', call:'شوف الطبق', callPos:[560,900]},
      {f:[0.75,0.83], cam:'tilt',  ar:'الأسعار بالدينار العراقي',    en:'PRICES IN IQD'},
      {f:[0.86,0.91], cam:'whip',  ar:'صور المطعم من الداخل',       en:'THE GALLERY'},
      {f:[0.93,0.99], cam:'float', ar:'حجز طاولة من الموقع',        en:'TABLE BOOKING'}
    ]
  },
  zana: {
    g:'radial-gradient(120% 90% at 50% 10%,#0b1a1c 0%,#050b0d 60%,#000 100%)',
    acc:'#5FD3C2', acc2:'#3E7C74', kind:'CLINIC',
    hook:['عيادتك بدون','<em>موقع؟</em>'],
    endh:'نصمّم لك <em>موقعاً مثل هذا</em>',
    endp:'تصميم يدوي بالكامل · بدون قوالب جاهزة',
    beats:[
      {f:[0.20,0.29], cam:'rise',  ar:'واجهة هادئة تشرح نفسها',     en:'THE HERO'},
      {f:[0.35,0.43], cam:'punch', ar:'أرقام العيادة وخبرتها',       en:'TRUST'},
      {f:[0.52,0.60], cam:'hero',  ar:'اسحب… وشوف الفرق',           en:'BEFORE / AFTER', call:'اسحب', callPos:[540,760]},
      {f:[0.65,0.74], cam:'tilt',  ar:'نتائج حقيقية للمرضى',         en:'REAL RESULTS'},
      {f:[0.79,0.86], cam:'whip',  ar:'أربع خطوات بلا مفاجآت',       en:'YOUR VISIT'},
      {f:[0.90,0.98], cam:'float', ar:'كل العلاجات وأسعارها',        en:'TREATMENTS'}
    ]
  },
  zeri: {
    g:'radial-gradient(120% 90% at 50% 10%,#1c0c12 0%,#0a0507 60%,#000 100%)',
    acc:'#FF5C7A', acc2:'#8E2436', kind:'ONLINE STORE',
    hook:['متجرك بدون','<em>موقع؟</em>'],
    endh:'نصمّم لك <em>متجراً مثل هذا</em>',
    endp:'متجر إلكتروني كامل · مبني من الصفر',
    beats:[
      {f:[0.21,0.30], cam:'rise',  ar:'واجهة بمستوى مجلة أزياء',     en:'THE HERO'},
      {f:[0.34,0.42], cam:'punch', ar:'قطع محدودة العدد',           en:'THE BRAND'},
      {f:[0.50,0.58], cam:'hero',  ar:'كل المنتجات بصور احترافية',   en:'THE COLLECTION'},
      {f:[0.60,0.68], cam:'tilt',  ar:'أضف للسلة بضغطة',            en:'ADD TO BAG', call:'أضف للسلة', callPos:[600,880]},
      {f:[0.78,0.85], cam:'whip',  ar:'معرض الصور',                 en:'LOOKBOOK'},
      {f:[0.91,0.99], cam:'float', ar:'سلة الشراء والمجموع مباشرة',  en:'YOUR BAG'}
    ]
  },
  zagros: {
    g:'radial-gradient(120% 90% at 50% 10%,#1a0a0c 0%,#08090b 60%,#000 100%)',
    acc:'#FF4750', acc2:'#8A9299', kind:'SHOWROOM',
    hook:['معرضك بدون','<em>موقع؟</em>'],
    endh:'نصمّم لك <em>موقعاً مثل هذا</em>',
    endp:'تصميم يدوي بالكامل · بدون قوالب جاهزة',
    beats:[
      {f:[0.20,0.29], cam:'rise',  ar:'كل سيارة ومعها تقرير فحصها',  en:'THE HERO'},
      {f:[0.41,0.48], cam:'punch', ar:'مواصفات كاملة وسعر واضح',     en:'FULL SPECS'},
      {f:[0.51,0.59], cam:'hero',  ar:'بدّل لون السيارة',            en:'COLOUR SWITCH', call:'بدّل اللون', callPos:[540,700]},
      {f:[0.62,0.70], cam:'tilt',  ar:'شوف كل لون قبل ما تجي',       en:'EVERY COLOUR'},
      {f:[0.82,0.88], cam:'whip',  ar:'كل المعروض أمامك',           en:'FULL STOCK'},
      {f:[0.91,0.98], cam:'float', ar:'رتّب وفلتر حسب طلبك',         en:'SORT & FILTER'}
    ]
  },
  hez: {
    g:'radial-gradient(120% 90% at 50% 10%,#0b0f22 0%,#05060a 60%,#000 100%)',
    acc:'#7A90FF', acc2:'#2B4BFF', kind:'GYM',
    hook:['ناديك بدون','<em>موقع؟</em>'],
    endh:'نصمّم لك <em>موقعاً مثل هذا</em>',
    endp:'تصميم يدوي بالكامل · بدون قوالب جاهزة',
    beats:[
      {f:[0.19,0.27], cam:'rise',  ar:'عدّاد الحصة القادمة… مباشر',  en:'LIVE COUNTDOWN', call:'مباشر', callPos:[620,660]},
      {f:[0.38,0.46], cam:'punch', ar:'واجهة تشدّ الانتباه',         en:'THE HERO'},
      {f:[0.53,0.62], cam:'hero',  ar:'جدول كل الحصص',              en:'CLASS SCHEDULE'},
      {f:[0.67,0.76], cam:'tilt',  ar:'اختر اليوم بضغطة',           en:'PICK A DAY'},
      {f:[0.83,0.89], cam:'whip',  ar:'الصالة من الداخل',           en:'THE FLOOR'},
      {f:[0.92,0.99], cam:'float', ar:'باقات العضوية',              en:'MEMBERSHIPS'}
    ]
  }
};

const q = new URLSearchParams(location.search);
const site = q.get('site') || 'tenur';
const NF = parseInt(q.get('nf') || '400');
const c = CFG[site];
const R = document.documentElement.style;
R.setProperty('--g', c.g); R.setProperty('--acc', c.acc); R.setProperty('--acc2', c.acc2);

document.getElementById('bblogo').src = '/assets/logo-mark.png';
document.getElementById('endlogo').src = '/assets/logo-mark.png';
document.getElementById('bbkind').textContent = c.kind;
document.getElementById('endh').innerHTML = c.endh;
document.getElementById('endp').textContent = c.endp;
document.getElementById('hook').innerHTML = c.hook.map(function(l){
  return '<span class="l"><span class="r">' + l + '</span><span class="b">' + l + '</span>' + l + '</span>';
}).join('');

/* ═══ timeline — quicker: 1.0s hook, 2.05s per beat, 3.0s end card ═══ */
const HOOK = 1.00, BEAT = 2.05, ENDC = 3.00;
const SHOTS = [{ t:[0, HOOK], kind:'hook' }];
c.beats.forEach(function(b, i){
  const t0 = HOOK + i * BEAT;
  SHOTS.push({ t:[t0, t0 + BEAT], kind:b.cam, f:b.f, beat:b,
               zoom: b.cam === 'punch' ? 1.85 : (b.cam === 'hero' ? 1.5 : undefined),
               focus: 0.42 });
});
const T_END = HOOK + c.beats.length * BEAT;
SHOTS.push({ t:[T_END, T_END + ENDC], kind:'end', f:[0.95,1.00] });
const DUR = T_END + ENDC;
window.__dur = function(){ return DUR; };

const el = {
  rig:document.getElementById('rig'), ghost:document.getElementById('ghost'),
  shot:document.getElementById('shot'), shot2:document.getElementById('shot2'),
  hook:document.getElementById('hook'), label:document.getElementById('label'),
  ltxt:document.querySelector('#label .txt'), lsub:document.querySelector('#label .sub'),
  brand:document.getElementById('brandbar'), end:document.getElementById('end'),
  call:document.getElementById('call'), calllab:document.querySelector('#call .lab'),
  flash:document.getElementById('flash'), bar:document.getElementById('barfill'),
  a1:document.querySelector('#aura .a1'), a2:document.querySelector('#aura .a2'),
  scan:document.getElementById('scan'), grain:document.getElementById('grain')
};

function lerp(a,b,k){return a+(b-a)*k;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function eOut(k){return 1-Math.pow(1-k,3);}
function eInOut(k){return k<0.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;}
function frameSrc(i){
  var n = String(clamp(Math.round(i),1,NF));
  while(n.length<5) n='0'+n;
  return 'sf/'+site+'/'+n+'.jpg';
}
function shotAt(t){
  for(var i=0;i<SHOTS.length;i++){ if(t>=SHOTS[i].t[0]&&t<SHOTS[i].t[1]) return SHOTS[i]; }
  return SHOTS[SHOTS.length-1];
}

window.__setTime = function(t){
  var s = shotAt(t);
  var k = clamp((t - s.t[0]) / (s.t[1] - s.t[0]), 0, 1);
  var since = t - s.t[0];

  if (s.f){
    var fr = lerp(s.f[0], s.f[1], k) * NF;
    el.shot.src = frameSrc(fr);
    el.shot2.src = frameSrc(fr);
  }

  var sc=1, x=0, y=0, ry=0, rx=0, rz=0, blur=0, op=1;
  function focusShift(f){ return (0.5 - f) * 1560 * 0.55; }

  if (s.kind==='hook'){ sc=1.9; y=260; op=0; blur=14; }
  else if (s.kind==='rise'){
    var e=eOut(clamp(since/0.85,0,1));
    sc=lerp(1.34,1.00,eInOut(k)); y=lerp(1250,0,e)+lerp(0,-20,k);
    rx=lerp(16,0,e); rz=lerp(-5,0,e); blur=lerp(16,0,clamp(since/0.45,0,1)); op=e;
  }
  else if (s.kind==='punch'){
    sc=lerp(s.zoom*1.08, s.zoom, eOut(k)); y=focusShift(s.focus)*s.zoom*0.5;
    blur=lerp(9,0,clamp(since/0.20,0,1));
  }
  else if (s.kind==='tilt'){
    sc=lerp(1.02,1.10,k); ry=lerp(-17,12,eInOut(k)); x=lerp(80,-80,eInOut(k));
    rz=lerp(2,-2,k); blur=lerp(7,0,clamp(since/0.22,0,1));
  }
  else if (s.kind==='hero'){
    sc=lerp(s.zoom,s.zoom*1.07,eInOut(k)); y=focusShift(s.focus)*s.zoom*0.5;
    blur=lerp(8,0,clamp(since/0.22,0,1));
  }
  else if (s.kind==='whip'){
    var w=clamp(since/0.34,0,1);
    sc=lerp(1.62,1.04,eOut(w)); x=lerp(1150,0,eOut(w));
    blur=lerp(30,0,eOut(w)); rz=lerp(-9,0,eOut(w));
  }
  else if (s.kind==='float'){
    sc=lerp(1.02,1.08,k); y=Math.sin(k*Math.PI*2)*20; ry=Math.sin(k*Math.PI*2)*7;
  }
  else if (s.kind==='end'){
    var ee=eInOut(clamp(since/0.9,0,1));
    sc=lerp(1.05,0.74,ee); y=lerp(0,150,ee); blur=lerp(0,18,ee); op=lerp(1,0.22,ee);
    rx=lerp(0,10,ee);
  }

  el.rig.style.transform =
    'translate3d('+x+'px,'+y+'px,0) rotateX('+rx+'deg) rotateY('+ry+'deg) rotateZ('+rz+'deg) scale('+sc+')';
  el.rig.style.filter = blur>0.05 ? 'blur('+blur.toFixed(2)+'px)' : 'none';
  el.rig.style.opacity = op;

  if (s.kind==='whip'){
    var w2=clamp(since/0.34,0,1);
    el.ghost.style.opacity=(1-w2)*0.55;
    el.ghost.style.transform='translate3d('+lerp(260,0,eOut(w2))+'px,0,0)';
    el.ghost.style.filter='blur('+lerp(26,0,eOut(w2))+'px)';
  } else el.ghost.style.opacity=0;

  if (s.kind==='hook'){
    var a=clamp((since-0.06)/0.26,0,1), out=clamp((HOOK-t)/0.20,0,1);
    el.hook.style.opacity = Math.min(a,out);
    var jit = since<0.42 ? (Math.sin(since*90)*3.5) : 0;
    var kids=el.hook.children;
    for(var i2=0;i2<kids.length;i2++){
      var d=clamp((since-0.06-i2*0.08)/0.28,0,1);
      kids[i2].style.transform='translateY('+lerp(70,0,eOut(d))+'px) scale('+lerp(1.14,1,eOut(d))+')';
      kids[i2].style.opacity=d;
      var r=kids[i2].querySelector('.r'), b2=kids[i2].querySelector('.b');
      if(r) r.style.transform='translateX('+jit+'px)';
      if(b2) b2.style.transform='translateX('+(-jit)+'px)';
    }
  } else el.hook.style.opacity=0;

  /* caption — always this beat's own words, so it matches the picture */
  if (s.beat){
    el.ltxt.textContent=s.beat.ar; el.lsub.textContent=s.beat.en;
    var la=clamp((since-0.06)/0.24,0,1), lo=clamp((s.t[1]-t-0.001)/0.22,0,1);
    el.label.style.opacity=Math.min(la,lo);
    el.label.style.transform='translateY('+lerp(46,0,eOut(la))+'px)';
  } else el.label.style.opacity=0;

  var bb = (t>HOOK+0.15 && t<T_END+0.2)
    ? clamp((t-HOOK-0.15)/0.35,0,1)*clamp((T_END+0.2-t)/0.3,0,1) : 0;
  el.brand.style.opacity=bb;
  el.brand.style.transform='translateY('+lerp(-30,0,clamp((t-HOOK-0.15)/0.35,0,1))+'px)';

  if (s.beat && s.beat.call){
    el.calllab.textContent=s.beat.call;
    var ca=clamp((since-0.36)/0.28,0,1), co=clamp((s.t[1]-t-0.25)/0.25,0,1);
    el.call.style.opacity=Math.min(ca,co)*0.96;
    var pulse=1+Math.sin(since*4.8)*0.07;
    var P=s.beat.callPos||[540,880];
    el.call.style.left=P[0]+'px';
    el.call.style.top=(P[1]+Math.sin(since*1.6)*10)+'px';
    el.call.style.transform='scale('+lerp(0.55,pulse,eOut(ca))+')';
  } else el.call.style.opacity=0;

  if (s.kind==='end'){
    var ea=clamp((since-0.25)/0.4,0,1);
    el.end.style.opacity=ea;
    var ek=el.end.children;
    for(var i3=0;i3<ek.length;i3++){
      var d3=clamp((since-0.25-i3*0.08)/0.4,0,1);
      ek[i3].style.transform='translateY('+lerp(52,0,eOut(d3))+'px)'; ek[i3].style.opacity=d3;
    }
  } else el.end.style.opacity=0;

  var fl=0;
  for(var i4=0;i4<SHOTS.length;i4++){
    var sh=SHOTS[i4];
    if(sh.kind!=='hook'&&sh.kind!=='rise'&&sh.kind!=='end'){
      var dd=t-sh.t[0];
      if(dd>=0&&dd<0.10) fl=Math.max(fl,(1-dd/0.10)*0.28);
    }
  }
  el.flash.style.opacity=fl;

  el.a1.style.transform='translate('+(180+Math.sin(t*0.5)*180)+'px,'+(180+Math.cos(t*0.42)*220)+'px)';
  el.a2.style.transform='translate('+(640+Math.cos(t*0.38)*200)+'px,'+(1180+Math.sin(t*0.55)*180)+'px)';
  el.scan.style.transform='translateY('+(((t*260)%2400)-420)+'px)';
  el.grain.style.transform='translate('+((t*997)%40-20)+'px,'+((t*613)%40-20)+'px)';
  el.bar.style.width=(t/DUR*100)+'%';
};

'''

p = pathlib.Path(__file__).parent / 'reel.html'
s = p.read_text(encoding='utf-8')
start = s.index('/* ═══ per-site content ═══')
end = s.index('window.__setTime(0);')
p.write_text(s[:start] + NEW + s[end:], encoding='utf-8')
print('reel.html patched — 6 beats per site, captions bound to footage')
