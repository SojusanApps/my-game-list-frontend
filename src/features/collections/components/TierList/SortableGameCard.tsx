import * as React from "react";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { GameCard } from "./GameCard";
import { cn } from "@/utils/cn";

interface SortableGameCardProps {
  id: string;
  tierId: string;
  index: number;
  title: string;
  coverImageId?: string | null;
  description?: string;
  className?: string;
  onRemove?: () => void;
  onDescriptionChange?: (description: string) => void;
  isOwner: boolean;
  onReorder?: (itemId: string, tierId: string, targetIndex: number, edge: Edge | null) => void;
}

export const SortableGameCard = React.memo(function SortableGameCard(props: SortableGameCardProps) {
  const {
    id,
    tierId,
    index,
    title,
    coverImageId,
    description,
    className,
    onRemove,
    onDescriptionChange,
    isOwner,
    onReorder,
  } = props;
  const dragRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [closestEdge, setClosestEdge] = React.useState<Edge | null>(null);

  React.useEffect(() => {
    const element = dragRef.current;
    if (!element || !isOwner) {
      return;
    }

    return combine(
      draggable({
        element,
        getInitialData: () => ({ type: "tier-item", itemId: id, tierId, index }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            render: ({ container }) => {
              // Clone the element to create an accurate preview
              const preview = element.cloneNode(true) as HTMLElement;
              preview.style.cssText = `
                transform: rotate(3deg);
                opacity: 0.9;
                pointer-events: none;
              `;
              container.appendChild(preview);
            },
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "16px",
              y: "8px",
            }),
          });
        },
        onDragStart: () => {
          setIsDragging(true);
        },
        onDrop: () => {
          setIsDragging(false);
        },
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          // Can drop any tier item except itself
          return source.data.type === "tier-item" && source.data.itemId !== id;
        },
        getData: ({ input }) => {
          const data = { itemId: id, tierId, index };
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["left", "right"],
          });
        },
        onDrag: ({ self, source }) => {
          const edge = extractClosestEdge(self.data);
          const sourceIndex = source.data.index as number;
          const sourceTierId = source.data.tierId as string;

          // Hide indicator for no-op drops
          if (
            sourceTierId === tierId &&
            (index === sourceIndex ||
              (edge === "right" && index === sourceIndex - 1) ||
              (edge === "left" && index === sourceIndex + 1))
          ) {
            setClosestEdge(null);
          } else {
            setClosestEdge(edge);
          }
        },
        onDragEnter: ({ self }) => {
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: ({ source, self }) => {
          const edge = extractClosestEdge(self.data);
          setClosestEdge(null);

          const sourceItemId = source.data.itemId as string;

          if (sourceItemId && onReorder) {
            onReorder(sourceItemId, tierId, index, edge);
          }
        },
      }),
    );
  }, [id, tierId, index, isOwner, onReorder, title]);

  return (
    <div
      ref={dragRef}
      className={cn(
        "cursor-grab active:cursor-grabbing relative",
        className,
        isDragging && "opacity-30",
        !isOwner && "cursor-default",
      )}
    >
      <GameCard
        title={title}
        coverImageId={coverImageId}
        description={description}
        isOwner={isOwner}
        onRemove={onRemove}
        onDescriptionChange={onDescriptionChange}
      />
      {/* Show placeholder box at destination */}
      {closestEdge && (
        <div className="absolute inset-0 border-2 border-dashed border-primary-400 rounded-lg pointer-events-none" />
      )}
      {/* Show drop indicator line at destination */}
      {closestEdge && <DropIndicator edge={closestEdge} gap="4px" />}
      {/* Show dashed border at source when dragging */}
      {isDragging && (
        <div className="absolute inset-0 border-2 border-dashed border-primary-400 rounded-lg pointer-events-none" />
      )}
    </div>
  );
});
