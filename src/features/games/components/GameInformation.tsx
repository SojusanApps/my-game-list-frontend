import * as React from "react";
import { Link } from "react-router-dom";
import { Box, Group, Stack, Text, Tooltip } from "@mantine/core";
import { Game } from "@/client";

interface GameInformationProps {
  gameDetails?: Game;
}

export default function GameInformation({ gameDetails }: Readonly<GameInformationProps>) {
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
        <Group justify="space-between" align="flex-start" gap="md">
          <Text size="sm" fw={500} c="var(--color-text-600)" style={{ flexShrink: 0 }}>
            IGDB ID:
          </Text>
          <Text size="sm" ta="right" c="var(--color-text-900)" style={{ flex: 1, wordBreak: "break-all" }}>
            {gameDetails?.igdb_id || "---"}
          </Text>
        </Group>
        <Group justify="space-between" align="flex-start" gap="md">
          <Text size="sm" fw={500} c="var(--color-text-600)" style={{ flexShrink: 0 }}>
            Release date:
          </Text>
          <Text size="sm" ta="right" c="var(--color-text-900)" style={{ flex: 1 }}>
            {gameDetails?.release_date ? gameDetails.release_date.toString() : "---"}
          </Text>
        </Group>
        <Group justify="space-between" align="flex-start" gap="md">
          <Text size="sm" fw={500} c="var(--color-text-600)" style={{ flexShrink: 0 }}>
            Game Status:
          </Text>
          <Text size="sm" ta="right" c="var(--color-text-900)" style={{ flex: 1 }}>
            {gameDetails?.game_status?.status || "Released"}
          </Text>
        </Group>
        <Group justify="space-between" align="flex-start" gap="md">
          <Text size="sm" fw={500} c="var(--color-text-600)" style={{ flexShrink: 0 }}>
            Game Type:
          </Text>
          <Text size="sm" ta="right" c="var(--color-text-900)" style={{ flex: 1 }}>
            {gameDetails?.game_type?.type || "---"}
          </Text>
        </Group>
        <Group justify="space-between" align="flex-start" gap="md">
          <Text size="sm" fw={500} c="var(--color-text-600)" style={{ flexShrink: 0 }}>
            Publisher:
          </Text>
          <Text size="sm" ta="right" c="var(--color-text-900)" style={{ flex: 1 }}>
            {gameDetails?.publisher ? (
              <Link
                to={`/company/${gameDetails.publisher.id}`}
                style={{ color: "var(--mantine-color-primary-6)", fontWeight: 600 }}
              >
                {gameDetails.publisher.name}
              </Link>
            ) : (
              "---"
            )}
          </Text>
        </Group>
        <Group justify="space-between" align="flex-start" gap="md">
          <Text size="sm" fw={500} c="var(--color-text-600)" style={{ flexShrink: 0 }}>
            Developer:
          </Text>
          <Text size="sm" ta="right" c="var(--color-text-900)" style={{ flex: 1 }}>
            {gameDetails?.developer ? (
              <Link
                to={`/company/${gameDetails.developer.id}`}
                style={{ color: "var(--mantine-color-primary-6)", fontWeight: 600 }}
              >
                {gameDetails.developer.name}
              </Link>
            ) : (
              "---"
            )}
          </Text>
        </Group>
        <Stack gap={8}>
          <Text size="sm" fw={500} c="var(--color-text-600)">
            Genres:
          </Text>
          <Group gap={8} wrap="wrap">
            {gameDetails?.genres && gameDetails.genres.length > 0 ? (
              gameDetails.genres.map(genre => (
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
              ))
            ) : (
              <Text size="sm" c="var(--color-text-900)">
                ---
              </Text>
            )}
          </Group>
        </Stack>
        <Stack gap={4}>
          <Text size="sm" fw={500} c="var(--color-text-600)">
            Platforms:
          </Text>
          <Group gap={8} wrap="wrap">
            {gameDetails?.platforms && gameDetails.platforms.length > 0 ? (
              gameDetails.platforms.map(platform => (
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
              ))
            ) : (
              <Text size="sm" c="var(--color-text-900)">
                ---
              </Text>
            )}
          </Group>
        </Stack>
        <Stack gap={4}>
          <Text size="sm" fw={500} c="var(--color-text-600)">
            Engines:
          </Text>
          <Group gap={8} wrap="wrap">
            {gameDetails?.game_engines && gameDetails.game_engines.length > 0 ? (
              gameDetails.game_engines.map(engine => (
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
              ))
            ) : (
              <Text size="sm" c="var(--color-text-900)">
                ---
              </Text>
            )}
          </Group>
        </Stack>
        <Stack gap={4}>
          <Text size="sm" fw={500} c="var(--color-text-600)">
            Game Modes:
          </Text>
          <Group gap={8} wrap="wrap">
            {gameDetails?.game_modes && gameDetails.game_modes.length > 0 ? (
              gameDetails.game_modes.map(mode => (
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
              ))
            ) : (
              <Text size="sm" c="var(--color-text-900)">
                ---
              </Text>
            )}
          </Group>
        </Stack>
        <Stack gap={4}>
          <Text size="sm" fw={500} c="var(--color-text-600)">
            Player Perspectives:
          </Text>
          <Group gap={8} wrap="wrap">
            {gameDetails?.player_perspectives && gameDetails.player_perspectives.length > 0 ? (
              gameDetails.player_perspectives.map(perspective => (
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
              ))
            ) : (
              <Text size="sm" c="var(--color-text-900)">
                ---
              </Text>
            )}
          </Group>
        </Stack>
      </Stack>
    </Box>
  );
}
