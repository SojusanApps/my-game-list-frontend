import * as React from "react";
import { CollectionItem } from "@/client";
import { SortableRankingRow } from "./SortableRankingRow";
import { VirtualList } from "@/components/ui/VirtualList";
import {
  useReorderCollectionItem,
  useUpdateCollectionItem,
  useCollectionItemsInfiniteQuery,
} from "../../hooks/useCollectionQueries";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import toast from "react-hot-toast";
import EditDescriptionModal from "./EditDescriptionModal";

interface RankingListViewProps {
  collectionId: number;
  isOwner: boolean;
  onRemove?: (itemId: number, gameTitle: string) => void;
}

export const RankingListView = React.memo(function RankingListView({
  collectionId,
  isOwner,
  onRemove,
}: Readonly<RankingListViewProps>) {
  const virtualListRef = React.useRef<HTMLDivElement>(null);
  const [editingItem, setEditingItem] = React.useState<{ id: number; title: string; description?: string } | null>(
    null,
  );

  const {
    data: itemsResults,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useCollectionItemsInfiniteQuery(collectionId);

  const totalCount = itemsResults?.pages[0]?.count ?? 0;

  // Flatten all pages into a single array
  const allItems = React.useMemo(() => itemsResults?.pages.flatMap(page => page.results) || [], [itemsResults]);

  // Sort by order initially
  const sortedInitialItems = React.useMemo(() => {
    return [...allItems].sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
  }, [allItems]);

  const [items, setItems] = React.useState<CollectionItem[]>(sortedInitialItems);

  const { mutateAsync: reorderItem, isPending: isReordering } = useReorderCollectionItem();
  const { mutateAsync: updateItem } = useUpdateCollectionItem();

  // Track if we're doing an optimistic update to prevent overwriting during mutations
  const isOptimisticUpdateRef = React.useRef(false);

  // Update local state when query data changes (after refetch)
  React.useEffect(() => {
    // Only sync from query data when we're not in the middle of an optimistic update
    if (!isOptimisticUpdateRef.current && sortedInitialItems.length > 0) {
      setItems(sortedInitialItems);
    }
  }, [sortedInitialItems]);

  // Enable auto-scroll for drag and drop
  React.useEffect(() => {
    const element = virtualListRef.current;
    if (!element || !isOwner) {
      return;
    }

    return autoScrollForElements({
      element,
      canScroll: ({ source }) => source.data.type === "ranking-item",
    });
  }, [isOwner]);

  const handleDescriptionSave = React.useCallback(
    async (description: string) => {
      if (!editingItem) {
        return;
      }

      try {
        await updateItem({ id: editingItem.id, body: { description } });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [editingItem, updateItem],
  );

  const handleItemMove = React.useCallback(
    async (draggedId: string, targetIndex: number) => {
      if (!isOwner || isReordering) {
        return;
      }

      const itemId = Number.parseInt(draggedId, 10);
      const currentIndex = items.findIndex(i => i.id === itemId);
      if (currentIndex === -1 || currentIndex === targetIndex) {
        return;
      }

      // Save previous state for potential revert
      const previousItems = items;

      // Optimistic update
      isOptimisticUpdateRef.current = true;
      const newItems = [...items];
      const [removed] = newItems.splice(currentIndex, 1);
      newItems.splice(targetIndex, 0, removed);
      setItems(newItems);

      // Call API with new position (0-based)
      const newPosition = targetIndex;

      try {
        await reorderItem({ collectionId, itemId, position: newPosition });
        // Allow query refetch to update the state
        isOptimisticUpdateRef.current = false;
      } catch (error) {
        toast.error("Failed to reorder item");
        // Revert on error
        isOptimisticUpdateRef.current = false;
        setItems(previousItems);
        console.error(error);
      }
    },
    [isOwner, isReordering, items, collectionId, reorderItem],
  );

  const handleMoveUp = React.useCallback(
    async (id: number) => {
      if (!isOwner || isReordering) {
        return;
      }

      const currentIndex = items.findIndex(i => i.id === id);
      if (currentIndex <= 0) {
        return;
      }

      // Save previous state for potential revert
      const previousItems = items;

      // Optimistic update
      isOptimisticUpdateRef.current = true;
      const newItems = [...items];
      const [removed] = newItems.splice(currentIndex, 1);
      newItems.splice(currentIndex - 1, 0, removed);
      setItems(newItems);

      // Call API with new position (0-based)
      const newPosition = currentIndex - 1; // Moving up decreases position by 1

      try {
        await reorderItem({ collectionId, itemId: id, position: newPosition });
        // Allow query refetch to update the state
        isOptimisticUpdateRef.current = false;
      } catch (error) {
        toast.error("Failed to move item up");
        // Revert on error
        isOptimisticUpdateRef.current = false;
        setItems(previousItems);
        console.error(error);
      }
    },
    [isOwner, isReordering, items, collectionId, reorderItem],
  );

  const handleMoveDown = React.useCallback(
    async (id: number) => {
      if (!isOwner || isReordering) {
        return;
      }

      const currentIndex = items.findIndex(i => i.id === id);
      if (currentIndex === -1 || currentIndex >= items.length - 1) {
        return;
      }

      // Save previous state for potential revert
      const previousItems = items;

      // Optimistic update
      isOptimisticUpdateRef.current = true;
      const newItems = [...items];
      const [removed] = newItems.splice(currentIndex, 1);
      newItems.splice(currentIndex + 1, 0, removed);
      setItems(newItems);

      // Call API with new position (0-based)
      const newPosition = currentIndex + 1; // Moving down increases position by 1

      try {
        await reorderItem({ collectionId, itemId: id, position: newPosition });
        // Allow query refetch to update the state
        isOptimisticUpdateRef.current = false;
      } catch (error) {
        toast.error("Failed to move item down");
        // Revert on error
        isOptimisticUpdateRef.current = false;
        setItems(previousItems);
        console.error(error);
      }
    },
    [isOwner, isReordering, items, collectionId, reorderItem],
  );

  // Helper: Fetch additional pages if needed
  const fetchPagesIfNeeded = React.useCallback(
    async (targetPosition: number) => {
      const currentLoadedCount = allItems.length;
      if (targetPosition <= currentLoadedCount || !hasNextPage) {
        return itemsResults;
      }

      const toastId = toast.loading("Loading more items...");
      try {
        const itemsPerPage = itemsResults?.pages[0]?.results.length || 25;
        const pagesNeeded = Math.ceil(targetPosition / itemsPerPage);
        const currentPages = itemsResults?.pages.length || 0;
        const pagesToFetch = pagesNeeded - currentPages;

        let latestQueryResult = itemsResults;
        for (let i = 0; i < pagesToFetch && hasNextPage; i++) {
          const result = await fetchNextPage();
          if (result.data) {
            latestQueryResult = result.data;
          }
        }

        toast.success("Items loaded", { id: toastId });
        return latestQueryResult;
      } catch (error) {
        toast.error("Failed to load items", { id: toastId });
        throw error;
      }
    },
    [allItems.length, hasNextPage, itemsResults, fetchNextPage],
  );

  // Helper: Validate and prepare reorder operation
  const validateReorder = React.useCallback((sortedItems: CollectionItem[], itemId: number, targetPosition: number) => {
    const currentIndex = sortedItems.findIndex(i => i.id === itemId);
    if (currentIndex === -1) {
      toast.error("Item not found");
      return null;
    }

    const targetIndex = targetPosition - 1; // Convert 1-based to 0-based
    if (targetIndex === currentIndex) {
      return null;
    }

    if (targetIndex >= sortedItems.length) {
      toast.error(`Cannot move to position ${targetPosition}. Only ${sortedItems.length} items available.`);
      return null;
    }

    return { currentIndex, targetIndex };
  }, []);

  // Helper: Execute reorder with optimistic update
  const executeReorder = React.useCallback(
    async (sortedItems: CollectionItem[], itemId: number, currentIndex: number, targetIndex: number) => {
      const previousItems = items;

      try {
        isOptimisticUpdateRef.current = true;
        const newItems = [...sortedItems];
        const [removed] = newItems.splice(currentIndex, 1);
        newItems.splice(targetIndex, 0, removed);
        setItems(newItems);

        await reorderItem({ collectionId, itemId, position: targetIndex });
        isOptimisticUpdateRef.current = false;
      } catch (error) {
        toast.error("Failed to reorder item");
        isOptimisticUpdateRef.current = false;
        setItems(previousItems);
        console.error(error);
      }
    },
    [items, collectionId, reorderItem],
  );

  const handlePositionChange = React.useCallback(
    async (id: number, newPosition: number) => {
      if (!isOwner || isReordering) {
        return;
      }

      try {
        const queryResult = await fetchPagesIfNeeded(newPosition);
        const currentAllItems = queryResult?.pages.flatMap(page => page.results) || [];
        const sortedItems = [...currentAllItems].sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

        const validation = validateReorder(sortedItems, id, newPosition);
        if (!validation) {
          return;
        }

        await executeReorder(sortedItems, id, validation.currentIndex, validation.targetIndex);
      } catch (error) {
        console.error(error);
      }
    },
    [isOwner, isReordering, fetchPagesIfNeeded, validateReorder, executeReorder],
  );

  const renderItem = React.useCallback(
    (item: CollectionItem, index: number) => (
      <SortableRankingRow
        key={item.id}
        id={String(item.id)}
        rank={index + 1}
        totalItems={totalCount}
        title={item.game.title}
        coverImageId={item.game.cover_image_id}
        description={item.description}
        onDescriptionClick={
          isOwner
            ? () =>
                setEditingItem({
                  id: item.id,
                  title: item.game.title,
                  description: item.description,
                })
            : undefined
        }
        isOwner={isOwner}
        onRemove={onRemove ? () => onRemove(item.id, item.game.title) : undefined}
        onItemMove={handleItemMove}
        onMoveUp={() => handleMoveUp(item.id)}
        onMoveDown={() => handleMoveDown(item.id)}
        onPositionChange={(newPosition: number) => handlePositionChange(item.id, newPosition)}
      />
    ),
    [totalCount, handleItemMove, handleMoveUp, handleMoveDown, handlePositionChange, isOwner, onRemove],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" style={{ height: "calc(100vh - 200px)" }}>
      {/* Collection Stats */}
      <div className="flex items-center justify-between sticky top-4 z-30 bg-linear-to-r from-primary-50 to-secondary-50 p-4 rounded-2xl border border-primary-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-white"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-black text-primary-600 leading-none">{totalCount}</div>
            <div className="text-xs font-semibold text-text-500 uppercase tracking-wider mt-0.5">Total Games</div>
          </div>
        </div>
      </div>

      <VirtualList
        ref={virtualListRef}
        items={items}
        renderItem={renderItem}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        itemHeight={120}
        overscan={5}
        getItemKey={item => item.id}
        className="flex-1"
      />

      {editingItem && (
        <EditDescriptionModal
          gameTitle={editingItem.title}
          currentDescription={editingItem.description}
          onClose={() => setEditingItem(null)}
          onSave={handleDescriptionSave}
        />
      )}
    </div>
  );
});
