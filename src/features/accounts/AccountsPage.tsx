import type { RetailerAccount } from '../../api/types';

import { Box } from '@mui/material';
import { useState } from 'react';

import { CardButton } from '../../components/CardActions';
import { useAccounts } from '../../hooks/queries';
import { collapseAllLabel, useCollapsibleGroups } from '../../hooks/useCollapsibleGroups';
import { tokens } from '../../theme/tokens';
import { AccountSheet } from './AccountSheet';
import { RemoveAccountDialog } from './RemoveAccountDialog';
import { RetailerAccounts } from './RetailerAccounts';

export function AccountsPage() {
  const accounts = useAccounts();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<RetailerAccount | null>(null);
  const [removing, setRemoving] = useState<RetailerAccount | null>(null);
  const retailers = [...new Set((accounts.data ?? []).map((a) => a.retailer))];
  // Starts collapsed on each launch so account details only show when you open a group.
  const groups = useCollapsibleGroups('ui:accounts', retailers, { startCollapsed: true });

  return (
    <Box sx={{ mt: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: tokens.text3,
          mb: 1.25,
        }}
      >
        <span>Retailer Accounts</span>
        {retailers.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            <CardButton onClick={groups.toggleAll}>{collapseAllLabel(groups.allCollapsed)}</CardButton>
            <CardButton variant="primary" onClick={() => setAdding(true)}>
              + Add
            </CardButton>
          </Box>
        )}
      </Box>
      <RetailerAccounts
        isCollapsed={groups.isCollapsed}
        toggle={groups.toggle}
        onAdd={() => setAdding(true)}
        onEdit={setEditing}
        onRemove={setRemoving}
      />
      <AccountSheet open={adding} editing={null} retailers={retailers} onClose={() => setAdding(false)} />
      <AccountSheet
        open={editing != null}
        editing={editing}
        retailers={retailers}
        onClose={() => setEditing(null)}
      />
      <RemoveAccountDialog account={removing} onClose={() => setRemoving(null)} />
    </Box>
  );
}
