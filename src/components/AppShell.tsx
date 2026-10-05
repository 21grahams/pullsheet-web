import { Box, Tab, Tabs } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { tokens } from '../theme/tokens';
import { OfflineBanner } from './OfflineBanner';
import { TABS } from './tabs';
import { Wordmark } from './Wordmark';

/** Header + tab bar (sticky, like the old app) with the active tab's screen below. */
export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = TABS.find((t) => pathname.startsWith(t.path))?.path ?? false;

  return (
    <Box sx={{ minHeight: '100dvh' }}>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: tokens.bg,
          borderBottom: `1px solid ${tokens.border}`,
          pt: 'env(safe-area-inset-top)',
        }}
      >
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
      <Box
        component="main"
        sx={{ maxWidth: 900, mx: 'auto', p: 2, pb: 'calc(16px + env(safe-area-inset-bottom))' }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
