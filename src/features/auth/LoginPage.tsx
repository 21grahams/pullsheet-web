import type { FormEvent } from 'react';

import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Navigate } from 'react-router';

import { PracticeBanner } from '../../components/PracticeBanner';
import { Wordmark } from '../../components/Wordmark';
import { useAuth } from './authContext';

export function LoginPage() {
  const { session, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const message = await signIn(email, password);
    setSubmitting(false);
    if (message) setError(message);
  }

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        pt: 'env(safe-area-inset-top)',
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', maxWidth: 380 }}>
        <Stack spacing={2.5}>
          <PracticeBanner />
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <Wordmark />
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            autoComplete="username"
            inputMode="email"
            autoCapitalize="none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting || !email || !password}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </Button>
          <Typography variant="caption" color="text.secondary" align="center">
            Pokémon collection portfolio tracker
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
