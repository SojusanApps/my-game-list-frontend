import * as React from "react";

import TopBar from "../../components/TopBar/TopBar";
import GameInfo from "../../components/GameInfo/GameInfo";

export default function GameListPage(): React.JSX.Element {
  return (
    <div>
      <TopBar />
      <div className="grid grid-cols-5 gap-8 max-w-[60%] pt-20 mx-auto divide-x-2">
        <div className="flex flex-row flex-wrap gap-1 col-span-4 pr-2">
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
          <GameInfo className="flex-none" title="Title" gamePageUrl="" />
        </div>
        <div className="flex flex-col pl-2 gap-2">
          <div className="relative w-full">
            <input
              type="search"
              id="search-dropdown"
              className="block p-1 w-full z-20 text-sm text-text-500 bg-background-100 rounded-r-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:outline-none"
              placeholder="Search Games, Developers..."
              required
            />
            <button
              type="submit"
              className="absolute top-0 right-0 p-1.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              <svg width="100%" height="100%" fill="none" viewBox="0 0 24 24">
                <path
                  d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
          <div className="flex relative w-full">
            <p className="pr-2">Developer:</p>
            <select className="flex-shrink-0 z-10 inline-flex items-center text-sm font-medium text-center text-text-950 bg-background-300 border border-background-400 rounded-l-lg hover:bg-background-400 ">
              <option>All</option>
              <option>Developer 1</option>
              <option>Developer 2</option>
            </select>
          </div>
          <div className="flex relative w-full">
            <p className="pr-2">Genre:</p>
            <select multiple className="border-black border-[1px]">
              <option>Developer 1</option>
              <option>Developer 2</option>
            </select>
          </div>
          <div className="flex relative w-full">
            <p className="pr-2">Platform:</p>
            <select multiple className="border-black border-[1px]">
              <option>Platform 1</option>
              <option>Platform 2</option>
            </select>
          </div>
          <div className="flex relative w-full">
            <p className="pr-2">Status:</p>
            <select multiple className="border-black border-[1px]">
              <option>Playing</option>
              <option>Plan to Play</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
