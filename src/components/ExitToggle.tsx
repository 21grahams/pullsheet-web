import { Box } from '@mui/material';

import { tokens } from '../theme/tokens';

/** Shows or hides every card's "At 80%" row; gold while on. */
export function ExitToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      aria-pressed={on}
      aria-label="Show 80% exit values"
      onClick={onToggle}
      sx={{
        backgroundColor: tokens.surface2,
        border: `1px solid ${on ? tokens.gold : tokens.border}`,
        color: on ? tokens.gold : tokens.text,
        borderRadius: '10px',
        px: 1.5,
        py: 1.25,
        fontSize: 14,
        fontFamily: 'inherit',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      80%
    </Box>
  );
}
