import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE || import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('dialog', dialog => dialog.accept());
const read = (store, key) => page.evaluate(async ({store, key}) => {
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open('quoter-local-data', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return new Promise((resolve, reject) => {
    const request = key ? db.transaction(store).objectStore(store).get(key) : db.transaction(store).objectStore(store).getAll();
    request.onsuccess = () => { db.close(); resolve(request.result); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}, {store, key});
const waitFor = async (test) => {
  for (let i = 0; i < 50; i++) { if (await test()) return; await page.waitForTimeout(100); }
  throw new Error('Condition timed out');
};
try {
  await page.goto(process.env.QUOTER_URL || 'http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.locator('input[name="cabinImage"]').waitFor();
  await page.locator('input[name="cabinImage"]').setInputFiles({ name: 'Test cabin.png', mimeType: 'image/png', buffer: await readFile(new URL('../public/xinfuji-banner-quote.png', import.meta.url)) });
  await waitFor(async () => (await read('uploads')).length === 1);
  const [uploaded] = await read('uploads');
  assert.equal(uploaded.category, 'cabin');
  await waitFor(async () => JSON.parse(await read('records', 'quote-storage') || '{}').state?.elevators[0].cabinEffect.cabinImage === uploaded.previewImage);
  await page.getByRole('button', { name: '保存到报价库', exact: true }).click();
  await waitFor(async () => JSON.parse(await read('records', 'quoter_history') || '[]').length === 1);
  assert.equal(JSON.parse(await read('records', 'quoter_history'))[0].state.elevators[0].cabinEffect.cabinImage, uploaded.previewImage);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('input[name="cabinImage"]').waitFor();
  await page.getByRole('button', { name: 'Choose from Library', exact: true }).first().click();
  await page.getByRole('button', { name: 'Test cabin', exact: true }).waitFor();
  await page.getByText('我的上传 · 本机').scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(process.env.QUOTER_SCREENSHOT_DIR || tmpdir(), 'quoter-uploads-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByText('我的上传 · 本机').scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(process.env.QUOTER_SCREENSHOT_DIR || tmpdir(), 'quoter-uploads-mobile.png') });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await page.getByRole('button', { name: '移除 Test cabin', exact: true }).click();
  await waitFor(async () => (await read('uploads')).length === 0);
  assert.equal(JSON.parse(await read('records', 'quoter_history'))[0].state.elevators[0].cabinEffect.cabinImage, uploaded.previewImage);
  await page.getByRole('button', { name: '关闭', exact: true }).click();
  await page.getByRole('button', { name: '新建报价', exact: true }).click();
  await page.getByRole('button', { name: '载入', exact: true }).click();
  await waitFor(async () => JSON.parse(await read('records', 'quote-storage')).state.elevators[0].cabinEffect.cabinImage === uploaded.previewImage);
  assert.equal(await page.locator('img[alt="Cabin"]').evaluate(img => img.complete && img.naturalWidth > 0), true);
  const legacyDraft = await read('records', 'quote-storage');
  const legacyHistory = await read('records', 'quoter_history');
  const migrated = await browser.newContext();
  await migrated.addInitScript(({draft, history}) => {
    localStorage.setItem('quote-storage', draft);
    localStorage.setItem('quoter_history', history);
  }, { draft: legacyDraft, history: legacyHistory });
  const migratedPage = await migrated.newPage();
  await migratedPage.goto(process.env.QUOTER_URL || 'http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await migratedPage.locator('input[name="cabinImage"]').waitFor();
  await migratedPage.getByRole('button', { name: '载入', exact: true }).waitFor();
  assert.equal(await migratedPage.locator('img[alt="Cabin"]').getAttribute('src'), uploaded.previewImage);
  await migrated.close();
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => { Object.defineProperty(window, 'indexedDB', { get() { throw new Error('Storage denied'); } }); });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(process.env.QUOTER_URL || 'http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await blockedPage.getByText('无法读取本机报价', { exact: false }).waitFor();
  await blocked.close();
  assert.deepEqual(errors, []);
  console.log('PASS: upload, category, draft persistence, history image snapshot, reload, library removal, historical restore, legacy migration, denied storage, mobile width; no runtime errors.');
} finally { await browser.close(); }
