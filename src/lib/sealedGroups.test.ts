import { describe, expect, it } from 'vitest';
import type { SealedItem } from '../api/types';
import { groupSealed, groupSummary } from './sealedGroups';

function item(overrides: Partial<SealedItem>): SealedItem {
  return {
    id: 1,
    name: 'S&V 151 ETB',
    quantity: 1,
    purchaseDate: '2026-03-18',
    totalCost: 712,
    fees: 0,
    feeUnits: 0,
    holdId: 1,
    holdName: 'Long Hold',
    holdNumber: null,
    holdStatus: 'long',
    unitValue: 480.21,
    quarterUnitValues: [620, 602, 480.21, null],
    ...overrides,
  };
}

const short = (
  id: number,
  n: number,
  status: 'current' | 'historical',
  overrides: Partial<SealedItem> = {},
) =>
  item({ id, holdId: 100 + n, holdName: `Short Hold ${n}`, holdNumber: n, holdStatus: status, ...overrides });

describe('groupSealed', () => {
  it('puts Long Hold first, then Short Holds newest to oldest', () => {
    const groups = groupSealed([
      short(5, 1, 'historical'),
      item({ id: 1 }),
      short(6, 14, 'current'),
      short(7, 13, 'historical'),
      item({ id: 2, name: 'Prismatic ETB' }),
    ]);
    expect(groups.map((g) => g.name)).toEqual([
      'Long Hold',
      'Short Hold 14',
      'Short Hold 13',
      'Short Hold 1',
    ]);
    expect(groups[0]!.items.map((i) => i.id)).toEqual([1, 2]);
    expect(groups[1]!.status).toBe('current');
  });
});

describe('groupSummary', () => {
  it('shows units, value and @80% for Long Hold', () => {
    const [long] = groupSealed([
      item({ quantity: 1, unitValue: 480.21 }),
      item({ id: 2, quantity: 6, unitValue: 139.63 }),
    ]);
    expect(groupSummary(long!)).toBe('7 units · $1,317.99 · $1,054.39 @80%');
  });

  it('shows units and value for Short Holds', () => {
    const [g] = groupSealed([short(1, 14, 'current', { quantity: 6, unitValue: 72.38 })]);
    expect(groupSummary(g!)).toBe('6 units · $434.28');
  });
});
