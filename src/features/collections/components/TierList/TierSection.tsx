import * as React from "react";
import { Box, Group, Stack, Text, ActionIcon } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { CollectionItem, TierEnum } from "@/client";
import { GridList } from "@/components/ui/GridList";
import { SortableGameCard } from "./SortableGameCard";
import { TierDropZone } from "./TierDropZone";
import { useCollectionItemsByTierQuery } from "../../hooks/useCollectionQueries";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

interface TierSectionProps {
  collectionId: number;
  tier: { id: TierEnum | "UNRANKED"; label: string; color: string };
  isOwner: boolean;
  onRemove?: (itemId: number, gameTitle: string) => void;
  onItemMove: (itemId: string, sourceTierId: string, targetTierId: string) => void;
  onReorder: (
    itemId: string,
    sourceTierId: string,
    targetTierId: string,
    sourceIndex: number,
    targetIndex: number,
    edge: Edge | null,
  ) => void;
  onDescriptionChange: (itemId: number, newDescription: string) => void;
  onCountLoad: (tierId: TierEnum | "UNRANKED", count: number) => void;
}

export const TierSection = React.memo(function TierSection({
  collectionId,
  tier,
  isOwner,
  onRemove,
  onItemMove,
  onReorder,
  onDescriptionChange,
  onCountLoad,
}: Readonly<TierSectionProps>) {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isFetching } = useCollectionItemsByTierQuery(collectionId, tier.id, page);

  const items = data?.results || [];
  const totalCount = data?.count ?? 0;
  const hasNext = !!data?.next;
  const hasPrevious = !!data?.previous;

  React.useEffect(() => {
    if (data?.count !== undefined) {
      onCountLoad(tier.id, data.count);
    }
  }, [data?.count, tier.id, onCountLoad]);

  // Render function for individual game cards
  const renderGameCard = React.useCallback(
    (item: CollectionItem, index: number) => {
      return (
        <SortableGameCard
          key={item.id}
          id={String(item.id)}
          tierId={tier.id}
          index={index}
          title={item.game.title}
          coverImageId={item.game.cover_image_id}
          description={item.description}
          isOwner={isOwner}
          onRemove={onRemove ? () => onRemove(item.id, item.game.title) : undefined}
          onReorder={onReorder}
          onDescriptionChange={newDesc => onDescriptionChange(item.id, newDesc)}
        />
      );
    },
    [tier.id, isOwner, onRemove, onReorder, onDescriptionChange],
  );

  return (
    <Stack gap={8}>
      <Group justify="space-between" align="center" style={{ paddingInline: 16 }}>
        <Group gap={12} style={{ flex: 1 }}>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 12,
              background: tier.color,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              border: "2px solid white",
            }}
          >
            <Text component="span" fz="xl" fw={900} c="white">
              {tier.label}
            </Text>
          </Box>
          <Box style={{ flex: 1, height: 4, background: "var(--color-background-200)", borderRadius: 9999 }} />
          <Text fw={700} size="sm" c="var(--color-text-600)">
            {totalCount} games
          </Text>
        </Group>

        {(hasNext || hasPrevious) && (
          <Group gap={8}>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!hasPrevious || isFetching}
            >
              <IconChevronLeft size={20} />
            </ActionIcon>
            <Text size="sm" fw={500} c="var(--color-text-600)">
              Page {page}
            </Text>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNext || isFetching}
            >
              <IconChevronRight size={20} />
            </ActionIcon>
          </Group>
        )}
      </Group>

      <TierDropZone tierId={tier.id} isEmpty={items.length === 0} isOwner={isOwner} onItemMove={onItemMove}>
        {(() => {
          if (isLoading) {
            return (
              <Group justify="center" align="center" style={{ height: 256 }}>
                <Box
                  style={{
                    animation: "spin 1s linear infinite",
                    borderRadius: "9999px",
                    width: 32,
                    height: 32,
                    borderBottom: "2px solid var(--color-primary-600)",
                  }}
                />
              </Group>
            );
          }

          if (items.length === 0) {
            return (
              <Group justify="center" align="center" style={{ height: 128 }} c="var(--color-text-400)" fz="sm">
                No games in this tier
              </Group>
            );
          }

          return (
            <Box p="md">
              <GridList columnCount={7}>{items.map((item, index) => renderGameCard(item, index))}</GridList>
            </Box>
          );
        })()}
      </TierDropZone>
    </Stack>
  );
});
