import * as React from "react";
import { UserDetail } from "@/client";

interface UserStatisticsProps {
  userDetails?: UserDetail;
}

export default function UserStatistics({ userDetails }: UserStatisticsProps) {
  return (
    <div>
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
    </div>
  );
}
