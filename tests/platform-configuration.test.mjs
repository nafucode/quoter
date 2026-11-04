import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultPartList, platformPartList, syncPartLists, platformText } from '../src/data/partListDefaults.ts';
import { platformFeatures } from '../src/data/platformFeatures.ts';

const lift = description => ({ description });
test('platform selection supplies the dedicated defaults without mutating standard rows', () => {
  const before = structuredClone(defaultPartList);
  const result = syncPartLists([lift('Platform Lift')], defaultPartList);
  assert.equal(result.partListTemplate, 'platform');
  assert.equal(result.partList.filter(r => r.id.startsWith('platform-')).length, 24);
  assert.deepEqual(defaultPartList, before);
  assert.equal(platformPartList.filter(r => r.brand === 'Hpmont').length, 5);
  assert.equal(platformPartList.filter(r => r.brand === 'In-house manufactured').length, 3);
});
test('mixed quotes show both templates, while dumbwaiters do not add a standard table', () => {
  assert.equal(syncPartLists([lift('Platform Lift'), lift('Passenger Lift')], []).partListTemplate, 'both');
  assert.equal(syncPartLists([lift('Platform Lift'), lift('Dumbwaiter Lift')], []).partListTemplate, 'platform');
  assert.equal(syncPartLists([lift('Passenger Lift')], []).partListTemplate, 'standard');
});
test('switching types, adding and removing lifts preserves custom rows without duplication', () => {
  let rows = syncPartLists([lift('Platform Lift')], defaultPartList).partList;
  rows = rows.map(r => r.id === 'platform-2-1' ? { ...r, brand: 'Custom controller' } : r);
  rows = syncPartLists([lift('Passenger Lift')], rows).partList;
  const result = syncPartLists([lift('Platform Lift'), lift('Platform Lift')], rows);
  assert.equal(result.partList.find(r => r.id === 'platform-2-1').brand, 'Custom controller');
  assert.equal(new Set(result.partList.map(r => r.id)).size, result.partList.length);
});
test('all nonblank source functions and the calling remark are retained', () => {
  assert.equal(platformFeatures.length, 29);
  assert.deepEqual(platformFeatures.map(f => f.no), [...Array.from({length:15}, (_,i)=>i+1), ...Array.from({length:14},(_,i)=>i+17)]);
  assert.match(platformFeatures.find(f => f.no === 13).remark, /SIM card slot/);
  for (const row of platformPartList) {
    assert.doesNotMatch(platformText(row.label, 'en'), /\p{Script=Han}/u);
  }
  assert.equal(platformText('Platform Lift 平台梯', 'zh'), '平台梯');
});
