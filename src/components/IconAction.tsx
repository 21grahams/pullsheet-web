import type { ReactNode } from 'react';

import { IconButton, Tooltip } from '@mui/material';

import { tokens } from '../theme/tokens';

const COLORS = { default: tokens.text2, green: tokens.green, danger: tokens.red };

/** A small icon button for card actions; the label shows as a tooltip and is read by screen readers. */
export function IconAction({
  label,
  icon,
  onClick,
  tone = 'default',
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  tone?: keyof typeof COLORS;
}) {
  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        onClick={onClick}
        size="small"
        sx={{
          color: COLORS[tone],
          border: `1px solid ${tokens.border}`,
          borderRadius: '8px',
          width: 36,
          height: 36,
          '& svg': { fontSize: 19 },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}
