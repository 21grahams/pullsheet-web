import { Box } from '@mui/material';
import { tokens } from '../theme/tokens';

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Box
      component="button"
      aria-label={label}
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 'calc(24px + env(safe-area-inset-bottom))',
        right: 20,
        width: 52,
        height: 52,
        borderRadius: '26px',
        backgroundColor: tokens.gold,
        color: tokens.bg,
        fontSize: 24,
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(232,168,56,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 90,
        transition: 'transform 0.15s',
        '&:active': { transform: 'scale(0.95)' },
      }}
    >
      +
    </Box>
  );
}
