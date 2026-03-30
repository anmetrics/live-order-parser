import {
  CURRENCY_PREFIX_MAP,
  CURRENCY_MULTI_PREFIX,
  CURRENCY_SUFFIX_MAP,
} from './constants.js';

export interface CurrencyDetection {
  currency: string | null;
  /** Whether currency was detected from a prefix symbol */
  fromPrefix: boolean;
  /** Whether currency was detected from a suffix */
  fromSuffix: boolean;
  /** The price string with currency markers stripped */
  stripped: string;
}

/**
 * Detect currency from a price token and strip currency markers.
 */
export function detectCurrency(token: string): CurrencyDetection {
  const trimmed = token.trim();

  // Check multi-char prefixes first (R$, RM, Rp, kr, NT$, HK$, S$, A$, NZ$, C$)
  for (const [prefix, code] of Object.entries(CURRENCY_MULTI_PREFIX)) {
    if (trimmed.startsWith(prefix)) {
      return {
        currency: code,
        fromPrefix: true,
        fromSuffix: false,
        stripped: trimmed.slice(prefix.length),
      };
    }
  }

  // Check single-char prefixes
  const firstChar = trimmed[0];
  if (firstChar && CURRENCY_PREFIX_MAP[firstChar]) {
    return {
      currency: CURRENCY_PREFIX_MAP[firstChar],
      fromPrefix: true,
      fromSuffix: false,
      stripped: trimmed.slice(1),
    };
  }

  // Check suffixes (longest match first)
  const lowerTrimmed = trimmed.toLowerCase();
  const suffixEntries = Object.entries(CURRENCY_SUFFIX_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [suffix, code] of suffixEntries) {
    if (lowerTrimmed.endsWith(suffix)) {
      const stripped = trimmed.slice(0, trimmed.length - suffix.length);
      // Make sure we actually stripped something meaningful and left a number-like string
      if (stripped.length > 0 && /\d/.test(stripped)) {
        return {
          currency: code,
          fromPrefix: false,
          fromSuffix: true,
          stripped,
        };
      }
    }
  }

  return {
    currency: null,
    fromPrefix: false,
    fromSuffix: false,
    stripped: trimmed,
  };
}
