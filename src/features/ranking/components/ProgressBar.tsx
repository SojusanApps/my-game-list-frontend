import * as React from "react";
import { cn } from "@/utils/cn";
import type { RankingProgress } from "../types";

interface ProgressBarProps {
  progress: RankingProgress;
}

function getRoundDotClass(isDone: boolean, isActive: boolean): string {
  if (isDone) return "bg-success-400";
  if (isActive) return "bg-primary-400";
  return "bg-background-200";
}

export const ProgressBar = React.memo(function ProgressBar({ progress }: Readonly<ProgressBarProps>) {
  const { duelsCompleted, totalDuels, completionPercent, currentRound, totalRounds, duelInRound, duelsInRound } =
    progress;

  // Per-round progress (0–100)
  const roundPercent = duelsInRound > 0 ? Math.round((duelInRound / duelsInRound) * 100) : 0;
  const isBonus = currentRound > totalRounds;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Round label */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-text-600">
          {isBonus ? `Bonus round ${currentRound - totalRounds}` : `Round ${currentRound} of ${totalRounds}`}
          <span className="text-text-400 font-normal ml-1.5">
            · duel {duelInRound + 1} of {duelsInRound}
          </span>
        </span>
        <span
          className={cn("font-bold tabular-nums", completionPercent >= 100 ? "text-success-600" : "text-primary-500")}
        >
          {duelsCompleted}/{totalDuels}
        </span>
      </div>

      {/* Per-round progress bar */}
      <div className="w-full h-2 bg-background-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            completionPercent >= 100 ? "bg-success-500" : "bg-primary-500",
          )}
          style={{ width: `${Math.min(roundPercent, 100)}%` }}
        />
      </div>

      {/* Overall progress dots for each round */}
      {totalRounds > 1 && (
        <div className="flex items-center gap-1">
          {Array.from({ length: totalRounds }, (_, i) => {
            const round = i + 1;
            const isDone = round < currentRound;
            const isActive = round === currentRound;
            return (
              <div
                key={round}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-300",
                  getRoundDotClass(isDone, isActive),
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";
