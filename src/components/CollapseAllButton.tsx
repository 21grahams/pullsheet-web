import { Box } from '@mui/material';

import { collapseAllLabel } from '../hooks/useCollapsibleGroups';
import { tokens } from '../theme/tokens';

export function CollapseAllButton({
  allCollapsed,
  onClick,
  short = false,
}: {
  allCollapsed: boolean;
  onClick: () => void;
  /** Drops "All" to save room on phones. */
  short?: boolean;
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Box
        component="button"
        onClick={onClick}
        sx={{
          backgroundColor: tokens.surface2,
          border: `1px solid ${tokens.border}`,
          borderRadius: '10px',
          px: 1.75,
          py: 1.25,
          color: tokens.text,
          fontSize: 14,
          fontFamily: 'inherit',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {short ? collapseAllLabel(allCollapsed).replace(' All', '') : collapseAllLabel(allCollapsed)}
      </Box>
    </Box>
  );
}
