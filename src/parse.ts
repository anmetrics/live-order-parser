import type { ParsedOrder, ParserOptions } from './types.js';
import { tokenize } from './tokenizer.js';
import { detectCurrency } from './currency.js';
import { parsePrice } from './price.js';
import { AUTO_K_CURRENCIES } from './constants.js';

/**
 * Parse a live-order comment into structured order data.
 *
 * @example
 * parseOrderComment("sku1 100k x2")
 * // → [{ sku: "sku1", price: 100000, quantity: 2, currency: "VND", raw: "sku1 100k x2" }]
 */
export function parseOrderComment(
  comment: string,
  options: ParserOptions = {}
): ParsedOrder[] {
  const {
    defaultCurrency = 'VND',
    separators = [' '],
    knownSkus,
    autoK = true,
    thousandsSeparator = 'auto',
  } = options;

  const groups = tokenize(comment, separators, knownSkus);
  const orders: ParsedOrder[] = [];

  for (const group of groups) {
    const { currency, fromPrefix, stripped } = detectCurrency(group.priceToken);
    const resolvedCurrency = currency ?? defaultCurrency;

    const priceResult = parsePrice(stripped, thousandsSeparator);
    if (!priceResult) continue;

    let finalPrice = priceResult.value;

    // Apply auto-K: multiply by 1000 for VND when no explicit suffix and no foreign prefix
    if (
      autoK &&
      AUTO_K_CURRENCIES.has(resolvedCurrency) &&
      !priceResult.hasExplicitSuffix &&
      !fromPrefix
    ) {
      finalPrice *= 1_000;
    }

    orders.push({
      sku: group.skuToken,
      price: finalPrice,
      quantity: group.quantity,
      currency: resolvedCurrency,
      raw: group.raw,
    });
  }

  return orders;
}
