import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { FieldRow, MoneyInput, Segmented, Stepper, TextInput } from '../../components/form';
import { useNotify } from '../../components/notifyContext';
import { SaveButton } from '../../components/SaveButton';
import { Field, Sheet } from '../../components/Sheet';
import { useAddSealed, useAddSingle } from '../../hooks/mutations';
import { useSaveSession } from '../../hooks/useSaveSession';
import {
  emptyItemForm,
  marketLabel,
  toSealedInput,
  toSingleInput,
  validateItemForm,
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

export function ItemFormSheet({ kind, open, onClose, today }: Props) {
  const notify = useNotify();
  const session = useSaveSession();
  const addSingle = useAddSingle();
  const addSealed = useAddSealed();
  const [form, setForm] = useState<ItemFormValues>(() => emptyItemForm(today));
  const [showTag, setShowTag] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm(emptyItemForm(today));
      setShowTag(false);
      session.reset();
    }
  }

  const set = <K extends keyof ItemFormValues>(key: K, value: ItemFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const text = (key: keyof ItemFormValues) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(key, e.target.value as never),
  });

  const pending = addSingle.isPending || addSealed.isPending;

  function submit() {
    const problem = validateItemForm(kind, form);
    if (problem) {
      notify(problem, 'error');
      return;
    }
    const done = { onSuccess: onClose };
    if (kind === 'single') {
      const input = toSingleInput(form);
      addSingle.mutate({ requestId: session.idFor(input), input }, done);
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
      title={kind === 'single' ? 'Add Single Card' : 'Add Sealed Product'}
      footer={
        <>
          <Button variant="outlined" color="inherit" onClick={onClose} sx={{ py: 1.5, fontSize: 15 }}>
            Cancel
          </Button>
          <SaveButton
            pending={pending}
            label="Add to Collection"
            pendingLabel="Adding…"
            onClick={submit}
            sx={{ py: 1.5, fontSize: 15 }}
          />
        </>
      }
    >
      {kind === 'sealed' && (
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
            <ConditionPicker value={form.condition} onChange={(c) => set('condition', c)} />
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
