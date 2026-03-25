import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Box, Text } from "@mantine/core";
import { PageMeta } from "@/components/ui/PageMeta";

export default function StartPage(): React.JSX.Element {
  return (
    <Box style={{ background: "#cbd5e1", maxWidth: "100%", padding: "16px" }}>
      <PageMeta title="Welcome" />
      <Text>Welcome to MyGameList Temporary Start Page - Early access!</Text>
      <Text>
        Log in:{" "}
        <Link to="/login" style={{ color: "#3b82f6" }}>
          here
        </Link>
      </Text>
      <Text>
        Register:{" "}
        <Link to="/register" style={{ color: "#3b82f6" }}>
          here
        </Link>
      </Text>
      <Text>
        Home:{" "}
        <Link to="/home" style={{ color: "#3b82f6" }}>
          here
        </Link>
      </Text>
    </Box>
  );
}
