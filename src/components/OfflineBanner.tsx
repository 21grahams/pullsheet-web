import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { tokens } from '../theme/tokens';

function lastUpdated(times: number[]): string | null {
  const latest = Math.max(0, ...times);
  if (!latest) return null;
  return new Date(latest).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function OfflineBanner() {
  const online = useOnlineStatus();
  const queryClient = useQueryClient();
  if (online) return null;
  const updated = lastUpdated(
    queryClient
      .getQueryCache()
      .getAll()
      .map((q) => q.state.dataUpdatedAt),
  );
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
      You're offline. Showing data last updated {updated ?? 'earlier'}; saving is paused until you reconnect.
    </Box>
  );
}
