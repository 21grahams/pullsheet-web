import { describe, expect, it } from 'vitest';
import { resolveDatabaseUrl } from './environment';

describe('resolveDatabaseUrl', () => {
  it('points a localhost database at the host that served the page', () => {
    expect(resolveDatabaseUrl('http://localhost:54321', '10.0.0.194')).toBe('http://10.0.0.194:54321');
    expect(resolveDatabaseUrl('http://localhost:54321', 'localhost')).toBe('http://localhost:54321');
  });
  it('never touches the live database', () => {
    const live = 'https://zjtiggbmkrouceaqgfdw.supabase.co';
    expect(resolveDatabaseUrl(live, '10.0.0.194')).toBe(live);
    expect(resolveDatabaseUrl(live, '21grahams.github.io')).toBe(live);
  });
});
