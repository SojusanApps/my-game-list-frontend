import * as React from "react";
import { Game } from "@/client";

interface GameStatisticsProps {
  gameDetails?: Game;
}

export default function GameStatistics({ gameDetails }: GameStatisticsProps) {
  return (
    <div className="flex flex-col pb-1">
      <div className="grid grid-cols-4 pt-2">
        <div className="flex flex-col">
          <p className="bg-secondary-950 text-white font-bold mx-auto p-1">Score</p>
          <p className="font-bold text-4xl mx-auto">{gameDetails?.average_score}</p>
          <p className="font-bold text-sm mx-auto">{gameDetails?.scores_count} ratings</p>
        </div>
        <div className="flex flex-col">
          <p className="bg-secondary-600 text-text-950 font-bold mx-auto p-1">Ranked</p>
          <p className="font-bold text-4xl mx-auto">{gameDetails?.rank_position}</p>
        </div>
        <div className="flex flex-col">
          <p className="bg-secondary-600 text-text-950 font-bold mx-auto p-1">Popularity</p>
          <p className="font-bold text-4xl mx-auto">{gameDetails?.popularity}</p>
        </div>
        <div className="flex flex-col">
          <p className="bg-secondary-600 text-text-950 font-bold mx-auto p-1">Members</p>
          <p className="font-bold text-4xl mx-auto">{gameDetails?.members_count}</p>
        </div>
      </div>
      <button type="button" className="bg-primary-950 text-white p-2 rounded-lg mb-auto mx-auto">
        More statistics
      </button>
    </div>
  );
}
