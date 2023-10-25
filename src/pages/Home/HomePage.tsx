import * as React from "react";

import TopBar from "../../components/TopBar/TopBar";

export default function HomePage(): React.JSX.Element {
  return (
    <div>
      <TopBar />
      <div className="pt-20">
        <h1>HomePage</h1>
      </div>
    </div>
  );
}
