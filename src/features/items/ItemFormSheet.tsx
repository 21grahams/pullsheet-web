import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { FieldRow, MoneyInput, Segmented, Stepper, TextInput } from '../../components/form';
import { SaveButton } from '../../components/SaveButton';
import { Field, Sheet } from '../../components/Sheet';
import type { SealedItem, Single } from '../../api/types';
import { useAddSealed, useAddSingle, useEditSealed, useEditSingle } from '../../hooks/mutations';
import { useSaveSession } from '../../hooks/useSaveSession';
import {
  emptyItemForm,
  formFromItem,
  marketLabel,
  toSealedInput,
  toSingleInput,
  validateItemForm,
  type ItemFormOriginal,
  type ItemFormValues,
  type ItemKind,
} from '../../lib/itemForm';
import { tokens } from '../../theme/tokens';
import { ConditionPicker } from './ConditionPicker';

interface Props {
  kind: ItemKind;
  open: boolean;
  onClose: () => void;
  today: string;
  editing?: Single | SealedItem | null;
}

function LinkButton({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        background: 'none',
        border: 'none',
        color: tokens.gold,
        fontFamily: 'inherit',
        fontSize: 13,
        p: 0,
        cursor: 'pointer',
      }}
    >
      {children}
    </Box>
  );
}

export function ItemFormSheet({ kind, open, onClose, today, editing }: Props) {
  const session = useSaveSession();
  const addSingle = useAddSingle();
  const addSealed = useAddSealed();
  const editSingle = useEditSingle();
  const editSealed = useEditSealed();
  const [form, setForm] = useState<ItemFormValues>(() => emptyItemForm(today));
  const [original, setOriginal] = useState<ItemFormOriginal | null>(null);
  const [showTag, setShowTag] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  const [openCount, setOpenCount] = useState(0);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      const prefill = editing ? formFromItem(editing, today) : null;
      setOriginal(prefill);
      setForm(prefill?.values ?? emptyItemForm(today));
      setShowTag(!!prefill?.values.extra);
      setOpenCount((n) => n + 1);
      session.reset();
    }
  }
  const isEdit = !!editing;

  const set = <K extends keyof ItemFormValues>(key: K, value: ItemFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const text = (key: keyof ItemFormValues) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(key, e.target.value as never),
  });

  const pending = addSingle.isPending || addSealed.isPending || editSingle.isPending || editSealed.isPending;

  const problem = validateItemForm(kind, form);

  function submit() {
    if (problem) return;
    const done = { onSuccess: onClose };
    const prefill = original ?? undefined;
    if (kind === 'single') {
      const input = toSingleInput(form, prefill);
      if (editing) editSingle.mutate({ requestId: session.idFor(input), id: editing.id, input }, done);
      else addSingle.mutate({ requestId: session.idFor(input), input }, done);
    } else if (editing) {
      const input = toSealedInput(form, prefill);
      editSealed.mutate({ requestId: session.idFor(input), id: editing.id, input }, done);
    } else {
      const input = toSealedInput(form);
      addSealed.mutate(
        { requestId: session.idFor({ hold: form.hold, input }), hold: form.hold, input },
        done,
      );
    }
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`${isEdit ? 'Edit' : 'Add'} ${kind === 'single' ? 'Single Card' : 'Sealed Product'}`}
      hint={problem}
      footer={
        <>
          <Button variant="outlined" color="inherit" onClick={onClose} sx={{ py: 1.5, fontSize: 15 }}>
            Cancel
          </Button>
          <SaveButton
            disabled={!!problem}
            pending={pending}
            label={isEdit ? 'Save Changes' : 'Add to Collection'}
            pendingLabel={isEdit ? 'Saving…' : 'Adding…'}
            onClick={submit}
            sx={{ py: 1.5, fontSize: 15 }}
          />
        </>
      }
    >
      {kind === 'sealed' && !isEdit && (
        <Field label="Hold Type">
          <Segmented
            value={form.hold}
            onChange={(hold) => set('hold', hold)}
            options={[
              { value: 'long', label: 'Long Hold' },
              { value: 'short', label: 'Current Short Hold' },
            ]}
          />
        </Field>
      )}

      <FieldRow columns="1fr 112px">
        {kind === 'single' ? (
          <Field label="Pokémon">
            <TextInput placeholder="e.g. Charizard ex" autoCapitalize="words" {...text('pokemon')} />
          </Field>
        ) : (
          <Field label="Product Name">
            <TextInput placeholder="e.g. Prismatic Evolutions ETB" {...text('name')} />
          </Field>
        )}
        <Field label="Qty">
          <Stepper value={form.quantity} min={1} onChange={(n) => set('quantity', n)} ariaLabel="quantity" />
        </Field>
      </FieldRow>

      {kind === 'single' && (
        <>
          <Field label="Set">
            <TextInput placeholder="e.g. Obsidian Flames" {...text('setName')} />
          </Field>
          <Field label="Condition">
            <ConditionPicker key={openCount} value={form.condition} onChange={(c) => set('condition', c)} />
          </Field>
        </>
      )}

      <FieldRow>
        <Field label="Purchase Date">
          <TextInput type="date" {...text('purchaseDate')} />
        </Field>
        <Field label={marketLabel(form.quantity)}>
          <MoneyInput {...text('market')} />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Total Cost Paid">
          <MoneyInput {...text('cost')} />
        </Field>
        <Field label="PAS Fees (Optional)">
          <Box sx={{ display: 'flex', gap: 1 }}>
            <MoneyInput {...text('fees')} style={{ flex: 1, minWidth: 0 }} />
            <Box sx={{ width: 104, flexShrink: 0 }}>
              <Stepper
                value={form.feeUnits}
                min={0}
                max={form.quantity}
                onChange={(n) => set('feeUnits', n)}
                ariaLabel="units with fee"
              />
            </Box>
          </Box>
          <Box
            sx={{
              fontSize: 9,
              color: tokens.text3,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              mt: 0.5,
              textAlign: 'right',
            }}
          >
            Units w/ fee
          </Box>
        </Field>
      </FieldRow>

      {kind === 'single' &&
        (showTag ? (
          <>
            <Field label="Tag (Optional)">
              <TextInput placeholder="e.g. PULLED" autoCapitalize="characters" {...text('extra')} />
            </Field>
            <LinkButton
              onClick={() => {
                setShowTag(false);
                set('extra', '');
              }}
            >
              − Remove tag
            </LinkButton>
          </>
        ) : (
          <LinkButton onClick={() => setShowTag(true)}>+ Add tag</LinkButton>
        ))}
    </Sheet>
  );
}
