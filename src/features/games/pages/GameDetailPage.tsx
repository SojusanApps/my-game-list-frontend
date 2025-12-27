import * as React from "react";
import { useParams, Navigate } from "react-router-dom";
import GameReview from "../components/GameReview";
import GameListActionsForm from "../components/GameListActionsForm";
import GameInformation from "../components/GameInformation";
import GameStatistics from "../components/GameStatistics";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { useGetGameReviewsList, useGetGamesDetails } from "../hooks/gameQueries";
import { Skeleton } from "@/components/ui/Skeleton";
import { idSchema } from "@/lib/validation";
import { PageMeta } from "@/components/ui/PageMeta";
import { SafeImage } from "@/components/ui/SafeImage";

export default function GameDetailPage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

  const gameId = parsedId.data;
  const { data: gameDetails, isLoading: isGameDetailsLoading } = useGetGamesDetails(gameId);
  const { data: gameReviewItems, isLoading: isGameReviewsLoading } = useGetGameReviewsList({ game: gameId });

  const pageTitle = isGameDetailsLoading ? "Loading Game..." : gameDetails?.title;

  return (
    <div className="grid grid-cols-4 divide-x-2 divide-gray-300 max-w-[60%] mx-auto">
      <PageMeta title={pageTitle} description={gameDetails?.summary} />

      {isGameDetailsLoading ? (
        <>
          <div className="flex flex-col gap-2 pr-1">
            <Skeleton className="w-full h-64" />
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-48" />
          </div>
          <div className="col-span-3 flex flex-col gap-2 pl-4">
            <Skeleton className="w-1/2 h-8" />
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-24" />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col pr-1 gap-2">
            <SafeImage
              className="border flex-none border-black mx-auto aspect-264/374 w-full"
              src={
                gameDetails?.cover_image_id
                  ? `${getIGDBImageURL(gameDetails.cover_image_id, IGDBImageSize.COVER_BIG_264_374)}`
                  : undefined
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
        </>
      )}
    </div>
  );
}
