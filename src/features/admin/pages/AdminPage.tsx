import * as React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("admin");
  const { data: apiVersionData, isLoading } = useGetApiVersion();

  return (
    <Stack gap={40} maw={1280} mx="auto" px={16} w="100%" style={{ flexGrow: 1 }}>
      <PageMeta title={t("page.title")} />
      <Stack gap={8}>
        <Title order={2}>{t("page.title")}</Title>
        <Text c="dimmed">{t("page.subtitle")}</Text>
      </Stack>
      <Stack gap={16}>
        <Title order={4}>{t("versions")}</Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <VersionCard label={t("apiVersion")} value={apiVersionData?.version} isLoading={isLoading} />
          <VersionCard label={t("uiVersion")} value={uiVersion} />
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
