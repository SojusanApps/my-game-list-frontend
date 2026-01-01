import * as React from "react";
import { Link } from "react-router-dom";
import { Game } from "@/client";

interface GameInformationProps {
  gameDetails?: Game;
}

export default function GameInformation({ gameDetails }: GameInformationProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-background-200 overflow-hidden">
      <div className="bg-background-50 px-4 py-3 border-b border-background-200">
        <p className="font-semibold text-text-900">Information</p>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex flex-row justify-between items-start text-sm gap-4">
          <p className="font-medium text-text-600 shrink-0">IGDB ID:</p>
          <p className="text-text-900 text-right flex-1 break-all">{gameDetails?.igdb_id || "---"}</p>
        </div>
        <div className="flex flex-row justify-between items-start text-sm gap-4">
          <p className="font-medium text-text-600 shrink-0">Release date:</p>
          <p className="text-text-900 text-right flex-1">
            {gameDetails?.release_date ? gameDetails.release_date.toString() : "---"}
          </p>
        </div>
        <div className="flex flex-row justify-between items-start text-sm gap-4">
          <p className="font-medium text-text-600 shrink-0">Game Status:</p>
          <p className="text-text-900 text-right flex-1">{gameDetails?.game_status?.status || "Released"}</p>
        </div>
        <div className="flex flex-row justify-between items-start text-sm gap-4">
          <p className="font-medium text-text-600 shrink-0">Game Type:</p>
          <p className="text-text-900 text-right flex-1">{gameDetails?.game_type?.type || "---"}</p>
        </div>
        <div className="flex flex-row justify-between items-start text-sm gap-4">
          <p className="font-medium text-text-600 shrink-0">Publisher:</p>
          <p className="text-text-900 text-right flex-1">
            {gameDetails?.publisher ? (
              <Link
                to={`/company/${gameDetails.publisher.id}`}
                className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors"
              >
                {gameDetails.publisher.name}
              </Link>
            ) : (
              "---"
            )}
          </p>
        </div>
        <div className="flex flex-row justify-between items-start text-sm gap-4">
          <p className="font-medium text-text-600 shrink-0">Developer:</p>
          <p className="text-text-900 text-right flex-1">
            {gameDetails?.developer ? (
              <Link
                to={`/company/${gameDetails.developer.id}`}
                className="text-primary-600 font-semibold hover:text-primary-700 hover:underline transition-colors"
              >
                {gameDetails.developer.name}
              </Link>
            ) : (
              "---"
            )}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-600">Genres:</p>
          <div className="flex flex-row flex-wrap gap-2">
            {gameDetails?.genres && gameDetails.genres.length > 0 ? (
              gameDetails.genres.map(genre => (
                <p
                  key={genre.id}
                  className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-700/10"
                >
                  {genre.name}
                </p>
              ))
            ) : (
              <p className="text-sm text-text-900">---</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-text-600">Platforms:</p>
          <div className="flex flex-row flex-wrap gap-2">
            {gameDetails?.platforms && gameDetails.platforms.length > 0 ? (
              gameDetails.platforms.map(platform => (
                <div key={platform.id} className="tooltip" data-tip={platform.name}>
                  <p className="inline-flex items-center rounded-md bg-secondary-50 px-2 py-1 text-xs font-medium text-secondary-700 ring-1 ring-inset ring-secondary-700/10">
                    {platform.abbreviation !== "" ? platform.abbreviation : platform.name}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-900">---</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-text-600">Engines:</p>
          <div className="flex flex-row flex-wrap gap-2">
            {gameDetails?.game_engines && gameDetails.game_engines.length > 0 ? (
              gameDetails.game_engines.map(engine => (
                <p
                  key={engine.id}
                  className="inline-flex items-center rounded-md bg-background-100 px-2 py-1 text-xs font-medium text-text-700 ring-1 ring-inset ring-background-300"
                >
                  {engine.name}
                </p>
              ))
            ) : (
              <p className="text-sm text-text-900">---</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-text-600">Game Modes:</p>
          <div className="flex flex-row flex-wrap gap-2">
            {gameDetails?.game_modes && gameDetails.game_modes.length > 0 ? (
              gameDetails.game_modes.map(mode => (
                <p
                  key={mode.id}
                  className="inline-flex items-center rounded-md bg-background-100 px-2 py-1 text-xs font-medium text-text-700 ring-1 ring-inset ring-background-300"
                >
                  {mode.name}
                </p>
              ))
            ) : (
              <p className="text-sm text-text-900">---</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-text-600">Player Perspectives:</p>
          <div className="flex flex-row flex-wrap gap-2">
            {gameDetails?.player_perspectives && gameDetails.player_perspectives.length > 0 ? (
              gameDetails.player_perspectives.map(perspective => (
                <p
                  key={perspective.id}
                  className="inline-flex items-center rounded-md bg-background-100 px-2 py-1 text-xs font-medium text-text-700 ring-1 ring-inset ring-background-300"
                >
                  {perspective.name}
                </p>
              ))
            ) : (
              <p className="text-sm text-text-900">---</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
