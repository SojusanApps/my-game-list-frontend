import * as React from "react";
import type { CollectionItem } from "@/client";
import { Button } from "@/components/ui/Button";
import XMarkIcon from "@/components/ui/Icons/XMark";
import toast from "react-hot-toast";
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
  const dialogRef = React.useRef<HTMLDialogElement>(null);
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

  // Open the dialog on mount
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  // Handle backdrop click to close
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        if (state === "dueling" && progress.duelsCompleted > 0) {
          if (confirm("Your progress is saved automatically. Close the ranking session?")) {
            onClose();
          }
        } else {
          onClose();
        }
      }
    };

    dialog.addEventListener("click", handleClick);
    return () => dialog.removeEventListener("click", handleClick);
  }, [state, progress.duelsCompleted, onClose]);

  // Handle ESC key
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      if (state === "dueling" && progress.duelsCompleted > 0) {
        if (confirm("Your progress is saved automatically. Close the ranking session?")) {
          onClose();
        }
      } else {
        onClose();
      }
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [state, progress.duelsCompleted, onClose]);

  // Apply ranking order to the actual collection
  const handleApplyToCollection = React.useCallback(async () => {
    setIsApplying(true);
    try {
      await bulkReorderItems({
        collectionId,
        items: rankedItems.map((item, i) => ({ id: item.itemId, position: i })),
      });
      toast.success("Ranking applied to collection!");
      onClose();
    } catch (error) {
      console.error("Failed to apply ranking:", error);
      toast.error("Failed to apply ranking order");
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

  const tooFewItems = collectionItems.length < 2;

  const renderBody = () => {
    if (tooFewItems) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-20 h-20 bg-background-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">⚖️</span>
          </div>
          <h3 className="text-lg font-bold text-text-900">Not enough items</h3>
          <p className="text-text-500 max-w-xs mt-2">
            You need at least 2 games in this collection to start pairwise ranking.
          </p>
        </div>
      );
    }

    if (state === "idle") {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center">
            <span className="text-4xl">⚔️</span>
          </div>
          <div>
            <h3 className="text-xl font-black text-text-900 uppercase tracking-tight">Rank by Head-to-Head Duels</h3>
            <p className="text-text-500 max-w-md mt-2 leading-relaxed">
              Compare games two at a time to build an accurate ranking using an Elo rating system. You can stop anytime
              and resume later.
            </p>
            <p className="text-xs text-text-400 mt-3">
              {collectionItems.length} games &middot; {getTotalRounds(collectionItems.length)} rounds &middot; ~
              {getTotalDuels(collectionItems.length)} duels
            </p>
          </div>

          <div className="flex items-center gap-3">
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
          </div>
        </div>
      );
    }

    if (state === "dueling" && currentDuel) {
      return (
        <div className="flex items-center justify-center h-full">
          <DuelView duel={currentDuel} onChoice={submitChoice} onSkip={skipDuel} />
        </div>
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
    <dialog
      ref={dialogRef}
      className="m-auto max-w-5xl w-[95vw] h-[85vh] rounded-3xl border border-background-200 shadow-2xl backdrop:bg-black/60 animate-in fade-in zoom-in-95 duration-300 p-0 bg-white"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-background-100">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h2 className="text-xl font-black text-text-900 uppercase tracking-tight">Pairwise Ranking</h2>
            {state !== "idle" && (
              <div className="max-w-sm">
                <ProgressBar progress={progress} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
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
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-background-50 border border-background-100 text-text-400 hover:text-text-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{renderBody()}</div>
      </div>
    </dialog>
  );
}
