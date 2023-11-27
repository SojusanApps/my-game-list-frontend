import * as React from "react";

import TopBar from "../../components/TopBar/TopBar";
import GameInfo from "../../components/GameInfo/GameInfo";

export default function HomePage(): React.JSX.Element {
  return (
    <div>
      <TopBar />
      <div className="flex-col max-w-[60%] pt-20 mx-auto">
        <h1 className="text-9xl">HomePage</h1>
        <div className="flex space-x-1 mt-10">
          <GameInfo title="Game Title" gamePageUrl="test" />
          <GameInfo title="Game Title" gamePageUrl="test" />
          <GameInfo title="Game Title" gamePageUrl="test" />
          <GameInfo title="Game Title" gamePageUrl="test" />
          <GameInfo title="Game Title" gamePageUrl="test" />
          <GameInfo title="Game Title" gamePageUrl="test" />
        </div>
      </div>
    </div>
  );
}
