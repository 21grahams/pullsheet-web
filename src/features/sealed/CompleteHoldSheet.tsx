import { Box } from '@mui/material';
import { useState } from 'react';

import { greenButtonSx } from '../../components/buttonStyles';
import { FieldRow, MoneyInput, ProfitDisplay } from '../../components/form';
import { SaveButton } from '../../components/SaveButton';
import { CancelButton, Field, Sheet } from '../../components/Sheet';
import { useCompleteShortHold } from '../../hooks/mutations';
import { useSaveSession } from '../../hooks/useSaveSession';
import { formatMoney } from '../../lib/format';
import { profitFor, validateHoldSale } from '../../lib/sellForm';
import { tokens } from '../../theme/tokens';

export interface CompleteTarget {
  holdName: string;
  spent: number;
}

export function CompleteHoldSheet({
  target,
  onClose,
}: {
  target: CompleteTarget | null;
  onClose: () => void;
}) {
  const session = useSaveSession();
  const complete = useCompleteShortHold();
  const [shown, setShown] = useState<CompleteTarget | null>(target);
  const [soldPrice, setSoldPrice] = useState('');

  if (target && target !== shown) {
    setShown(target);
    setSoldPrice('');
    session.reset();
  }

  const profit = profitFor(soldPrice, shown?.spent ?? 0);
  const validation = validateHoldSale(soldPrice, shown?.spent ?? 0);
  const problem = 'error' in validation ? validation.error : null;

  function submit() {
    if (!target || 'error' in validation) return;
    const vars = { holdName: target.holdName, ...validation };
    complete.mutate({ requestId: session.idFor(vars), ...vars }, { onSuccess: onClose });
  }

  return (
    <Sheet
      open={target != null}
      onClose={onClose}
      title="Complete Short Hold"
      subtitle={shown && `Completing ${shown.holdName} · Total spent: ${formatMoney(shown.spent)}`}
      hint={problem}
      footer={
        <>
          <CancelButton onClick={onClose} />
          <SaveButton
            disabled={!!problem}
            pending={complete.isPending}
            label="Complete & Start Next Hold"
            pendingLabel="Completing…"
            onClick={submit}
            sx={greenButtonSx}
          />
        </>
      }
    >
      <FieldRow>
        <Field label="Sold Price (total)">
          <MoneyInput placeholder="0.00" value={soldPrice} onChange={(e) => setSoldPrice(e.target.value)} />
        </Field>
        <Field label="Profit">
          <ProfitDisplay profit={profit} />
        </Field>
      </FieldRow>
      <Box sx={{ fontSize: 11, color: tokens.text3 }}>
        This will close the current short hold, record your sale summary, and open a new short hold period
        automatically.
      </Box>
    </Sheet>
  );
}
