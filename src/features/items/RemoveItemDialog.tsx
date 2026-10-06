import { useState } from 'react';
import type { SealedItem, Single } from '../../api/types';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useDeleteSealed, useDeleteSingle } from '../../hooks/mutations';
import { useSaveSession } from '../../hooks/useSaveSession';

type Target = { kind: 'single'; item: Single } | { kind: 'sealed'; item: SealedItem };

const label = (t: Target) =>
  t.kind === 'single'
    ? `${t.item.pokemon}${t.item.setName ? ` – ${t.item.setName}` : ''} (${t.item.condition})`
    : t.item.name;

export function RemoveItemDialog({ target, onClose }: { target: Target | null; onClose: () => void }) {
  const session = useSaveSession();
  const deleteSingle = useDeleteSingle();
  const deleteSealed = useDeleteSealed();
  const [shown, setShown] = useState<Target | null>(target);
  if (target && target.item.id !== shown?.item.id) {
    setShown(target);
    session.reset();
  }

  function confirm() {
    if (!target) return;
    const vars = { requestId: session.idFor({ remove: target.item.id }), id: target.item.id };
    const done = { onSuccess: onClose };
    if (target.kind === 'single') deleteSingle.mutate(vars, done);
    else deleteSealed.mutate(vars, done);
  }

  return (
    <ConfirmDialog
      open={target != null}
      title="Remove item?"
      message={shown ? `Remove "${label(shown)}" from your collection?` : ''}
      confirmLabel="Remove"
      pending={deleteSingle.isPending || deleteSealed.isPending}
      onConfirm={confirm}
      onCancel={onClose}
    />
  );
}
