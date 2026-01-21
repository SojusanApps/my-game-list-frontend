import * as React from "react";
import { UserDetail, StatusEnum } from "@/client";
import { Button } from "@/components/ui/Button";
import { getStatusConfig } from "@/features/games/utils/statusConfig";

interface UserStatisticsProps {
  userDetails?: UserDetail;
}

export default function UserStatistics({ userDetails }: Readonly<UserStatisticsProps>) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Status Breakdown Card */}
        <div className="md:col-span-2 flex flex-col gap-3.5 p-5 bg-background-200/50 rounded-2xl border border-background-300/50 shadow-xs">
          {[
            { key: StatusEnum.P, label: "Currently Playing", count: userDetails?.game_list_statistics.playing },
            { key: StatusEnum.OH, label: "On Hold", count: userDetails?.game_list_statistics.on_hold },
            { key: StatusEnum.D, label: "Dropped", count: userDetails?.game_list_statistics.dropped },
            { key: StatusEnum.C, label: "Completed", count: userDetails?.game_list_statistics.completed },
            { key: StatusEnum.PTP, label: "Plan To Play", count: userDetails?.game_list_statistics.plan_to_play },
          ].map(({ key, label, count }) => {
            const config = getStatusConfig(key);
            return (
              <div key={key} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{config?.emoji}</span>
                  <span className="text-text-500 font-semibold">{label}</span>
                </div>
                <span className="font-bold text-text-900">{count}</span>
              </div>
            );
          })}
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
