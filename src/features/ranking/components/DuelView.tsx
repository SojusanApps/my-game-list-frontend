import * as React from "react";
import { Box, Group, Kbd, Stack, Text } from "@mantine/core";
import { Button } from "@/components/ui/Button";
import { DuelGameCard } from "./DuelGameCard";
import type { CurrentDuel, DuelChoice } from "../types";

interface DuelViewProps {
  duel: CurrentDuel;
  onChoice: (choice: DuelChoice) => void;
  onSkip: () => void;
}

export const DuelView = React.memo(function DuelView({ duel, onChoice, onSkip }: Readonly<DuelViewProps>) {
  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
        case "1":
          e.preventDefault();
          onChoice("A");
          break;
        case "ArrowRight":
        case "2":
          e.preventDefault();
          onChoice("B");
          break;
        case "Enter":
        case "3":
          e.preventDefault();
          onChoice("tie");
          break;
        case "s":
          e.preventDefault();
          onSkip();
          break;
      }
    };

    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [onChoice, onSkip]);

  return (
    <Stack align="center" gap={32} className="animate-in fade-in duration-300">
      {/* Cards */}
      <Group align="center" gap={32} wrap="wrap" justify="center" className="w-full">
        <DuelGameCard item={duel.itemA} side="left" onClick={() => onChoice("A")} />

        {/* VS divider */}
        <Group justify="center" align="center">
          <Box className="flex items-center justify-center w-14 h-14 rounded-full bg-background-50 border-2 border-background-200 shadow-inner">
            <Text component="span" className="text-xl font-black text-text-400 tracking-tighter">
              VS
            </Text>
          </Box>
        </Group>

        <DuelGameCard item={duel.itemB} side="right" onClick={() => onChoice("B")} />
      </Group>

      {/* Action buttons */}
      <Stack align="center" gap={16}>
        <Group gap={12}>
          <Button onClick={() => onChoice("A")} className="font-bold uppercase tracking-wider px-8">
            <Text component="span">Choose Left</Text>{" "}
            <Kbd size="xs" className="ml-2 opacity-60 bg-white/20">
              ←
            </Kbd>
          </Button>
          <Button onClick={() => onChoice("tie")} variant="outline" className="font-bold uppercase tracking-wider px-6">
            <Text component="span">Tie</Text>{" "}
            <Kbd size="xs" className="ml-2 opacity-60">
              Enter
            </Kbd>
          </Button>
          <Button onClick={() => onChoice("B")} className="font-bold uppercase tracking-wider px-8">
            <Text component="span">Choose Right</Text>{" "}
            <Kbd size="xs" className="ml-2 opacity-60 bg-white/20">
              →
            </Kbd>
          </Button>
        </Group>

        <Button onClick={onSkip} variant="ghost" size="sm" className="text-text-400">
          <Text component="span">Skip this pair</Text>{" "}
          <Kbd size="xs" className="ml-1 opacity-60">
            S
          </Kbd>
        </Button>
      </Stack>

      {/* Keyboard hint */}
      <Text size="xs" className="text-text-400 text-center">
        Use keyboard:{" "}
        <Text component="span" fw={700}>
          ← / 1
        </Text>{" "}
        left &middot;{" "}
        <Text component="span" fw={700}>
          → / 2
        </Text>{" "}
        right &middot;{" "}
        <Text component="span" fw={700}>
          Enter / 3
        </Text>{" "}
        tie &middot;{" "}
        <Text component="span" fw={700}>
          S
        </Text>{" "}
        skip
      </Text>
    </Stack>
  );
});

DuelView.displayName = "DuelView";
