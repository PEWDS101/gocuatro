/* Record the branded 1080x1920 frame while the captured site plays inside it. */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = process.env.FBASE || 'http://127.0.0.1:8901';
const OUT = path.join(__dirname, 'framed');

(async () => {
  const sites = process.argv.slice(2).length ? process.argv.slice(2)
              : ['tenur', 'zana', 'zeri', 'zagros', 'hez'];
  fs.mkdirSync(OUT, { recursive: true });

  for (const site of sites) {
    const dir = path.join(OUT, site);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });

    // real Chrome, not bundled Chromium: the bundled build has no H.264 decoder,
    // so an embedded mp4 "plays" but paints nothing but white
    const browser = await chromium.launch({
      channel: 'chrome',
      args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars',
             '--force-color-profile=srgb']
    });
    const ctx = await browser.newContext({
      viewport: { width: 1080, height: 1920 },
      deviceScaleFactor: 1,
      recordVideo: { dir, size: { width: 1080, height: 1920 } }
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/work/_src/video/frame.html?site=${site}`,
                    { waitUntil: 'networkidle', timeout: 60000 });

    await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
    await page.waitForTimeout(400);                 // let fonts settle
    await page.evaluate(() => window.__play());

    // wait on the actual 'ended' event, not the reported duration
    await page.waitForFunction(() => window.__done === true, null, { timeout: 120000 });
    await page.waitForTimeout(900);                 // a beat on the end card

    await ctx.close();
    await browser.close();

    const f = fs.readdirSync(dir).find(n => n.endsWith('.webm'));
    fs.renameSync(path.join(dir, f), path.join(OUT, `${site}.webm`));
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`${site}: ${Math.round(fs.statSync(path.join(OUT, `${site}.webm`)).size / 1024)} KB`);
  }
  console.log('framed');
})();
