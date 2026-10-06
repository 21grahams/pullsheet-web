import { Box } from '@mui/material';
import { tokens } from '../theme/tokens';

const isLive = (import.meta.env.VITE_SUPABASE_URL ?? '').includes('.supabase.co');

export function PracticeBanner() {
  if (isLive) return null;
  return (
    <Box
      sx={{
        backgroundColor: tokens.blue,
        color: tokens.bg,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '2px',
        textAlign: 'center',
        py: 0.5,
      }}
    >
      PRACTICE DATA — CHANGES HERE DON'T AFFECT YOUR REAL COLLECTION
    </Box>
  );
}
