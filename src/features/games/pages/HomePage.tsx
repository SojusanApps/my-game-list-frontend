import * as React from "react";

import ItemOverlay from "@/components/ui/ItemOverlay";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { Link } from "react-router-dom";
import { useGetGamesList } from "../hooks/gameQueries";
import { PageMeta } from "@/components/ui/PageMeta";
import { Game } from "@/client";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HomePage(): React.JSX.Element {
  const { data: highestRatedGames, isLoading: isHighestRatedLoading } = useGetGamesList({
    ordering: ["rank_position"],
  });
  const { data: mostPopularGames, isLoading: isMostPopularLoading } = useGetGamesList({ ordering: ["popularity"] });
  const { data: recentlyAddedGames, isLoading: isRecentlyAddedLoading } = useGetGamesList({
    ordering: ["-created_at"],
  });

  const renderGameList = (games: Game[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="aspect-264/374 w-full" />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {games?.slice(0, 7).map((game: Game) => (
          <ItemOverlay
            key={game.id}
            className="w-full"
            name={game.title}
            itemPageUrl={`/game/${game.id}`}
            itemCoverUrl={
              game.cover_image_id !== undefined
                ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.COVER_BIG_264_374)
                : null
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <PageMeta title="Home" />
      <div className="grid grid-rows-3 gap-8 max-w-[60%] mx-auto">
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Highest Rated Games &gt;</p>
          <Link to="/search" className="font-bold text-secondary-950 text-xl text-right">
            View More
          </Link>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="col-span-2">{renderGameList(highestRatedGames?.results, isHighestRatedLoading)}</div>
        </div>
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Most Popular Games &gt;</p>
          <Link to="/search" className="font-bold text-secondary-950 text-xl text-right">
            View More
          </Link>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="col-span-2">{renderGameList(mostPopularGames?.results, isMostPopularLoading)}</div>
        </div>
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Recently Added Games &gt;</p>
          <Link to="/search" className="font-bold text-secondary-950 text-xl text-right">
            View More
          </Link>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="col-span-2">{renderGameList(recentlyAddedGames?.results, isRecentlyAddedLoading)}</div>
        </div>
      </div>
    </div>
  );
}
