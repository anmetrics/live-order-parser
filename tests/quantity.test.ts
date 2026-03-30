import { describe, it, expect } from 'vitest';
import { parseQuantity, extractAttachedQuantity } from '../src/quantity.js';

describe('parseQuantity', () => {
  it.each([
    ['x2', 2],
    ['X3', 3],
    ['*2', 2],
    ['×2', 2],
    ['SL2', 2],
    ['sl2', 2],
    ['SL 3', 3],
    ['sl 5', 5],
    ['x10', 10],
  ])('parses "%s" → %d', (input, expected) => {
    expect(parseQuantity(input)).toBe(expected);
  });

  it.each([
    ['sku1', null],
    ['100', null],
    ['100k', null],
    ['abc', null],
    ['', null],
  ])('returns null for "%s"', (input, expected) => {
    expect(parseQuantity(input)).toBe(expected);
  });
});

describe('extractAttachedQuantity', () => {
  it.each([
    ['100k*2', { priceStr: '100k', quantity: 2 }],
    ['100kx3', { priceStr: '100k', quantity: 3 }],
    ['100X2', { priceStr: '100', quantity: 2 }],
    ['50k×4', { priceStr: '50k', quantity: 4 }],
    ['1.2m*2', { priceStr: '1.2m', quantity: 2 }],
  ])('extracts from "%s"', (input, expected) => {
    expect(extractAttachedQuantity(input)).toEqual(expected);
  });

  it.each([
    ['100k', null],
    ['sku1', null],
    ['x2', null],
  ])('returns null for "%s"', (input, expected) => {
    expect(extractAttachedQuantity(input)).toBe(expected);
  });
});
