import * as React from "react";
import { getRouteApi } from "@tanstack/react-router";
import ItemOverlay from "@/components/ui/ItemOverlay";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { STATUS_CONFIG } from "../utils/statusConfig";
import { GameList, StatusEnum } from "@/client";
import { useGetUserDetails } from "@/features/users/hooks/userQueries";
import { useGameListInfiniteQuery, useRandomPtpGame } from "../hooks/useGameListQueries";
import { PageMeta } from "@/components/ui/PageMeta";
import { GridList } from "@/components/ui/GridList";
import { Box, Button, Group, Skeleton, Stack, Text, Title, ActionIcon } from "@mantine/core";
import { IconEdit, IconGridDots, IconList } from "@tabler/icons-react";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import { VirtualList } from "@/components/ui/VirtualList";
import { useIsOwner } from "@/features/auth";
import { GameListModal } from "../components/GameListModal";
import { GameListRow } from "../components/GameListRow";

interface GameListItemProps {
  gameListItem: GameList;
  isOwner: boolean;
  onEdit: (gameId: number) => void;
}

interface EditActionProps {
  gameId: number;
  onEdit: (gameId: number) => void;
}

function EditAction({ gameId, onEdit }: Readonly<EditActionProps>) {
  return (
    <ActionIcon
      variant="filled"
      color="var(--mantine-color-primary-6)"
      size="md"
      radius="xl"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onEdit(gameId);
      }}
      style={{
        position: "absolute",
        bottom: "16px",
        right: "16px",
        zIndex: 20,
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
      }}
    >
      <IconEdit size={16} />
    </ActionIcon>
  );
}

function renderEditActionSlot(hovered: boolean, gameId: number, onEdit: (id: number) => void) {
  return hovered ? <EditAction gameId={gameId} onEdit={onEdit} /> : null;
}

const GameListGridItem = React.memo(({ gameListItem, isOwner, onEdit }: GameListItemProps) => {
  return (
    <ItemOverlay
      name={gameListItem.title}
      itemPageUrl={`/game/${gameListItem.game_id}`}
      itemCoverUrl={getIGDBImageURL(gameListItem.game_cover_image, IGDBImageSize.COVER_BIG_264_374)}
      status={gameListItem.status_code}
      rating={gameListItem.score}
      actionSlot={isOwner ? hovered => renderEditActionSlot(hovered, gameListItem.game_id, onEdit) : undefined}
    />
  );
});
GameListGridItem.displayName = "GameListGridItem";

const routeApi = getRouteApi("/game-list/$id");

export default function GameListPage(): React.JSX.Element {
  const { id } = routeApi.useParams();
  const userId = Number(id);
  const isOwner = useIsOwner(userId);

  const { data: userDetails, isLoading: isUserLoading } = useGetUserDetails(userId);
  const [selectedGameStatus, setSelectedGameStatus] = React.useState<StatusEnum | null>(null);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const {
    data: gameListResults,
    error: errorFetchingData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGameListInfiniteQuery(userId, selectedGameStatus);

  const [shouldFetchRandomPtp, setShouldFetchRandomPtp] = React.useState(false);
  const [editingGameId, setEditingGameId] = React.useState<number | null>(null);

  const {
    data: randomPtpGame,
    isLoading: isRandomPtpLoading,
    refetch: refetchRandomPtpGame,
  } = useRandomPtpGame(userId, shouldFetchRandomPtp);

  const handlePickRandomPtp = () => {
    if (shouldFetchRandomPtp) {
      refetchRandomPtpGame();
    } else {
      setShouldFetchRandomPtp(true);
    }
  };

  const pageTitle = isUserLoading ? "Loading Game List..." : `${userDetails?.username}'s Game List`;

  const allItems = gameListResults?.pages.flatMap(page => page.results) || [];

  const statuses: { id: StatusEnum | null; label: string; emoji: string; color: string }[] = [
    { id: null, label: "ALL", emoji: "♾️", color: "gray" },
    {
      id: StatusEnum.P,
      label: STATUS_CONFIG[StatusEnum.P].label,
      emoji: STATUS_CONFIG[StatusEnum.P].emoji,
      color: "teal",
    },
    {
      id: StatusEnum.C,
      label: STATUS_CONFIG[StatusEnum.C].label,
      emoji: STATUS_CONFIG[StatusEnum.C].emoji,
      color: "indigo",
    },
    {
      id: StatusEnum.PTP,
      label: STATUS_CONFIG[StatusEnum.PTP].label,
      emoji: STATUS_CONFIG[StatusEnum.PTP].emoji,
      color: "gray",
    },
    {
      id: StatusEnum.OH,
      label: STATUS_CONFIG[StatusEnum.OH].label,
      emoji: STATUS_CONFIG[StatusEnum.OH].emoji,
      color: "orange",
    },
    {
      id: StatusEnum.D,
      label: STATUS_CONFIG[StatusEnum.D].label,
      emoji: STATUS_CONFIG[StatusEnum.D].emoji,
      color: "red",
    },
  ];

  const renderContent = () => {
    if (isLoading && !isFetchingNextPage) {
      if (viewMode === "grid") {
        return (
          <GridList>
            {Array.from({ length: 21 }).map((_, i) => {
              const skeletonKey = `game-skeleton-${i}`;
              return (
                <Skeleton key={skeletonKey} style={{ aspectRatio: "264/374", width: "100%", borderRadius: "12px" }} />
              );
            })}
          </GridList>
        );
      } else {
        return (
          <Stack gap={12}>
            {Array.from({ length: 10 }).map((_, i) => {
              const skeletonKey = `list-skeleton-${i}`;
              return <Skeleton key={skeletonKey} height={90} width="100%" radius="12px" />;
            })}
          </Stack>
        );
      }
    }

    if (viewMode === "grid") {
      return (
        <VirtualGridList
          items={allItems}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          renderItem={(gameListItem: GameList) => (
            <GameListGridItem
              key={gameListItem.id}
              gameListItem={gameListItem}
              isOwner={isOwner}
              onEdit={setEditingGameId}
            />
          )}
        />
      );
    }

    return (
      <VirtualList
        items={allItems}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        itemHeight={106}
        className="custom-scrollbar"
        style={{
          height: "800px",
          paddingRight: "8px",
        }}
        renderItem={(gameListItem: GameList) => (
          <GameListRow key={gameListItem.id} gameListItem={gameListItem} isOwner={isOwner} onEdit={setEditingGameId} />
        )}
      />
    );
  };

  return (
    <Box py={48} style={{ minHeight: "100vh" }}>
      <PageMeta title={pageTitle} />
      <Stack gap={40} maw={1280} mx="auto" px={16}>
        <Stack align="center" gap={24}>
          <Title
            order={1}
            fz={{ base: 30, md: 36 }}
            fw={700}
            c="var(--color-text-900)"
            ta="center"
            style={{ letterSpacing: "-0.025em" }}
          >
            <span style={{ color: "var(--mantine-color-primary-6)" }}>{userDetails?.username}</span>
            {"'s Game List"}
          </Title>

          <Box
            w="100%"
            pos="relative"
            display={{ base: "flex", sm: "block" }}
            style={{ flexDirection: "column", alignItems: "center" }}
          >
            <Group justify="center" wrap="wrap" gap={8}>
              {statuses.map(status => (
                <Button
                  key={String(status.id)}
                  variant={selectedGameStatus === status.id ? "filled" : "light"}
                  color={status.color}
                  size="md"
                  radius="xl"
                  onClick={() => setSelectedGameStatus(status.id)}
                  leftSection={<span>{status.emoji}</span>}
                  style={{
                    border: `2px solid var(--mantine-color-${status.color}-${selectedGameStatus === status.id ? "7" : "4"})`,
                    transition: "border-color 0.2s ease",
                  }}
                >
                  {status.label}
                </Button>
              ))}
            </Group>

            <Group
              gap={8}
              mt={{ base: 16, sm: 0 }}
              pos={{ base: "static", sm: "absolute" }}
              right={{ sm: 0 }}
              top={{ sm: "50%" }}
              style={{ transform: "translateY(var(--y-translate, 0))" }}
              className="view-toggle-group"
            >
              <style>{`
                @media (min-width: 48em) {
                  .view-toggle-group {
                    --y-translate: -50%;
                  }
                }
              `}</style>
              <ActionIcon
                variant={viewMode === "grid" ? "filled" : "light"}
                color={viewMode === "grid" ? "indigo" : "gray"}
                size="lg"
                radius="md"
                onClick={() => setViewMode("grid")}
              >
                <IconGridDots size={20} />
              </ActionIcon>
              <ActionIcon
                variant={viewMode === "list" ? "filled" : "light"}
                color={viewMode === "list" ? "indigo" : "gray"}
                size="lg"
                radius="md"
                onClick={() => setViewMode("list")}
              >
                <IconList size={20} />
              </ActionIcon>
            </Group>
          </Box>
        </Stack>

        {isOwner && selectedGameStatus === StatusEnum.PTP && (
          <Box
            style={{
              background: "var(--color-primary-50)",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              border: "1px solid var(--color-primary-200)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Text fw={600} fz="lg" c="var(--color-text-900)" ta="center">
              Don&apos;t know what to play next? Pick a random game from your Plan to play list!
            </Text>
            <Button
              onClick={handlePickRandomPtp}
              loading={isRandomPtpLoading}
              variant="filled"
              color="indigo"
              size="md"
            >
              Pick Random Game
            </Button>
            {shouldFetchRandomPtp && randomPtpGame && (
              <Box style={{ width: "264px", marginTop: "16px" }}>
                <ItemOverlay
                  name={randomPtpGame.title}
                  itemPageUrl={`/game/${randomPtpGame.game_id}`}
                  itemCoverUrl={getIGDBImageURL(randomPtpGame.game_cover_image, IGDBImageSize.COVER_BIG_264_374)}
                  status={randomPtpGame.status_code}
                  rating={randomPtpGame.score}
                />
              </Box>
            )}
            {shouldFetchRandomPtp && !isRandomPtpLoading && !randomPtpGame && (
              <Text c="red" fw={500} ta="center">
                You must add games to your Plan to play list first.
              </Text>
            )}
          </Box>
        )}

        <Box
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            border: "1px solid var(--color-background-200)",
            padding: "24px",
            minHeight: "850px",
          }}
        >
          {renderContent()}
          {errorFetchingData && (
            <Box
              style={{
                background: "var(--color-error-50)",
                border: "1px solid var(--color-error-200)",
                borderRadius: "12px",
                padding: "16px",
                marginTop: "16px",
              }}
            >
              <Text ta="center" fw={500} c="var(--color-error-600)">
                Error: {errorFetchingData.message}
              </Text>
            </Box>
          )}
        </Box>
      </Stack>

      {editingGameId && <GameListModal gameId={editingGameId} opened={true} onClose={() => setEditingGameId(null)} />}
    </Box>
  );
}
