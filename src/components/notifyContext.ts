import { createContext, useContext } from 'react';

export type NotifyKind = 'success' | 'error' | 'info';

export const NotifyContext = createContext<((message: string, kind?: NotifyKind) => void) | null>(null);

export function useNotify() {
  const notify = useContext(NotifyContext);
  if (!notify) throw new Error('useNotify must be used inside <NotifyProvider>');

  return notify;
}
