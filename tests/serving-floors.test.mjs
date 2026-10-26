import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildServingFloors, canSyncServingFloors } from '../src/utils/servingFloors.ts';

test('French-speaking markets use RDC with plain upper-floor numbers', () => {
  for (const country of ['Senegal', "Cote d'Ivoire", 'Cameroon', 'Benin', 'Democratic Republic of the Congo']) {
    assert.equal(buildServingFloors('4/4/4', country), 'RDC-1-2-3');
    assert.equal(buildServingFloors('6/6/6', country), 'RDC-1-2-3-4-5');
  }
});
test('other markets and Philippines retain existing conventions', () => {
  assert.equal(buildServingFloors('4/4/4', 'Nigeria'), 'GF-1F-2F-3F');
  assert.equal(buildServingFloors('4/4/4', 'Philippines'), 'GF-2F-3F-4F');
});
test('recognizes automatic and legacy sequences without overwriting manual sequences', () => {
  for (const value of ['', 'G-1-2-3', 'G-1F-2F-3F', 'GF-1F-2F-3F', 'RDC-1-2-3', 'GF-2F-3F-4F']) assert.equal(canSyncServingFloors(value, '4/4/4'), true);
  assert.equal(canSyncServingFloors('B1-RDC-1-2', '4/4/4'), false);
  assert.equal(canSyncServingFloors('GF-1F-2F-3F', '4/4/4', true), false);
});
test('handles one floor and invalid or excessive counts', () => {
  assert.equal(buildServingFloors('1/1/1', 'Senegal'), 'RDC');
  for (const value of ['', '-2', '0', '999999999', '4.5']) assert.equal(buildServingFloors(value), '');
});
