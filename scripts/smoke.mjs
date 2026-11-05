import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

// Test the actual production bundle, without spending API credit or fetching external assets.
const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;
let browser;
const errors = [];
try {
    browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: process.env.PUPPETEER_NO_SANDBOX === 'true' ? ['--no-sandbox'] : []
    });
    const page = await browser.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
        if (response.url().startsWith(origin) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.url().startsWith(origin) || request.url().startsWith('data:')) request.continue();
        else request.abort();
    });
    await page.setViewport({ width: 1440, height: 900 });
    for (const name of ['index', 'tarot', 'wheel', 'daily', 'quick', 'history']) {
        const response = await page.goto(`${origin}/${name}.html`, { waitUntil: 'networkidle0' });
        assert.equal(response.status(), 200, `${name} page loads`);
        assert.ok(await page.title(), `${name} has a title`);
        console.log(`PASS production page: ${name}`);
    }

    await page.goto(`${origin}/index.html`, { waitUntil: 'networkidle0' });
    await page.click('#configToggle');
    await page.type('#cfgApiKey', 'fake-smoke-key');
    await page.click('#configSave');
    let storage = await page.evaluate(() => ({ local: JSON.parse(localStorage.getItem('moon_oracle_config')), session: sessionStorage.getItem('moon_oracle_api_key') }));
    assert.equal(storage.local.apiKey, undefined);
    assert.equal(storage.session, 'fake-smoke-key');
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('#cfgApiKey', input => input.value), 'fake-smoke-key');
    await page.click('#configToggle');
    await page.click('#cfgRememberApiKey');
    await page.click('#configSave');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('moon_oracle_config')).apiKey), 'fake-smoke-key');
    await page.click('#configToggle');
    await page.click('#configClearKey');
    assert.equal(await page.$eval('#cfgApiKey', input => input.value), '');
    assert.equal(await page.evaluate(() => sessionStorage.getItem('moon_oracle_api_key')), null);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('moon_oracle_config')).apiKey), undefined);
    await page.keyboard.press('Escape');
    assert.equal(await page.$eval('#configPanel', el => el.classList.contains('active')), false);
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.click('#configToggle');
    assert.ok(await page.$eval('#cfgRememberApiKey', el => el.getBoundingClientRect().width < 40));
    if (process.env.SMOKE_SCREENSHOT_DIR) {
        await mkdir(process.env.SMOKE_SCREENSHOT_DIR, { recursive: true });
        await page.screenshot({ path: `${process.env.SMOKE_SCREENSHOT_DIR}/settings-mobile.png`, fullPage: true });
    }
    await page.keyboard.press('Escape');
    console.log('PASS session key, explicit remember, clear, reload, Escape and mobile settings');

    await page.goto(`${origin}/wheel.html`, { waitUntil: 'networkidle0' });
    await page.click('[data-preset="lunch"]');
    assert.ok(await page.$eval('#wheelCanvas', canvas => canvas.width >= 80 && canvas.width <= 400));
    await page.click('#spinBtn');
    assert.equal(await page.$eval('#spinBtn', button => button.disabled), true);
    // Check rendered visibility: clearing inline display can still leave CSS display:none.
    await page.waitForSelector('#resultArea', { visible: true, timeout: 10000 });
    assert.equal(await page.$eval('#resultArea', element => getComputedStyle(element).display), 'block');
    assert.notEqual(await page.$eval('#resultOption', element => element.textContent), '选项');
    await page.click('#newWheelBtn');
    await page.type('#customInput', 'A:1\nB:3');
    await page.click('#customStartBtn');
    assert.equal(await page.$eval('#viewWheel', element => element.classList.contains('active')), true);
    if (process.env.SMOKE_SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SMOKE_SCREENSHOT_DIR}/wheel-mobile.png`, fullPage: true });
    console.log('PASS preset spin, repeat/new-wheel navigation and custom weighted wheel');

    await page.goto(`${origin}/daily.html`, { waitUntil: 'networkidle0' });
    await page.click('#drawCardBtn');
    await page.waitForFunction(() => document.querySelector('#drawCardBtn').classList.contains('hidden'));
    const card = await page.$eval('#cardName', element => element.textContent);
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('#cardName', element => element.textContent), card);
    assert.equal(await page.$eval('#drawCardBtn', element => element.classList.contains('hidden')), true);
    console.log('PASS daily draw and stable reload');

    await page.goto(`${origin}/quick.html`, { waitUntil: 'networkidle0' });
    await page.type('#questionInput', '<img src=x onerror=alert(1)> Should I try?');
    await page.click('#answerBtn');
    await page.waitForSelector('.answer-card');
    await page.click('#oracleBtn');
    await page.waitForSelector('.oracle-card');
    await page.goto(`${origin}/history.html`, { waitUntil: 'networkidle0' });
    assert.ok(await page.$$eval('.record-card', cards => cards.length >= 3));
    await page.click('.record-card');
    assert.equal(await page.$eval('#detailModal', element => element.classList.contains('active')), true);
    assert.equal(await page.$$eval('#detailContent img[src="x"]', elements => elements.length), 0);
    await page.click('#closeDetailBtn');
    assert.equal(await page.$eval('#detailModal', element => element.classList.contains('active')), false);
    await page.goBack({ waitUntil: 'networkidle0' });
    assert.ok(page.url().endsWith('/quick.html'));
    await page.goForward({ waitUntil: 'networkidle0' });
    assert.ok(page.url().endsWith('/history.html'));
    console.log('PASS both quick modes, stored history, escaped question, modal close and Back/Forward');
    assert.deepEqual(errors, [], 'no uncaught browser errors or missing local assets');
    console.log('All production smoke checks passed. External AI/OCR/fonts/images are not validated.');
} finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
}

