import type { Summary } from '../api/types';

/**
 * The Realized Profit box's title lists only what actually has sales, so it
 * never claims to include something empty, e.g.
 * "Realized Profit — Singles + Long Hold + Short Holds 1–13".
 */
export function realizedProfitLabel(
  s: Pick<Summary, 'longHoldSales' | 'singlesSales' | 'completedHoldCount'>,
) {
  const parts: string[] = [];
  // Same order as the app itself: cards first, then holds.
  if (s.singlesSales.hasSales) parts.push('Singles');
  if (s.longHoldSales.hasSales) parts.push('Long Hold');
  parts.push(`Short Holds 1–${s.completedHoldCount}`);
  return `Realized Profit — ${parts.join(' + ')}`;
}

/** Portfolio return as a percentage (gain ÷ spent × 100), 0 when nothing's spent. */
export function returnPct(box: { gain: number; spent: number }): number {
  return box.spent > 0 ? (box.gain / box.spent) * 100 : 0;
}
