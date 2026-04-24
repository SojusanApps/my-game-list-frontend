import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Box, Group, Stack, Text, Tooltip } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { ExternalGame, Game, GameEngine, GameMode, Genre, Platform, PlayerPerspective } from "@/client";

interface GameInformationProps {
  gameDetails?: Game;
}

function GameInfoRow({
  label,
  value,
  children,
}: Readonly<{
  label: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
}>) {
  return (
    <Group justify="space-between" align="flex-start" gap="md">
      <Text size="sm" fw={500} c="var(--color-text-600)" style={{ flexShrink: 0 }}>
        {label}
      </Text>
      <Text size="sm" ta="right" c="var(--color-text-900)" style={{ flex: 1, wordBreak: "break-all" }}>
        {children ?? value ?? "---"}
      </Text>
    </Group>
  );
}

function GameTags<T>({
  title,
  items,
  renderItem,
}: Readonly<{
  title: string;
  items?: T[];
  renderItem: (item: T) => React.ReactNode;
}>) {
  return (
    <Stack gap={4}>
      <Text size="sm" fw={500} c="var(--color-text-600)">
        {title}
      </Text>
      <Group gap={8} wrap="wrap">
        {items && items.length > 0 ? (
          items.map(renderItem)
        ) : (
          <Text size="sm" c="var(--color-text-900)">
            ---
          </Text>
        )}
      </Group>
    </Stack>
  );
}

function ExternalLinksSection({ externalGames }: Readonly<{ externalGames: ExternalGame[] }>) {
  const [showAllExternalLinks, setShowAllExternalLinks] = React.useState(false);
  const displayedExternalGames = showAllExternalLinks ? externalGames : externalGames.slice(0, 4);
  const hasMoreExternalGames = externalGames.length > 4;

  return (
    <Stack gap={4}>
      <Text size="sm" fw={500} c="var(--color-text-600)">
        External Links:
      </Text>
      <Group gap={8} wrap="wrap">
        {externalGames.length > 0 ? (
          <>
            {displayedExternalGames.map((extGame: ExternalGame) =>
              extGame.url ? (
                <Text
                  component="a"
                  href={extGame.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={extGame.id}
                  size="xs"
                  fw={500}
                  style={{
                    background: "var(--mantine-color-primary-0)",
                    color: "var(--mantine-color-primary-7)",
                    border: "1px solid var(--mantine-color-primary-2)",
                    borderRadius: 6,
                    padding: "2px 8px",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {extGame.external_game_source}
                  <IconExternalLink size={12} />
                </Text>
              ) : (
                <Text
                  component="span"
                  key={extGame.id}
                  size="xs"
                  fw={500}
                  style={{
                    background: "var(--color-background-100)",
                    color: "var(--color-text-700)",
                    border: "1px solid var(--color-background-300)",
                    borderRadius: 6,
                    padding: "2px 8px",
                  }}
                >
                  {extGame.external_game_source}
                </Text>
              ),
            )}
            {hasMoreExternalGames && (
              <Text
                component="button"
                onClick={() => setShowAllExternalLinks(prev => !prev)}
                size="xs"
                fw={500}
                style={{
                  background: "transparent",
                  color: "var(--mantine-color-primary-7)",
                  border: "none",
                  padding: "2px 4px",
                  cursor: "pointer",
                  textDecoration: "underline",
                  display: "inline-block",
                  outline: "none",
                }}
              >
                {showAllExternalLinks ? "Show less" : `+${externalGames.length - 4} more`}
              </Text>
            )}
          </>
        ) : (
          <Text size="sm" c="var(--color-text-900)">
            ---
          </Text>
        )}
      </Group>
    </Stack>
  );
}

export default function GameInformation({ gameDetails }: Readonly<GameInformationProps>) {
  const externalGames = gameDetails?.external_games || [];
  return (
    <Box
      style={{
        background: "white",
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid var(--color-background-200)",
        overflow: "hidden",
      }}
    >
      <Box
        style={{
          background: "var(--color-background-50)",
          padding: "12px 16px",
          borderBottom: "1px solid var(--color-background-200)",
        }}
      >
        <Text fw={600} c="var(--color-text-900)">
          Information
        </Text>
      </Box>
      <Stack gap={12} p="md">
        <GameInfoRow label="IGDB ID:" value={gameDetails?.igdb_id} />
        <GameInfoRow
          label="Release date:"
          value={gameDetails?.release_date ? gameDetails.release_date.toString() : undefined}
        />
        <GameInfoRow label="Game Status:" value={gameDetails?.game_status?.status || "Released"} />
        <GameInfoRow label="Game Type:" value={gameDetails?.game_type?.type} />
        <GameInfoRow label="Publisher:">
          {gameDetails?.publisher ? (
            <Link
              to={"/company/$id"}
              params={{ id: gameDetails.publisher.id.toString() }}
              style={{ color: "var(--mantine-color-primary-6)", fontWeight: 600 }}
            >
              {gameDetails.publisher.name}
            </Link>
          ) : undefined}
        </GameInfoRow>
        <GameInfoRow label="Developer:">
          {gameDetails?.developer ? (
            <Link
              to={"/company/$id"}
              params={{ id: gameDetails.developer.id.toString() }}
              style={{ color: "var(--mantine-color-primary-6)", fontWeight: 600 }}
            >
              {gameDetails.developer.name}
            </Link>
          ) : undefined}
        </GameInfoRow>

        <GameTags
          title="Genres:"
          items={gameDetails?.genres}
          renderItem={(genre: Genre) => (
            <Text
              component="span"
              key={genre.id}
              size="xs"
              fw={500}
              style={{
                background: "var(--mantine-color-primary-0)",
                color: "var(--mantine-color-primary-7)",
                border: "1px solid var(--mantine-color-primary-2)",
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              {genre.name}
            </Text>
          )}
        />
        <GameTags
          title="Platforms:"
          items={gameDetails?.platforms}
          renderItem={(platform: Platform) => (
            <Tooltip key={platform.id} label={platform.name}>
              <Text
                component="span"
                size="xs"
                fw={500}
                style={{
                  background: "var(--mantine-color-secondary-0, #fffbeb)",
                  color: "var(--mantine-color-secondary-7, #92400e)",
                  border: "1px solid var(--mantine-color-secondary-2, #fde68a)",
                  borderRadius: 6,
                  padding: "2px 8px",
                }}
              >
                {platform.abbreviation === "" ? platform.name : platform.abbreviation}
              </Text>
            </Tooltip>
          )}
        />
        <GameTags
          title="Engines:"
          items={gameDetails?.game_engines}
          renderItem={(engine: GameEngine) => (
            <Text
              component="span"
              key={engine.id}
              size="xs"
              fw={500}
              style={{
                background: "var(--color-background-100)",
                color: "var(--color-text-700)",
                border: "1px solid var(--color-background-300)",
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              {engine.name}
            </Text>
          )}
        />
        <GameTags
          title="Game Modes:"
          items={gameDetails?.game_modes}
          renderItem={(mode: GameMode) => (
            <Text
              component="span"
              key={mode.id}
              size="xs"
              fw={500}
              style={{
                background: "var(--color-background-100)",
                color: "var(--color-text-700)",
                border: "1px solid var(--color-background-300)",
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              {mode.name}
            </Text>
          )}
        />
        <GameTags
          title="Player Perspectives:"
          items={gameDetails?.player_perspectives}
          renderItem={(perspective: PlayerPerspective) => (
            <Text
              component="span"
              key={perspective.id}
              size="xs"
              fw={500}
              style={{
                background: "var(--color-background-100)",
                color: "var(--color-text-700)",
                border: "1px solid var(--color-background-300)",
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              {perspective.name}
            </Text>
          )}
        />

        <ExternalLinksSection externalGames={externalGames} />
      </Stack>
    </Box>
  );
}
