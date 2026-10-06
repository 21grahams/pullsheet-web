// One hook per read. Screens use these, never the api module directly, so
// caching, refetching and (Phase 3) invalidation after saves live in one place.

import { useQuery } from '@tanstack/react-query';
import * as api from '../api';

/** Cache keys. A save invalidates the lists it touched plus `summary`. */
export const queryKeys = {
  context: ['context'] as const,
  singles: ['singles'] as const,
  sealed: ['sealed'] as const,
  accounts: ['accounts'] as const,
  completedHolds: ['completedHolds'] as const,
  summary: ['summary'] as const,
};

/** Server "today", year, quarter and current Short Hold (Denver time). */
export const useAppContext = () => useQuery({ queryKey: queryKeys.context, queryFn: api.getContext });

export const useSingles = () => useQuery({ queryKey: queryKeys.singles, queryFn: api.listSingles });

export const useSealed = () => useQuery({ queryKey: queryKeys.sealed, queryFn: api.listSealed });

export const useAccounts = () => useQuery({ queryKey: queryKeys.accounts, queryFn: api.listAccounts });

export const useCompletedHolds = () =>
  useQuery({ queryKey: queryKeys.completedHolds, queryFn: api.listCompletedHolds });

export const useSummary = () => useQuery({ queryKey: queryKeys.summary, queryFn: api.getSummary });
