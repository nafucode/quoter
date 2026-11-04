import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE || import.meta.url);
const {chromium} = require('playwright');
const browser = await chromium.launch({headless:true,channel:'chrome'});
const page = await browser.newPage({viewport:{width:1600,height:1000}});
let accept = false;
page.on('dialog', d=>accept ? d.accept() : d.dismiss());
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const read = key => page.evaluate(async key=>{
  const db = await new Promise((resolve,reject)=>{const r=indexedDB.open('quoter-local-data',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  return new Promise((resolve,reject)=>{const r=db.transaction('records').objectStore('records').get(key);r.onsuccess=()=>{db.close();resolve(JSON.parse(r.result||'null'));};r.onerror=()=>reject(r.error);});
},key);
const company=()=>page.locator('label[title="Company Name"]').locator('..').locator('input');
const project=()=>page.locator('label[title="Project Name"]').locator('..').locator('input');
try {
  await page.goto(process.env.QUOTER_URL || 'http://localhost:3000',{waitUntil:'domcontentloaded',timeout:90000});
  await company().fill('Original Customer');
  await project().fill('Original Project');
  await page.getByLabel('Description preset',{exact:true}).selectOption('Home Lift');
  await page.getByRole('button',{name:'保存到报价库',exact:true}).click();
  const template=page.getByRole('button',{name:'用作模板',exact:true}).first();
  await template.waitFor();
  await page.locator('#quote-history').scrollIntoViewIfNeeded();
  assert.match(await page.locator('#quote-history').innerText(),/梯种\s*家用/);
  const [source]=await read('quoter_history');
  await page.screenshot({path:join(tmpdir(),'quoter-template-library.png')});
  await template.click();
  assert.equal(await company().inputValue(),'Original Customer');
  await company().fill('Unsaved Customer');
  accept=true;
  await template.click();
  await page.waitForFunction(()=>document.querySelector('label[title="Company Name"]').parentElement.querySelector('input').value==='');
  assert.equal(await project().inputValue(),'');
  await page.getByRole('button',{name:'保存到报价库',exact:true}).click();
  let records;
  for (let i=0;i<50;i++) {
    records=await read('quoter_history');
    if (records.some(r=>r.companyName==='' && r.projectName==='')) break;
    await page.waitForTimeout(100);
  }
  const savedSource=records.find(r=>r.id===source.id);
  assert.deepEqual(savedSource,source);
  assert.ok(records.some(r=>r.companyName==='Unsaved Customer'));
  const newQuote=records.find(r=>r.companyName==='' && r.projectName==='');
  assert.ok(newQuote);
  assert.notEqual(newQuote.quotationNo,source.quotationNo);
  for (const [i,elevator] of source.state.elevators.entries()) {
    for (const [key,value] of Object.entries(elevator)) assert.deepEqual(newQuote.state.elevators[i][key],value);
  }
  await page.reload();
  await company().waitFor();
  assert.equal(await company().inputValue(),'');
  await page.setViewportSize({width:390,height:844});
  await page.locator('#quote-history').scrollIntoViewIfNeeded();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:join(tmpdir(),'quoter-template-mobile.png')});
  assert.deepEqual(errors,[]);
  console.log('PASS category, cancel, template clone, customer reset, unique number, original preservation, current draft backup, save/reload and mobile width');
} finally {await browser.close();}
