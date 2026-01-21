import * as React from "react";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import ItemOverlay from "@/components/ui/ItemOverlay";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { Game, CompanyGame } from "@/client";

interface GameDetailsRelatedTabProps {
  gameDetails?: Game;
}

export default function GameDetailsRelatedTab({ gameDetails }: Readonly<GameDetailsRelatedTabProps>) {
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
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      {gameDetails?.parent_game && (
        <CollapsibleSection title="Parent Game" defaultOpen={true}>
          <div className="max-w-50">
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
  );
}
