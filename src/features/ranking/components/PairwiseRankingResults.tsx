import * as React from "react";
import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { SafeImage } from "@/components/ui/SafeImage";
import { Button } from "@/components/ui/Button";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { cn } from "@/utils/cn";
import { getConfidenceLevel } from "../utils/rankingSort";
import type { RankedItem } from "../types";

interface PairwiseRankingResultsProps {
  items: RankedItem[];
  onContinueDueling: () => void;
  onApplyToCollection: () => void;
  isApplying: boolean;
}

const CONFIDENCE_COLORS: Record<string, string> = {
  low: "bg-error-400",
  medium: "bg-warning-400",
  high: "bg-success-400",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  low: "Low confidence",
  medium: "Medium confidence",
  high: "High confidence",
};

export const PairwiseRankingResults = React.memo(function PairwiseRankingResults({
  items,
  onContinueDueling,
  onApplyToCollection,
  isApplying,
}: Readonly<PairwiseRankingResultsProps>) {
  const totalItems = items.length;

  return (
    <Stack gap={16} className="animate-in fade-in duration-300">
      {/* Actions */}
      <Group justify="space-between" align="center">
        <Title order={3} className="text-lg font-black text-text-900 uppercase tracking-tight">
          Ranking Results
        </Title>
        <Group gap={8}>
          <Button
            onClick={onContinueDueling}
            variant="outline"
            size="sm"
            className="font-bold uppercase tracking-wider"
          >
            Continue Dueling
          </Button>
          <Button
            onClick={onApplyToCollection}
            size="sm"
            className="font-bold uppercase tracking-wider"
            disabled={isApplying}
          >
            {isApplying ? "Applying…" : "Apply to Collection"}
          </Button>
        </Group>
      </Group>

      {/* Confidence legend */}
      <Group gap={16} className="text-xs text-text-500">
        <Text component="span" fw={600}>
          Confidence:
        </Text>
        {(["high", "medium", "low"] as const).map(level => (
          <Group key={level} gap={4}>
            <Box className={cn("w-2 h-2 rounded-full", CONFIDENCE_COLORS[level])} />
            {CONFIDENCE_LABELS[level]}
          </Group>
        ))}
      </Group>

      {/* Ranked list */}
      <Stack gap={8} style={{ maxHeight: "55vh", overflowY: "auto", paddingRight: 4 }}>
        {items.map((item, index) => {
          const confidence = getConfidenceLevel(item, totalItems);
          return (
            <Group
              key={item.itemId}
              gap={16}
              align="center"
              className="p-3 bg-white rounded-xl border border-background-200 shadow-xs hover:border-primary-200 transition-colors"
            >
              {/* Rank */}
              <Box className="flex items-center justify-center w-10 h-8 rounded-lg bg-background-50 text-sm font-black text-primary-600 shrink-0 border border-background-100">
                #{index + 1}
              </Box>

              {/* Confidence dot */}
              <Box
                className={cn("w-2.5 h-2.5 rounded-full shrink-0 tooltip tooltip-right", CONFIDENCE_COLORS[confidence])}
                data-tip={CONFIDENCE_LABELS[confidence]}
              />

              {/* Cover */}
              <Box className="w-10 h-14 rounded-lg overflow-hidden shrink-0 shadow-xs border border-background-100">
                <SafeImage
                  src={getIGDBImageURL(item.coverImageId ?? "", IGDBImageSize.COVER_SMALL_90_128)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </Box>

              {/* Title */}
              <Box className="flex-1 min-w-0">
                <Text fw={700} className="text-text-900 line-clamp-1 text-sm">
                  {item.title}
                </Text>
              </Box>

              {/* Stats */}
              <Group gap={12} className="text-xs shrink-0">
                <Text component="span" className="font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
                  {item.rating}
                </Text>
                <Text component="span" className="text-text-400">
                  {item.wins}W / {item.losses}L / {item.draws}D
                </Text>
                <Text component="span" className="text-text-300">
                  {item.matchesPlayed} {item.matchesPlayed === 1 ? "match" : "matches"}
                </Text>
              </Group>
            </Group>
          );
        })}
      </Stack>
    </Stack>
  );
});

PairwiseRankingResults.displayName = "PairwiseRankingResults";
