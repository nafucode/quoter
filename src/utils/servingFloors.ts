// Quoter defaults for French-speaking sales markets; users can override the labels.
const rdcMarkets = new Set([
  'Algeria', 'Benin', 'Cameroon', "Cote d'Ivoire", 'Djibouti',
  'Democratic Republic of the Congo', 'Guinea', 'Mali', 'Mauritius',
  'Morocco', 'Rwanda', 'Senegal', 'Seychelles',
]);

function floorCount(value: string | number) {
  const count = Number(String(value).match(/^\s*(\d+)(?:\s*\/|\s*$)/)?.[1] ?? 0);
  return Number.isInteger(count) && count > 0 && count <= 250 ? count : 0;
}

export function buildServingFloors(floorsStops: string | number, country = '') {
  const count = floorCount(floorsStops);
  if (!count) return '';
  const french = rdcMarkets.has(country);
  const first = country === 'Philippines' ? 2 : 1;
  return [french ? 'RDC' : 'GF', ...Array.from({ length: count - 1 }, (_, index) => `${index + first}${french ? '' : 'F'}`)].join('-');
}

export function canSyncServingFloors(value: string, floorsStops: string | number, manual = false) {
  if (manual) return false;
  if (!value) return true;
  const regular = buildServingFloors(floorsStops);
  if (!regular) return false;
  return [regular, buildServingFloors(floorsStops, 'Philippines'), buildServingFloors(floorsStops, 'Senegal'),
    regular.replace(/^GF/, 'G'), regular.replace(/F/g, '')].includes(value);
}
