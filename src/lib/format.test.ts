import { describe, expect, it } from 'vitest';
import { formatDate, formatMoney, formatRatioPct, formatSignedPct } from './format';

describe('formatMoney', () => {
  it('matches the old app', () => {
    expect(formatMoney(3218.96)).toBe('$3,218.96');
    expect(formatMoney(88.02)).toBe('$88.02');
    expect(formatMoney(5)).toBe('$5.00');
    expect(formatMoney(70.416)).toBe('$70.42'); // rounds to cents
  });
  it('prints negatives as $-x.xx (old-app parity)', () => {
    expect(formatMoney(-0.37)).toBe('$-0.37');
    expect(formatMoney(-1419.45)).toBe('$-1,419.45');
  });
  it('treats missing values as $0.00', () => {
    expect(formatMoney(0)).toBe('$0.00');
    expect(formatMoney(null)).toBe('$0.00');
    expect(formatMoney(undefined)).toBe('$0.00');
  });
});

describe('formatSignedPct', () => {
  it('signs and rounds to one decimal', () => {
    expect(formatSignedPct(11.2)).toBe('+11.2%');
    expect(formatSignedPct(-0.418)).toBe('-0.4%');
    expect(formatSignedPct(0)).toBe('+0.0%');
    expect(formatSignedPct(Number.NaN)).toBe('—');
  });
});

describe('formatRatioPct', () => {
  it('shows a ratio as an unsigned percentage', () => {
    expect(formatRatioPct(0.331)).toBe('33.1%');
    expect(formatRatioPct(-0.0962)).toBe('-9.6%');
  });
});

describe('formatDate', () => {
  it('reformats without any time-zone shift', () => {
    expect(formatDate('2026-03-28')).toBe('03/28/2026');
    expect(formatDate('2026-01-01')).toBe('01/01/2026');
  });
  it('is blank for missing dates', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate('')).toBe('');
  });
});
