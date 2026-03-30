import { describe, it, expect } from 'vitest';
import { parseOrderComment } from '../src/parse.js';

describe('parseOrderComment — all scenarios', () => {
  it('basic: "sku1 100" → 100,000₫', () => {
    const result = parseOrderComment('sku1 100');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100_000,
      quantity: 1,
      currency: 'VND',
    });
  });

  it('explicit K: "sku1 100k" → 100,000₫', () => {
    const result = parseOrderComment('sku1 100k');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100_000,
      quantity: 1,
      currency: 'VND',
    });
  });

  it('small K: "sku1 4k" → 4,000₫', () => {
    const result = parseOrderComment('sku1 4k');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 4_000,
      quantity: 1,
      currency: 'VND',
    });
  });

  it('large K: "sku1 1200k" → 1,200,000₫', () => {
    const result = parseOrderComment('sku1 1200k');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 1_200_000,
      quantity: 1,
    });
  });

  it('million: "sku1 1.2m" → 1,200,000₫', () => {
    const result = parseOrderComment('sku1 1.2m');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 1_200_000,
      quantity: 1,
    });
  });

  it('million decimal: "sku1 1.3m" → 1,300,000₫', () => {
    const result = parseOrderComment('sku1 1.3m');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 1_300_000,
      quantity: 1,
      currency: 'VND',
    });
  });

  it('with qty: "sku1 100 x2" → 100,000₫ × 2', () => {
    const result = parseOrderComment('sku1 100 x2');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100_000,
      quantity: 2,
    });
  });

  it('K + qty: "sku1 100k x3" → 100,000₫ × 3', () => {
    const result = parseOrderComment('sku1 100k x3');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100_000,
      quantity: 3,
    });
  });

  it('dash separator: "sku1-100" with separator ["-"]', () => {
    const result = parseOrderComment('sku1-100', { separators: ['-'] });
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100_000,
      quantity: 1,
    });
  });

  it('pipe separator: "sku1|100" with separator ["|"]', () => {
    const result = parseOrderComment('sku1|100', { separators: ['|'] });
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100_000,
      quantity: 1,
    });
  });

  it('USD — no auto-K: "sku1 $100" → $100 exact', () => {
    const result = parseOrderComment('sku1 $100');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100,
      quantity: 1,
      currency: 'USD',
    });
  });

  it('EUR: "sku1 €50" → €50 exact', () => {
    const result = parseOrderComment('sku1 €50');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 50,
      quantity: 1,
      currency: 'EUR',
    });
  });

  it('VN suffix đ: "sku1 100đ" → 100,000₫', () => {
    const result = parseOrderComment('sku1 100đ');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100_000,
      quantity: 1,
      currency: 'VND',
    });
  });

  it('Vietnamese qty keyword: "sku1 100 SL2" → 100,000₫ × 2', () => {
    const result = parseOrderComment('sku1 100 SL2');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100_000,
      quantity: 2,
    });
  });

  it('comma thousands: "sku1 1,200" → 1200 (auto-K → 1,200,000)', () => {
    const result = parseOrderComment('sku1 1,200');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 1_200_000,
      quantity: 1,
    });
  });

  it('EU dot thousands: "sku1 1.200" → 1200 (auto-K → 1,200,000)', () => {
    const result = parseOrderComment('sku1 1.200');
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 1_200_000,
      quantity: 1,
    });
  });

  it('multi-item: "sku1 100 sku2 200"', () => {
    const result = parseOrderComment('sku1 100 sku2 200');
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100_000,
    });
    expect(result[1]).toMatchObject({
      sku: 'sku2',
      price: 200_000,
    });
  });

  it('multi-item + qty: "sku1 100k*2 sku2 50k"', () => {
    const result = parseOrderComment('sku1 100k*2 sku2 50k');
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100_000,
      quantity: 2,
    });
    expect(result[1]).toMatchObject({
      sku: 'sku2',
      price: 50_000,
      quantity: 1,
    });
  });
});

describe('parseOrderComment — options', () => {
  it('autoK: false disables auto multiplication', () => {
    const result = parseOrderComment('sku1 100', { autoK: false });
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100,
    });
  });

  it('defaultCurrency: USD disables auto-K', () => {
    const result = parseOrderComment('sku1 100', { defaultCurrency: 'USD' });
    expect(result[0]).toMatchObject({
      sku: 'sku1',
      price: 100,
      currency: 'USD',
    });
  });

  it('knownSkus helps parsing', () => {
    const result = parseOrderComment('abc 200', { knownSkus: ['abc'] });
    expect(result[0]).toMatchObject({
      sku: 'abc',
      price: 200_000,
    });
  });

  it('empty comment returns empty array', () => {
    const result = parseOrderComment('');
    expect(result).toHaveLength(0);
  });

  it('whitespace-only returns empty array', () => {
    const result = parseOrderComment('   ');
    expect(result).toHaveLength(0);
  });
});

describe('parseOrderComment — various currencies', () => {
  it.each([
    ['sku1 £30', 'GBP', 30],
    ['sku1 ¥500', 'JPY', 500],
    ['sku1 ₩1000', 'KRW', 1000],
    ['sku1 ₹200', 'INR', 200],
    ['sku1 ₱100', 'PHP', 100],
    ['sku1 ฿50', 'THB', 50],
  ])('parses "%s" → %s %d', (comment, currency, price) => {
    const result = parseOrderComment(comment);
    expect(result[0]).toMatchObject({ currency, price });
  });
});
