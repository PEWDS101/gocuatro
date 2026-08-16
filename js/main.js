/* ═══════════════════════════════════════════════════════════
   GoCuatro — behaviour
   language (EN/AR/KU + RTL) · sticky header · drawer · scroll-spy
   reveal · phone sheet · Gmail brief
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MAIL_TO   = 'GoCuatro4@gmail.com';
  var MAIL_BASE = 'https://mail.google.com/mail/?view=cm&fs=1&to=';
  var KEY       = 'gocuatro:lang';
  var FALLBACK  = 'en';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* only now may the stylesheet hide anything for animation */
  document.documentElement.classList.add('js');

  /* Scroll-driven animation support (Chrome/Edge/Safari 26+). Where it exists
     the reveals are handed to the compositor and scrub with the scroll; where
     it doesn't, the IntersectionObserver further down does the same job. */
  var SDA = !calm && typeof CSS !== 'undefined' && CSS.supports &&
            CSS.supports('animation-timeline', 'view()');
  if (SDA) document.documentElement.classList.add('sda');


  /* ── 1. Language ──────────────────────────────────────── */
  var PACKS = window.GC_I18N || {};
  var lang  = FALLBACK;

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function t(key) {
    var p = PACKS[lang];
    if (p && p.strings && p.strings[key] != null) return p.strings[key];
    var f = PACKS[FALLBACK];
    return (f && f.strings && f.strings[key] != null) ? f.strings[key] : '';
  }

  function setLang(code) {
    if (!PACKS[code]) code = FALLBACK;
    lang = code;

    var pack = PACKS[code];
    document.documentElement.setAttribute('lang', code);
    document.documentElement.setAttribute('dir', pack.dir || 'ltr');

    $$('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v) el.textContent = v;
    });

    /* data-i18n-attr="placeholder:form.namePh|title:some.key" */
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split('|').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i < 0) return;
        var v = t(pair.slice(i + 1).trim());
        if (v) el.setAttribute(pair.slice(0, i).trim(), v);
      });
    });

    var title = t('meta.title');
    if (title) document.title = title;

    /* the lightbox writes its own title/caption, so redraw it if it's open */
    if (lb && !lb.hidden) paintExample(exAt);

    $$('.lang__b').forEach(function (b) {
      var on = b.getAttribute('data-lang') === code;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    store(code);
  }

  $$('.lang__b').forEach(function (b) {
    b.addEventListener('click', function () {
      setLang(b.getAttribute('data-lang'));
      shutDrawer();
    });
  });

  setLang(stored() || FALLBACK);


  /* ── 2. Sticky header + scroll progress ───────────────── */
  var topbar = $('#nav');
  var bar    = $('#bar');
  var wasStuck = null;
  var ticking = false;

  function paint() {
    ticking = false;

    var now = window.scrollY > 20;
    if (now !== wasStuck) { topbar.classList.toggle('stuck', now); wasStuck = now; }

    if (bar) {
      var run = document.documentElement.scrollHeight - window.innerHeight;
      var pct = run > 0 ? Math.min(1, Math.max(0, window.scrollY / run)) : 0;
      bar.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  paint();


  /* ── 3. Drawer ────────────────────────────────────────── */
  var burger = $('#burger');
  var drawer = $('#drawer');
  var scrim  = $('#scrim');
  var openDrawer = false;

  function showDrawer() {
    if (openDrawer) return;
    openDrawer = true;
    scrim.hidden = false;
    requestAnimationFrame(function () { scrim.classList.add('on'); });
    drawer.classList.add('on');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('lock');
  }

  function shutDrawer() {
    if (!openDrawer) return;
    openDrawer = false;
    scrim.classList.remove('on');
    drawer.classList.remove('on');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('lock');
    setTimeout(function () { if (!openDrawer) scrim.hidden = true; }, 400);
  }

  burger.addEventListener('click', function () { openDrawer ? shutDrawer() : showDrawer(); });
  scrim.addEventListener('click', shutDrawer);
  window.addEventListener('resize', function () { if (window.innerWidth > 900) shutDrawer(); });


  /* ── 4. Smooth scroll ─────────────────────────────────── */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      shutDrawer();
      target.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });


  /* ── 5. Scroll-spy ────────────────────────────────────── */
  var links = $$('.nav__a');
  var secs  = $$('main section[id]');

  if ('IntersectionObserver' in window && secs.length) {
    var spy = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('is-on', l.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { spy.observe(s); });
  }


  /* ── 6. Reveal ────────────────────────────────────────── */
  var shy = $$('.rise');
  if (SDA) {
    /* CSS owns it — nothing to observe */
  } else if (calm || !('IntersectionObserver' in window)) {
    shy.forEach(function (el) { el.classList.add('in'); });
  } else {
    var eye = new IntersectionObserver(function (list, obs) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    shy.forEach(function (el) { eye.observe(el); });

    /* failsafe: if the observer has produced nothing at all, show everything.
       Costs the animation, never costs the content. */
    setTimeout(function () {
      if (!$('.rise.in')) shy.forEach(function (el) { el.classList.add('in'); });
    }, 1500);
  }


  /* ── 7. Phone sheet ───────────────────────────────────── */
  var sheet = $('#sheet');
  var cameFrom = null, sheetTimer = null;

  function showSheet() {
    if (sheetTimer) { clearTimeout(sheetTimer); sheetTimer = null; }
    cameFrom = document.activeElement;
    sheet.hidden = false;
    requestAnimationFrame(function () { sheet.classList.add('on'); });
    document.body.classList.add('lock');
    var first = sheet.querySelector('.opt');
    if (first) first.focus({ preventScroll: true });
  }

  function shutSheet() {
    if (sheet.hidden) return;
    sheet.classList.remove('on');
    document.body.classList.remove('lock');
    sheetTimer = setTimeout(function () {
      sheetTimer = null;
      sheet.hidden = true;
    }, 300);
    if (cameFrom && cameFrom.focus) cameFrom.focus({ preventScroll: true });
  }

  $$('[data-phone]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); showSheet(); });
  });
  $$('[data-close]').forEach(function (el) { el.addEventListener('click', shutSheet); });
  $$('.sheet__list .opt').forEach(function (a) {
    a.addEventListener('click', function () { setTimeout(shutSheet, 120); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    var box = $('#lb');
    if (box && !box.hidden) { shutExample(); return; }
    if (!sheet.hidden) { shutSheet(); return; }
    if (openDrawer) shutDrawer();
  });

  sheet.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || sheet.hidden) return;
    var able = $$('a[href], button:not([disabled])', sheet)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!able.length) return;
    var first = able[0], last = able[able.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });


  /* ── 8. Brief → pre-filled Gmail ──────────────────────── */
  var form = $('#brief');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var f = form.elements;
      var name = f.name.value.trim();
      var mail = f.email.value.trim();
      var kind = f.type.options[f.type.selectedIndex].textContent.trim();
      var note = f.message.value.trim();

      var bad = false;
      [['name', name], ['email', mail], ['message', note]].forEach(function (pair) {
        var el = f[pair[0]];
        var empty = !pair[1];
        el.classList.toggle('bad', empty);
        if (empty && !bad) { el.focus(); bad = true; }
      });
      if (bad) return;

      var subject = t('form.subject') + ' — ' + name;
      var body =
        t('form.name')    + ': ' + name + '\n' +
        t('form.email')   + ': ' + mail + '\n' +
        t('form.type')    + ': ' + kind + '\n\n' +
        t('form.message') + ':\n' + note + '\n';

      window.open(
        MAIL_BASE + encodeURIComponent(MAIL_TO) +
        '&su='   + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body),
        '_blank', 'noopener'
      );
    });

    $$('input, textarea', form).forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('bad'); });
    });
  }


  /* ── 9. Decorative editor: three files, typed on a loop ── */
  /* Purely visual. Tokens are [text, class]:
     tg tag/selector/keyword · at attribute/property · st string/value
     tx text/identifier · pn punctuation · cm comment · ac accent      */
  var SNIPPETS = [
    { file: 'index.html', lines: [
      [['<section', 'tg'], [' class', 'at'], ['=', 'pn'], ['"hero"', 'st'], ['>', 'tg']],
      [['  <h1', 'tg'], ['>', 'tg'], ['Design that works', 'tx'], ['.', 'ac'], ['</h1>', 'tg']],
      [['  <p', 'tg'], ['>', 'tg'], ['Built by hand.', 'tx'], ['</p>', 'tg']],
      [['  <a', 'tg'], [' href', 'at'], ['=', 'pn'], ['"#start"', 'st'], ['>', 'tg'], ['Start', 'tx'], ['</a>', 'tg']],
      [['</section>', 'tg']]
    ]},
    { file: 'style.css', lines: [
      [['.hero', 'tg'], [' {', 'pn']],
      [['  display', 'at'], [': ', 'pn'], ['grid', 'st'], [';', 'pn']],
      [['  place-items', 'at'], [': ', 'pn'], ['center', 'st'], [';', 'pn']],
      [['  gap', 'at'], [': ', 'pn'], ['clamp(1rem, 4vw, 3rem)', 'st'], [';', 'pn']],
      [['}', 'pn']]
    ]},
    { file: 'app.js', lines: [
      [['const', 'tg'], [' reveal ', 'tx'], ['= (', 'pn'], ['items', 'at'], [') => {', 'pn']],
      [['  items', 'at'], ['.', 'pn'], ['forEach', 'tx'], ['((', 'pn'], ['el, i', 'at'], [') => {', 'pn']],
      [['    el', 'at'], ['.classList.', 'pn'], ['add', 'tx'], ['(', 'pn'], ["'in'", 'st'], [');', 'pn']],
      [['  });', 'pn']],
      [['};', 'pn']]
    ]}
  ];

  var codeBox = $('#code');
  var tabsBox = $('#tabs');

  function setTab(i) {
    if (!tabsBox) return;
    var tabs = tabsBox.children;
    for (var k = 0; k < tabs.length; k++) tabs[k].classList.toggle('is-on', k === i);
  }

  function buildLine(n) {
    var row = document.createElement('span');
    row.className = 'cl';
    var num = document.createElement('span');
    num.className = 'ln';
    num.textContent = String(n);
    var body = document.createElement('span');
    body.className = 'cx';
    row.appendChild(num);
    row.appendChild(body);
    codeBox.appendChild(row);
    return body;
  }

  function renderWhole(snip) {
    codeBox.innerHTML = '';
    snip.lines.forEach(function (line, i) {
      var body = buildLine(i + 1);
      line.forEach(function (tok) {
        var s = document.createElement('span');
        s.className = tok[1];
        s.textContent = tok[0];
        body.appendChild(s);
      });
    });
    codeBox.classList.add('done');
  }

  /* Driven by requestAnimationFrame, not setTimeout: a background tab
     throttles timers to ~1s a tick, which would drag this out to minutes.
     rAF simply pauses until the visitor is actually looking. */
  function runEditor() {
    var caret = document.createElement('span');
    caret.className = 'cur';

    var CHAR = 17, EOL = 95, HOLD = 3400, FADE = 340, GAP = 220;

    var snip = 0, phase = 'type';
    var li = 0, ti = 0, ci = 0, body = null, tokEl = null;
    var due = 650, prev = 0;                   /* let the hero settle first */

    function begin() {
      codeBox.innerHTML = '';
      codeBox.classList.remove('fade', 'done');
      setTab(snip);
      li = 0; ti = 0; ci = 0; body = null; tokEl = null;
      phase = 'type';
    }

    function advance() {                       /* -> ms until the next tick */
      if (phase === 'hold') {
        phase = 'fade';
        codeBox.classList.add('fade');
        return FADE;
      }
      if (phase === 'fade') {
        snip = (snip + 1) % SNIPPETS.length;
        begin();
        return GAP;
      }

      var lines = SNIPPETS[snip].lines;
      if (li >= lines.length) {                /* snippet finished */
        phase = 'hold';
        codeBox.classList.add('done');         /* retires the caret */
        return HOLD;
      }
      if (!body) { body = buildLine(li + 1); tokEl = null; ti = 0; ci = 0; }

      var line = lines[li];
      if (ti >= line.length) { li++; body = null; return EOL; }

      var tok = line[ti];
      if (!tokEl) {
        tokEl = document.createElement('span');
        tokEl.className = tok[1];
        body.appendChild(tokEl);
      }
      tokEl.appendChild(document.createTextNode(tok[0].charAt(ci)));
      body.appendChild(caret);                 /* caret trails the text */
      ci++;
      if (ci >= tok[0].length) { ti++; ci = 0; tokEl = null; }
      return CHAR;
    }

    function frame(ts) {
      if (!prev) prev = ts;
      due -= (ts - prev);
      prev = ts;

      var guard = 0;
      while (due <= 0 && guard++ < 400) due += advance();
      requestAnimationFrame(frame);
    }

    setTab(0);
    requestAnimationFrame(frame);
  }

  if (codeBox) {
    if (calm) { setTab(0); renderWhole(SNIPPETS[0]); }
    else runEditor();
  }


  /* ── 9b. Example lightbox ─────────────────────────────── */
  var lb      = $('#lb');
  var lbShot  = $('#lbShot');
  var lbTitle = $('#lbTitle');
  var lbDesc  = $('#lbDesc');
  var lbCount = $('#lbCount');
  var EX_KEYS = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'];
  var exAt = 0, exFrom = null, lbTimer = null;

  function paintExample(i) {
    exAt = (i + EX_KEYS.length) % EX_KEYS.length;

    var tpl = document.getElementById('ex' + exAt);
    lbShot.innerHTML = '';
    if (tpl) {
      var art = tpl.content.cloneNode(true);
      lbShot.appendChild(art);
      var svg = lbShot.querySelector('svg');
      if (svg) {
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', t('builds.' + EX_KEYS[exAt]));
      }
    }

    lbTitle.textContent = t('builds.' + EX_KEYS[exAt]);
    lbDesc.textContent  = t('show.d' + (exAt + 1));
    lbCount.textContent = (exAt + 1) + ' / ' + EX_KEYS.length;
  }

  function openExample(i) {
    if (!lb) return;
    /* cancel a pending close, or it will blank the example we are opening */
    if (lbTimer) { clearTimeout(lbTimer); lbTimer = null; }
    exFrom = document.activeElement;
    paintExample(i);
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add('on'); });
    document.body.classList.add('lock');
    var x = lb.querySelector('.lb__x');
    if (x) x.focus({ preventScroll: true });
  }

  function shutExample() {
    if (!lb || lb.hidden) return;
    lb.classList.remove('on');
    document.body.classList.remove('lock');
    lbTimer = setTimeout(function () {
      lbTimer = null;
      lb.hidden = true;
      lbShot.innerHTML = '';
    }, 320);
    if (exFrom && exFrom.focus) exFrom.focus({ preventScroll: true });
  }

  $$('[data-ex]').forEach(function (el) {
    el.addEventListener('click', function () {
      openExample(parseInt(el.getAttribute('data-ex'), 10) || 0);
    });
  });
  $$('[data-lbclose]').forEach(function (el) { el.addEventListener('click', shutExample); });
  $$('[data-lbprev]').forEach(function (el) { el.addEventListener('click', function () { paintExample(exAt - 1); }); });
  $$('[data-lbnext]').forEach(function (el) { el.addEventListener('click', function () { paintExample(exAt + 1); }); });

  if (lb) {
    lb.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); paintExample(exAt + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); paintExample(exAt - 1); }
      if (e.key !== 'Tab') return;
      var able = $$('a[href], button:not([disabled])', lb)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!able.length) return;
      var first = able[0], last = able[able.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }


  /* ── 10. Cursor spotlight ─────────────────────────────── */
  /* One delegated listener, throttled to a frame, writing two custom
     properties. Phones never run it — the media query gates the paint too. */
  if (!calm && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var lastMove = null, queued = false;

    document.addEventListener('pointermove', function (e) {
      lastMove = e;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        if (!lastMove || !lastMove.target.closest) return;
        var el = lastMove.target.closest('.card, .build, .wcard');
        if (!el) return;
        var box = el.getBoundingClientRect();
        el.style.setProperty('--mx', (lastMove.clientX - box.left) + 'px');
        el.style.setProperty('--my', (lastMove.clientY - box.top) + 'px');
      });
    }, { passive: true });
  }


  /* ── 11. Year ─────────────────────────────────────────── */
  var yr = $('#yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

})();
