/**
 * Display-only pricing helpers. The real commission will come from the backend;
 * this constant only exists so the prototype can show a realistic breakdown.
 */
export const COMMISSION_RATE = 0.1;

export interface PriceBreakdown {
  base: number;
  commission: number;
  total: number;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

export function priceBreakdown(unitPrice: number, quantity = 1): PriceBreakdown {
  const base = round2(unitPrice * quantity);
  const commission = round2(base * COMMISSION_RATE);
  return { base, commission, total: round2(base + commission) };
}

/** Returns the discount percentage (e.g. 28) or null when there is no real discount. */
export function discountPercent(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) {
    return null;
  }
  return Math.round((1 - price / originalPrice) * 100);
}
