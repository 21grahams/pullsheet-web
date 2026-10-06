import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { isLiveDatabase } from './environment';

const WEEK = 7 * 24 * 60 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, gcTime: WEEK },
    // Never pause and replay saves later (TanStack's default when offline).
    mutations: { networkMode: 'always', retry: false },
  },
});

export const cachePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: isLiveDatabase ? 'pullsheet-cache' : 'pullsheet-cache-practice',
});

export const persistOptions = { persister: cachePersister, maxAge: WEEK, buster: __APP_VERSION__ };
