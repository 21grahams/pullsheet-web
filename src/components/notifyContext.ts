import { createContext, useContext } from 'react';

export type NotifyKind = 'success' | 'error' | 'info';

export const NotifyContext = createContext<((message: string, kind?: NotifyKind) => void) | null>(null);

/** Shows a short message at the bottom of the screen (the old app's toast). */
export function useNotify() {
  const notify = useContext(NotifyContext);
  if (!notify) throw new Error('useNotify must be used inside <NotifyProvider>');
  return notify;
}
