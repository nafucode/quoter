export function quoteFingerprint(state: unknown) {
  return JSON.stringify(state, (key, value) => {
    if (key === 'isCollapsed' || key === 'nextId') return undefined;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
    return Object.fromEntries(Object.keys(value).sort().map(k => [k, value[k]]));
  });
}
