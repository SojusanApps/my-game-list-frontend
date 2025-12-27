import * as React from "react";
import { jwtDecode } from "jwt-decode";
import { useParams, Link, Navigate } from "react-router-dom";

import GameCoverImagePlaceholder from "@/assets/images/Image_Placeholder.svg";
import { useGetUserDetails } from "../hooks/userQueries";
import { TokenInfoType } from "@/types";
import { useAuth } from "@/features/auth/context/AuthProvider";
import FriendshipButtons from "../components/FriendshipButtons";
import UserProfileInformation from "../components/UserProfileInformation";
import UserFriendsList from "../components/UserFriendsList";
import UserStatistics from "../components/UserStatistics";
import GameListUpdate from "../components/GameListUpdate";
import { Skeleton } from "@/components/ui/Skeleton";
import { idSchema } from "@/lib/validation";

export default function UserProfilePage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

  const userId = parsedId.data;
  const { data: userDetails, isLoading: isUserDetailsLoading } = useGetUserDetails(userId);

  const { user } = useAuth();
  let currentUser: TokenInfoType | null = null;
  if (user) {
    currentUser = jwtDecode<TokenInfoType>(user.token);
  }

  if (isUserDetailsLoading) {
    return (
      <div className="grid grid-cols-4 divide-x-2 divide-gray-300 max-w-[60%] mx-auto gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-48 mx-auto" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-32" />
        </div>
        <div className="col-span-3 flex flex-col gap-2 pl-4">
          <Skeleton className="w-1/3 h-8" />
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-full h-64" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4 divide-x-2 divide-gray-300 max-w-[60%] mx-auto">
        <div className="flex flex-col pr-1 gap-2">
          <img
            className="border flex-none border-black mx-auto"
            src={userDetails?.gravatar_url ? `${userDetails.gravatar_url}` : GameCoverImagePlaceholder}
            alt="User avatar"
          />
          <FriendshipButtons currentUser={currentUser} userId={userId} />

          <Link to={`/game-list/${userDetails?.id}`} className="mx-auto">
            <button type="button" className="bg-primary-950 text-white p-2 rounded-lg">
              Game List
            </button>
          </Link>
          <UserProfileInformation userDetails={userDetails} />
          <UserFriendsList userDetails={userDetails} />
        </div>
        <div className="col-span-3 flex flex-col pl-1 divide-y-2 divide-gray-300  ">
          <p className="font-bold text-xl">{userDetails?.username}</p>
          <p className="font-bold pt-1">Statistics</p>
          <UserStatistics userDetails={userDetails} />
          <div className="grid grid-cols-2 border-b-2 border-b-primary-950 pt-2">
            <p className="font-bold">Last game updates</p>
            <p className="font-bold text-secondary-950 text-right">History</p>
          </div>
          <div>
            <div className="flex flex-col gap-2 flex-wrap">
              {userDetails?.latest_game_list_updates.map(latestGameListUpdate => (
                <GameListUpdate key={latestGameListUpdate.id} latestGameListUpdate={latestGameListUpdate} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
