import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE || import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto(process.env.QUOTER_URL || 'http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 90000 });
  const checkbox = page.getByLabel('防火层门', { exact: true });
  await checkbox.scrollIntoViewIfNeeded();
  await checkbox.check();
  const select = page.getByLabel('防火等级', { exact: true });
  assert.deepEqual(await select.locator('option').allTextContents(), ['E30', 'E60', 'E120', 'EI30', 'EI60', '自定义...']);
  await select.selectOption('EI60');
  assert.equal(await select.inputValue(), 'EI60');
  await select.selectOption('__custom__');
  const custom = page.getByLabel('自定义防火等级', { exact: true });
  await custom.fill('EW90');
  assert.equal(await custom.inputValue(), 'EW90');
  await select.selectOption('E120');
  assert.equal(await custom.count(), 0);
  assert.equal(await select.inputValue(), 'E120');
  assert.deepEqual(errors, []);
  console.log('PASS fire rating presets and custom value');
} finally { await browser.close(); }
