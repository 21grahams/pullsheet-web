import { Box } from '@mui/material';

import { fonts, tokens } from '../theme/tokens';

export function Wordmark() {
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 1 }}>
      <Box component="span" sx={{ fontFamily: fonts.serif, fontSize: 26, color: tokens.gold, lineHeight: 1 }}>
        PullSheet
      </Box>
      <Box component="span" sx={{ fontSize: 13, color: tokens.text2 }}>
        by NotAStockGenius
      </Box>
    </Box>
  );
}
