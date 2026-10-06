import type { RetailerAccount } from '../api/types';

// Copied exactly from the old app so every retailer keeps its color.
const RETAILER_PALETTE = [
  '#E5B94E',
  '#5FA8D3',
  '#7FC29B',
  '#D98BA0',
  '#B48EE0',
  '#E0975E',
  '#6FBF9E',
  '#DE7A6B',
  '#8FB2E0',
  '#C9A24B',
] as const;

/** A stable color per retailer name (case and surrounding spaces ignored). */
export function retailerColor(name: string): string {
  let hash = 0;
  const str = name.toLowerCase().trim();
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return RETAILER_PALETTE[hash % RETAILER_PALETTE.length]!;
}

export interface RetailerGroup {
  retailer: string;
  color: string;
  accounts: RetailerAccount[];
}

/** Groups accounts by retailer, keeping the API's order (retailers in the order first added). */
export function groupAccounts(accounts: readonly RetailerAccount[]): RetailerGroup[] {
  const groups = new Map<string, RetailerGroup>();
  for (const a of accounts) {
    let g = groups.get(a.retailer);
    if (!g) {
      g = { retailer: a.retailer, color: retailerColor(a.retailer), accounts: [] };
      groups.set(a.retailer, g);
    }
    g.accounts.push(a);
  }
  return [...groups.values()];
}
