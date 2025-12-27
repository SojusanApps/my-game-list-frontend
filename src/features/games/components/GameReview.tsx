import * as React from "react";

import { GameReview as GameReviewType } from "@/client";
import { SafeImage } from "@/components/ui/SafeImage";

type GameReviewProps = {
  className?: string;
  gameReview: GameReviewType;
};

function GameReview({ className, gameReview }: Readonly<GameReviewProps>): React.JSX.Element {
  const CreatedAt = new Date(gameReview.created_at);

  return (
    <article className={className}>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <SafeImage
            className="w-11.25 h-18.75 shrink-0"
            src={gameReview?.user.gravatar_url || undefined}
            alt={gameReview?.user.username}
          />
          <div className="flex flex-col pl-1 pt-2">
            <p className="text-xl font-bold">{gameReview?.user.username}</p>
            <p className="text-sm">
              {CreatedAt.toLocaleDateString()} {CreatedAt.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex flex-row pl-2 pt-2">
            <p>Rated:</p>
            <p className="pl-1">{gameReview?.score}</p>
          </div>
        </div>
        <p className="pl-2">{gameReview?.review}</p>
      </div>
    </article>
  );
}

export default GameReview;
