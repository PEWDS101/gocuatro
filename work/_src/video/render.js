/* Render the branded overlay as a deterministic JPEG sequence.

   The site recording is NOT played in-page — Chrome will not reliably present a
   paused/seeked video frame for capture here (the slot rasterises white). The
   overlay is pure DOM, so every frame is exact; ffmpeg composites the real
   recording into the slot afterwards.

   node render.js [site ...]
*/
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BASE = process.env.FBASE || 'http://127.0.0.1:8901';
const FPS = 25;
const TAIL = 1.6;                        // hold on the end card
const RAW = path.join(__dirname, 'raw');
const OUT = path.join(__dirname, 'frames');

const durationOf = f => parseFloat(execFileSync('ffprobe',
  ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());

(async () => {
  const sites = process.argv.slice(2).length ? process.argv.slice(2)
              : ['tenur', 'zana', 'zeri', 'zagros', 'hez'];

  const browser = await chromium.launch({
    channel: 'chrome',
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--disable-lcd-text']
  });
  const meta = {};

  for (const site of sites) {
    const dur = durationOf(path.join(RAW, `${site}.mp4`));
    const dir = path.join(OUT, site);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });

    const ctx = await browser.newContext({
      viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/work/_src/video/frame.html?site=${site}&dur=${dur}`,
                    { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    const slot = await page.evaluate(() => window.__slot());
    meta[site] = { dur, slot, frames: Math.round((dur + TAIL) * FPS) };

    const total = meta[site].frames;
    const t0 = Date.now();
    for (let i = 0; i < total; i++) {
      await page.evaluate(x => window.__setTime(x), i / FPS);
      await page.screenshot({
        path: path.join(dir, String(i).padStart(5, '0') + '.jpg'),
        type: 'jpeg', quality: 95
      });
    }
    await ctx.close();
    console.log(`${site}: ${total} frames, slot ${slot.w}x${slot.h} @${slot.x},${slot.y}  (${Math.round((Date.now()-t0)/1000)}s)`);
  }

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log('frames done');
})();
