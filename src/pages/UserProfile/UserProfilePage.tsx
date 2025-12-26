import * as React from "react";
import { jwtDecode } from "jwt-decode";
import { useParams, Link } from "react-router-dom";

import GameCoverImagePlaceholder from "@/assets/images/Image_Placeholder.svg";
import IGDBImageSize, { getIGDBImageURL } from "@/helpers/IGDBIntegration";
import { useGetUserDetails } from "@/hooks/userQueries";
import { TokenInfoType, LocalStorageUserType } from "@/helpers/CustomTypes";
import { Friendship, FriendshipRequest } from "@/client";
import {
  useSendFriendRequest,
  useGetFriendshipRequests,
  useGetFriendships,
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useDeleteFriendship,
} from "@/hooks/friendshipQueries";

export default function UserProfilePage(): React.JSX.Element {
  const { id } = useParams();
  const userId = +id!;
  const { data: userDetails } = useGetUserDetails(userId);

  const localStorageUser = localStorage.getItem("user");
  let currentUser: TokenInfoType | null = null;
  if (localStorageUser) {
    const user: LocalStorageUserType = JSON.parse(localStorageUser);
    currentUser = jwtDecode<TokenInfoType>(user.token);
  }

  const { data: friendshipsData } = useGetFriendships();
  const { data: sentRequestsData } = useGetFriendshipRequests({ receiver: userId });
  // Fetch requests sent BY this user. We will check if any are sent TO us.
  const { data: incomingRequestsData } = useGetFriendshipRequests({ sender: userId });

  const { mutate: sendRequest } = useSendFriendRequest();
  const { mutate: acceptRequest } = useAcceptFriendRequest();
  const { mutate: rejectRequest } = useRejectFriendRequest();
  const { mutate: deleteFriendship } = useDeleteFriendship();

  const isOwnProfile = Number(currentUser?.user_id) === Number(userId);

  // Find existing friendship object if any
  const friendship = friendshipsData?.results?.find((f: Friendship) => f.friend.id === userId || f.user.id === userId);

  const isFriend = !!friendship;

  // Check if we sent a request to them
  const outgoingRequest = sentRequestsData?.results?.find((request: FriendshipRequest) => {
    const requestSenderId = request.sender.id;
    return Number(requestSenderId) === Number(currentUser?.user_id);
  });

  const isRequestSent = !!outgoingRequest;
  const isOutgoingRejected = !!outgoingRequest?.rejected_at;

  // Check if they sent a request to us
  const incomingRequest = incomingRequestsData?.results?.find((request: FriendshipRequest) => {
    const requestReceiverId = request.receiver.id;
    return Number(requestReceiverId) === Number(currentUser?.user_id);
  });

  const isIncomingRejected = !!incomingRequest?.rejected_at;

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

  return (
    <div>
      <div className="grid grid-cols-4 divide-x-2 divide-gray-300 max-w-[60%] mx-auto">
        <div className="flex flex-col pr-1 gap-2">
          <img
            className="border flex-none border-black mx-auto"
            src={userDetails?.gravatar_url ? `${userDetails.gravatar_url}` : GameCoverImagePlaceholder}
            alt="User avatar"
          />

          {!isOwnProfile && userDetails && currentUser && (
            <>
              {isFriend ? (
                <button
                  type="button"
                  onClick={handleUnfriend}
                  className="bg-red-700 text-white p-2 rounded-lg mx-auto hover:bg-red-600 transition-colors"
                >
                  Unfriend
                </button>
              ) : incomingRequest ? (
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
              ) : isRequestSent ? (
                <button
                  type="button"
                  disabled
                  className={`p-2 rounded-lg text-white mx-auto cursor-default ${
                    isOutgoingRejected ? "bg-red-400" : "bg-gray-500"
                  }`}
                >
                  {isOutgoingRejected ? "Request Rejected" : "Request Sent"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddFriend}
                  className="bg-primary-950 text-white p-2 rounded-lg mx-auto hover:bg-primary-800 transition-colors"
                >
                  Add Friend
                </button>
              )}
            </>
          )}

          <Link to={`/game-list/${userDetails?.id}`} className="mx-auto">
            <button type="button" className="bg-primary-950 text-white p-2 rounded-lg">
              Game List
            </button>
          </Link>
          <div>
            <p className="font-bold">Information</p>
            <div className="flex flex-col border border-black p-2 gap-1">
              <div className="flex flex-row">
                <p className="font-bold">Joined:</p>
                <p className="ml-2">
                  {new Date(userDetails?.date_joined ? userDetails.date_joined : "").toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-row">
                <p className="font-bold">Gender:</p>
                <p className="ml-2">Private</p>
              </div>
              <div className="flex flex-row">
                <p className="font-bold">Last login:</p>
                <p className="ml-2">
                  {new Date(userDetails?.last_login ? userDetails.last_login : "").toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
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
        <div className="col-span-3 flex flex-col pl-1 divide-y-2 divide-gray-300  ">
          <p className="font-bold text-xl">{userDetails?.username}</p>
          <p className="font-bold pt-1">Statistics</p>
          <div className="flex flex-col pb-1">
            <div className="grid grid-cols-4 pt-2">
              <div className="flex flex-col col-span-2 gap-1 pl-4">
                <div className="flex flex-row">
                  <p className="font-bold">Currently Playing:</p>
                  <p className="text-right ml-2">{userDetails?.game_list_statistics.playing}</p>
                </div>
                <div className="flex flex-row">
                  <p className="font-bold">On Hold:</p>
                  <p className="ml-2">{userDetails?.game_list_statistics.on_hold}</p>
                </div>
                <div className="flex flex-row">
                  <p className="font-bold">Dropped:</p>
                  <p className="ml-2">{userDetails?.game_list_statistics.dropped}</p>
                </div>
                <div className="flex flex-row">
                  <p className="font-bold">Completed:</p>
                  <p className="ml-2">{userDetails?.game_list_statistics.completed}</p>
                </div>
                <div className="flex flex-row">
                  <p className="font-bold">Plan To Play:</p>
                  <p className="ml-2">{userDetails?.game_list_statistics.plan_to_play}</p>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="bg-secondary-950 text-white font-bold mx-auto p-1">Total Entries</p>
                <p className="font-bold text-4xl mx-auto">{userDetails?.game_list_statistics.total}</p>
              </div>
              <div className="flex flex-col">
                <p className="bg-secondary-600 text-text-950 font-bold mx-auto p-1">Mean Score</p>
                <p className="font-bold text-4xl mx-auto">{userDetails?.game_list_statistics.mean_score?.toFixed(2)}</p>
              </div>
            </div>
            <button type="button" className="bg-primary-950 text-white p-2 rounded-lg mb-auto mx-auto">
              More statistics
            </button>
          </div>
          <div className="grid grid-cols-2 border-b-2 border-b-primary-950 pt-2">
            <p className="font-bold">Last game updates</p>
            <p className="font-bold text-secondary-950 text-right">History</p>
          </div>
          <div className="flex flex-col gap-2 flex-wrap">
            {userDetails?.latest_game_list_updates.map(latestGameListUpdate => (
              <div key={latestGameListUpdate.id} className="flex flex-row">
                <img
                  className="w-11.25 h-18.75 border border-black object-cover"
                  src={
                    latestGameListUpdate.game_cover_image
                      ? `${getIGDBImageURL(latestGameListUpdate.game_cover_image, IGDBImageSize.THUMB_90_90)}`
                      : GameCoverImagePlaceholder
                  }
                  alt={`game cover ${latestGameListUpdate.id}`}
                />
                <div className="flex flex-col pl-2">
                  <div className="flex flex-row">
                    <p>Title:</p>
                    <p className="ml-2">{latestGameListUpdate.title}</p>
                  </div>
                  <div className="flex flex-row">
                    <p>Status:</p>
                    <p className="ml-2">{latestGameListUpdate.status}</p>
                  </div>
                  <div className="flex flex-row">
                    <p>Score:</p>
                    <p className="ml-2">{latestGameListUpdate.score ? latestGameListUpdate.score : "-"}</p>
                  </div>
                  <div className="flex flex-row">
                    <p>Update date:</p>
                    <p className="ml-2">
                      {new Date(
                        latestGameListUpdate?.last_modified_at ? latestGameListUpdate.last_modified_at : "",
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
