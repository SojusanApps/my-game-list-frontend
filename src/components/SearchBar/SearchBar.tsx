import * as React from "react";

import PlaceholderImage from "@/assets/images/Image_Placeholder.svg";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { Link } from "react-router-dom";
import { useGetGamesList } from "@/features/games/hooks/gameQueries";
import SearchIcon from "../Icons/Search";
import XMarkIcon from "../Icons/XMark";

export default function SearchBar(): React.JSX.Element {
  const [search, setSearch] = React.useState<string>("");
  const { data: gamesDetails } = useGetGamesList({ title: search }, { enabled: search !== "" });

  const handleClose = () => {
    setSearch("");
  };

  return (
    <section>
      <div className="dropdown dropdown-bottom">
        <div className="inline-flex items-center px-5 relative">
          <div className="flex grow">
            <input
              type="text"
              placeholder="Search for the game..."
              className="border border-gray-200 bg-background-100 rounded-l-md py-1 px-2 pr-8 w-full"
              autoComplete="off"
              onChange={event => setSearch(event.target.value)}
              value={search}
            />
            <div className="block border bg-background-200 py-1 rounded-r-md">
              {search.length > 0 ? (
                <button onClick={handleClose} type="button">
                  <XMarkIcon className="w-6 h-6 text-gray-400 hover:text-gray-500" />
                </button>
              ) : (
                <SearchIcon className="h-6 w-8 text-gray-400 hover:text-gray-500" />
              )}
            </div>
          </div>
        </div>
        <div className="">
          <ul className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box min-w-64">
            {gamesDetails?.results && gamesDetails?.results?.length > 0 ? (
              gamesDetails?.results.map(game => (
                <li key={game.id}>
                  <Link to={`/game/${game.id}`} className="group">
                    <img
                      className="w-10 h-12.5 group-hover:w-17.5 group-hover:h-20"
                      src={
                        game.cover_image_id
                          ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.THUMB_90_90)
                          : PlaceholderImage
                      }
                      alt={game.title}
                    />
                    <p>{game.title}</p>
                  </Link>
                </li>
              ))
            ) : (
              <p>No results</p>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
