/**
 * Quantity patterns: x2, X2, *2, ×2, SL2, sl2, SL 2
 */
const QTY_PATTERN = /^(?:[xX×*]\s?(\d+)|[sS][lL]\s?(\d+))$/;

/**
 * Parse a standalone quantity token.
 * Returns the quantity number or null if not a quantity token.
 */
export function parseQuantity(token: string): number | null {
  const match = token.trim().match(QTY_PATTERN);
  if (!match) return null;
  const val = parseInt(match[1] ?? match[2], 10);
  return val > 0 ? val : null;
}

/**
 * Try to extract an attached quantity from a price token.
 * e.g. "100k*2" → { priceStr: "100k", quantity: 2 }
 * e.g. "100kx3" → { priceStr: "100k", quantity: 3 }
 */
export function extractAttachedQuantity(token: string): { priceStr: string; quantity: number } | null {
  // Match: price part + separator + digits at end
  const match = token.match(/^(.+?)[xX×*](\d+)$/);
  if (!match) return null;
  const qty = parseInt(match[2], 10);
  if (qty <= 0) return null;
  return { priceStr: match[1], quantity: qty };
}
