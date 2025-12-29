import * as React from "react";
import { Game } from "@/client";
import { Button } from "@/components/ui/Button";

interface GameStatisticsProps {
  gameDetails?: Game;
}

export default function GameStatistics({ gameDetails }: GameStatisticsProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {/* Score Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-secondary-100/50 rounded-2xl border border-secondary-200/50 shadow-xs transition-transform hover:scale-[1.02]">
          <p className="text-[11px] font-bold text-secondary-700 uppercase tracking-widest mb-2">Score</p>
          <p className="text-4xl font-black text-secondary-900">{gameDetails?.average_score || "N/A"}</p>
          <p className="text-[10px] text-secondary-600 font-semibold mt-1">{gameDetails?.scores_count} ratings</p>
        </div>

        {/* Ranked Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-success-100/50 rounded-2xl border border-success-200/50 shadow-xs transition-transform hover:scale-[1.02]">
          <p className="text-[11px] font-bold text-success-700 uppercase tracking-widest mb-2">Ranked</p>
          <p className="text-4xl font-black text-success-900">#{gameDetails?.rank_position || "-"}</p>
        </div>

        {/* Popularity Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-primary-100/50 rounded-2xl border border-primary-200/50 shadow-xs transition-transform hover:scale-[1.02]">
          <p className="text-[11px] font-bold text-primary-700 uppercase tracking-widest mb-2">Popularity</p>
          <p className="text-4xl font-black text-primary-900">#{gameDetails?.popularity || "-"}</p>
        </div>

        {/* Members Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-background-200/50 rounded-2xl border border-background-300/50 shadow-xs transition-transform hover:scale-[1.02]">
          <p className="text-[11px] font-bold text-text-500 uppercase tracking-widest mb-2">Members</p>
          <p className="text-4xl font-black text-text-900">{gameDetails?.members_count || "0"}</p>
        </div>
      </div>

      <Button variant="ghost" size="sm" className="mx-auto text-text-400 hover:text-primary-600">
        More statistics
      </Button>
    </div>
  );
}
