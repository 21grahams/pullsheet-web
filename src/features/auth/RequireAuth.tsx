import type { ReactNode } from 'react';

import { Box, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router';

import { useAuth } from './authContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
