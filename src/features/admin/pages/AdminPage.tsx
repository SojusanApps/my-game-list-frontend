import * as React from "react";
import { PageMeta } from "@/components/ui/PageMeta";
import { Paper, SimpleGrid, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useGetApiVersion } from "../hooks/adminQueries";
import { version as uiVersion } from "../../../../package.json";

function VersionCard({
  label,
  value,
  isLoading,
}: Readonly<{ label: string; value: string | undefined; isLoading?: boolean }>): React.JSX.Element {
  return (
    <Paper withBorder p="xl" radius="md">
      <Text fz="sm" tt="uppercase" fw={700} c="dimmed" mb={4}>
        {label}
      </Text>
      <Skeleton visible={!!isLoading} width="auto">
        <Text fz="xl" fw={700}>
          {value ?? "—"}
        </Text>
      </Skeleton>
    </Paper>
  );
}

export default function AdminPage(): React.JSX.Element {
  const { data: apiVersionData, isLoading } = useGetApiVersion();

  return (
    <Stack gap={40} maw={1280} mx="auto" px={16} w="100%" style={{ flexGrow: 1 }}>
      <PageMeta title="Admin Panel" />
      <Stack gap={8}>
        <Title order={2}>Admin Panel</Title>
        <Text c="dimmed">System information and administration tools.</Text>
      </Stack>
      <Stack gap={16}>
        <Title order={4}>Versions</Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <VersionCard label="API Version" value={apiVersionData?.version} isLoading={isLoading} />
          <VersionCard label="UI Version" value={uiVersion} />
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
