import * as React from "react";
import { Link } from "react-router-dom";

import GameCoverImagePlaceholder from "../../assets/images/Image_Placeholder.svg";

type GameInfoProps = {
  coverImage?: string;
  className?: string;
  gamePageUrl: number;
  gameCoverUrl: string | null;
  title: string;
};

function GameInfo({
  className,
  coverImage = GameCoverImagePlaceholder,
  title = "Game Title Placeholder",
  gamePageUrl,
  gameCoverUrl,
}: Readonly<GameInfoProps>): React.JSX.Element {
  return (
    <div className={`relative max-w-[160px] max-h-[220px] hover:shadow-lg ${className}`}>
      <Link to={`/game/${gamePageUrl}`}>
        <img className="w-[160px] h-[220px]" src={gameCoverUrl ?? coverImage} alt={title} />
        <div className="absolute inset-0 bg-white transition-opacity ease-in duration-150 opacity-0 hover:opacity-30" />
        <div className="absolute inset-0 flex h-fit items-center justify-center bg-gradient-to-b from-transparent via-gray-500 to-gray-800 mt-auto pt-5">
          <h2 className="text-white text-xs font-bold mb-2">{title}</h2>
        </div>
      </Link>
    </div>
  );
}

export default GameInfo;
