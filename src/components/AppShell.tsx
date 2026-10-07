import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { tokens } from '../theme/tokens';
import { OfflineBanner } from './OfflineBanner';
import { PracticeBanner } from './PracticeBanner';
import { PullToRefresh } from './PullToRefresh';
import { ScrollTopButton } from './ScrollTopButton';
import { TABS } from './tabs';
import { Wordmark } from './Wordmark';

export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = TABS.find((t) => pathname.startsWith(t.path))?.path ?? false;

  const scrollByTab = useRef<Record<string, number>>({});
  const tabRef = useRef(pathname);
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const onScroll = () => {
      scrollByTab.current[tabRef.current] = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useLayoutEffect(() => {
    if (tabRef.current === pathname) return;
    tabRef.current = pathname;
    window.scrollTo(0, scrollByTab.current[pathname] ?? 0);
  }, [pathname]);

  // The header is fixed rather than sticky: iOS Safari skips painting a sticky
  // header for a frame after the scroll jump when switching tabs. Its height
  // varies (notch, offline banner), so measure it for the spacer and the
  // pull-to-refresh pill, before the first paint to avoid a jump.
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    setHeaderHeight(el.offsetHeight);
    const observer = new ResizeObserver(() => setHeaderHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={{ minHeight: '100dvh' }}>
      <Box
        component="header"
        ref={headerRef}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: tokens.bg,
          borderBottom: `1px solid ${tokens.border}`,
          pt: 'env(safe-area-inset-top)',
        }}
      >
        <PracticeBanner />
        <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
          <Wordmark />
        </Box>
        <Tabs
          value={current}
          onChange={(_, path: string) => navigate(path)}
          variant="fullWidth"
          sx={{
            minHeight: 44,
            '& .MuiTab-root': { minHeight: 44, color: tokens.text2, fontSize: 15 },
            '& .MuiTab-root.Mui-selected': { color: tokens.gold },
          }}
        >
          {TABS.map((t) => (
            <Tab key={t.path} value={t.path} label={t.label} />
          ))}
        </Tabs>
        <OfflineBanner />
      </Box>
      <Box sx={{ height: headerHeight }} />
      <Box
        component="main"
        sx={{ maxWidth: 900, mx: 'auto', p: 2, pb: 'calc(16px + env(safe-area-inset-bottom))' }}
      >
        <Outlet />
      </Box>
      <PullToRefresh top={headerHeight} />
      <ScrollTopButton />
    </Box>
  );
}
