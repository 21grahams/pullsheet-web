// Search + filter for the Singles list, as pure functions. Same rules as the
// old app: search is a case-insensitive substring of the full card name;
// Pokémon/Set/Condition match exactly; the date range is inclusive.

import type { Single } from '../api/types';

export interface SinglesFilters {
  pokemon: string;
  setName: string;
  condition: string;
  /** "YYYY-MM-DD" or "" */
  dateFrom: string;
  dateTo: string;
}

export const emptyFilters: SinglesFilters = {
  pokemon: '',
  setName: '',
  condition: '',
  dateFrom: '',
  dateTo: '',
};

export function filterSingles(singles: readonly Single[], search: string, f: SinglesFilters): Single[] {
  const q = search.trim().toLowerCase();
  return singles.filter((s) => {
    if (q && !s.displayName.toLowerCase().includes(q)) return false;
    if (f.pokemon && s.pokemon !== f.pokemon) return false;
    if (f.setName && s.setName !== f.setName) return false;
    if (f.condition && s.condition !== f.condition) return false;
    // ISO dates compare correctly as strings, with no time-zone surprises.
    if (f.dateFrom && (!s.purchaseDate || s.purchaseDate < f.dateFrom)) return false;
    if (f.dateTo && (!s.purchaseDate || s.purchaseDate > f.dateTo)) return false;
    return true;
  });
}

/** How many filters are set (the number badge on the Filter button). */
export function activeFilterCount(f: SinglesFilters): number {
  return [f.pokemon, f.setName, f.condition, f.dateFrom || f.dateTo].filter(Boolean).length;
}

/** The choices in each filter dropdown: whatever values actually exist, sorted. */
export function filterOptions(singles: readonly Single[]) {
  const uniq = (values: string[]) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  return {
    pokemon: uniq(singles.map((s) => s.pokemon)),
    setName: uniq(singles.map((s) => s.setName)),
    condition: uniq(singles.map((s) => s.condition)),
  };
}
