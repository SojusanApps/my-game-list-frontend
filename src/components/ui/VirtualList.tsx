import React, { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/utils/cn";

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  className?: string;
  itemHeight?: number;
  overscan?: number;
  getItemKey?: (item: T, index: number) => React.Key;
}

/**
 * A virtualized list component for high-performance rendering of large vertical lists.
 * Handles infinite loading automatically.
 */
export const VirtualList = React.forwardRef(function VirtualList<T>(
  {
    items,
    renderItem,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    className,
    itemHeight = 120,
    overscan = 5,
    getItemKey,
  }: VirtualListProps<T>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const internalRef = useRef<HTMLDivElement>(null);
  const parentRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

  const itemCount = items.length + (hasNextPage ? 1 : 0);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!virtualItems.length || !hasNextPage || isFetchingNextPage || !fetchNextPage) {
      return;
    }

    const lastVirtualItem = virtualItems.at(-1);
    if (lastVirtualItem && lastVirtualItem.index >= itemCount - 2) {
      fetchNextPage();
    }
  }, [virtualItems, hasNextPage, isFetchingNextPage, fetchNextPage, itemCount]);

  return (
    <div
      ref={parentRef}
      className={cn("h-full overflow-auto custom-scrollbar", className)}
      style={{
        contain: "strict",
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map(virtualItem => {
          const isLoaderRow = virtualItem.index >= items.length;
          const item = isLoaderRow ? null : items[virtualItem.index];

          let itemKey: React.Key;
          if (isLoaderRow) {
            itemKey = `loader-${virtualItem.key}`;
          } else if (getItemKey && item) {
            itemKey = getItemKey(item, virtualItem.index);
          } else {
            itemKey = virtualItem.key;
          }

          return (
            <div
              key={itemKey}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {isLoaderRow ? (
                <div className="flex justify-center items-center h-full py-4">
                  {isFetchingNextPage ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    <div className="h-4" />
                  )}
                </div>
              ) : (
                item && renderItem(item, virtualItem.index)
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}) as <T>(props: VirtualListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }) => React.ReactElement;
