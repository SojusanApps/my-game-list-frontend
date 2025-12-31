import * as React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useGetUserDetails } from "../hooks/userQueries";
import { useGetFriendshipsInfiniteQuery } from "../hooks/friendshipQueries";
import { idSchema } from "@/lib/validation";
import { PageMeta } from "@/components/ui/PageMeta";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import FriendCard from "../components/FriendCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function UserFriendsPage(): React.JSX.Element {
  const { id } = useParams();
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return <Navigate to="/404" replace />;
  }

  const userId = parsedId.data;
  const { data: userDetails, isLoading: isUserLoading } = useGetUserDetails(userId);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isFriendsLoading,
  } = useGetFriendshipsInfiniteQuery({ user: userId });

  const allFriendships = data?.pages.flatMap(page => page.results) || [];
  const totalFriends = data?.pages[0]?.count ?? 0;

  const pageTitle = isUserLoading ? "Loading Friends..." : `${userDetails?.username}'s Friends`;

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col gap-6 h-[calc(100vh-4rem)]">
      <PageMeta title={pageTitle} />

      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl font-bold text-text-900 flex items-center gap-3">
          {isUserLoading ? (
            <Skeleton className="w-64 h-10" />
          ) : (
            <span>
              <span className="text-primary-600">{userDetails?.username}</span>&apos;s Friends
            </span>
          )}
          {!isFriendsLoading && (
            <span className="text-lg font-normal text-text-500 bg-background-100 px-3 py-1 rounded-full">
              {totalFriends}
            </span>
          )}
        </h1>
      </div>

      <div className="grow min-h-0">
        {isFriendsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton key={i} className="h-55 w-full rounded-xl" />
            ))}
          </div>
        ) : allFriendships.length === 0 ? (
          <div className="text-center py-12 bg-background-50 rounded-xl border border-dashed border-background-300">
            <p className="text-text-500">No friends found.</p>
          </div>
        ) : (
          <VirtualGridList
            className="h-full"
            items={allFriendships}
            renderItem={friendship => <FriendCard friendship={friendship} />}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            rowHeight={220}
          />
        )}
      </div>
    </div>
  );
}
