import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { clearStickyMemory, useStickyState } from './useStickyState';

beforeEach(() => {
  clearStickyMemory();
  window.localStorage.clear();
});

describe('useStickyState', () => {
  it('keeps its value after the screen unmounts and comes back (tab switch)', () => {
    const first = renderHook(() => useStickyState('k', 'a'));
    act(() => first.result.current[1]('b'));
    first.unmount();
    expect(renderHook(() => useStickyState('k', 'a')).result.current[0]).toBe('b');
  });

  it('only saves to the device when asked to (survives a reload)', () => {
    const plain = renderHook(() => useStickyState('plain', 1));
    const saved = renderHook(() => useStickyState('saved', 1, true));
    act(() => plain.result.current[1](2));
    act(() => saved.result.current[1]((n) => n + 1));
    clearStickyMemory();
    expect(renderHook(() => useStickyState('plain', 1)).result.current[0]).toBe(1);
    expect(renderHook(() => useStickyState('saved', 1, true)).result.current[0]).toBe(2);
  });
});
