import * as React from "react";
import { Box, Title } from "@mantine/core";
import { PageMeta } from "@/components/ui/PageMeta";

export default function UserProfilePage(): React.JSX.Element {
  return (
    <Box>
      <PageMeta title="Settings" />
      <Title order={2} className="text-center text-9xl font-bold">
        Settings
      </Title>
    </Box>
  );
}
