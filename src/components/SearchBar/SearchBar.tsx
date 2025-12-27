import * as React from "react";
import { Link } from "react-router-dom";
import { useGetGamesList } from "@/features/games/hooks/gameQueries";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import PlaceholderImage from "@/assets/images/Image_Placeholder.svg";
import SearchIcon from "../Icons/Search";
import XMarkIcon from "../Icons/XMark";
import { cn } from "@/utils/cn";

export default function SearchBar(): React.JSX.Element {
  const [search, setSearch] = React.useState<string>("");
  const { data: gamesDetails, isLoading } = useGetGamesList({ title: search }, { enabled: search.length > 1 });

  const handleClose = () => {
    setSearch("");
  };

  return (
    <section className="relative w-full max-w-md mx-4">
      <div className={cn("dropdown w-full", search.length > 1 && "dropdown-open")}>
        <div className="relative group">
          <input
            type="text"
            placeholder="Search for a game..."
            className="w-full bg-background-100 border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-hidden focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all"
            autoComplete="off"
            onChange={event => setSearch(event.target.value)}
            value={search}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {search.length > 0 ? (
              <button
                onClick={handleClose}
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            ) : (
              <SearchIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {search.length > 1 && (
          <div className="dropdown-content z-50 mt-2 w-full bg-base-100 rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <ul className="menu p-0 max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <li className="p-4 text-center text-gray-500 italic">Searching...</li>
              ) : gamesDetails?.results && gamesDetails.results.length > 0 ? (
                gamesDetails.results.map(game => (
                  <li key={game.id} className="border-b border-gray-50 last:border-0">
                    <Link
                      to={`/game/${game.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-secondary-50 active:bg-secondary-100 transition-colors rounded-none"
                      onClick={handleClose}
                    >
                      <img
                        className="w-12 h-16 object-cover rounded shadow-sm"
                        src={
                          game.cover_image_id
                            ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.THUMB_90_90)
                            : PlaceholderImage
                        }
                        alt={game.title}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm line-clamp-1">{game.title}</span>
                        {game.release_date && (
                          <span className="text-xs text-gray-500">{new Date(game.release_date).getFullYear()}</span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="p-4 text-center text-gray-500 italic">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
