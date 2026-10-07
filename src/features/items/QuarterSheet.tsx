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
  unitValue: number | null;
}

const toInputText = (n: number) => String(Math.round(n * 100) / 100);

export function QuarterSheet({ target, onClose }: { target: QuarterTarget | null; onClose: () => void }) {
  const session = useSaveSession();
  const setQuarter = useSetQuarterPrice();
  const [shown, setShown] = useState<QuarterTarget | null>(target);
  const [value, setValue] = useState('');
  const [initialText, setInitialText] = useState('');

  if (target && target !== shown) {
    setShown(target);
    const start = target.unitValue ? toInputText(target.unitValue) : '';
    setValue(start);
    setInitialText(start);
    session.reset();
  }

  const unitValue = Number.parseFloat(value.replace(/[$,\s]/g, ''));
  const problem =
    !Number.isFinite(unitValue) || unitValue < 0 ? 'Enter a value (0 clears the quarter)' : null;

  const unchanged = initialText !== '' && value.trim() === initialText;

  function submit() {
    if (!target) return;
    if (problem || unchanged) return;
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
            disabled={!!problem || unchanged}
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
