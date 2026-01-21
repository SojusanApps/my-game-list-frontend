import * as React from "react";
import { UserDetail } from "@/client";

interface UserProfileInformationProps {
  userDetails?: UserDetail;
}

export default function UserProfileInformation({ userDetails }: Readonly<UserProfileInformationProps>) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-background-200 overflow-hidden">
      <div className="bg-background-50 px-4 py-3 border-b border-background-200">
        <p className="font-semibold text-text-900">Information</p>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex flex-row justify-between text-sm">
          <p className="font-medium text-text-600">Joined:</p>
          <p className="text-text-900">
            {new Date(userDetails?.date_joined ? userDetails.date_joined : "").toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-row justify-between text-sm">
          <p className="font-medium text-text-600">Gender:</p>
          <p className="text-text-900">Private</p>
        </div>
        <div className="flex flex-row justify-between text-sm">
          <p className="font-medium text-text-600">Last login:</p>
          <p className="text-text-900">
            {new Date(userDetails?.last_login ? userDetails.last_login : "").toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
