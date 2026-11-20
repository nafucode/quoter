import test from 'node:test';
import assert from 'node:assert/strict';
import { filterQuoteHistory } from '../src/utils/filterQuoteHistory.ts';

const history = [
  {
    quotationNo: 'XFJ26112001',
    companyName: 'Eco Trading',
    projectName: 'Accra Tower',
    country: 'Ghana',
    quotationType: 'EXW',
    state: { elevators: [{ description: 'Passenger Lift', type: 'TKJW1000/1.0-VVVF', capacity: '1000KG' }] },
  },
  {
    quotationNo: 'XFJ26112002',
    customer: 'Metro Engineering',
    projectName: 'Lagos Mall',
    country: 'Nigeria',
    quotationType: 'FOB',
    state: { elevators: [{ description: 'Freight Lift', type: 'THJW2000/0.5-VVVF', capacity: '2000KG' }] },
  },
];

test('history search matches customer, project, country, number and elevator model', () => {
  assert.equal(filterQuoteHistory(history, 'Eco').length, 1);
  assert.equal(filterQuoteHistory(history, 'Accra').length, 1);
  assert.equal(filterQuoteHistory(history, 'Ghana 1000').length, 1);
  assert.equal(filterQuoteHistory(history, '26112002').length, 1);
  assert.equal(filterQuoteHistory(history, 'THJW2000').length, 1);
  assert.equal(filterQuoteHistory(history, 'Metro Engineering')[0], history[1]);
});

test('history search is case-insensitive and keeps the original list for a blank query', () => {
  assert.equal(filterQuoteHistory(history, 'eco trading')[0], history[0]);
  assert.equal(filterQuoteHistory(history, '  '), history);
  assert.deepEqual(filterQuoteHistory(history, 'missing'), []);
});
