import { Box, Button, CircularProgress } from '@mui/material';
import type { ReactNode } from 'react';
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

export function ErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <EmptyState icon="⚠️">
      <Box sx={{ color: tokens.text2, mb: 1.5 }}>
        Couldn't load this. {error instanceof Error ? error.message : ''}
      </Box>
      <Button variant="outlined" size="small" onClick={onRetry}>
        Try again
      </Button>
    </EmptyState>
  );
}
