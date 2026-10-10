import type { SealedItem } from '../../api/types';
import type { SealedGroup } from '../../lib/sealedGroups';
import type { QuarterTarget } from '../items/QuarterSheet';
import type { SellTarget } from '../items/SellSheet';
import type { CompleteTarget } from './CompleteHoldSheet';

import DeleteOutline from '@mui/icons-material/DeleteOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import SellOutlined from '@mui/icons-material/SellOutlined';
import SwapHorizOutlined from '@mui/icons-material/SwapHorizOutlined';
import { Box } from '@mui/material';
import { useMemo, useState } from 'react';

import { AddButton } from '../../components/AddButton';
import { CardButton } from '../../components/CardActions';
import { CollapseAllButton } from '../../components/CollapseAllButton';
import { ExitToggle } from '../../components/ExitToggle';
import { IconAction } from '../../components/IconAction';
import { ItemCard } from '../../components/ItemCard';
import { EmptyCollection, ErrorState, LoadingState } from '../../components/ListStates';
import { StickyToolbar } from '../../components/StickyToolbar';
import { useAppContext, useSealed } from '../../hooks/queries';
import { useCollapsibleGroups } from '../../hooks/useCollapsibleGroups';
import { useShowExit } from '../../hooks/useStickyState';
import { cardNumbers, pasFeesLabel, quarterBoxes, totals } from '../../lib/cardMath';
import { formatDate } from '../../lib/format';
import { groupSealed, groupSummary } from '../../lib/sealedGroups';
import { fonts, tokens } from '../../theme/tokens';
import { ItemFormSheet } from '../items/ItemFormSheet';
import { MoveSheet } from '../items/MoveSheet';
import { QuarterSheet } from '../items/QuarterSheet';
import { RemoveItemDialog } from '../items/RemoveItemDialog';
import { SellSheet } from '../items/SellSheet';
import { CompleteHoldSheet } from './CompleteHoldSheet';

function GroupHeader({
  group,
  collapsed,
  onToggle,
  onComplete,
}: {
  group: SealedGroup;
  collapsed: boolean;
  onToggle: () => void;
  onComplete: () => void;
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
        <Box onClick={(e) => e.stopPropagation()}>
          <CardButton variant="green" onClick={onComplete}>
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
  showExit,
  onEdit,
  onRemove,
  onQuarter,
  onSell,
  onMove,
}: {
  item: SealedItem;
  year: number;
  showExit: boolean;
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
      subtitle={[item.quantity > 1 ? `Qty ${item.quantity}` : '', formatDate(item.purchaseDate)]
        .filter(Boolean)
        .join(' · ')}
      copyText={item.name}
      quantity={item.quantity}
      showExit={showExit}
      // Short Hold items with no price show their cost as their value (old-app behavior).
      numbers={cardNumbers(item, { fallbackToCost: !isLong })}
      feesLabel={pasFeesLabel(item.fees, item.feeUnits)}
      quarters={
        isLong ? quarterBoxes(item.quarterUnitValues, item.quantity, item.totalCost, year) : undefined
      }
      onQuarterClick={isLong ? (q) => onQuarter(q.quarter) : undefined}
      actions={
        <>
          <IconAction label="Edit" icon={<EditOutlined />} onClick={onEdit} />
          {isLong && <IconAction label="Mark Sold" icon={<SellOutlined />} tone="green" onClick={onSell} />}
          {item.holdStatus !== 'historical' && (
            <IconAction label="Move" icon={<SwapHorizOutlined />} onClick={onMove} />
          )}
          <IconAction label="Remove" icon={<DeleteOutline />} tone="danger" onClick={onRemove} />
        </>
      }
    />
  );
}

export function SealedPage() {
  const sealed = useSealed();
  const context = useAppContext();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<SealedItem | null>(null);
  const [removing, setRemoving] = useState<SealedItem | null>(null);
  const [quarterTarget, setQuarterTarget] = useState<QuarterTarget | null>(null);
  const [selling, setSelling] = useState<SellTarget | null>(null);
  const [moving, setMoving] = useState<SealedItem | null>(null);
  const [completing, setCompleting] = useState<CompleteTarget | null>(null);

  const groups = useMemo(() => groupSealed(sealed.data ?? []), [sealed.data]);
  const [showExit, setShowExit] = useShowExit();
  const { isCollapsed, toggle, allCollapsed, toggleAll } = useCollapsibleGroups(
    'ui:sealed',
    groups.map((g) => g.holdId),
    { persist: true },
  );

  if (!sealed.data || !context.data) {
    if (sealed.isError) return <ErrorState error={sealed.error} onRetry={() => sealed.refetch()} />;
    if (context.isError) return <ErrorState error={context.error} onRetry={() => context.refetch()} />;

    return <LoadingState />;
  }

  const addSheet = (
    <>
      <QuarterSheet target={quarterTarget} onClose={() => setQuarterTarget(null)} />
      <SellSheet target={selling} onClose={() => setSelling(null)} />
      <MoveSheet
        item={moving}
        currentShortHoldName={context.data.currentShortHoldName}
        onClose={() => setMoving(null)}
      />
      <CompleteHoldSheet target={completing} onClose={() => setCompleting(null)} />
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
        <EmptyCollection
          title="No sealed product yet"
          action="Add your first sealed product"
          onAdd={() => setAddOpen(true)}
        />
        {addSheet}
      </>
    );
  }

  return (
    <Box>
      <StickyToolbar justify="flex-end">
        <ExitToggle on={showExit} onToggle={() => setShowExit((v) => !v)} />
        <CollapseAllButton allCollapsed={allCollapsed} onClick={toggleAll} />
      </StickyToolbar>

      {groups.map((group) => {
        const groupCollapsed = isCollapsed(group.holdId);

        return (
          <Box key={group.holdId} sx={{ mb: 0.5 }}>
            <GroupHeader
              group={group}
              collapsed={groupCollapsed}
              onToggle={() => toggle(group.holdId)}
              onComplete={() => setCompleting({ holdName: group.name, spent: totals(group.items).totalCost })}
            />
            {!groupCollapsed && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {group.items.map((item) => (
                  <SealedCard
                    key={item.id}
                    item={item}
                    year={context.data.year}
                    showExit={showExit}
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
      <AddButton label="Add sealed product" onClick={() => setAddOpen(true)} />
      {addSheet}
    </Box>
  );
}
