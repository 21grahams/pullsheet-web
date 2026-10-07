import { Button } from '@mui/material';
import { useState, type ChangeEvent } from 'react';
import { Field, Sheet } from '../../components/Sheet';
import { emptyFilters, type SinglesFilters } from '../../lib/singlesFilter';
import { tokens } from '../../theme/tokens';

interface Props {
  open: boolean;
  onClose: () => void;
  filters: SinglesFilters;
  onApply: (filters: SinglesFilters) => void;
  options: { pokemon: string[]; setName: string[]; condition: string[] };
}

// Native <select>/<input type="date"> on purpose: on iPhone they open the
// system wheel pickers, as in the old app.
const inputSx = {
  width: '100%',
  backgroundColor: tokens.surface2,
  border: `1px solid ${tokens.border}`,
  borderRadius: '8px',
  padding: '11px 13px',
  color: tokens.text,
  fontFamily: 'inherit',
  fontSize: 16, // 16px+ so iOS doesn't zoom on focus
  outline: 'none',
  WebkitAppearance: 'none' as const,
  colorScheme: 'dark' as const,
};

export function SinglesFilterSheet({ open, onClose, filters, onApply, options }: Props) {
  const [draft, setDraft] = useState(filters);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(filters);
  }

  const set = (key: keyof SinglesFilters) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }));

  const select = (key: 'pokemon' | 'setName' | 'condition', allLabel: string) => (
    <select style={inputSx} value={draft[key]} onChange={set(key)}>
      <option value="">{allLabel}</option>
      {options[key].map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  );

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Filter Cards"
      footer={
        <>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              onApply(emptyFilters);
              onClose();
            }}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Apply
          </Button>
        </>
      }
    >
      <Field label="Pokémon">{select('pokemon', 'All Pokémon')}</Field>
      <Field label="Set">{select('setName', 'All Sets')}</Field>
      <Field label="Condition">{select('condition', 'All Conditions')}</Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Purchased From">
          <input type="date" style={inputSx} value={draft.dateFrom} onChange={set('dateFrom')} />
        </Field>
        <Field label="Purchased To">
          <input type="date" style={inputSx} value={draft.dateTo} onChange={set('dateTo')} />
        </Field>
      </div>
    </Sheet>
  );
}
