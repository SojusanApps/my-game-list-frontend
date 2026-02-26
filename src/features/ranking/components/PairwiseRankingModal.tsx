import * as React from "react";
import type { CollectionItem } from "@/client";
import { Button } from "@/components/ui/Button";
import { IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { Box, Group, Modal, Stack, Text, Title, UnstyledButton } from "@mantine/core";
import { useBulkReorderCollectionItems } from "@/features/collections/hooks/useCollectionQueries";
import { getTotalRounds, getTotalDuels } from "../utils/swissTournament";
import { useRankingSession } from "../hooks/useRankingSession";
import { DuelView } from "./DuelView";
import { PairwiseRankingResults } from "./PairwiseRankingResults";
import { ProgressBar } from "./ProgressBar";

interface PairwiseRankingModalProps {
  collectionId: number;
  collectionItems: CollectionItem[];
  onClose: () => void;
}

export default function PairwiseRankingModal({
  collectionId,
  collectionItems,
  onClose,
}: Readonly<PairwiseRankingModalProps>) {
  const [isApplying, setIsApplying] = React.useState(false);

  const {
    state,
    currentDuel,
    rankedItems,
    progress,
    hasExistingProfile,
    startNew,
    resume,
    submitChoice,
    skipDuel,
    viewResults,
    continueDueling,
    reset,
  } = useRankingSession(collectionId, collectionItems);

  const { mutateAsync: bulkReorderItems } = useBulkReorderCollectionItems();

  // Apply ranking order to the actual collection
  const handleApplyToCollection = React.useCallback(async () => {
    setIsApplying(true);
    try {
      await bulkReorderItems({
        collectionId,
        items: rankedItems.map((item, i) => ({ id: item.itemId, position: i })),
      });
      notifications.show({ title: "Success", message: "Ranking applied to collection!", color: "green" });
      onClose();
    } catch (error) {
      console.error("Failed to apply ranking:", error);
      notifications.show({ title: "Error", message: "Failed to apply ranking order", color: "red" });
    } finally {
      setIsApplying(false);
    }
  }, [rankedItems, collectionId, bulkReorderItems, onClose]);

  // Handle "Start Fresh" with confirmation if existing profile
  const handleStartFresh = React.useCallback(() => {
    if (hasExistingProfile) {
      if (confirm("This will discard your previous ranking data. Continue?")) {
        startNew();
      }
    } else {
      startNew();
    }
  }, [hasExistingProfile, startNew]);

  const handleReset = React.useCallback(() => {
    if (confirm("This will permanently delete all ranking data for this collection. Continue?")) {
      reset();
    }
  }, [reset]);

  const handleClose = React.useCallback(() => {
    if (state === "dueling" && progress.duelsCompleted > 0) {
      if (confirm("Your progress is saved automatically. Close the ranking session?")) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [state, progress.duelsCompleted, onClose]);

  const tooFewItems = collectionItems.length < 2;

  const renderBody = () => {
    if (tooFewItems) {
      return (
        <Stack align="center" justify="center" h="100%" style={{ textAlign: "center" }}>
          <Box
            w={80}
            h={80}
            bg="var(--color-background-50)"
            style={{
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Text component="span" fz={36}>
              ⚖️
            </Text>
          </Box>
          <Title order={3} fz="lg" fw={700} c="var(--color-text-900)">
            Not enough items
          </Title>
          <Text c="var(--color-text-500)" maw={320} mt={8}>
            You need at least 2 games in this collection to start pairwise ranking.
          </Text>
        </Stack>
      );
    }

    if (state === "idle") {
      return (
        <Stack align="center" justify="center" gap={24} h="100%" style={{ textAlign: "center" }}>
          <Box
            w={80}
            h={80}
            bg="var(--color-primary-50)"
            style={{ borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Text component="span" fz={36}>
              ⚔️
            </Text>
          </Box>
          <Box>
            <Title
              order={3}
              fz="xl"
              fw={900}
              c="var(--color-text-900)"
              style={{ textTransform: "uppercase", letterSpacing: "-0.025em" }}
            >
              Rank by Head-to-Head Duels
            </Title>
            <Text c="var(--color-text-500)" maw={448} mt={8} style={{ lineHeight: 1.625 }}>
              Compare games two at a time to build an accurate ranking using an Elo rating system. You can stop anytime
              and resume later.
            </Text>
            <Text size="xs" c="var(--color-text-400)" mt={12}>
              {collectionItems.length} games &middot; {getTotalRounds(collectionItems.length)} rounds &middot; ~
              {getTotalDuels(collectionItems.length)} duels
            </Text>
          </Box>

          <Group gap={12}>
            {hasExistingProfile ? (
              <>
                <Button
                  onClick={resume}
                  style={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    paddingInline: 32,
                    boxShadow: "0 10px 15px -3px var(--color-primary-200), 0 4px 6px -4px var(--color-primary-200)",
                  }}
                >
                  Resume Session
                </Button>
                <Button
                  onClick={handleStartFresh}
                  variant="outline"
                  style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", paddingInline: 24 }}
                >
                  Start Fresh
                </Button>
              </>
            ) : (
              <Button
                onClick={startNew}
                style={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  paddingInline: 32,
                  boxShadow: "0 10px 15px -3px var(--color-primary-200), 0 4px 6px -4px var(--color-primary-200)",
                }}
              >
                Start Ranking
              </Button>
            )}
          </Group>
        </Stack>
      );
    }

    if (state === "dueling" && currentDuel) {
      return (
        <Box style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <DuelView duel={currentDuel} onChoice={submitChoice} onSkip={skipDuel} />
        </Box>
      );
    }

    if (state === "results") {
      return (
        <PairwiseRankingResults
          items={rankedItems}
          onContinueDueling={continueDueling}
          onApplyToCollection={handleApplyToCollection}
          isApplying={isApplying}
        />
      );
    }

    return null;
  };

  return (
    <Modal
      opened={true}
      onClose={handleClose}
      withCloseButton={false}
      padding={0}
      radius="xl"
      size="80rem"
      overlayProps={{ backgroundOpacity: 0.6 }}
      styles={{
        content: { height: "85vh" },
        body: { height: "100%", padding: 0 },
      }}
    >
      <Stack gap={0} style={{ height: "100%" }}>
        {/* Header */}
        <Group
          justify="space-between"
          align="center"
          p={24}
          pb={16}
          style={{ borderBottom: "1px solid var(--color-background-100)" }}
        >
          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            <Title
              order={2}
              fz="xl"
              fw={900}
              c="var(--color-text-900)"
              style={{ textTransform: "uppercase", letterSpacing: "-0.025em" }}
            >
              Pairwise Ranking
            </Title>
            {state !== "idle" && (
              <Box w="100%" maw={384}>
                <ProgressBar progress={progress} />
              </Box>
            )}
          </Stack>

          <Group gap={8}>
            {state === "dueling" && (
              <Button
                onClick={viewResults}
                variant="outline"
                size="sm"
                style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                View Results
              </Button>
            )}
            {state !== "idle" && (
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                style={{ fontWeight: 500, color: "var(--color-error-500)" }}
              >
                Reset
              </Button>
            )}
            <UnstyledButton
              onClick={handleClose}
              p={8}
              bg="var(--color-background-50)"
              c="var(--color-text-400)"
              style={{ borderRadius: 12, border: "1px solid var(--color-background-100)", transition: "color 200ms" }}
            >
              <IconX size={20} />
            </UnstyledButton>
          </Group>
        </Group>

        {/* Body */}
        <Box style={{ flex: 1, overflowY: "auto", padding: 24 }}>{renderBody()}</Box>
      </Stack>
    </Modal>
  );
}
