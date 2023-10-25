import * as React from "react";

import AppLogo from "../../assets/logos/AppLogo.svg";
import SearchInput from "../Fields/SearchInput/SearchInput";

function TopBar(): React.JSX.Element {
  return (
    <nav className="bg-primary-950 fixed w-full z-20 top-0 left-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <a href="/home" className="flex items-center">
          <img src={AppLogo} className="h-8" alt="app logo" />
          <h6 className="text-background-200 font-bold">&nbsp;MyGameList</h6>
        </a>
        <SearchInput />
        <div>
          <button
            type="button"
            className="w-full px-5 py-1.5 bg-secondary-950 text-white font-medium capitalize rounded-xl shadow-md hover:bg-secondary-500 hover:shadow-lg focus:bg-secondary-400 focus:outline-none focus:ring-0 active:bg-secondary-700"
          >
            Register
          </button>
        </div>
        <div>
          <button
            type="button"
            className="w-full px-5 py-1.5 bg-primary-600 text-white font-medium capitalize rounded-xl shadow-md hover:bg-primary-500 hover:shadow-lg focus:bg-primary-400 focus:outline-none focus:ring-0 active:bg-primary-700"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}

export default TopBar;
