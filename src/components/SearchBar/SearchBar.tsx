import * as React from "react";

import PlaceholderImage from "../../assets/images/Image_Placeholder.svg";
import IGDBImageSize, { getIGDBImageURL } from "../../helpers/IGDBIntegration";
import { GameService, Game } from "../../client";
import { Link } from "react-router-dom";

export default function SearchBar(): React.JSX.Element {
  const [search, setSearch] = React.useState<string>("");
  const [gamesDetails, setGamesDetails] = React.useState<Game[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleClose = () => {
    setSearch("");
    setGamesDetails([]);
  };

  React.useEffect(() => {
    const fetchGamesData = async () => {
      if (search !== "") {
        const { data, response } = await GameService.gameGamesList({
          query: {
            title: search,
          },
        });
        if (response.status === 200 && data) {
          setGamesDetails(data.results.slice(0, 8));
        }
      }
      if (search === "") {
        setGamesDetails([]);
      }
    };

    fetchGamesData();
  }, [search]);

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
              onChange={handleChange}
              value={search}
            />
            <div className="block border bg-background-200 py-1 rounded-r-md">
              {search.length > 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-400 hover:text-gray-500 cursor-pointer"
                  onClick={handleClose}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-8 text-gray-400 hover:text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
        <div className="">
          <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box min-w-64">
            {gamesDetails?.length > 0 ? (
              gamesDetails?.map(game => (
                <li key={game.id}>
                  <Link to={`/game/${game.id}`} className="group">
                    <img
                      className="w-[40px] h-[50px] group-hover:w-[70px] group-hover:h-[80px]"
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
