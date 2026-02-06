import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SafeImage } from "@/components/ui/SafeImage";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { cn } from "@/utils/cn";

interface SortableRankingRowProps {
  id: string;
  rank: number;
  title: string;
  coverImageId?: string | null;
  description?: string;
  onDescriptionChange?: (description: string) => void;
  className?: string;
  isOwner: boolean;
}

export function SortableRankingRow({
  id,
  rank,
  title,
  coverImageId,
  description,
  onDescriptionChange,
  className,
  isOwner,
}: Readonly<SortableRankingRowProps>) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !isOwner,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const hasDescription = description && description.trim().length > 0;

  let buttonVariantClasses = "bg-background-50 border-background-100 text-text-400 hover:text-text-600";
  if (isExpanded) {
    buttonVariantClasses = "bg-primary-50 border-primary-100 text-primary-600";
  } else if (hasDescription) {
    buttonVariantClasses = "bg-secondary-50 border-secondary-100 text-secondary-600";
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col gap-3 p-4 bg-white rounded-2xl border border-background-200 shadow-sm transition-all animate-in fade-in group",
        isOwner && !isDragging && "hover:border-primary-300 hover:shadow-md",
        isDragging && "opacity-50 z-50 scale-[1.02] border-primary-500 shadow-xl",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div
          {...attributes}
          {...(isOwner ? listeners : {})}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl bg-background-50 text-sm font-black text-primary-600 shrink-0 border border-background-100 shadow-xs",
            isOwner ? "cursor-grab active:cursor-grabbing" : "",
          )}
        >
          #{rank}
        </div>

        <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 shadow-xs border border-background-100">
          <SafeImage
            src={getIGDBImageURL(coverImageId ?? "", IGDBImageSize.COVER_SMALL_90_128)}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-black text-text-900 line-clamp-1 uppercase tracking-tight text-sm md:text-base">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn("relative p-2 rounded-xl transition-all border", buttonVariantClasses)}
            title={isExpanded ? "Hide note" : "Add/View note"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            {hasDescription && !isExpanded && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-500"></span>
              </span>
            )}
          </button>

          {isOwner && (
            <div
              {...attributes}
              {...(isOwner ? listeners : {})}
              className="flex flex-col gap-1 px-2 opacity-30 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
              <div className="w-1 h-1 rounded-full bg-text-400" />
              <div className="w-1 h-1 rounded-full bg-text-400" />
              <div className="w-1 h-1 rounded-full bg-text-400" />
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="pl-14 pr-2 animate-in slide-in-from-top-2 duration-200">
          <textarea
            placeholder="Why is this game in this position?"
            value={description ?? ""}
            onChange={e => onDescriptionChange?.(e.target.value)}
            disabled={!isOwner}
            className={cn(
              "w-full min-h-24 bg-background-50 rounded-xl border-none p-4 text-sm text-text-700 placeholder:text-text-400 focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all resize-none custom-scrollbar shadow-inner",
              !isOwner && "bg-transparent p-0 min-h-0 italic text-text-500 shadow-none",
            )}
          />
        </div>
      )}
    </div>
  );
}
