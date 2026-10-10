// Market values arrive PER UNIT from the API; costs arrive as TOTALS.

import { formatMoney } from './format';

export type QuarterUnitValues = readonly [number | null, number | null, number | null, number | null];

export interface PricedItem {
  quantity: number;
  totalCost: number;
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
  value80: number;
  profit80: number;
  profit80Pct: number;
  tone: Tone;
}

/**
 * Short Hold items with no price yet fall back to their cost (the old app
 * showed "market = cost" for them), so pass `fallbackToCost` for those.
 */
interface ValueOptions {
  fallbackToCost?: boolean;
  /** Show market value at this percentage (a what-if exit); 100 = real market value. */
  valuePct?: number;
}

export function cardNumbers(item: PricedItem, opts: ValueOptions = {}): CardNumbers {
  const { quantity, totalCost } = item;
  const unitCost = quantity > 0 ? totalCost / quantity : totalCost;
  const base = item.unitValue ?? (opts.fallbackToCost ? unitCost : 0);
  const pct = opts.valuePct ?? 100;
  // A what-if price is rounded to the cent first, so the card's columns add up exactly as shown.
  const unitValue = pct === 100 ? base : Math.round(base * pct) / 100;
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
  label: string;
  /** Total value that quarter (per-unit × quantity), or null for "—". */
  total: number | null;
  delta: number | null;
  deltaLabel: 'vs cost' | 'vs prev Q';
  active: boolean;
}

/** `year` comes from the server (api_get_context), never the device clock. */
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

export function totals(items: readonly PricedItem[], opts: ValueOptions = {}): Totals {
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
