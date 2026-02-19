import * as React from "react";
import { Box, Group, Text, UnstyledButton } from "@mantine/core";
import { SafeImage } from "@/components/ui/SafeImage";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { cn } from "@/utils/cn";
import type { RankedItem } from "../types";

interface DuelGameCardProps {
  item: RankedItem;
  side: "left" | "right";
  onClick: () => void;
}

export const DuelGameCard = React.memo(function DuelGameCard({ item, side, onClick }: Readonly<DuelGameCardProps>) {
  const hoverColor =
    side === "left"
      ? "hover:border-primary-400 hover:shadow-primary-200/50"
      : "hover:border-secondary-400 hover:shadow-secondary-200/50";
  const accentColor = side === "left" ? "bg-primary-500" : "bg-secondary-500";

  return (
    <UnstyledButton
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-background-200 bg-white shadow-sm cursor-pointer transition-all duration-200",
        "hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:shadow-md",
        hoverColor,
      )}
    >
      <Box className="w-40 h-56 md:w-48 md:h-68 rounded-xl overflow-hidden shadow-md border border-background-100">
        <SafeImage
          src={getIGDBImageURL(item.coverImageId ?? "", IGDBImageSize.COVER_BIG_264_374)}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </Box>

      <Text
        fw={900}
        className="text-text-900 text-center line-clamp-2 uppercase tracking-tight text-sm md:text-base max-w-48"
      >
        {item.title}
      </Text>

      <Group gap={8}>
        <Text component="span" className={cn("text-xs font-bold text-white px-2 py-0.5 rounded-full", accentColor)}>
          {item.rating}
        </Text>
        <Text component="span" className="text-xs text-text-400">
          {item.matchesPlayed} {item.matchesPlayed === 1 ? "match" : "matches"}
        </Text>
      </Group>
    </UnstyledButton>
  );
});

DuelGameCard.displayName = "DuelGameCard";
