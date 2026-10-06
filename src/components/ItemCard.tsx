import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import type { CardNumbers, QuarterBox } from '../lib/cardMath';
import { formatMoney, formatSignedPct } from '../lib/format';
import { fonts, tokens } from '../theme/tokens';
import { useNotify } from './notifyContext';

interface ItemCardProps {
  title: string;
  subtitle: ReactNode;
  /** What the copy icon puts on the clipboard. */
  copyText: string;
  numbers: CardNumbers;
  /** e.g. "$3.39 × 2 units"; omitted when there are no PAS fees. */
  feesLabel: string | null;
  /** Q1–Q4 boxes; omitted for Short Hold items. */
  quarters?: QuarterBox[];
  onQuarterClick?: (q: QuarterBox) => void;
  actions?: ReactNode;
}

const BORDER: Record<CardNumbers['tone'], string> = {
  gain: tokens.green,
  loss: tokens.red,
  neutral: tokens.text3,
};

const mono = { fontFamily: fonts.mono };
const metaLabel = {
  fontSize: 10,
  color: tokens.text3,
  letterSpacing: '1px',
  textTransform: 'uppercase',
} as const;
const metaValue = { ...mono, fontSize: 12, color: tokens.text2, mt: '2px' } as const;
const finePrint = { fontSize: 11, color: tokens.text3 } as const;
const divider = { mt: 1.25, pt: 1.25, borderTop: `1px solid ${tokens.border}` } as const;

/** Gain/loss in green/red, with its percentage underneath. */
function GainCell({ amount, pct }: { amount: number; pct: number }) {
  return (
    <Box
      sx={{
        ...mono,
        fontSize: 13,
        fontWeight: 500,
        textAlign: 'right',
        color: amount >= 0 ? tokens.green : tokens.red,
      }}
    >
      {formatMoney(amount)}
      <Box sx={{ fontSize: 11 }}>{formatSignedPct(pct)}</Box>
    </Box>
  );
}

function QuarterGrid({
  quarters,
  onQuarterClick,
}: {
  quarters: QuarterBox[];
  onQuarterClick?: (q: QuarterBox) => void;
}) {
  return (
    <Box sx={{ ...divider, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.75 }}>
      {quarters.map((q) => (
        <Box
          key={q.quarter}
          component={onQuarterClick ? 'button' : 'div'}
          type={onQuarterClick ? 'button' : undefined}
          onClick={onQuarterClick ? () => onQuarterClick(q) : undefined}
          sx={{
            backgroundColor: tokens.surface2,
            borderRadius: '6px',
            px: 1,
            py: 0.75,
            border: `1px solid ${q.active ? tokens.gold : 'transparent'}`,
            minWidth: 0,
            textAlign: 'left',
            color: 'inherit',
            fontFamily: 'inherit',
            cursor: onQuarterClick ? 'pointer' : 'default',
            transition: 'border-color 0.15s',
            '&:hover': onQuarterClick ? { borderColor: tokens.gold } : {},
          }}
        >
          <Box sx={{ fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: tokens.text3 }}>
            {q.label}
            {q.active ? ' ●' : ''}
          </Box>
          {/* Green if up vs cost (Q1) or the previous quarter, red if down,
              grey when there's nothing to compare against. */}
          <Box
            sx={{
              ...mono,
              fontSize: 12,
              mt: '2px',
              color: q.delta == null ? tokens.text2 : q.delta >= 0 ? tokens.green : tokens.red,
            }}
          >
            {q.total != null ? formatMoney(q.total) : '—'}
          </Box>
          {q.delta != null && (
            <Box sx={{ fontSize: 9, mt: '2px', color: q.delta >= 0 ? tokens.green : tokens.red }}>
              {q.delta >= 0 ? '↑' : '↓'} {formatMoney(Math.abs(q.delta))}{' '}
              <Box component="span" sx={{ color: tokens.text3 }}>
                {q.deltaLabel}
              </Box>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

/** One Single or Sealed card, laid out like the old app's. */
export function ItemCard({
  title,
  subtitle,
  copyText,
  numbers,
  feesLabel,
  quarters,
  onQuarterClick,
  actions,
}: ItemCardProps) {
  const notify = useNotify();

  async function copy() {
    try {
      await navigator.clipboard.writeText(copyText);
      notify('Copied!', 'success');
    } catch {
      notify('Copy failed', 'error');
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: `${tokens.radius}px`,
        p: 1.75,
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: BORDER[numbers.tone],
        },
      }}
    >
      {/* Name + subtitle on the left, per-unit value on the right */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ fontWeight: 500, fontSize: 14, lineHeight: 1.3 }}>{title}</Box>
            <Box
              component="button"
              onClick={copy}
              aria-label="Copy name"
              sx={{
                background: 'none',
                border: 'none',
                color: tokens.text3,
                cursor: 'pointer',
                p: '2px 4px',
                fontSize: 13,
                lineHeight: 1,
                flexShrink: 0,
                '&:hover': { color: tokens.gold },
                '&:active': { color: tokens.green },
              }}
            >
              ⧉
            </Box>
          </Box>
          <Box sx={{ fontSize: 11, color: tokens.text3, mt: '2px' }}>{subtitle}</Box>
        </Box>
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Box sx={{ ...mono, fontSize: 16, fontWeight: 500, color: tokens.gold }}>
            {formatMoney(numbers.unitValue)}
          </Box>
          <Box sx={finePrint}>each</Box>
        </Box>
      </Box>

      {/* Total cost / value and the gain */}
      <Box sx={{ ...divider, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={metaLabel}>Total Cost</Box>
            <Box sx={metaValue}>{formatMoney(numbers.totalCost)}</Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={metaLabel}>Total Value</Box>
            <Box sx={metaValue}>{formatMoney(numbers.totalValue)}</Box>
          </Box>
        </Box>
        <GainCell amount={numbers.gain} pct={numbers.gainPct} />
      </Box>
      <Box sx={{ ...finePrint, mt: 0.75 }}>
        Unit Cost {formatMoney(numbers.unitCost)} · Unit Price {formatMoney(numbers.unitValue)}
      </Box>
      {feesLabel && <Box sx={{ ...finePrint, mt: '2px' }}>PAS Fees: {feesLabel}</Box>}

      {/* The 80% exit row */}
      <Box
        sx={{
          ...divider,
          borderTopStyle: 'dashed',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={metaLabel}>80% Total Value</Box>
          <Box sx={{ ...metaValue, color: tokens.gold }}>{formatMoney(numbers.value80)}</Box>
        </Box>
        <GainCell amount={numbers.profit80} pct={numbers.profit80Pct} />
      </Box>

      {quarters && <QuarterGrid quarters={quarters} onQuarterClick={onQuarterClick} />}

      {actions && <Box sx={{ display: 'flex', gap: 0.75, mt: 1.25, flexWrap: 'wrap' }}>{actions}</Box>}
    </Box>
  );
}
