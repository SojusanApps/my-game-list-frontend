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
import ReactMarkdown from "react-markdown";

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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto p-4">
      <PageMeta title={pageTitle} description={gameDetails?.summary} />

      {isGameDetailsLoading ? (
        <>
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-64 rounded-xl" />
            <Skeleton className="w-full h-32 rounded-xl" />
            <Skeleton className="w-full h-48 rounded-xl" />
          </div>
          <div className="col-span-3 flex flex-col gap-4">
            <Skeleton className="w-1/2 h-8 rounded-lg" />
            <Skeleton className="w-full h-32 rounded-xl" />
            <Skeleton className="w-full h-24 rounded-xl" />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-background-900/5">
              <SafeImage
                className="w-full object-cover aspect-[264/374]"
                src={
                  gameDetails?.cover_image_id
                    ? `${getIGDBImageURL(gameDetails.cover_image_id, IGDBImageSize.COVER_BIG_264_374)}`
                    : undefined
                }
                alt={gameDetails?.title}
              />
            </div>

            <GameInformation gameDetails={gameDetails} />
          </div>

          <div className="col-span-3 flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-text-900 tracking-tight">{gameDetails?.title}</h1>

            <div className="bg-white rounded-xl shadow-sm border border-background-200 p-6">
              <GameListActionsForm gameID={id} />
            </div>

            <section className="bg-white rounded-xl shadow-sm border border-background-200 p-6">
              <h2 className="text-xl font-bold text-text-900 mb-4">Statistics</h2>
              <GameStatistics gameDetails={gameDetails} />
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-background-200 p-6">
              <h2 className="text-xl font-bold text-text-900 mb-2">Summary</h2>
              <div className="prose prose-slate prose-sm max-w-none text-text-700">
                <ReactMarkdown>{gameDetails?.summary || ""}</ReactMarkdown>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-background-200 p-6">
              <h2 className="text-xl font-bold text-text-900 mb-4">Reviews</h2>
              <div className="flex flex-col gap-4">
                {isGameReviewsLoading && <Skeleton className="w-full h-24 rounded-xl" />}
                {gameReviewItems?.results && gameReviewItems.results.length > 0 ? (
                  gameReviewItems.results.map(gameReview => <GameReview key={gameReview.id} gameReview={gameReview} />)
                ) : (
                  <p className="text-text-500 italic">No reviews yet.</p>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
