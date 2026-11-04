type QuoteRecord = Record<string, any>;

export function elevatorCategories(entry: QuoteRecord): string[] {
  const elevators = entry.state?.elevators;
  if (!Array.isArray(elevators) || !elevators.length) {
    return Array.isArray(entry.elevatorCategories) && entry.elevatorCategories.length
      ? [...new Set<string>(entry.elevatorCategories)] : ['未记录'];
  }
  return [...new Set<string>(elevators.map(e => {
    const description = String(e.description ?? '').trim();
    if (/dumbwaiter|餐梯/i.test(description)) return '餐梯';
    if (/platform|平台/i.test(description)) return '平台梯';
    if (/home|villa|家用|别墅/i.test(description)) return '家用';
    if (/freight|cargo|货梯|载货/i.test(description)) return '货梯';
    if (/passenger|乘客|客梯/i.test(description)) return '乘客';
    if (/service|服务/i.test(description)) return '服务梯';
    return description || '未记录';
  }))];
}

export function createQuoteFromTemplate(state: QuoteRecord, usedNumbers: string[], now = new Date()) {
  if (!Array.isArray(state?.elevators) || !state.elevators.length) throw new Error('这份报价缺少电梯参数，无法用作模板。');
  const date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const prefix = `XFJ${date.slice(2).replaceAll('-', '')}`;
  const used = [...usedNumbers, String(state.quotationNo || '')]
    .filter(number => number.startsWith(prefix) && /^\d+$/.test(number.slice(prefix.length)))
    .map(number => Number(number.slice(prefix.length)));
  const sequence = Math.max(0, ...used) + 1;
  return {
    ...structuredClone(state),
    companyName: '', projectName: '', ruc: '',
    quotationNo: `${prefix}${String(sequence).padStart(2, '0')}`,
    quotationDate: date,
  };
}
