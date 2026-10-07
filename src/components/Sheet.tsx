import type { ReactNode } from 'react';

import { Box, Button, Drawer } from '@mui/material';
import { useEffect, useState } from 'react';

import { fonts, tokens } from '../theme/tokens';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  hint?: string | null;
}

export function Sheet({ open, onClose, title, subtitle, children, footer, hint }: SheetProps) {
  // iOS scrolls the page under the sheet to make room for the keyboard and
  // never scrolls it back, so put the page back where it was on close.
  const [savedScroll, setSavedScroll] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);
  const [closeCount, setCloseCount] = useState(0);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setSavedScroll(window.scrollY);
    else setCloseCount((n) => n + 1);
  }
  const restoreScroll = () => window.scrollTo(0, savedScroll);

  // Restoring only after the slide-down shows the shifted page for a moment, so
  // also restore as closing starts, while the backdrop still covers it.
  useEffect(() => {
    if (closeCount === 0) return;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    const frame = requestAnimationFrame(() => window.scrollTo(0, savedScroll));

    return () => cancelAnimationFrame(frame);
  }, [closeCount, savedScroll]);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      disableRestoreFocus
      slotProps={{
        transition: { onExited: restoreScroll },
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
      {hint && <Box sx={{ fontSize: 12, color: tokens.text3, textAlign: 'center', mt: 2 }}>{hint}</Box>}
      {footer && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
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

export function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outlined" color="inherit" onClick={onClick} sx={{ py: 1.5, px: 2.5, fontSize: 15 }}>
      Cancel
    </Button>
  );
}
