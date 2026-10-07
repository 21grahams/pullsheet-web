import type { ReactNode } from 'react';

import { Box, Button, CircularProgress } from '@mui/material';

import { tokens } from '../theme/tokens';

export function LoadingState() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
      <CircularProgress size={28} />
    </Box>
  );
}

export function EmptyState({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <Box sx={{ textAlign: 'center', py: 5, px: 2.5, color: tokens.text3 }}>
      <Box sx={{ fontSize: 32, mb: 1.25 }}>{icon}</Box>
      {children}
    </Box>
  );
}

function friendlyLoadError(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (/load failed|failed to fetch|network/i.test(message)) {
    return "Can't reach PullSheet. Check your connection and try again.";
  }

  return `Couldn't load this. ${message}`;
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <EmptyState icon="⚠️">
      <Box sx={{ color: tokens.text2, mb: 1.5 }}>{friendlyLoadError(error)}</Box>
      <Button variant="outlined" size="small" onClick={onRetry}>
        Try again
      </Button>
    </EmptyState>
  );
}
