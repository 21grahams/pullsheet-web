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
  const [attempted, setAttempted] = useState(false);

  if (target && target !== shown) {
    setShown(target);
    setSoldPrice('');
    setAttempted(false);
    session.reset();
  }

  const profit = profitFor(soldPrice, shown?.spent ?? 0);
  const validation = validateHoldSale(soldPrice, shown?.spent ?? 0);
  const errors = 'errors' in validation ? validation.errors : {};
  const shownErrors = attempted ? errors : {};

  function submit() {
    if (!target) return;
    if ('errors' in validation) {
      setAttempted(true);

      return;
    }
    const vars = { holdName: target.holdName, ...validation };
    complete.mutate({ requestId: session.idFor(vars), ...vars }, { onSuccess: onClose });
  }

  return (
    <Sheet
      open={target != null}
      onClose={onClose}
      title="Complete Short Hold"
      subtitle={shown && `Completing ${shown.holdName} · Total spent: ${formatMoney(shown.spent)}`}
      footer={
        <>
          <CancelButton onClick={onClose} />
          <SaveButton
            invalid={'errors' in validation}
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
        <Field label="Sold Price (total)" error={shownErrors.soldPrice}>
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
