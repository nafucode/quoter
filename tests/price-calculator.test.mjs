import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePrice, defaultPriceOptions, priceOptionsFromConfiguration } from '../src/utils/priceCalculator.ts';

test('reads checked quote configuration without charging unchecked options', () => {
  const options = priceOptionsFromConfiguration({ otherFloorsDoor: 'Hairline Stainless Steel 304 1.2mm', otherFunctions: [
    { name: 'Automatic rescue device (ARD)', checked: true },
    { name: 'IC Card Access (30 IC Cards)', checked: true },
    { name: '4G IoT Elevator Monitoring System', checked: true },
    { name: 'CCTV Interface Only', checked: true },
    { name: 'Cabin Air Conditioner', checked: false },
  ] });
  assert.equal(options.ard, true);
  assert.equal(options.stainless, true);
  assert.equal(options.ic, 'standard');
  assert.equal(options.extraCards, 0);
  assert.equal(options.iot, true);
  assert.equal(options.cctv, 'interface');
  assert.equal(options.ac, 'none');
  assert.equal(priceOptionsFromConfiguration({otherFunctions: []}).ic, 'none');
});

const input = { capacity: 630, speed: 1, stops: 8, mrl: true };
test('8 stop passenger example is CNY 65000', () => {
  const result = calculatePrice(input, defaultPriceOptions, 'passenger');
  assert.equal(result.total, 65000);
  assert.deepEqual(result.errors, []);
});
test('450kg 3 stop villa includes ARD and doors', () => {
  assert.equal(calculatePrice({ ...input, capacity: 450, speed: 0.4, stops: 3 }, defaultPriceOptions, 'home').total, 50000);
});
test('630kg 6 stop comparison and villa eligibility', () => {
  assert.equal(calculatePrice({ ...input, stops: 6 }, defaultPriceOptions, 'home').total, 60000);
  assert.equal(calculatePrice({ ...input, stops: 6 }, defaultPriceOptions, 'passenger').total, 60000);
  assert.ok(calculatePrice(input, defaultPriceOptions, 'home').errors.length);
});
test('options and discount calculation', () => {
  const result = calculatePrice(input, { ...defaultPriceOptions, ic: 'floor', extraCards: 10, ac: 'cool', iot: true, adjustmentMode: 'percent', adjustment: -10 }, 'passenger');
  assert.equal(result.standard, 71030);
  assert.equal(result.total, 63927);
});
test('unpriced configuration cannot apply', () => {
  assert.ok(calculatePrice(input, { ...defaultPriceOptions, cctv: 'camera' }, 'passenger').errors.length);
  assert.ok(calculatePrice({ ...input, speed: 3 }, defaultPriceOptions, 'passenger').errors.length);
  assert.ok(calculatePrice({ ...input, stops: 0 }, defaultPriceOptions, 'passenger').errors.length);
  assert.ok(calculatePrice(input, { ...defaultPriceOptions, adjustment: -100000 }, 'passenger').errors.length);
});
