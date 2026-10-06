// The numbers shown on each card, sealed group header and the Singles summary
// strip, as pure functions so they can be tested in isolation. Formulas match
// the old app exactly. Market values arrive PER UNIT from the API; costs
// arrive as TOTALS.

import { formatMoney } from './format';

export type QuarterUnitValues = readonly [number | null, number | null, number | null, number | null];

export interface PricedItem {
  quantity: number;
  totalCost: number;
  /** Latest per-unit market value, or null if the item has never been priced. */
  unitValue: number | null;
}

export type Tone = 'gain' | 'loss' | 'neutral';

export interface CardNumbers {
  unitCost: number;
  unitValue: number;
  totalCost: number;
  totalValue: number;
  gain: number;
  gainPct: number;
  /** Value if sold at an 80% exit. */
  value80: number;
  /** Profit/loss at that 80% value. */
  profit80: number;
  profit80Pct: number;
  /** Drives the card's left border: green, red, or neutral at exactly zero. */
  tone: Tone;
}

/**
 * Short Hold items with no price yet fall back to their cost (the old app
 * showed "market = cost" for them), so pass `fallbackToCost` for those.
 */
export function cardNumbers(item: PricedItem, opts: { fallbackToCost?: boolean } = {}): CardNumbers {
  const { quantity, totalCost } = item;
  const unitCost = quantity > 0 ? totalCost / quantity : totalCost;
  const unitValue = item.unitValue ?? (opts.fallbackToCost ? unitCost : 0);
  const totalValue = unitValue * quantity;
  const gain = totalValue - totalCost;
  const value80 = totalValue * 0.8;
  const profit80 = value80 - totalCost;
  return {
    unitCost,
    unitValue,
    totalCost,
    totalValue,
    gain,
    gainPct: totalCost > 0 ? (gain / totalCost) * 100 : 0,
    value80,
    profit80,
    profit80Pct: totalCost > 0 ? (profit80 / totalCost) * 100 : 0,
    tone: gain > 0 ? 'gain' : gain < 0 ? 'loss' : 'neutral',
  };
}

export interface QuarterBox {
  quarter: 1 | 2 | 3 | 4;
  label: string; // "Q3 2026"
  /** Total value that quarter (per-unit × quantity), or null for "—". */
  total: number | null;
  /** Change vs cost (Q1) or vs the previous quarter; null when not shown. */
  delta: number | null;
  deltaLabel: 'vs cost' | 'vs prev Q';
  /** The latest quarter with a value (highlighted, with a dot). */
  active: boolean;
}

/**
 * The Q1–Q4 boxes. `year` comes from the server (api_get_context), never the
 * device clock. As in the old app, a delta shows only when both this quarter
 * and its comparison point have a value.
 */
export function quarterBoxes(
  unitValues: QuarterUnitValues,
  quantity: number,
  totalCost: number,
  year: number,
): QuarterBox[] {
  const totals = unitValues.map((v) => (v != null && v > 0 ? v * quantity : null));
  let activeIndex = 0;
  totals.forEach((t, i) => {
    if (t != null) activeIndex = i;
  });
  return totals.map((total, i) => {
    const prev = i === 0 ? totalCost : (totals[i - 1] ?? 0);
    return {
      quarter: (i + 1) as QuarterBox['quarter'],
      label: `Q${i + 1} ${year}`,
      total,
      delta: total != null && prev > 0 ? total - prev : null,
      deltaLabel: i === 0 ? 'vs cost' : 'vs prev Q',
      active: i === activeIndex,
    };
  });
}

/** "PAS Fees: $3.39 × 2 units", or just the total when unit count isn't set; null if no fees. */
export function pasFeesLabel(fees: number, feeUnits: number): string | null {
  if (!fees) return null;
  if (feeUnits > 0) return `${formatMoney(fees / feeUnits)} × ${feeUnits} unit${feeUnits !== 1 ? 's' : ''}`;
  return formatMoney(fees);
}

export interface Totals {
  units: number;
  totalCost: number;
  totalValue: number;
  gain: number;
  gainPct: number;
  value80: number;
}

/** Sums for a list of items: the Singles summary strip and each sealed group header. */
export function totals(items: readonly PricedItem[], opts: { fallbackToCost?: boolean } = {}): Totals {
  let units = 0;
  let totalCost = 0;
  let totalValue = 0;
  for (const item of items) {
    const n = cardNumbers(item, opts);
    units += item.quantity;
    totalCost += n.totalCost;
    totalValue += n.totalValue;
  }
  const gain = totalValue - totalCost;
  return {
    units,
    totalCost,
    totalValue,
    gain,
    gainPct: totalCost > 0 ? (gain / totalCost) * 100 : 0,
    value80: totalValue * 0.8,
  };
}

/**
 * The Singles strip's subtitle, as in the old app: "38 cards (35 entries)",
 * plus "of 40" while a search/filter is hiding some.
 */
export function cardsLabel(
  shown: readonly { quantity: number }[],
  all: readonly { quantity: number }[],
): string {
  const cards = shown.reduce((s, r) => s + r.quantity, 0);
  const allCards = all.reduce((s, r) => s + r.quantity, 0);
  let label = `${cards} card${cards !== 1 ? 's' : ''}`;
  if (shown.length !== cards) label += ` (${shown.length} entr${shown.length !== 1 ? 'ies' : 'y'})`;
  if (shown.length !== all.length) label += ` of ${allCards}`;
  return label;
}
