const parse = (text: string) => Number.parseFloat(text.replace(/[$,\s]/g, ''));

/** Sold price minus the cost of the units sold; blank until a price is typed (0 is a valid trade). */
export function autoProfit(soldPrice: string, unitCost: number, quantitySold: number): string {
  const price = parse(soldPrice);
  if (soldPrice.trim() === '' || !Number.isFinite(price)) return '';

  return (price - unitCost * quantitySold).toFixed(2);
}

export function partialSaleNote(owned: number, selling: number, listName: string): string {
  if (owned <= 1) return '';
  if (selling >= owned) return `This will remove the item entirely from ${listName}.`;
  const left = owned - selling;

  return `${left} unit${left !== 1 ? 's' : ''} will remain in ${listName}.`;
}

export type SaleValidation = { error: string } | { soldPrice: number; profit: number };

export function validateSale(
  soldPrice: string,
  profit: string,
  quantitySold: number,
  owned: number,
): SaleValidation {
  const price = parse(soldPrice);
  if (soldPrice.trim() === '' || !Number.isFinite(price) || price < 0) {
    return { error: 'Enter a sold price (0 or more, e.g. for trades)' };
  }
  if (quantitySold < 1) return { error: 'Enter qty sold' };
  if (quantitySold > owned) return { error: `You only have ${owned}` };
  const p = parse(profit);

  return { soldPrice: price, profit: Number.isFinite(p) ? p : 0 };
}

export function validateHoldSale(soldPrice: string, profit: string): SaleValidation {
  const price = parse(soldPrice);
  if (!Number.isFinite(price) || price <= 0) return { error: 'Enter a valid sold price' };
  const p = parse(profit);
  if (!Number.isFinite(p)) return { error: 'Enter profit amount' };

  return { soldPrice: price, profit: p };
}

/** The iPhone decimal keypad has no minus key, so losses are entered with a ± button. */
export function flipSign(text: string): string {
  const t = text.trim();

  return t.startsWith('-') ? t.slice(1) : `-${t}`;
}
