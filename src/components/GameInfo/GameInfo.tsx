import * as React from "react";

import GameInfoPlaceholder from "../../assets/images/GameInfo_Placeholder.svg";

type GameInfoProps = {
  coverImage: string;
  title: string;
  gamePageUrl: string;
};

function GameInfo({
  coverImage = GameInfoPlaceholder,
  title = "Game Title Placeholder",
  gamePageUrl = "/",
}: Readonly<GameInfoProps>): React.JSX.Element {
  return (
    <div className="relative max-w-[160px] max-h-[220px] hover:shadow-lg">
      <a href={gamePageUrl}>
        <img className="w-[160px] h-[220px]" src={coverImage} alt={title} />
        <div className="absolute inset-0 bg-white transition-opacity ease-in duration-150 opacity-0 hover:opacity-30" />
        <div className="absolute inset-0 flex h-fit items-center justify-center bg-gradient-to-b from-transparent via-gray-500 to-gray-800 mt-auto pt-5">
          <h2 className="text-white text-xs font-bold mb-2">{title}</h2>
        </div>
      </a>
    </div>
  );
}

export default GameInfo;
