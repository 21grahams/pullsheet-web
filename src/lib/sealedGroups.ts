// Long Hold first, then Short Holds newest to oldest; items newest-added first.

import type { HoldStatus, SealedItem } from '../api/types';
import { formatMoney } from './format';
import { totals } from './cardMath';
import { newestFirst } from './singlesFilter';

export interface SealedGroup {
  holdId: number;
  name: string;
  status: HoldStatus;
  items: SealedItem[];
}

export function groupSealed(items: readonly SealedItem[]): SealedGroup[] {
  const groups = new Map<number, SealedGroup>();
  for (const item of items) {
    let group = groups.get(item.holdId);
    if (!group) {
      group = { holdId: item.holdId, name: item.holdName, status: item.holdStatus, items: [] };
      groups.set(item.holdId, group);
    }
    group.items.push(item);
  }
  const rank = (g: SealedGroup) => (g.status === 'long' ? -1 : 0);
  const number = (g: SealedGroup) => g.items[0]?.holdNumber ?? 0;
  return [...groups.values()]
    .sort((a, b) => rank(a) - rank(b) || number(b) - number(a))
    .map((g) => ({ ...g, items: newestFirst(g.items) }));
}

/**
 * The header summary, as in the old app: "23 units · $2,856.35 · $2,285.08 @80%"
 * for Long Hold, "12 units · $641.55" for Short Holds.
 */
export function groupSummary(group: SealedGroup): string {
  const t = totals(group.items);
  const base = `${t.units} units · ${formatMoney(t.totalValue)}`;
  return group.status === 'long' ? `${base} · ${formatMoney(t.value80)} @80%` : base;
}
