import type { RetailerAccount } from '../../api/types';
import type { RetailerGroup } from '../../lib/retailers';

import { Box } from '@mui/material';

import { CardButton } from '../../components/CardActions';
import { ErrorState, LoadingState } from '../../components/ListStates';
import { useAccounts } from '../../hooks/queries';
import { useStickyState } from '../../hooks/useStickyState';
import { groupAccounts } from '../../lib/retailers';
import { fonts, tokens } from '../../theme/tokens';

const detail = { fontSize: 12, color: tokens.text2, fontFamily: fonts.mono, mt: '3px' } as const;

interface CardHandlers {
  onEdit: (a: RetailerAccount) => void;
  onRemove: (a: RetailerAccount) => void;
}

function AccountCard({
  account,
  color,
  onEdit,
  onRemove,
}: { account: RetailerAccount; color: string } & CardHandlers) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: `${tokens.radius}px`,
        p: '12px 14px 12px 16px',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: color,
        },
      }}
    >
      <Box sx={{ fontSize: 14, fontWeight: 600 }}>{account.label}</Box>
      <Box sx={detail}>{account.email || '—'}</Box>
      <Box sx={detail}>
        Card •• {account.cardLast2 || '—'} · Phone •••• {account.phoneLast4 || '—'}
      </Box>
      {account.loop && <Box sx={detail}>Loop: {account.loop}</Box>}
      {account.notes && (
        <Box sx={{ ...detail, fontFamily: 'inherit', whiteSpace: 'pre-wrap', mt: '5px' }}>
          {account.notes}
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 0.75, mt: 1 }}>
        <CardButton onClick={() => onEdit(account)}>Edit</CardButton>
        <CardButton variant="danger" onClick={() => onRemove(account)}>
          Remove
        </CardButton>
      </Box>
    </Box>
  );
}

function Group({ group, ...handlers }: { group: RetailerGroup } & CardHandlers) {
  // Starts collapsed on each launch so emails and card digits only show when you open a group.
  const [collapsed, setCollapsed] = useStickyState(`ui:accounts-collapsed:${group.retailer}`, true);
  const n = group.accounts.length;

  return (
    <Box sx={{ mb: 0.5 }}>
      <Box
        onClick={() => setCollapsed((c) => !c)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          mt: 1.75,
          mb: 1,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Box
          sx={{
            fontSize: 11,
            color: tokens.text3,
            flexShrink: 0,
            transition: 'transform 0.2s',
            transform: collapsed ? 'rotate(-90deg)' : 'none',
          }}
        >
          ▼
        </Box>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: group.color, flexShrink: 0 }} />
        <Box
          sx={{
            fontSize: 11,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: tokens.text2,
            fontWeight: 600,
          }}
        >
          {group.retailer}
        </Box>
        <Box sx={{ flex: 1, height: '1px', backgroundColor: tokens.border }} />
        <Box sx={{ fontFamily: fonts.mono, fontSize: 11, color: tokens.text3, flexShrink: 0 }}>
          {n} account{n !== 1 ? 's' : ''}
        </Box>
      </Box>
      {!collapsed && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {group.accounts.map((a) => (
            <AccountCard key={a.id} account={a} color={group.color} {...handlers} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export function RetailerAccounts(handlers: CardHandlers) {
  const accounts = useAccounts();
  if (!accounts.data) {
    return accounts.isError ? (
      <ErrorState error={accounts.error} onRetry={() => accounts.refetch()} />
    ) : (
      <LoadingState />
    );
  }

  const groups = groupAccounts(accounts.data);
  if (groups.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2.5, color: tokens.text3, fontSize: 13 }}>
        No accounts yet. Tap + Add to start tracking.
      </Box>
    );
  }

  return (
    <Box>
      {groups.map((g) => (
        <Group key={g.retailer} group={g} {...handlers} />
      ))}
    </Box>
  );
}
