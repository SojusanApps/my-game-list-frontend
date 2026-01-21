import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { Game } from "@/client";

interface GameDetailsScreenshotsTabProps {
  gameDetails?: Game;
  onScreenshotClick: (screenshot: string) => void;
}

export default function GameDetailsScreenshotsTab({
  gameDetails,
  onScreenshotClick,
}: Readonly<GameDetailsScreenshotsTabProps>) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-background-200 p-6 animate-in fade-in duration-300">
      {gameDetails?.screenshots && gameDetails.screenshots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gameDetails.screenshots.map((screenshot, index) => (
            <button
              key={screenshot || index}
              onClick={() => onScreenshotClick(screenshot)}
              className="rounded-lg overflow-hidden shadow-md group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            >
              <SafeImage
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={getIGDBImageURL(screenshot, IGDBImageSize.SCREENSHOT_MED_569_320)}
                alt={`${gameDetails.title} screenshot ${index + 1}`}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center text-text-500 italic py-8">No screenshots available.</div>
      )}
    </div>
  );
}
