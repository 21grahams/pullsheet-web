import type { SealedInput, SingleInput } from '../api';
import type { SealedItem, Single } from '../api/types';
import { isValidCondition } from './condition';

export type ItemKind = 'single' | 'sealed';

export interface ItemFormValues {
  pokemon: string;
  setName: string;
  condition: string;
  extra: string;
  name: string;
  quantity: number;
  purchaseDate: string;
  /** Total cost paid, before PAS fees. */
  cost: string;
  /** Per item; with a quantity of 1 that's also the total. */
  market: string;
  fees: string;
  feeUnits: number;
  hold: 'long' | 'short';
}

export const emptyItemForm = (today: string): ItemFormValues => ({
  pokemon: '',
  setName: '',
  condition: '',
  extra: '',
  name: '',
  quantity: 1,
  purchaseDate: today,
  cost: '',
  market: '',
  fees: '',
  feeUnits: 0,
  hold: 'long',
});

export const marketLabel = (quantity: number) =>
  quantity > 1 ? 'Market Value Per Item' : 'Total Market Value';

function parseMoney(text: string): number {
  const n = Number.parseFloat(text.replace(/[$,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/** The first problem to report, or null if the form can be saved. */
export function validateItemForm(kind: ItemKind, v: ItemFormValues): string | null {
  if (kind === 'single') {
    if (!v.pokemon.trim()) return 'Enter a Pokémon';
    if (!v.setName.trim()) return 'Enter a set';
    if (!v.condition.trim()) return 'Enter a condition';
    if (!isValidCondition(v.condition)) return 'Choose a valid condition';
  } else if (!v.name.trim()) {
    return 'Enter a name';
  }
  if (!parseMoney(v.market)) return 'Enter a market value per item';
  if (v.feeUnits > v.quantity) return "Units w/ Fee can't exceed total quantity";
  return null;
}

/** The exact stored numbers behind an edit form, and how they were displayed. */
export interface ItemFormOriginal {
  values: ItemFormValues;
  baseCost: number;
  fees: number;
  unitValue: number | null;
}

const toInputText = (n: number) => String(Math.round(n * 100) / 100);

export function formFromItem(item: Single | SealedItem, today: string): ItemFormOriginal {
  const baseCost = item.totalCost - item.fees;
  const values: ItemFormValues = {
    ...emptyItemForm(today),
    ...('pokemon' in item
      ? { pokemon: item.pokemon, setName: item.setName, condition: item.condition, extra: item.extra }
      : { name: item.name }),
    quantity: item.quantity,
    purchaseDate: item.purchaseDate ?? today,
    cost: baseCost ? toInputText(baseCost) : '',
    market: item.unitValue != null ? toInputText(item.unitValue) : '',
    fees: item.fees ? toInputText(item.fees) : '',
    feeUnits: item.feeUnits,
  };
  return { values, baseCost, fees: item.fees, unitValue: item.unitValue };
}

// Untouched money fields send back the exact stored value, so an edit never
// rounds away fractions of a cent left by earlier partial sales or moves; an
// untouched market value is sent as null so no quarter price gets written.
function shared(v: ItemFormValues, original?: ItemFormOriginal) {
  const keep = <T>(field: 'cost' | 'fees' | 'market', exact: T, parsed: number): T | number =>
    original && v[field] === original.values[field] ? exact : parsed;
  return {
    quantity: v.quantity,
    purchaseDate: v.purchaseDate,
    baseCost: keep('cost', original?.baseCost ?? 0, parseMoney(v.cost)),
    fees: keep('fees', original?.fees ?? 0, parseMoney(v.fees)),
    feeUnits: v.feeUnits,
    unitValue: keep('market', null, parseMoney(v.market)),
  };
}

export const toSingleInput = (v: ItemFormValues, original?: ItemFormOriginal): SingleInput => ({
  pokemon: v.pokemon.trim(),
  setName: v.setName.trim(),
  condition: v.condition.trim().toUpperCase(),
  extra: v.extra.trim().toUpperCase(),
  ...shared(v, original),
});

export const toSealedInput = (v: ItemFormValues, original?: ItemFormOriginal): SealedInput => ({
  name: v.name.trim(),
  ...shared(v, original),
});
