import type { Summary } from '../api/types';

export function realizedProfitLabel(
  s: Pick<Summary, 'longHoldSales' | 'singlesSales' | 'completedHoldCount'>,
) {
  const parts: string[] = [];
  if (s.singlesSales.hasSales) parts.push('Singles');
  if (s.longHoldSales.hasSales) parts.push('Long Hold');
  parts.push(`Short Holds 1–${s.completedHoldCount}`);
  return `Realized Profit — ${parts.join(' + ')}`;
}

export function returnPct(box: { gain: number; spent: number }): number {
  return box.spent > 0 ? (box.gain / box.spent) * 100 : 0;
}
