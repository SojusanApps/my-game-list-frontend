import React, { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/utils/cn";

interface VirtualGridListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  className?: string;
  columnCount?: number;
  rowHeight?: number;
}

/**
 * A virtualized grid list component for high-performance rendering of large datasets.
 * Encapsulates TanStack Virtual logic and handles infinite loading.
 */
export function VirtualGridList<T>({
  items,
  renderItem,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  className,
  columnCount = 7,
  rowHeight = 300,
}: Readonly<VirtualGridListProps<T>>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowCount = Math.ceil(items.length / columnCount) + (hasNextPage ? 1 : 0);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 3,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    if (!virtualRows.length || !hasNextPage || isFetchingNextPage || !fetchNextPage) return;

    const lastVirtualRow = virtualRows.at(-1);
    if (lastVirtualRow && lastVirtualRow.index >= rowCount - 2) {
      fetchNextPage();
    }
  }, [virtualRows, hasNextPage, isFetchingNextPage, fetchNextPage, rowCount]);

  return (
    <div
      ref={parentRef}
      className={cn("h-200 overflow-auto custom-scrollbar px-2", className)}
      style={{
        contain: "strict",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualRows.map(virtualRow => {
          const isLoaderRow = virtualRow.index >= Math.ceil(items.length / columnCount);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
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
                <div
                  className={cn("grid gap-6 py-2", {
                    "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7": columnCount === 7,
                    "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4": columnCount === 4,
                    "grid-cols-2": columnCount === 2,
                    "grid-cols-3": columnCount === 3,
                    "grid-cols-5": columnCount === 5,
                  })}
                >
                  {items
                    .slice(virtualRow.index * columnCount, (virtualRow.index + 1) * columnCount)
                    .map((item, index) => {
                      const absoluteIndex = virtualRow.index * columnCount + index;
                      return <div key={`v-grid-item-${absoluteIndex}`}>{renderItem(item, absoluteIndex)}</div>;
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
