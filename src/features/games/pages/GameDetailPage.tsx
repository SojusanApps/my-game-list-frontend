import * as React from "react";

import { useParams } from "react-router-dom";

import GameCoverImagePlaceholder from "@/assets/images/Image_Placeholder.svg";
import GameReview from "../components/GameReview";
import GameListActionsForm from "../components/GameListActionsForm";
import GameInformation from "../components/GameInformation";
import GameStatistics from "../components/GameStatistics";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { useGetGameReviewsList, useGetGamesDetails } from "../hooks/gameQueries";
import { Skeleton } from "@/components/Skeleton/Skeleton";

export default function GameDetailPage(): React.JSX.Element {
  const { id } = useParams();
  const { data: gameDetails, isLoading: isGameDetailsLoading } = useGetGamesDetails(+id!);
  const { data: gameReviewItems, isLoading: isGameReviewsLoading } = useGetGameReviewsList({ game: +id! });

  if (isGameDetailsLoading) {
    return (
      <div className="grid grid-cols-4 divide-x-2 divide-gray-300 max-w-[60%] mx-auto gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-64" />
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-48" />
        </div>
        <div className="col-span-3 flex flex-col gap-2 pl-4">
          <Skeleton className="w-1/2 h-8" />
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 divide-x-2 divide-gray-300 max-w-[60%] mx-auto">
      <div className="flex flex-col pr-1 gap-2">
        <img
          className="border flex-none border-black mx-auto"
          src={
            gameDetails?.cover_image_id
              ? `${getIGDBImageURL(gameDetails.cover_image_id, IGDBImageSize.COVER_BIG_264_374)}`
              : GameCoverImagePlaceholder
          }
          alt={gameDetails?.title}
        />
        <div className="border border-black p-2">
          <GameListActionsForm gameID={id} />
        </div>
        <GameInformation gameDetails={gameDetails} />
      </div>
      <div className="col-span-3 flex flex-col pl-1 divide-y-2 divide-gray-300  ">
        <p className="font-bold text-xl">{gameDetails?.title}</p>
        <p className="font-bold pt-1">Statistics</p>
        <GameStatistics gameDetails={gameDetails} />
        <p className="font-bold pt-1">Summary</p>
        <p className="pl-2 pt-2">{gameDetails?.summary}</p>
        <p className="font-bold pt-1">Reviews</p>
        <div className="flex flex-col gap-3 divide-y-2">
          {isGameReviewsLoading && <Skeleton className="w-full h-24" />}
          {gameReviewItems?.results?.map(gameReview => (
            <GameReview key={gameReview.id} className="pl-2" gameReview={gameReview} />
          ))}
        </div>
      </div>
    </div>
  );
}