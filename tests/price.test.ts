import { describe, it, expect } from 'vitest';
import { parsePrice } from '../src/price.js';

describe('parsePrice', () => {
  it('parses bare integer', () => {
    expect(parsePrice('100')).toEqual({ value: 100, hasExplicitSuffix: false });
  });

  it('parses k suffix', () => {
    expect(parsePrice('100k')).toEqual({ value: 100_000, hasExplicitSuffix: true });
  });

  it('parses K suffix (uppercase)', () => {
    expect(parsePrice('100K')).toEqual({ value: 100_000, hasExplicitSuffix: true });
  });

  it('parses large k', () => {
    expect(parsePrice('1200k')).toEqual({ value: 1_200_000, hasExplicitSuffix: true });
  });

  it('parses m suffix', () => {
    expect(parsePrice('1.2m')).toEqual({ value: 1_200_000, hasExplicitSuffix: true });
  });

  it('parses M suffix (uppercase)', () => {
    expect(parsePrice('2M')).toEqual({ value: 2_000_000, hasExplicitSuffix: true });
  });

  it('handles comma thousands (auto)', () => {
    expect(parsePrice('1,200')).toEqual({ value: 1200, hasExplicitSuffix: false });
  });

  it('handles dot thousands (auto)', () => {
    expect(parsePrice('1.200')).toEqual({ value: 1200, hasExplicitSuffix: false });
  });

  it('handles comma thousands (explicit)', () => {
    expect(parsePrice('1,200', 'comma')).toEqual({ value: 1200, hasExplicitSuffix: false });
  });

  it('handles dot thousands (explicit)', () => {
    expect(parsePrice('1.200', 'dot')).toEqual({ value: 1200, hasExplicitSuffix: false });
  });

  it('handles large comma thousands', () => {
    expect(parsePrice('1,200,000')).toEqual({ value: 1200000, hasExplicitSuffix: false });
  });

  it('returns null for empty string', () => {
    expect(parsePrice('')).toBeNull();
  });

  it('returns null for non-numeric', () => {
    expect(parsePrice('abc')).toBeNull();
  });
});
