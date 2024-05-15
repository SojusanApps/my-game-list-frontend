import * as React from "react";

import { useParams } from "react-router-dom";

import GameCoverImagePlaceholder from "../../assets/images/Image_Placeholder.svg";
import GameReview from "../../components/GameReview/GameReview";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { GameType } from "../../models/Game";
import { GameReviewType } from "../../models/GameReview";
import GameListActionsForm from "../../components/Forms/GameListActionsForm/GameListActionsForm";
import StatusCode from "../../helpers/StatusCode";

export default function GameDetailPage(): React.JSX.Element {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = React.useState<GameType | null>(null);
  const [gameReviewDetails, setGameReviewDetails] = React.useState<GameReviewType[] | null>(null);
  const axiosPrivate = useAxiosPrivate();

  React.useEffect(() => {
    const fetchGameData = async () => {
      const response = await axiosPrivate.get(`/game/games/${id}`);
      if (response.status === StatusCode.OK) {
        setGameDetails(response.data);
      }
    };

    const fetchGameReviewData = async () => {
      const response = await axiosPrivate.get(`/game/game-reviews/?game=${id}`);
      if (response.status === StatusCode.OK) {
        setGameReviewDetails(response.data.results);
      }
    };

    fetchGameData();
    fetchGameReviewData();
  }, []);

  return (
    <div className="grid grid-cols-4 divide-x-2 divide-gray-300 max-w-[60%] mx-auto">
      <div className="flex flex-col pr-1 gap-2">
        <img
          className="border-[1px] flex-none border-black mx-auto"
          src={gameDetails?.cover_image ? `${gameDetails.cover_image}` : GameCoverImagePlaceholder}
          alt={gameDetails?.title}
        />
        <div className="border-[1px] border-black p-2">
          <GameListActionsForm gameID={id} />
        </div>
        <div>
          <p className="font-bold">Information</p>
          <div className="flex flex-col border-[1px] border-black p-2 gap-1">
            <div className="flex flex-row">
              <p className="font-bold">Release date:</p>
              <p className="ml-2">{gameDetails?.release_date.toString()}</p>
            </div>
            <div className="flex flex-row">
              <p className="font-bold">Publisher:</p>
              <p className="ml-2">{gameDetails?.publisher.name}</p>
            </div>
            <div className="flex flex-row">
              <p className="font-bold">Developer:</p>
              <p className="ml-2">{gameDetails?.developer.name}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Genres:</p>
              <div className="flex flex-row flex-wrap gap-1">
                {gameDetails?.genres.map(genre => (
                  <p key={genre.id} className="bg-background-300 rounded-xl border-primary-950 border-[1px] p-1">
                    {genre.name}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Platforms:</p>
              <div className="flex flex-row flex-wrap gap-1">
                {gameDetails?.platforms.map(platform => (
                  <p key={platform.id} className="bg-background-300 rounded-xl border-primary-950 border-[1px] p-1">
                    {platform.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3 flex flex-col pl-1 divide-y-2 divide-gray-300  ">
        <p className="font-bold text-xl">{gameDetails?.title}</p>
        <p className="font-bold pt-1">Statistics</p>
        <div className="flex flex-col pb-1">
          <div className="grid grid-cols-4 pt-2">
            <div className="flex flex-col">
              <p className="bg-secondary-950 text-white font-bold mx-auto p-1">Score</p>
              <p className="font-bold text-4xl mx-auto">{gameDetails?.average_score}</p>
              <p className="font-bold text-sm mx-auto">{gameDetails?.scores_count} ratings</p>
            </div>
            <div className="flex flex-col">
              <p className="bg-secondary-600 text-text-950 font-bold mx-auto p-1">Ranked</p>
              <p className="font-bold text-4xl mx-auto">{gameDetails?.rank_position}</p>
            </div>
            <div className="flex flex-col">
              <p className="bg-secondary-600 text-text-950 font-bold mx-auto p-1">Popularity</p>
              <p className="font-bold text-4xl mx-auto">{gameDetails?.popularity}</p>
            </div>
            <div className="flex flex-col">
              <p className="bg-secondary-600 text-text-950 font-bold mx-auto p-1">Members</p>
              <p className="font-bold text-4xl mx-auto">{gameDetails?.members_count}</p>
            </div>
          </div>
          <button type="button" className="bg-primary-950 text-white p-2 rounded-lg mb-auto mx-auto">
            More statistics
          </button>
        </div>
        <p className="font-bold pt-1">Description</p>
        <p className="pl-2 pt-2">{gameDetails?.description}</p>
        <p className="font-bold pt-1">Reviews</p>
        <div className="flex flex-col gap-3 divide-y-2">
          {gameReviewDetails?.map(gameReview => (
            <GameReview key={gameReview.id} className="pl-2" gameReview={gameReview} />
          ))}
        </div>
      </div>
    </div>
  );
}
