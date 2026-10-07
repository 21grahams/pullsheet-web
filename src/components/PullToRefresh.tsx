import { Box, CircularProgress } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { tokens } from '../theme/tokens';

const SHOW_AT = 30; // px pulled before the pill appears
const TRIGGER_AT = 80; // px pulled to refresh on release

type State = 'idle' | 'pulling' | 'ready' | 'refreshing';

const LABELS: Record<Exclude<State, 'idle'>, string> = {
  pulling: 'Pull to refresh',
  ready: 'Release to refresh',
  refreshing: 'Refreshing…',
};

/** iPhone home-screen apps have no built-in pull-to-refresh. `top` is where the pill sits. */
export function PullToRefresh({ top }: { top: number }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<State>('idle');
  const stateRef = useRef<State>('idle');
  const startY = useRef<number | null>(null);

  useEffect(() => {
    const set = (s: State) => {
      stateRef.current = s;
      setState(s);
    };

    const onStart = (e: TouchEvent) => {
      // Swipes inside an open sheet or dialog belong to it.
      if (e.target instanceof Element && e.target.closest('.MuiModal-root')) return;
      if (window.scrollY === 0 && stateRef.current !== 'refreshing') startY.current = e.touches[0]!.clientY;
    };
    const onMove = (e: TouchEvent) => {
      if (startY.current == null || stateRef.current === 'refreshing') return;
      const delta = e.touches[0]!.clientY - startY.current;
      if (delta <= 0 || window.scrollY > 0) return;
      if (delta > TRIGGER_AT) set('ready');
      else if (delta > SHOW_AT) set('pulling');
    };
    const onEnd = async () => {
      startY.current = null;
      if (stateRef.current === 'ready') {
        set('refreshing');
        try {
          await queryClient.refetchQueries({ type: 'active' });
        } finally {
          set('idle');
        }
      } else if (stateRef.current === 'pulling') {
        set('idle');
      }
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [queryClient]);

  const visible = state !== 'idle';

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        position: 'fixed',
        top,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? 12 : -60}px)`,
        transition: 'transform 0.2s',
        zIndex: 101,
        backgroundColor: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: '20px',
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontSize: 13,
        color: tokens.text2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
      }}
    >
      {state === 'refreshing' ? (
        <CircularProgress size={14} thickness={5} />
      ) : (
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: `2px solid ${tokens.border}`,
            borderTopColor: tokens.gold,
          }}
        />
      )}
      {state !== 'idle' && LABELS[state]}
    </Box>
  );
}
