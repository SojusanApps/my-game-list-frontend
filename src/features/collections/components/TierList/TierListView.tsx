import * as React from "react";
import { Box, Group, Stack, Text } from "@mantine/core";
import { CollectionItem, TierEnum, BlankEnum } from "@/client";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import { SortableGameCard } from "./SortableGameCard";
import { TierDropZone } from "./TierDropZone";
import {
  useCollectionItemsByTierInfiniteQuery,
  useUpdateCollectionItemTier,
  useUpdateCollectionItem,
} from "../../hooks/useCollectionQueries";
import { notifications } from "@mantine/notifications";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

interface TierListViewProps {
  collectionId: number;
  isOwner: boolean;
  onRemove?: (itemId: number, gameTitle: string) => void;
}

const TIERS: { id: TierEnum | "UNRANKED"; label: string; color: string }[] = [
  { id: TierEnum.S, label: "S", color: "#ef4444" },
  { id: TierEnum.A, label: "A", color: "#f97316" },
  { id: TierEnum.B, label: "B", color: "#eab308" },
  { id: TierEnum.C, label: "C", color: "#22c55e" },
  { id: TierEnum.D, label: "D", color: "#3b82f6" },
  { id: TierEnum.E, label: "E", color: "#a855f7" },
  { id: "UNRANKED", label: "?", color: "#737373" },
];

type TierIdType = TierEnum | "UNRANKED" | null;

export const TierListView = React.memo(function TierListView({
  collectionId,
  isOwner,
  onRemove,
}: Readonly<TierListViewProps>) {
  const { mutateAsync: updateItemTier } = useUpdateCollectionItemTier();
  const { mutateAsync: updateItem } = useUpdateCollectionItem();

  // Fetch data for each tier separately
  const sTierQuery = useCollectionItemsByTierInfiniteQuery(collectionId, TierEnum.S);
  const aTierQuery = useCollectionItemsByTierInfiniteQuery(collectionId, TierEnum.A);
  const bTierQuery = useCollectionItemsByTierInfiniteQuery(collectionId, TierEnum.B);
  const cTierQuery = useCollectionItemsByTierInfiniteQuery(collectionId, TierEnum.C);
  const dTierQuery = useCollectionItemsByTierInfiniteQuery(collectionId, TierEnum.D);
  const eTierQuery = useCollectionItemsByTierInfiniteQuery(collectionId, TierEnum.E);
  const unrankedQuery = useCollectionItemsByTierInfiniteQuery(collectionId, "UNRANKED");

  // Extract items from each tier query
  const tierData = React.useMemo(
    () => ({
      [TierEnum.S]: sTierQuery.data?.pages.flatMap(page => page.results) || [],
      [TierEnum.A]: aTierQuery.data?.pages.flatMap(page => page.results) || [],
      [TierEnum.B]: bTierQuery.data?.pages.flatMap(page => page.results) || [],
      [TierEnum.C]: cTierQuery.data?.pages.flatMap(page => page.results) || [],
      [TierEnum.D]: dTierQuery.data?.pages.flatMap(page => page.results) || [],
      [TierEnum.E]: eTierQuery.data?.pages.flatMap(page => page.results) || [],
      UNRANKED: unrankedQuery.data?.pages.flatMap(page => page.results) || [],
    }),
    [
      sTierQuery.data,
      aTierQuery.data,
      bTierQuery.data,
      cTierQuery.data,
      dTierQuery.data,
      eTierQuery.data,
      unrankedQuery.data,
    ],
  );

  // Map tier IDs to their query objects for easier access
  const tierQueries = React.useMemo(
    () => ({
      [TierEnum.S]: sTierQuery,
      [TierEnum.A]: aTierQuery,
      [TierEnum.B]: bTierQuery,
      [TierEnum.C]: cTierQuery,
      [TierEnum.D]: dTierQuery,
      [TierEnum.E]: eTierQuery,
      UNRANKED: unrankedQuery,
    }),
    [sTierQuery, aTierQuery, bTierQuery, cTierQuery, dTierQuery, eTierQuery, unrankedQuery],
  );

  const handleItemMove = React.useCallback(
    async (itemId: string, tierId: string) => {
      if (!isOwner) {
        return;
      }

      const numericItemId = Number.parseInt(itemId, 10);
      const tierConfig = TIERS.find(t => t.id === tierId);
      if (!tierConfig) {
        return;
      }

      const targetTier = tierConfig.id === "UNRANKED" ? BlankEnum[""] : tierConfig.id;

      // Find source tier by looking for the item in tierData
      let sourceTierId: TierIdType = null;
      for (const [tier, items] of Object.entries(tierData)) {
        if (items.some(item => item.id === numericItemId)) {
          sourceTierId = tier as TierEnum | "UNRANKED";
          break;
        }
      }

      try {
        await updateItemTier({
          collectionId,
          itemId: numericItemId,
          tier: targetTier,
          oldTier: sourceTierId,
        });

        notifications.show({ title: "Success", message: "Item moved successfully", color: "green" });
      } catch (error) {
        notifications.show({ title: "Error", message: "Failed to move item", color: "red" });
        console.error(error);
      }
    },
    [isOwner, collectionId, updateItemTier, tierData],
  );

  const handleReorder = React.useCallback(
    async (itemId: string, targetTierId: string, targetIndex: number, edge: Edge | null) => {
      if (!isOwner) {
        return;
      }

      const numericItemId = Number.parseInt(itemId, 10);
      const tierConfig = TIERS.find(t => t.id === targetTierId);
      if (!tierConfig) {
        return;
      }

      const targetTier = tierConfig.id === "UNRANKED" ? BlankEnum[""] : tierConfig.id;

      // Find source tier by looking for the item in tierData
      let sourceTierId: TierIdType = null;
      for (const [tier, items] of Object.entries(tierData)) {
        if (items.some(item => item.id === numericItemId)) {
          sourceTierId = tier as TierEnum | "UNRANKED";
          break;
        }
      }

      // Calculate insertion position (0-based for API)
      let position = targetIndex;
      if (edge === "right") {
        position += 1;
      }

      // If moving within the same tier, adjust for the item being removed first
      if (sourceTierId === targetTierId) {
        const currentIndex = tierData[sourceTierId].findIndex(item => item.id === numericItemId);
        if (currentIndex !== -1 && currentIndex < position) {
          position -= 1;
        }
      }

      try {
        await updateItemTier({
          collectionId,
          itemId: numericItemId,
          tier: targetTier,
          position,
          oldTier: sourceTierId,
        });

        notifications.show({ title: "Success", message: "Item reordered successfully", color: "green" });
      } catch (error) {
        notifications.show({ title: "Error", message: "Failed to reorder item", color: "red" });
        console.error(error);
      }
    },
    [isOwner, collectionId, updateItemTier, tierData],
  );

  const handleDescriptionChange = React.useCallback(
    async (itemId: number, newDescription: string) => {
      if (!isOwner) return;

      try {
        await updateItem({ id: itemId, body: { description: newDescription } });
        notifications.show({ title: "Success", message: "Description updated", color: "green" });
      } catch (error) {
        notifications.show({ title: "Error", message: "Failed to update description", color: "red" });
        console.error(error);
      }
    },
    [isOwner, updateItem],
  );

  // Render function for individual game cards
  const renderGameCard = React.useCallback(
    (item: CollectionItem, tierId: TierEnum | "UNRANKED", index: number) => {
      return (
        <SortableGameCard
          key={item.id}
          id={String(item.id)}
          tierId={tierId}
          index={index}
          title={item.game.title}
          coverImageId={item.game.cover_image_id}
          description={item.description}
          isOwner={isOwner}
          onRemove={onRemove ? () => onRemove(item.id, item.game.title) : undefined}
          onReorder={handleReorder}
          onDescriptionChange={newDesc => handleDescriptionChange(item.id, newDesc)}
        />
      );
    },
    [isOwner, onRemove, handleReorder, handleDescriptionChange],
  );

  // Calculate total items from API count
  const totalItems = React.useMemo(() => {
    return (
      (sTierQuery.data?.pages[0]?.count ?? 0) +
      (aTierQuery.data?.pages[0]?.count ?? 0) +
      (bTierQuery.data?.pages[0]?.count ?? 0) +
      (cTierQuery.data?.pages[0]?.count ?? 0) +
      (dTierQuery.data?.pages[0]?.count ?? 0) +
      (eTierQuery.data?.pages[0]?.count ?? 0) +
      (unrankedQuery.data?.pages[0]?.count ?? 0)
    );
  }, [
    sTierQuery.data,
    aTierQuery.data,
    bTierQuery.data,
    cTierQuery.data,
    dTierQuery.data,
    eTierQuery.data,
    unrankedQuery.data,
  ]);

  return (
    <Stack gap={32}>
      <Group
        justify="space-between"
        align="center"
        style={{
          position: "sticky",
          top: 16,
          zIndex: 30,
          background: "linear-gradient(to right, #fff1f2, #fff7ed, #fefce8)",
          padding: 16,
          borderRadius: 16,
          border: "1px solid #fed7aa",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <Group gap={12}>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #ef4444, #f97316)",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ width: 20, height: 20, color: "white" }}
            >
              <path
                fillRule="evenodd"
                d="M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z"
                clipRule="evenodd"
              />
            </svg>
          </Box>
          <Box>
            <Text fw={900} fz={24} c="#ea580c" style={{ lineHeight: 1 }}>
              {totalItems}
            </Text>
            <Text
              size="xs"
              fw={600}
              c="var(--color-text-500)"
              style={{ textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}
            >
              Total Games
            </Text>
          </Box>
        </Group>
        <Group gap={12}>
          {TIERS.slice(0, -1).map(tier => {
            const query = tierQueries[tier.id];
            const count = query.data?.pages[0]?.count ?? 0;
            return (
              <Group
                key={tier.id}
                gap={6}
                style={{
                  padding: "6px 12px",
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: 8,
                  border: "1px solid var(--color-background-200)",
                }}
              >
                <Box style={{ width: 8, height: 8, borderRadius: "9999px", background: tier.color }} />
                <Text component="span" size="xs" fw={900} c="var(--color-text-600)">
                  {count}
                </Text>
              </Group>
            );
          })}
          <Group
            key="unranked-count"
            gap={6}
            style={{
              padding: "6px 12px",
              background: "rgba(255,255,255,0.9)",
              borderRadius: 8,
              border: "1px solid var(--color-background-200)",
            }}
          >
            <Text component="span" size="xs" fw={600} c="var(--color-text-400)">
              ?
            </Text>
            <Text component="span" size="xs" fw={900} c="var(--color-text-600)">
              {unrankedQuery.data?.pages[0]?.count ?? 0}
            </Text>
          </Group>
        </Group>
      </Group>

      <Stack gap={16}>
        {TIERS.map(tier => {
          const items = tierData[tier.id] || [];
          const query = tierQueries[tier.id];
          const totalCount = query.data?.pages[0]?.count ?? 0;

          return (
            <Stack gap={8} key={tier.id}>
              <Group gap={12} style={{ paddingInline: 16 }}>
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

              <TierDropZone tierId={tier.id} isEmpty={items.length === 0} isOwner={isOwner} onItemMove={handleItemMove}>
                {(() => {
                  if (query.isLoading && !query.isFetchingNextPage) {
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

                  const COLUMN_COUNT = 7;
                  const ROW_HEIGHT = 180;
                  const MAX_VISIBLE_ROWS = 3;
                  const rowCount = Math.ceil(items.length / COLUMN_COUNT);
                  const visibleRows = Math.min(rowCount, MAX_VISIBLE_ROWS);
                  const listHeight = visibleRows * ROW_HEIGHT + 24;
                  return (
                    <VirtualGridList
                      items={items}
                      renderItem={(item: CollectionItem, index: number) => renderGameCard(item, tier.id, index)}
                      hasNextPage={query.hasNextPage ?? false}
                      isFetchingNextPage={query.isFetchingNextPage}
                      fetchNextPage={query.fetchNextPage}
                      columnCount={COLUMN_COUNT}
                      rowHeight={ROW_HEIGHT}
                      style={{ height: listHeight }}
                      gap={3}
                    />
                  );
                })()}
              </TierDropZone>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
});
