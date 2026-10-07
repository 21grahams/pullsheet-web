import type { RetailerAccount } from '../api/types';

import { describe, expect, it } from 'vitest';

import { groupAccounts, retailerColor } from './retailers';

describe('retailerColor', () => {
  // Colors the current app shows in Settings (screenshot): green, red, gold, blue.
  it('matches the old app for your retailers', () => {
    expect(retailerColor('Pokemon Center')).toBe('#7FC29B');
    expect(retailerColor('Target')).toBe('#DE7A6B');
    expect(retailerColor('Walmart')).toBe('#E5B94E');
    expect(retailerColor("Sam's Club")).toBe('#5FA8D3');
  });
  it('ignores case and surrounding spaces', () => {
    expect(retailerColor('  TARGET ')).toBe(retailerColor('Target'));
  });
});

describe('groupAccounts', () => {
  const acct = (id: number, retailer: string): RetailerAccount => ({
    id,
    retailer,
    label: `Account ${id}`,
    email: '',
    cardLast2: '',
    phoneLast4: '',
    loop: '',
    notes: '',
  });
  it('groups by retailer in the order they arrive', () => {
    const groups = groupAccounts([acct(1, 'Pokemon Center'), acct(2, 'Target'), acct(3, 'Pokemon Center')]);
    expect(groups.map((g) => [g.retailer, g.accounts.map((a) => a.id)])).toEqual([
      ['Pokemon Center', [1, 3]],
      ['Target', [2]],
    ]);
  });
});
