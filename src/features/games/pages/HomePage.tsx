import * as React from "react";

import ItemOverlay from "@/components/ui/ItemOverlay";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { Link } from "react-router-dom";
import { useGetGamesList } from "../hooks/gameQueries";
import { PageMeta } from "@/components/ui/PageMeta";
import { Game } from "@/client";

export default function HomePage(): React.JSX.Element {
  const { data: highestRatedGames } = useGetGamesList({ ordering: ["rank_position"] });
  const { data: mostPopularGames } = useGetGamesList({ ordering: ["popularity"] });
  const { data: recentlyAddedGames } = useGetGamesList({ ordering: ["-created_at"] });

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
          <div className="col-span-2">
            <div className="grid grid-cols-7 gap-1">
              {highestRatedGames?.results?.slice(0, 7).map((game: Game) => (
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
          </div>
        </div>
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Most Popular Games &gt;</p>
          <Link to="/search" className="font-bold text-secondary-950 text-xl text-right">
            View More
          </Link>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="col-span-2">
            <div className="grid grid-cols-7 gap-1">
              {mostPopularGames?.results.slice(0, 7).map((game: Game) => (
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
          </div>
        </div>
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Recently Added Games &gt;</p>
          <Link to="/search" className="font-bold text-secondary-950 text-xl text-right">
            View More
          </Link>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="col-span-2">
            <div className="grid grid-cols-7 gap-1">
              {recentlyAddedGames?.results.slice(0, 7).map((game: Game) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}