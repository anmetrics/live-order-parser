export interface ParsedOrder {
  sku: string;
  price: number;
  quantity: number;
  currency: string;
  raw: string;
}

export interface ParserOptions {
  /** Default currency when none detected. Defaults to 'VND'. */
  defaultCurrency?: string;
  /** Separator(s) between SKU and price. Defaults to [' ']. */
  separators?: string[];
  /** Known SKU list for accurate parsing. */
  knownSkus?: string[];
  /** Auto-multiply bare numbers by 1000 for VND. Defaults to true. */
  autoK?: boolean;
  /** Thousands separator style. Defaults to 'auto'. */
  thousandsSeparator?: 'comma' | 'dot' | 'auto';
}
