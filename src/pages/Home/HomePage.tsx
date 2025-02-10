import * as React from "react";

import ItemOverlay from "../../components/ItemOverlay/ItemOverlay";
import IGDBImageSize, { getIGDBImageURL } from "../../helpers/IGDBIntegration";
import { GameService, Game } from "../../client";

export default function HomePage(): React.JSX.Element {
  const [highestRatedGames, setHighestRatedGames] = React.useState<Game[] | null>(null);
  const [mostPopularGames, setMostPopularGames] = React.useState<Game[] | null>(null);
  const [recentlyAddedGames, setRecentlyAddedGames] = React.useState<Game[] | null>(null);

  React.useEffect(() => {
    const fetchHighestRatedGames = async () => {
      const {data, response} = await GameService.gameGamesList(
        {
          query: {
            ordering: ["rank_position"],
          }
        });
      if (response.status === 200 && data) {
        setHighestRatedGames(data.results.slice(0, 7));
      }
    };

    const fetchMostPopularGames = async () => {
      const {data, response} = await GameService.gameGamesList(
        {
          query: {
            ordering: ["popularity"],
          }
        });
      if (response.status === 200 && data) {
        setMostPopularGames(data.results.slice(0, 7));
      }
    };

    const fetchRecentlyAddedGames = async () => {
      const {data, response} = await GameService.gameGamesList(
        {
          query: {
            ordering: ["-created_at"],
          }
        });
      if (response.status === 200 && data) {
        setRecentlyAddedGames(data.results.slice(0, 7));
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
          <a href="/search" className="font-bold text-secondary-950 text-xl text-right">View More</a>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="col-span-2">
            <div className="flex gap-1">
              {highestRatedGames?.map(game => (
                <ItemOverlay
                  key={game.id}
                  className="flex-none"
                  name={game.title}
                  itemPageUrl={`/game/${game.id}`}
                  itemCoverUrl={game.cover_image_id !== undefined ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.COVER_BIG_264_374) : null}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Most Popular Games &gt;</p>
          <a href="/search" className="font-bold text-secondary-950 text-xl text-right">View More</a>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="col-span-2">
            <div className="flex gap-1">
              {mostPopularGames?.map(game => (
                <ItemOverlay
                  key={game.id}
                  className="flex-none"
                  name={game.title}
                  itemPageUrl={`/game/${game.id}`}
                  itemCoverUrl={game.cover_image_id !== undefined ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.COVER_BIG_264_374) : null}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <p className="font-bold text-xl">Recently Added Games &gt;</p>
          <a href="/search" className="font-bold text-secondary-950 text-xl text-right">View More</a>
          <hr className="col-span-2 h-px my-1 bg-gray-400 border-0" />
          <div className="col-span-2">
            <div className="flex gap-1">
              {recentlyAddedGames?.map(game => (
                <ItemOverlay
                  key={game.id}
                  className="flex-none"
                  name={game.title}
                  itemPageUrl={`/game/${game.id}`}
                  itemCoverUrl={game.cover_image_id !== undefined ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.COVER_BIG_264_374) : null}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
