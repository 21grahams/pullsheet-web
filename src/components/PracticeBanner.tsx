import { Box } from '@mui/material';

import { isLiveDatabase } from '../lib/environment';
import { tokens } from '../theme/tokens';

export function PracticeBanner() {
  if (isLiveDatabase) return null;

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
