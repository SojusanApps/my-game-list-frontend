import * as React from "react";
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
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-text-900 uppercase tracking-tight">Ranking Results</h3>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Confidence legend */}
      <div className="flex items-center gap-4 text-xs text-text-500">
        <span className="font-semibold">Confidence:</span>
        {(["high", "medium", "low"] as const).map(level => (
          <span key={level} className="flex items-center gap-1">
            <span className={cn("w-2 h-2 rounded-full", CONFIDENCE_COLORS[level])} />
            {CONFIDENCE_LABELS[level]}
          </span>
        ))}
      </div>

      {/* Ranked list */}
      <div className="flex flex-col gap-2 max-h-[55vh] overflow-y-auto pr-1">
        {items.map((item, index) => {
          const confidence = getConfidenceLevel(item, totalItems);
          return (
            <div
              key={item.itemId}
              className="flex items-center gap-4 p-3 bg-white rounded-xl border border-background-200 shadow-xs hover:border-primary-200 transition-colors"
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-10 h-8 rounded-lg bg-background-50 text-sm font-black text-primary-600 shrink-0 border border-background-100">
                #{index + 1}
              </div>

              {/* Confidence dot */}
              <span
                className={cn("w-2.5 h-2.5 rounded-full shrink-0 tooltip tooltip-right", CONFIDENCE_COLORS[confidence])}
                data-tip={CONFIDENCE_LABELS[confidence]}
              />

              {/* Cover */}
              <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 shadow-xs border border-background-100">
                <SafeImage
                  src={getIGDBImageURL(item.coverImageId ?? "", IGDBImageSize.COVER_SMALL_90_128)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-text-900 line-clamp-1 text-sm">{item.title}</h4>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs shrink-0">
                <span className="font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">{item.rating}</span>
                <span className="text-text-400">
                  {item.wins}W / {item.losses}L / {item.draws}D
                </span>
                <span className="text-text-300">
                  {item.matchesPlayed} {item.matchesPlayed === 1 ? "match" : "matches"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

PairwiseRankingResults.displayName = "PairwiseRankingResults";
