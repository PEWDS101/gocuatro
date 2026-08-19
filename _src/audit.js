/**
 * Full interaction audit — every link and control, every page, every width.
 *
 *   node _src/audit.js            (needs a server on :8910)
 *   BASE=https://gocuatro.com/ node _src/audit.js    (audit the live site)
 *
 * Written after the hero buttons were found dead: they still pointed at
 * #contact and #services, anchors that moved to their own pages when the site
 * was split. Nothing caught it because a dead same-page anchor throws no
 * error — the browser simply does nothing.
 *
 * For each page, at each width, it checks:
 *   LINKS      every href resolves. Internal pages must exist on disk; same-page
 *              anchors must have a matching id; external links are format-checked
 *              only (not fetched, so the audit stays offline and fast).
 *   REACHABLE  every visible link/button is actually clickable — non-zero size,
 *              inside the viewport, and with nothing else on top of it at its
 *              own centre point. This is what catches an invisible overlay
 *              eating taps, which is the classic "the button does nothing on my
 *              phone" cause.
 *   TAP SIZE   on phone widths, interactive targets should be >= 44x44 CSS px.
 *   DRAWER     on phone widths the burger must open the menu, the menu links
 *              must be reachable, and it must close again.
 *   NO OVERLAP the header must not cover the page's first heading.
 */
const fs = require('fs');
const path = require('path');
const MODULES = 'C:\\Users\\XAMLAN PC\\Downloads\\gocuatro-website\\work\\_src\\video\\node_modules';
const { chromium } = require(path.join(MODULES, 'playwright'));

const ROOT = path.resolve(__dirname, '..');
const BASE = process.env.BASE || 'http://localhost:8910/';
const PAGES = ['index', 'about', 'services', 'work', 'process', 'contact'];

// real device widths, not round numbers
const WIDTHS = [
  { w: 1440, h: 900, name: 'desktop' },
  { w: 1024, h: 800, name: 'tablet-l' },
  { w: 768,  h: 1024, name: 'tablet' },
  { w: 414,  h: 896, name: 'phone-lg' },   // iPhone 11 Pro Max / XR
  { w: 390,  h: 844, name: 'phone' },      // iPhone 12-15
  { w: 360,  h: 800, name: 'phone-sm' },   // common Android
  { w: 320,  h: 568, name: 'phone-xs' },   // iPhone SE 1st gen — the floor
];

let fails = 0, checks = 0;
const fail = (m) => { fails++; console.log('    FAIL  ' + m); };
const ok = () => { checks++; };

(async () => {
  const browser = await chromium.launch();

  for (const vp of WIDTHS) {
    const isPhone = vp.w <= 480;
    console.log(`\n══ ${vp.name}  ${vp.w}x${vp.h} ${'═'.repeat(30)}`);

    for (const name of PAGES) {
      const page = await browser.newPage({
        viewport: { width: vp.w, height: vp.h },
        hasTouch: isPhone, isMobile: isPhone,
      });
      const errs = [];
      page.on('pageerror', e => errs.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });

      await page.goto(BASE + name + '.html', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts && document.fonts.ready);
      await page.waitForTimeout(400);

      const label = `${name}.html`;
      if (errs.length) fail(`${label}: console — ${errs[0].slice(0, 90)}`);

      // ── LINKS ────────────────────────────────────────────────────────
      const links = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')].map(a => ({
          href: a.getAttribute('href'),
          abs: a.href,
          text: (a.textContent || '').trim().slice(0, 30),
          visible: !!(a.offsetWidth || a.offsetHeight || a.getClientRects().length),
        })));

      for (const l of links) {
        const h = l.href;
        if (!h || h.startsWith('javascript:')) continue;
        if (/^(mailto:|tel:|https?:\/\/)/.test(h)) { ok(); continue; }
        if (h.startsWith('#')) {
          const id = h.slice(1);
          const found = await page.evaluate(i => !!document.getElementById(i), id);
          if (!found) fail(`${label}: dead anchor ${h}  ("${l.text}")`);
          else ok();
          continue;
        }
        // internal page or asset
        const clean = h.split('#')[0].split('?')[0];
        if (!clean) { ok(); continue; }
        const onDisk = path.join(ROOT, decodeURIComponent(clean));
        if (!fs.existsSync(onDisk)) fail(`${label}: link target missing — ${h}  ("${l.text}")`);
        else {
          // if it carries a #fragment, that id must exist in the target file
          const frag = h.split('#')[1];
          if (frag) {
            const html = fs.readFileSync(onDisk, 'utf8');
            if (!html.includes(`id="${frag}"`)) fail(`${label}: ${h} — no id="${frag}" in ${clean}`);
            else ok();
          } else ok();
        }
      }

      // ── REACHABLE: is anything covering the controls? ────────────────
      const blocked = await page.evaluate(() => {
        const out = [];
        const els = [...document.querySelectorAll('a[href], button')];
        for (const el of els) {
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) continue;              // hidden
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
          if (r.top > innerHeight || r.bottom < 0) continue;      // off-screen vertically
          if (el.closest('[aria-hidden="true"], [hidden]')) continue;
          const x = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 1);
          const y = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 1);
          const hit = document.elementFromPoint(x, y);
          if (hit && !el.contains(hit) && !hit.contains(el)) {
            out.push({
              text: (el.textContent || el.getAttribute('aria-label') || '?').trim().slice(0, 26),
              by: hit.tagName.toLowerCase() + '.' + (hit.className || '').toString().split(' ')[0],
            });
          }
        }
        return out;
      });
      for (const b of blocked) fail(`${label}: "${b.text}" is covered by ${b.by}`);
      if (!blocked.length) ok();

      // ── TAP TARGETS ──────────────────────────────────────────────────
      if (isPhone) {
        const small = await page.evaluate(() =>
          [...document.querySelectorAll('a[href], button')].filter(el => {
            const r = el.getBoundingClientRect();
            if (r.width < 2 || r.height < 2) return false;
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden') return false;
            if (el.closest('[aria-hidden="true"], [hidden], .drawer, .sheet')) return false;
            if (el.closest('.foot__legal')) return false;
            return r.height < 44 || r.width < 24;
          }).map(el => ({
            t: (el.textContent || el.getAttribute('aria-label') || '?').trim().slice(0, 22),
            h: Math.round(el.getBoundingClientRect().height),
          })));
        for (const s of small.slice(0, 4)) fail(`${label}: tap target "${s.t}" only ${s.h}px tall (want 44)`);
        if (!small.length) ok();
      }

      // ── HEADER MUST NOT COVER THE FIRST HEADING ──────────────────────
      const covered = await page.evaluate(() => {
        const h = document.querySelector('main h1, main h2');
        const nav = document.querySelector('.nav');
        if (!h || !nav) return false;
        const hr = h.getBoundingClientRect(), nr = nav.getBoundingClientRect();
        return hr.top < nr.bottom && hr.bottom > nr.top && hr.top >= 0;
      });
      if (covered) fail(`${label}: header overlaps the first heading`);
      else ok();

      // ── DRAWER (phones only) ─────────────────────────────────────────
      if (isPhone) {
        const burger = await page.$('#burger');
        if (!burger) fail(`${label}: no burger button at ${vp.w}px`);
        else {
          const seen = await page.evaluate(() => {
            const b = document.getElementById('burger');
            const r = b.getBoundingClientRect();
            return r.width > 0 && r.right <= innerWidth && r.left >= 0;
          });
          if (!seen) fail(`${label}: burger is off-screen at ${vp.w}px`);

          await burger.click();
          await page.waitForTimeout(420);
          // A link the user can SCROLL to is reachable. The menu is taller
          // than a short phone, so hit-testing at the initial position marks
          // the last item unreachable even when the drawer scrolls fine.
          // Scroll each one into view first, then test what is on top of it.
          const open = await page.evaluate(async () => {
            const d = document.querySelector('.drawer');
            const r = d.getBoundingClientRect();
            const links = [...d.querySelectorAll('a')];
            let reach = 0;
            for (const a of links) {
              if (a.getBoundingClientRect().width < 2) continue;
              a.scrollIntoView({ block: 'center' });
              await new Promise(res => requestAnimationFrame(res));
              const lr = a.getBoundingClientRect();
              const hit = document.elementFromPoint(lr.left + lr.width / 2, lr.top + lr.height / 2);
              if (hit && (a.contains(hit) || a === hit)) reach++;
            }
            d.scrollTop = 0;
            return { onscreen: r.left < innerWidth && r.right > 0, links: links.length, reach };
          });
          if (!open.onscreen) fail(`${label}: drawer did not open at ${vp.w}px`);
          else if (open.reach < open.links) fail(`${label}: only ${open.reach}/${open.links} drawer links tappable`);
          else ok();

          await page.evaluate(() => document.getElementById('burger').click());
          await page.waitForTimeout(420);
          const shut = await page.evaluate(() => {
            const d = document.querySelector('.drawer');
            const r = d.getBoundingClientRect();
            return r.left >= innerWidth || r.right <= 0 || getComputedStyle(d).visibility === 'hidden';
          });
          if (!shut) fail(`${label}: drawer did not close at ${vp.w}px`);
          else ok();
        }
      }

      await page.close();
    }
  }

  await browser.close();
  console.log('\n' + '─'.repeat(52));
  console.log(fails ? `${fails} FAILURE(S) across ${checks + fails} checks` : `all ${checks} checks passed`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('AUDIT CRASHED', e); process.exit(2); });
