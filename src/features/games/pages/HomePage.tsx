import * as React from "react";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { useGetGamesList } from "../hooks/gameQueries";
import { PageMeta } from "@/components/ui/PageMeta";
import { Game } from "@/client";
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

  const renderGameList = (games: Game[] | undefined, isLoading: boolean) => {
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
        {games?.slice(0, 7).map((game: Game) => (
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
          />
        ))}
      </GridList>
    );
  };

  return (
    <div className="py-8">
      <PageMeta title="Home" />
      <div className="flex flex-col gap-12 max-w-[70%] mx-auto">
        <section>
          <SectionHeader title="Highest Rated Games" viewMoreHref="/search" />
          {renderGameList(highestRatedGames?.results, isHighestRatedLoading)}
        </section>

        <section>
          <SectionHeader title="Most Popular Games" viewMoreHref="/search" />
          {renderGameList(mostPopularGames?.results, isMostPopularLoading)}
        </section>

        <section>
          <SectionHeader title="Recently Added Games" viewMoreHref="/search" />
          {renderGameList(recentlyAddedGames?.results, isRecentlyAddedLoading)}
        </section>
      </div>
    </div>
  );
}
