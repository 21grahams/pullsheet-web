import type { RetailerAccount } from '../../api/types';
import type { AccountFormValues } from '../../lib/accountForm';

import { Box } from '@mui/material';
import { useId, useState } from 'react';

import { FieldRow, Segmented, TextArea, TextInput } from '../../components/form';
import { SaveButton } from '../../components/SaveButton';
import { CancelButton, Field, Sheet } from '../../components/Sheet';
import { useAddAccount, useEditAccount } from '../../hooks/mutations';
import { useSaveSession } from '../../hooks/useSaveSession';
import {
  emptyAccountForm,
  formFromAccount,
  toAccountInput,
  validateAccountForm,
} from '../../lib/accountForm';
import { tokens } from '../../theme/tokens';

interface Props {
  open: boolean;
  editing: RetailerAccount | null;
  retailers: string[];
  onClose: () => void;
}

export function AccountSheet({ open, editing, retailers, onClose }: Props) {
  const session = useSaveSession();
  const add = useAddAccount();
  const edit = useEditAccount();
  const listId = useId();
  const [form, setForm] = useState<AccountFormValues>(emptyAccountForm);
  const [initial, setInitial] = useState<AccountFormValues | null>(null);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      const start = editing ? formFromAccount(editing) : emptyAccountForm();
      setForm(start);
      setInitial(editing ? start : null);
      session.reset();
    }
  }
  const isEdit = !!editing;

  const text = (key: Exclude<keyof AccountFormValues, 'loop'>) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => e.target.select(),
  });

  const problem = validateAccountForm(form);
  const unchanged = initial != null && JSON.stringify(form) === JSON.stringify(initial);

  function submit() {
    if (problem || unchanged) return;
    const input = toAccountInput(form);
    const done = { onSuccess: onClose };
    if (editing) edit.mutate({ requestId: session.idFor(input), id: editing.id, input }, done);
    else {
      const retailer = form.retailer.trim();
      add.mutate({ requestId: session.idFor({ retailer, input }), retailer, input }, done);
    }
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Account' : 'Add Account'}
      hint={problem}
      footer={
        <>
          <CancelButton onClick={onClose} />
          <SaveButton
            disabled={!!problem || unchanged}
            pending={add.isPending || edit.isPending}
            label={isEdit ? 'Save Changes' : 'Add Account'}
            pendingLabel={isEdit ? 'Saving…' : 'Adding…'}
            onClick={submit}
            sx={{ py: 1.5, fontSize: 15 }}
          />
        </>
      }
    >
      <Field label="Retailer">
        <TextInput placeholder="e.g. Walmart" list={listId} disabled={isEdit} {...text('retailer')} />
        <datalist id={listId}>
          {retailers.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
        {isEdit && (
          <Box sx={{ fontSize: 11, color: tokens.text3, mt: 0.75 }}>
            To move an account to a different retailer, remove it and re-add it.
          </Box>
        )}
      </Field>
      <Field label="Account Label">
        <TextInput placeholder="e.g. Account One" {...text('label')} />
      </Field>
      <Field label="Email">
        <TextInput type="email" placeholder="you@example.com" autoCapitalize="none" {...text('email')} />
      </Field>
      <FieldRow>
        <Field label="Card (Last 2)">
          <TextInput maxLength={2} inputMode="numeric" placeholder="34" {...text('cardLast2')} />
        </Field>
        <Field label="Phone (Last 4)">
          <TextInput maxLength={4} inputMode="numeric" placeholder="5678" {...text('phoneLast4')} />
        </Field>
      </FieldRow>
      <Field label="Loop">
        <Segmented
          value={form.loop}
          onChange={(loop) => setForm((f) => ({ ...f, loop }))}
          options={[
            { value: 'No', label: 'No' },
            { value: 'Yes', label: 'Yes' },
          ]}
        />
      </Field>
      <Field label="Notes">
        <TextArea rows={3} {...text('notes')} />
      </Field>
    </Sheet>
  );
}
