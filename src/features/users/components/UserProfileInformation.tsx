import * as React from "react";
import { UserDetail } from "@/client";

interface UserProfileInformationProps {
  userDetails?: UserDetail;
}

export default function UserProfileInformation({ userDetails }: UserProfileInformationProps) {
  return (
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
          <p className="ml-2">{new Date(userDetails?.last_login ? userDetails.last_login : "").toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
