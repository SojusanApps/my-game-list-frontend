import * as React from "react";
import { Box, Group, Stack, Text } from "@mantine/core";
import { UserDetail } from "@/client";

interface UserProfileInformationProps {
  userDetails?: UserDetail;
}

export default function UserProfileInformation({ userDetails }: Readonly<UserProfileInformationProps>) {
  return (
    <Box
      style={{
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid var(--color-background-200)",
        overflow: "hidden",
      }}
    >
      <Box
        style={{
          background: "var(--color-background-50)",
          padding: "12px 16px",
          borderBottom: "1px solid var(--color-background-200)",
        }}
      >
        <Text fw={600} c="var(--color-text-900)">
          Information
        </Text>
      </Box>
      <Stack gap={12} p={16}>
        <Group justify="space-between" fz="sm">
          <Text fw={500} c="var(--color-text-600)">
            Joined:
          </Text>
          <Text c="var(--color-text-900)">
            {new Date(userDetails?.date_joined ? userDetails.date_joined : "").toLocaleDateString()}
          </Text>
        </Group>
        <Group justify="space-between" fz="sm">
          <Text fw={500} c="var(--color-text-600)">
            Gender:
          </Text>
          <Text c="var(--color-text-900)">Private</Text>
        </Group>
        <Group justify="space-between" fz="sm">
          <Text fw={500} c="var(--color-text-600)">
            Last login:
          </Text>
          <Text c="var(--color-text-900)">
            {new Date(userDetails?.last_login ? userDetails.last_login : "").toLocaleDateString()}
          </Text>
        </Group>
      </Stack>
    </Box>
  );
}
