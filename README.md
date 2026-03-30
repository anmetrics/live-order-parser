# live-order-parser

Parse order comments (Facebook Live, TikTok Live, etc.) into structured order data. Supports all world currencies, configurable separators, auto-K for VND, multi-item comments, and various price/quantity formats.

## Install

```bash
npm install live-order-parser
```

## Usage

```typescript
import { parseOrderComment } from "live-order-parser";

parseOrderComment("sku1 100k x2");
// [{ sku: 'sku1', price: 100000, quantity: 2, currency: 'VND', raw: 'sku1 100k x2' }]

parseOrderComment("sku1 $100");
// [{ sku: 'sku1', price: 100, quantity: 1, currency: 'USD', raw: 'sku1 $100' }]

parseOrderComment("sku1 100k*2 sku2 50k");
// [
//   { sku: 'sku1', price: 100000, quantity: 2, currency: 'VND', raw: 'sku1 100k*2' },
//   { sku: 'sku2', price: 50000,  quantity: 1, currency: 'VND', raw: 'sku2 50k' }
// ]
```

## Supported Formats

| Comment                | SKU        | Price      | Qty  | Notes                     |
| ---------------------- | ---------- | ---------- | ---- | ------------------------- |
| `sku1 100`             | sku1       | 100,000    | 1    | Auto-K (VND)              |
| `sku1 100k`            | sku1       | 100,000    | 1    | Explicit K                |
| `sku1 4k`              | sku1       | 4,000      | 1    | Small K                   |
| `sku1 1200k`           | sku1       | 1,200,000  | 1    | Large K                   |
| `sku1 1.2m`            | sku1       | 1,200,000  | 1    | Million                   |
| `sku1 1.3m`            | sku1       | 1,300,000  | 1    | Million decimal           |
| `sku1 100 x2`          | sku1       | 100,000    | 2    | With quantity             |
| `sku1 100k x3`         | sku1       | 100,000    | 3    | K + quantity              |
| `sku1-100`             | sku1       | 100,000    | 1    | Dash separator            |
| `sku1\|100`            | sku1       | 100,000    | 1    | Pipe separator            |
| `sku1 $100`            | sku1       | $100       | 1    | USD (no auto-K)           |
| `sku1 €50`             | sku1       | €50        | 1    | EUR                       |
| `sku1 100đ`            | sku1       | 100,000    | 1    | VND suffix                |
| `sku1 100 SL2`         | sku1       | 100,000    | 2    | Vietnamese qty keyword    |
| `sku1 1,200`           | sku1       | 1,200,000  | 1    | Comma thousands + auto-K  |
| `sku1 1.200`           | sku1       | 1,200,000  | 1    | EU dot thousands + auto-K |
| `sku1 100 sku2 200`    | sku1, sku2 | 100k, 200k | 1, 1 | Multi-item                |
| `sku1 100k*2 sku2 50k` | sku1, sku2 | 100k, 50k  | 2, 1 | Multi-item + qty          |

## Quantity Patterns

All of these are recognized as quantity = 2:

`x2`, `X2`, `*2`, `×2`, `SL2`, `sl2`, `SL 2`

Quantity can also be attached to price: `100k*2`, `100kx3`

## Options

```typescript
interface ParserOptions {
  defaultCurrency?: string; // Default: 'VND'
  separators?: string[]; // Default: [' ']
  knownSkus?: string[]; // Optional SKU whitelist
  autoK?: boolean; // Default: true
  thousandsSeparator?: "comma" | "dot" | "auto"; // Default: 'auto'
}
```

### Custom separator

```typescript
// Dash
parseOrderComment("sku1-100", { separators: ["-"] });

// Pipe
parseOrderComment("sku1|100", { separators: ["|"] });

// Multiple separators
parseOrderComment("sku1-100", { separators: [" ", "-", "|"] });
```

### Disable auto-K

```typescript
parseOrderComment("sku1 100", { autoK: false });
// [{ sku: 'sku1', price: 100, ... }]
```

### Different default currency

```typescript
parseOrderComment("sku1 100", { defaultCurrency: "USD" });
// [{ sku: 'sku1', price: 100, currency: 'USD', ... }]
```

### Known SKUs

```typescript
parseOrderComment("abc 200", { knownSkus: ["abc", "def"] });
// [{ sku: 'abc', price: 200000, ... }]
```

## Auto-K Rule

When `defaultCurrency` is `'VND'` (default) and `autoK` is `true` (default):

- Bare numbers are multiplied by 1,000: `100` → `100,000`
- Numbers with `k`/`m` suffix are NOT auto-multiplied (already explicit)
- Numbers with foreign currency prefix (`$`, `€`, etc.) are NOT auto-multiplied

## Supported Currencies

Prefix symbols: `$` USD, `€` EUR, `£` GBP, `¥` JPY, `₩` KRW, `₫` VND, `₱` PHP, `฿` THB, `₹` INR, `₺` TRY, `₴` UAH, `₸` KZT, `₡` CRC, `₵` GHS, `₦` NGN, `₲` PYG, `₭` LAK, `₮` MNT, `﷼` IRR, `៛` KHR, `₿` BTC, `zł` PLN, `Kč` CZK, `Ft` HUF, `lei` RON, `лв` BGN, `din` RSD

Multi-char prefixes: `R$` BRL, `RM` MYR, `Rp` IDR, `kr` SEK, `NT$` TWD, `HK$` HKD, `S$` SGD, `A$` AUD, `NZ$` NZD, `C$` CAD

Suffixes: `đ`/`d` VND

## License

MIT
