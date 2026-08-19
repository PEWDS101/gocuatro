/* Render the cinematic reel as a deterministic JPEG sequence.

   The site footage is fed in as still frames (<img>), so the whole composite —
   3D camera, blur, glitch, kinetic type — is plain DOM that page.screenshot()
   captures reliably. Nothing depends on wall-clock timing.

   node render2.js [site ...]
*/
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = process.env.FBASE || 'http://127.0.0.1:8901';
const FPS = 25;
const OUT = path.join(__dirname, 'frames');
const SF = path.join(__dirname, 'sf');

(async () => {
  const sites = process.argv.slice(2).length ? process.argv.slice(2)
              : ['tenur', 'zana', 'zeri', 'zagros', 'hez'];

  const browser = await chromium.launch({
    channel: 'chrome',
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--disable-lcd-text',
           '--font-render-hinting=none']
  });
  const meta = {};

  for (const site of sites) {
    const nf = fs.readdirSync(path.join(SF, site)).filter(n => n.endsWith('.jpg')).length;
    const dir = path.join(OUT, site);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });

    const ctx = await browser.newContext({
      viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/work/_src/video/reel.html?site=${site}&nf=${nf}`,
                    { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    const dur = await page.evaluate(() => window.__dur());
    const total = Math.round(dur * FPS);
    meta[site] = { dur, frames: total, nf };
    const t0 = Date.now();

    for (let i = 0; i < total; i++) {
      await page.evaluate(x => window.__setTime(x), i / FPS);
      // the site frame is swapped by src — wait for it to actually be decoded
      await page.evaluate(() => {
        const im = document.getElementById('shot');
        return im.complete ? null : im.decode().catch(() => {});
      });
      await page.screenshot({
        path: path.join(dir, String(i).padStart(5, '0') + '.jpg'),
        type: 'jpeg', quality: 95
      });
    }
    await ctx.close();
    console.log(`${site}: ${total} frames from ${nf} source (${Math.round((Date.now()-t0)/1000)}s)`);
  }

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log('frames done');
})();
