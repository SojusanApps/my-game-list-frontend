import * as React from "react";
import { GameList, StatusEnum } from "@/client";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/utils/cn";

interface GameListUpdateProps {
  latestGameListUpdate: GameList;
}

const statusDot: Record<string, string> = {
  [StatusEnum.P]: "bg-success-500",
  [StatusEnum.C]: "bg-primary-500",
  [StatusEnum.D]: "bg-error-500",
  [StatusEnum.OH]: "bg-secondary-500",
  [StatusEnum.PTP]: "bg-background-400",
};

export default function GameListUpdate({ latestGameListUpdate }: Readonly<GameListUpdateProps>) {
  const statusKey = latestGameListUpdate.status_code || "PTP";
  const dotColor = statusDot[statusKey] || statusDot[StatusEnum.PTP];

  return (
    <div className="flex flex-row items-center gap-4 p-3 rounded-xl border border-background-300/50 bg-background-200/50 transition-all hover:bg-background-200 hover:shadow-sm group">
      <SafeImage
        className="w-12 h-18 rounded-lg shadow-sm shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105"
        src={
          latestGameListUpdate.game_cover_image
            ? `${getIGDBImageURL(latestGameListUpdate.game_cover_image, IGDBImageSize.THUMB_90_90)}`
            : undefined
        }
        alt={`game cover ${latestGameListUpdate.id}`}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className="font-bold text-text-900 truncate text-sm md:text-base">{latestGameListUpdate.title}</p>
          <span className="text-[10px] font-bold whitespace-nowrap opacity-60">
            {new Date(
              latestGameListUpdate?.last_modified_at ? latestGameListUpdate.last_modified_at : "",
            ).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-1">
          <div className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", dotColor)} />
            <p className="text-xs font-semibold uppercase tracking-wider">{latestGameListUpdate.status}</p>
          </div>

          {latestGameListUpdate.score && (
            <div className="flex items-center gap-1 border-l border-current/20 pl-4">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Score</span>
              <span className="text-xs font-black">{latestGameListUpdate.score}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
