export function flattenI18n(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const key = prefix ? prefix + '.' + k : k;
    if (typeof v === 'string') {
      result[key] = v;
    } else if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      const nested = flattenI18n(v as Record<string, unknown>, key);
      for (const nk of Object.keys(nested)) {
        result[nk] = nested[nk];
      }
    }
  }
  return result;
}
