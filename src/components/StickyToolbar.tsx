import type { ReactNode } from 'react';

import { Box } from '@mui/material';

import { tokens } from '../theme/tokens';

/** A row of list controls that sticks just under the header while scrolling. */
export function StickyToolbar({
  children,
  justify = 'flex-start',
}: {
  children: ReactNode;
  justify?: string;
}) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 'var(--header-height, 0px)',
        zIndex: 50,
        backgroundColor: tokens.bg,
        mx: -2,
        px: 2,
        py: 1,
        mt: -1,
        mb: 0.75,
        display: 'flex',
        justifyContent: justify,
        gap: 1,
      }}
    >
      {children}
    </Box>
  );
}
