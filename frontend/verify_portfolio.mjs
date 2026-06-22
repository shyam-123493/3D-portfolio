import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));

await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForTimeout(1000);
await page.screenshot({ path: 's1_boot.png' });
const title = await page.title();
console.log('Title:', title);

const hasMono = await page.$('.font-mono');
console.log('Boot terminal present:', hasMono !== null);

// Wait for boot to complete
await page.waitForTimeout(5000);
await page.screenshot({ path: 's2_hero.png' });

const h1 = await page.$('h1');
console.log('H1:', h1 ? await h1.innerText() : 'NOT FOUND');

for (const id of ['hero','journey','projects','engineering','ai-lab','achievements','contact']) {
  const el = await page.$('#' + id);
  console.log('#' + id + ':', el ? 'OK' : 'MISSING');
}

const recruiterBtn = page.locator('button', { hasText: 'Recruiter View' }).first();
if (await recruiterBtn.count()) {
  await recruiterBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 's3_recruiter.png' });
  console.log('Recruiter view: opened');
}

await page.keyboard.press('Escape');
await page.evaluate(() => window.scrollTo({ top: 3000 }));
await page.waitForTimeout(800);
await page.screenshot({ path: 's4_projects.png' });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);
await page.screenshot({ path: 's5_mobile.png' });
console.log('Mobile: screenshot taken');

console.log('\nErrors:', errors.length === 0 ? 'NONE' : errors.slice(0,5).join('\n'));
await browser.close();
