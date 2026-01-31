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
    className={cn("w-5 h-5", filled ? "text-red-500" : "text-white")}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.04 3 5.5L12 21l7-7Z" />
  </svg>
);

export default function CollectionCard({ className, collection }: Readonly<CollectionCardProps>) {
  const images = collection.items_cover_image_ids || [];

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 p-4 rounded-3xl bg-white border border-background-200 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1",
        className,
      )}
    >
      {/* Deck of Cards Container */}
      <Link to={`/collection/${collection.id}`} className="relative aspect-[3/4] w-full mb-2">
        <div className="absolute inset-0 flex items-center justify-center">
          {images.length === 0 ? (
            <div className="w-full h-full rounded-2xl bg-background-100 flex items-center justify-center border-2 border-dashed border-background-300">
              <span className="text-text-400 text-xs font-bold uppercase tracking-widest">No Games</span>
            </div>
          ) : (
            images
              .slice(0, 5)
              .reverse()
              .map((hash, index) => {
                const total = Math.min(images.length, 5);
                const pos = total - 1 - index; // 0 is topmost
                return (
                  <div
                    key={`${collection.id}-preview-${hash}-${pos}`}
                    className="absolute w-[88%] aspect-264/374 rounded-xl overflow-hidden shadow-lg border border-white/20 transition-all duration-500 ease-out group-hover:scale-105"
                    style={{
                      zIndex: index,
                      transform: `
                        translateX(${pos * 14}px) 
                        translateY(${pos * -10}px) 
                        rotate(${pos * 3.5}deg)
                      `,
                      opacity: 1 - pos * 0.12,
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
        </div>

        {/* Favorite Badge */}
        <div className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
          <HeartIcon filled={collection.is_favorite} />
        </div>

        {/* Item Count Badge */}
        <div className="absolute bottom-2 left-2 z-10 px-3 py-1 rounded-full bg-primary-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-tighter shadow-lg border border-white/10">
          {collection.items_count} {collection.items_count === 1 ? "Game" : "Games"}
        </div>
      </Link>

      {/* Collection Info */}
      <div className="flex flex-col gap-1 px-1">
        <Link to={`/collection/${collection.id}`}>
          <h3 className="text-sm font-black text-text-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {collection.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-text-400 uppercase tracking-widest">
            By {collection.user.username}
          </span>
          <span className="text-[10px] font-bold text-primary-500/80 uppercase tracking-widest">
            {collection.visibility_display}
          </span>
        </div>
      </div>
    </div>
  );
}
