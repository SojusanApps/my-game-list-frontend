import * as React from "react";

import GameCarousel from "../../components/GameCarousel/GameCarousel";

export default function HomePage(): React.JSX.Element {
  const highestRatedGames: string[][] = [
    ["1", "High Rated Game 1", "test1"],
    ["2", "High Rated Game 2", "test2"],
    ["3", "High Rated Game 3", "test3"],
    ["4", "High Rated Game 4", "test4"],
    ["5", "High Rated Game 5", "test5"],
    ["6", "High Rated Game 6", "test6"],
    ["7", "High Rated Game 7", "test7"],
    ["8", "High Rated Game 8", "test8"],
    ["9", "High Rated Game 9", "test9"],
    ["10", "High Rated Game 10", "test10"],
  ];

  const mostPopularGames: string[][] = [
    ["1", "Most Popular Game 1", "test1"],
    ["2", "Most Popular Game 2", "test2"],
    ["3", "Most Popular Game 3", "test3"],
    ["4", "Most Popular Game 4", "test4"],
    ["5", "Most Popular Game 5", "test5"],
    ["6", "Most Popular Game 6", "test6"],
    ["7", "Most Popular Game 7", "test7"],
    ["8", "Most Popular Game 8", "test8"],
    ["9", "Most Popular Game 9", "test9"],
    ["10", "Most Popular Game 10", "test10"],
  ];

  const recentlyReleasedGames: string[][] = [
    ["1", "Recently Released Game 1", "test1"],
    ["2", "Recently Released Game 2", "test2"],
    ["3", "Recently Released Game 3", "test3"],
    ["4", "Recently Released Game 4", "test4"],
    ["5", "Recently Released Game 5", "test5"],
    ["6", "Recently Released Game 6", "test6"],
    ["7", "Recently Released Game 7", "test7"],
    ["8", "Recently Released Game 8", "test8"],
    ["9", "Recently Released Game 9", "test9"],
    ["10", "Recently Released Game 10", "test10"],
  ];

  return (
    <div>
      <div className="grid grid-rows-3 gap-8 max-w-[60%] mx-auto">
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Highest Rated Games &gt;</p>
          <p className="font-bold text-secondary-950 text-xl text-right">View More</p>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="col-span-2">
            <GameCarousel gamesArray={highestRatedGames} />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Most Popular Games &gt;</p>
          <p className="font-bold text-secondary-950 text-xl text-right">View More</p>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="col-span-2">
            <GameCarousel gamesArray={mostPopularGames} />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Recently Released Games &gt;</p>
          <p className="font-bold text-secondary-950 text-xl text-right">View More</p>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="col-span-2">
            <GameCarousel gamesArray={recentlyReleasedGames} />
          </div>
        </div>
      </div>
    </div>
  );
}
