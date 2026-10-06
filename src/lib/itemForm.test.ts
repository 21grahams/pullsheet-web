import { describe, expect, it } from 'vitest';
import { emptyItemForm, marketLabel, toSealedInput, toSingleInput, validateItemForm } from './itemForm';

const base = emptyItemForm('2026-10-06');

describe('validateItemForm', () => {
  it('needs a Pokémon for singles and a name for sealed', () => {
    expect(validateItemForm('single', { ...base, market: '10' })).toBe('Enter a Pokémon');
    expect(validateItemForm('sealed', { ...base, market: '10' })).toBe('Enter a name');
  });
  it('needs a set and condition for singles', () => {
    expect(validateItemForm('single', { ...base, pokemon: 'Mew', market: '10' })).toBe('Enter a set');
    expect(validateItemForm('single', { ...base, pokemon: 'Mew', setName: '151', market: '10' })).toBe(
      'Enter a condition',
    );
  });
  it('rejects conditions outside the allowed list', () => {
    expect(
      validateItemForm('single', {
        ...base,
        pokemon: 'Mew',
        setName: '151',
        condition: 'this is a condition test',
        market: '10',
      }),
    ).toBe('Choose a valid condition');
  });
  it('needs a market value', () => {
    expect(validateItemForm('sealed', { ...base, name: 'ETB' })).toBe('Enter a market value per item');
    expect(validateItemForm('sealed', { ...base, name: 'ETB', market: 'abc' })).toBe(
      'Enter a market value per item',
    );
  });
  it("won't let units with fee exceed quantity", () => {
    expect(validateItemForm('sealed', { ...base, name: 'ETB', market: '10', quantity: 2, feeUnits: 3 })).toBe(
      "Units w/ Fee can't exceed total quantity",
    );
  });
  it('accepts a complete form (cost may be blank, like the old app)', () => {
    expect(
      validateItemForm('single', { ...base, pokemon: 'Mew', setName: '151', condition: 'NM', market: '10' }),
    ).toBeNull();
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
