import type { SealedInput, SingleInput } from '../api';
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

const shared = (v: ItemFormValues) => ({
  quantity: v.quantity,
  purchaseDate: v.purchaseDate,
  baseCost: parseMoney(v.cost),
  fees: parseMoney(v.fees),
  feeUnits: v.feeUnits,
  unitValue: parseMoney(v.market),
});

export const toSingleInput = (v: ItemFormValues): SingleInput => ({
  pokemon: v.pokemon.trim(),
  setName: v.setName.trim(),
  condition: v.condition.trim().toUpperCase(),
  extra: v.extra.trim().toUpperCase(),
  ...shared(v),
});

export const toSealedInput = (v: ItemFormValues): SealedInput => ({ name: v.name.trim(), ...shared(v) });
