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
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CollectionItem } from "@/client";
import { SortableRankingRow } from "./SortableRankingRow";
import { Button } from "@/components/ui/Button";
import { useReorderCollectionItems } from "../../hooks/useCollectionQueries";
import toast from "react-hot-toast";

interface RankingListViewProps {
  collectionId: number;
  initialItems: CollectionItem[];
  isOwner: boolean;
}

export function RankingListView({ collectionId, initialItems, isOwner }: Readonly<RankingListViewProps>) {
  // Sort by order initially
  const sortedInitialItems = React.useMemo(() => {
    return [...initialItems].sort((a, b) => a.order - b.order);
  }, [initialItems]);

  const [items, setItems] = React.useState<CollectionItem[]>(sortedInitialItems);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [isDirty, setIsDirty] = React.useState(false);

  const { mutateAsync: reorderItems, isPending: isSaving } = useReorderCollectionItems();

  React.useEffect(() => {
    setItems(sortedInitialItems);
    setIsDirty(false);
  }, [sortedInitialItems]);

  const sensorOptions = React.useMemo(
    () => ({
      pointer: {
        activationConstraint: {
          distance: 5,
        },
      },
      keyboard: {
        coordinateGetter: sortableKeyboardCoordinates,
      },
    }),
    [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, sensorOptions.pointer),
    useSensor(KeyboardSensor, sensorOptions.keyboard),
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (!isOwner) return;
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isOwner) return;
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems(prev => {
        const oldIndex = prev.findIndex(i => String(i.id) === String(active.id));
        const newIndex = prev.findIndex(i => String(i.id) === String(over.id));
        const newArray = arrayMove(prev, oldIndex, newIndex);
        setIsDirty(true);
        return newArray;
      });
    }

    setActiveId(null);
  };

  const handleDescriptionChange = (id: number, description: string) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, description } : item)));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!isDirty) return;

    try {
      const reorderPayload = items.map((item, index) => ({
        id: item.id,
        order: index + 1, // 1-based ranking
        description: item.description,
      }));

      await reorderItems({
        collectionId,
        items: reorderPayload,
      });

      toast.success("Ranking saved successfully!");
      setIsDirty(false);
    } catch (error) {
      toast.error("Failed to save ranking");
      console.error(error);
    }
  };

  const handleReset = () => {
    setItems(sortedInitialItems);
    setIsDirty(false);
  };

  const activeItem = activeId ? items.find(i => String(i.id) === activeId) : null;

  return (
    <div className="flex flex-col gap-6">
      {isOwner && isDirty && (
        <div className="flex justify-between items-center bg-secondary-50 p-4 rounded-2xl border border-secondary-100 sticky top-4 z-40 shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-secondary-500 animate-pulse" />
            <span className="text-sm font-bold text-secondary-900 uppercase tracking-wider">
              Unsaved ranking changes
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isSaving}>
              Reset
            </Button>
            <Button size="sm" variant="secondary" onClick={handleSave} isLoading={isSaving}>
              Save Ranking
            </Button>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={React.useMemo(() => items.map(i => String(i.id)), [items])}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {items.map((item, index) => (
              <SortableRankingRow
                key={item.id}
                id={String(item.id)}
                rank={index + 1}
                title={item.game.title}
                coverImageId={item.game.cover_image_id}
                description={item.description}
                onDescriptionChange={(newDesc: string) => handleDescriptionChange(item.id, newDesc)}
                isOwner={isOwner}
              />
            ))}
          </div>
        </SortableContext>

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
            <SortableRankingRow
              id={String(activeItem.id)}
              rank={items.findIndex(i => i.id === activeItem.id) + 1}
              title={activeItem.game.title}
              coverImageId={activeItem.game.cover_image_id}
              description={activeItem.description}
              isOwner={isOwner}
              className="cursor-grabbing shadow-2xl border-primary-500 scale-[1.02]"
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
