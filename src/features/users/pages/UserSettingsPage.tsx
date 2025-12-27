import * as React from "react";
import { PageMeta } from "@/components/ui/PageMeta";

export default function UserProfilePage(): React.JSX.Element {
  return (
    <div>
      <PageMeta title="Settings" />
      <h2 className="text-center text-9xl font-bold">Settings</h2>
    </div>
  );
}
