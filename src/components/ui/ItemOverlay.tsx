import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { SafeImage } from "./SafeImage";

type ItemOverlayProps = {
  className?: string;
  itemPageUrl: string;
  itemCoverUrl?: string | null;
  name: string;
};

function ItemOverlay({
  className,
  name = "Name Placeholder",
  itemPageUrl,
  itemCoverUrl,
}: Readonly<ItemOverlayProps>): React.JSX.Element {
  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 bg-background-200 aspect-264/374 w-40",
        className,
      )}
    >
      <Link to={itemPageUrl} className="block w-full h-full">
        <SafeImage
          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
          src={itemCoverUrl || undefined}
          alt={name}
          loading="lazy"
        />
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/60 to-transparent pt-8 pb-2 px-2 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <h2 className="text-white text-xs font-bold leading-tight line-clamp-2 text-center group-hover:text-secondary-400 transition-colors">
            {name}
          </h2>
        </div>
      </Link>
    </div>
  );
}

export default ItemOverlay;
