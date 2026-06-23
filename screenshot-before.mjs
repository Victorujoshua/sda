import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });

async function shot(url, scroll, file) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await new Promise(r => setTimeout(r, 800));
  if (scroll) {
    await page.evaluate((s) => { for (const el of document.querySelectorAll('section')) { if ((el.textContent||'').includes(s)) { el.scrollIntoView(); break; } } }, scroll);
    await new Promise(r => setTimeout(r, 300));
  }
  await page.screenshot({ path: file, fullPage: false });
  await page.close();
}

await shot('http://localhost:3000', null, 'before-home.png');
await shot('http://localhost:3000/faq', null, 'before-faq.png');

await browser.close();
console.log('Done.');
