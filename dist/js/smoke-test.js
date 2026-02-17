const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const fileUrl = 'file://' + path.resolve(__dirname, 'index.html');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto(fileUrl);

    // initial checks
    const overflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
    if (!overflow || !overflow.includes('hidden')) {
      console.error('FAIL: body overflow not locked (expected hidden) ->', overflow);
      await browser.close();
      process.exit(1);
    }

    const heroClientH = await page.evaluate(() => document.querySelector('section').clientHeight);
    const innerH = await page.evaluate(() => window.innerHeight);
    if (Math.abs(heroClientH - innerH) > 2) {
      console.error('FAIL: hero not exact 100vh (hero:', heroClientH, 'inner:', innerH, ')');
      await browser.close();
      process.exit(1);
    }

    // simulate first scroll
    await page.mouse.wheel(0, 120);
    // wait for transition time (allow margin)
    await page.waitForTimeout(900);

    const contentOpacity = await page.evaluate(() => parseFloat(getComputedStyle(document.getElementById('content-overlay')).opacity));
    if (contentOpacity < 0.9) {
      console.error('FAIL: content-overlay did not reveal (opacity=', contentOpacity, ')');
      await browser.close();
      process.exit(1);
    }

    console.log('SMOKE OK');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('ERROR', err);
    await browser.close();
    process.exit(2);
  }
})();
