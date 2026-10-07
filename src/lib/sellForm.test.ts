import { describe, expect, it } from 'vitest';

import { partialSaleNote, profitFor, validateHoldSale, validateSale } from './sellForm';

describe('profitFor', () => {
  it('is sold price minus cost, to the cent', () => {
    expect(profitFor('120', 88.39)).toBe(31.61);
    expect(profitFor('300', 191.1666666667 * 2)).toBe(-82.33);
  });
  it('treats $0 as a trade, not as blank', () => {
    expect(profitFor('0', 25)).toBe(-25);
  });
  it('stays empty until a price is typed', () => {
    expect(profitFor('', 25)).toBeNull();
    expect(profitFor('abc', 25)).toBeNull();
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
  it('allows $0 (trades) but not blank or negative', () => {
    expect(validateSale('0', 1, 1, 25)).toEqual({ soldPrice: 0, profit: -25 });
    const errors = { errors: { soldPrice: 'Enter a price (0 for a trade)' } };
    expect(validateSale('', 1, 1, 25)).toEqual(errors);
    expect(validateSale('-5', 1, 1, 25)).toEqual(errors);
  });
  it("won't sell more than you own", () => {
    expect(validateSale('10', 3, 2, 1)).toEqual({ errors: { quantity: 'You only have 2' } });
  });
  it('calculates profit from the units sold', () => {
    expect(validateSale('$1,350', 2, 3, 25.005)).toEqual({ soldPrice: 1350, profit: 1299.99 });
  });
});

describe('validateHoldSale', () => {
  it('needs a sold price above 0 (no trades) and calculates profit', () => {
    const errors = { errors: { soldPrice: 'Enter a sold price' } };
    expect(validateHoldSale('', 457.15)).toEqual(errors);
    expect(validateHoldSale('0', 457.15)).toEqual(errors);
    expect(validateHoldSale('$600', 457.15)).toEqual({ soldPrice: 600, profit: 142.85 });
  });
});
