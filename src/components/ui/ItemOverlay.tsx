import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { SafeImage } from "./SafeImage";
import { getStatusConfig } from "@/features/games/utils/statusConfig";

type ItemOverlayProps = {
  className?: string;
  itemPageUrl: string;
  itemCoverUrl?: string | null;
  name: string;
  variant?: "cover" | "logo";
  gameType?: string | null;
  releaseDate?: string | null;
  rating?: number | null;
  status?: string | null;
};

function ItemOverlay({
  className,
  name = "Name Placeholder",
  itemPageUrl,
  itemCoverUrl,
  variant = "cover",
  gameType,
  releaseDate,
  rating,
  status,
}: Readonly<ItemOverlayProps>): React.JSX.Element {
  const isLogo = variant === "logo";

  const releaseYear = React.useMemo(() => {
    if (!releaseDate) return null;
    try {
      const date = new Date(releaseDate);
      return Number.isNaN(date.getTime()) ? null : date.getFullYear();
    } catch {
      return null;
    }
  }, [releaseDate]);

  const ratingBadgeClass = React.useMemo(() => {
    if (rating === null || rating === undefined) return "";
    if (rating < 5) return "bg-red-300/90 border-red-200/50";
    if (rating < 8) return "bg-yellow-300/90 border-yellow-200/50";
    return "bg-emerald-300/90 border-emerald-200/50";
  }, [rating]);

  return (
    <div
      className={cn(
        "relative group flex flex-col overflow-hidden rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        "bg-background-900 shadow-lg hover:shadow-2xl ring-1 ring-white/5",
        isLogo ? "aspect-3/2" : "aspect-264/374",
        className,
      )}
    >
      <Link to={itemPageUrl} className="block w-full h-full relative overflow-hidden">
        {/* Poster Image with Parallax Shift */}
        <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:-translate-y-4">
          <SafeImage
            className="w-full h-full"
            src={itemCoverUrl || undefined}
            alt={name}
            loading="lazy"
            objectFit={isLogo ? "contain" : "cover"}
          />
        </div>

        {/* Top Badges (Floating Chips) */}
        <div className="absolute top-3 inset-x-3 flex justify-between items-start z-20 pointer-events-none">
          <div className="flex flex-col gap-1.5">
            {gameType && (
              <span className="bg-primary-600/90 text-white text-[8px] px-2 py-0.5 rounded-md uppercase font-black tracking-tighter backdrop-blur-md shadow-lg border border-white/10 w-fit">
                {gameType}
              </span>
            )}
          </div>

          {rating !== null && rating !== undefined && (
            <div
              className={cn(
                "text-black text-[10px] font-black px-1.5 py-0.5 rounded-md backdrop-blur-md shadow-lg border",
                ratingBadgeClass,
              )}
            >
              {rating.toFixed(1)}
            </div>
          )}

          {status && (
            <div
              className={cn(
                "text-[10px] font-black px-1.5 py-0.5 rounded-md backdrop-blur-md shadow-lg border",
                getStatusConfig(status)?.activeStyles || "bg-background-800/90 text-white border-white/10",
              )}
            >
              {getStatusConfig(status)?.emoji}
            </div>
          )}
        </div>

        {/* Dynamic Info Anchor (Bottom) */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
            "bg-linear-to-t from-black via-black/80 to-transparent",
            "p-4 pt-16",
          )}
        >
          <div className="flex flex-col gap-1.5">
            {/* Title - Auto-expanding with image shift */}
            <h2
              className={cn(
                "text-[11px] font-bold leading-[1.2] text-white tracking-tight drop-shadow-md transition-colors duration-300",
                "group-hover:text-primary-300 line-clamp-2 group-hover:line-clamp-4",
              )}
            >
              {name}
            </h2>

            {/* Metadata Line */}
            <div className="flex items-center gap-2">
              {releaseYear && (
                <span className="text-[9px] font-black text-white/40 tracking-widest uppercase">{releaseYear}</span>
              )}
              <div className="h-px flex-1 bg-white/10 group-hover:bg-primary-500/30 transition-colors" />
            </div>
          </div>
        </div>

        {/* Overlay Lens (Subtle contrast boost on hover) */}
        <div className="absolute inset-0 bg-primary-950/0 group-hover:bg-primary-950/10 transition-colors duration-500 pointer-events-none" />
      </Link>
    </div>
  );
}

export default ItemOverlay;
