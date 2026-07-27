import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const PORT = process.env.VITE_PORT || '5173';
const BASE_URL = `http://localhost:${PORT}`;
const OUT_DIR = '/workspace/screenshots';

const PAGES = [
  { name: 'index',   file: 'index.html',   out: 'desktop-index.png',   mobile: true  },
  { name: 'tarot',   file: 'tarot.html',   out: 'desktop-tarot.png',   mobile: false },
  { name: 'wheel',   file: 'wheel.html',   out: 'desktop-wheel.png',   mobile: false },
  { name: 'daily',   file: 'daily.html',   out: 'desktop-daily.png',   mobile: false },
  { name: 'quick',   file: 'quick.html',   out: 'desktop-quick.png',   mobile: false },
  { name: 'history', file: 'history.html', out: 'desktop-history.png', mobile: false },
];

const DESKTOP_VIEWPORT = { width: 1440, height: 900, deviceScaleFactor: 1 };
const MOBILE_VIEWPORT  = { width: 390,  height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true };

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function screenshotPage(browser, page, file, outName, viewport) {
  const url = `${BASE_URL}/${file}`;
  console.log(`\n→ ${outName}  (${viewport.width}x${viewport.height})  ${url}`);
  try {
    await page.setViewport(viewport);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    // Wait for fonts to be fully ready
    try {
      await page.evaluate(async () => {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      });
    } catch (e) {
      console.warn(`  ! document.fonts.ready wait failed: ${e.message}`);
    }
    // Wait extra 1.5s for starry sky / animation initialization
    await new Promise(r => setTimeout(r, 1500));

    const outPath = path.join(OUT_DIR, outName);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`  ✓ saved ${outPath}`);
    return { ok: true, outPath };
  } catch (err) {
    console.error(`  ✗ FAILED ${outName}: ${err.message}`);
    return { ok: false, error: err.message };
  }
}

async function main() {
  await ensureDir(OUT_DIR);

  console.log(`Launching headless browser (puppeteer)...`);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = [];

  try {
    const page = await browser.newPage();

    for (const p of PAGES) {
      // Desktop screenshot
      const r1 = await screenshotPage(browser, page, p.file, p.out, DESKTOP_VIEWPORT);
      results.push({ name: p.out, ...r1 });

      // Mobile screenshot (only for index)
      if (p.mobile) {
        const r2 = await screenshotPage(browser, page, p.file, 'mobile-index.png', MOBILE_VIEWPORT);
        results.push({ name: 'mobile-index.png', ...r2 });
      }
    }
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n========== Summary ==========');
  for (const r of results) {
    if (r.ok) {
      console.log(`  ✓ ${r.name} -> ${r.outPath}`);
    } else {
      console.log(`  ✗ ${r.name}: ${r.error}`);
    }
  }
  const failed = results.filter(r => !r.ok);
  if (failed.length > 0) {
    console.log(`\n${failed.length} page(s) failed.`);
    process.exitCode = 1;
  } else {
    console.log('\nAll screenshots generated.');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
