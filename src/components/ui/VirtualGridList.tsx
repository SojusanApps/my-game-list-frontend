import React, { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Group, Loader } from "@mantine/core";
import { cn } from "@/utils/cn"; // cn still used for custom-scrollbar merging

interface VirtualGridListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  className?: string;
  style?: React.CSSProperties;
  columnCount?: number;
  rowHeight?: number;
  gap?: number;
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
  style,
  columnCount = 7,
  rowHeight = 300,
  gap = 6,
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
    <Box
      ref={parentRef}
      className={cn("custom-scrollbar", className)}
      style={{
        height: "800px",
        overflow: "auto",
        padding: "32px",
        margin: "-32px -24px",
        contain: "strict",
        ...style,
      }}
    >
      <Box
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualRows.map(virtualRow => {
          const isLoaderRow = virtualRow.index >= Math.ceil(items.length / columnCount);

          return (
            <Box
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
                <Group justify="center" align="center" style={{ height: "100%", paddingBlock: "16px" }}>
                  {isFetchingNextPage ? <Loader size="md" /> : <Box style={{ height: "16px" }} />}
                </Group>
              ) : (
                <Box
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                    gap: `${gap * 0.25}rem`,
                    paddingBlock: "8px",
                  }}
                >
                  {items
                    .slice(virtualRow.index * columnCount, (virtualRow.index + 1) * columnCount)
                    .map((item, index) => {
                      const absoluteIndex = virtualRow.index * columnCount + index;
                      return <Box key={`v-grid-item-${absoluteIndex}`}>{renderItem(item, absoluteIndex)}</Box>;
                    })}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
