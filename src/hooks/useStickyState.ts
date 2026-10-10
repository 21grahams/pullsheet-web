import { useCallback, useState } from 'react';

const memory = new Map<string, unknown>();

function readSaved<T>(key: string): T | undefined {
  try {
    const raw = window.localStorage.getItem(key);

    return raw == null ? undefined : (JSON.parse(raw) as T);
  } catch {
    return undefined;
  }
}

/**
 * useState that survives switching tabs (the screen unmounts), and with `persist`
 * also survives reloads by saving to this device's storage.
 */
export function useStickyState<T>(key: string, initial: T, persist = false) {
  const [value, setValue] = useState<T>(() => {
    if (memory.has(key)) return memory.get(key) as T;

    return (persist ? readSaved<T>(key) : undefined) ?? initial;
  });

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
        memory.set(key, v);
        if (persist) {
          try {
            window.localStorage.setItem(key, JSON.stringify(v));
          } catch {
            // Storage can be full or blocked (private browsing); memory still works.
          }
        }

        return v;
      });
    },
    [key, persist],
  );

  return [value, set] as const;
}

export function clearStickyMemory() {
  memory.clear();
}

/**
 * The percentage of market value Singles and Sealed show (100 = real market value).
 * Shared by both lists; not saved, so the app always opens at 100%.
 */
export const useValuePercent = () => useStickyState('ui:value-pct', 100);
