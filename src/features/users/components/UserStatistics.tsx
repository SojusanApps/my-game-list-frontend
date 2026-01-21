import * as React from "react";
import { UserDetail } from "@/client";
import { Button } from "@/components/ui/Button";

interface UserStatisticsProps {
  userDetails?: UserDetail;
}

export default function UserStatistics({ userDetails }: Readonly<UserStatisticsProps>) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Status Breakdown Card */}
        <div className="md:col-span-2 flex flex-col gap-3.5 p-5 bg-background-200/50 rounded-2xl border border-background-300/50 shadow-xs">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-success-500 shadow-glow-success" />
              <span className="text-text-500 font-semibold">Currently Playing</span>
            </div>
            <span className="font-bold text-text-900">{userDetails?.game_list_statistics.playing}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-secondary-400 shadow-glow-secondary" />
              <span className="text-text-500 font-semibold">On Hold</span>
            </div>
            <span className="font-bold text-text-900">{userDetails?.game_list_statistics.on_hold}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-error-500 shadow-glow-error" />
              <span className="text-text-500 font-semibold">Dropped</span>
            </div>
            <span className="font-bold text-text-900">{userDetails?.game_list_statistics.dropped}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-primary-500 shadow-glow-primary" />
              <span className="text-text-500 font-semibold">Completed</span>
            </div>
            <span className="font-bold text-text-900">{userDetails?.game_list_statistics.completed}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-background-400 shadow-glow-background" />
              <span className="text-text-500 font-semibold">Plan To Play</span>
            </div>
            <span className="font-bold text-text-900">{userDetails?.game_list_statistics.plan_to_play}</span>
          </div>
        </div>

        {/* Total Entries Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-success-100/50 rounded-2xl border border-success-200/50 shadow-xs transition-transform hover:scale-[1.02]">
          <p className="text-[11px] font-bold text-success-700 uppercase tracking-widest mb-2">Total Entries</p>
          <p className="text-4xl font-black text-success-900">{userDetails?.game_list_statistics.total}</p>
        </div>

        {/* Mean Score Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-primary-100/50 rounded-2xl border border-primary-200/50 shadow-xs transition-transform hover:scale-[1.02]">
          <p className="text-[11px] font-bold text-primary-700 uppercase tracking-widest mb-2">Mean Score</p>
          <p className="text-4xl font-black text-primary-900">
            {userDetails?.game_list_statistics.mean_score?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>

      <Button variant="ghost" size="sm" className="mx-auto text-text-400 hover:text-primary-600">
        More statistics
      </Button>
    </div>
  );
}
