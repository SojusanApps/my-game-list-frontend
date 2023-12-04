import * as React from "react";

import UserAvatarPlaceholder from "../../assets/images/Image_Placeholder.svg";

type GameReviewProps = {
  className?: string;
};

function GameReview({ className }: Readonly<GameReviewProps>): React.JSX.Element {
  return (
    <article className={className}>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <img className="w-[45px] h-[75px]" src={UserAvatarPlaceholder} alt="User Avatar" />
          <div className="flex flex-col pl-1 pt-2">
            <p className="text-xl font-bold">Username</p>
            <p className="text-sm">Date</p>
          </div>
          <div className="flex flex-row pl-2 pt-2">
            <p>Rated:</p>
            <p className="pl-1">10</p>
          </div>
        </div>
        <p className="pl-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet ultrices tortor. Aenean non magna vitae
          ante tempor maximus at ut nulla. Pellentesque rhoncus pharetra placerat. Morbi pretium, quam molestie varius
          porta, enim felis maximus lectus, sed malesuada nulla purus vel neque. Nulla aliquam fermentum hendrerit.
          Phasellus dignissim dui augue, a porttitor sapien vehicula id. Morbi pretium semper felis, id ornare sem
          vestibulum sit amet. Donec imperdiet sagittis nisl eget scelerisque. Nam nec facilisis libero. Cras vestibulum
          sagittis nunc quis vestibulum. Praesent vel dolor nec erat vulputate facilisis sit amet id libero. In justo
          purus, rhoncus non porttitor in, tincidunt at urna. Suspendisse potenti.
        </p>
      </div>
    </article>
  );
}

export default GameReview;
