import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { tokens } from '../theme/tokens';

type Variant = 'primary' | 'secondary' | 'green' | 'danger';

const STYLES: Record<Variant, object> = {
  primary: { backgroundColor: tokens.gold, color: '#0E0F11', border: `1px solid ${tokens.gold}` },
  secondary: { backgroundColor: tokens.surface2, color: tokens.text, border: `1px solid ${tokens.border}` },
  green: {
    backgroundColor: 'rgba(52,199,123,0.12)',
    color: tokens.green,
    border: '1px solid rgba(52,199,123,0.25)',
  },
  danger: { backgroundColor: 'transparent', color: tokens.red, border: `1px solid ${tokens.red}` },
};

export function CardButton({
  variant = 'secondary',
  onClick,
  disabled,
  children,
}: {
  variant?: Variant;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      sx={{
        ...STYLES[variant],
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '7px',
        px: 1.25,
        py: '5px',
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'inherit',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        '&:disabled': { opacity: 0.45, cursor: 'not-allowed' },
      }}
    >
      {children}
    </Box>
  );
}
