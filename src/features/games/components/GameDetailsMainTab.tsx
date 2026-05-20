import * as React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import GameStatistics from "../components/GameStatistics";
import GameReview from "../components/GameReview";
import { Box, Skeleton, Stack, Text, Title } from "@mantine/core";
import { Game, PaginatedGameReviewList } from "@/client";

interface GameDetailsMainTabProps {
  gameDetails?: Game;
  gameReviewItems?: PaginatedGameReviewList;
  isGameReviewsLoading: boolean;
}

export default function GameDetailsMainTab({
  gameDetails,
  gameReviewItems,
  isGameReviewsLoading,
}: Readonly<GameDetailsMainTabProps>) {
  const { t } = useTranslation("games");
  return (
    <Stack gap={24} style={{ animation: "fadeIn 300ms ease" }}>
      <Box
        component="section"
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid var(--color-background-200)",
          padding: "24px",
        }}
      >
        <Title order={2} fz="xl" fw={700} c="var(--color-text-900)" mb={16}>
          {t("mainTab.statistics")}
        </Title>
        <GameStatistics gameDetails={gameDetails} />
      </Box>

      <Box
        component="section"
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid var(--color-background-200)",
          padding: "24px",
        }}
      >
        <Title order={2} fz="xl" fw={700} c="var(--color-text-900)" mb={8}>
          {t("mainTab.summary")}
        </Title>
        <Box c="var(--color-text-700)">
          <ReactMarkdown>{gameDetails?.summary || ""}</ReactMarkdown>
        </Box>
      </Box>

      <Box
        component="section"
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid var(--color-background-200)",
          padding: "24px",
        }}
      >
        <Title order={2} fz="xl" fw={700} c="var(--color-text-900)" mb={16}>
          {t("mainTab.reviews")}
        </Title>
        <Stack gap={16}>
          {isGameReviewsLoading && <Skeleton h={96} radius="xl" />}
          {gameReviewItems?.results && gameReviewItems.results.length > 0 ? (
            gameReviewItems.results.map(gameReview => <GameReview key={gameReview.id} gameReview={gameReview} />)
          ) : (
            <Text c="dimmed" fs="italic">
              {t("review.noReviews")}
            </Text>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
