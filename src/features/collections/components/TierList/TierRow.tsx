import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/utils/cn";
import { SortableGameCard } from "./SortableGameCard";
import { CollectionItem } from "@/client";

interface TierRowProps {
  id: string;
  label: string;
  colorClass: string;
  items: CollectionItem[];
}

export function TierRow({ id, label, colorClass, items }: Readonly<TierRowProps>) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="flex w-full min-h-24 bg-background-50 rounded-xl overflow-hidden border border-background-200 shadow-sm transition-all hover:border-background-300"
    >
      {/* Tier Label */}
      <div
        className={cn(
          "flex items-center justify-center w-20 md:w-28 shrink-0 font-black text-2xl md:text-3xl text-white shadow-inner",
          colorClass,
        )}
      >
        {label}
      </div>

      {/* Drop Zone & Sortable Items */}
      <div className="flex-1 flex flex-wrap items-center gap-3 p-3">
        <SortableContext
          items={React.useMemo(() => items.map(i => String(i.id)), [items])}
          strategy={rectSortingStrategy}
        >
          {items.map(item => (
            <SortableGameCard
              key={item.id}
              id={String(item.id)}
              gameId={item.game.id}
              title={item.game.title}
              coverImageId={item.game.cover_image_id}
            />
          ))}
          {items.length === 0 && (
            <div className="text-[10px] font-black text-text-300 uppercase tracking-widest ml-4">Drop games here</div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
