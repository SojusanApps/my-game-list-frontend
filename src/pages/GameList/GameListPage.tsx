import * as React from "react";
import { useParams } from "react-router-dom";

import ItemOverlay from "../../components/ItemOverlay/ItemOverlay";
import StatusCode from "../../helpers/StatusCode";
import IGDBImageSize, {getIGDBImageURL} from "../../helpers/IGDBIntegration";
import { GameService, GameList, UserDetail, StatusEnum, UserService } from "../../client";

export default function GameListPage(): React.JSX.Element {
  const { id } = useParams();
  const [userDetails, setUserDetails] = React.useState<UserDetail | null>(null);
  const [gameListItems, setGameListItems] = React.useState<GameList[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorFetchingData, setErrorFetchingData] = React.useState<Error | null>(null);
  const observerTarget = React.useRef(null);
  const nextPageNumberRef = React.useRef<number | null>(1);
  const gamesStatusRef = React.useRef<StatusEnum | null>(null);
  const isLoadingRef = React.useRef(false);

  const fetchData = async () => {
    setIsLoading(true);
    isLoadingRef.current = true;
    setErrorFetchingData(null);

    try {
      if (!id || nextPageNumberRef.current === null) {
        return;
      }

      const {data: responseData, response} = await GameService.gameGameListsList({
        query: {
          user: +id,
          status: gamesStatusRef.current !== null ? [gamesStatusRef.current] : undefined,
          page: nextPageNumberRef.current ?? 1,
        }
      });
      if (response.status === StatusCode.OK && responseData) {
        const data = responseData.results;
        setGameListItems(prevItems => [...prevItems, ...data]);
        if (responseData.next !== null && responseData.next !== undefined) {
          nextPageNumberRef.current = Number(new URL(responseData.next).searchParams.get("page")) || null;
        } else {
          nextPageNumberRef.current = null;
        }
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
    const fetchUserData = async () => {
      if (!id) {
        return;
      }
      const {data: userData, response} = await UserService.userUsersRetrieve({path: {id: +id}});
      if (response.status === 200 && userData) {
        setUserDetails(userData);
      }
    };

    fetchUserData();
  }, []);

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
    if (event.target.value === "all") {
      gamesStatusRef.current = null;
    } else {
      gamesStatusRef.current = event.target.value as StatusEnum;
    }
    setGameListItems([]);
    nextPageNumberRef.current = 1;
    fetchData();
  };

  return (
    <div>
      <div className="flex flex-col gap-8 max-w-[60%] mt-2 mx-auto">
        <p className="text-3xl mx-auto">
          <strong className="text-secondary-950">{userDetails?.username}</strong>&apos;s Game List
        </p>
        <div className="join mx-auto" onChange={handleGamesStatusChange}>
          <input className="join-item btn min-w-32" value="all" type="radio" name="options" aria-label="ALL" />
          <input className="join-item btn min-w-32" value={StatusEnum.C} type="radio" name="options" aria-label="Completed" />
          <input className="join-item btn min-w-32" value={StatusEnum.PTP} type="radio" name="options" aria-label="Plan to Play" />
          <input className="join-item btn min-w-32" value={StatusEnum.P} type="radio" name="options" aria-label="Playing" />
          <input className="join-item btn min-w-32" value={StatusEnum.D} type="radio" name="options" aria-label="Dropped" />
          <input className="join-item btn min-w-32" value={StatusEnum.OH} type="radio" name="options" aria-label="On Hold" />
        </div>
        <div>
          <div className="grid grid-cols-7 gap-1">
            {gameListItems.map(gameListItem => (
              <div key={gameListItem.id}>
                <ItemOverlay
                  className="flex-none"
                  name={gameListItem.title}
                  itemPageUrl={`/game/${gameListItem.game_id}`}
                  itemCoverUrl={getIGDBImageURL(gameListItem.game_cover_image, IGDBImageSize.COVER_BIG_264_374)}
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
