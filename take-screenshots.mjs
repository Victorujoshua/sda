import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

// Homepage
const homePage = await context.newPage();
await homePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await homePage.screenshot({ path: 'screenshot-homepage-after.png', fullPage: true });
console.log('Homepage screenshot saved');

// FAQ
const faqPage = await context.newPage();
await faqPage.goto('http://localhost:3000/faq', { waitUntil: 'networkidle' });
await faqPage.screenshot({ path: 'screenshot-faq-after.png', fullPage: true });
console.log('FAQ screenshot saved');

await browser.close();
console.log('Done');
