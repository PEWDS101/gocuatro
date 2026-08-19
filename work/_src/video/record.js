/* ═══════════════════════════════════════════════════════════
   Record each concept site on a PHONE-shaped viewport.

   900x1950 keeps the sites' mobile layout (their breakpoint is 940px) while
   giving enough real pixels that the footage stays sharp when it fills a
   1080-wide reel. The context is deliberately NOT touch-enabled, so
   hover-only flourishes (the cursor dish preview, the product hover state)
   still fire even though the layout is the mobile one.

   node record.js [site ...]
   ═══════════════════════════════════════════════════════════ */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE || 'https://gocuatro.com';
const OUT = path.join(__dirname, 'raw');
const W = 900, H = 1950;

const CURSOR = () => {
  window.__cur = { x: 450, y: 900 };
  const add = () => {
    const s = document.createElement('style');
    s.textContent = `
      ::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}
      html{scrollbar-width:none!important}
      #__ptr{position:fixed;z-index:2147483647;left:0;top:0;pointer-events:none;
             width:44px;height:44px;margin:-22px 0 0 -22px;will-change:transform;
             transition:transform var(--ptr-t,90ms) linear}
      #__ptr b{position:absolute;inset:15px;border-radius:50%;background:#fff;
               box-shadow:0 0 18px rgba(255,255,255,.95),0 3px 10px rgba(0,0,0,.6)}
      #__ptr i{position:absolute;inset:0;border-radius:50%;border:2.5px solid rgba(255,255,255,.8);
               transition:transform .18s cubic-bezier(.2,.7,.3,1)}
      #__ptr.dn i{transform:scale(.5)}
      #__ptr.dn b{transform:scale(.75)}
      #__ring{position:fixed;z-index:2147483646;left:0;top:0;width:110px;height:110px;
              margin:-55px 0 0 -55px;border-radius:50%;pointer-events:none;
              border:3px solid rgba(255,255,255,.6);opacity:0;will-change:transform,opacity}
      @keyframes __tap{0%{transform:scale(.25);opacity:.95}100%{transform:scale(1.6);opacity:0}}
      #__ring.go{animation:__tap .55s ease-out}
    `;
    document.documentElement.appendChild(s);
    const p = document.createElement('div'); p.id = '__ptr'; p.innerHTML = '<i></i><b></b>';
    const r = document.createElement('div'); r.id = '__ring';
    document.documentElement.append(p, r);
    window.__setCur = (x, y) => {
      window.__cur = { x, y };
      p.style.transform = `translate(${x}px,${y}px)`;
      r.style.transform = `translate(${x}px,${y}px)`;
    };
    window.__press = d => p.classList.toggle('dn', !!d);
    window.__tap = () => { r.classList.remove('go'); void r.offsetWidth; r.classList.add('go'); };
    window.__setCur(450, 900);
  };
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', add) : add();
};

const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

async function glide(page, x, y, ms = 800) {
  const from = await page.evaluate(() => window.__cur || { x: 450, y: 900 });
  const steps = 10, dt = ms / steps;
  await page.evaluate(t => document.documentElement.style.setProperty('--ptr-t', t + 'ms'), Math.round(dt));
  for (let i = 1; i <= steps; i++) {
    const k = ease(i / steps);
    const nx = from.x + (x - from.x) * k, ny = from.y + (y - from.y) * k;
    await page.mouse.move(nx, ny);
    await page.evaluate(([a, b]) => window.__setCur(a, b), [nx, ny]);
    await page.waitForTimeout(dt);
  }
}

async function click(page) {
  await page.evaluate(() => { window.__press(true); window.__tap(); });
  await page.waitForTimeout(80);
  await page.mouse.down(); await page.waitForTimeout(60); await page.mouse.up();
  await page.evaluate(() => window.__press(false));
  await page.waitForTimeout(110);
}

async function scrollTo(page, to, ms = 1500) {
  await page.evaluate(([target, dur]) => new Promise(res => {
    const from = window.scrollY, delta = target - from, t0 = performance.now();
    const step = t => {
      const k = Math.min(1, (t - t0) / dur);
      const e = k < .5 ? 4*k*k*k : 1 - Math.pow(-2*k + 2, 3) / 2;
      window.scrollTo(0, from + delta * e);
      k < 1 ? requestAnimationFrame(step) : res();
    };
    requestAnimationFrame(step);
  }), [to, ms]);
}

const yOf = (page, sel) => page.evaluate(s => {
  const el = document.querySelector(s);
  return el ? window.scrollY + el.getBoundingClientRect().top : null;
}, sel);

const boxOf = (page, sel, i = 0) => page.evaluate(([s, n]) => {
  const el = document.querySelectorAll(s)[n];
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width/2, y: r.top + r.height/2, w: r.width, h: r.height, top: r.top };
}, [sel, i]);

const SHOWS = {
  async tenur(page) {
    await page.waitForTimeout(3000);
    await scrollTo(page, await yOf(page, '#menu') - 40, 1700);
    await page.waitForTimeout(500);
    for (const i of [0, 1, 2]) {
      const b = await boxOf(page, '.dish', i);
      if (!b) continue;
      await glide(page, 300, b.top + b.h/2, 560);
      await page.waitForTimeout(700);
    }
    await scrollTo(page, await yOf(page, '#gallery') - 30, 1500);
    await page.waitForTimeout(1000);
  },
  async zana(page) {
    await page.waitForTimeout(2600);
    await scrollTo(page, await yOf(page, '#results') - 30, 1700);
    await page.waitForTimeout(1200);
    const c = await boxOf(page, '#compare');
    if (c) {
      await glide(page, c.x, c.y, 600);
      await page.evaluate(() => { window.__press(true); window.__tap(); });
      await page.mouse.down();
      for (const [tx, ms] of [[c.x - c.w*0.33, 850], [c.x + c.w*0.35, 1150], [c.x, 700]])
        await glide(page, tx, c.y, ms);
      await page.mouse.up();
      await page.evaluate(() => window.__press(false));
      await page.waitForTimeout(700);
    }
    await scrollTo(page, await yOf(page, '#care') - 30, 1500);
    await page.waitForTimeout(900);
  },
  async zeri(page) {
    await page.waitForTimeout(2800);
    await scrollTo(page, await yOf(page, '#shop') - 30, 1800);
    await page.waitForTimeout(700);
    for (const i of [0, 1]) {
      const b = await boxOf(page, '.prod', i);
      if (!b) continue;
      await glide(page, b.x, b.top + b.h*0.3, 560);
      await page.waitForTimeout(420);
      const add = await boxOf(page, '.prod__add', i);
      if (add) { await glide(page, add.x, add.y, 340); await click(page); }
      await page.waitForTimeout(420);
    }
    await scrollTo(page, 0, 800);
    await page.waitForTimeout(250);
    const cart = await boxOf(page, '#cartbtn');
    if (cart) { await glide(page, cart.x, cart.y, 600); await click(page); }
    await page.waitForTimeout(2000);
  },
  async zagros(page) {
    await page.waitForTimeout(2600);
    await scrollTo(page, await yOf(page, '#featured') - 30, 1800);
    await page.waitForTimeout(700);
    for (const i of [1, 2, 3, 0]) {
      const b = await boxOf(page, '#swatch button', i);
      if (!b) continue;
      await glide(page, b.x, b.y, 470);
      await click(page);
      await page.waitForTimeout(620);
    }
    await scrollTo(page, await yOf(page, '#stock') - 30, 1500);
    await page.waitForTimeout(600);
    const f = await boxOf(page, '#filters button', 3);
    if (f) { await glide(page, f.x, f.y, 520); await click(page); }
    await page.waitForTimeout(1300);
  },
  async hez(page) {
    await page.waitForTimeout(3400);
    await scrollTo(page, await yOf(page, '#schedule') - 30, 1700);
    await page.waitForTimeout(700);
    for (const i of [2, 4, 1]) {
      const b = await boxOf(page, '#days button', i);
      if (!b) continue;
      await glide(page, b.x, b.y, 470);
      await click(page);
      await page.waitForTimeout(680);
    }
    await scrollTo(page, await yOf(page, '#floor') - 30, 1600);
    await page.waitForTimeout(1100);
  }
};

(async () => {
  const sites = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SHOWS);
  fs.mkdirSync(OUT, { recursive: true });

  for (const site of sites) {
    const dir = path.join(OUT, site);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });

    const browser = await chromium.launch({
      args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars',
             '--force-color-profile=srgb', '--disable-lcd-text']
    });
    const ctx = await browser.newContext({
      viewport: { width: W, height: H },
      deviceScaleFactor: 1,
      hasTouch: false,                       // keep hover-only interactions alive
      recordVideo: { dir, size: { width: W, height: H } }
    });
    await ctx.addInitScript(CURSOR);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/work/${site}/`, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(1600);
    await page.evaluate(() => document.querySelectorAll('video').forEach(v => v.play().catch(() => {})));

    await SHOWS[site](page);

    await ctx.close();
    await browser.close();

    const f = fs.readdirSync(dir).find(n => n.endsWith('.webm'));
    fs.renameSync(path.join(dir, f), path.join(OUT, `${site}.webm`));
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`${site}.webm ${Math.round(fs.statSync(path.join(OUT, `${site}.webm`)).size/1024)} KB`);
  }
  console.log('done');
})();
