import { describe, expect, it } from 'vitest';

import {
  emptyItemForm,
  formFromItem,
  marketLabel,
  toSealedInput,
  toSingleInput,
  validateItemForm,
} from './itemForm';

const base = emptyItemForm('2026-10-06');

describe('validateItemForm', () => {
  it('reports every missing field at once', () => {
    expect(validateItemForm('single', base)).toEqual({
      pokemon: 'Enter a Pokémon',
      setName: 'Enter a set',
      condition: 'Choose a condition',
      market: 'Enter a market value',
    });
    expect(validateItemForm('sealed', base)).toEqual({
      name: 'Enter a name',
      market: 'Enter a market value',
    });
  });
  it('rejects conditions outside the allowed list', () => {
    const v = {
      ...base,
      pokemon: 'Mew',
      setName: '151',
      condition: 'this is a condition test',
      market: '10',
    };
    expect(validateItemForm('single', v)).toEqual({ condition: 'Choose a condition' });
  });
  it('rejects a market value that is not a number', () => {
    expect(validateItemForm('sealed', { ...base, name: 'ETB', market: 'abc' })).toEqual({
      market: 'Enter a market value',
    });
  });
  it("won't let units with fee exceed quantity", () => {
    expect(
      validateItemForm('sealed', { ...base, name: 'ETB', market: '10', quantity: 2, feeUnits: 3 }),
    ).toEqual({
      feeUnits: "Units w/ fee can't exceed qty",
    });
  });
  it('accepts a complete form (cost may be blank, like the old app)', () => {
    expect(
      validateItemForm('single', { ...base, pokemon: 'Mew', setName: '151', condition: 'NM', market: '10' }),
    ).toEqual({});
  });
});

describe('marketLabel', () => {
  it('is per item only when there is more than one', () => {
    expect(marketLabel(1)).toBe('Total Market Value');
    expect(marketLabel(2)).toBe('Market Value Per Item');
  });
});

describe('toSingleInput / toSealedInput', () => {
  it('trims text and parses money, ignoring $ and commas', () => {
    expect(
      toSingleInput({
        ...base,
        pokemon: ' Charizard ex ',
        setName: 'Obsidian Flames',
        condition: 'NM',
        quantity: 2,
        cost: '$1,050.50',
        market: '600',
        fees: '30',
        feeUnits: 2,
      }),
    ).toEqual({
      pokemon: 'Charizard ex',
      setName: 'Obsidian Flames',
      condition: 'NM',
      extra: '',
      quantity: 2,
      purchaseDate: '2026-10-06',
      baseCost: 1050.5,
      fees: 30,
      feeUnits: 2,
      unitValue: 600,
    });
  });
  it('uppercases condition and tag', () => {
    expect(toSingleInput({ ...base, pokemon: 'Mew', condition: 'psa 10 ', extra: 'pulled' })).toMatchObject({
      condition: 'PSA 10',
      extra: 'PULLED',
    });
  });
  it('treats a blank cost and fees as 0', () => {
    const input = toSealedInput({ ...base, name: 'ETB', market: '50' });
    expect(input).toMatchObject({ name: 'ETB', baseCost: 0, fees: 0, unitValue: 50 });
  });
});

describe('editing (formFromItem + original)', () => {
  const prismatic = {
    id: 7,
    name: 'S&V Prismatic ETB',
    quantity: 5,
    purchaseDate: '2026-03-16',
    totalCost: 955.8333333333334,
    fees: 0,
    feeUnits: 0,
    holdId: 1,
    holdName: 'Long Hold',
    holdNumber: null,
    holdStatus: 'long' as const,
    unitValue: 139.63,
    quarterUnitValues: [160, 204.26, 139.63, null] as const,
  };

  it('pre-fills the form, showing money rounded to cents', () => {
    const { values } = formFromItem(prismatic, '2026-10-06');
    expect(values).toMatchObject({
      name: 'S&V Prismatic ETB',
      quantity: 5,
      cost: '955.83',
      market: '139.63',
    });
  });

  it('sends exact stored values back when money fields are untouched, and no price', () => {
    const original = formFromItem(prismatic, '2026-10-06');
    const input = toSealedInput({ ...original.values, name: 'Prismatic ETB' }, original);
    expect(input.baseCost).toBe(955.8333333333334);
    expect(input.unitValue).toBeNull();
  });

  it('sends the new number when a money field is changed', () => {
    const original = formFromItem(prismatic, '2026-10-06');
    const input = toSealedInput({ ...original.values, cost: '960', market: '150' }, original);
    expect(input.baseCost).toBe(960);
    expect(input.unitValue).toBe(150);
  });

  it('splits PAS fees back out of the stored total for singles', () => {
    const marill = {
      id: 1,
      pokemon: 'Marill',
      setName: 'Southern Islands',
      condition: 'LP',
      extra: '',
      displayName: 'Marill - Southern Islands - LP',
      quantity: 2,
      purchaseDate: '2026-03-28',
      totalCost: 176.78,
      fees: 6.78,
      feeUnits: 2,
      unitValue: 88.02,
      quarterUnitValues: [null, null, 88.02, null] as const,
    };
    const { values } = formFromItem(marill, '2026-10-06');
    expect(values).toMatchObject({
      pokemon: 'Marill',
      condition: 'LP',
      cost: '170',
      fees: '6.78',
      feeUnits: 2,
    });
  });
});
