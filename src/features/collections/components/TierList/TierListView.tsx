import * as React from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  CollisionDetection,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CollectionItem, TierEnum, BlankEnum } from "@/client";
import { TierRow } from "./TierRow";
import { SortableGameCard } from "./SortableGameCard";
import { Button } from "@/components/ui/Button";
import { useUpdateCollectionItem } from "../../hooks/useCollectionQueries";
import toast from "react-hot-toast";

interface TierListViewProps {
  initialItems: CollectionItem[];
  isOwner: boolean;
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

export function TierListView({ initialItems, isOwner }: Readonly<TierListViewProps>) {
  const [items, setItems] = React.useState<CollectionItem[]>(initialItems);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [dirtyIds, setDirtyIds] = React.useState<Set<number>>(new Set());

  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateCollectionItem();

  // Update local state when initialItems change (e.g. after a save or fetch)
  React.useEffect(() => {
    setItems(initialItems);
    setDirtyIds(new Set());
  }, [initialItems]);

  const sensors = React.useMemo(
    () => [
      {
        sensor: PointerSensor,
        options: {
          activationConstraint: {
            distance: 5,
          },
        },
      },
      {
        sensor: KeyboardSensor,
        options: {
          coordinateGetter: sortableKeyboardCoordinates,
        },
      },
    ],
    [],
  );

  const dndSensors = useSensors(
    useSensor(sensors[0].sensor, sensors[0].options),
    useSensor(sensors[1].sensor, sensors[1].options),
  );

  const tierItems = React.useMemo(() => {
    const groups: Record<string, CollectionItem[]> = {};
    // Initialize groups
    TIERS.forEach(t => {
      groups[t.id] = [];
    });

    // Distribute items
    items.forEach(item => {
      const tierId = !item.tier || (item.tier as string) === BlankEnum[""] ? "UNRANKED" : item.tier;
      if (groups[tierId]) {
        groups[tierId].push(item);
      } else {
        // Fallback for unexpected tiers
        if (!groups["UNRANKED"]) groups["UNRANKED"] = [];
        groups["UNRANKED"].push(item);
      }
    });

    return groups;
  }, [items]);

  const customCollisionDetection: CollisionDetection = React.useCallback(args => {
    // First, check for pointer collisions (good for small hits)
    const pointerCollisions = pointerWithin(args);
    const firstPointerCollision = getFirstCollision(pointerCollisions, "id");

    if (firstPointerCollision) {
      // If we hit a tier row directly, prioritize it
      const isTierRow = TIERS.some(t => t.id === firstPointerCollision);
      if (isTierRow) {
        return pointerCollisions;
      }
    }

    // Fallback to rectIntersection which is better for larger containers
    const rectCollisions = rectIntersection(args);
    const firstRectCollision = getFirstCollision(rectCollisions, "id");

    if (firstRectCollision) {
      const isTierRow = TIERS.some(t => t.id === firstRectCollision);
      if (isTierRow) {
        return rectCollisions;
      }
    }

    // If no container hit, default to closestCenter for sorting items
    return closestCenter(args);
  }, []);

  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      if (!isOwner) return;
      setActiveId(String(event.active.id));
    },
    [isOwner],
  );

  const handleDragOver = React.useCallback(
    (event: DragOverEvent) => {
      if (!isOwner) return;
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const draggedId = String(active.id);
      const overId = String(over.id);
      const overTier = TIERS.find(t => t.id === overId);

      setItems(prev => {
        const activeItemIndex = prev.findIndex(i => String(i.id) === draggedId);
        if (activeItemIndex === -1) return prev;

        const activeItem = prev[activeItemIndex];
        let targetTier: TierEnum | BlankEnum | undefined;

        if (overTier) {
          targetTier = overTier.id === "UNRANKED" ? BlankEnum[""] : (overTier.id as TierEnum);
        } else {
          const overItem = prev.find(i => String(i.id) === overId);
          if (overItem) targetTier = overItem.tier as TierEnum;
        }

        if (targetTier && activeItem.tier !== targetTier) {
          const newItems = [...prev];
          newItems[activeItemIndex] = { ...activeItem, tier: targetTier as TierEnum };
          return newItems;
        }

        return prev;
      });
    },
    [isOwner],
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      if (!isOwner) return;
      const { active, over } = event;
      const draggedId = String(active.id);

      if (over && active.id !== over.id) {
        const overId = String(over.id);

        setItems(prev => {
          const activeIndex = prev.findIndex(i => String(i.id) === draggedId);
          const overIndex = prev.findIndex(i => String(i.id) === overId);

          if (activeIndex !== -1 && overIndex !== -1) {
            return arrayMove(prev, activeIndex, overIndex);
          }
          return prev;
        });
      }

      // Sync dirty state after drag operation is complete
      const finalItem = items.find(i => String(i.id) === draggedId);
      const initialItem = initialItems.find(i => String(i.id) === draggedId);

      if (finalItem && initialItem) {
        const isDirty = (finalItem.tier || BlankEnum[""]) !== (initialItem.tier || BlankEnum[""]);
        setDirtyIds(prev => {
          const next = new Set(prev);
          if (isDirty) next.add(finalItem.id);
          else next.delete(finalItem.id);
          return next;
        });
      }

      setActiveId(null);
    },
    [isOwner, items, initialItems],
  );

  const handleSave = React.useCallback(async () => {
    if (dirtyIds.size === 0) {
      toast.error("No changes to save");
      return;
    }

    // Filter items that are actually dirty to avoid unnecessary overhead in the map
    const itemsToUpdate = items.filter(item => dirtyIds.has(item.id));

    try {
      const promises = itemsToUpdate.map(item =>
        updateItem({
          id: item.id,
          body: { tier: item.tier || BlankEnum[""] },
        }),
      );

      await Promise.all(promises);
      toast.success("Tiers updated successfully!");
      setDirtyIds(new Set());
    } catch (error) {
      toast.error("Failed to update some tiers");
      console.error(error);
    }
  }, [dirtyIds, items, updateItem]);

  const activeItem = activeId ? items.find(i => String(i.id) === activeId) : null;

  return (
    <div className="flex flex-col gap-8">
      {isOwner && dirtyIds.size > 0 && (
        <div className="flex justify-between items-center bg-primary-50 p-4 rounded-2xl border border-primary-100 sticky top-4 z-40 shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-bold text-primary-900">
              You have {dirtyIds.size} unsaved tier {dirtyIds.size === 1 ? "change" : "changes"}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setItems(initialItems);
                setDirtyIds(new Set());
              }}
              disabled={isUpdating}
            >
              Reset
            </Button>
            <Button size="sm" onClick={handleSave} isLoading={isUpdating}>
              Save Tiers
            </Button>
          </div>
        </div>
      )}

      <DndContext
        sensors={dndSensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-4">
          {TIERS.map(tier => (
            <TierRow
              key={tier.id}
              id={tier.id}
              label={tier.label}
              colorClass={tier.color}
              items={tierItems[tier.id] || []}
            />
          ))}
        </div>

        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: "0.5",
                },
              },
            }),
          }}
        >
          {activeItem ? (
            <SortableGameCard
              id={String(activeItem.id)}
              gameId={activeItem.game.id}
              title={activeItem.game.title}
              coverImageId={activeItem.game.cover_image_id}
              className="cursor-grabbing"
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
