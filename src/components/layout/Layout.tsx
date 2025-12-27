import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "@/components/layout/TopBar";

const Layout = (): React.JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
