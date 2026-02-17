import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { cn } from "@/utils/cn";

interface RankingRowProps {
  rank: number;
  totalItems: number;
  title: string;
  coverImageId?: string | null;
  description?: string;
  onDescriptionClick?: () => void;
  className?: string;
  isOwner: boolean;
  onRemove?: () => void;
  isDragging?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onPositionChange?: (newPosition: number) => void;
}

export const RankingRow = React.memo(
  ({
    rank,
    totalItems,
    title,
    coverImageId,
    description,
    onDescriptionClick,
    className,
    isOwner,
    onRemove,
    isDragging,
    onMoveUp,
    onMoveDown,
    onPositionChange,
  }: Readonly<RankingRowProps>) => {
    const [isEditingPosition, setIsEditingPosition] = React.useState(false);
    const [positionInput, setPositionInput] = React.useState(String(rank));

    const hasDescription = description && description.trim().length > 0;

    // Update position input when rank changes
    React.useEffect(() => {
      setPositionInput(String(rank));
    }, [rank]);

    const handlePositionSubmit = () => {
      const newPosition = Number.parseInt(positionInput, 10);
      if (!Number.isNaN(newPosition) && newPosition >= 1 && newPosition <= totalItems && newPosition !== rank) {
        onPositionChange?.(newPosition);
      }
      setIsEditingPosition(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handlePositionSubmit();
      } else if (e.key === "Escape") {
        setPositionInput(String(rank));
        setIsEditingPosition(false);
      }
    };

    let buttonVariantClasses = "bg-background-50 border-background-100 text-text-400 hover:text-text-600";
    if (hasDescription) {
      buttonVariantClasses = "bg-secondary-50 border-secondary-100 text-secondary-600";
    }

    // Determine tooltip text
    let tooltipText: string | undefined;
    if (hasDescription) {
      tooltipText = description;
    } else if (isOwner) {
      tooltipText = "Add/View note";
    }

    return (
      <div
        className={cn(
          "flex flex-col gap-3 p-4 bg-white rounded-2xl border border-background-200 shadow-sm group relative",
          isOwner && !isDragging && "hover:border-primary-300 hover:shadow-md",
          isDragging && "opacity-50",
          className,
        )}
      >
        <div className="flex items-center gap-4">
          {/* Rank display with controls */}
          <div className="flex items-center gap-2">
            {isOwner && (
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={onMoveUp}
                  disabled={rank === 1}
                  className="p-1 rounded-lg bg-background-50 border border-background-100 text-text-400 hover:text-text-600 hover:bg-primary-50 hover:border-primary-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Move up"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path
                      fillRule="evenodd"
                      d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={onMoveDown}
                  disabled={rank === totalItems}
                  className="p-1 rounded-lg bg-background-50 border border-background-100 text-text-400 hover:text-text-600 hover:bg-primary-50 hover:border-primary-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Move down"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path
                      fillRule="evenodd"
                      d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
            {isEditingPosition && isOwner ? (
              <input
                type="number"
                min={1}
                max={totalItems}
                value={positionInput}
                onChange={e => setPositionInput(e.target.value)}
                onBlur={handlePositionSubmit}
                onKeyDown={handleKeyDown}
                className="w-14 h-10 rounded-xl bg-primary-50 border-2 border-primary-300 text-sm font-black text-primary-600 text-center focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            ) : (
              <button
                type="button"
                onClick={() => isOwner && setIsEditingPosition(true)}
                disabled={!isOwner}
                className={cn(
                  "flex items-center justify-center w-14 h-10 rounded-xl bg-background-50 text-sm font-black text-primary-600 shrink-0 border border-background-100 shadow-xs transition-all",
                  isOwner ? "cursor-pointer hover:bg-primary-50 hover:border-primary-200 active:cursor-grabbing" : "",
                )}
                title={isOwner ? "Click to edit position" : undefined}
              >
                #{rank}
              </button>
            )}
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
              onClick={onDescriptionClick}
              disabled={!isOwner}
              className={cn(
                "relative p-2 rounded-xl transition-all border tooltip tooltip-left",
                buttonVariantClasses,
                !isOwner && "cursor-default",
              )}
              data-tip={tooltipText}
              title={!hasDescription && !isOwner ? "No note" : undefined}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              {hasDescription && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-500"></span>
                </span>
              )}
            </button>

            {isOwner && onRemove && (
              <button
                type="button"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-2 rounded-xl bg-error-50 border border-error-100 text-error-400 hover:text-error-600 transition-all opacity-0 group-hover:opacity-100"
                title="Remove from collection"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 006 3.75V4H5a1 1 0 000 2h.25v8.25A2.75 2.75 0 008 17h4a2.75 2.75 0 002.75-2.75V6H15a1 1 0 100-2h-1V3.75A2.75 2.75 0 0011.25 1h-2.5zM8 4V3.75c0-.414.336-.75.75-.75h2.5c.414 0 .75.336.75.75V4H8zM6.75 6v8.25c0 .414.336.75.75.75h4c.414 0 .75-.336.75-.75V6h-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            {isOwner && (
              <div className="flex flex-col gap-1 px-2 opacity-30 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                <div className="w-1 h-1 rounded-full bg-text-400" />
                <div className="w-1 h-1 rounded-full bg-text-400" />
                <div className="w-1 h-1 rounded-full bg-text-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

RankingRow.displayName = "RankingRow";
