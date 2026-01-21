import * as React from "react";
import { TokenInfoType } from "@/types";
import { Button } from "@/components/ui/Button";
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

export default function FriendshipButtons({ currentUser, userId }: Readonly<FriendshipButtonsProps>) {
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
    if (friendship && globalThis.confirm("Are you sure you want to remove this friend?")) {
      deleteFriendship({ id: friendship.id });
    }
  };

  if (isOwnProfile) {
    return null;
  }

  if (isFriend) {
    return (
      <Button type="button" onClick={handleUnfriend} variant="destructive" className="w-full">
        Unfriend
      </Button>
    );
  }

  if (incomingRequest) {
    return (
      <div className="flex gap-2 w-full">
        <Button type="button" onClick={handleAccept} className="flex-1 bg-green-600 hover:bg-green-700">
          Accept
        </Button>
        <Button
          type="button"
          onClick={handleReject}
          disabled={isIncomingRejected}
          variant="destructive"
          className="flex-1"
        >
          {isIncomingRejected ? "Rejected" : "Reject"}
        </Button>
      </div>
    );
  }

  if (isRequestSent) {
    return (
      <Button type="button" disabled variant="secondary" className="w-full cursor-default">
        {isOutgoingRejected ? "Request Rejected" : "Request Sent"}
      </Button>
    );
  }

  return (
    <Button type="button" onClick={handleAddFriend} className="w-full">
      Add Friend
    </Button>
  );
}
