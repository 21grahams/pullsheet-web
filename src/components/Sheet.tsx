import { Box, Drawer } from '@mui/material';
import type { ReactNode } from 'react';
import { fonts, tokens } from '../theme/tokens';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  /** Buttons pinned under a divider, e.g. Cancel + the primary action. */
  footer?: ReactNode;
}

/**
 * The bottom sheet every modal uses, matching the old app: slides up from the
 * bottom on every screen size, 600px max and centered on desktop, rounded top,
 * at most 92% of the screen tall, closes on tapping outside. The handle bar is
 * decorative (it never dragged in the old app either).
 */
export function Sheet({ open, onClose, title, subtitle, children, footer }: SheetProps) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.75)' } },
        paper: {
          sx: {
            width: '100%',
            maxWidth: 600,
            mx: 'auto',
            maxHeight: '92dvh',
            borderRadius: '20px 20px 0 0',
            border: 'none',
            backgroundColor: tokens.surface,
            px: 2.5,
            pt: 3,
            pb: 'calc(24px + env(safe-area-inset-bottom))',
          },
        },
      }}
    >
      <Box
        sx={{ width: 36, height: 4, borderRadius: 2, backgroundColor: tokens.border, mx: 'auto', mb: 2.5 }}
      />
      <Box sx={{ fontFamily: fonts.serif, fontSize: 20, color: tokens.gold, mb: subtitle ? 0.5 : 2.5 }}>
        {title}
      </Box>
      {subtitle && <Box sx={{ fontSize: 13, color: tokens.text2, mb: 2.5 }}>{subtitle}</Box>}
      {children}
      {footer && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.25,
            mt: 2.5,
            pt: 2.5,
            borderTop: `1px solid ${tokens.border}`,
          }}
        >
          {footer}
        </Box>
      )}
    </Drawer>
  );
}

/** A form field with the old app's small uppercase label above it. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ mb: 1.75 }}>
      <Box
        component="label"
        sx={{
          display: 'block',
          fontSize: 11,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: tokens.text2,
          mb: 0.75,
        }}
      >
        {label}
      </Box>
      {children}
    </Box>
  );
}
