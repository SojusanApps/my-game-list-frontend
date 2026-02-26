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
    <Stack align="center" gap={32} style={{ animation: "fade-in 300ms ease-in-out" }}>
      {/* Cards */}
      <Group align="center" gap={32} wrap="nowrap" justify="center" w="100%">
        <DuelGameCard item={duel.itemA} side="left" onClick={() => onChoice("A")} />

        {/* VS divider */}
        <Group justify="center" align="center" style={{ flexShrink: 0 }}>
          <Box
            w={56}
            h={56}
            bg="var(--color-background-50)"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "9999px",
              border: "2px solid var(--color-background-200)",
              boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
            }}
          >
            <Text component="span" fz="xl" fw={900} c="var(--color-text-400)" style={{ letterSpacing: "-0.05em" }}>
              VS
            </Text>
          </Box>
        </Group>

        <DuelGameCard item={duel.itemB} side="right" onClick={() => onChoice("B")} />
      </Group>

      {/* Action buttons */}
      <Stack align="center" gap={16}>
        <Group gap={12}>
          <Button
            onClick={() => onChoice("A")}
            style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", paddingInline: 32 }}
          >
            <Text component="span">Choose Left</Text>{" "}
            <Kbd size="xs" ml={8} style={{ opacity: 0.6, background: "rgba(255,255,255,0.2)" }}>
              ←
            </Kbd>
          </Button>
          <Button
            onClick={() => onChoice("tie")}
            variant="outline"
            style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", paddingInline: 24 }}
          >
            <Text component="span">Tie</Text>{" "}
            <Kbd size="xs" ml={8} style={{ opacity: 0.6 }}>
              Enter
            </Kbd>
          </Button>
          <Button
            onClick={() => onChoice("B")}
            style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", paddingInline: 32 }}
          >
            <Text component="span">Choose Right</Text>{" "}
            <Kbd size="xs" ml={8} style={{ opacity: 0.6, background: "rgba(255,255,255,0.2)" }}>
              →
            </Kbd>
          </Button>
        </Group>

        <Button onClick={onSkip} variant="ghost" size="sm" style={{ color: "var(--color-text-400)" }}>
          <Text component="span">Skip this pair</Text>{" "}
          <Kbd size="xs" ml={4} style={{ opacity: 0.6 }}>
            S
          </Kbd>
        </Button>
      </Stack>

      {/* Keyboard hint */}
      <Text size="xs" style={{ color: "var(--color-text-400)" }} ta="center">
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
