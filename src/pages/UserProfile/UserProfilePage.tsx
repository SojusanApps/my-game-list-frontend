import * as React from "react";

import { useParams } from "react-router-dom";

import GameCoverImagePlaceholder from "../../assets/images/Image_Placeholder.svg";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { UserType } from "../../models/User";

export default function UserProfilePage(): React.JSX.Element {
  const { id } = useParams();
  const [userDetails, setUserDetails] = React.useState<UserType | null>(null);
  const axiosPrivate = useAxiosPrivate();

  React.useEffect(() => {
    const fetchUserData = async () => {
      const response = await axiosPrivate.get(`/user/users/${id}`);
      if (response.status === 200) {
        setUserDetails(response.data);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-4 divide-x-2 divide-gray-300 max-w-[60%] mx-auto">
        <div className="flex flex-col pr-1 gap-2">
          <img
            className="border-[1px] flex-none border-black mx-auto"
            src={userDetails?.avatar ? `${userDetails.avatar}` : GameCoverImagePlaceholder}
            alt="User avatar"
          />
          <button type="button" className="bg-primary-950 text-white p-2 rounded-lg mx-auto">
            Add Friend
          </button>
          <a href={`/game-list/${userDetails?.id}`} className="mx-auto">
            <button type="button" className="bg-primary-950 text-white p-2 rounded-lg">
              Game List
            </button>
          </a>
          <div>
            <p className="font-bold">Information</p>
            <div className="flex flex-col border-[1px] border-black p-2 gap-1">
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
              <a key={friend.id} href={`${friend.id}`}>
                <img
                  className="w-[45px] h-[75px] border-[1px] border-black object-cover"
                  src={friend.avatar ? `${friend.avatar}` : GameCoverImagePlaceholder}
                  alt={`friend avatar ${friend.id}`}
                />
              </a>
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
                  className="w-[45px] h-[75px] border-[1px] border-black object-cover"
                  src={
                    latestGameListUpdate.game_cover_image
                      ? `${latestGameListUpdate.game_cover_image}`
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
