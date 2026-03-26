import * as React from "react";
import { getRouteApi } from "@tanstack/react-router";
import { GameListModal } from "../components/GameListModal";
import GameInformation from "../components/GameInformation";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { useGetGameReviewsList, useGetGamesDetails, useGetGameListByFilters } from "../hooks/gameQueries";
import { Box, Grid, Group, Skeleton, Stack, Tabs, Title } from "@mantine/core";
import { PageMeta } from "@/components/ui/PageMeta";
import { SafeImage } from "@/components/ui/SafeImage";
import GameDetailsMainTab from "../components/GameDetailsMainTab";
import GameDetailsRelatedTab from "../components/GameDetailsRelatedTab";
import GameDetailsScreenshotsTab from "../components/GameDetailsScreenshotsTab";
import ScreenshotModal from "../components/ScreenshotModal";
import AddToCollectionModal from "@/features/collections/components/AddToCollectionModal";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { useCurrentUserId } from "@/features/auth";
import { Button } from "@/components/ui/Button";

const routeApi = getRouteApi("/game/$id");

export default function GameDetailPage(): React.JSX.Element {
  const { id } = routeApi.useParams();
  const gameId = Number(id);

  const { data: gameDetails, isLoading: isGameDetailsLoading } = useGetGamesDetails(gameId);
  const { data: gameReviewItems, isLoading: isGameReviewsLoading } = useGetGameReviewsList({ game: gameId });

  const [activeTab, setActiveTab] = React.useState<"main" | "related" | "screenshots">("main");
  const [selectedScreenshot, setSelectedScreenshot] = React.useState<string | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = React.useState(false);
  const [isListModalOpen, setIsListModalOpen] = React.useState(false);
  const { user } = useAuth();
  const currentUserId = useCurrentUserId();

  const { data: userGameList, isPending: isUserGameListPending } = useGetGameListByFilters(
    gameId && currentUserId ? { game: gameId, user: currentUserId } : undefined,
    { enabled: !!gameId && !!currentUserId },
  );

  const listButtonText = userGameList?.id ? "Edit List Entry" : "Add List Entry";

  const pageTitle = isGameDetailsLoading ? "Loading Game..." : gameDetails?.title;

  return (
    <Box py={48} style={{ minHeight: "100vh" }}>
      <Grid gutter="md" maw={1152} mx="auto" px={16}>
        <PageMeta title={pageTitle} description={gameDetails?.summary} />

        {isGameDetailsLoading ? (
          <>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Stack gap={16}>
                <Skeleton w="100%" h={256} style={{ borderRadius: 12 }} />
                <Skeleton w="100%" h={128} style={{ borderRadius: 12 }} />
                <Skeleton w="100%" h={192} style={{ borderRadius: 12 }} />
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 9 }}>
              <Stack gap={16}>
                <Skeleton w="50%" h={32} style={{ borderRadius: 8 }} />
                <Skeleton w="100%" h={128} style={{ borderRadius: 12 }} />
                <Skeleton w="100%" h={96} style={{ borderRadius: 12 }} />
              </Stack>
            </Grid.Col>
          </>
        ) : (
          <>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Stack gap={16}>
                <Box
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                  }}
                >
                  <SafeImage
                    style={{ width: "100%", objectFit: "cover", aspectRatio: "264/374", display: "block" }}
                    src={
                      gameDetails?.cover_image_id
                        ? `${getIGDBImageURL(gameDetails.cover_image_id, IGDBImageSize.COVER_BIG_264_374)}`
                        : undefined
                    }
                    alt={gameDetails?.title}
                  />
                </Box>

                {user && (
                  <Stack gap={8}>
                    {isUserGameListPending ? (
                      <Skeleton h={36} w="100%" style={{ borderRadius: 8 }} />
                    ) : (
                      <Button onClick={() => setIsListModalOpen(true)} fullWidth>
                        {listButtonText}
                      </Button>
                    )}
                    <Button onClick={() => setIsCollectionModalOpen(true)} variant="outline" fullWidth>
                      Add to Collection
                    </Button>
                  </Stack>
                )}

                <GameInformation gameDetails={gameDetails} />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 9 }}>
              <Stack gap={24}>
                <Group justify="space-between" align="center">
                  <Title
                    order={1}
                    fz={{ base: 28, md: 36 }}
                    fw={700}
                    c="var(--color-text-900)"
                    style={{ letterSpacing: "-0.025em" }}
                  >
                    {gameDetails?.title}
                  </Title>
                </Group>

                <Tabs
                  value={activeTab}
                  onChange={val => {
                    if (val) setActiveTab(val as typeof activeTab);
                  }}
                  keepMounted={false}
                >
                  <Tabs.List>
                    <Tabs.Tab value="main">Information</Tabs.Tab>
                    <Tabs.Tab value="related">Related Games</Tabs.Tab>
                    <Tabs.Tab value="screenshots">Screenshots</Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="main" pt="md">
                    <GameDetailsMainTab
                      gameDetails={gameDetails}
                      gameReviewItems={gameReviewItems}
                      isGameReviewsLoading={isGameReviewsLoading}
                    />
                  </Tabs.Panel>
                  <Tabs.Panel value="related" pt="md">
                    <GameDetailsRelatedTab gameDetails={gameDetails} />
                  </Tabs.Panel>
                  <Tabs.Panel value="screenshots" pt="md">
                    <GameDetailsScreenshotsTab gameDetails={gameDetails} onScreenshotClick={setSelectedScreenshot} />
                  </Tabs.Panel>
                </Tabs>
              </Stack>
            </Grid.Col>
          </>
        )}

        {selectedScreenshot && gameDetails?.screenshots && (
          <ScreenshotModal
            initialScreenshot={selectedScreenshot}
            screenshots={gameDetails.screenshots}
            onClose={() => setSelectedScreenshot(null)}
          />
        )}

        {isCollectionModalOpen && !!gameId && (
          <AddToCollectionModal gameId={gameId} onClose={() => setIsCollectionModalOpen(false)} />
        )}

        {!!gameId && (
          <GameListModal gameId={gameId} opened={isListModalOpen} onClose={() => setIsListModalOpen(false)} />
        )}
      </Grid>
    </Box>
  );
}
