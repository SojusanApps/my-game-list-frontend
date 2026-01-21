import * as React from "react";
import ReactMarkdown from "react-markdown";
import GameStatistics from "../components/GameStatistics";
import GameReview from "../components/GameReview";
import { Skeleton } from "@/components/ui/Skeleton";
import { Game, PaginatedGameReviewList } from "@/client";

interface GameDetailsMainTabProps {
  gameDetails?: Game;
  gameReviewItems?: PaginatedGameReviewList;
  isGameReviewsLoading: boolean;
}

export default function GameDetailsMainTab({
  gameDetails,
  gameReviewItems,
  isGameReviewsLoading,
}: Readonly<GameDetailsMainTabProps>) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
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
  );
}
