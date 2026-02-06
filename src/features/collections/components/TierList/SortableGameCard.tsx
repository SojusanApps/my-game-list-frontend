import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SafeImage } from "@/components/ui/SafeImage";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { cn } from "@/utils/cn";

interface SortableGameCardProps {
  id: string;
  gameId: number;
  title: string;
  coverImageId?: string | null;
  className?: string;
}

export function SortableGameCard({ id, title, coverImageId, className }: Readonly<SortableGameCardProps>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative w-24 aspect-3/4 shrink-0 cursor-grab active:cursor-grabbing group",
        isDragging && "opacity-50 z-50",
        className,
      )}
    >
      <div className="w-full h-full rounded-lg overflow-hidden border-2 border-transparent group-hover:border-primary-500 transition-all shadow-md">
        <SafeImage
          src={getIGDBImageURL(coverImageId ?? "", IGDBImageSize.COVER_BIG_264_374)}
          alt={title}
          className="w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1 pointer-events-none">
          <span className="text-[8px] font-bold text-white line-clamp-2 leading-none uppercase tracking-tighter">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}
