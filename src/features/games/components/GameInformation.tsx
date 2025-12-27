import * as React from "react";
import { Game } from "@/client";

interface GameInformationProps {
  gameDetails?: Game;
}

export default function GameInformation({ gameDetails }: GameInformationProps) {
  return (
    <div>
      <p className="font-bold">Information</p>
      <div className="flex flex-col border border-black p-2 gap-1">
        <div className="flex flex-row">
          <p className="font-bold">IGDB ID:</p>
          <p className="ml-2">{gameDetails?.igdb_id}</p>
        </div>
        <div className="flex flex-row">
          <p className="font-bold">Release date:</p>
          <p className="ml-2">{gameDetails?.release_date ? gameDetails?.release_date.toString() : "---"}</p>
        </div>
        <div className="flex flex-row">
          <p className="font-bold">Publisher:</p>
          <p className="ml-2">{gameDetails?.publisher?.name}</p>
        </div>
        <div className="flex flex-row">
          <p className="font-bold">Developer:</p>
          <p className="ml-2">{gameDetails?.developer?.name}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold">Genres:</p>
          <div className="flex flex-row flex-wrap gap-1">
            {gameDetails?.genres.map(genre => (
              <p key={genre.id} className="bg-background-300 rounded-xl border-primary-950 border p-1">
                {genre.name}
              </p>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <p className="font-bold">Platforms:</p>
          <div className="flex flex-row flex-wrap gap-1">
            {gameDetails?.platforms.map(platform => (
              <div key={platform.id} className="tooltip" data-tip={platform.name}>
                <p className="bg-background-300 rounded-xl border-primary-950 border p-1">
                  {platform.abbreviation !== "" ? platform.abbreviation : platform.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
