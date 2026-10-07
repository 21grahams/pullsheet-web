import { Box } from '@mui/material';
import { useMemo, useState } from 'react';
import type { SealedItem } from '../../api/types';
import { AddButton } from '../../components/AddButton';
import { CardButton } from '../../components/CardActions';
import { ItemCard } from '../../components/ItemCard';
import { EmptyState, ErrorState, LoadingState } from '../../components/ListStates';
import { useAppContext, useSealed } from '../../hooks/queries';
import { cardNumbers, pasFeesLabel, quarterBoxes } from '../../lib/cardMath';
import { formatDate } from '../../lib/format';
import { groupSealed, groupSummary, type SealedGroup } from '../../lib/sealedGroups';
import { fonts, tokens } from '../../theme/tokens';
import { ItemFormSheet } from '../items/ItemFormSheet';
import { MoveSheet } from '../items/MoveSheet';
import { QuarterSheet, type QuarterTarget } from '../items/QuarterSheet';
import { RemoveItemDialog } from '../items/RemoveItemDialog';
import { SellSheet, type SellTarget } from '../items/SellSheet';

function GroupHeader({
  group,
  collapsed,
  onToggle,
}: {
  group: SealedGroup;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        mt: 1.75,
        mb: 1,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          fontSize: 11,
          color: tokens.text3,
          flexShrink: 0,
          transition: 'transform 0.2s',
          transform: collapsed ? 'rotate(-90deg)' : 'none',
        }}
      >
        ▼
      </Box>
      <Box
        sx={{
          fontSize: 11,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: tokens.text2,
          fontWeight: 600,
        }}
      >
        {group.name}
      </Box>
      <Box sx={{ flex: 1, height: '1px', backgroundColor: tokens.border }} />
      {group.status === 'current' && (
        // Completing a Short Hold arrives in Phase 3.
        <Box onClick={(e) => e.stopPropagation()}>
          <CardButton variant="green" disabled>
            Complete ✓
          </CardButton>
        </Box>
      )}
      <Box
        sx={{
          fontFamily: fonts.mono,
          fontSize: 11,
          color: tokens.text3,
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {groupSummary(group)}
      </Box>
    </Box>
  );
}

function SealedCard({
  item,
  year,
  onEdit,
  onRemove,
  onQuarter,
  onSell,
  onMove,
}: {
  item: SealedItem;
  year: number;
  onEdit: () => void;
  onRemove: () => void;
  onQuarter: (quarter: 1 | 2 | 3 | 4) => void;
  onSell: () => void;
  onMove: () => void;
}) {
  const isLong = item.holdStatus === 'long';
  return (
    <ItemCard
      title={item.name}
      subtitle={[`Qty: ${item.quantity}`, formatDate(item.purchaseDate)].filter(Boolean).join(' · ')}
      copyText={item.name}
      // Short Hold items with no price show their cost as their value (old-app behavior).
      numbers={cardNumbers(item, { fallbackToCost: !isLong })}
      feesLabel={pasFeesLabel(item.fees, item.feeUnits)}
      // Quarter tracking is Long Hold only, never Short Hold.
      quarters={
        isLong ? quarterBoxes(item.quarterUnitValues, item.quantity, item.totalCost, year) : undefined
      }
      onQuarterClick={isLong ? (q) => onQuarter(q.quarter) : undefined}
      actions={
        <>
          <CardButton onClick={onEdit}>Edit</CardButton>
          {isLong && (
            <CardButton variant="green" onClick={onSell}>
              Mark Sold
            </CardButton>
          )}
          {item.holdStatus !== 'historical' && <CardButton onClick={onMove}>Move</CardButton>}
          <CardButton variant="danger" onClick={onRemove}>
            Remove
          </CardButton>
        </>
      }
    />
  );
}

export function SealedPage() {
  const sealed = useSealed();
  const context = useAppContext();
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<SealedItem | null>(null);
  const [removing, setRemoving] = useState<SealedItem | null>(null);
  const [quarterTarget, setQuarterTarget] = useState<QuarterTarget | null>(null);
  const [selling, setSelling] = useState<SellTarget | null>(null);
  const [moving, setMoving] = useState<SealedItem | null>(null);

  const groups = useMemo(() => groupSealed(sealed.data ?? []), [sealed.data]);

  if (!sealed.data || !context.data) {
    if (sealed.isError) return <ErrorState error={sealed.error} onRetry={() => sealed.refetch()} />;
    if (context.isError) return <ErrorState error={context.error} onRetry={() => context.refetch()} />;
    return <LoadingState />;
  }

  // Toggling groups by hand keeps the button honest: once every group is
  // collapsed it offers "Expand All", once every group is expanded it offers
  // "Collapse All", and a mix leaves it as it was.
  function toggleGroup(holdId: number) {
    const next = { ...collapsed, [holdId]: !collapsed[holdId] };
    setCollapsed(next);
    const states = groups.map((g) => !!next[g.holdId]);
    if (states.every(Boolean)) setAllCollapsed(true);
    else if (!states.some(Boolean)) setAllCollapsed(false);
  }

  function toggleAll() {
    const next = !allCollapsed;
    setAllCollapsed(next);
    setCollapsed(Object.fromEntries(groups.map((g) => [g.holdId, next])));
  }

  const addSheet = (
    <>
      <AddButton label="Add sealed product" onClick={() => setAddOpen(true)} />
      <QuarterSheet target={quarterTarget} onClose={() => setQuarterTarget(null)} />
      <SellSheet target={selling} onClose={() => setSelling(null)} />
      <MoveSheet
        item={moving}
        currentShortHoldName={context.data.currentShortHoldName}
        onClose={() => setMoving(null)}
      />
      <RemoveItemDialog
        target={removing && { kind: 'sealed', item: removing }}
        onClose={() => setRemoving(null)}
      />
      <ItemFormSheet
        kind="sealed"
        open={addOpen}
        onClose={() => setAddOpen(false)}
        today={context.data.today}
      />
      <ItemFormSheet
        kind="sealed"
        open={editing != null}
        editing={editing}
        onClose={() => setEditing(null)}
        today={context.data.today}
      />
    </>
  );

  if (groups.length === 0) {
    return (
      <>
        <EmptyState icon="📦">No sealed product yet.</EmptyState>
        {addSheet}
      </>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box
          component="button"
          onClick={toggleAll}
          sx={{
            backgroundColor: tokens.surface2,
            border: `1px solid ${tokens.border}`,
            borderRadius: '10px',
            px: 1.75,
            py: 1.25,
            color: tokens.text,
            fontSize: 14,
            fontFamily: 'inherit',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {allCollapsed ? '▸ Expand All' : '▾ Collapse All'}
        </Box>
      </Box>

      {groups.map((group) => {
        const isCollapsed = !!collapsed[group.holdId];
        return (
          <Box key={group.holdId} sx={{ mb: 0.5 }}>
            <GroupHeader group={group} collapsed={isCollapsed} onToggle={() => toggleGroup(group.holdId)} />
            {!isCollapsed && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {group.items.map((item) => (
                  <SealedCard
                    key={item.id}
                    item={item}
                    year={context.data.year}
                    onEdit={() => setEditing(item)}
                    onRemove={() => setRemoving(item)}
                    onMove={() => setMoving(item)}
                    onSell={() =>
                      setSelling({
                        kind: 'sealed',
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        unitCost: cardNumbers(item).unitCost,
                        unitValue: item.unitValue,
                      })
                    }
                    onQuarter={(quarter) =>
                      setQuarterTarget({
                        item: { sealedItemId: item.id },
                        name: item.name,
                        quarter,
                        quantity: item.quantity,
                        unitValue: item.quarterUnitValues[quarter - 1] ?? null,
                      })
                    }
                  />
                ))}
              </Box>
            )}
          </Box>
        );
      })}
      {addSheet}
    </Box>
  );
}
