import { useStickyState } from './useStickyState';

/**
 * Per-group collapse state plus a Collapse/Expand All toggle whose label stays honest:
 * once every group is collapsed it offers "Expand All", once every group is expanded
 * "Collapse All", and a mix leaves it as it was.
 */
export function useCollapsibleGroups(
  storageKey: string,
  groupKeys: readonly (string | number)[],
  { startCollapsed = false, persist = false } = {},
) {
  const [collapsed, setCollapsed] = useStickyState<Record<string, boolean>>(
    `${storageKey}-collapsed`,
    {},
    persist,
  );
  const [allCollapsed, setAllCollapsed] = useStickyState(
    `${storageKey}-all-collapsed`,
    startCollapsed,
    persist,
  );

  const isCollapsed = (key: string | number) => collapsed[key] ?? startCollapsed;

  function toggle(key: string | number) {
    const next = { ...collapsed, [key]: !isCollapsed(key) };
    setCollapsed(next);
    const states = groupKeys.map((k) => next[k] ?? startCollapsed);
    if (states.every(Boolean)) setAllCollapsed(true);
    else if (!states.some(Boolean)) setAllCollapsed(false);
  }

  function toggleAll() {
    const next = !allCollapsed;
    setAllCollapsed(next);
    setCollapsed(Object.fromEntries(groupKeys.map((k) => [k, next])));
  }

  return { isCollapsed, toggle, allCollapsed, toggleAll };
}

export const collapseAllLabel = (allCollapsed: boolean) => (allCollapsed ? '▸ Expand All' : '▾ Collapse All');
