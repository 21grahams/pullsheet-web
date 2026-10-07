export const isLiveDatabase = (import.meta.env.VITE_SUPABASE_URL ?? '').includes('.supabase.co');

/**
 * Practice mode points at the Mac's local Supabase. A phone opens the dev
 * server by the Mac's Wi-Fi address, which changes between networks, so a
 * `localhost` database URL is swapped for whatever host served the page.
 */
export function resolveDatabaseUrl(configured: string, pageHost: string): string {
  const url = new URL(configured);
  if (url.hostname !== 'localhost' || !pageHost) return configured;
  url.hostname = pageHost;
  return url.origin;
}
