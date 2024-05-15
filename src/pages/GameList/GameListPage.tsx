import * as React from "react";
import { useParams } from "react-router-dom";

import GameInfo from "../../components/GameInfo/GameInfo";
import { GameListType } from "../../models/GameList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import StatusCode from "../../helpers/StatusCode";

export default function GameListPage(): React.JSX.Element {
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();
  const [gameListItems, setGameListItems] = React.useState<GameListType[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorFetchingData, setErrorFetchingData] = React.useState<Error | null>(null);
  const observerTarget = React.useRef(null);
  const nextPageUrlRef = React.useRef(undefined);
  const gamesStatusRef = React.useRef("all");
  const isLoadingRef = React.useRef(false);

  const getGameListUrl = () => {
    let baseUrl = `/game/game-lists/?user=${id}`;
    if (gamesStatusRef.current !== "all") {
      baseUrl += `&status=${gamesStatusRef.current}`;
    }
    return baseUrl;
  };

  const fetchData = async () => {
    setIsLoading(true);
    isLoadingRef.current = true;
    setErrorFetchingData(null);

    try {
      let gameListUrl;
      const nextPageUrl = nextPageUrlRef.current;
      if (nextPageUrl === undefined) {
        gameListUrl = getGameListUrl();
      } else if (nextPageUrl === null) {
        return;
      } else {
        gameListUrl = nextPageUrl;
      }

      const response = await axiosPrivate.get(gameListUrl);
      if (response.status === StatusCode.OK) {
        const data = response.data.results;
        setGameListItems(prevItems => [...prevItems, ...data]);
        nextPageUrlRef.current = response.data.next;
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorFetchingData(error);
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          // fetchData only when it is not already running
          if (!isLoadingRef.current) {
            fetchData();
          }
        }
      },
      {
        threshold: 1,
      },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  const handleGamesStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    gamesStatusRef.current = event.target.value;
    setGameListItems([]);
    nextPageUrlRef.current = undefined;
    fetchData();
  };

  return (
    <div>
      <div className="flex flex-col gap-8 max-w-[60%] mt-2 mx-auto">
        <div className="join mx-auto" onChange={handleGamesStatusChange}>
          <input className="join-item btn min-w-32" value="all" type="radio" name="options" aria-label="ALL" />
          <input className="join-item btn min-w-32" value="C" type="radio" name="options" aria-label="Completed" />
          <input className="join-item btn min-w-32" value="PTP" type="radio" name="options" aria-label="Plan to Play" />
          <input className="join-item btn min-w-32" value="P" type="radio" name="options" aria-label="Playing" />
          <input className="join-item btn min-w-32" value="D" type="radio" name="options" aria-label="Dropped" />
          <input className="join-item btn min-w-32" value="OH" type="radio" name="options" aria-label="On Hold" />
        </div>
        <div>
          <div className="grid grid-cols-7 gap-1">
            {gameListItems.map(gameListItem => (
              <div key={gameListItem.id}>
                <GameInfo
                  className="flex-none"
                  title={gameListItem.title}
                  gamePageUrl={gameListItem.game_id}
                  gameCoverUrl={gameListItem.game_cover_image}
                />
              </div>
            ))}
          </div>
          {isLoading && <p>Loading ...</p>}
          {errorFetchingData && <p>Error: {errorFetchingData.message}</p>}
          <div ref={observerTarget} />
        </div>
      </div>
    </div>
  );
}
