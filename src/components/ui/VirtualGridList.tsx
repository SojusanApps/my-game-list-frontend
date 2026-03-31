import React, { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Group, Loader } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
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

const BREAKPOINTS = [
  { minWidth: 1408, maxCols8: 8, maxCols7: 7, maxCols5: 5, maxCols4: 4 },
  { minWidth: 1200, maxCols8: 6, maxCols7: 5, maxCols5: 5, maxCols4: 4 },
  { minWidth: 992, maxCols8: 4, maxCols7: 4, maxCols5: 4, maxCols4: 3 },
  { minWidth: 768, maxCols8: 3, maxCols7: 3, maxCols5: 3, maxCols4: 2 },
  { minWidth: 0, maxCols8: 2, maxCols7: 2, maxCols5: 2, maxCols4: 1 },
];

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
  columnCount: propColumnCount,
  rowHeight: propRowHeight,
  gap = 6,
}: Readonly<VirtualGridListProps<T>>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { width: viewportWidth } = useViewportSize();

  const getCols = () => {
    const defaultCols = propColumnCount ?? 7;
    const breakpoint = BREAKPOINTS.find(bp => viewportWidth >= bp.minWidth);

    if (!breakpoint || viewportWidth === 0) return defaultCols;

    switch (defaultCols) {
      case 8:
        return breakpoint.maxCols8;
      case 7:
        return breakpoint.maxCols7;
      case 5:
        return breakpoint.maxCols5;
      case 4:
        return breakpoint.maxCols4;
      default:
        return defaultCols;
    }
  };
  const columnCount = getCols();

  const getRowHeight = () => {
    if (viewportWidth === 0) return propRowHeight ?? 300;

    // Assume max width container of roughly 1280px minus padding
    const containerWidth = Math.min(viewportWidth, 1280) - 32;
    const itemWidth = containerWidth / columnCount;

    if (propRowHeight) {
      const desktopCols = propColumnCount ?? 7;
      // 1248 is a typical 1280 max-width wrapper minus 32px padding
      const expectedDesktopWidth = 1248 / desktopCols;
      // Deduced ratio using rowHeight and expected desktop width
      const ratio = propRowHeight / expectedDesktopWidth;
      return itemWidth * ratio;
    }

    // Scale height by typical aspect ratio 1.42 plus gap/padding allowance
    const computedHeight = itemWidth * 1.42 + gap * 4 + 8;
    return Math.max(200, Math.min(computedHeight, 450));
  };
  const rowHeight = getRowHeight();

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
        height: "calc(100vh - 250px)",
        minHeight: style?.height ? undefined : "500px",
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
