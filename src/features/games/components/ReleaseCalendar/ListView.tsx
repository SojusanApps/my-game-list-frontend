import * as React from "react";
import { Center, Loader, Text, Group, TextInput, Stack } from "@mantine/core";
import { useGetGamesInfinite } from "../../hooks/gameQueries";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import ItemOverlay from "@/components/ui/ItemOverlay";
import IGDBImageSize, { getIGDBImageURL } from "../../utils/IGDBIntegration";
import { formatISODate, getEndOfMonth } from "../../utils/calendarUtils";
import type { GameSimpleList } from "@/client/types.gen";

export default function ListView(): React.JSX.Element {
  const [dateAfter, setDateAfter] = React.useState(() => formatISODate(new Date()));
  const [dateBefore, setDateBefore] = React.useState(() => formatISODate(getEndOfMonth(new Date())));

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useGetGamesInfinite({
    // @ts-expect-error generated type doesn't support comma-separated sort values, but API requires them
    ordering: ["release_date,-popularity"],
    release_date_after: dateAfter || undefined,
    release_date_before: dateBefore || undefined,
  });

  const games = React.useMemo(() => data?.pages.flatMap(page => page.results) ?? [], [data]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center py="xl">
          <Loader />
        </Center>
      );
    }

    if (isError) {
      return (
        <Center py="xl">
          <Text c="red">Failed to load games list.</Text>
        </Center>
      );
    }

    return (
      <VirtualGridList
        items={games}
        hasNextPage={hasNextPage || false}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        columnCount={5}
        rowHeight={320}
        gap={16}
        renderItem={(game: GameSimpleList) => (
          <ItemOverlay
            key={game.id}
            itemPageUrl={`/game/${game.id}`}
            itemCoverUrl={
              game.cover_image_id ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.COVER_BIG_264_374) : null
            }
            name={game.title}
            variant="cover"
            gameType={game.game_type}
            releaseDate={game.release_date ?? null}
            showFullReleaseDate={true}
            rating={game.average_score}
            status={game.game_status}
          />
        )}
      />
    );
  };

  return (
    <Stack gap={48}>
      <Group>
        <TextInput
          type="date"
          label="From date"
          description="Earliest release"
          value={dateAfter}
          onChange={e => setDateAfter(e.target.value)}
        />
        <TextInput
          type="date"
          label="To date"
          description="Latest release"
          value={dateBefore}
          onChange={e => setDateBefore(e.target.value)}
        />
      </Group>
      {renderContent()}
    </Stack>
  );
}
