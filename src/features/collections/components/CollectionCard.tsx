import * as React from "react";
import { Link } from "react-router-dom";
import { Collection } from "@/client";
import { cn } from "@/utils/cn";
import { SafeImage } from "@/components/ui/SafeImage";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";

interface CollectionCardProps {
  className?: string;
  collection: Collection;
}

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("w-5 h-5", filled ? "text-red-500" : "text-text-400")}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.04 3 5.5L12 21l7-7Z" />
  </svg>
);

export default function CollectionCard({ className, collection }: Readonly<CollectionCardProps>) {
  const images = collection.items_cover_image_ids || [];
  const deckLimit = 5;

  const visibilityClasses = React.useMemo(() => {
    if (collection.visibility === "PUB") {
      return "bg-success/10 text-success-600 border-success/10";
    }
    if (collection.visibility === "FRI") {
      return "bg-primary/10 text-primary-600 border-primary/10";
    }
    return "bg-neutral/10 text-neutral-600 border-neutral-100";
  }, [collection.visibility]);

  const modeClasses = React.useMemo(() => {
    return collection.mode === "S"
      ? "bg-secondary/10 text-secondary-600 border-secondary/10"
      : "bg-warning/10 text-warning-700 border-warning/10";
  }, [collection.mode]);

  return (
    <div className={cn("group relative flex flex-col items-center pt-8", className)}>
      {/* Deck View (Sits on top) */}
      <Link
        to={`/collection/${collection.id}`}
        className="relative w-[75%] aspect-3/4 -mb-10 z-10 transition-transform duration-500 ease-out group-hover:-translate-y-4"
      >
        {images.length === 0 ? (
          <div className="w-full h-full rounded-2xl bg-background-100 flex items-center justify-center border-2 border-dashed border-background-300 shadow-sm">
            <span className="text-text-400 text-[10px] font-bold uppercase tracking-widest">Empty</span>
          </div>
        ) : (
          images
            .slice(0, deckLimit)
            .reverse()
            .map((hash, index) => {
              const total = Math.min(images.length, deckLimit);
              const pos = total - 1 - index; // 0 is topmost
              return (
                <div
                  key={`${collection.id}-preview-${hash}-${pos}`}
                  className="absolute inset-0 rounded-xl overflow-hidden shadow-lg border border-white/40 transition-all duration-500 ease-out"
                  style={{
                    zIndex: index,
                    transform: `
                        translateX(${pos * 14}px)
                        translateY(${pos * -8}px)
                        rotate(${pos * 4}deg)
                      `,
                  }}
                >
                  <SafeImage
                    src={getIGDBImageURL(hash ?? "", IGDBImageSize.COVER_BIG_264_374)}
                    alt={`Game ${pos + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })
        )}

        {/* Favorite Badge (Floating on deck top-right) */}
        {collection.is_favorite && (
          <div className="absolute -top-2 -right-2 z-20 p-1.5 rounded-full bg-white shadow-md border border-background-100">
            <HeartIcon filled />
          </div>
        )}
      </Link>

      {/* Info Card (Base) */}
      <div className="w-full flex flex-col pt-12 pb-5 px-5 rounded-3xl bg-white border border-background-200 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-primary-100 relative z-0">
        <div className="flex flex-col gap-1.5 text-center">
          <Link to={`/collection/${collection.id}`} className="block">
            <h3
              className="text-lg font-black text-text-900 group-hover:text-primary-600 transition-colors line-clamp-1"
              title={collection.name}
            >
              {collection.name}
            </h3>
          </Link>

          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="text-xs font-medium text-text-500">
              by{" "}
              <Link
                to={`/profile/${collection.user.id}`}
                className="font-bold text-text-700 hover:text-primary-600 transition-colors"
              >
                {collection.user.username}
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                  visibilityClasses,
                )}
              >
                {collection.visibility_display}
              </span>

              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                  modeClasses,
                )}
              >
                {collection.mode_display}
              </span>

              <span className="text-xs font-black text-text-700">
                {collection.items_count} {collection.items_count === 1 ? "Game" : "Games"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
