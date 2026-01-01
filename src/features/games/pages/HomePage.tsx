import * as React from "react";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { useGetGamesList } from "../hooks/gameQueries";
import { PageMeta } from "@/components/ui/PageMeta";
import { GameSimpleList } from "@/client";
import { Skeleton } from "@/components/ui/Skeleton";
import { GridList } from "@/components/ui/GridList";
import { SectionHeader } from "@/components/ui/SectionHeader";
import ItemOverlay from "@/components/ui/ItemOverlay";

export default function HomePage(): React.JSX.Element {
  const { data: highestRatedGames, isLoading: isHighestRatedLoading } = useGetGamesList({
    ordering: ["rank_position"],
  });
  const { data: mostPopularGames, isLoading: isMostPopularLoading } = useGetGamesList({ ordering: ["popularity"] });
  const { data: recentlyAddedGames, isLoading: isRecentlyAddedLoading } = useGetGamesList({
    ordering: ["-created_at"],
  });

  const renderGameList = (games: GameSimpleList[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <GridList>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="aspect-264/374 w-full" />
          ))}
        </GridList>
      );
    }

    return (
      <GridList>
        {games?.slice(0, 7).map((game: GameSimpleList) => (
          <ItemOverlay
            key={game.id}
            className="w-full"
            name={game.title}
            itemPageUrl={`/game/${game.id}`}
            itemCoverUrl={
              game.cover_image_id !== undefined
                ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.COVER_BIG_264_374)
                : null
            }
            gameType={game.game_type}
            releaseDate={game.release_date}
            rating={game.average_score}
          />
        ))}
      </GridList>
    );
  };

  return (
    <div className="py-12 bg-background-200 min-h-screen">
      <PageMeta title="Home" />
      <div className="flex flex-col gap-16 max-w-7xl mx-auto px-4">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SectionHeader title="Highest Rated Games" viewMoreHref="/search" />
          {renderGameList(highestRatedGames?.results, isHighestRatedLoading)}
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <SectionHeader title="Most Popular Games" viewMoreHref="/search" />
          {renderGameList(mostPopularGames?.results, isMostPopularLoading)}
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <SectionHeader title="Recently Added Games" viewMoreHref="/search" />
          {renderGameList(recentlyAddedGames?.results, isRecentlyAddedLoading)}
        </section>
      </div>
    </div>
  );
}
