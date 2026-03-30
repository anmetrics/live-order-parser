/** Currency prefix symbols → ISO 4217 code */
export const CURRENCY_PREFIX_MAP: Record<string, string> = {
  '$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '¥': 'JPY',
  '₩': 'KRW',
  '₫': 'VND',
  '₱': 'PHP',
  '฿': 'THB',
  '₹': 'INR',
  '₺': 'TRY',
  '₴': 'UAH',
  '₸': 'KZT',
  '₡': 'CRC',
  '₵': 'GHS',
  '₦': 'NGN',
  '₲': 'PYG',
  '₭': 'LAK',
  '₮': 'MNT',
  '﷼': 'IRR',
  '៛': 'KHR',
  '₿': 'BTC',
  'zł': 'PLN',
  'Kč': 'CZK',
  'Ft': 'HUF',
  'lei': 'RON',
  'лв': 'BGN',
  'din': 'RSD',
};

/** Multi-char currency prefixes (must be checked before single-char) */
export const CURRENCY_MULTI_PREFIX: Record<string, string> = {
  'R$': 'BRL',
  'RM': 'MYR',
  'Rp': 'IDR',
  'kr': 'SEK',
  'NT$': 'TWD',
  'HK$': 'HKD',
  'S$': 'SGD',
  'A$': 'AUD',
  'NZ$': 'NZD',
  'C$': 'CAD',
};

/** Currency suffix markers → ISO 4217 code */
export const CURRENCY_SUFFIX_MAP: Record<string, string> = {
  'đ': 'VND',
  'd': 'VND',
  '₫': 'VND',
  'đồng': 'VND',
  'dong': 'VND',
  'baht': 'THB',
  'yen': 'JPY',
  'won': 'KRW',
  'euro': 'EUR',
  'eur': 'EUR',
  'usd': 'USD',
  'gbp': 'GBP',
};

/** All single-char currency symbols for regex building */
export const ALL_CURRENCY_SYMBOLS = Object.keys(CURRENCY_PREFIX_MAP);

/** Currencies that use auto-K (multiply bare numbers by 1000) */
export const AUTO_K_CURRENCIES = new Set(['VND']);
