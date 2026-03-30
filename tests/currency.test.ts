import { describe, it, expect } from 'vitest';
import { detectCurrency } from '../src/currency.js';

describe('detectCurrency', () => {
  it('detects $ prefix as USD', () => {
    const result = detectCurrency('$100');
    expect(result.currency).toBe('USD');
    expect(result.fromPrefix).toBe(true);
    expect(result.stripped).toBe('100');
  });

  it('detects € prefix as EUR', () => {
    const result = detectCurrency('€50');
    expect(result.currency).toBe('EUR');
    expect(result.fromPrefix).toBe(true);
    expect(result.stripped).toBe('50');
  });

  it('detects £ prefix as GBP', () => {
    const result = detectCurrency('£30');
    expect(result.currency).toBe('GBP');
    expect(result.stripped).toBe('30');
  });

  it('detects ¥ prefix as JPY', () => {
    const result = detectCurrency('¥500');
    expect(result.currency).toBe('JPY');
    expect(result.stripped).toBe('500');
  });

  it('detects ₩ prefix as KRW', () => {
    const result = detectCurrency('₩1000');
    expect(result.currency).toBe('KRW');
    expect(result.stripped).toBe('1000');
  });

  it('detects R$ multi-char prefix as BRL', () => {
    const result = detectCurrency('R$100');
    expect(result.currency).toBe('BRL');
    expect(result.stripped).toBe('100');
  });

  it('detects RM prefix as MYR', () => {
    const result = detectCurrency('RM50');
    expect(result.currency).toBe('MYR');
    expect(result.stripped).toBe('50');
  });

  it('detects đ suffix as VND', () => {
    const result = detectCurrency('100đ');
    expect(result.currency).toBe('VND');
    expect(result.fromSuffix).toBe(true);
    expect(result.stripped).toBe('100');
  });

  it('detects d suffix as VND', () => {
    const result = detectCurrency('100d');
    expect(result.currency).toBe('VND');
    expect(result.fromSuffix).toBe(true);
    expect(result.stripped).toBe('100');
  });

  it('returns null for bare number', () => {
    const result = detectCurrency('100');
    expect(result.currency).toBeNull();
    expect(result.stripped).toBe('100');
  });

  it('returns null for number with k suffix', () => {
    const result = detectCurrency('100k');
    expect(result.currency).toBeNull();
    expect(result.stripped).toBe('100k');
  });
});
