import * as React from "react";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { GameType } from "../../models/Game";
import GameCarousel from "../../components/GameCarousel/GameCarousel";

export default function HomePage(): React.JSX.Element {
  const [highestRatedGames, setHighestRatedGames] = React.useState<GameType[] | null>(null);
  const [mostPopularGames, setMostPopularGames] = React.useState<GameType[] | null>(null);
  const [recentlyAddedGames, setRecentlyAddedGames] = React.useState<GameType[] | null>(null);
  const axiosPrivate = useAxiosPrivate();

  React.useEffect(() => {
    const fetchHighestRatedGames = async () => {
      const queryParams = {
        ordering: "rank_position",
      };
      const params = new URLSearchParams(queryParams);
      const response = await axiosPrivate.get(`/game/games/?${params}`);
      if (response.status === 200) {
        setHighestRatedGames(response.data.results.slice(0, 10));
      }
    };

    const fetchMostPopularGames = async () => {
      const queryParams = {
        ordering: "popularity",
      };
      const params = new URLSearchParams(queryParams);
      const response = await axiosPrivate.get(`/game/games/?${params}`);
      if (response.status === 200) {
        setMostPopularGames(response.data.results.slice(0, 10));
      }
    };

    const fetchRecentlyAddedGames = async () => {
      const queryParams = {
        ordering: "-created_at",
      };
      const params = new URLSearchParams(queryParams);
      const response = await axiosPrivate.get(`/game/games/?${params}`);
      if (response.status === 200) {
        setRecentlyAddedGames(response.data.results.slice(0, 10));
      }
    };

    fetchHighestRatedGames();
    fetchMostPopularGames();
    fetchRecentlyAddedGames();
  }, []);

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
          <p className="font-bold text-xl">Recently Added Games &gt;</p>
          <p className="font-bold text-secondary-950 text-xl text-right">View More</p>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="col-span-2">
            <GameCarousel gamesArray={recentlyAddedGames} />
          </div>
        </div>
      </div>
    </div>
  );
}
