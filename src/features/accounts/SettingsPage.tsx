import { Box, Button } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { CardButton } from '../../components/CardActions';
import { tokens } from '../../theme/tokens';
import { useAuth } from '../auth/authContext';
import type { RetailerAccount } from '../../api/types';
import { useAccounts } from '../../hooks/queries';
import { AccountSheet } from './AccountSheet';
import { RemoveAccountDialog } from './RemoveAccountDialog';
import { RetailerAccounts } from './RetailerAccounts';

function formatBuiltAt(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/Denver',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function Section({ label, action, children }: { label: string; action?: ReactNode; children: ReactNode }) {
  return (
    <Box sx={{ mb: 3 }}>
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
        <span>{label}</span>
        {action}
      </Box>
      {children}
    </Box>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        backgroundColor: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: `${tokens.radius}px`,
        p: 1.75,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
}

export function SettingsPage() {
  const { session, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const accounts = useAccounts();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<RetailerAccount | null>(null);
  const [removing, setRemoving] = useState<RetailerAccount | null>(null);
  const retailers = [...new Set((accounts.data ?? []).map((a) => a.retailer))];

  return (
    <Box sx={{ mt: 1 }}>
      <Section label="Account">
        <Row>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ fontSize: 14 }}>Logged in</Box>
            <Box
              sx={{
                fontSize: 12,
                color: tokens.text3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {session?.user.email}
            </Box>
          </Box>
          <Button
            variant="outlined"
            color="error"
            size="small"
            disabled={signingOut}
            onClick={async () => {
              setSigningOut(true);
              await signOut();
            }}
          >
            Log out
          </Button>
        </Row>
      </Section>

      <Section
        label="Retailer Accounts"
        action={
          <CardButton variant="primary" onClick={() => setAdding(true)}>
            + Add
          </CardButton>
        }
      >
        <RetailerAccounts onEdit={setEditing} onRemove={setRemoving} />
      </Section>

      <Section label="About">
        <Row>
          <Box>
            <Box sx={{ fontSize: 14 }}>PullSheet</Box>
            <Box sx={{ fontSize: 12, color: tokens.text3 }}>Pokémon collection portfolio tracker</Box>
            <Box sx={{ fontSize: 11, color: tokens.text3, mt: 0.75 }}>
              Version {__APP_VERSION__} · built {formatBuiltAt(__BUILT_AT__)}
            </Box>
          </Box>
        </Row>
      </Section>
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
