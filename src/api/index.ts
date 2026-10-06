// The only module that talks to Supabase. Components and hooks call these
// functions; nothing else imports the client. Each wraps one api_* database
// function and converts its rows into the app's types.

import { supabase } from '../lib/supabase';
import type {
  AppContext,
  CompletedHold,
  HoldStatus,
  RetailerAccount,
  SealedItem,
  Single,
  Summary,
} from './types';

/** A failed request, carrying the database's own message (shown in a snackbar). */
export class ApiError extends Error {
  override name = 'ApiError';
}

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new ApiError(error.message);
  if (data == null) throw new ApiError('No data returned');
  return data;
}

/** Generated types say number; the database can return null. */
const n = (v: unknown): number | null => (v == null ? null : Number(v));
const num = (v: unknown): number => Number(v ?? 0);

export async function getContext(): Promise<AppContext> {
  const [row] = unwrap(await supabase.rpc('api_get_context'));
  if (!row) throw new ApiError('No context returned');
  return {
    today: row.today,
    year: row.year,
    quarter: row.quarter as AppContext['quarter'],
    currentShortHoldId: n(row.current_short_hold_id),
    currentShortHoldName: row.current_short_hold_name ?? null,
  };
}

export async function listSingles(): Promise<Single[]> {
  const rows = unwrap(await supabase.rpc('api_list_singles'));
  return rows.map((r) => ({
    id: r.id,
    pokemon: r.pokemon,
    setName: r.set_name,
    condition: r.condition,
    extra: r.extra,
    displayName: r.display_name,
    quantity: r.quantity,
    purchaseDate: r.purchase_date ?? null,
    totalCost: num(r.total_cost),
    fees: num(r.fees),
    feeUnits: r.fee_units,
    unitValue: n(r.unit_value),
    quarterUnitValues: [n(r.q1_unit_value), n(r.q2_unit_value), n(r.q3_unit_value), n(r.q4_unit_value)],
  }));
}

export async function listSealed(): Promise<SealedItem[]> {
  const rows = unwrap(await supabase.rpc('api_list_sealed'));
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    quantity: r.quantity,
    purchaseDate: r.purchase_date ?? null,
    totalCost: num(r.total_cost),
    fees: num(r.fees),
    feeUnits: r.fee_units,
    holdId: r.hold_id,
    holdName: r.hold_name,
    holdNumber: n(r.hold_number),
    holdStatus: r.hold_status as HoldStatus,
    unitValue: n(r.unit_value),
    quarterUnitValues: [n(r.q1_unit_value), n(r.q2_unit_value), n(r.q3_unit_value), n(r.q4_unit_value)],
  }));
}

export async function listAccounts(): Promise<RetailerAccount[]> {
  const rows = unwrap(await supabase.rpc('api_list_accounts'));
  return rows.map((r) => ({
    id: r.id,
    retailer: r.retailer,
    label: r.label,
    email: r.email,
    cardLast2: r.card_last2,
    phoneLast4: r.phone_last4,
    loop: r.loop,
    notes: r.notes,
  }));
}

export async function listCompletedHolds(): Promise<CompletedHold[]> {
  const rows = unwrap(await supabase.rpc('api_list_completed_holds'));
  return rows.map((r) => ({
    id: r.id,
    number: r.number,
    name: r.name,
    completedAt: r.completed_at,
    soldPrice: num(r.sold_price),
    profit: num(r.profit),
    costBasis: num(r.cost_basis),
    markup: num(r.markup),
    margin: num(r.margin),
  }));
}

export async function getSummary(): Promise<Summary> {
  const [r] = unwrap(await supabase.rpc('api_get_summary'));
  if (!r) throw new ApiError('No summary returned');
  return {
    singles: {
      spent: num(r.singles_spent),
      value: num(r.singles_value),
      gain: num(r.singles_gain),
      exit80: num(r.singles_exit_80),
      profit80: num(r.singles_profit_80),
    },
    longHold: {
      spent: num(r.long_hold_spent),
      value: num(r.long_hold_value),
      gain: num(r.long_hold_gain),
      exit80: num(r.long_hold_exit_80),
      profit80: num(r.long_hold_profit_80),
    },
    portfolio: {
      spent: num(r.portfolio_spent),
      value: num(r.portfolio_value),
      gain: num(r.portfolio_gain),
      exit80: num(r.portfolio_exit_80),
      profit80: num(r.portfolio_profit_80),
    },
    currentShort: {
      name: r.current_short_name ?? null,
      spent: num(r.current_short_spent),
      value: num(r.current_short_value),
      gain: num(r.current_short_gain),
      exit80: num(r.current_short_exit_80),
      profit80: num(r.current_short_profit_80),
    },
    completedHoldCount: r.completed_hold_count,
    completedHoldsProfit: num(r.completed_holds_profit),
    singlesSales: {
      soldPrice: num(r.singles_sold_price),
      profit: num(r.singles_sold_profit),
      markup: num(r.singles_sold_markup),
      margin: num(r.singles_sold_margin),
      hasSales: r.singles_has_sales,
    },
    longHoldSales: {
      soldPrice: num(r.long_hold_sold_price),
      profit: num(r.long_hold_sold_profit),
      markup: num(r.long_hold_sold_markup),
      margin: num(r.long_hold_sold_margin),
      hasSales: r.long_hold_has_sales,
    },
    totalRealizedProfit: num(r.total_realized_profit),
  };
}
