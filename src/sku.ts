/**
 * Check if a token is a known SKU (case-insensitive).
 */
export function isKnownSku(token: string, knownSkus: string[]): boolean {
  const lower = token.toLowerCase();
  return knownSkus.some(sku => sku.toLowerCase() === lower);
}

/**
 * Determine if a token looks like a SKU (starts with a letter or contains letters).
 * Excludes quantity keywords (x2, SL2, etc.).
 */
export function looksLikeSku(token: string): boolean {
  const trimmed = token.trim();
  if (!trimmed) return false;

  // Quantity patterns are not SKUs
  if (/^[xX×*]\s?\d+$/.test(trimmed)) return false;
  if (/^[sS][lL]\s?\d+$/.test(trimmed)) return false;

  // Must start with a letter (not a digit or currency symbol)
  return /^[a-zA-Z]/.test(trimmed);
}
