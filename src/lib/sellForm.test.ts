import { describe, expect, it } from 'vitest';
import { autoProfit, partialSaleNote, validateSale } from './sellForm';

describe('autoProfit', () => {
  it('is sold price minus unit cost × quantity sold', () => {
    expect(autoProfit('120', 88.39, 1)).toBe('31.61');
    expect(autoProfit('300', 191.1666666667, 2)).toBe('-82.33');
  });
  it('treats $0 as a trade, not as blank', () => {
    expect(autoProfit('0', 25, 1)).toBe('-25.00');
  });
  it('stays blank until a price is typed', () => {
    expect(autoProfit('', 25, 1)).toBe('');
    expect(autoProfit('abc', 25, 1)).toBe('');
  });
});

describe('partialSaleNote', () => {
  it('says what remains, or that the item goes away', () => {
    expect(partialSaleNote(6, 2, 'Long Hold')).toBe('4 units will remain in Long Hold.');
    expect(partialSaleNote(2, 1, 'Singles')).toBe('1 unit will remain in Singles.');
    expect(partialSaleNote(6, 6, 'Long Hold')).toBe('This will remove the item entirely from Long Hold.');
  });
  it('is empty for a single unit', () => {
    expect(partialSaleNote(1, 1, 'Singles')).toBe('');
  });
});

describe('validateSale', () => {
  it('allows $0 (trades) but not blank', () => {
    expect(validateSale('0', '-25', 1, 1)).toEqual({ soldPrice: 0, profit: -25 });
    expect(validateSale('', '', 1, 1)).toEqual({ error: 'Enter a sold price (0 or more, e.g. for trades)' });
    expect(validateSale('-5', '', 1, 1)).toEqual({
      error: 'Enter a sold price (0 or more, e.g. for trades)',
    });
  });
  it("won't sell more than you own", () => {
    expect(validateSale('10', '1', 3, 2)).toEqual({ error: 'You only have 2' });
  });
  it('uses the (possibly edited) profit, defaulting to 0', () => {
    expect(validateSale('$1,350', '1300', 1, 1)).toEqual({ soldPrice: 1350, profit: 1300 });
    expect(validateSale('10', '', 1, 1)).toEqual({ soldPrice: 10, profit: 0 });
  });
});
