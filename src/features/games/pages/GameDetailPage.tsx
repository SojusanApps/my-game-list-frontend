import * as React from "react";
import { useParams, Navigate } from "react-router-dom";
import { CompanyGame } from "@/client";
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
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import ItemOverlay from "@/components/ui/ItemOverlay";
import ChevronDownIcon from "@/components/ui/Icons/ChevronDown";
import XMarkIcon from "@/components/ui/Icons/XMark";
import ReactMarkdown from "react-markdown";
import { cn } from "@/utils/cn";

function CollapsibleSection({
  title,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-background-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-background-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-text-900">{title}</h2>
          {count !== undefined && (
            <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
          )}
        </div>
        <ChevronDownIcon
          className={cn("w-5 h-5 text-text-400 transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function GameDetailPage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

  const gameId = parsedId.data;
  const { data: gameDetails, isLoading: isGameDetailsLoading } = useGetGamesDetails(gameId);
  const { data: gameReviewItems, isLoading: isGameReviewsLoading } = useGetGameReviewsList({ game: gameId });

  const [activeTab, setActiveTab] = React.useState<"main" | "related" | "screenshots">("main");
  const [selectedScreenshot, setSelectedScreenshot] = React.useState<string | null>(null);

  const pageTitle = isGameDetailsLoading ? "Loading Game..." : gameDetails?.title;

  const renderRelatedGamesSection = (title: string, games: CompanyGame[] | undefined) => {
    if (!games || games.length === 0) return null;
    return (
      <CollapsibleSection title={title} count={games.length}>
        <VirtualGridList
          items={games}
          hasNextPage={false}
          isFetchingNextPage={false}
          fetchNextPage={() => {}}
          className="h-100"
          renderItem={(game: CompanyGame) => (
            <ItemOverlay
              itemPageUrl={`/game/${game.id}`}
              itemCoverUrl={
                game.cover_image_id ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.COVER_BIG_264_374) : null
              }
              name={game.title}
            />
          )}
        />
      </CollapsibleSection>
    );
  };

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
                      gameReviewItems.results.map(gameReview => (
                        <GameReview key={gameReview.id} gameReview={gameReview} />
                      ))
                    ) : (
                      <p className="text-text-500 italic">No reviews yet.</p>
                    )}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "related" && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                {gameDetails?.parent_game && (
                  <CollapsibleSection title="Parent Game" defaultOpen={true}>
                    <div className="max-w-[200px]">
                      <ItemOverlay
                        itemPageUrl={`/game/${gameDetails.parent_game.id}`}
                        itemCoverUrl={
                          gameDetails.parent_game.cover_image_id
                            ? getIGDBImageURL(gameDetails.parent_game.cover_image_id, IGDBImageSize.COVER_BIG_264_374)
                            : null
                        }
                        name={gameDetails.parent_game.title}
                      />
                    </div>
                  </CollapsibleSection>
                )}
                {renderRelatedGamesSection("DLCs", gameDetails?.dlcs)}
                {renderRelatedGamesSection("Expansions", gameDetails?.expansions)}
                {renderRelatedGamesSection("Standalone Expansions", gameDetails?.standalone_expansions)}
                {renderRelatedGamesSection("Bundles", gameDetails?.bundles)}
                {renderRelatedGamesSection("Expanded Games", gameDetails?.expanded_games)}
                {renderRelatedGamesSection("Forks", gameDetails?.forks)}
                {renderRelatedGamesSection("Ports", gameDetails?.ports)}

                {!gameDetails?.parent_game &&
                  (!gameDetails?.dlcs || gameDetails.dlcs.length === 0) &&
                  (!gameDetails?.expansions || gameDetails.expansions.length === 0) &&
                  (!gameDetails?.standalone_expansions || gameDetails.standalone_expansions.length === 0) &&
                  (!gameDetails?.bundles || gameDetails.bundles.length === 0) &&
                  (!gameDetails?.expanded_games || gameDetails.expanded_games.length === 0) &&
                  (!gameDetails?.forks || gameDetails.forks.length === 0) &&
                  (!gameDetails?.ports || gameDetails.ports.length === 0) && (
                    <div className="bg-white rounded-xl shadow-sm border border-background-200 p-8 text-center text-text-500 italic">
                      No related games found.
                    </div>
                  )}
              </div>
            )}

            {activeTab === "screenshots" && (
              <div className="bg-white rounded-xl shadow-sm border border-background-200 p-6 animate-in fade-in duration-300">
                {gameDetails?.screenshots && gameDetails.screenshots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gameDetails.screenshots.map((screenshot, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedScreenshot(screenshot)}
                        className="rounded-lg overflow-hidden shadow-md group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary-500"
                      >
                        <SafeImage
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src={getIGDBImageURL(screenshot, IGDBImageSize.SCREENSHOT_MED_569_320)}
                          alt={`${gameDetails.title} screenshot ${index + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-text-500 italic py-8">No screenshots available.</div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-300"
          onClick={() => setSelectedScreenshot(null)}
        >
          <button
            onClick={() => setSelectedScreenshot(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
          <div className="relative max-w-full max-h-full" onClick={e => e.stopPropagation()}>
            <SafeImage
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              src={getIGDBImageURL(selectedScreenshot, IGDBImageSize.SCREENSHOT_HUGE_1280_720)}
              alt="Enlarged screenshot"
            />
          </div>
        </div>
      )}
    </div>
  );
}
