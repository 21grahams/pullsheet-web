const parse = (text: string) => Number.parseFloat(text.replace(/[$,\s]/g, ''));
const cents = (n: number) => Math.round(n * 100) / 100;

/** Sold price minus cost, to the cent; null until a price is typed (0 is a valid trade). */
export function profitFor(soldPrice: string, cost: number): number | null {
  const price = parse(soldPrice);
  if (soldPrice.trim() === '' || !Number.isFinite(price)) return null;

  return cents(price - cost);
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
  quantitySold: number,
  owned: number,
  unitCost: number,
): SaleValidation {
  const price = parse(soldPrice);
  if (soldPrice.trim() === '' || !Number.isFinite(price) || price < 0) {
    return { error: 'Enter a sold price (0 or more, e.g. for trades)' };
  }
  if (quantitySold < 1) return { error: 'Enter qty sold' };
  if (quantitySold > owned) return { error: `You only have ${owned}` };

  return { soldPrice: price, profit: cents(price - unitCost * quantitySold) };
}

export function validateHoldSale(soldPrice: string, spent: number): SaleValidation {
  const price = parse(soldPrice);
  if (!Number.isFinite(price) || price <= 0) return { error: 'Enter a valid sold price' };

  return { soldPrice: price, profit: cents(price - spent) };
}
