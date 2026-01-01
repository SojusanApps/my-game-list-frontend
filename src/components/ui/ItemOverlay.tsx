import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { SafeImage } from "./SafeImage";

type ItemOverlayProps = {
  className?: string;
  itemPageUrl: string;
  itemCoverUrl?: string | null;
  name: string;
  variant?: "cover" | "logo";
  gameStatus?: string | null;
  gameType?: string | null;
  releaseDate?: string | null;
};

function ItemOverlay({
  className,
  name = "Name Placeholder",
  itemPageUrl,
  itemCoverUrl,
  variant = "cover",
  gameStatus,
  gameType,
  releaseDate,
}: Readonly<ItemOverlayProps>): React.JSX.Element {
  const isLogo = variant === "logo";

  const releaseYear = React.useMemo(() => {
    if (!releaseDate) return null;
    try {
      return new Date(releaseDate).getFullYear();
    } catch {
      return null;
    }
  }, [releaseDate]);

  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 w-full bg-background-200",
        isLogo ? "aspect-3/2" : "aspect-264/374",
        className,
      )}
    >
      <Link to={itemPageUrl} className="block w-full h-full">
        <SafeImage
          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
          src={itemCoverUrl || undefined}
          alt={name}
          loading="lazy"
          objectFit={isLogo ? "contain" : "cover"}
        />
        {/* Tags */}
        {(gameStatus !== undefined || gameType) && (
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {gameType && (
              <span className="bg-primary-600/80 text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-bold backdrop-blur-xs w-fit">
                {gameType}
              </span>
            )}
            {gameStatus !== undefined && (
              <span className="bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-bold backdrop-blur-xs w-fit">
                {gameStatus ?? "Released"}
              </span>
            )}
            {!gameType && gameStatus === undefined && (
              <span className="bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-bold backdrop-blur-xs w-fit">
                Released
              </span>
            )}
          </div>
        )}
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-primary-950/20 transition-colors duration-300" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/95 via-black/70 to-transparent pt-12 pb-3 px-3 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center">
          <h2 className="line-clamp-2 text-center text-[10px] font-bold leading-tight tracking-tight text-white transition-colors group-hover:text-primary-300">
            {name}
          </h2>
          {releaseYear && <span className="text-[8px] font-medium text-text-400 mt-1">{releaseYear}</span>}
        </div>
      </Link>
    </div>
  );
}

export default ItemOverlay;
