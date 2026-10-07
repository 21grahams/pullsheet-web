import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useCollapsibleGroups } from './useCollapsibleGroups';
import { clearStickyMemory } from './useStickyState';

beforeEach(() => clearStickyMemory());

describe('useCollapsibleGroups', () => {
  it('starts every group in the default state', () => {
    const { result } = renderHook(() => useCollapsibleGroups('t', ['a', 'b'], { startCollapsed: true }));
    expect(result.current.isCollapsed('a')).toBe(true);
    expect(result.current.allCollapsed).toBe(true);
  });

  it('Collapse/Expand All sets every group', () => {
    const { result } = renderHook(() => useCollapsibleGroups('t', ['a', 'b']));
    act(() => result.current.toggleAll());
    expect(result.current.isCollapsed('a') && result.current.isCollapsed('b')).toBe(true);
    expect(result.current.allCollapsed).toBe(true);
  });

  it('the label follows groups toggled by hand, and a mix leaves it alone', () => {
    const { result } = renderHook(() => useCollapsibleGroups('t', ['a', 'b'], { startCollapsed: true }));
    act(() => result.current.toggle('a'));
    expect(result.current.allCollapsed).toBe(true);
    act(() => result.current.toggle('b'));
    expect(result.current.allCollapsed).toBe(false);
  });
});
