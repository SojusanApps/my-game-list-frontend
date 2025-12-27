import * as React from "react";
import { TokenInfoType } from "@/types";
import { Friendship, FriendshipRequest } from "@/client";
import {
  useSendFriendRequest,
  useGetFriendshipRequests,
  useGetFriendships,
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useDeleteFriendship,
} from "../hooks/friendshipQueries";

interface FriendshipButtonsProps {
  currentUser: TokenInfoType | null;
  userId: number;
}

export default function FriendshipButtons({ currentUser, userId }: FriendshipButtonsProps) {
  const { mutate: sendRequest } = useSendFriendRequest();
  const { mutate: acceptRequest } = useAcceptFriendRequest();
  const { mutate: rejectRequest } = useRejectFriendRequest();
  const { mutate: deleteFriendship } = useDeleteFriendship();

  const { data: friendshipsData } = useGetFriendships();
  const { data: sentRequestsData } = useGetFriendshipRequests({ receiver: userId });
  // Fetch requests sent BY this user. We will check if any are sent TO us.
  const { data: incomingRequestsData } = useGetFriendshipRequests({ sender: userId });

  const isOwnProfile = Number(currentUser?.user_id) === Number(userId);

  // Find existing friendship object if any
  const friendship = friendshipsData?.results?.find((f: Friendship) => f.friend.id === userId || f.user.id === userId);

  const isFriend = !!friendship;

  // Check if we sent a request to them
  const outgoingRequest = sentRequestsData?.results?.find((request: FriendshipRequest) => {
    const requestSenderId = request.sender.id;
    return Number(requestSenderId) === Number(currentUser?.user_id);
  });

  // Check if they sent a request to us
  const incomingRequest = incomingRequestsData?.results?.find((request: FriendshipRequest) => {
    const requestReceiverId = request.receiver.id;
    return Number(requestReceiverId) === Number(currentUser?.user_id);
  });

  const isIncomingRejected = !!incomingRequest?.rejected_at;
  const isRequestSent = !!outgoingRequest;
  const isOutgoingRejected = !!outgoingRequest?.rejected_at;

  const handleAddFriend = () => {
    if (currentUser) {
      sendRequest({ sender: currentUser.user_id, receiver: userId });
    }
  };

  const handleAccept = () => {
    if (incomingRequest) {
      acceptRequest({ id: incomingRequest.id });
    }
  };

  const handleReject = () => {
    if (incomingRequest) {
      rejectRequest({ id: incomingRequest.id });
    }
  };

  const handleUnfriend = () => {
    if (friendship && window.confirm("Are you sure you want to remove this friend?")) {
      deleteFriendship({ id: friendship.id });
    }
  };

  if (isOwnProfile) {
    return null;
  }

  if (isFriend) {
    return (
      <button
        type="button"
        onClick={handleUnfriend}
        className="bg-red-700 text-white p-2 rounded-lg mx-auto hover:bg-red-600 transition-colors"
      >
        Unfriend
      </button>
    );
  }

  if (incomingRequest) {
    return (
      <div className="flex gap-2 mx-auto">
        <button
          type="button"
          onClick={handleAccept}
          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-500 transition-colors"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={isIncomingRejected}
          className={`p-2 rounded-lg text-white transition-colors ${
            isIncomingRejected ? "bg-red-400 cursor-default" : "bg-red-600 hover:bg-red-500"
          }`}
        >
          {isIncomingRejected ? "Rejected" : "Reject"}
        </button>
      </div>
    );
  }

  if (isRequestSent) {
    return (
      <button
        type="button"
        disabled
        className={`p-2 rounded-lg text-white mx-auto cursor-default ${
          isOutgoingRejected ? "bg-red-400" : "bg-gray-500"
        }`}
      >
        {isOutgoingRejected ? "Request Rejected" : "Request Sent"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddFriend}
      className="bg-primary-950 text-white p-2 rounded-lg mx-auto hover:bg-primary-800 transition-colors"
    >
      Add Friend
    </button>
  );
}
