import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePrice, defaultPriceOptions, priceOptionsFromConfiguration, priceScheduleForCountry } from '../src/utils/priceCalculator.ts';

test('Vietnam country selects its schedule and other countries retain overseas prices', () => {
  for (const country of ['Vietnam', ' Viet Nam ', '越南', 'VN', 'Việt Nam']) {
    assert.equal(priceScheduleForCountry(country).id, 'vietnam-2026-05');
  }
  for (const country of ['', 'Thailand', 'Cambodia']) {
    assert.equal(priceScheduleForCountry(country).id, 'overseas-2026-04');
  }
});
test('Vietnam passenger bases match all five capacity bands', () => {
  for (const [capacity, base] of [[630,55000],[800,56000],[1000,57000],[1150,66000],[1350,66000],[1600,72000]]) {
    for (const speed of [1,1.5,1.75]) {
      const result = calculatePrice({capacity,speed,stops:10,mrl:false,country:'Vietnam'}, {...defaultPriceOptions,ard:false,stainless:false}, 'passenger');
      assert.equal(result.total,base);
      assert.deepEqual(result.errors,[]);
    }
  }
});
test('Vietnam floor adjustments, MRL and optional extras remain additive', () => {
  const config = {capacity:630,speed:1,stops:8,mrl:true,country:'Vietnam'};
  assert.equal(calculatePrice(config,defaultPriceOptions,'passenger').total,59000);
  assert.equal(calculatePrice({...config,stops:11},defaultPriceOptions,'passenger').total,66500);
  assert.equal(calculatePrice(config,{...defaultPriceOptions,ic:'standard'},'passenger').total,60000);
  assert.equal(calculatePrice({...config,country:'Thailand'},defaultPriceOptions,'passenger').total,65000);
});
test('Vietnam villa comparison uses local base; higher speeds retain original tariffs and safeguards', () => {
  assert.equal(calculatePrice({capacity:450,speed:0.4,stops:3,mrl:true,country:'Vietnam'},defaultPriceOptions,'home').total,44000);
  assert.equal(calculatePrice({capacity:630,speed:1,stops:6,mrl:true,country:'Vietnam'},defaultPriceOptions,'home').total,54000);
  for (const speed of [2,2.5,3]) {
    const config={capacity:1000,speed,stops:12,mrl:true};
    assert.deepEqual(calculatePrice({...config,country:'Vietnam'},defaultPriceOptions,'passenger'),calculatePrice(config,defaultPriceOptions,'passenger'));
  }
});

test('reads checked quote configuration without charging unchecked options', () => {
  const options = priceOptionsFromConfiguration({ otherFloorsDoor: 'Hairline Stainless Steel 304 1.2mm', otherFunctions: [
    { name: 'Automatic rescue device (ARD)', checked: true },
    { name: 'IC Card Access (30 IC Cards)', checked: true },
    { name: '4G IoT Elevator Monitoring System', checked: true },
    { name: 'CCTV Interface Only', checked: true },
    { name: 'Firefighter Elevator Function Package', checked: true },
    { name: 'Cabin Air Conditioner', checked: false },
  ] });
  assert.equal(options.ard, true);
  assert.equal(options.stainless, true);
  assert.equal(options.ic, 'standard');
  assert.equal(options.extraCards, 0);
  assert.equal(options.iot, true);
  assert.equal(options.cctv, 'interface');
  assert.equal(options.firefighterPackage, true);
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
test('firefighter package adds fixed items and requires a cable quote', () => {
  const unpriced = calculatePrice(input, { ...defaultPriceOptions, firefighterPackage: true }, 'passenger');
  assert.match(unpriced.errors.join(' '), /防火供电电缆/);
  const priced = calculatePrice(input, { ...defaultPriceOptions, firefighterPackage: true, fireCablePrice: '3200' }, 'passenger');
  assert.equal(priced.standard, 72300);
  assert.deepEqual(priced.errors, []);
});
