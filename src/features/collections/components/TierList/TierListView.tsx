import * as React from "react";
import { CollectionItem, TierEnum, BlankEnum } from "@/client";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import { SortableGameCard } from "./SortableGameCard";
import { TierDropZone } from "./TierDropZone";
import {
  useCollectionItemsByTierInfiniteQuery,
  useUpdateCollectionItemTier,
  useUpdateCollectionItem,
} from "../../hooks/useCollectionQueries";
import toast from "react-hot-toast";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

interface TierListViewProps {
  collectionId: number;
  isOwner: boolean;
  onRemove?: (itemId: number, gameTitle: string) => void;
}

const TIERS: { id: TierEnum | "UNRANKED"; label: string; color: string }[] = [
  { id: TierEnum.S, label: "S", color: "bg-red-500" },
  { id: TierEnum.A, label: "A", color: "bg-orange-500" },
  { id: TierEnum.B, label: "B", color: "bg-yellow-500" },
  { id: TierEnum.C, label: "C", color: "bg-green-500" },
  { id: TierEnum.D, label: "D", color: "bg-blue-500" },
  { id: TierEnum.E, label: "E", color: "bg-purple-500" },
  { id: "UNRANKED", label: "?", color: "bg-neutral-500" },
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

        toast.success("Item moved successfully");
      } catch (error) {
        toast.error("Failed to move item");
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

        toast.success("Item reordered successfully");
      } catch (error) {
        toast.error("Failed to reorder item");
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
        toast.success("Description updated");
      } catch (error) {
        toast.error("Failed to update description");
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
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between sticky top-4 z-30 bg-linear-to-r from-red-50 via-orange-50 to-yellow-50 p-4 rounded-2xl border border-orange-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-red-500 to-orange-500 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-white"
            >
              <path
                fillRule="evenodd"
                d="M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-black text-orange-600 leading-none">{totalItems}</div>
            <div className="text-xs font-semibold text-text-500 uppercase tracking-wider mt-0.5">Total Games</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {TIERS.slice(0, -1).map(tier => {
            const query = tierQueries[tier.id];
            const count = query.data?.pages[0]?.count ?? 0;
            return (
              <div
                key={tier.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-lg border border-background-200"
              >
                <span className={`w-2 h-2 rounded-full ${tier.color}`} />
                <span className="text-xs font-black text-text-600">{count}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-lg border border-background-200">
            <span className="text-xs font-semibold text-text-400">?</span>
            <span className="text-xs font-black text-text-600">{unrankedQuery.data?.pages[0]?.count ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {TIERS.map(tier => {
          const items = tierData[tier.id] || [];
          const query = tierQueries[tier.id];
          const totalCount = query.data?.pages[0]?.count ?? 0;

          return (
            <div key={tier.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-3 px-4">
                <div
                  className={`flex items-center justify-center w-12 h-12 ${tier.color} rounded-xl shadow-md border-2 border-white`}
                >
                  <span className="text-xl font-black text-white">{tier.label}</span>
                </div>
                <div className="flex-1 h-1 bg-background-200 rounded-full" />
                <div className="text-sm font-bold text-text-600">{totalCount} games</div>
              </div>

              <TierDropZone tierId={tier.id} isEmpty={items.length === 0} isOwner={isOwner} onItemMove={handleItemMove}>
                {(() => {
                  if (query.isLoading && !query.isFetchingNextPage) {
                    return (
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                      </div>
                    );
                  }

                  if (items.length === 0) {
                    return (
                      <div className="flex items-center justify-center h-32 text-text-400 text-sm">
                        No games in this tier
                      </div>
                    );
                  }

                  return (
                    <VirtualGridList
                      items={items}
                      renderItem={(item: CollectionItem, index: number) => renderGameCard(item, tier.id, index)}
                      hasNextPage={query.hasNextPage ?? false}
                      isFetchingNextPage={query.isFetchingNextPage}
                      fetchNextPage={query.fetchNextPage}
                      columnCount={7}
                      rowHeight={180}
                      className="h-64"
                      gap={3}
                    />
                  );
                })()}
              </TierDropZone>
            </div>
          );
        })}
      </div>
    </div>
  );
});
