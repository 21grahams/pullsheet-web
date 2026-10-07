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

export type SaleErrors = Partial<Record<'quantity' | 'soldPrice', string>>;
export type SaleValidation = { errors: SaleErrors } | { soldPrice: number; profit: number };

export function validateSale(
  soldPrice: string,
  quantitySold: number,
  owned: number,
  unitCost: number,
): SaleValidation {
  const errors: SaleErrors = {};
  const price = parse(soldPrice);
  if (soldPrice.trim() === '' || !Number.isFinite(price) || price < 0) {
    errors.soldPrice = 'Enter a price (0 for a trade)';
  }
  if (quantitySold < 1) errors.quantity = 'Enter qty sold';
  else if (quantitySold > owned) errors.quantity = `You only have ${owned}`;
  if (Object.keys(errors).length) return { errors };

  return { soldPrice: price, profit: cents(price - unitCost * quantitySold) };
}

export function validateHoldSale(soldPrice: string, spent: number): SaleValidation {
  const price = parse(soldPrice);
  if (!Number.isFinite(price) || price <= 0) return { errors: { soldPrice: 'Enter a sold price' } };

  return { soldPrice: price, profit: cents(price - spent) };
}
