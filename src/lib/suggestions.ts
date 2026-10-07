/** Distinct saved values for autocomplete, ignoring case and extra spaces; sorted A–Z. */
export function suggestionList(values: readonly string[]): string[] {
  const byKey = new Map<string, string>();
  for (const v of values) {
    const text = v.trim().replace(/\s+/g, ' ');
    const key = text.toLowerCase();
    if (text && !byKey.has(key)) byKey.set(key, text);
  }

  return [...byKey.values()].sort((a, b) => a.localeCompare(b));
}

/** Up to `limit` suggestions containing what's typed; none until something is typed. */
export function matchSuggestions(options: readonly string[], typed: string, limit = 8): string[] {
  const q = typed.trim().toLowerCase();
  if (!q) return [];

  return options.filter((o) => o.toLowerCase().includes(q) && o.toLowerCase() !== q).slice(0, limit);
}
