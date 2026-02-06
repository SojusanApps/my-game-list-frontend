import * as React from "react";
import { jwtDecode } from "jwt-decode";
import { useParams, Link, Navigate } from "react-router-dom";

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
import { PageMeta } from "@/components/ui/PageMeta";
import { SafeImage } from "@/components/ui/SafeImage";
import { Button } from "@/components/ui/Button";

export default function UserProfilePage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);
  const userId = parsedId.success ? parsedId.data : undefined;

  const { data: userDetails, isLoading: isUserDetailsLoading } = useGetUserDetails(userId);
  const { user } = useAuth();

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

  const validUserId = parsedId.data;
  let currentUser: TokenInfoType | null = null;
  if (user) {
    currentUser = jwtDecode<TokenInfoType>(user.token);
  }

  const pageTitle = isUserDetailsLoading ? "Loading Profile..." : `${userDetails?.username}'s Profile`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto p-4">
      <PageMeta title={pageTitle} />

      {isUserDetailsLoading ? (
        <>
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-48 mx-auto rounded-xl" />
            <Skeleton className="w-full h-10 rounded-lg" />
            <Skeleton className="w-full h-10 rounded-lg" />
            <Skeleton className="w-full h-32 rounded-xl" />
          </div>
          <div className="col-span-3 flex flex-col gap-4">
            <Skeleton className="w-1/3 h-8 rounded-lg" />
            <Skeleton className="w-full h-48 rounded-xl" />
            <Skeleton className="w-full h-64 rounded-xl" />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl overflow-hidden shadow-sm ring-1 ring-background-200">
              <SafeImage
                className="w-full aspect-square object-cover"
                src={userDetails?.gravatar_url || undefined}
                alt="User avatar"
              />
            </div>

            <FriendshipButtons currentUser={currentUser} userId={validUserId} />

            <Link to={`/game-list/${validUserId}`} className="w-full">
              <Button fullWidth variant="default" className="shadow-sm">
                Game List
              </Button>
            </Link>

            <Link to={`/profile/${validUserId}/collections`} className="w-full">
              <Button
                fullWidth
                variant="outline"
                className="shadow-sm border-primary-200 text-primary-600 hover:bg-primary-50"
              >
                Collections
              </Button>
            </Link>

            <UserProfileInformation userDetails={userDetails} />
            <UserFriendsList userDetails={userDetails} />
          </div>

          <div className="col-span-3 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-text-900">{userDetails?.username}</h1>
            </div>

            <section className="bg-white rounded-xl shadow-sm border border-background-200 p-6">
              <h2 className="text-xl font-bold text-text-900 mb-4">Statistics</h2>
              <UserStatistics userDetails={userDetails} />
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-background-200 p-6">
              <div className="flex items-center justify-between border-b border-background-200 pb-4 mb-4">
                <h2 className="text-xl font-bold text-text-900">Last game updates</h2>
                <Link
                  to={`/game-list/${userDetails?.id}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  View History
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                {userDetails?.latest_game_list_updates.map(latestGameListUpdate => (
                  <GameListUpdate key={latestGameListUpdate.id} latestGameListUpdate={latestGameListUpdate} />
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
