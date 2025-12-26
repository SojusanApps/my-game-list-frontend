import * as React from "react";
import { Link } from "react-router-dom";

import ImagePlaceholder from "@/assets/images/Image_Placeholder.svg";

type ItemOverlayProps = {
  coverImage?: string;
  className?: string;
  itemPageUrl: string;
  itemCoverUrl?: string | null;
  name: string;
};

function ItemOverlay({
  className,
  coverImage = ImagePlaceholder,
  name = "Name Placeholder",
  itemPageUrl,
  itemCoverUrl,
}: Readonly<ItemOverlayProps>): React.JSX.Element {
  return (
    <div className={`relative max-w-40 max-h-55 hover:shadow-lg ${className}`}>
      <Link to={`${itemPageUrl}`}>
        <img className="w-40 h-55" src={itemCoverUrl ?? coverImage} alt={name} />
        <div className="absolute inset-0 bg-white transition-opacity ease-in duration-150 opacity-0 hover:opacity-30" />
        <div className="absolute inset-0 flex h-fit items-center justify-center bg-linear-to-b from-transparent via-gray-500 to-gray-800 mt-auto pt-5">
          <h2 className="text-white text-xs font-bold mb-2">{name}</h2>
        </div>
      </Link>
    </div>
  );
}

export default ItemOverlay;
