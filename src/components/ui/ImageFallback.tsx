import React from "react";
import { Stack, Text } from "@mantine/core";
import AppLogo from "./AppLogo";

interface ImageFallbackProps {
  className?: string;
}

export function ImageFallback({ className }: Readonly<ImageFallbackProps>) {
  return (
    <Stack
      align="center"
      justify="center"
      w="100%"
      h="100%"
      p={8}
      bg="var(--color-background-100)"
      c="var(--color-text-500)"
      className={className}
    >
      <AppLogo size="sm" />
      <Text component="span" fz="lg" fw={500} tt="uppercase" mt={4} style={{ letterSpacing: "0.1em", opacity: 0.7 }}>
        No Image
      </Text>
    </Stack>
  );
}
