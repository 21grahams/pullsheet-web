import { useState } from 'react';
import { MoneyInput } from '../../components/form';
import { SaveButton } from '../../components/SaveButton';
import { CancelButton, Field, Sheet } from '../../components/Sheet';
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
  const session = useSaveSession();
  const setQuarter = useSetQuarterPrice();
  const [shown, setShown] = useState<QuarterTarget | null>(target);
  const [value, setValue] = useState('');

  if (target && target !== shown) {
    setShown(target);
    setValue(target.unitValue ? toInputText(target.unitValue) : '');
    session.reset();
  }

  const unitValue = Number.parseFloat(value.replace(/[$,\s]/g, ''));
  const problem =
    !Number.isFinite(unitValue) || unitValue < 0 ? 'Enter a value (0 clears the quarter)' : null;

  function submit() {
    if (!target) return;
    if (problem) return;
    const vars = { item: target.item, quarter: target.quarter, unitValue };
    setQuarter.mutate({ requestId: session.idFor(vars), ...vars }, { onSuccess: onClose });
  }

  return (
    <Sheet
      open={target != null}
      onClose={onClose}
      title={shown ? `Update Q${shown.quarter} Market Value` : ''}
      subtitle={shown?.name}
      hint={problem}
      footer={
        <>
          <CancelButton onClick={onClose} />
          <SaveButton
            disabled={!!problem}
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
