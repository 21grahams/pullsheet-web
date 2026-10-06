import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import type { SalesBox, SummaryBox } from '../../api/types';
import { ErrorState, LoadingState } from '../../components/ListStates';
import { useCompletedHolds, useSummary } from '../../hooks/queries';
import { formatMoney, formatRatioPct, formatSignedPct } from '../../lib/format';
import { realizedProfitLabel, returnPct } from '../../lib/summaryLabels';
import { fonts, tokens } from '../../theme/tokens';

// Everything here is calculated by the database (api_get_summary); this
// screen only lays it out, matching the old Summary tab.

const signColor = (n: number) => (n >= 0 ? tokens.green : tokens.red);
const GREEN_BORDER = 'rgba(52,199,123,0.3)';

function Panel({ children, borderColor = tokens.border }: { children: ReactNode; borderColor?: string }) {
  return (
    <Box
      sx={{
        backgroundColor: tokens.surface,
        border: `1px solid ${borderColor}`,
        borderRadius: `${tokens.radius}px`,
        p: 1.75,
        minWidth: 0,
      }}
    >
      {children}
    </Box>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: tokens.text3, mb: 0.75 }}
    >
      {children}
    </Box>
  );
}

function Row({
  label,
  value,
  color = tokens.text as string,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
      <Box sx={{ fontSize: 12, color: tokens.text2 }}>{label}</Box>
      <Box sx={{ fontFamily: fonts.mono, fontSize: 13, fontWeight: 500, color }}>{value}</Box>
    </Box>
  );
}

const Rule = () => <Box sx={{ borderTop: `1px solid ${tokens.border}`, my: 1 }} />;

/** Singles / Long Hold Sealed boxes. */
function CategoryPanel({ title, box }: { title: string; box: SummaryBox }) {
  return (
    <Panel>
      <Label>{title}</Label>
      <Box sx={{ fontFamily: fonts.mono, fontSize: 22, fontWeight: 500, mb: 1 }}>
        {formatMoney(box.value)}
      </Box>
      <Row label="Spent" value={formatMoney(box.spent)} />
      <Row label="Gain" value={formatMoney(box.gain)} color={signColor(box.gain)} />
      <Row label="@80% Exit" value={formatMoney(box.exit80)} color={tokens.gold} />
      <Rule />
      <Row label="80% Profit" value={formatMoney(box.profit80)} color={signColor(box.profit80)} />
    </Panel>
  );
}

/** A sold-price / profit / markup / margin box inside Realized Profit. */
function PeriodBox({
  title,
  sales,
  highlight,
}: {
  title: string;
  sales: Omit<SalesBox, 'hasSales'>;
  highlight?: boolean;
}) {
  const row = (label: string, value: string, color: string = tokens.text) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '3px' }}>
      <Box sx={{ fontSize: 12, color: tokens.text3 }}>{label}</Box>
      <Box sx={{ fontFamily: fonts.mono, fontSize: 12, color }}>{value}</Box>
    </Box>
  );
  return (
    <Box
      sx={{
        backgroundColor: tokens.surface,
        border: `1px solid ${highlight ? GREEN_BORDER : tokens.border}`,
        borderRadius: `${tokens.radius}px`,
        p: 1.5,
        mb: 1,
      }}
    >
      <Box
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: tokens.text2,
          mb: 1,
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Box>
      {/* As in the old app, zero sold price / markup / margin rows are left out. */}
      {sales.soldPrice !== 0 && row('Sold Price', formatMoney(sales.soldPrice))}
      {row('Profit', formatMoney(sales.profit), signColor(sales.profit))}
      {sales.markup !== 0 && row('Markup', formatRatioPct(sales.markup))}
      {sales.margin !== 0 && row('Margin', formatRatioPct(sales.margin))}
    </Box>
  );
}

export function SummaryPage() {
  const summary = useSummary();
  const holds = useCompletedHolds();

  if (!summary.data || !holds.data) {
    if (summary.isError) return <ErrorState error={summary.error} onRetry={() => summary.refetch()} />;
    if (holds.isError) return <ErrorState error={holds.error} onRetry={() => holds.refetch()} />;
    return <LoadingState />;
  }

  const s = summary.data;
  const p = s.portfolio;
  const cs = s.currentShort;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
      <Panel>
        <Label>Portfolio Value — Singles + Long Hold</Label>
        <Box sx={{ fontFamily: fonts.mono, fontSize: 32, fontWeight: 500, color: tokens.gold }}>
          {formatMoney(p.value)}
        </Box>
        <Box sx={{ fontFamily: fonts.mono, fontSize: 11, color: tokens.text3, mt: '3px' }}>
          Spent: {formatMoney(p.spent)} · Gain: {formatMoney(p.gain)} · Return:{' '}
          {formatSignedPct(returnPct(p))} · 80% exit: {formatMoney(p.exit80)}
        </Box>
      </Panel>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
        <CategoryPanel title="Singles" box={s.singles} />
        <CategoryPanel title="Long Hold Sealed" box={s.longHold} />
      </Box>

      <Panel>
        <Label>{cs.name ?? 'Current Short Hold'} — Tracking Only</Label>
        <Box sx={{ mt: 1 }}>
          <Row label="Market Value" value={formatMoney(cs.value)} />
          <Row label="Spent" value={formatMoney(cs.spent)} />
          <Row label="Unrealized Gain" value={formatMoney(cs.gain)} color={signColor(cs.gain)} />
          <Row label="@80% Exit" value={formatMoney(cs.exit80)} color={tokens.gold} />
          <Rule />
          <Row label="80% Profit" value={formatMoney(cs.profit80)} color={signColor(cs.profit80)} />
        </Box>
      </Panel>

      <Panel borderColor={GREEN_BORDER}>
        <Label>{realizedProfitLabel(s)}</Label>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 1, mb: 1.5 }}
        >
          <Box sx={{ fontSize: 12, color: tokens.text2 }}>Total Realized Profit</Box>
          <Box
            sx={{
              fontFamily: fonts.mono,
              fontSize: 20,
              fontWeight: 500,
              color: signColor(s.totalRealizedProfit),
            }}
          >
            {formatMoney(s.totalRealizedProfit)}
          </Box>
        </Box>
        {s.singlesSales.hasSales && (
          <PeriodBox title="Individual Card Sales" sales={s.singlesSales} highlight />
        )}
        {s.longHoldSales.hasSales && <PeriodBox title="Long Hold Sales" sales={s.longHoldSales} highlight />}
        {/* Newest Short Hold first, matching the Sealed tab. */}
        {[...holds.data]
          .sort((a, b) => b.number - a.number)
          .map((h) => (
            <PeriodBox key={h.id} title={h.name} sales={h} />
          ))}
      </Panel>
    </Box>
  );
}
