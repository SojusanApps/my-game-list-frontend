import * as React from "react";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { useGetGamesList } from "../hooks/gameQueries";
import { PageMeta } from "@/components/ui/PageMeta";
import { GameSimpleList } from "@/client";
import { Box, SimpleGrid, Skeleton, Stack } from "@mantine/core";
import { SectionHeader } from "@/components/ui/SectionHeader";
import ItemOverlay from "@/components/ui/ItemOverlay";
import styles from "./HomePage.module.css";

export default function HomePage(): React.JSX.Element {
  const { data: highestRatedGames, isLoading: isHighestRatedLoading } = useGetGamesList({
    ordering: ["rank_position"],
  });
  const { data: mostPopularGames, isLoading: isMostPopularLoading } = useGetGamesList({ ordering: ["popularity"] });
  const { data: recentlyAddedGames, isLoading: isRecentlyAddedLoading } = useGetGamesList({
    ordering: ["-created_at"],
  });

  const autoplayPlugin = () => Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true });

  const renderGameCarousel = (games: GameSimpleList[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5, xl: 7 }} spacing="md">
          {Array.from({ length: 7 }).map((_, i) => {
            const skeletonKey = `game-skeleton-${i}`;
            return <Skeleton key={skeletonKey} style={{ aspectRatio: "264/374", width: "100%", borderRadius: 12 }} />;
          })}
        </SimpleGrid>
      );
    }

    const items = games?.slice(0, 14) ?? [];

    return (
      <Carousel
        emblaOptions={{ loop: true, align: "start", slidesToScroll: 1 }}
        slideSize={{ base: "50%", sm: "33.333%", md: "25%", lg: "20%", xl: "14.285%" }}
        slideGap="md"
        plugins={[autoplayPlugin()]}
        styles={{
          viewport: { overflowY: "visible", overflowX: "clip" },
          container: { zIndex: 2 },
        }}
      >
        {items.map((game: GameSimpleList) => (
          <Carousel.Slide key={game.id} className={styles.slide}>
            <ItemOverlay
              style={{ width: "100%" }}
              name={game.title}
              itemPageUrl={`/game/${game.id}`}
              itemCoverUrl={
                game.cover_image_id === undefined
                  ? null
                  : getIGDBImageURL(game.cover_image_id, IGDBImageSize.COVER_BIG_264_374)
              }
              gameType={game.game_type}
              releaseDate={game.release_date}
              rating={game.average_score}
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    );
  };

  return (
    <Box py={48} style={{ minHeight: "100vh" }}>
      <PageMeta title="Home" />
      <Stack gap={64} maw={1280} mx="auto" px={16}>
        <Box component="section">
          <SectionHeader title="Highest Rated Games" viewMoreHref="/search" />
          {renderGameCarousel(highestRatedGames?.results, isHighestRatedLoading)}
        </Box>

        <Box component="section">
          <SectionHeader title="Most Popular Games" viewMoreHref="/search" />
          {renderGameCarousel(mostPopularGames?.results, isMostPopularLoading)}
        </Box>

        <Box component="section">
          <SectionHeader title="Recently Added Games" viewMoreHref="/search" />
          {renderGameCarousel(recentlyAddedGames?.results, isRecentlyAddedLoading)}
        </Box>
      </Stack>
    </Box>
  );
}
