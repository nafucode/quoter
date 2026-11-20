const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? value as Record<string, unknown> : {};

const addValue = (target: string[], value: unknown) => {
  if (typeof value === 'string' || typeof value === 'number') target.push(String(value));
  if (Array.isArray(value)) value.forEach((item) => addValue(target, item));
};

export const quoteHistorySearchText = (entry: unknown) => {
  const record = asRecord(entry);
  const state = asRecord(record.state);
  const values: string[] = [];

  [
    record.quotationNo,
    record.companyName,
    record.customer,
    record.buyerName,
    record.clientName,
    record.projectName,
    record.country,
    record.quotationType,
    record.elevatorTypes,
    record.elevatorCategories,
    state.quotationNo,
    state.companyName,
    state.customer,
    state.buyerName,
    state.clientName,
    state.projectName,
    state.country,
    state.quotationType,
  ].forEach((value) => addValue(values, value));

  const elevators = Array.isArray(state.elevators) ? state.elevators : [];
  elevators.forEach((elevator) => {
    const lift = asRecord(elevator);
    [
      lift.description,
      lift.type,
      lift.model,
      lift.capacity,
      lift.speed,
      lift.floorsStopsDoors,
    ].forEach((value) => addValue(values, value));
  });

  return values.join(' ').toLocaleLowerCase();
};

export const filterQuoteHistory = <T,>(entries: T[], query: string): T[] => {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return entries;
  return entries.filter((entry) => {
    const searchable = quoteHistorySearchText(entry);
    return terms.every((term) => searchable.includes(term));
  });
};
