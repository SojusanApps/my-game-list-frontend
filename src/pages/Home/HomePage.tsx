import * as React from "react";

import TopBar from "../../components/TopBar/TopBar";
import GameInfo from "../../components/GameInfo/GameInfo";

export default function HomePage(): React.JSX.Element {
  const highestRatedGames: string[][] = [
    ["1", "Game Title", "test"],
    ["2", "Game Title", "test"],
    ["3", "Game Title", "test"],
    ["4", "Game Title", "test"],
    ["5", "Game Title", "test"],
    ["6", "Game Title", "test"],
    ["7", "Game Title", "test"],
    ["8", "Game Title", "test"],
    ["9", "Game Title", "test"],
    ["10", "Game Title", "test"],
  ];

  const mostPopularGames: string[][] = [
    ["1", "Game Title", "test"],
    ["2", "Game Title", "test"],
    ["3", "Game Title", "test"],
    ["4", "Game Title", "test"],
    ["5", "Game Title", "test"],
    ["6", "Game Title", "test"],
    ["7", "Game Title", "test"],
    ["8", "Game Title", "test"],
    ["9", "Game Title", "test"],
    ["10", "Game Title", "test"],
  ];

  const recentlyReleasedGames: string[][] = [
    ["1", "Game Title", "test"],
    ["2", "Game Title", "test"],
    ["3", "Game Title", "test"],
    ["4", "Game Title", "test"],
    ["5", "Game Title", "test"],
    ["6", "Game Title", "test"],
    ["7", "Game Title", "test"],
    ["8", "Game Title", "test"],
    ["9", "Game Title", "test"],
    ["10", "Game Title", "test"],
  ];

  return (
    <div>
      <TopBar />
      <div className="grid grid-rows-3 gap-8 max-w-[60%] pt-20 mx-auto">
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Highest Rated Games &gt;</p>
          <p className="font-bold text-secondary-950 text-xl text-right">View More</p>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="flex space-x-1 mt-1 col-span-2 overflow-x-scroll">
            {/* `key` -> should be the ID of the object */}
            {highestRatedGames.map(game => (
              <GameInfo className="flex-none" key={game[0]} title={game[1]} gamePageUrl={game[2]} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Most Popular Games &gt;</p>
          <p className="font-bold text-secondary-950 text-xl text-right">View More</p>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="flex space-x-1 mt-1 col-span-2 overflow-x-scroll">
            {/* `key` -> should be the ID of the object */}
            {mostPopularGames.map(game => (
              <GameInfo className="flex-none" key={game[0]} title={game[1]} gamePageUrl={game[2]} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Recently Released Games &gt;</p>
          <p className="font-bold text-secondary-950 text-xl text-right">View More</p>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="flex space-x-1 mt-1 col-span-2 overflow-x-scroll">
            {/* `key` -> should be the ID of the object */}
            {recentlyReleasedGames.map(game => (
              <GameInfo className="flex-none" key={game[0]} title={game[1]} gamePageUrl={game[2]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
