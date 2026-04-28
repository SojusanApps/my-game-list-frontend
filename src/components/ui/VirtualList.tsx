import React, { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Group, Loader } from "@mantine/core";
import { cn } from "@/utils/cn";

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  className?: string;
  style?: React.CSSProperties;
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
    style,
    itemHeight = 120,
    overscan = 5,
    getItemKey,
  }: VirtualListProps<T>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const internalRef = useRef<HTMLDivElement>(null);
  const parentRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

  const itemCount = items.length + (hasNextPage ? 1 : 0);

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
    <Box
      ref={parentRef}
      className={cn("custom-scrollbar", className)}
      style={{
        height: "100%",
        overflow: "auto",
        contain: "strict",
        ...style,
      }}
    >
      <Box
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
            <Box
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
                <Group justify="center" align="center" style={{ height: "100%", paddingBlock: "16px" }}>
                  {isFetchingNextPage ? <Loader size="md" /> : <Box style={{ height: "16px" }} />}
                </Group>
              ) : (
                item && renderItem(item, virtualItem.index)
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}) as <T>(props: VirtualListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }) => React.ReactElement;
