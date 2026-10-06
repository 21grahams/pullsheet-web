import { describe, expect, it } from 'vitest';
import { newSaveSession, requestIdFor } from './requestId';

describe('requestIdFor', () => {
  it('repeats for the same session and payload (a retry)', () => {
    expect(requestIdFor('s1', { qty: 1, price: 60 })).toBe(requestIdFor('s1', { qty: 1, price: 60 }));
  });
  it('changes when the payload changes', () => {
    expect(requestIdFor('s1', { qty: 1, price: 60 })).not.toBe(requestIdFor('s1', { qty: 1, price: 61 }));
  });
  it('changes for a new session (a new user action)', () => {
    expect(requestIdFor('s1', { qty: 1 })).not.toBe(requestIdFor('s2', { qty: 1 }));
  });
});

describe('newSaveSession', () => {
  it('is random', () => {
    expect(newSaveSession()).not.toBe(newSaveSession());
    expect(newSaveSession()).toMatch(/^[0-9a-f]{24}$/);
  });
});
