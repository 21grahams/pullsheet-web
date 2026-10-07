import type { RetailerAccount } from '../../api/types';

import { useState } from 'react';

import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useDeleteAccount } from '../../hooks/mutations';
import { useSaveSession } from '../../hooks/useSaveSession';

export function RemoveAccountDialog({
  account,
  onClose,
}: {
  account: RetailerAccount | null;
  onClose: () => void;
}) {
  const session = useSaveSession();
  const remove = useDeleteAccount();
  const [shown, setShown] = useState<RetailerAccount | null>(account);
  if (account && account.id !== shown?.id) {
    setShown(account);
    session.reset();
  }

  function confirm() {
    if (!account) return;
    remove.mutate(
      { requestId: session.idFor({ remove: account.id }), id: account.id },
      { onSuccess: onClose },
    );
  }

  return (
    <ConfirmDialog
      open={account != null}
      title="Remove account?"
      message={shown ? `Remove "${shown.label}" from ${shown.retailer}?` : ''}
      confirmLabel="Remove"
      pending={remove.isPending}
      onConfirm={confirm}
      onCancel={onClose}
    />
  );
}
