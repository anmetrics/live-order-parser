export interface PriceParseResult {
  value: number;
  hasExplicitSuffix: boolean;
}

/**
 * Parse a price string (already stripped of currency markers) into a numeric value.
 * Handles: k/m suffixes, thousands separators (comma/dot).
 */
export function parsePrice(
  raw: string,
  thousandsSeparator: 'comma' | 'dot' | 'auto' = 'auto'
): PriceParseResult | null {
  let str = raw.trim();
  if (!str) return null;

  // Detect and apply k/m suffix
  let multiplier = 1;
  let hasExplicitSuffix = false;
  const lastChar = str[str.length - 1]?.toLowerCase();

  if (lastChar === 'k') {
    multiplier = 1_000;
    hasExplicitSuffix = true;
    str = str.slice(0, -1);
  } else if (lastChar === 'm') {
    multiplier = 1_000_000;
    hasExplicitSuffix = true;
    str = str.slice(0, -1);
  }

  // Handle thousands separators
  str = normalizeThousands(str, thousandsSeparator);

  const value = parseFloat(str);
  if (isNaN(value)) return null;

  return {
    value: value * multiplier,
    hasExplicitSuffix,
  };
}

/**
 * Normalize thousands separators in a number string.
 *
 * Rules:
 * - 'comma': treat comma as thousands separator → remove commas
 * - 'dot': treat dot as thousands separator → remove dots
 * - 'auto': heuristic — if separator has exactly 3 digits after it
 *   and it's the only such separator or consistent, treat as thousands
 */
function normalizeThousands(
  str: string,
  mode: 'comma' | 'dot' | 'auto'
): string {
  if (mode === 'comma') {
    return str.replace(/,/g, '');
  }

  if (mode === 'dot') {
    return str.replace(/\./g, '');
  }

  // Auto mode
  // Pattern: digits, then one or more groups of (separator + exactly 3 digits)
  // e.g., 1,200 or 1.200 or 1,200,000

  // Check comma as thousands: 1,200 or 1,200,000
  if (/^\d{1,3}(,\d{3})+$/.test(str)) {
    return str.replace(/,/g, '');
  }

  // Check dot as thousands: 1.200 or 1.200.000
  if (/^\d{1,3}(\.\d{3})+$/.test(str)) {
    return str.replace(/\./g, '');
  }

  // Mixed: comma thousands + dot decimal (1,200.50) or dot thousands + comma decimal (1.200,50)
  // Comma thousands with dot decimal
  if (/^\d{1,3}(,\d{3})*\.\d+$/.test(str)) {
    return str.replace(/,/g, '');
  }

  // Dot thousands with comma decimal
  if (/^\d{1,3}(\.\d{3})*,\d+$/.test(str)) {
    return str.replace(/\./g, '').replace(',', '.');
  }

  return str;
}
