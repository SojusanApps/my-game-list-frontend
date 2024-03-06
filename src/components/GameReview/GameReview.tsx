import * as React from "react";

import UserAvatarPlaceholder from "../../assets/images/Image_Placeholder.svg";
import { GameReviewType } from "../../models/GameReview";

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
          <img
            className="w-[45px] h-[75px]"
            src={gameReview?.user.avatar ? `data:image/jpg;base64,${gameReview?.user.avatar}` : UserAvatarPlaceholder}
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
