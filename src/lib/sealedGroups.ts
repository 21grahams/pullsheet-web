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

export function groupSummary(group: SealedGroup): string {
  const t = totals(group.items);
  const base = `${t.units} units · ${formatMoney(t.totalValue)}`;
  return group.status === 'long' ? `${base} · ${formatMoney(t.value80)} @80%` : base;
}
