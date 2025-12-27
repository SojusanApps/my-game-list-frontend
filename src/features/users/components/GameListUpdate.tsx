import * as React from "react";
import { GameList } from "@/client";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { SafeImage } from "@/components/ui/SafeImage";

interface GameListUpdateProps {
  latestGameListUpdate: GameList;
}

export default function GameListUpdate({ latestGameListUpdate }: GameListUpdateProps) {
  return (
    <div className="flex flex-row">
      <SafeImage
        className="w-11.25 h-18.75 border border-black shrink-0"
        src={
          latestGameListUpdate.game_cover_image
            ? `${getIGDBImageURL(latestGameListUpdate.game_cover_image, IGDBImageSize.THUMB_90_90)}`
            : undefined
        }
        alt={`game cover ${latestGameListUpdate.id}`}
      />
      <div className="flex flex-col pl-2">
        <div className="flex flex-row">
          <p>Title:</p>
          <p className="ml-2">{latestGameListUpdate.title}</p>
        </div>
        <div className="flex flex-row">
          <p>Status:</p>
          <p className="ml-2">{latestGameListUpdate.status}</p>
        </div>
        <div className="flex flex-row">
          <p>Score:</p>
          <p className="ml-2">{latestGameListUpdate.score ? latestGameListUpdate.score : "-"}</p>
        </div>
        <div className="flex flex-row">
          <p>Update date:</p>
          <p className="ml-2">
            {new Date(
              latestGameListUpdate?.last_modified_at ? latestGameListUpdate.last_modified_at : "",
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
