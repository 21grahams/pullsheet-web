import { describe, expect, it } from 'vitest';
import { cardNumbers, cardsLabel, pasFeesLabel, quarterBoxes, totals } from './cardMath';
import { formatMoney, formatSignedPct } from './format';

// Real cards from the current app's screenshots; every expected string is
// what that app displays today.

describe('cardNumbers', () => {
  it('Marill – Southern Islands (single, small loss)', () => {
    const n = cardNumbers({ quantity: 1, totalCost: 88.39, unitValue: 88.02 });
    expect(formatMoney(n.unitCost)).toBe('$88.39');
    expect(formatMoney(n.totalValue)).toBe('$88.02');
    expect(formatMoney(n.gain)).toBe('$-0.37');
    expect(formatSignedPct(n.gainPct)).toBe('-0.4%');
    expect(formatMoney(n.value80)).toBe('$70.42');
    expect(formatMoney(n.profit80)).toBe('$-17.97');
    expect(formatSignedPct(n.profit80Pct)).toBe('-20.3%');
    expect(n.tone).toBe('loss');
  });

  it('S&V Prismatic ETB (qty 6, Long Hold)', () => {
    const n = cardNumbers({ quantity: 6, totalCost: 1147, unitValue: 139.63 });
    expect(formatMoney(n.unitCost)).toBe('$191.17');
    expect(formatMoney(n.totalValue)).toBe('$837.78');
    expect(formatMoney(n.gain)).toBe('$-309.22');
    expect(formatSignedPct(n.gainPct)).toBe('-27.0%');
    expect(formatMoney(n.value80)).toBe('$670.22');
    expect(formatMoney(n.profit80)).toBe('$-476.78');
    expect(formatSignedPct(n.profit80Pct)).toBe('-41.6%');
  });

  it('30th Booster Bundle (qty 6, Short Hold, gain)', () => {
    const n = cardNumbers({ quantity: 6, totalCost: 175.98, unitValue: 72.38 });
    expect(formatMoney(n.totalValue)).toBe('$434.28');
    expect(formatMoney(n.gain)).toBe('$258.30');
    expect(formatSignedPct(n.gainPct)).toBe('+146.8%');
    expect(formatMoney(n.value80)).toBe('$347.42');
    expect(formatMoney(n.profit80)).toBe('$171.44');
    expect(formatSignedPct(n.profit80Pct)).toBe('+97.4%');
    expect(n.tone).toBe('gain');
  });

  it('an unpriced item is worth $0, or its cost for Short Holds', () => {
    expect(cardNumbers({ quantity: 2, totalCost: 50, unitValue: null }).totalValue).toBe(0);
    const short = cardNumbers({ quantity: 2, totalCost: 50, unitValue: null }, { fallbackToCost: true });
    expect(short.totalValue).toBe(50);
    expect(short.gain).toBe(0);
    expect(short.tone).toBe('neutral');
  });

  it('a free item (cost $0) shows 0% rather than dividing by zero', () => {
    const n = cardNumbers({ quantity: 1, totalCost: 0, unitValue: 12 });
    expect(n.gainPct).toBe(0);
    expect(n.profit80Pct).toBe(0);
    expect(n.tone).toBe('gain');
  });
});

describe('quarterBoxes', () => {
  it('Marill: deltas vs cost and vs the previous quarter, latest highlighted', () => {
    const boxes = quarterBoxes([70.82, 80.07, 88.02, null], 1, 88.39, 2026);
    expect(boxes.map((b) => b.label)).toEqual(['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026']);
    expect(boxes.map((b) => b.total)).toEqual([70.82, 80.07, 88.02, null]);
    expect(formatMoney(boxes[0]!.delta)).toBe('$-17.57'); // shown as "↓ $17.57 vs cost"
    expect(boxes[0]!.deltaLabel).toBe('vs cost');
    expect(formatMoney(boxes[1]!.delta)).toBe('$9.25');
    expect(formatMoney(boxes[2]!.delta)).toBe('$7.95');
    expect(boxes[3]!.delta).toBeNull();
    expect(boxes.map((b) => b.active)).toEqual([false, false, true, false]);
  });

  it('multiplies per-unit values by quantity', () => {
    const boxes = quarterBoxes([160, 204.26, 139.63, null], 6, 1147, 2026);
    expect(formatMoney(boxes[0]!.total)).toBe('$960.00');
    expect(formatMoney(boxes[1]!.total)).toBe('$1,225.56');
    expect(formatMoney(boxes[2]!.delta)).toBe('$-387.78');
  });

  it('no delta after an empty quarter; Q1 is active when nothing is priced', () => {
    const boxes = quarterBoxes([null, null, 10, null], 1, 8, 2026);
    expect(boxes[2]!.delta).toBeNull(); // previous quarter is empty
    expect(boxes[2]!.active).toBe(true);
    expect(quarterBoxes([null, null, null, null], 1, 8, 2026)[0]!.active).toBe(true);
  });
});

describe('pasFeesLabel', () => {
  it('shows the per-unit fee times units, or the plain total', () => {
    expect(pasFeesLabel(6.78, 2)).toBe('$3.39 × 2 units');
    expect(pasFeesLabel(5, 1)).toBe('$5.00 × 1 unit');
    expect(pasFeesLabel(5, 0)).toBe('$5.00');
    expect(pasFeesLabel(0, 0)).toBeNull();
  });
});

describe('totals and cardsLabel', () => {
  const items = [
    { quantity: 1, totalCost: 88.39, unitValue: 88.02 },
    { quantity: 2, totalCost: 10, unitValue: 4 },
  ];
  it('sums units, cost, value and the 80% exit', () => {
    const t = totals(items);
    expect(t.units).toBe(3);
    expect(formatMoney(t.totalValue)).toBe('$96.02');
    expect(formatMoney(t.gain)).toBe('$-2.37');
    expect(formatMoney(t.value80)).toBe('$76.82');
  });
  it('labels cards vs entries, and "of N" while filtered', () => {
    expect(cardsLabel(items, items)).toBe('3 cards (2 entries)');
    expect(cardsLabel([items[0]!], items)).toBe('1 card of 3');
    expect(cardsLabel([{ quantity: 1 }], [{ quantity: 1 }])).toBe('1 card');
  });
});
