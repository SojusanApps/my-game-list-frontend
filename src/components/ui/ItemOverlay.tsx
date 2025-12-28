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
};

function ItemOverlay({
  className,
  name = "Name Placeholder",
  itemPageUrl,
  itemCoverUrl,
  variant = "cover",
}: Readonly<ItemOverlayProps>): React.JSX.Element {
  const isLogo = variant === "logo";

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
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-primary-950/20 transition-colors duration-300" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/95 via-black/70 to-transparent pt-12 pb-3 px-3 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <h2 className="text-white text-[10px] font-bold leading-tight line-clamp-2 text-center group-hover:text-primary-300 transition-colors tracking-tight uppercase">
            {name}
          </h2>
        </div>
      </Link>
    </div>
  );
}

export default ItemOverlay;
