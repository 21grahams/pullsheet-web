import { Button } from '@mui/material';
import { useState } from 'react';
import { MoneyInput } from '../../components/form';
import { useNotify } from '../../components/notifyContext';
import { SaveButton } from '../../components/SaveButton';
import { Field, Sheet } from '../../components/Sheet';
import { useSetQuarterPrice } from '../../hooks/mutations';
import { useSaveSession } from '../../hooks/useSaveSession';
import { marketLabel } from '../../lib/itemForm';

export interface QuarterTarget {
  item: { singleId: number } | { sealedItemId: number };
  name: string;
  quarter: 1 | 2 | 3 | 4;
  quantity: number;
  /** That quarter's current per-unit value, if any. */
  unitValue: number | null;
}

const toInputText = (n: number) => String(Math.round(n * 100) / 100);

export function QuarterSheet({ target, onClose }: { target: QuarterTarget | null; onClose: () => void }) {
  const notify = useNotify();
  const session = useSaveSession();
  const setQuarter = useSetQuarterPrice();
  const [shown, setShown] = useState<QuarterTarget | null>(target);
  const [value, setValue] = useState('');

  if (target && target !== shown) {
    setShown(target);
    setValue(target.unitValue ? toInputText(target.unitValue) : '');
    session.reset();
  }

  function submit() {
    if (!target) return;
    const unitValue = Number.parseFloat(value.replace(/[$,\s]/g, ''));
    if (!Number.isFinite(unitValue) || unitValue < 0) {
      notify('Invalid value', 'error');
      return;
    }
    const vars = { item: target.item, quarter: target.quarter, unitValue };
    setQuarter.mutate({ requestId: session.idFor(vars), ...vars }, { onSuccess: onClose });
  }

  return (
    <Sheet
      open={target != null}
      onClose={onClose}
      title={shown ? `Update Q${shown.quarter} Market Value` : ''}
      subtitle={shown?.name}
      footer={
        <>
          <Button variant="outlined" color="inherit" onClick={onClose} sx={{ py: 1.5, fontSize: 15 }}>
            Cancel
          </Button>
          <SaveButton
            pending={setQuarter.isPending}
            label="Save"
            onClick={submit}
            sx={{ py: 1.5, fontSize: 15 }}
          />
        </>
      }
    >
      <Field label={marketLabel(shown?.quantity ?? 1)}>
        <MoneyInput value={value} onChange={(e) => setValue(e.target.value)} />
      </Field>
    </Sheet>
  );
}
