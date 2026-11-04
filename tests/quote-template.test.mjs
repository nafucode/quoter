import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elevatorCategories, createQuoteFromTemplate } from '../src/utils/quoteTemplate.ts';

test('categories use saved descriptions including mixed lifts and legacy records', () => {
  const descriptions = ['Home Lift','Passenger Lift','Freight/Cargo Lift','Dumbwaiter Lift','Platform Lift','Service Lift','Home Lift'];
  assert.deepEqual(elevatorCategories({state:{elevators:descriptions.map(description=>({description}))}}), ['家用','乘客','货梯','餐梯','平台梯','服务梯']);
  assert.deepEqual(elevatorCategories({elevatorTypes:['TKJW450/1.0-VVVF']}), ['未记录']);
  assert.deepEqual(elevatorCategories({elevatorCategories:['家用']}), ['家用']);
});

test('template clears customer identity and uses a new date and unused number', () => {
  const source = {companyName:'Customer',projectName:'Old project',ruc:'Tax ID',quotationNo:'XFJ26110403',quotationDate:'2026-10-01',
    elevators:[{description:'Home Lift',capacity:'450',cabinEffect:{cabinImage:'data:image/png;base64,abc'},price:12000}],
    partList:[{brand:'Custom'}],exchangeRateBasis:6.65,quoteRemarks:'Terms',country:'Russia'};
  const before = structuredClone(source);
  const copy = createQuoteFromTemplate(source,['XFJ26110401','XFJ26110408'],new Date(2026,10,4));
  assert.equal(copy.quotationNo,'XFJ26110409');
  assert.equal(copy.quotationDate,'2026-11-04');
  for (const field of ['companyName','projectName','ruc']) assert.equal(copy[field],'');
  assert.deepEqual(copy.elevators,source.elevators);
  assert.equal(copy.exchangeRateBasis,6.65);
  copy.elevators[0].cabinEffect.cabinImage = 'changed';
  copy.partList[0].brand = 'New';
  assert.deepEqual(source,before);
});
test('incomplete historical records cannot silently produce a default quote', () => {
  assert.throws(()=>createQuoteFromTemplate({},[]),/缺少电梯参数/);
});
