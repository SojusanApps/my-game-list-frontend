import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mantine/core";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";

const Layout = (): React.JSX.Element => {
  return (
    <Box style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <TopBar />
      <Box component="main" style={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
