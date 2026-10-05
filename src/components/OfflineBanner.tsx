import { Box } from '@mui/material';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { tokens } from '../theme/tokens';

// Phase 1: the banner itself. Phase 2 adds "last updated" once data is
// cached, and Phase 3 disables every saving action while this shows.
export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <Box
      role="status"
      sx={{
        px: 2,
        py: 1,
        fontSize: 13,
        textAlign: 'center',
        color: tokens.gold,
        backgroundColor: tokens.goldDim,
        borderBottom: `1px solid ${tokens.border}`,
      }}
    >
      You're offline. Showing the last loaded data; saving is paused until you reconnect.
    </Box>
  );
}
