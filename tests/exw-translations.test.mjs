import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getTranslations } from '../src/data/translations.ts';

test('EXW output uses the selected language, with Chinese only when requested', () => {
  assert.equal(getTranslations('en').exwPickup, 'Pickup from factory arranged by the customer.');
  assert.equal(getTranslations('zh').exwPickup, '客户安排工厂自提。');
  assert.equal(getTranslations('zh-en').exwPickup, 'Pickup from factory arranged by the customer. / 客户安排工厂自提。');
  for (const lang of ['en', 'es', 'pt', 'fr', 'vi', 'km', 'ar', 'ru']) {
    assert.ok(getTranslations(lang).exwPickup.length > 0);
    assert.doesNotMatch(getTranslations(lang).exwPickup, /\p{Script=Han}/u);
  }
});
