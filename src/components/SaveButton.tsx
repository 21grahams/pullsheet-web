import type { ButtonProps } from '@mui/material';

import { Button, CircularProgress } from '@mui/material';

import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface SaveButtonProps extends Omit<ButtonProps, 'children'> {
  pending: boolean;
  label: string;
  pendingLabel?: string;
}

export function SaveButton({ pending, label, pendingLabel = 'Saving…', disabled, ...rest }: SaveButtonProps) {
  const online = useOnlineStatus();

  return (
    <Button
      variant="contained"
      disabled={disabled || pending || !online}
      startIcon={pending ? <CircularProgress size={16} color="inherit" /> : null}
      {...rest}
    >
      {!online ? 'Offline' : pending ? pendingLabel : label}
    </Button>
  );
}
