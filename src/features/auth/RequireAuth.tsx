import { Box, CircularProgress } from '@mui/material';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from './authContext';

/** Shows its children only when logged in; otherwise sends you to the login screen. */
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
