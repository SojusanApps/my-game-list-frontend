import * as React from "react";

function SearchInput(): React.JSX.Element {
  return (
    <form className="grow pl-5 pr-5">
      <div className="flex">
        <select className="flex-shrink-0 z-10 inline-flex items-center py-1 px-2 text-sm font-medium text-center text-text-950 bg-background-300 border border-background-400 rounded-l-lg hover:bg-background-400 focus:ring-1 focus:outline-none focus:ring-gray-100">
          <option>All</option>
          <option>Mockups</option>
          <option>Templates</option>
          <option>Design</option>
          <option>Logos</option>
        </select>
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="block p-1 w-full z-20 text-sm text-text-500 bg-background-100 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:border-primary-500 focus:ring-1 focus:outline-none"
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
      </div>
    </form>
  );
}

export default SearchInput;
