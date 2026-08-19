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
      const want = lang === 'ar' ? 'rtl' : 'ltr';
      if (st.dir !== want) fail(`${lang}: dir is ${st.dir}, expected ${want}`);
      const keys = st.raw.filter(k => /^(nav|hero|about|services|work|process|faq|contact|cta|home|meta|footer)\./.test(k));
      if (keys.length) fail(`${lang}: untranslated key(s) on screen: ${keys.slice(0, 3).join(', ')}`);
    }
    console.log('  languages ar/ckb/en ok (ckb stays ltr on purpose)');

    await page.close();
  }

  await browser.close();
  console.log(fails ? `\n${fails} FAILURE(S)` : '\nall checks passed');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('PROBE CRASHED', e); process.exit(2); });
