import * as React from "react";

import AppLogo from "../../assets/logos/AppLogo.svg";
import { UserType } from "../../helpers/CustomTypes";
import AvatarImagePlaceholder from "../../assets/images/Image_Placeholder.svg";
import Constants from "../../helpers/Constants";

function LoggedInView({ user }: Readonly<{ user: UserType | null }>): React.JSX.Element {
  return (
    <div className="dropdown">
      <button tabIndex={0} type="button" className="btn btn-sm">
        {user?.email}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
        <div className="avatar">
          <div className="w-6 rounded-full">
            <img src={AvatarImagePlaceholder} alt="User avatar" />
          </div>
        </div>
      </button>
      <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <a href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            Profile
          </a>
        </li>
        <div className="divider my-0" />
        <li>
          <a href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Account settings
          </a>
        </li>
        <li>
          <a href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
}

function NotLoggedInView(): React.JSX.Element {
  return (
    <>
      <div>
        <a href="/register">
          <button
            type="button"
            className="w-full px-5 py-1.5 bg-secondary-950 text-white font-medium capitalize rounded-xl shadow-md hover:bg-secondary-500 hover:shadow-lg focus:bg-secondary-400 focus:outline-none focus:ring-0 active:bg-secondary-700"
          >
            Register
          </button>
        </a>
      </div>
      <div>
        <a href="/login">
          <button
            type="button"
            className="w-full px-5 py-1.5 bg-primary-600 text-white font-medium capitalize rounded-xl shadow-md hover:bg-primary-500 hover:shadow-lg focus:bg-primary-400 focus:outline-none focus:ring-0 active:bg-primary-700"
          >
            Login
          </button>
        </a>
      </div>
    </>
  );
}

function TopBar(): React.JSX.Element {
  const localStorageUser = localStorage.getItem("user");
  let user: UserType | null = null;
  if (localStorageUser) {
    user = JSON.parse(localStorageUser);
  }

  function isLoggedIn(): boolean {
    return user !== null;
  }

  return (
    <nav className="relative bg-primary-950 w-full z-20 top-0 left-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex p-2 justify-between items-center mx-auto">
        <div className="flex items-center">
          <a href="/home" className="flex items-center">
            <img src={AppLogo} className="w-10 h-10" alt="app logo" />
            <h2 className="font-bold text-2xl text-background-200">&nbsp;{Constants.APPLICATION_NAME}</h2>
          </a>
        </div>
        <div className="grow px-5 relative items-center inline-flex">
          <div className="flex grow">
            <input
              type="text"
              placeholder="Search for game..."
              className="border border-gray-200 rounded-l-md py-1 px-2 pr-8 w-full"
            />
            <div className="block border bg-background-200 py-1 rounded-r-md">
              <svg
                className="h-6 w-8 text-gray-400 hover:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex">{isLoggedIn() ? <LoggedInView user={user} /> : <NotLoggedInView />}</div>
      </div>
    </nav>
  );
}

export default TopBar;
