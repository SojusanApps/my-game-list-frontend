import * as React from "react";

import GameCoverImagePlaceholder from "../../assets/images/Image_Placeholder.svg";
import GameReview from "../../components/GameReview/GameReview";
import TopBar from "../../components/TopBar/TopBar";

type GameInfoProps = {
  coverImage?: string;
  title: string;
};

export default function GameDetailPage({
  coverImage = GameCoverImagePlaceholder,
  title = "Game Title Placeholder",
}: Readonly<GameInfoProps>): React.JSX.Element {
  return (
    <div>
      <TopBar />
      <div className="grid grid-cols-4 divide-x-2 divide-gray-300 max-w-[60%] pt-20 mx-auto">
        <div className="flex flex-col pr-1 gap-2">
          <img className="border-[1px] flex-none border-black mx-auto" src={coverImage} alt={title} />
          <button type="button" className="bg-primary-950 text-white p-2 rounded-lg mx-auto">
            Add to List
          </button>
          <div>
            <p className="font-bold">Information</p>
            <div className="flex flex-col border-[1px] border-black p-2 gap-1">
              <div className="flex flex-row">
                <p className="font-bold">Release date:</p>
                <p className="ml-2">31.12.9999</p>
              </div>
              <div className="flex flex-row">
                <p className="font-bold">Publisher:</p>
                <p className="ml-2">Placeholder Publisher</p>
              </div>
              <div className="flex flex-row">
                <p className="font-bold">Developer:</p>
                <p className="ml-2">Placeholder Developer</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">Genres:</p>
                <div className="flex flex-row flex-wrap gap-1">
                  <p className="bg-background-300 rounded-xl border-primary-950 border-[1px] p-1">Action</p>
                  <p className="bg-background-300 rounded-xl border-primary-950 border-[1px] p-1">Souls-like</p>
                  <p className="bg-background-300 rounded-xl border-primary-950 border-[1px] p-1">Strategy</p>
                  <p className="bg-background-300 rounded-xl border-primary-950 border-[1px] p-1">RPG</p>
                  <p className="bg-background-300 rounded-xl border-primary-950 border-[1px] p-1">Adventure</p>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">Platforms:</p>
                <div className="flex flex-row flex-wrap gap-1">
                  <p className="bg-background-300 rounded-xl border-primary-950 border-[1px] p-1">PS 5</p>
                  <p className="bg-background-300 rounded-xl border-primary-950 border-[1px] p-1">PC</p>
                  <p className="bg-background-300 rounded-xl border-primary-950 border-[1px] p-1">Switch</p>
                  <p className="bg-background-300 rounded-xl border-primary-950 border-[1px] p-1">XBOX Series X</p>
                  <p className="bg-background-300 rounded-xl border-primary-950 border-[1px] p-1">Wii</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3 flex flex-col pl-1 divide-y-2 divide-gray-300  ">
          <p className="font-bold text-xl">{title}</p>
          <p className="font-bold pt-1">Statistics</p>
          <div className="flex flex-col pb-1">
            <div className="grid grid-cols-4 pt-2">
              <div className="flex flex-col">
                <p className="bg-secondary-950 text-white font-bold mx-auto p-1">Score</p>
                <p className="font-bold text-4xl mx-auto">10.00</p>
                <p className="font-bold text-sm mx-auto">999.999.999 ratings</p>
              </div>
              <div className="flex flex-col">
                <p className="bg-secondary-600 text-text-950 font-bold mx-auto p-1">Ranked</p>
                <p className="font-bold text-4xl mx-auto">999.999</p>
              </div>
              <div className="flex flex-col">
                <p className="bg-secondary-600 text-text-950 font-bold mx-auto p-1">Popularity</p>
                <p className="font-bold text-4xl mx-auto">999.999</p>
              </div>
              <div className="flex flex-col">
                <p className="bg-secondary-600 text-text-950 font-bold mx-auto p-1">Members</p>
                <p className="font-bold text-4xl mx-auto">999.999</p>
              </div>
            </div>
            <button type="button" className="bg-primary-950 text-white p-2 rounded-lg mb-auto mx-auto">
              More statistics
            </button>
          </div>
          <p className="font-bold pt-1">Description</p>
          <p className="pl-2 pt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet ultrices tortor. Aenean non magna
            vitae ante tempor maximus at ut nulla. Pellentesque rhoncus pharetra placerat. Morbi pretium, quam molestie
            varius porta, enim felis maximus lectus, sed malesuada nulla purus vel neque. Nulla aliquam fermentum
            hendrerit. Phasellus dignissim dui augue, a porttitor sapien vehicula id. Morbi pretium semper felis, id
            ornare sem vestibulum sit amet. Donec imperdiet sagittis nisl eget scelerisque. Nam nec facilisis libero.
            Cras vestibulum sagittis nunc quis vestibulum. Praesent vel dolor nec erat vulputate facilisis sit amet id
            libero. In justo purus, rhoncus non porttitor in, tincidunt at urna. Suspendisse potenti.
            <br />
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet ultrices tortor. Aenean non magna
            vitae ante tempor maximus at ut nulla. Pellentesque rhoncus pharetra placerat. Morbi pretium, quam molestie
            varius porta, enim felis maximus lectus, sed malesuada nulla purus vel neque. Nulla aliquam fermentum
            hendrerit. Phasellus dignissim dui augue, a porttitor sapien vehicula id. Morbi pretium semper felis, id
            ornare sem vestibulum sit amet. Donec imperdiet sagittis nisl eget scelerisque. Nam nec facilisis libero.
            Cras vestibulum sagittis nunc quis vestibulum. Praesent vel dolor nec erat vulputate facilisis sit amet id
            libero. In justo purus, rhoncus non porttitor in, tincidunt at urna. Suspendisse potenti.
          </p>
          <p className="font-bold pt-1">Reviews</p>
          <GameReview className="pl-2" />
        </div>
      </div>
    </div>
  );
}
