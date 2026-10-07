import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

import { Box } from '@mui/material';

import { flipSign } from '../lib/sellForm';
import { fonts, tokens } from '../theme/tokens';

const inputSx = {
  width: '100%',
  backgroundColor: tokens.surface2,
  border: `1px solid ${tokens.border}`,
  borderRadius: '8px',
  padding: '11px 13px',
  color: tokens.text,
  fontFamily: 'inherit',
  fontSize: 16,
  outline: 'none',
  WebkitAppearance: 'none',
  colorScheme: 'dark',
  '&:focus': { borderColor: tokens.gold },
  '&:disabled': { opacity: 0.6 },
  '&::placeholder': { color: tokens.text3 },
} as const;

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <Box component="input" sx={inputSx} {...props} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <Box component="textarea" sx={{ ...inputSx, resize: 'vertical' }} {...props} />;
}

export function MoneyInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <TextInput
      type="text"
      inputMode="decimal"
      placeholder="0.00"
      autoComplete="off"
      onFocus={(e) => e.target.select()}
      {...props}
    />
  );
}

export function ProfitInput({ value, onChange }: { value: string; onChange: (text: string) => void }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <MoneyInput value={value} onChange={(e) => onChange(e.target.value)} style={{ paddingRight: 44 }} />
      <Box
        component="button"
        type="button"
        aria-label="make negative or positive"
        onClick={() => onChange(flipSign(value))}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: 40,
          background: 'none',
          border: 'none',
          color: tokens.text2,
          fontSize: 18,
          cursor: 'pointer',
        }}
      >
        ±
      </Box>
    </Box>
  );
}

export function FieldRow({ children, columns = '1fr 1fr' }: { children: ReactNode; columns?: string }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: columns, gap: 1.5, alignItems: 'start' }}>
      {children}
    </Box>
  );
}

const stepButtonSx = {
  background: 'none',
  border: 'none',
  color: tokens.text,
  fontSize: 18,
  width: 32,
  height: '100%',
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:disabled': { color: tokens.text3, cursor: 'default' },
} as const;

export function Stepper({
  value,
  onChange,
  min,
  max,
  ariaLabel,
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max?: number;
  ariaLabel: string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 46,
        backgroundColor: tokens.surface2,
        border: `1px solid ${tokens.border}`,
        borderRadius: '8px',
        px: 0.5,
      }}
    >
      <Box
        component="button"
        type="button"
        aria-label={`Decrease ${ariaLabel}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        sx={stepButtonSx}
      >
        −
      </Box>
      <Box
        sx={{ fontFamily: fonts.mono, fontSize: 16, minWidth: 20, textAlign: 'center' }}
        aria-label={ariaLabel}
      >
        {value}
      </Box>
      <Box
        component="button"
        type="button"
        aria-label={`Increase ${ariaLabel}`}
        disabled={max != null && value >= max}
        onClick={() => onChange(max != null ? Math.min(max, value + 1) : value + 1)}
        sx={stepButtonSx}
      >
        +
      </Box>
    </Box>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <Box
      sx={{ display: 'flex', backgroundColor: tokens.surface2, borderRadius: '8px', p: '3px', gap: '3px' }}
    >
      {options.map((o) => (
        <Box
          key={o.value}
          component="button"
          type="button"
          onClick={() => onChange(o.value)}
          sx={{
            flex: 1,
            p: 1,
            borderRadius: '6px',
            border: 'none',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            color: o.value === value ? tokens.gold : tokens.text2,
            backgroundColor: o.value === value ? tokens.surface : 'transparent',
            boxShadow: o.value === value ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
          }}
        >
          {o.label}
        </Box>
      ))}
    </Box>
  );
}
