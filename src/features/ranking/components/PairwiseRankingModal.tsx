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
        <Stack align="center" justify="center" className="h-full text-center">
          <Box className="w-20 h-20 bg-background-50 rounded-full flex items-center justify-center mb-4">
            <Text component="span" className="text-4xl">
              ⚖️
            </Text>
          </Box>
          <Title order={3} className="text-lg font-bold text-text-900">
            Not enough items
          </Title>
          <Text className="text-text-500 max-w-xs mt-2">
            You need at least 2 games in this collection to start pairwise ranking.
          </Text>
        </Stack>
      );
    }

    if (state === "idle") {
      return (
        <Stack align="center" justify="center" gap={24} className="h-full text-center">
          <Box className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center">
            <Text component="span" className="text-4xl">
              ⚔️
            </Text>
          </Box>
          <Box>
            <Title order={3} className="text-xl font-black text-text-900 uppercase tracking-tight">
              Rank by Head-to-Head Duels
            </Title>
            <Text className="text-text-500 max-w-md mt-2 leading-relaxed">
              Compare games two at a time to build an accurate ranking using an Elo rating system. You can stop anytime
              and resume later.
            </Text>
            <Text size="xs" className="text-text-400 mt-3">
              {collectionItems.length} games &middot; {getTotalRounds(collectionItems.length)} rounds &middot; ~
              {getTotalDuels(collectionItems.length)} duels
            </Text>
          </Box>

          <Group gap={12}>
            {hasExistingProfile ? (
              <>
                <Button
                  onClick={resume}
                  className="font-bold uppercase tracking-wider px-8 shadow-lg shadow-primary-200"
                >
                  Resume Session
                </Button>
                <Button
                  onClick={handleStartFresh}
                  variant="outline"
                  className="font-bold uppercase tracking-wider px-6"
                >
                  Start Fresh
                </Button>
              </>
            ) : (
              <Button
                onClick={startNew}
                className="font-bold uppercase tracking-wider px-8 shadow-lg shadow-primary-200"
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
        <Box className="flex items-center justify-center h-full">
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
      overlayProps={{ backgroundOpacity: 0.6 }}
      styles={{
        content: { width: "95vw", maxWidth: "80rem", height: "85vh" },
        body: { height: "100%", padding: 0 },
      }}
    >
      <Stack gap={0} style={{ height: "100%" }}>
        {/* Header */}
        <Group justify="space-between" align="center" className="p-6 pb-4 border-b border-background-100">
          <Stack gap={4} className="flex-1 min-w-0">
            <Title order={2} className="text-xl font-black text-text-900 uppercase tracking-tight">
              Pairwise Ranking
            </Title>
            {state !== "idle" && (
              <Box className="max-w-sm">
                <ProgressBar progress={progress} />
              </Box>
            )}
          </Stack>

          <Group gap={8}>
            {state === "dueling" && (
              <Button onClick={viewResults} variant="outline" size="sm" className="font-bold uppercase tracking-wider">
                View Results
              </Button>
            )}
            {state !== "idle" && (
              <Button onClick={handleReset} variant="ghost" size="sm" className="text-error-500 hover:text-error-600">
                Reset
              </Button>
            )}
            <UnstyledButton
              onClick={handleClose}
              className="p-2 rounded-xl bg-background-50 border border-background-100 text-text-400 hover:text-text-600 transition-colors"
            >
              <IconX className="w-5 h-5" />
            </UnstyledButton>
          </Group>
        </Group>

        {/* Body */}
        <Box className="flex-1 overflow-y-auto p-6">{renderBody()}</Box>
      </Stack>
    </Modal>
  );
}
