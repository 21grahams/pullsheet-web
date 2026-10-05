import { Box, Button, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { tokens } from '../../theme/tokens';
import { useAuth } from '../auth/authContext';

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        fontSize: 12,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: tokens.text2,
        mb: 1,
        mt: 3,
      }}
    >
      {children}
    </Typography>
  );
}

// Replaces the old "Google Sheets connection" box. Retailer Accounts
// arrive in Phase 2.
export function SettingsPage() {
  const { session, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <Box>
      <SectionLabel>Account</SectionLabel>
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600 }}>Logged in</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {session?.user.email}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          disabled={signingOut}
          onClick={async () => {
            setSigningOut(true);
            await signOut();
          }}
        >
          Log out
        </Button>
      </Paper>

      <SectionLabel>About</SectionLabel>
      <Paper sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 600 }}>PullSheet</Typography>
        <Typography variant="body2" color="text.secondary">
          Pokémon collection portfolio tracker
        </Typography>
      </Paper>
    </Box>
  );
}
