import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { cn } from "@/utils/cn";
import { PencilIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { EditDescriptionModal } from "./EditDescriptionModal";

interface GameCardProps {
  title: string;
  coverImageId?: string | null;
  className?: string;
  description?: string;
  isOwner?: boolean;
  onRemove?: () => void;
  onDescriptionChange?: (description: string) => void;
}

export const GameCard = (props: GameCardProps) => {
  const { title, coverImageId, className, description, isOwner, onRemove, onDescriptionChange } = props;
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSaveDescription = (newDescription: string) => {
    onDescriptionChange?.(newDescription);
  };

  return (
    <>
      <div className={cn("relative w-24 aspect-3/4 shrink-0 group", className)}>
        <div className="w-full h-full rounded-lg overflow-hidden border-2 border-transparent group-hover:border-primary-500 transition-all shadow-md cursor-grab active:cursor-grabbing">
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

        {/* Description Icons - Top Left */}
        <div className="absolute top-1 left-1 z-30 flex gap-1">
          {/* Question Mark Icon (visible when description exists) */}
          {description && (
            <div className="tooltip tooltip-right" data-tip={description}>
              <div className="p-1 rounded-full bg-info-500 text-white shadow-lg">
                <QuestionMarkCircleIcon className="w-3 h-3" />
              </div>
            </div>
          )}

          {/* Pencil Icon (visible for owners, shown on hover) */}
          {isOwner && onDescriptionChange && (
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="p-1 rounded-full bg-primary-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
              title="Edit description"
            >
              <PencilIcon className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Remove Button - Top Right */}
        {onRemove && (
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -top-2 -right-2 z-30 p-1.5 rounded-full bg-error-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
            title="Remove from collection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75V4H5a1 1 0 000 2h.25v8.25A2.75 2.75 0 008 17h4a2.75 2.75 0 002.75-2.75V6H15a1 1 0 100-2h-1V3.75A2.75 2.75 0 0011.25 1h-2.5zM8 4V3.75c0-.414.336-.75.75-.75h2.5c.414 0 .75.336.75.75V4H8zM6.75 6v8.25c0 .414.336.75.75.75h4c.414 0 .75-.336.75-.75V6h-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {isModalOpen && onDescriptionChange && (
        <EditDescriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialDescription={description}
          gameName={title}
          onSave={handleSaveDescription}
        />
      )}
    </>
  );
};
