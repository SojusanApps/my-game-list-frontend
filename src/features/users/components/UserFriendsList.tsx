import * as React from "react";
import { Link } from "react-router-dom";
import { UserDetail } from "@/client";
import GameCoverImagePlaceholder from "@/assets/images/Image_Placeholder.svg";

interface UserFriendsListProps {
  userDetails?: UserDetail;
}

export default function UserFriendsList({ userDetails }: UserFriendsListProps) {
  return (
    <div>
      <div className="grid grid-cols-2 border-b-2 border-b-primary-950">
        <p className="font-bold">Friends</p>
        <p className="font-bold text-secondary-950 text-right">All</p>
      </div>
      <div className="flex flex-row flex-wrap gap-1 pl-2">
        {userDetails?.friends.map(friend => (
          <Link key={friend.id} to={`/profile/${friend.id}`}>
            <img
              className="w-11.25 h-18.75 border border-black object-cover"
              src={friend.gravatar_url ? `${friend.gravatar_url}` : GameCoverImagePlaceholder}
              alt={`friend avatar ${friend.id}`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
