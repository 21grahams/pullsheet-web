import type { ButtonProps } from '@mui/material';

import { Button, CircularProgress } from '@mui/material';

import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface SaveButtonProps extends Omit<ButtonProps, 'children'> {
  pending: boolean;
  label: string;
  pendingLabel?: string;
  /** Looks disabled but stays tappable, so a tap can reveal what's missing. */
  invalid?: boolean;
}

export function SaveButton({
  pending,
  label,
  pendingLabel = 'Saving…',
  disabled,
  invalid,
  sx,
  ...rest
}: SaveButtonProps) {
  const online = useOnlineStatus();

  return (
    <Button
      variant="contained"
      disabled={disabled || pending || !online}
      startIcon={pending ? <CircularProgress size={16} color="inherit" /> : null}
      className={invalid ? 'Mui-disabled' : undefined}
      aria-disabled={invalid || undefined}
      sx={[
        !!invalid && { '&.Mui-disabled': { pointerEvents: 'auto', cursor: 'not-allowed' } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {!online ? 'Offline' : pending ? pendingLabel : label}
    </Button>
  );
}
