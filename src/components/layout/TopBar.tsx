import * as React from "react";
import { jwtDecode } from "jwt-decode";

import { Link } from "react-router-dom";
import AppLogo from "@/components/ui/AppLogo";
import { Button } from "@/components/ui/Button";
import { TokenInfoType, LocalStorageUserType } from "@/types";
import SearchBar from "@/features/games/components/SearchBar";

import NotificationBell from "@/features/notifications/components/NotificationBell";
import { useAuth } from "@/features/auth/context/AuthProvider";
import ChevronDownIcon from "@/components/ui/Icons/ChevronDown";
import ProfileIcon from "@/components/ui/Icons/Profile";
import SettingsIcon from "@/components/ui/Icons/Settings";
import LogoutIcon from "@/components/ui/Icons/Logout";

import { useGetUserDetails } from "@/features/users/hooks/userQueries";
import { SafeImage } from "@/components/ui/SafeImage";

function LoggedInView({
  user,
  logout,
}: Readonly<{ user: LocalStorageUserType | null; logout: () => void }>): React.JSX.Element {
  const userInfo = jwtDecode<TokenInfoType>(user!.token);
  const { data: userDetails } = useGetUserDetails(userInfo.user_id);

  const handleClick = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-4">
      <NotificationBell />
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-sm font-medium text-primary-100 hidden md:block">{userDetails?.username}</span>
          <div className="avatar">
            <SafeImage
              src={userDetails?.gravatar_url || undefined}
              alt="User avatar"
              className="w-9 h-9 rounded-full ring-2 ring-white/20"
            />
          </div>
          <ChevronDownIcon className="w-4 h-4 text-primary-300" />
        </div>
        <ul className="dropdown-content z-1 menu p-2 shadow-2xl bg-white border border-background-200 rounded-xl w-52 mt-4 gap-1">
          <li>
            <Link
              to={`/profile/${userInfo?.user_id}`}
              className="text-text-700 hover:text-primary-600 hover:bg-primary-50 active:bg-primary-100 rounded-lg py-2.5"
            >
              <ProfileIcon className="w-4 h-4" />
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="text-text-700 hover:text-primary-600 hover:bg-primary-50 active:bg-primary-100 rounded-lg py-2.5"
            >
              <SettingsIcon className="w-4 h-4" />
              Account settings
            </Link>
          </li>
          <li className="mt-1">
            <button
              type="button"
              onClick={handleClick}
              className="text-error-600 hover:bg-error-50 hover:text-error-700 rounded-lg py-2.5"
            >
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
    <div className="flex items-center gap-3">
      <Link to="/register">
        <Button variant="ghost" size="sm" className="text-primary-100 hover:text-white hover:bg-white/10">
          Register
        </Button>
      </Link>
      <Link to="/login">
        <Button size="sm" className="bg-primary-500 hover:bg-primary-400">
          Login
        </Button>
      </Link>
    </div>
  );
}

function TopBar(): React.JSX.Element {
  const { user, logout } = useAuth();

  let userInfo: TokenInfoType | null = null;

  if (user) {
    userInfo = jwtDecode<TokenInfoType>(user.token);
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary-950 shadow-lg">
      <div className="max-w-7xl flex p-3 justify-between items-center mx-auto">
        <div className="flex items-center gap-8">
          <Link
            to="/home"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            aria-label="Game List logo"
          >
            <AppLogo classNameSojusan="text-primary-400 text-2xl" classNameGameList="text-white text-3xl" />
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            <li>
              <Link to="/search" className="text-sm font-semibold text-primary-200 transition-colors hover:text-white">
                Search Engine
              </Link>
            </li>

            {user && (
              <li>
                <Link
                  to={`/game-list/${userInfo?.user_id}`}
                  className="text-sm font-semibold text-primary-200 transition-colors hover:text-white"
                >
                  Game List
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          {user ? <LoggedInView user={user} logout={logout} /> : <NotLoggedInView />}
        </div>
      </div>
    </nav>
  );
}

export default TopBar;
