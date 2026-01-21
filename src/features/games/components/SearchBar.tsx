import * as React from "react";
import { Link } from "react-router-dom";
import { useGetGamesList } from "@/features/games/hooks/gameQueries";
import { GameSimpleList } from "@/client";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import SearchIcon from "@/components/ui/Icons/Search";
import XMarkIcon from "@/components/ui/Icons/XMark";
import { useDebounce } from "@/utils/hooks";
import { SafeImage } from "@/components/ui/SafeImage";

export default function SearchBar(): React.JSX.Element {
  const [search, setSearch] = React.useState<string>("");
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data: gamesDetails, isLoading } = useGetGamesList(
    { title: debouncedSearch },
    { enabled: debouncedSearch.length > 1 },
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    setSearch("");
    setIsOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setIsOpen(event.target.value.length > 1);
  };

  const handleInputFocus = () => {
    if (search.length > 1) {
      setIsOpen(true);
    }
  };

  const renderResults = () => {
    if (isLoading) {
      return <li className="p-8 text-center text-text-500 italic text-sm">Searching...</li>;
    }

    if (gamesDetails?.results && gamesDetails.results.length > 0) {
      return gamesDetails.results.map((game: GameSimpleList) => (
        <li key={game.id} className="w-full">
          <Link
            to={`/game/${game.id}`}
            className="flex items-center gap-4 p-3 hover:bg-primary-50/80 active:bg-primary-100 transition-all duration-200 group rounded-lg"
            onClick={handleClose}
          >
            <div className="relative overflow-hidden rounded-md shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
              <SafeImage
                className="w-10 h-14 object-cover"
                src={game.cover_image_id ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.THUMB_90_90) : undefined}
                alt={game.title}
              />
            </div>
            <div className="flex flex-col overflow-hidden transition-transform duration-300 group-hover:translate-x-1">
              <span className="font-bold text-text-900 text-sm truncate group-hover:text-primary-600 transition-colors">
                {game.title}
              </span>
              {game.release_date && (
                <span className="text-xs text-text-500 font-medium">{new Date(game.release_date).getFullYear()}</span>
              )}
            </div>
          </Link>
        </li>
      ));
    }

    return <li className="p-8 text-center text-text-500 italic text-sm">No results found</li>;
  };

  return (
    <section ref={containerRef} className="relative w-full max-w-md mx-4">
      <div className="relative group">
        <input
          type="text"
          placeholder="Search for a game..."
          className="w-full bg-white/10 border border-white/20 text-white placeholder:text-primary-300 rounded-full py-2 pl-4 pr-10 focus:outline-hidden focus:ring-2 focus:ring-primary-400 focus:bg-white/20 focus:border-transparent transition-all text-sm"
          autoComplete="off"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          value={search}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {search.length > 0 ? (
            <button onClick={handleClose} type="button" className="text-primary-300 hover:text-white transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          ) : (
            <SearchIcon className="w-5 h-5 text-primary-400" />
          )}
        </div>
      </div>

      {isOpen && search.length > 1 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-2xl border border-background-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="p-1 max-h-[60vh] overflow-y-auto flex flex-col gap-1">
            {renderResults()}
            <li className="p-1">
              <Link
                to="/search"
                onClick={handleClose}
                className="block text-center text-xs font-bold text-primary-600 hover:bg-primary-50 active:bg-primary-100 rounded-lg py-3 uppercase tracking-wider transition-colors"
              >
                Advanced Search
              </Link>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}
