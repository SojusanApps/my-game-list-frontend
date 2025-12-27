import * as React from "react";
import { jwtDecode } from "jwt-decode";

import { Link } from "react-router-dom";
import AppLogo from "@/components/AppLogo/AppLogo";
import { TokenInfoType, LocalStorageUserType } from "@/types";
import AvatarImagePlaceholder from "@/assets/images/Image_Placeholder.svg";
import SearchBar from "@/components/SearchBar/SearchBar";

import NotificationBell from "@/features/notifications/components/NotificationBell";
import { useAuth } from "@/features/auth/context/AuthProvider";
import ChevronDownIcon from "../Icons/ChevronDown";
import ProfileIcon from "../Icons/Profile";
import SettingsIcon from "../Icons/Settings";
import LogoutIcon from "../Icons/Logout";

function LoggedInView({
  user,
  logout,
}: Readonly<{ user: LocalStorageUserType | null; logout: () => void }>): React.JSX.Element {
  const userInfo = jwtDecode<TokenInfoType>(user!.token);

  const handleClick = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <NotificationBell />
      <div className="dropdown">
        <button tabIndex={0} type="button" className="btn btn-sm">
          {user?.email}
          <ChevronDownIcon className="w-4 h-4" />
          <div className="avatar">
            <div className="w-6 rounded-full">
              <img src={AvatarImagePlaceholder} alt="User avatar" />
            </div>
          </div>
        </button>
        <ul className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <Link to={`/profile/${userInfo?.user_id}`}>
              <ProfileIcon className="w-4 h-4" />
              Profile
            </Link>
          </li>
          <div className="divider my-0" />
          <li>
            <Link to="/settings">
              <SettingsIcon className="w-4 h-4" />
              Account settings
            </Link>
          </li>
          <li>
            <button type="button" onClick={handleClick}>
              <LogoutIcon className="w-4 h-4" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

function NotLoggedInView(): React.JSX.Element {
  return (
    <>
      <div>
        <Link to="/register">
          <button
            type="button"
            className="w-full px-5 py-1.5 bg-secondary-950 text-white font-medium capitalize rounded-xl shadow-md hover:bg-secondary-500 hover:shadow-lg focus:bg-secondary-400 focus:outline-hidden focus:ring-0 active:bg-secondary-700"
          >
            Register
          </button>
        </Link>
      </div>
      <div>
        <Link to="/login">
          <button
            type="button"
            className="w-full px-5 py-1.5 bg-primary-600 text-white font-medium capitalize rounded-xl shadow-md hover:bg-primary-500 hover:shadow-lg focus:bg-primary-400 focus:outline-hidden focus:ring-0 active:bg-primary-700"
          >
            Login
          </button>
        </Link>
      </div>
    </>
  );
}

function TopBar(): React.JSX.Element {
  const { user, logout } = useAuth();

  return (
    <nav className="relative bg-primary-950 w-full z-20 top-0 left-0 border-b border-gray-500">
      <div className="max-w-7xl flex p-2 justify-between items-center mx-auto">
        <div className="flex items-center">
          <Link to="/home" className="flex items-center" aria-label="Game List logo">
            <AppLogo classNameSojusan="text-secondary-950 text-2xl" classNameGameList="text-white text-3xl" />
          </Link>
        </div>
        <ul className="text-white font-bold hover:text-secondary-950 hover:cursor-pointer">
          <li>
            <Link to="/search">Search Engine</Link>
          </li>
        </ul>
        <SearchBar />
        <div className="flex">{user ? <LoggedInView user={user} logout={logout} /> : <NotLoggedInView />}</div>
      </div>
    </nav>
  );
}

export default TopBar;
