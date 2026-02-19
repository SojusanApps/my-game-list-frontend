import * as React from "react";

import AppLogo from "@/components/ui/AppLogo";
import LoginForm from "../components/LoginForm";
import { PageMeta } from "@/components/ui/PageMeta";
import { Box, Flex, Stack, Text } from "@mantine/core";

export default function LoginPage(): React.JSX.Element {
  return (
    <Flex
      style={{ minHeight: "calc(100vh - 64px)", overflow: "hidden" }}
      align="center"
      justify="center"
      pos="relative"
    >
      <PageMeta title="Login" />
      <Box
        style={{
          width: "100%",
          maxWidth: "448px",
          padding: "32px",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(16px)",
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.5)",
          animation: "fade-in 500ms ease",
        }}
      >
        <Stack gap={8} mb="lg">
          <AppLogo size="lg" />
          <Text ta="center" c="var(--color-text-500)">
            Welcome back! Please login to your account.
          </Text>
        </Stack>
        <LoginForm />
      </Box>
    </Flex>
  );
}
