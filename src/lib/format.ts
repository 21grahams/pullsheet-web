/**
 * "$1,234.56". Negatives print as "$-110.00" for parity with the old app.
 * To switch to the conventional "-$110.00", change only this function.
 */
export function formatMoney(n: number | null | undefined): string {
  return (
    '$' +
    (n || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function formatSignedPct(pct: number): string {
  if (Number.isNaN(pct)) return '—';

  return (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
}

export function formatRatioPct(ratio: number): string {
  return (ratio * 100).toFixed(1) + '%';
}

/**
 * "2026-03-28" → "03/28/2026". Works on the string directly, never through a
 * Date object, so a time zone can't shift the day.
 */
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.slice(0, 10).split('-');

  return y && m && d ? `${m}/${d}/${y}` : '';
}
