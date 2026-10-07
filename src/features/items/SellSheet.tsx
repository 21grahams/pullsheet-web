import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { FieldRow, MoneyInput, Stepper, TextInput } from '../../components/form';
import { SaveButton } from '../../components/SaveButton';
import { Field, Sheet } from '../../components/Sheet';
import { useSellLongHoldItem, useSellSingle } from '../../hooks/mutations';
import { useSaveSession } from '../../hooks/useSaveSession';
import { formatMoney } from '../../lib/format';
import { autoProfit, partialSaleNote, validateSale } from '../../lib/sellForm';
import { tokens } from '../../theme/tokens';

export interface SellTarget {
  kind: 'single' | 'sealed';
  id: number;
  name: string;
  quantity: number;
  unitCost: number;
  unitValue: number | null;
}

const greenButtonSx = {
  py: 1.5,
  fontSize: 15,
  backgroundColor: 'rgba(52,199,123,0.12)',
  color: tokens.green,
  border: '1px solid rgba(52,199,123,0.25)',
  boxShadow: 'none',
  '&:hover': { backgroundColor: 'rgba(52,199,123,0.2)', boxShadow: 'none' },
};

export function SellSheet({ target, onClose }: { target: SellTarget | null; onClose: () => void }) {
  const session = useSaveSession();
  const sellSingle = useSellSingle();
  const sellLongHold = useSellLongHoldItem();
  const [shown, setShown] = useState<SellTarget | null>(target);
  const [quantity, setQuantity] = useState(1);
  const [soldPrice, setSoldPrice] = useState('');
  const [profit, setProfit] = useState('');

  if (target && target !== shown) {
    setShown(target);
    setQuantity(target.quantity);
    setSoldPrice('');
    setProfit('');
    session.reset();
  }

  const listName = shown?.kind === 'single' ? 'Singles' : 'Long Hold';

  function changeQuantity(n: number) {
    setQuantity(n);
    if (shown) setProfit(autoProfit(soldPrice, shown.unitCost, n));
  }

  function changePrice(text: string) {
    setSoldPrice(text);
    if (shown) setProfit(autoProfit(text, shown.unitCost, quantity));
  }

  const validation = validateSale(soldPrice, profit, quantity, shown?.quantity ?? 0);
  const problem = 'error' in validation ? validation.error : null;

  function submit() {
    if (!target) return;
    if ('error' in validation) return;
    const result = validation;
    const vars = { id: target.id, quantity, ...result };
    const mutation = target.kind === 'single' ? sellSingle : sellLongHold;
    mutation.mutate({ requestId: session.idFor(vars), ...vars }, { onSuccess: onClose });
  }

  return (
    <Sheet
      open={target != null}
      onClose={onClose}
      title="Mark as Sold"
      subtitle={
        shown && (
          <>
            {shown.name}
            {shown.unitValue != null && (
              <Box sx={{ fontSize: 12, color: tokens.text3, mt: 0.5 }}>
                Market value {formatMoney(shown.unitValue)} each · {formatMoney(shown.unitValue * quantity)}{' '}
                for {quantity}
              </Box>
            )}
          </>
        )
      }
      hint={problem}
      footer={
        <>
          <Button variant="outlined" color="inherit" onClick={onClose} sx={{ py: 1.5, fontSize: 15 }}>
            Cancel
          </Button>
          <SaveButton
            disabled={!!problem}
            pending={sellSingle.isPending || sellLongHold.isPending}
            label="Mark Sold"
            pendingLabel="Marking Sold…"
            onClick={submit}
            sx={greenButtonSx}
          />
        </>
      }
    >
      <FieldRow>
        <Field label="Qty Sold">
          <Stepper
            value={quantity}
            min={1}
            max={shown?.quantity ?? 1}
            onChange={changeQuantity}
            ariaLabel="quantity sold"
          />
        </Field>
        <Field label="Total Sold Price">
          <MoneyInput
            placeholder="0.00 (or 0 for a trade)"
            value={soldPrice}
            onChange={(e) => changePrice(e.target.value)}
          />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field label="Profit (auto-calculated)">
          <TextInput
            type="number"
            step="0.01"
            placeholder="0.00"
            autoComplete="off"
            value={profit}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setProfit(e.target.value)}
          />
        </Field>
      </FieldRow>
      {shown && (
        <Box sx={{ fontSize: 11, color: tokens.text3 }}>
          {partialSaleNote(shown.quantity, quantity, listName)}
        </Box>
      )}
    </Sheet>
  );
}
