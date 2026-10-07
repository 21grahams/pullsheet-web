import type { ReactNode } from 'react';
import type { NotifyKind } from './notifyContext';

import { Snackbar } from '@mui/material';
import { useCallback, useState } from 'react';

import { tokens } from '../theme/tokens';
import { NotifyContext } from './notifyContext';

const COLORS: Record<NotifyKind, string> = { success: tokens.green, error: tokens.red, info: tokens.text };

export function NotifyProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; kind: NotifyKind; key: number } | null>(null);

  const notify = useCallback((message: string, kind: NotifyKind = 'info') => {
    setToast({ message, kind, key: Date.now() });
  }, []);

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      <Snackbar
        key={toast?.key}
        open={!!toast}
        autoHideDuration={toast?.kind === 'error' ? 5000 : 2500}
        onClose={(_, reason) => reason !== 'clickaway' && setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: 'calc(80px + var(--bottom-inset, env(safe-area-inset-bottom))) !important' }}
        message={toast?.message}
        slotProps={{
          content: {
            sx: {
              backgroundColor: tokens.surface2,
              border: `1px solid ${tokens.border}`,
              color: toast ? COLORS[toast.kind] : tokens.text,
              fontSize: 13,
              minWidth: 0,
              justifyContent: 'center',
            },
          },
        }}
      />
    </NotifyContext.Provider>
  );
}
