// The app's own data types: camelCase, with nullable fields declared
// honestly. (The generated database types claim per-unit values are always
// numbers, but they're null when an item has no price for that period.)

import type { QuarterUnitValues } from '../lib/cardMath';

export interface AppContext {
  /** Today in Denver time, "YYYY-MM-DD". */
  today: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  currentShortHoldId: number | null;
  currentShortHoldName: string | null;
}

interface ItemBase {
  id: number;
  quantity: number;
  /** "YYYY-MM-DD", or null if unknown. */
  purchaseDate: string | null;
  /** Total cost paid, PAS fees included. */
  totalCost: number;
  /** The PAS fee portion of totalCost, kept for display. */
  fees: number;
  feeUnits: number;
  /** Latest per-unit market value; null if never priced. */
  unitValue: number | null;
  /** This year's Q1–Q4 per-unit values; null = no price that quarter. */
  quarterUnitValues: QuarterUnitValues;
}

export interface Single extends ItemBase {
  pokemon: string;
  setName: string;
  condition: string;
  /** Optional trailing tag, e.g. "PULLED". Empty string if none. */
  extra: string;
  /** "Pokémon - Set - Condition[ - extra]", for search and copy. */
  displayName: string;
}

export type HoldStatus = 'long' | 'current' | 'historical';

export interface SealedItem extends ItemBase {
  name: string;
  holdId: number;
  holdName: string;
  /** Short Hold number (1, 2, …); null for Long Hold. */
  holdNumber: number | null;
  holdStatus: HoldStatus;
}

export interface RetailerAccount {
  id: number;
  retailer: string;
  label: string;
  email: string;
  cardLast2: string;
  phoneLast4: string;
  loop: string;
  notes: string;
}

export interface CompletedHold {
  id: number;
  number: number;
  name: string;
  completedAt: string;
  soldPrice: number;
  profit: number;
  costBasis: number;
  markup: number;
  margin: number;
}

export interface SummaryBox {
  spent: number;
  value: number;
  gain: number;
  exit80: number;
  profit80: number;
}

export interface SalesBox {
  soldPrice: number;
  profit: number;
  markup: number;
  margin: number;
  hasSales: boolean;
}

/** Every number on the Summary tab, all calculated by the database. */
export interface Summary {
  singles: SummaryBox;
  longHold: SummaryBox;
  portfolio: SummaryBox;
  currentShort: SummaryBox & { name: string | null };
  completedHoldCount: number;
  completedHoldsProfit: number;
  singlesSales: SalesBox;
  longHoldSales: SalesBox;
  totalRealizedProfit: number;
}
