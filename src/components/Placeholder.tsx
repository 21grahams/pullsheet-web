import { Box, Typography } from '@mui/material';
import { tokens } from '../theme/tokens';

/** Stand-in for screens that arrive in a later phase. */
export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, color: tokens.text2 }}>
      <Typography variant="h5" sx={{ color: tokens.gold, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2">{note}</Typography>
    </Box>
  );
}
