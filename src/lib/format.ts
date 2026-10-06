// The app's only formatters. Every number and date on screen goes through
// these, matching the old app character for character.

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

/** A percentage that's already ×100, signed: "+11.2%", "-0.4%". "—" if not a number. */
export function formatSignedPct(pct: number): string {
  if (Number.isNaN(pct)) return '—';
  return (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
}

/** A ratio (0.331) as an unsigned percentage: "33.1%". Used for markup and margin. */
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
