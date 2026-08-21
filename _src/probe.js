/**
 * Behaviour probe — checks what a screenshot cannot.
 *
 *   node _src/probe.js          (needs a server on :8910)
 *
 * Walks every page, switches through all three languages, and checks console
 * errors, real horizontal overflow, that the current nav item is marked, that
 * the reveal actually revealed, and that the retired phone number is gone.
 */
const path = require('path');
const MODULES = 'C:\\Users\\XAMLAN PC\\Downloads\\gocuatro-website\\work\\_src\\video\\node_modules';
const { chromium } = require(path.join(MODULES, 'playwright'));

const BASE = process.env.BASE || 'http://localhost:8910/';
const PAGES = ['index', 'about', 'services', 'work', 'process', 'contact'];
// Compare with ALL whitespace stripped. The displayed form is "0750 348 2487",
// so a naive includes('3482487') passes while the old number is on screen —
// which is exactly how it survived on the contact page.
const OLD_DIGITS = '7503482487';

let fails = 0;
const fail = (m) => { fails++; console.log('  FAIL ' + m); };

(async () => {
  const browser = await chromium.launch();

  for (const name of PAGES) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));

    await page.goto(BASE + name + '.html', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(600);
    console.log('\n' + name + '.html');

    if (errors.length) fail('console: ' + errors.slice(0, 3).join(' | '));

    // page-level horizontal overflow. The off-canvas drawer parks outside the
    // viewport by design, so measure the document, not element rects.
    const of = await page.evaluate(() => {
      const de = document.documentElement;
      return { s: de.scrollWidth, c: de.clientWidth };
    });
    if (of.s > of.c + 1) fail(`h-overflow ${of.s}/${of.c}`);

    // the nav marks the page we are on, from body[data-page] in CSS
    const lit = await page.evaluate(() => {
      const on = [...document.querySelectorAll('.nav__links .nav__a')]
        .filter(a => getComputedStyle(a, '::after').content !== 'none');
      return { count: on.length, text: on.map(a => a.textContent.trim()).join(',') };
    });
    if (lit.count !== 1) fail(`nav marks ${lit.count} items (${lit.text})`);
    else console.log('  nav       ' + lit.text);

    // the retired number must be gone from the rendered page
    const stale = await page.evaluate((n) => {
      const flat = document.body.innerText.replace(/[\s ()+-]/g, '');
      const links = [...document.querySelectorAll('a[href]')].map(a => a.href).join(' ');
      return flat.includes(n) || links.replace(/[\s+()-]/g, '').includes(n);
    }, OLD_DIGITS);
    if (stale) fail('retired phone number still on the page or in a link');

    // reveal: nothing that should be visible may be left at opacity 0
    const hidden = await page.evaluate(() => {
      return [...document.querySelectorAll('.rise, .up')].filter(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return false;   // off-screen is fine
        return parseFloat(getComputedStyle(el).opacity) < 0.05;
      }).length;
    });
    if (hidden) fail(`${hidden} in-viewport element(s) still at opacity 0`);

    // every language, including the deliberate Kurdish LTR
    for (const lang of ['ar', 'ckb', 'en']) {
      await page.click(`.nav__end .lang__b[data-lang="${lang}"]`).catch(() => {});
      await page.waitForTimeout(320);
      const st = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        // any element still showing a raw key means a lookup miss
        raw: document.body.innerText.match(/\b[a-z]+\.[a-z][a-zA-Z0-9.]+\b/g) || [],
      }));
      // Kurdish was 'ltr' until 2026-08-20; it is Arabic script and now runs
      // right-to-left like Arabic, on the owner's instruction.
      const want = lang === 'en' ? 'ltr' : 'rtl';
      if (st.dir !== want) fail(`${lang}: dir is ${st.dir}, expected ${want}`);
      const keys = st.raw.filter(k => /^(nav|hero|about|services|work|process|faq|contact|cta|home|meta|footer)\./.test(k));
      if (keys.length) fail(`${lang}: untranslated key(s) on screen: ${keys.slice(0, 3).join(', ')}`);
    }
    console.log('  languages ar/ckb/en ok (ar + ckb both rtl)');

    await page.close();
  }

  /* ── the claims that must never drift ─────────────────────────────────
     These are the promises the site makes about money and time. They are
     checked in every language, because a translated string is exactly where a
     "starting at" quietly turns into a flat price. */
  const cfg = (() => {
    const fs = require('fs');
    const src = fs.readFileSync(path.resolve(__dirname, '..', 'js', 'config.js'), 'utf8');
    const g = {};
    new Function('window', src)(g);
    return g.GC_CONFIG || {};
  })();

  for (const [name, ids] of [['services', ['#pricing']], ['index', ['#prices']]]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(BASE + name + '.html', { waitUntil: 'networkidle' });
    console.log('\n' + name + '.html — pricing claims');

    for (const lang of ['en', 'ar', 'ckb']) {
      await page.click(`.nav__end .lang__b[data-lang="${lang}"]`).catch(() => {});
      await page.waitForTimeout(300);

      // every amount must be preceded by a "starting at" label in the same row
      const bare = await page.evaluate(() =>
        [...document.querySelectorAll('.price__amt')].filter(el => {
          const row = el.closest('.price__tag, .prow__p');
          return !row || !row.querySelector('.price__from');
        }).length);
      if (bare) fail(`${lang}: ${bare} price(s) with no "Starting at" label`);

      // The NUMERAL must read left-to-right. Since the move to dinars the
      // isolate is an inner <span>, not the whole amount: the currency label
      // sits outside it so bidi can place "د.ع" correctly for Arabic and
      // Kurdish. So find whichever element actually holds the digits and check
      // THAT — checking the wrapper would now pass in English and fail in RTL
      // for a page that is in fact correct.
      const flipped = await page.evaluate(() =>
        [...document.querySelectorAll('.price__amt, .price__rng, .note__badge b')]
          .map(el => {
            const holder = [...el.querySelectorAll('*')]
              .find(c => /\d/.test(c.textContent) && !c.children.length) || el;
            return { text: holder.textContent.trim(),
                     dir: getComputedStyle(holder).direction };
          })
          .filter(o => o.dir !== 'ltr'));
      if (flipped.length)
        fail(`${lang}: ${flipped.length} numeral(s) not ltr-isolated: `
             + flipped.map(o => o.text).join(' / '));

      // and they must be exactly the three figures in config.py — not a number
      // typed into a translation. Compared as a SET of raw integers, because
      // the cards are ordered by price (that order changes when a price does)
      // and the page shows them grouped: 75000 in config renders as "75,000".
      const shown = await page.evaluate(() =>
        [...document.querySelectorAll('.price__amt')].map(el => el.textContent.trim()));
      const digits = v => v.replace(/[^0-9]/g, '');
      const want = [cfg.PRICE_PORTFOLIO, cfg.PRICE_MENU, cfg.PRICE_BUSINESS];
      const norm = a => [...a].map(digits).sort().join('|');
      if (norm(shown) !== norm(want))
        fail(`${lang}: prices ${shown.join(' / ')} are not config's ${want.join(', ')}`);

      // the grouped form is what a person reads, so check it really is grouped
      const ungrouped = shown.filter(v => !/\d{1,3}(,\d{3})+/.test(v));
      if (ungrouped.length)
        fail(`${lang}: price(s) not thousands-grouped: ${ungrouped.join(' / ')}`);

      // and every amount must name its currency, in this language
      const noCur = await page.evaluate(() =>
        [...document.querySelectorAll('.price__amt, .price__rng')]
          .filter(el => !el.querySelector('.price__cur')).length);
      if (noCur) fail(`${lang}: ${noCur} amount(s) with no currency label`);

      // no dollar sign may survive anywhere on the page, in any language
      const dollars = await page.evaluate(() =>
        (document.body.innerText.match(/\$\s?\d/g) || []).length);
      if (dollars) fail(`${lang}: ${dollars} dollar amount(s) still on the page`);

      // the ladder must read low to high: a pricing table that goes 70, 50, 150
      // looks like an oversight even when every figure is right
      const nums = shown.map(v => parseFloat(v.replace(/[^0-9.]/g, '')));
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] < nums[i - 1]) {
          fail(`${lang}: prices are not in ascending order (${shown.join(', ')})`);
          break;
        }
      }
    }
    await page.click('.nav__end .lang__b[data-lang="en"]').catch(() => {});
    console.log('  prices  all "Starting at", ltr-isolated, and from config.py');
    void ids;
    await page.close();
  }

  /* ── the 2–4 day promise always carries its condition ─────────────────
     Checked on the rendered page, in all three languages: the sentence that
     contains the day figure must also contain the "once we have your content"
     clause. price.timeD is one string per language, reused everywhere, so
     this is really a check that nobody wrote a second, looser version. */
  {
    const COND = {
      en: /content/i,
      ar: /محتوى|المحتوى/,
      ckb: /ناوەڕۆک/
    };
    for (const name of ['services', 'process', 'contact']) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await page.goto(BASE + name + '.html', { waitUntil: 'networkidle' });
      for (const lang of ['en', 'ar', 'ckb']) {
        await page.click(`.nav__end .lang__b[data-lang="${lang}"]`).catch(() => {});
        await page.waitForTimeout(280);
        const txt = await page.evaluate(() => {
          const el = document.querySelector('[data-i18n="price.timeD"]');
          return el ? el.textContent.trim() : null;
        });
        if (!txt) { fail(`${name}/${lang}: no price.timeD on the page`); continue; }
        if (!COND[lang].test(txt))
          fail(`${name}/${lang}: turnaround sentence does not name the content condition`);
      }
      await page.close();
    }
    console.log('\nturnaround  2–4 days always states it starts after content arrives');
  }

  /* ── the brief form validates before it opens anything ────────────────
     window.open is stubbed, so a failure here is a form that would have
     launched WhatsApp with an empty brief. */
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(BASE + 'contact.html', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      window.__opened = [];
      window.open = (u) => { window.__opened.push(u); return null; };
    });

    await page.click('#brief button[type="submit"]');
    await page.waitForTimeout(120);
    let opened = await page.evaluate(() => window.__opened.length);
    if (opened) fail('empty brief still opened WhatsApp');

    const marked = await page.evaluate(() =>
      document.querySelectorAll('#brief .bad').length);
    if (marked !== 3) fail(`empty brief marked ${marked} field(s), expected 3`);
    const said = await page.evaluate(() => (document.getElementById('briefLive') || {}).textContent);
    if (!said) fail('no message announced for an invalid brief');

    await page.fill('#f-name', 'Aram Ali');
    await page.fill('#f-contact', '0770 123 4567');
    await page.fill('#f-msg', 'A cafe menu in Arabic & English. Photos ready.');
    await page.click('#brief button[type="submit"]');
    await page.waitForTimeout(150);

    const url = await page.evaluate(() => window.__opened[0] || '');
    if (!url) fail('a complete brief did not open WhatsApp');
    else {
      if (url.indexOf('https://wa.me/' + cfg.WA_NUMBER + '?text=') !== 0)
        fail('brief opened the wrong WhatsApp URL: ' + url.slice(0, 60));
      const text = decodeURIComponent(url.split('?text=')[1] || '');
      for (const need of ['Aram Ali', '0770 123 4567', 'cafe menu']) {
        if (text.indexOf(need) < 0) fail(`brief body is missing "${need}"`);
      }
      // an unencoded space or newline would break the URL in a chat client
      if (/[ \n"']/.test(url)) fail('WhatsApp URL is not fully encoded');
    }
    console.log('\nbrief form  blocks an empty submit, then opens ' +
                'wa.me/' + cfg.WA_NUMBER + ' with an encoded body');
    await page.close();
  }

  /* ── every wa.me link on the site points at the configured number ───── */
  {
    for (const name of PAGES) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await page.goto(BASE + name + '.html', { waitUntil: 'networkidle' });
      const wrong = await page.evaluate((n) =>
        [...document.querySelectorAll('a[href*="wa.me"]')]
          .map(a => a.getAttribute('href'))
          .filter(h => h.indexOf('wa.me/' + n) < 0), cfg.WA_NUMBER);
      if (wrong.length) fail(`${name}: wa.me link(s) with the wrong number: ${wrong.join(', ')}`);
      await page.close();
    }
    console.log('whatsapp    every wa.me link uses ' + cfg.WA_NUMBER);
  }

  await browser.close();
  console.log(fails ? `\n${fails} FAILURE(S)` : '\nall checks passed');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('PROBE CRASHED', e); process.exit(2); });
