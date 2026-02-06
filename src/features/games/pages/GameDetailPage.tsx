import * as React from "react";
import { useParams, Navigate } from "react-router-dom";
import GameListActionsForm from "../components/GameListActionsForm";
import GameInformation from "../components/GameInformation";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { useGetGameReviewsList, useGetGamesDetails } from "../hooks/gameQueries";
import { Skeleton } from "@/components/ui/Skeleton";
import { idSchema } from "@/lib/validation";
import { PageMeta } from "@/components/ui/PageMeta";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/utils/cn";
import GameDetailsMainTab from "../components/GameDetailsMainTab";
import GameDetailsRelatedTab from "../components/GameDetailsRelatedTab";
import GameDetailsScreenshotsTab from "../components/GameDetailsScreenshotsTab";
import ScreenshotModal from "../components/ScreenshotModal";
import AddToCollectionModal from "@/features/collections/components/AddToCollectionModal";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { Button } from "@/components/ui/Button";

export default function GameDetailPage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);
  const gameId = parsedId.success ? parsedId.data : undefined;

  const { data: gameDetails, isLoading: isGameDetailsLoading } = useGetGamesDetails(gameId);
  const { data: gameReviewItems, isLoading: isGameReviewsLoading } = useGetGameReviewsList({ game: gameId });

  const [activeTab, setActiveTab] = React.useState<"main" | "related" | "screenshots">("main");
  const [selectedScreenshot, setSelectedScreenshot] = React.useState<string | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = React.useState(false);
  const { user } = useAuth();

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

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
                className="w-full object-cover aspect-264/374"
                src={
                  gameDetails?.cover_image_id
                    ? `${getIGDBImageURL(gameDetails.cover_image_id, IGDBImageSize.COVER_BIG_264_374)}`
                    : undefined
                }
                alt={gameDetails?.title}
              />
            </div>

            {user && (
              <div className="w-full">
                <Button
                  onClick={() => setIsCollectionModalOpen(true)}
                  variant="outline"
                  fullWidth
                  className="shadow-sm border-primary-200 text-primary-600 hover:bg-primary-50 font-bold"
                >
                  Add to Collection
                </Button>
              </div>
            )}

            <GameInformation gameDetails={gameDetails} />
          </div>

          <div className="col-span-3 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-4xl font-bold text-text-900 tracking-tight">{gameDetails?.title}</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-background-200 p-6">
              <GameListActionsForm gameID={id} />
            </div>

            <div className="flex border-b border-background-200">
              <button
                onClick={() => setActiveTab("main")}
                className={cn(
                  "px-6 py-3 text-sm font-bold transition-colors border-b-2",
                  activeTab === "main"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-text-500 hover:text-text-700",
                )}
              >
                Information
              </button>
              <button
                onClick={() => setActiveTab("related")}
                className={cn(
                  "px-6 py-3 text-sm font-bold transition-colors border-b-2",
                  activeTab === "related"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-text-500 hover:text-text-700",
                )}
              >
                Related Games
              </button>
              <button
                onClick={() => setActiveTab("screenshots")}
                className={cn(
                  "px-6 py-3 text-sm font-bold transition-colors border-b-2",
                  activeTab === "screenshots"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-text-500 hover:text-text-700",
                )}
              >
                Screenshots
              </button>
            </div>

            {activeTab === "main" && (
              <GameDetailsMainTab
                gameDetails={gameDetails}
                gameReviewItems={gameReviewItems}
                isGameReviewsLoading={isGameReviewsLoading}
              />
            )}

            {activeTab === "related" && <GameDetailsRelatedTab gameDetails={gameDetails} />}

            {activeTab === "screenshots" && (
              <GameDetailsScreenshotsTab gameDetails={gameDetails} onScreenshotClick={setSelectedScreenshot} />
            )}
          </div>
        </>
      )}

      {selectedScreenshot && (
        <ScreenshotModal screenshot={selectedScreenshot} onClose={() => setSelectedScreenshot(null)} />
      )}

      {isCollectionModalOpen && gameId && (
        <AddToCollectionModal gameId={gameId} onClose={() => setIsCollectionModalOpen(false)} />
      )}
    </div>
  );
}
