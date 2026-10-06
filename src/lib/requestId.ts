// crypto.randomUUID only exists on HTTPS/localhost; getRandomValues also works
// on the http://<mac-ip> practice preview.
export function newSaveSession(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, '0')).join(
    '',
  );
}

function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

/**
 * Same session + same payload → same id, so a retry after a lost reply is
 * recognized as a duplicate. Changing the form gives a new id, so an edit made
 * after an error is never mistaken for the earlier attempt.
 */
export function requestIdFor(session: string, payload: unknown): string {
  return `${session}:${fnv1a(JSON.stringify(payload))}`;
}
