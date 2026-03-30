import { parseQuantity, extractAttachedQuantity } from './quantity.js';
import { looksLikeSku, isKnownSku } from './sku.js';
import { CURRENCY_PREFIX_MAP, CURRENCY_MULTI_PREFIX } from './constants.js';

export interface TokenGroup {
  skuToken: string;
  priceToken: string;
  quantity: number;
  raw: string;
}

/**
 * Check if a token starts with a currency symbol or digit (looks like a price).
 */
function looksLikePrice(token: string): boolean {
  const t = token.trim();
  if (!t) return false;

  // Starts with digit
  if (/^\d/.test(t)) return true;

  // Starts with a currency prefix
  for (const prefix of Object.keys(CURRENCY_MULTI_PREFIX)) {
    if (t.startsWith(prefix)) return true;
  }
  if (CURRENCY_PREFIX_MAP[t[0]]) return true;

  return false;
}

/**
 * Build a regex to split a comment by the configured separators.
 */
function buildSplitRegex(separators: string[]): RegExp {
  if (separators.length === 1 && separators[0] === ' ') {
    return /\s+/;
  }

  const escaped = separators.map(s => {
    if (s === ' ') return '\\s+';
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });

  return new RegExp(escaped.join('|'));
}

/**
 * Tokenize a comment string into groups of [sku, price, quantity].
 */
export function tokenize(
  comment: string,
  separators: string[] = [' '],
  knownSkus?: string[]
): TokenGroup[] {
  const normalized = comment.trim().replace(/\s+/g, ' ');
  if (!normalized) return [];

  const splitRegex = buildSplitRegex(separators);
  const tokens = normalized.split(splitRegex).filter(Boolean);

  const groups: TokenGroup[] = [];
  let currentSku: string | null = null;
  let currentPrice: string | null = null;
  let currentQty = 1;
  let rawParts: string[] = [];

  function flushGroup() {
    if (currentSku && currentPrice) {
      groups.push({
        skuToken: currentSku,
        priceToken: currentPrice,
        quantity: currentQty,
        raw: rawParts.join(' '),
      });
    }
    currentSku = null;
    currentPrice = null;
    currentQty = 1;
    rawParts = [];
  }

  for (const token of tokens) {
    // Check if this is a known SKU
    const isKnown = knownSkus && isKnownSku(token, knownSkus);

    // Check if this is a quantity token
    const qty = parseQuantity(token);
    if (qty !== null && currentSku) {
      currentQty = qty;
      rawParts.push(token);
      continue;
    }

    // Check if this is a SKU-like token
    if (isKnown || looksLikeSku(token)) {
      // Start a new group if we already have a SKU
      if (currentSku) {
        flushGroup();
      }
      currentSku = token;
      rawParts.push(token);
      continue;
    }

    // Check if this is a price-like token (possibly with attached qty)
    if (looksLikePrice(token)) {
      const attached = extractAttachedQuantity(token);
      if (attached) {
        currentPrice = attached.priceStr;
        currentQty = attached.quantity;
      } else {
        currentPrice = token;
      }
      rawParts.push(token);
      continue;
    }

    // Unknown token — try as price if we have a sku but no price
    if (currentSku && !currentPrice) {
      currentPrice = token;
      rawParts.push(token);
    } else {
      rawParts.push(token);
    }
  }

  flushGroup();
  return groups;
}
