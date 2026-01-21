import * as React from "react";
import { Link } from "react-router-dom";
import { UserDetail } from "@/client";
import { SafeImage } from "@/components/ui/SafeImage";

interface UserFriendsListProps {
  userDetails?: UserDetail;
}

export default function UserFriendsList({ userDetails }: Readonly<UserFriendsListProps>) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-background-200 overflow-hidden">
      <div className="bg-background-50 px-4 py-3 border-b border-background-200 flex justify-between items-center">
        <p className="font-semibold text-text-900">Friends</p>
        <Link
          to={userDetails ? `/profile/${userDetails.id}/friends` : "#"}
          className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="p-4">
        {userDetails?.friends && userDetails.friends.length > 0 ? (
          <div className="flex flex-row flex-wrap gap-3">
            {userDetails.friends.map(friend => (
              <Link key={friend.id} to={`/profile/${friend.id}`} className="tooltip" data-tip={friend.username}>
                <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-background-300 hover:ring-primary-500 transition-all">
                  <SafeImage
                    className="w-full h-full"
                    src={friend.gravatar_url || undefined}
                    alt={`friend avatar ${friend.username}`}
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-500 italic">No friends yet.</p>
        )}
      </div>
    </div>
  );
}
