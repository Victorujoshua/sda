const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const section = page.locator('section').filter({ hasText: 'FOR INVESTORS' }).first();
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await section.screenshot({ path: "C:\\Users\\HomePC\\Documents\\SDA\\docs\\ss_playwright_fi.png" });
  console.log("Done");
  await browser.close();
})();
