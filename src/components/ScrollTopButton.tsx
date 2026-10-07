import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { tokens } from '../theme/tokens';

export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 300);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box
      component="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      sx={{
        position: 'fixed',
        left: 20,
        bottom: 'calc(30px + var(--bottom-inset, env(safe-area-inset-bottom)))',
        width: 40,
        height: 40,
        borderRadius: '20px',
        backgroundColor: tokens.surface2,
        border: `1px solid ${tokens.border}`,
        color: tokens.text2,
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
        zIndex: 89,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.2s, transform 0.2s',
        '&:active': { transform: 'scale(0.9)' },
      }}
    >
      ▲
    </Box>
  );
}
