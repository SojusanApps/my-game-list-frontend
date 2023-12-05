import * as React from "react";

import GameCoverImagePlaceholder from "../../assets/images/Image_Placeholder.svg";
import TopBar from "../../components/TopBar/TopBar";

export default function UserProfilePage(): React.JSX.Element {
  return (
    <div>
      <TopBar />
      <div className="grid grid-cols-4 divide-x-2 divide-gray-300 max-w-[60%] pt-20 mx-auto">
        <div className="flex flex-col pr-1 gap-2">
          <img
            className="border-[1px] flex-none border-black mx-auto"
            src={GameCoverImagePlaceholder}
            alt="User avatar"
          />
          <button type="button" className="bg-primary-950 text-white p-2 rounded-lg mx-auto">
            Add Friend
          </button>
          <button type="button" className="bg-primary-950 text-white p-2 rounded-lg mx-auto">
            Game List
          </button>
          <div>
            <p className="font-bold">Information</p>
            <div className="flex flex-col border-[1px] border-black p-2 gap-1">
              <div className="flex flex-row">
                <p className="font-bold">Joined:</p>
                <p className="ml-2">31.12.9999</p>
              </div>
              <div className="flex flex-row">
                <p className="font-bold">Gender:</p>
                <p className="ml-2">Female</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 border-b-2 border-b-primary-950">
            <p className="font-bold">Friends</p>
            <p className="font-bold text-secondary-950 text-right">All</p>
          </div>
          <div className="flex flex-row flex-wrap gap-1 pl-2">
            <img
              className="w-[45px] h-[75px] border-[1px] border-black object-cover"
              src={GameCoverImagePlaceholder}
              alt="User avatar"
            />
            <img
              className="w-[45px] h-[75px] border-[1px] border-black object-cover"
              src={GameCoverImagePlaceholder}
              alt="User avatar"
            />
            <img
              className="w-[45px] h-[75px] border-[1px] border-black object-cover"
              src={GameCoverImagePlaceholder}
              alt="User avatar"
            />
            <img
              className="w-[45px] h-[75px] border-[1px] border-black object-cover"
              src={GameCoverImagePlaceholder}
              alt="User avatar"
            />
            <img
              className="w-[45px] h-[75px] border-[1px] border-black object-cover"
              src={GameCoverImagePlaceholder}
              alt="User avatar"
            />
            <img
              className="w-[45px] h-[75px] border-[1px] border-black object-cover"
              src={GameCoverImagePlaceholder}
              alt="User avatar"
            />
            <img
              className="w-[45px] h-[75px] border-[1px] border-black object-cover"
              src={GameCoverImagePlaceholder}
              alt="User avatar"
            />
            <img
              className="w-[45px] h-[75px] border-[1px] border-black object-cover"
              src={GameCoverImagePlaceholder}
              alt="User avatar"
            />
            <img
              className="w-[45px] h-[75px] border-[1px] border-black object-cover"
              src={GameCoverImagePlaceholder}
              alt="User avatar"
            />
          </div>
        </div>
        <div className="col-span-3 flex flex-col pl-1 divide-y-2 divide-gray-300  ">
          <p className="font-bold text-xl">Username Placeholder</p>
          <p className="font-bold pt-1">Statistics</p>
          <div className="flex flex-col pb-1">
            <div className="grid grid-cols-4 pt-2">
              <div className="flex flex-col col-span-2 gap-1 pl-4">
                <div className="flex flex-row">
                  <p className="font-bold">Currently Playing:</p>
                  <p className="text-right ml-2">999.999.999</p>
                </div>
                <div className="flex flex-row">
                  <p className="font-bold">On Hold:</p>
                  <p className="ml-2">999.999.999</p>
                </div>
                <div className="flex flex-row">
                  <p className="font-bold">Dropped:</p>
                  <p className="ml-2">999.999.999</p>
                </div>
                <div className="flex flex-row">
                  <p className="font-bold">Completed:</p>
                  <p className="ml-2">999.999.999</p>
                </div>
                <div className="flex flex-row">
                  <p className="font-bold">Plan To Play:</p>
                  <p className="ml-2">999.999.999</p>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="bg-secondary-950 text-white font-bold mx-auto p-1">Total Entries</p>
                <p className="font-bold text-4xl mx-auto">999.999</p>
              </div>
              <div className="flex flex-col">
                <p className="bg-secondary-600 text-text-950 font-bold mx-auto p-1">Mean Score</p>
                <p className="font-bold text-4xl mx-auto">10.00</p>
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
            <div className="flex flex-row">
              <img
                className="w-[45px] h-[75px] border-[1px] border-black object-cover"
                src={GameCoverImagePlaceholder}
                alt="User avatar"
              />
              <div className="flex flex-col pl-2">
                <div className="flex flex-row">
                  <p>Title:</p>
                  <p className="ml-2">Game title placeholder</p>
                </div>
                <div className="flex flex-row">
                  <p>Status:</p>
                  <p className="ml-2">Plan to Play</p>
                </div>
                <div className="flex flex-row">
                  <p>Score:</p>
                  <p className="ml-2">10</p>
                </div>
                <div className="flex flex-row">
                  <p>Update date:</p>
                  <p className="ml-2">31.12.9999</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <img
                className="w-[45px] h-[75px] border-[1px] border-black object-cover"
                src={GameCoverImagePlaceholder}
                alt="User avatar"
              />
              <div className="flex flex-col pl-2">
                <div className="flex flex-row">
                  <p>Title:</p>
                  <p className="ml-2">Game title placeholder</p>
                </div>
                <div className="flex flex-row">
                  <p>Status:</p>
                  <p className="ml-2">Plan to Play</p>
                </div>
                <div className="flex flex-row">
                  <p>Score:</p>
                  <p className="ml-2">10</p>
                </div>
                <div className="flex flex-row">
                  <p>Update date:</p>
                  <p className="ml-2">31.12.9999</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <img
                className="w-[45px] h-[75px] border-[1px] border-black object-cover"
                src={GameCoverImagePlaceholder}
                alt="User avatar"
              />
              <div className="flex flex-col pl-2">
                <div className="flex flex-row">
                  <p>Title:</p>
                  <p className="ml-2">Game title placeholder</p>
                </div>
                <div className="flex flex-row">
                  <p>Status:</p>
                  <p className="ml-2">Plan to Play</p>
                </div>
                <div className="flex flex-row">
                  <p>Score:</p>
                  <p className="ml-2">10</p>
                </div>
                <div className="flex flex-row">
                  <p>Update date:</p>
                  <p className="ml-2">31.12.9999</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <img
                className="w-[45px] h-[75px] border-[1px] border-black object-cover"
                src={GameCoverImagePlaceholder}
                alt="User avatar"
              />
              <div className="flex flex-col pl-2">
                <div className="flex flex-row">
                  <p>Title:</p>
                  <p className="ml-2">Game title placeholder</p>
                </div>
                <div className="flex flex-row">
                  <p>Status:</p>
                  <p className="ml-2">Plan to Play</p>
                </div>
                <div className="flex flex-row">
                  <p>Score:</p>
                  <p className="ml-2">10</p>
                </div>
                <div className="flex flex-row">
                  <p>Update date:</p>
                  <p className="ml-2">31.12.9999</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <img
                className="w-[45px] h-[75px] border-[1px] border-black object-cover"
                src={GameCoverImagePlaceholder}
                alt="User avatar"
              />
              <div className="flex flex-col pl-2">
                <div className="flex flex-row">
                  <p>Title:</p>
                  <p className="ml-2">Game title placeholder</p>
                </div>
                <div className="flex flex-row">
                  <p>Status:</p>
                  <p className="ml-2">Plan to Play</p>
                </div>
                <div className="flex flex-row">
                  <p>Score:</p>
                  <p className="ml-2">10</p>
                </div>
                <div className="flex flex-row">
                  <p>Update date:</p>
                  <p className="ml-2">31.12.9999</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <img
                className="w-[45px] h-[75px] border-[1px] border-black object-cover"
                src={GameCoverImagePlaceholder}
                alt="User avatar"
              />
              <div className="flex flex-col pl-2">
                <div className="flex flex-row">
                  <p>Title:</p>
                  <p className="ml-2">Game title placeholder</p>
                </div>
                <div className="flex flex-row">
                  <p>Status:</p>
                  <p className="ml-2">Plan to Play</p>
                </div>
                <div className="flex flex-row">
                  <p>Score:</p>
                  <p className="ml-2">10</p>
                </div>
                <div className="flex flex-row">
                  <p>Update date:</p>
                  <p className="ml-2">31.12.9999</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <img
                className="w-[45px] h-[75px] border-[1px] border-black object-cover"
                src={GameCoverImagePlaceholder}
                alt="User avatar"
              />
              <div className="flex flex-col pl-2">
                <div className="flex flex-row">
                  <p>Title:</p>
                  <p className="ml-2">Game title placeholder</p>
                </div>
                <div className="flex flex-row">
                  <p>Status:</p>
                  <p className="ml-2">Plan to Play</p>
                </div>
                <div className="flex flex-row">
                  <p>Score:</p>
                  <p className="ml-2">10</p>
                </div>
                <div className="flex flex-row">
                  <p>Update date:</p>
                  <p className="ml-2">31.12.9999</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
